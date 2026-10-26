import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,"content-type":"application/json","cache-control":"no-store"}});
const url=Deno.env.get("SUPABASE_URL")!;
const pub=Deno.env.get("SUPABASE_ANON_KEY")!;
const secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin=createClient(url,secret,{auth:{persistSession:false}});
Deno.serve(async(req)=>{
 if(req.method!=="POST")return json({error:"Méthode non autorisée"},405);
 const bearer=req.headers.get("authorization")??"";
 const token=bearer.startsWith("Bearer ")?bearer.slice(7):"";
 if(!token)return json({error:"Authentification requise"},401);
 const authClient=createClient(url,pub,{auth:{persistSession:false}});
 const {data:{user},error}=await authClient.auth.getUser(token);
 if(error||!user)return json({error:"Session invalide"},401);
 // App metadata are server-controlled; never trust user_metadata or roles from the request.
 const isAdmin=user.app_metadata?.ony_role==="admin"||user.app_metadata?.ony_role==="owner";
 if(!isAdmin)return json({error:"Accès réservé à l'administration ONY"},403);
 let input:Record<string,unknown>;
 try{input=await req.json();}catch{return json({error:"Corps JSON invalide"},400);}
 const action=input.action;
 try {
  if(action==="create"){
    const name=String(input.nom??"").trim(), phone=String(input.telephone??"").trim(), email=String(input.email??"").trim();
    const raw=Array.isArray(input.lines)?input.lines:[];
    if(name.length<1||name.length>120||phone.length<8||phone.length>20||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({error:"Coordonnées invalides"},400);
    if(raw.length<1||raw.length>50) return json({error:"Sélectionnez entre 1 et 50 articles"},400);
    const lines=raw.map((x:any)=>({product_id:String(x.product_id??""),quantity:Number(x.quantity)}));
    if(lines.some((x)=>!x.product_id||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>9999)) return json({error:"Articles invalides"},400);
    const date=input.date_evenement==null||input.date_evenement===""?null:String(input.date_evenement);
    if(date!==null&&!/^\d{4}-\d{2}-\d{2}$/.test(date))return json({error:"Date invalide"},400);
    const {data,error}=await admin.rpc("ony_admin_create_quote",{
      p_client_name:name,p_client_phone:phone,p_client_email:email,
      p_event_type:String(input.type_evenement??"").slice(0,100),
      p_event_date:date,p_event_place:String(input.lieu_evenement??"").slice(0,500),
      p_product_lines:lines,p_actor:user.id
    });
    if(error){console.error("quote create",error);return json({error:"Impossible de créer le devis"},400);}
    return json({id:data},201);
  }
  if(action==="requests"){
   const {data,error}=await admin.from("devis_requests").select("id,created_at,nom,telephone,email,type_evenement,message,items,total").order("created_at",{ascending:false}).limit(100);
   if(error)throw error;return json({data});
  }
  if(action==="quotes"){
   const {data,error}=await admin.from("ony_devis").select("id,numero,statut,version,type_evenement,date_evenement,lieu_evenement,total_commercial,acompte_requis,created_at,client:ony_clients(id,nom,email,telephone)").order("created_at",{ascending:false}).limit(100);
   if(error)throw error;return json({data});
  }
  if(action==="detail"){
   const id=String(input.id??"");
   if(!/^[0-9a-f-]{36}$/i.test(id))return json({error:"ID invalide"},400);
   const {data,error}=await admin.from("ony_devis").select("*,client:ony_clients(*),lignes:ony_devis_lignes(*)").eq("id",id).single();
   if(error)return json({error:"Devis introuvable"},404);return json({data});
  }
  return json({error:"Action inconnue"},400);
 }catch(e){console.error("ony-admin-devis",e);return json({error:"Erreur du serveur"},500);}
});
