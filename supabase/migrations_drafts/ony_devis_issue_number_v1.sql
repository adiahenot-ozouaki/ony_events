create sequence if not exists public.ony_devis_number_seq;
revoke all on sequence public.ony_devis_number_seq from public,anon,authenticated;
create or replace function public.ony_admin_issue_quote(p_quote_id uuid,p_actor uuid)
returns text language plpgsql security definer set search_path = ''
as $$
declare v_quote public.ony_devis%rowtype; v_number text; v_snapshot jsonb;
begin
 if auth.role()<>'service_role' then raise exception 'Unauthorized'; end if;
 select * into v_quote from public.ony_devis where id=p_quote_id for update;
 if not found or v_quote.statut not in ('brouillon','en_preparation') then raise exception 'Quote is not issuable'; end if;
 if not exists(select 1 from public.ony_devis_lignes where devis_id=p_quote_id) then raise exception 'Quote has no lines'; end if;
 if v_quote.total_commercial<0 then raise exception 'Invalid total'; end if;
 v_number:='ONY-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.ony_devis_number_seq')::text,6,'0');
 update public.ony_devis set numero=v_number,statut='envoye',updated_at=now() where id=p_quote_id;
 select jsonb_build_object('numero',v_number,'devis',to_jsonb(d),'client',to_jsonb(c),
  'lignes',coalesce((select jsonb_agg(to_jsonb(l) order by l.ordre) from public.ony_devis_lignes l where l.devis_id=p_quote_id),'[]'::jsonb))
 into v_snapshot from public.ony_devis d join public.ony_clients c on c.id=d.client_id where d.id=p_quote_id;
 insert into public.ony_devis_versions(devis_id,version,snapshot)
 values(p_quote_id,v_quote.version,v_snapshot);
 insert into public.ony_devis_evenements(devis_id,acteur_id,action,details)
 values(p_quote_id,p_actor,'emission_devis',jsonb_build_object('numero',v_number));
 return v_number;
end $$;
revoke all on function public.ony_admin_issue_quote(uuid,uuid) from public,anon,authenticated;
grant execute on function public.ony_admin_issue_quote(uuid,uuid) to service_role;