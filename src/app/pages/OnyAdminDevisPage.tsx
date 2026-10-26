import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fetchProducts } from '../../lib/products';
import QuotePreparation from '../components/devis/QuotePreparation';
import ProductPicker from '../components/devis/ProductPicker';
import type { OnyItem } from '../../constants/ony_interfaces';

type Request = { id:string;created_at:string;nom:string;telephone:string;email:string;type_evenement:string|null;total:number|null;message:string|null;items:unknown };
type Quote = {id:string;numero:string|null;statut:string;total_commercial:number;created_at:string;client:{nom:string}|null};
type Detail={id:string;numero:string|null;statut:string;created_at:string;type_evenement:string|null;date_evenement:string|null;lieu_evenement:string|null;montant_articles:number;montant_prestations:number;frais_livraison:number;remise:number;caution:number;total_commercial:number;acompte_requis:number;notes:string|null;client:{nom:string;telephone:string;email:string}|null;lignes:Array<{id:string;designation:string;quantite:number;prix_unitaire:number;montant:number}>};
const money=(n:number)=>Number(n??0).toLocaleString('fr-FR')+' FCFA';
type RequestLine={id?:string;nom?:string;quantite?:number;prixUnitaire?:number;categorie?:string};
function requestLines(value:unknown):RequestLine[] {
 if(!Array.isArray(value))return [];
 return value.filter((v):v is RequestLine=>typeof v==='object'&&v!==null).map(v=>({
  id:typeof v.id==='string'?v.id:undefined,
  nom:typeof v.nom==='string'?v.nom:undefined,
  categorie:typeof v.categorie==='string'?v.categorie:undefined,
  quantite:typeof v.quantite==='number'?v.quantite:undefined,
  prixUnitaire:typeof v.prixUnitaire==='number'?v.prixUnitaire:undefined
 }));
}
async function api(action:string,payload:Record<string,unknown>={}) {
 const {data,error}=await supabase.functions.invoke('ony-admin-devis',{body:{action,...payload}});
 if(error) {
   const response = (error as { context?: Response }).context;
   let serverMessage = '';
   if (response && typeof response.json === 'function') {
     try { const body = await response.json(); serverMessage = String(body?.error ?? ''); } catch { /* réponse non JSON */ }
   }
   throw new Error(serverMessage || 'Le service est momentanément indisponible. Veuillez réessayer.');
 }
 if (data?.error) throw new Error(String(data.error));
 return data;
}
export default function OnyAdminDevisPage(){
 const [session,setSession]=useState(false);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [tab,setTab]=useState<'requests'|'quotes'>('requests');
 const [requests,setRequests]=useState<Request[]>([]);
 const [quotes,setQuotes]=useState<Quote[]>([]);
 const [detail,setDetail]=useState<Detail|null>(null);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [signing,setSigning]=useState(false);
 const [creating,setCreating]=useState(false);
 const [products,setProducts]=useState<OnyItem[]>([]);
 const [nom,setNom]=useState('');
 const [telephone,setTelephone]=useState('');
 const [clientEmail,setClientEmail]=useState('');
 const [eventDate,setEventDate]=useState('');
 const [eventType,setEventType]=useState('');
 const [eventPlace,setEventPlace]=useState('');
 const [productId,setProductId]=useState('');
 const [quantity,setQuantity]=useState(1);
 const [lines,setLines]=useState<Array<{product_id:string;quantity:number}>>([]);
 const [saving,setSaving]=useState(false);
 const [prepareTarget,setPrepareTarget]=useState<{requestId?:string;quoteId?:string;initialLines:Array<{product_id:string;quantity:number}>;services?:number;delivery?:number;discount?:number;security?:number;notes?:string}|null>(null);
 async function load(){
   setLoading(true);setError('');
   try {
     const result=await api(tab);
     if(tab==='requests')setRequests(result.data??[]);
     else setQuotes(result.data??[]);
   }catch(e){setError(e instanceof Error ? e.message : 'Impossible de charger les devis.');}
   finally{setLoading(false);}
 }
 useEffect(()=>{
   supabase.auth.getSession().then(({data})=>{setSession(Boolean(data.session));setLoading(false);});
   const {data:listener}=supabase.auth.onAuthStateChange((_event,s)=>setSession(Boolean(s)));
   return ()=>listener.subscription.unsubscribe();
 },[]);
 useEffect(()=>{if(session)void load();},[session,tab]);
 useEffect(()=>{if(session)void fetchProducts().then(setProducts).catch(()=>setError('Catalogue indisponible'));},[session]);
 function addLine(){
 if(!productId||!Number.isInteger(quantity)||quantity<1||quantity>9999||lines.length>=50)return;
 setLines(old=>{const current=old.find(x=>x.product_id===productId);if(current){const q=current.quantity+quantity;return q>9999?old:old.map(x=>x.product_id===productId?{...x,quantity:q}:x);}return [...old,{product_id:productId,quantity}];});
 setProductId('');setQuantity(1);
 }
 async function createQuote(e:React.FormEvent){
   e.preventDefault();
   if(lines.length===0){setError('Ajoutez au moins un article.');return;}
   setSaving(true);setError('');
   try {
     const result=await api('create',{nom,telephone,email:clientEmail,type_evenement:eventType,date_evenement:eventDate||null,lieu_evenement:eventPlace,lines});
     setCreating(false);setTab('quotes');setNom('');setTelephone('');setClientEmail('');setProductId('');setQuantity(1);setLines([]);
     await load();
     if(result.id)await show(result.id);
   }catch{setError('Création impossible : vérifiez les données ou les droits administrateur.');}
   finally{setSaving(false);}
 }
 async function savePreparation(values:{lines:Array<{product_id:string;quantity:number}>;services:number;delivery:number;discount:number;security:number;notes:string}){
  if(!prepareTarget)throw new Error('Sélectionnez une demande ou un devis.');
  const result=await api('prepare',{request_id:prepareTarget.requestId,quote_id:prepareTarget.quoteId,...values});
  setPrepareTarget(null);setDetail(null);setTab('quotes');
  const newList=await api('quotes');setQuotes(newList.data??[]);
  if(result.id)await show(result.id);
 }
 async function issueQuote(){
  if(!detail||!window.confirm('Numéroter et figer ce devis ? Cette action est définitive et ne réserve pas le stock.'))return;
  setError('');
  try{await api('issue',{id:detail.id});await show(detail.id);const result=await api('quotes');setQuotes(result.data??[])}
  catch(e){setError(e instanceof Error?e.message:'Impossible de numéroter le devis.');}
 }
 async function editQuote(){
  if(!detail)return;
  const expanded=detail as Detail & {lignes:Array<{produit_id:string|null;quantite:number}>};
  if(expanded.lignes.some(line=>!line.produit_id)){setError('Ce devis contient un article supprimé du catalogue.');return;}
  setPrepareTarget({quoteId:detail.id,initialLines:expanded.lignes.map(line=>({product_id:line.produit_id!,quantity:line.quantite})),services:detail.montant_prestations,delivery:detail.frais_livraison,discount:detail.remise,security:detail.caution,notes:detail.notes??''});
 }
 async function login(e:React.FormEvent){
   e.preventDefault();setSigning(true);setError('');
   const {error}=await supabase.auth.signInWithPassword({email,password});
   if(error)setError('Connexion impossible. Vérifiez vos identifiants.');
   setSigning(false);setPassword('');
 }
 async function show(id:string){
  setError('');
  try{const result=await api('detail',{id});setDetail(result.data as Detail);}
  catch{setError('Détail indisponible.');}
 }
 return <main className="min-h-screen bg-[#f7f4ef] text-slate-900 p-4 md:p-10">
  <div className="mx-auto max-w-6xl">
   <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
    <div><p className="uppercase tracking-[.35em] text-amber-700 font-semibold">ONY · Administration</p><h1 className="text-3xl font-semibold mt-2">Gestion des devis</h1></div>
    {session&&<button onClick={()=>void supabase.auth.signOut()} className="border rounded-lg px-4 py-2">Déconnexion</button>}
   </header>
   {!session?<form onSubmit={login} className="bg-white shadow-sm rounded-xl p-6 max-w-md grid gap-4">
    <h2 className="font-semibold text-xl">Connexion administrateur</h2>
    <label>Email<input required id="ony-admin-login-email" name="email" autoComplete="username" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded p-3"/></label>
    <label>Mot de passe<input required id="ony-admin-login-password" name="password" autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded p-3"/></label>
    <button disabled={signing} className="bg-amber-700 text-white rounded p-3">{signing?'Connexion…':'Se connecter'}</button>
   </form>:<>
    <div className="mb-4 flex justify-end"><button className="rounded-lg bg-amber-700 text-white px-4 py-2" onClick={()=>setCreating(x=>!x)}>{creating?'Fermer':'Créer un devis'}</button></div>
    {creating&&<form onSubmit={createQuote} className="bg-white rounded-xl shadow-sm p-5 mb-5 grid gap-4">
      <h2 className="text-xl font-semibold">Création manuelle — brouillon</h2><p className="text-sm text-slate-500">1. Coordonnées du client · 2. Articles · 3. Vérification du montant</p>
      <div className="grid gap-3 md:grid-cols-3">
        <label>Nom du client<input id="ony-quote-client-name" name="client_name" autoComplete="name" required maxLength={120} className="mt-1 w-full border rounded p-2" value={nom} onChange={e=>setNom(e.target.value)}/></label>
        <label>Téléphone<input id="ony-quote-client-phone" name="client_phone" autoComplete="tel" required className="mt-1 w-full border rounded p-2" value={telephone} onChange={e=>setTelephone(e.target.value)}/></label>
        <label>Email<input id="ony-quote-client-email" name="client_email" autoComplete="email" required type="email" className="mt-1 w-full border rounded p-2" value={clientEmail} onChange={e=>setClientEmail(e.target.value)}/></label>
        <label>Type d'événement<input id="ony-quote-event-type" name="event_type" className="mt-1 w-full border rounded p-2" value={eventType} onChange={e=>setEventType(e.target.value)}/></label>
        <label>Date de l'événement<input id="ony-quote-event-date" name="event_date" type="date" className="mt-1 w-full border rounded p-2" value={eventDate} onChange={e=>setEventDate(e.target.value)}/></label>
        <label>Lieu<input id="ony-quote-event-place" name="event_place" className="mt-1 w-full border rounded p-2" value={eventPlace} onChange={e=>setEventPlace(e.target.value)}/></label>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px] items-end">
       <div className="md:col-span-1"><ProductPicker id="ony-manual-product" products={products} value={productId} onChange={setProductId}/></div>
       <label>Quantité<input id="ony-quote-quantity" name="quantity" required type="number" min="1" max="9999" className="mt-1 w-full border rounded p-2" value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
      </div>
      <button type="button" onClick={addLine} disabled={!productId||lines.length>=50} className="border rounded-lg p-2 text-amber-800">Ajouter l'article</button>
      {lines.length>0&&<div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th>Article</th><th>Quantité</th><th>Montant indicatif</th><th></th></tr></thead><tbody>{lines.map(line=>{const product=products.find(p=>p.id===line.product_id);return <tr key={line.product_id} className="border-t"><td className="p-2">{product?.nom??line.product_id}</td><td className="p-2">{line.quantity}</td><td className="p-2">{money(line.quantity*(product?.prix??0))}</td><td><button type="button" className="underline text-red-700" onClick={()=>setLines(old=>old.filter(x=>x.product_id!==line.product_id))}>Retirer</button></td></tr>})}</tbody></table><p className="text-right font-semibold">Estimation : {money(lines.reduce((sum,line)=>sum+line.quantity*(products.find(p=>p.id===line.product_id)?.prix??0),0))}</p></div>}
      <p className="text-sm text-slate-500">Les prix sont vérifiés automatiquement lors de l’enregistrement. Le brouillon ne réserve pas de matériel.</p>
      <button disabled={saving||lines.length===0} type="submit" className="rounded-lg bg-amber-700 disabled:opacity-50 text-white p-3">{saving?'Enregistrement…':'Enregistrer le brouillon'}</button>
    </form>}
    {prepareTarget&&<QuotePreparation key={prepareTarget.quoteId??prepareTarget.requestId} title={prepareTarget.requestId?'Préparer la demande client':'Modifier le devis'} products={products} initialLines={prepareTarget.initialLines} initialAmounts={{services:prepareTarget.services??0,delivery:prepareTarget.delivery??0,discount:prepareTarget.discount??0,security:prepareTarget.security??0,notes:prepareTarget.notes??''}} onSave={savePreparation} onCancel={()=>setPrepareTarget(null)}/>}
    <nav aria-label="Navigation devis" className="flex gap-2 mb-5">
     <button onClick={()=>{setTab('requests');setDetail(null)}} className={`rounded-lg px-4 py-2 ${tab==='requests'?'bg-amber-700 text-white':'bg-white'}`}>Demandes clients</button>
     <button onClick={()=>{setTab('quotes');setDetail(null)}} className={`rounded-lg px-4 py-2 ${tab==='quotes'?'bg-amber-700 text-white':'bg-white'}`}>Devis préparés</button>
    </nav>
    {loading?<p role="status">Chargement…</p>:error?<p role="alert" className="bg-red-50 text-red-700 p-4 rounded-lg">{error} <button className="underline ml-3" onClick={()=>void load()}>Réessayer</button></p>:<section className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
     {tab==='requests'?<table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Client</th><th className="p-3">Événement</th><th className="p-3">Estimation</th><th className="p-3">Date</th></tr></thead><tbody>
      {requests.map(x=><tr key={x.id} className="border-b align-top"><td className="p-3"><strong>{x.nom}</strong><div className="text-sm">{x.email}</div><div className="text-sm">{x.telephone}</div></td><td className="p-3"><div>{x.type_evenement||'Non indiqué'}</div><button type="button" className="text-amber-800 underline text-sm mt-2" onClick={()=>setPrepareTarget({requestId:x.id,initialLines:requestLines(x.items).filter(line=>Boolean(line.id)&&Number.isInteger(line.quantite)&&Number(line.quantite)>0).map(line=>({product_id:line.id!,quantity:line.quantite!})),notes:x.message??''})}>Préparer un devis</button><details className="mt-2"><summary className="cursor-pointer text-amber-700">Voir les détails</summary><div className="mt-3 min-w-[360px] max-w-2xl rounded-lg border bg-stone-50 p-3">{x.message&&<p className="mb-3 whitespace-pre-wrap"><strong>Message : </strong>{x.message}</p>}{requestLines(x.items).length>0?<table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">Article</th><th className="py-2 text-right">Qté</th><th className="py-2 text-right">Prix unitaire</th><th className="py-2 text-right">Montant</th></tr></thead><tbody>{requestLines(x.items).map((line,i)=><tr key={line.id??i} className="border-b"><td className="py-2">{line.categorie&&<span className="text-slate-500">{line.categorie} · </span>}{line.nom??line.id??'Article'}</td><td className="py-2 text-right">{line.quantite??'—'}</td><td className="py-2 text-right">{line.prixUnitaire==null?'—':money(line.prixUnitaire)}</td><td className="py-2 text-right">{line.quantite==null||line.prixUnitaire==null?'—':money(line.quantite*line.prixUnitaire)}</td></tr>)}</tbody></table>:<p className="text-sm text-slate-500">Aucun article détaillé dans cette demande.</p>}</div></details></td><td className="p-3 whitespace-nowrap">{x.total==null?'À chiffrer':money(x.total)}</td><td className="p-3 whitespace-nowrap">{new Date(x.created_at).toLocaleDateString('fr-FR')}</td></tr>)}
     </tbody></table>:<table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Numéro</th><th className="p-3">Client</th><th className="p-3">Statut</th><th className="p-3">Total</th><th className="p-3">Action</th></tr></thead><tbody>
      {quotes.map(x=><tr key={x.id} className="border-b"><td className="p-3">{x.numero??'Brouillon'}</td><td className="p-3">{x.client?.nom??'—'}</td><td className="p-3">{x.statut}</td><td className="p-3">{Number(x.total_commercial).toLocaleString('fr-FR')} FCFA</td><td className="p-3"><button className="underline text-amber-700" onClick={()=>void show(x.id)}>Voir le détail</button></td></tr>)}
     </tbody></table>}
     {(tab==='requests'?requests:quotes).length===0&&<p className="p-3 text-slate-500">Aucun enregistrement.</p>}
    </section>}
    {detail&&<section className="bg-white rounded-xl p-5 mt-5" aria-label="Fiche du devis">
      <div className="flex justify-between gap-3 items-center print:hidden"><h2 className="font-semibold text-xl">Fiche détaillée</h2><div className="flex gap-3">{(detail.statut==='brouillon'||detail.statut==='en_preparation')&&<button type="button" className="underline text-amber-800" onClick={()=>void editQuote()}>Modifier</button>}{(detail.statut==='brouillon'||detail.statut==='en_preparation')&&<button type="button" className="rounded bg-amber-700 text-white px-3 py-1" onClick={()=>void issueQuote()}>Numéroter le devis</button>}<button className="underline text-amber-800" onClick={()=>window.print()}>Imprimer / PDF</button><button onClick={()=>setDetail(null)} aria-label="Fermer le détail">✕</button></div></div>
      <style>{`@media print { body * { visibility: hidden !important; } #ony-quote-print, #ony-quote-print * { visibility: visible !important; } #ony-quote-print { position: absolute; inset: 0; width: 100%; padding: 12mm; background: white; } @page { size: A4; margin: 12mm; } }`}</style>
      <article id="ony-quote-print" className="p-4 md:p-8">
       <header className="flex justify-between border-b border-amber-700 pb-4"><div><p className="text-3xl font-bold text-amber-800">ONY</p><p>Location et décoration événementielle</p></div><div className="text-right"><h3 className="text-xl font-semibold">DEVIS {detail.statut==='envoye'?'— ÉMIS':'— BROUILLON'}</h3><p>{detail.numero??detail.id.slice(0,8)}</p><p>{new Date(detail.created_at).toLocaleDateString('fr-FR')}</p><p>{detail.statut}</p></div></header>
       <div className="grid md:grid-cols-2 gap-5 my-6"><div><h4 className="font-semibold text-amber-800">Client</h4><p>{detail.client?.nom??'—'}</p><p>{detail.client?.telephone}</p><p>{detail.client?.email}</p></div><div><h4 className="font-semibold text-amber-800">Événement</h4><p>{detail.type_evenement??'Non précisé'}</p><p>{detail.date_evenement??'Date à confirmer'}</p><p>{detail.lieu_evenement??'Lieu à confirmer'}</p></div></div>
       <table className="w-full text-left"><thead><tr className="border-y border-amber-700"><th className="p-2">Désignation</th><th className="p-2 text-right">Qté</th><th className="p-2 text-right">PU</th><th className="p-2 text-right">Montant</th></tr></thead><tbody>{(detail.lignes??[]).map(x=><tr key={x.id} className="border-b"><td className="p-2">{x.designation}</td><td className="p-2 text-right">{x.quantite}</td><td className="p-2 text-right">{money(x.prix_unitaire)}</td><td className="p-2 text-right">{money(x.montant)}</td></tr>)}</tbody></table>
       <div className="mt-6 ml-auto max-w-sm space-y-2"><div className="flex justify-between"><span>Articles</span><strong>{money(detail.montant_articles)}</strong></div><div className="flex justify-between"><span>Prestations</span><span>{money(detail.montant_prestations)}</span></div><div className="flex justify-between"><span>Livraison</span><span>{money(detail.frais_livraison)}</span></div><div className="flex justify-between"><span>Remise</span><span>− {money(detail.remise)}</span></div><div className="flex justify-between border-t pt-2 text-lg"><strong>Total commercial</strong><strong>{money(detail.total_commercial)}</strong></div><div className="flex justify-between"><span>Acompte prévu</span><span>{money(detail.acompte_requis)}</span></div><div className="flex justify-between"><span>Caution distincte</span><span>{money(detail.caution)}</span></div></div>
       {detail.notes&&<p className="mt-5">Observations : {detail.notes}</p>}
       <p className="mt-8 text-xs text-slate-500 border-t pt-3">Document de travail non validé, non contractuel. Disponibilité et conditions à confirmer par ONY.</p>
      </article>
    </section>}
   </>}
   {error&&!session&&<p role="alert" className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</p>}
  </div>
 </main>;
}
