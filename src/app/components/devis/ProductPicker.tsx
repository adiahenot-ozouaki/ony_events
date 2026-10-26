import { useMemo, useState } from 'react';
import type { OnyItem } from '../../../constants/ony_interfaces';

type Props={products:OnyItem[];value:string;onChange:(id:string)=>void;id:string};
const amount=(n:number)=>n.toLocaleString('fr-FR')+' FCFA';
export default function ProductPicker({products,value,onChange,id}:Props){
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('');
 const categories=useMemo(()=>Array.from(new Set(products.map(p=>p.categorie).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'fr')),[products]);
 const filtered=useMemo(()=>products.filter(p=>(!category||p.categorie===category)&&
  [p.nom,p.categorie,p.subCategorie,p.id].join(' ').toLocaleLowerCase('fr').includes(query.trim().toLocaleLowerCase('fr'))),[products,query,category]);
 const selected=products.find(p=>p.id===value);
 return <div className="space-y-3">
  <div className="grid sm:grid-cols-[1fr_190px] gap-3">
   <label className="block text-sm font-medium">Rechercher un article
    <input id={id+'-search'} name={id+'_search'} type="search" value={query} onChange={e=>setQuery(e.target.value)}
      placeholder="Nom, catégorie, référence…" className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-3" />
   </label>
   <label className="block text-sm font-medium">Catégorie
    <select id={id+'-category'} name={id+'_category'} value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-3">
     <option value="">Toutes les catégories</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}
    </select>
   </label>
  </div>
  <p className="text-xs text-slate-500">{filtered.length} article{filtered.length!==1?'s':''} trouvé{filtered.length!==1?'s':''} sur {products.length}</p>
  <div className="max-h-60 overflow-y-auto rounded-xl border border-stone-200 bg-white" role="group" aria-label="Résultats de recherche">
   {filtered.length?filtered.map(p=><button key={p.id} type="button" onClick={()=>onChange(p.id)}
     aria-pressed={value===p.id}
     className={'w-full flex justify-between gap-3 text-left items-center px-3 py-3 border-b last:border-b-0 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-amber-700 '+(value===p.id?'bg-amber-50 ring-1 ring-inset ring-amber-600':'')}>
    <span><span className="block font-medium">{p.nom}</span><span className="text-xs text-slate-500">{p.categorie}{p.subCategorie?' · '+p.subCategorie:''} · {p.id}</span></span>
    <span className="text-sm text-amber-900 whitespace-nowrap font-semibold">{amount(p.prix)}</span>
   </button>):<p className="p-4 text-sm text-slate-500">Aucun article trouvé. Modifiez la recherche ou la catégorie.</p>}
  </div>
  {selected&&<p className="rounded-lg bg-amber-50 p-3 text-sm"><strong>Article sélectionné :</strong> {selected.categorie} · {selected.nom} — {amount(selected.prix)}</p>}
 </div>;
}
