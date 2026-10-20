-- ==============================================================================
-- STORE FACTORY: FULL SUPABASE DATABASE SETUP
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and click RUN.
-- Project URL: https://cqrdgxhkrinwpysrksiu.supabase.co
-- ==============================================================================

begin;

create table if not exists public.commerce_stores (
  id uuid primary key,
  owner_id uuid not null references auth.users(id),
  slug text not null unique check (char_length(slug)<=63 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug not in ('www','admin','api','app','auth','assets')),
  data jsonb not null check (jsonb_typeof(data)='object' and data ?& array['id','name','settings','products','pages'] and jsonb_typeof(data->'products')='array'),
  updated_at timestamptz not null default now()
);
create index if not exists commerce_owner_idx on public.commerce_stores(owner_id);
alter table public.commerce_stores enable row level security;
revoke all on public.commerce_stores from public,anon,authenticated;
grant select on public.commerce_stores to authenticated;
grant all on public.commerce_stores to service_role;
drop policy if exists commerce_owner_read on public.commerce_stores;
create policy commerce_owner_read on public.commerce_stores for select to authenticated using(owner_id=(select auth.uid()));

create table if not exists public.commerce_publications (
  id uuid primary key references public.commerce_stores(id) on delete cascade,
  slug text not null unique,
  data jsonb not null,
  published_at timestamptz not null default now()
);
alter table public.commerce_publications enable row level security;
revoke all on public.commerce_publications from public,anon,authenticated;
grant select on public.commerce_publications to anon,authenticated;
grant delete on public.commerce_publications to authenticated;
grant all on public.commerce_publications to service_role;
drop policy if exists commerce_public_read on public.commerce_publications;
create policy commerce_public_read on public.commerce_publications for select to anon,authenticated using(true);
drop policy if exists commerce_owner_unpublish on public.commerce_publications;
create policy commerce_owner_unpublish on public.commerce_publications for delete to authenticated using(exists(select 1 from public.commerce_stores s where s.id=commerce_publications.id and s.owner_id=(select auth.uid())));

create table if not exists public.commerce_domains (
  hostname text primary key check(hostname=lower(btrim(hostname)) and char_length(hostname)<=253 and hostname ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'),
  store_id uuid not null references public.commerce_stores(id) on delete cascade,
  verified boolean not null default false
);
create index if not exists commerce_domain_store_idx on public.commerce_domains(store_id);
alter table public.commerce_domains enable row level security;
revoke all on public.commerce_domains from public,anon,authenticated;
grant select on public.commerce_domains to anon,authenticated;
grant all on public.commerce_domains to service_role;
drop policy if exists commerce_verified_domains on public.commerce_domains;
create policy commerce_verified_domains on public.commerce_domains for select to anon,authenticated using(verified);
drop policy if exists commerce_owned_domains on public.commerce_domains;
create policy commerce_owned_domains on public.commerce_domains for select to authenticated using(exists(select 1 from public.commerce_stores s where s.id=commerce_domains.store_id and s.owner_id=(select auth.uid())));

create table if not exists public.commerce_orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.commerce_stores(id),
  request_id uuid not null,
  customer jsonb not null,
  lines jsonb not null,
  total bigint not null check(total>=0),
  currency text not null,
  status text not null default 'pending_payment',
  created_at timestamptz not null default now(),
  unique(store_id,request_id)
);
alter table public.commerce_orders enable row level security;
revoke all on public.commerce_orders from public,anon,authenticated;
grant select on public.commerce_orders to authenticated;
grant all on public.commerce_orders to service_role;
drop policy if exists commerce_owned_orders on public.commerce_orders;
create policy commerce_owned_orders on public.commerce_orders for select to authenticated using(exists(select 1 from public.commerce_stores s where s.id=commerce_orders.store_id and s.owner_id=(select auth.uid())));

