import { useState } from 'react';
import type { OnyItem } from '../../../constants/ony_interfaces';
import ProductPicker from './ProductPicker';
type Line={product_id:string;quantity:number};
type Props={products:OnyItem[];initialLines:Line[];initialAmounts?:{services:number;delivery:number;discount:number;security:number;notes:string};onSave:(data:{lines:Line[];services:number;delivery:number;discount:number;security:number;notes:string})=>Promise<void>;onCancel:()=>void;title:string};
const money=(value:number)=>value.toLocaleString('fr-FR')+' FCFA';
export default function QuotePreparation({products,initialLines,initialAmounts,onSave,onCancel,title}:Props){
 const [lines,setLines]=useState<Line[]>(initialLines);
 const [productId,setProductId]=useState('');
 const [quantity,setQuantity]=useState(1);
 const [services,setServices]=useState(initialAmounts?.services??0);
 const [delivery,setDelivery]=useState(initialAmounts?.delivery??0);
 const [discount,setDiscount]=useState(initialAmounts?.discount??0);
 const [security,setSecurity]=useState(initialAmounts?.security??0);
 const [notes,setNotes]=useState(initialAmounts?.notes??'');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const itemsTotal=lines.reduce((sum,line)=>sum+line.quantity*(products.find(p=>p.id===line.product_id)?.prix??0),0);
 const total=itemsTotal+services+delivery-discount;
 function addLine(){
  if(!productId||!Number.isInteger(quantity)||quantity<1||quantity>9999||lines.length>=50)return;
  setLines(old=>{const found=old.find(x=>x.product_id===productId);if(found){return old.map(x=>x.product_id===productId?{...x,quantity:Math.min(x.quantity+quantity,9999)}:x)}return [...old,{product_id:productId,quantity}]});
  setProductId('');setQuantity(1);
 }
 async function submit(e:React.FormEvent){
  e.preventDefault();setError('');
  if(!lines.length){setError('Ajoutez au moins un article.');return;}
  if([services,delivery,discount,security].some(n=>!Number.isSafeInteger(n)||n<0)||total<0){setError('Vérifiez les montants et la remise.');return;}
  setBusy(true);try{await onSave({lines,services,delivery,discount,security,notes})}catch(err){setError(err instanceof Error?err.message:'Enregistrement impossible')}finally{setBusy(false)}
 }
 return <form onSubmit={submit} className="bg-white shadow-sm rounded-xl p-5 mb-5 space-y-5">
  <div className="flex justify-between items-center"><h2 className="text-xl font-semibold">{title}</h2><button type="button" onClick={onCancel} className="underline">Fermer</button></div>
  <div className="grid md:grid-cols-[minmax(0,1fr)_120px_auto] gap-3 items-end">
   <ProductPicker id="ony-prep-product" products={products} value={productId} onChange={setProductId}/>
   <label>Quantité<input id="ony-prep-quantity" name="prep_quantity" type="number" min="1" max="9999" className="mt-1 block w-full border rounded p-2" value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
   <button type="button" onClick={addLine} disabled={!productId} className="rounded bg-stone-100 p-2">Ajouter</button>
  </div>
  <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-2">Désignation</th><th className="p-2">Qté</th><th className="p-2">Montant indicatif</th><th></th></tr></thead><tbody>{lines.map(line=>{const product=products.find(p=>p.id===line.product_id);return <tr key={line.product_id} className="border-b"><td className="p-2"><strong className="block">{product?.nom??line.product_id}</strong><span className="block text-xs text-slate-500">{[product?.categorie,product?.subCategorie].filter(Boolean).join(" · ")}</span></td><td className="p-2"><input aria-label={'Quantité '+(product?.nom??line.product_id)} name={'qty_'+line.product_id} type="number" min="1" max="9999" value={line.quantity} className="w-24 border rounded p-2" onChange={e=>setLines(old=>old.map(x=>x.product_id===line.product_id?{...x,quantity:Number(e.target.value)}:x))}/></td><td className="p-2">{money((product?.prix??0)*line.quantity)}</td><td><button type="button" onClick={()=>setLines(old=>old.filter(x=>x.product_id!==line.product_id))} className="text-red-700 underline">Retirer</button></td></tr>})}</tbody></table></div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{([['Prestations',services,setServices,'services'],['Livraison',delivery,setDelivery,'delivery'],['Remise',discount,setDiscount,'discount'],['Caution',security,setSecurity,'security']] as const).map(([label,value,setter,id])=><label key={id}>{label} (FCFA)<input id={'ony-prep-'+id} name={id} type="number" min="0" step="1" value={value} className="w-full border rounded p-2 mt-1" onChange={e=>setter(Number(e.target.value))}/></label>)}</div>
  <label className="block">Observations<textarea id="ony-prep-notes" name="notes" maxLength={4000} rows={3} className="w-full border rounded p-2 mt-1" value={notes} onChange={e=>setNotes(e.target.value)}/></label>
  <div className="border-t pt-3 flex flex-wrap gap-4 justify-between"><div><div>Articles : {money(itemsTotal)}</div><strong>Total commercial : {money(total)}</strong></div><div><div>Acompte prévisionnel (30 %) : {money(Math.round(total*.3))}</div><div>Caution distincte : {money(security)}</div></div></div>
  <p className="text-xs text-slate-500">Brouillon uniquement. Les montants sont revérifiés côté serveur. Aucune réservation de stock ni émission de devis définitif.</p>
  {error&&<p role="alert" className="text-red-700">{error}</p>}
  <button type="submit" disabled={busy||lines.length===0||total<0} className="rounded-lg bg-amber-700 text-white p-3 disabled:opacity-50">{busy?'Enregistrement…':'Enregistrer la préparation'}</button>
 </form>;
}
