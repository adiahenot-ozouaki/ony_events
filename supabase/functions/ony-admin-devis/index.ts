import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
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