create table if not exists public.commerce_subscribers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.commerce_stores(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  unique(store_id,email)
);
alter table public.commerce_subscribers enable row level security;
revoke all on public.commerce_subscribers from public,anon,authenticated;
grant select on public.commerce_subscribers to authenticated;
grant all on public.commerce_subscribers to service_role;
drop policy if exists commerce_owned_subscribers on public.commerce_subscribers;
create policy commerce_owned_subscribers on public.commerce_subscribers for select to authenticated using(exists(select 1 from public.commerce_stores s where s.id=commerce_subscribers.store_id and s.owner_id=(select auth.uid())));

create or replace function public.save_commerce_store(payload jsonb,expected_revision timestamptz default null,publish_now boolean default false)
returns jsonb language plpgsql security definer set search_path='' as $$
declare previous public.commerce_stores%rowtype; saved public.commerce_stores%rowtype; product jsonb; variant jsonb; settings jsonb; public_data jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in before saving.' using errcode='42501'; end if;
  if octet_length(payload::text)>14000000 or coalesce(btrim(payload->>'name'),'')='' then raise exception 'Invalid store name or payload size.'; end if;
  settings:=payload->'settings';
  if coalesce(settings->>'currency','') not in ('USD','AED','PKR') then raise exception 'Unsupported currency.'; end if;
  if jsonb_typeof(payload->'products') is distinct from 'array' or jsonb_typeof(payload->'pages') is distinct from 'object' then raise exception 'Invalid products or pages.'; end if;
  for product in select value from jsonb_array_elements(payload->'products') loop
    if coalesce(product->>'status','') not in ('draft','published') or coalesce(btrim(product->>'name'),'')='' or coalesce(btrim(product->>'sku'),'')='' then raise exception 'Invalid product.'; end if;
    if coalesce((product->>'price')::numeric,-1)<0 or (product->>'price')::numeric>10000000 or coalesce((product->>'stock')::numeric,-1)<0 or (product->>'stock')::numeric<>trunc((product->>'stock')::numeric) then raise exception 'Invalid price or stock.'; end if;
    if nullif(product->>'salePrice','') is not null and ((product->>'salePrice')::numeric<0 or (product->>'salePrice')::numeric>=(product->>'price')::numeric) then raise exception 'Invalid sale price.'; end if;
    for variant in select value from jsonb_array_elements(product->'variants') loop
      if coalesce((variant->>'stock')::numeric,-1)<0 or (variant->>'stock')::numeric<>trunc((variant->>'stock')::numeric) or (nullif(variant->>'price','') is not null and (variant->>'price')::numeric<0) then raise exception 'Invalid variant stock or price.'; end if;
    end loop;
  end loop;
  select * into previous from public.commerce_stores where id=(payload->>'id')::uuid for update;
  if found then
    if previous.owner_id<>auth.uid() then raise exception 'Not your store.' using errcode='42501'; end if;
    if expected_revision is distinct from previous.updated_at then raise exception 'This store changed after it was opened. Reload before saving.'; end if;
    update public.commerce_stores set data=payload,slug=payload->>'slug',updated_at=clock_timestamp() where id=previous.id returning * into saved;
  else
    insert into public.commerce_stores(id,owner_id,slug,data) values((payload->>'id')::uuid,auth.uid(),payload->>'slug',payload) returning * into saved;
  end if;
  if publish_now then
    if coalesce(settings->>'email','')='' and coalesce(settings->>'phone','')='' and coalesce(settings->>'whatsapp','')='' then raise exception 'Add a contact method before publishing.'; end if;
    public_data:=jsonb_set(payload - 'sectionLibrary','{products}',coalesce((select jsonb_agg(value) from jsonb_array_elements(payload->'products') where value->>'status'='published'),'[]'::jsonb));
    insert into public.commerce_publications(id,slug,data) values(saved.id,saved.slug,public_data)
      on conflict(id) do update set slug=excluded.slug,data=excluded.data,published_at=now();
  end if;
  return to_jsonb(saved);
end;$$;
revoke all on function public.save_commerce_store(jsonb,timestamptz,boolean) from public,anon;
grant execute on function public.save_commerce_store(jsonb,timestamptz,boolean) to authenticated;

