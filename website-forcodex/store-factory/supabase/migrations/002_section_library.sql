-- Optional validation for the per-store section library stored in
-- commerce_stores.data.sectionLibrary. No separate table or data backfill.
-- Existing commerce_stores owner RLS/save RPC controls access to this JSON.
-- The publishing layer must omit sectionLibrary from public snapshots.
begin;

create or replace function public.commerce_section_library_valid(library jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  entry jsonb;
  definition jsonb;
  column_data jsonb;
  block_data jsonb;
  expected_columns integer;
  record_ids text[] := '{}';
  definition_ids text[];
  identifier text;
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
      when 'one' then 1 when 'two' then 2 when 'three' then 3
      when 'four' then 4 when 'split' then 2 when 'grid' then 3
      when 'stacked' then 1 else 0 end;
    if expected_columns = 0 or jsonb_array_length(definition->'columns') <> expected_columns then return false; end if;
    identifier := definition->>'id';
    if identifier is null or identifier !~ '^[A-Za-z0-9_-]{1,80}$' then return false; end if;
    definition_ids := array[identifier];
    for column_data in select value from jsonb_array_elements(definition->'columns') loop
      if jsonb_typeof(column_data->'blocks') is distinct from 'array' then return false; end if;
      if jsonb_array_length(column_data->'blocks') > 100 then return false; end if;
      identifier := column_data->>'id';
      if identifier is null or identifier !~ '^[A-Za-z0-9_-]{1,80}$' or identifier = any(definition_ids) then return false; end if;
      definition_ids := array_append(definition_ids, identifier);
      for block_data in select value from jsonb_array_elements(column_data->'blocks') loop
        if coalesce(block_data->>'type', '') not in (
          'heading', 'paragraph', 'button', 'image', 'icon', 'badge',
          'stats', 'service', 'testimonial', 'logo', 'divider',
          'spacer', 'video', 'list', 'contact'
        ) or jsonb_typeof(block_data->'content') is distinct from 'object'
          or jsonb_typeof(block_data->'styles') is distinct from 'object'
        then return false; end if;
        identifier := block_data->>'id';
        if identifier is null or identifier !~ '^[A-Za-z0-9_-]{1,80}$' or identifier = any(definition_ids) then return false; end if;
        definition_ids := array_append(definition_ids, identifier);
      end loop;
    end loop;
  end loop;
  return true;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'commerce_stores_section_library_valid'
      and conrelid = 'public.commerce_stores'::regclass
  ) then
    alter table public.commerce_stores
      add constraint commerce_stores_section_library_valid
      check (
        case when data ? 'sectionLibrary'
          then public.commerce_section_library_valid(data->'sectionLibrary')
          else true end
      ) not valid;
  end if;
end;
$$;

-- NOT VALID preserves existing rows; the constraint checks new or changed rows.
-- After reviewing existing data, an operator may VALIDATE CONSTRAINT separately.
commit;
