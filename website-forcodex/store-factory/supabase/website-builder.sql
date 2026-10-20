-- Run once after reviewing in the Supabase SQL editor. Existing store tables are untouched.
begin;

create table public.websites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id),
  slug text not null unique check (char_length(slug) <= 63 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and slug not in ('www', 'admin', 'api', 'app', 'auth', 'assets')),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  template text not null check (template in ('agency', 'construction', 'cleaning', 'healthcare', 'fitness', 'amazon', 'restaurant', 'real-estate', 'lawyer', 'consulting')),
  brand_color text not null default '#235544' check (brand_color ~ '^#[0-9a-fA-F]{6}$'),
  content jsonb not null check (
    jsonb_typeof(content) = 'object'
    and content ?& array['services', 'pages', 'pageMode', 'heroTitle', 'heroText', 'about', 'email', 'phone', 'whatsapp']
    and jsonb_typeof(content->'services') = 'array'
    and jsonb_typeof(content->'pages') = 'array'
    and content->'pages' @> '["home"]'::jsonb
    and content->'pages' <@ '["home", "services", "about", "contact"]'::jsonb
    and content->>'pageMode' in ('landing', 'pages')
    and octet_length(content::text) <= 3500000
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index websites_owner_idx on public.websites (owner_id);
alter table public.websites enable row level security;
revoke all on public.websites from public, anon, authenticated;
grant select, insert, update, delete on public.websites to authenticated;
grant all on public.websites to service_role;
create policy websites_owner_select on public.websites for select to authenticated using (owner_id = (select auth.uid()));
create policy websites_owner_insert on public.websites for insert to authenticated with check (owner_id = (select auth.uid()));
create policy websites_owner_update on public.websites for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy websites_owner_delete on public.websites for delete to authenticated using (owner_id = (select auth.uid()));

-- A separate snapshot keeps unpublished edits out of public API responses.
create table public.website_publications (
  id uuid primary key references public.websites (id) on delete cascade,
  slug text not null unique,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  published_at timestamptz not null default now()
);
alter table public.website_publications enable row level security;
revoke all on public.website_publications from public, anon, authenticated;
grant select on public.website_publications to anon, authenticated;
grant delete on public.website_publications to authenticated;
grant all on public.website_publications to service_role;
create policy website_public_read on public.website_publications for select to anon, authenticated using (true);
create policy website_owner_unpublish on public.website_publications for delete to authenticated using (
  exists (select 1 from public.websites where websites.id = website_publications.id and websites.owner_id = (select auth.uid()))
);

create function public.publish_website(website_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  draft public.websites%rowtype;
  publication public.website_publications%rowtype;
begin
  select * into draft from public.websites
    where id = website_id and owner_id = (select auth.uid()) for update;
  if not found then
    raise exception 'Website not found or not owned by this account.' using errcode = '42501';
  end if;
  if coalesce(btrim(draft.content->>'heroTitle'), '') = ''
    or coalesce(btrim(draft.content->>'heroText'), '') = '' then
    raise exception 'Add a headline and introduction before publishing.';
  end if;
  if coalesce(btrim(draft.content->>'email'), '') = ''
    and coalesce(btrim(draft.content->>'phone'), '') = ''
    and coalesce(btrim(draft.content->>'whatsapp'), '') = '' then
    raise exception 'Add a contact method before publishing.';
  end if;
  if draft.content->'pages' ? 'services' and jsonb_array_length(draft.content->'services') = 0 then
    raise exception 'Add a service or disable the Services page.';
  end if;
  if draft.content->'pages' ? 'about' and coalesce(btrim(draft.content->>'about'), '') = '' then
    raise exception 'Add About content or disable the About page.';
  end if;
  insert into public.website_publications (id, slug, snapshot, published_at)
  values (draft.id, draft.slug, jsonb_build_object(
    'id', draft.id, 'slug', draft.slug, 'name', draft.name, 'template', draft.template,
    'brand_color', draft.brand_color, 'content', draft.content
  ), now())
  on conflict (id) do update set slug = excluded.slug, snapshot = excluded.snapshot, published_at = excluded.published_at
  returning * into publication;
  return to_jsonb(publication);
end;
$$;
revoke all on function public.publish_website(uuid) from public, anon;
grant execute on function public.publish_website(uuid) to authenticated;

create table public.website_domains (
  hostname text primary key check (
    hostname = lower(btrim(hostname)) and char_length(hostname) <= 253
    and hostname ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'
  ),
  website_id uuid not null references public.websites (id) on delete cascade,
  verified boolean not null default false
);
create index website_domains_website_idx on public.website_domains (website_id);
alter table public.website_domains enable row level security;
revoke all on public.website_domains from public, anon, authenticated;
grant select on public.website_domains to anon, authenticated;
grant all on public.website_domains to service_role;
create policy website_domains_verified_read on public.website_domains for select to anon, authenticated using (verified);
create policy website_domains_owner_read on public.website_domains for select to authenticated using (
  exists (select 1 from public.websites where websites.id = website_domains.website_id and websites.owner_id = (select auth.uid()))
);

commit;