create or replace function public.place_commerce_order(store_id uuid,items jsonb,customer_details jsonb,coupon_code text,shipping_id text,request_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare draft public.commerce_stores%rowtype; live public.commerce_publications%rowtype; existing public.commerce_orders%rowtype;
  item jsonb; product jsonb; variant jsonb; method jsonb; coupon jsonb; product_index int; variant_index int; draft_index int; draft_variant_index int;
  quantity int; stock int; unit_cents bigint; subtotal bigint:=0; discount bigint:=0; shipping bigint:=0; line_items jsonb:='[]'; seen text[]:='{}'; line_key text; result public.commerce_orders%rowtype;
begin
  if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items) not between 1 and 100 then raise exception 'Invalid cart.'; end if;
  if octet_length(customer_details::text)>10000 or coalesce(customer_details->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or coalesce(btrim(customer_details->>'name'),'')='' or coalesce(btrim(customer_details->>'address'),'')='' or coalesce(btrim(customer_details->>'city'),'')='' or coalesce(btrim(customer_details->>'country'),'')='' then raise exception 'Add your name, email and shipping address.'; end if;
  select * into draft from public.commerce_stores s where s.id=store_id for update;
  select * into live from public.commerce_publications p where p.id=store_id for update;
  if not found then raise exception 'Store is not published.'; end if;
  select * into existing from public.commerce_orders o where o.store_id=place_commerce_order.store_id and o.request_id=place_commerce_order.request_id;
  if found then return jsonb_build_object('id',existing.id,'total',existing.total,'currency',existing.currency,'status',existing.status); end if;
  for item in select value from jsonb_array_elements(items) loop
    quantity:=(item->>'quantity')::integer;
    if quantity is null or quantity not between 1 and 99 then raise exception 'Invalid quantity.'; end if;
    line_key:=(item->>'productId')||':'||coalesce(item->>'variantId','');
    if line_key=any(seen) then raise exception 'Duplicate cart line.'; end if;seen:=array_append(seen,line_key);
    select value,(ordinality-1)::int into product,product_index from jsonb_array_elements(live.data->'products') with ordinality where value->>'id'=item->>'productId' and value->>'status'='published';
    if not found then raise exception 'A product is no longer available.'; end if;
    variant:=null;variant_index:=null;
    if jsonb_array_length(product->'variants')>0 then
      select value,(ordinality-1)::int into variant,variant_index from jsonb_array_elements(product->'variants') with ordinality where value->>'id'=item->>'variantId';
      if not found then raise exception 'Choose an available variant.'; end if;
    end if;
    stock:=coalesce((variant->>'stock')::int,(product->>'stock')::int);
    if stock<quantity then raise exception 'Stock changed. Refresh the store and review your cart.'; end if;
    unit_cents:=round(coalesce(nullif(variant->>'price','')::numeric,nullif(product->>'salePrice','')::numeric,(product->>'price')::numeric)*100);
    subtotal:=subtotal+unit_cents*quantity;
    line_items:=line_items||jsonb_build_array(jsonb_build_object('productId',product->>'id','variantId',coalesce(variant->>'id',''),'name',product->>'name','variant',coalesce(variant->>'name',''),'quantity',quantity,'unitCents',unit_cents));
    if variant is null then live.data:=jsonb_set(live.data,array['products',product_index::text,'stock'],to_jsonb(stock-quantity));
    else live.data:=jsonb_set(live.data,array['products',product_index::text,'variants',variant_index::text,'stock'],to_jsonb(stock-quantity));end if;
    select (ordinality-1)::int into draft_index from jsonb_array_elements(draft.data->'products') with ordinality where value->>'id'=product->>'id';
    if found then
      if variant is null then draft.data:=jsonb_set(draft.data,array['products',draft_index::text,'stock'],to_jsonb(greatest(0,(draft.data->'products'->draft_index->>'stock')::int-quantity)));
      else
        select (ordinality-1)::int into draft_variant_index from jsonb_array_elements(draft.data->'products'->draft_index->'variants') with ordinality where value->>'id'=variant->>'id';
        if found then draft.data:=jsonb_set(draft.data,array['products',draft_index::text,'variants',draft_variant_index::text,'stock'],to_jsonb(greatest(0,(draft.data->'products'->draft_index->'variants'->draft_variant_index->>'stock')::int-quantity)));end if;
      end if;
    end if;
  end loop;
  select value into method from jsonb_array_elements(live.data->'settings'->'shippingMethods') where value->>'id'=shipping_id;
  if not found then raise exception 'Choose a shipping method.'; end if;
  shipping:=round((method->>'price')::numeric*100);if shipping<0 then raise exception 'Invalid shipping configuration.';end if;
  if btrim(coalesce(coupon_code,''))<>'' then
    select value into coupon from jsonb_array_elements(live.data->'settings'->'coupons') where upper(value->>'code')=upper(btrim(coupon_code)) and (value->>'enabled')::boolean;
    if not found then raise exception 'Coupon is not valid.';end if;
    if coupon->>'type'='percent' then discount:=round(subtotal*(coupon->>'amount')::numeric/100);else discount:=round((coupon->>'amount')::numeric*100);end if;
    discount:=least(subtotal,greatest(0,discount));
  end if;
  insert into public.commerce_orders(store_id,request_id,customer,lines,total,currency) values(store_id,request_id,customer_details,line_items,subtotal-discount+shipping,live.data->'settings'->>'currency') returning * into result;
  update public.commerce_publications set data=live.data where id=store_id;
  update public.commerce_stores set data=draft.data,updated_at=clock_timestamp() where id=store_id;
  return jsonb_build_object('id',result.id,'total',result.total,'currency',result.currency,'status',result.status);
end;$$;
revoke all on function public.place_commerce_order(uuid,jsonb,jsonb,text,text,uuid) from public;
grant execute on function public.place_commerce_order(uuid,jsonb,jsonb,text,text,uuid) to anon,authenticated;

create or replace function public.subscribe_commerce_newsletter(store_id uuid,email_address text)
returns void language plpgsql security definer set search_path='' as $$
begin
  if length(email_address)>254 or email_address !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid email address.';end if;
  if not exists(select 1 from public.commerce_publications p where p.id=store_id) then raise exception 'Store is not published.';end if;
  insert into public.commerce_subscribers(store_id,email) values(store_id,lower(btrim(email_address))) on conflict do nothing;
end;$$;
revoke all on function public.subscribe_commerce_newsletter(uuid,text) from public;
grant execute on function public.subscribe_commerce_newsletter(uuid,text) to anon,authenticated;

do $$
declare target_table text;
begin
  foreach target_table in array array['commerce_stores','commerce_publications','commerce_orders'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = target_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I', target_table);
    end if;
  end loop;
end $$;

commit;

-- Section Library Migration
begin;
create or replace function public.commerce_section_library_valid(library jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare
  entry jsonb; definition jsonb; column_data jsonb; block_data jsonb; expected_columns integer; record_ids text[] := '{}'; identifier text;
begin
  if jsonb_typeof(library) is distinct from 'array' then return false; end if;
  if jsonb_array_length(library) > 100 then return false; end if;
  for entry in select value from jsonb_array_elements(library) loop
    if jsonb_typeof(entry) is distinct from 'object'
      or jsonb_typeof(entry->'id') is distinct from 'string'
      or jsonb_typeof(entry->'name') is distinct from 'string'
      or char_length(btrim(entry->>'name')) not between 1 and 120
    then return false; end if;
    identifier := entry->>'id';
    if identifier !~ '^[A-Za-z0-9_-]{1,80}$' or identifier = any(record_ids) then return false; end if;
    record_ids := array_append(record_ids, identifier);
    definition := entry->'section';
    if jsonb_typeof(definition) is distinct from 'object'
      or jsonb_typeof(definition->'columns') is distinct from 'array'
      or jsonb_typeof(definition->'styles') is distinct from 'object'
    then return false; end if;
    expected_columns := case definition->>'layout'
      when 'one' then 1 when 'two' then 2 when 'three' then 3 when 'four' then 4 when 'split-left' then 2 when 'split-right' then 2
      else 0 end;
    if expected_columns = 0 or jsonb_array_length(definition->'columns') <> expected_columns then return false; end if;
  end loop;
  return true;
end;$$;
commit;
