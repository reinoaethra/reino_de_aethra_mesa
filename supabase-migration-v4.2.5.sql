-- Reino de Aethra v4.2.5 — suporte seguro à exclusão da conta do próprio usuário.
-- Executar uma única vez no SQL Editor do Supabase antes de publicar o site.
-- Esta função revela somente os caminhos dos objetos Storage pertencentes ao usuário autenticado.
-- A remoção física continua sendo realizada pela Storage API na Edge Function.

create or replace function public.aethra_list_my_storage_objects()
returns table (bucket_id text, object_name text)
language sql
stable
security definer
set search_path = pg_catalog, public, storage, auth, pg_temp
as $$
  select o.bucket_id::text, o.name::text
  from storage.objects as o
  where auth.uid() is not null
    and o.owner_id = auth.uid()::text
  order by o.bucket_id, o.name
$$;

revoke all on function public.aethra_list_my_storage_objects() from public, anon;
grant execute on function public.aethra_list_my_storage_objects() to authenticated;
comment on function public.aethra_list_my_storage_objects() is
  'Lista apenas os caminhos Storage pertencentes ao auth.uid() atual; usado pela Edge Function delete-account para remover objetos via Storage API.';
