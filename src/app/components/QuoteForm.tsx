import { useRef, useState, type FormEvent } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export interface QuoteFormItem {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
}

interface QuoteFormProps {
  title?: string;
  subtitle?: string;
  // Contenu du panier, envoyé et stocké avec la demande (facultatif : le
  // formulaire général de l'accueil n'en a pas besoin).
  items?: QuoteFormItem[];
  total?: number;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

// Délai minimum (ms) entre l'affichage du formulaire et sa soumission.
// Un bot qui remplit et envoie un formulaire en quelques centaines de
// millisecondes est très probablement automatisé — un humain met toujours
// plus de temps à lire les champs et à taper.
const MIN_SUBMIT_DELAY_MS = 2500;

export function QuoteForm({
  title = 'Demander un devis',
  subtitle = 'Partagez-nous les détails de votre événement et nous vous contacterons rapidement',
  items = [],
  total = 0,
}: QuoteFormProps) {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [typeEvenement, setTypeEvenement] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot : champ invisible pour un utilisateur humain (masqué en CSS,
  // exclu de l'ordre de tabulation) mais visible dans le DOM pour les bots
  // qui remplissent tous les champs d'un formulaire automatiquement. Un nom
  // volontairement "plausible" (plutôt que "honeypot") pour ne pas être
  // trivialement filtré par un bot un peu plus malin.
  const [societeWeb, setSocieteWeb] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const mountedAtRef = useRef(Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Piège à bots déclenché : on affiche un succès comme si tout allait
    // bien (pour ne pas indiquer au bot qu'il a été détecté) mais on
    // n'envoie rien à Supabase.
    const submittedTooFast = Date.now() - mountedAtRef.current < MIN_SUBMIT_DELAY_MS;
    if (societeWeb.trim() !== '' || submittedTooFast) {
      setStatus('success');
      return;
    }

    setStatus('loading');

    try {
      // Import dynamique : le client Supabase (~215 kB) n'est téléchargé
      // qu'au moment où quelqu'un soumet réellement le formulaire, au lieu
      // d'être chargé d'office avec la page d'accueil (qui inclut ce
      // formulaire) ou la page devis.
      //
      // Ce import() peut lui-même lever une exception si les variables
      // d'environnement Supabase sont absentes (voir le garde-fou dans
      // supabaseClient.ts) — d'où le try/catch englobant, pour ne pas
      // laisser le bouton bloqué sur "Envoi en cours..." indéfiniment.
      const { supabase } = await import('../../lib/supabaseClient');

      const { error } = await supabase.from('devis_requests').insert({
        nom,
        telephone,
        email,
        type_evenement: typeEvenement || null,
        message: message || null,
        items,
        total,
      });

      if (error) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setNom('');
      setTelephone('');
      setEmail('');
      setTypeEvenement('');
      setMessage('');
    } catch {
      // Config Supabase manquante, coupure réseau, ou toute autre erreur
      // inattendue avant même l'appel à l'API : on retombe sur le même
      // message d'erreur générique que pour un échec d'insertion.
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <section id="devis" className="py-24 bg-[var(--beige)]">
        <div className="max-w-[1440px] mx-auto px-20">
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-12 shadow-lg text-center">
            <CheckCircle2 size={48} className="text-[var(--gold)] mx-auto mb-4" />
            <h2 className="font-[var(--font-serif)] text-3xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Demande envoyée
            </h2>
            <p className="text-muted-foreground">
              Merci ! Nous avons bien reçu votre demande et nous vous recontactons rapidement.
            </p>
            <button
              onClick={() => {
                mountedAtRef.current = Date.now();
                setStatus('idle');
              }}
              className="mt-6 text-sm text-[var(--gold)] hover:underline"
            >
              Envoyer une nouvelle demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="devis" className="py-24 bg-[var(--beige)]">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-serif)] text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              {title}
            </h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-lg">
            {/* Champ honeypot : invisible et inatteignable pour un humain
                (hors écran, hors tabulation, ignoré des lecteurs d'écran),
                mais rempli par la plupart des bots de spam génériques. */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="societe_web">Site web</label>
              <input
                type="text"
                id="societe_web"
                name="societe_web"
                tabIndex={-1}
                autoComplete="off"
                value={societeWeb}
                onChange={(e) => setSocieteWeb(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm">Nom complet</label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Téléphone</label>
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  placeholder="+241 01 23 45 67"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm">Type d'événement</label>
              <select
                value={typeEvenement}
                onChange={(e) => setTypeEvenement(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Mariage">Mariage</option>
                <option value="Conférence">Conférence</option>
                <option value="Cérémonie">Cérémonie</option>
                <option value="Événement corporatif">Événement corporatif</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
                placeholder="Décrivez votre événement, le nombre d'invités, la date souhaitée..."
              />
            </div>

            {status === 'error' && (
              <div className="mb-6 flex items-start gap-2 text-sm text-destructive">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>
                  L'envoi a échoué. Réessayez, ou contactez-nous directement à contact@ony.fr.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[var(--gold)] text-white py-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
