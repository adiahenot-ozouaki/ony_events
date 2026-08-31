// Edge Function : validation + rate-limit + insertion sécurisée des demandes de devis.
// Déployer avec : supabase functions deploy submit-devis
// Secrets : SUPABASE_SERVICE_ROLE_KEY injecté automatiquement.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-().]{8,20}$/;
const MAX_NOM = 120;
const MAX_MESSAGE = 2000;
const MAX_TYPE = 80;
const MAX_ITEMS = 50;
const MAX_ITEM_NAME = 200;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_PER_IP = 8;

interface QuoteItem {
  id?: string;
  nom?: string;
  categorie?: string;
  quantite?: number;
  prixUnitaire?: number;
}

interface Body {
  nom?: string;
  telephone?: string;
  email?: string;
  type_evenement?: string | null;
  message?: string | null;
  items?: QuoteItem[];
  total?: number;
  societe_web?: string;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'JSON invalide' });
  }

  if (body.societe_web && String(body.societe_web).trim() !== '') {
    return json(200, { ok: true });
  }

  const nom = (body.nom ?? '').trim();
  const telephone = (body.telephone ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const typeEvenement = body.type_evenement ? String(body.type_evenement).trim() : null;
  const message = body.message ? String(body.message).trim() : null;
  const items = Array.isArray(body.items) ? body.items : [];
  const total = typeof body.total === 'number' && Number.isFinite(body.total) ? body.total : 0;

  if (!nom || nom.length > MAX_NOM) {
    return json(400, { error: 'Nom invalide' });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json(400, { error: 'Email invalide' });
  }
  if (!PHONE_RE.test(telephone)) {
    return json(400, { error: 'Téléphone invalide' });
  }
  if (typeEvenement && typeEvenement.length > MAX_TYPE) {
    return json(400, { error: "Type d'événement trop long" });
  }
  if (message && message.length > MAX_MESSAGE) {
    return json(400, { error: 'Message trop long' });
  }
  if (items.length > MAX_ITEMS) {
    return json(400, { error: "Trop d'articles" });
  }

  const cleanItems = items.slice(0, MAX_ITEMS).map((it) => ({
    id: String(it.id ?? '').slice(0, 64),
    nom: String(it.nom ?? '').slice(0, MAX_ITEM_NAME),
    categorie: String(it.categorie ?? '').slice(0, 80),
    quantite: Math.min(Math.max(Number(it.quantite) || 1, 1), 9999),
    prixUnitaire: Math.max(Number(it.prixUnitaire) || 0, 0),
  }));

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const ip = clientIp(req);

  try {
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from('devis_requests')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ip)
      .gte('created_at', since);

    if (typeof count === 'number' && count >= RATE_MAX_PER_IP) {
      return json(429, { error: 'Trop de demandes. Réessayez plus tard.' });
    }
  } catch {
    // Table sans colonne ip_hash : continuer sans rate-limit DB
  }

  const { error } = await supabase.from('devis_requests').insert({
    nom,
    telephone,
    email,
    type_evenement: typeEvenement,
    message,
    items: cleanItems,
    total,
    ip_hash: ip,
  });

  if (error) {
    if (error.message?.includes('ip_hash') || error.code === 'PGRST204') {
      const { error: err2 } = await supabase.from('devis_requests').insert({
        nom,
        telephone,
        email,
        type_evenement: typeEvenement,
        message,
        items: cleanItems,
        total,
      });
      if (err2) {
        console.error('insert error', err2);
        return json(500, { error: 'Erreur serveur' });
      }
      return json(200, { ok: true });
    }
    console.error('insert error', error);
    return json(500, { error: 'Erreur serveur' });
  }

  return json(200, { ok: true });
});
