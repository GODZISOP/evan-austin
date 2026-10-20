begin;

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id),
  slug text not null unique
    check (char_length(slug) <= 63 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null default '',
  tagline text not null default '',
  announcement text not null default '',
  email text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  address text not null default '',
  brand_color text not null default '#235544'
    check (brand_color ~ '^#[0-9A-Fa-f]{6}$'),
  currency text not null default 'USD'
    check (currency in ('USD', 'AED', 'PKR')),
  template text not null default 'essentials'
    check (template in ('essentials', 'editorial', 'wholesale')),
  published boolean not null default false,
  products jsonb not null default '[]'::jsonb
    check (jsonb_typeof(products) = 'array'),
  created_at timestamp with time zone not null default now()
);

create index stores_owner_id_idx on public.stores (owner_id);

alter table public.stores enable row level security;

revoke all on table public.stores from public, anon, authenticated;
grant select on table public.stores to anon;
grant select, insert, update, delete on table public.stores to authenticated;
grant all on table public.stores to service_role;

create policy stores_public_read
  on public.stores for select to anon, authenticated
  using (published);

create policy stores_owner_read
  on public.stores for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy stores_owner_insert
  on public.stores for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy stores_owner_update
  on public.stores for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy stores_owner_delete
  on public.stores for delete to authenticated
  using ((select auth.uid()) = owner_id);

create table public.store_domains (
  hostname text primary key
    check (
      hostname = lower(btrim(hostname))
      and char_length(hostname) <= 253
      and hostname ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'
    ),
  store_id uuid not null references public.stores (id) on delete cascade,
  verified boolean not null default false
);

create index store_domains_store_id_idx on public.store_domains (store_id);

alter table public.store_domains enable row level security;

-- Domain registration is reserved for a trusted operator after ownership checks.
revoke all on table public.store_domains from public, anon, authenticated;
grant select on table public.store_domains to anon, authenticated;
grant all on table public.store_domains to service_role;

create policy store_domains_public_read
  on public.store_domains for select to anon, authenticated
  using (verified);

create policy store_domains_owner_read
  on public.store_domains for select to authenticated
  using (
    exists (
      select 1 from public.stores
      where stores.id = store_domains.store_id
        and stores.owner_id = (select auth.uid())
    )
  );

commit;
