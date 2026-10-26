create or replace function public.ony_admin_create_quote(
 p_client_name text, p_client_phone text, p_client_email text,
 p_event_type text, p_event_date date, p_event_place text,
 p_product_lines jsonb, p_actor uuid
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_client uuid; v_devis uuid; v_line jsonb; v_product record; v_quantity integer; v_total bigint:=0; v_count integer:=0;
begin
 if auth.role() <> 'service_role' then raise exception 'Unauthorized'; end if;
 if length(trim(coalesce(p_client_name,''))) not between 1 and 120
    or length(trim(coalesce(p_client_phone,''))) not between 8 and 20
    or p_client_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
 then raise exception 'Invalid client'; end if;
 if jsonb_typeof(p_product_lines) <> 'array' or jsonb_array_length(p_product_lines) not between 1 and 50 then
  raise exception 'Invalid lines';
 end if;
 insert into public.ony_clients(nom,telephone,email)
 values(trim(p_client_name),trim(p_client_phone),lower(trim(p_client_email))) returning id into v_client;
 insert into public.ony_devis(client_id,cree_par,statut,type_evenement,date_evenement,lieu_evenement)
 values(v_client,p_actor,'en_preparation',left(p_event_type,100),p_event_date,left(p_event_place,500))
 returning id into v_devis;
 for v_line in select value from jsonb_array_elements(p_product_lines)
 loop
   if (v_line->>'quantity') !~ '^[0-9]{1,4}$' then raise exception 'Invalid quantity'; end if;
   v_quantity:=(v_line->>'quantity')::integer;
   if v_quantity<1 or v_quantity>9999 then raise exception 'Invalid quantity'; end if;
   select id,nom,unite,prix into v_product from public.products where id=v_line->>'product_id';
   if not found then raise exception 'Unknown product'; end if;
   insert into public.ony_devis_lignes(devis_id,produit_id,designation,unite,quantite,prix_unitaire,ordre)
   values(v_devis,v_product.id,v_product.nom,v_product.unite,v_quantity,v_product.prix,v_count);
   v_total:=v_total+v_quantity::bigint*v_product.prix::bigint;
   v_count:=v_count+1;
 end loop;
 update public.ony_devis set montant_articles=v_total,total_commercial=v_total,
 acompte_requis=round(v_total*0.30)::bigint where id=v_devis;
 insert into public.ony_devis_evenements(devis_id,acteur_id,action)
 values(v_devis,p_actor,'creation_manuelle');
 return v_devis;
end $$;
revoke all on function public.ony_admin_create_quote(text,text,text,text,date,text,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.ony_admin_create_quote(text,text,text,text,date,text,jsonb,uuid) to service_role;
