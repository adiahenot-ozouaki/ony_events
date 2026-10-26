import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Request = { id:string;created_at:string;nom:string;telephone:string;email:string;type_evenement:string|null;total:number|null;message:string|null;items:unknown };
type Quote = {id:string;numero:string|null;statut:string;total_commercial:number;created_at:string;client:{nom:string}|null};
type Detail = Record<string,unknown>;
async function api(action:string,payload:Record<string,unknown>={}) {
 const {data,error}=await supabase.functions.invoke('ony-admin-devis',{body:{action,...payload}});
 if(error)throw error;
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
 async function load(){
   setLoading(true);setError('');
   try {
     const result=await api(tab);
     if(tab==='requests')setRequests(result.data??[]);
     else setQuotes(result.data??[]);
   }catch(e){setError('Accès refusé ou service indisponible. Vérifiez le rôle ONY de votre compte.');}
   finally{setLoading(false);}
 }
 useEffect(()=>{
   supabase.auth.getSession().then(({data})=>{setSession(Boolean(data.session));setLoading(false);});
   const {data:listener}=supabase.auth.onAuthStateChange((_event,s)=>setSession(Boolean(s)));
   return ()=>listener.subscription.unsubscribe();
 },[]);
 useEffect(()=>{if(session)void load();},[session,tab]);
 async function login(e:React.FormEvent){
   e.preventDefault();setSigning(true);setError('');
   const {error}=await supabase.auth.signInWithPassword({email,password});
   if(error)setError('Connexion impossible. Vérifiez vos identifiants.');
   setSigning(false);setPassword('');
 }
 async function show(id:string){
  setError('');
  try{const result=await api('detail',{id});setDetail(result.data);}
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
    <label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded p-3"/></label>
    <label>Mot de passe<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded p-3"/></label>
    <button disabled={signing} className="bg-amber-700 text-white rounded p-3">{signing?'Connexion…':'Se connecter'}</button>
   </form>:<>
    <nav aria-label="Navigation devis" className="flex gap-2 mb-5">
     <button onClick={()=>{setTab('requests');setDetail(null)}} className={`rounded-lg px-4 py-2 ${tab==='requests'?'bg-amber-700 text-white':'bg-white'}`}>Demandes clients</button>
     <button onClick={()=>{setTab('quotes');setDetail(null)}} className={`rounded-lg px-4 py-2 ${tab==='quotes'?'bg-amber-700 text-white':'bg-white'}`}>Devis préparés</button>
    </nav>
    {loading?<p role="status">Chargement…</p>:<section className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
     {tab==='requests'?<table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Client</th><th className="p-3">Événement</th><th className="p-3">Estimation</th><th className="p-3">Date</th></tr></thead><tbody>
      {requests.map(x=><tr key={x.id} className="border-b"><td className="p-3"><strong>{x.nom}</strong><div className="text-sm">{x.email}</div><div className="text-sm">{x.telephone}</div></td><td className="p-3">{x.type_evenement??'Non indiqué'}<details><summary className="cursor-pointer text-amber-700">Détails</summary><p>{x.message}</p><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(x.items,null,2)}</pre></details></td><td className="p-3">{Number(x.total??0).toLocaleString('fr-FR')} FCFA</td><td className="p-3">{new Date(x.created_at).toLocaleDateString('fr-FR')}</td></tr>)}
     </tbody></table>:<table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Numéro</th><th className="p-3">Client</th><th className="p-3">Statut</th><th className="p-3">Total</th><th className="p-3">Action</th></tr></thead><tbody>
      {quotes.map(x=><tr key={x.id} className="border-b"><td className="p-3">{x.numero??'Brouillon'}</td><td className="p-3">{x.client?.nom??'—'}</td><td className="p-3">{x.statut}</td><td className="p-3">{Number(x.total_commercial).toLocaleString('fr-FR')} FCFA</td><td className="p-3"><button className="underline text-amber-700" onClick={()=>void show(x.id)}>Voir le détail</button></td></tr>)}
     </tbody></table>}
     {(tab==='requests'?requests:quotes).length===0&&<p className="p-3 text-slate-500">Aucun enregistrement.</p>}
    </section>}
    {detail&&<section className="bg-white rounded-xl p-5 mt-5"><div className="flex justify-between"><h2 className="font-semibold text-xl">Détail du devis</h2><button onClick={()=>setDetail(null)} aria-label="Fermer le détail">✕</button></div><pre className="text-sm whitespace-pre-wrap break-words mt-3">{JSON.stringify(detail,null,2)}</pre></section>}
   </>}
   {error&&<p role="alert" className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</p>}
  </div>
 </main>;
}
