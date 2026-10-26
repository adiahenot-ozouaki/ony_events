create or replace function public.ony_admin_prepare_quote(
 p_quote_id uuid, p_request_id uuid, p_lines jsonb,
 p_services bigint, p_delivery bigint, p_discount bigint, p_security bigint,
 p_notes text, p_actor uuid
) returns uuid language plpgsql security definer set search_path = ''
as $$
declare v_quote uuid; v_req public.devis_requests%rowtype; v_client uuid;
 v_line jsonb; v_product public.products%rowtype; v_qty integer;
 v_items bigint:=0; v_count integer:=0; v_total bigint;
begin
 if auth.role() <> 'service_role' then raise exception 'Unauthorized'; end if;
 if p_services<0 or p_delivery<0 or p_discount<0 or p_security<0 or
    p_services>100000000000 or p_delivery>100000000000 or p_discount>100000000000 or p_security>100000000000
 then raise exception 'Invalid amounts'; end if;
 if jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines) not between 1 and 50 then
  raise exception 'Invalid lines'; end if;
 if p_quote_id is null then
  if p_request_id is null then raise exception 'Request required'; end if;
  select * into v_req from public.devis_requests where id=p_request_id;
  if not found then raise exception 'Request not found'; end if;
  insert into public.ony_clients(nom,telephone,email) values(v_req.nom,v_req.telephone,v_req.email) returning id into v_client;
  insert into public.ony_devis(client_id,demande_id,cree_par,statut,type_evenement,notes)
    values(v_client,p_request_id,p_actor,'en_preparation',v_req.type_evenement,v_req.message) returning id into v_quote;
 else
  select id into v_quote from public.ony_devis where id=p_quote_id and statut in ('brouillon','en_preparation') for update;
  if not found then raise exception 'Quote not editable'; end if;
  delete from public.ony_devis_lignes where devis_id=v_quote;
 end if;
 for v_line in select value from jsonb_array_elements(p_lines) loop
  if coalesce(v_line->>'quantity','') !~ '^[0-9]{1,4}$' then raise exception 'Invalid quantity'; end if;
  v_qty=(v_line->>'quantity')::int;
  if v_qty<1 or v_qty>9999 then raise exception 'Invalid quantity'; end if;
  select * into v_product from public.products where id=v_line->>'product_id';
  if not found then raise exception 'Unknown product'; end if;
  v_items:=v_items+v_qty::bigint*v_product.prix::bigint;
  if v_items>100000000000 then raise exception 'Amount too high'; end if;
  insert into public.ony_devis_lignes(devis_id,produit_id,designation,unite,quantite,prix_unitaire,ordre)
    values(v_quote,v_product.id,v_product.nom,v_product.unite,v_qty,v_product.prix,v_count);
  v_count:=v_count+1;
 end loop;
 v_total:=v_items+p_services+p_delivery-p_discount;
 if v_total<0 or v_total>100000000000 then raise exception 'Invalid total'; end if;
 update public.ony_devis set
  montant_articles=v_items,montant_prestations=p_services,frais_livraison=p_delivery,
  remise=p_discount,caution=p_security,total_commercial=v_total,acompte_requis=round(v_total*0.30)::bigint,
  notes=coalesce(p_notes,notes),version=case when p_quote_id is null then version else version+1 end,
  updated_at=now()
 where id=v_quote;
 insert into public.ony_devis_evenements(devis_id,acteur_id,action)
 values(v_quote,p_actor,case when p_quote_id is null then 'conversion_demande' else 'modification_brouillon' end);
 return v_quote;
end $$;
revoke all on function public.ony_admin_prepare_quote(uuid,uuid,jsonb,bigint,bigint,bigint,bigint,text,uuid) from public,anon,authenticated;
grant execute on function public.ony_admin_prepare_quote(uuid,uuid,jsonb,bigint,bigint,bigint,bigint,text,uuid) to service_role;