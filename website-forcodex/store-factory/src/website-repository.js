import { configured, configError, supabase } from './repository.js';
import { draftStorageKey, validateWebsite } from './website-model.js';
export { configured, configError, supabase };

function readWorkspace() {
  let raw;
  try { raw = localStorage.getItem(draftStorageKey); } catch { throw new Error('Allow browser storage to save local websites.'); }
  if (!raw) return { drafts: [], publications: [] };
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.drafts) || !Array.isArray(data.publications)) throw new Error();
    data.drafts.forEach(site => validateWebsite(site));
    data.publications.forEach(site => validateWebsite(site.snapshot));
    return data;
  } catch { throw new Error('Saved websites could not be read. Export your browser data before clearing storage.'); }
}

function writeWorkspace(data) {
  try { localStorage.setItem(draftStorageKey, JSON.stringify(data)); }
  catch { throw new Error('The browser could not save this website. Try smaller images or use hosted image URLs.'); }
}

function unwrap({ data, error }) {
  if (error) throw new Error(error.code === '23505' ? 'That website address is already in use. Choose another.' : error.message);
  return data;
}

export async function listWebsites(user, demo) {
  if (demo) return readWorkspace();
  if (!supabase) throw new Error('Connect Supabase before opening the shared workspace.');
  if (!user) return { drafts: [], publications: [] };
  const drafts = unwrap(await supabase.from('websites').select('*').eq('owner_id', user.id).order('updated_at', { ascending: false }));
  const publications = drafts.length ? unwrap(await supabase.from('website_publications').select('id,slug,snapshot,published_at').in('id', drafts.map(site => site.id))) : [];
  return { drafts, publications };
}

export async function saveWebsite(value, user, demo) {
  const site = validateWebsite(value);
  if (demo) {
    const data = readWorkspace();
    if (data.drafts.some(draft => draft.slug === site.slug && draft.id !== site.id)) throw new Error('That website address is already in use. Choose another.');
    const saved = { ...site, updated_at: new Date().toISOString() };
    data.drafts = [saved, ...data.drafts.filter(draft => draft.id !== site.id)];
    writeWorkspace(data);
    return saved;
  }
  if (!supabase || !user) throw new Error('Sign in before saving to Supabase.');
  const { id, name, slug, template, brand_color, content } = site;
  return unwrap(await supabase.from('websites').upsert({ id, name, slug, template, brand_color, content, owner_id: user.id, updated_at: new Date().toISOString() }).select().single());
}

export async function publishWebsite(value, user, demo) {
  validateWebsite(value, true);
  const saved = await saveWebsite(value, user, demo);
  if (demo) {
    const data = readWorkspace();
    if (data.publications.some(site => site.slug === saved.slug && site.id !== saved.id)) throw new Error('That published address is already in use. Your draft was saved; choose a different address.');
    const publication = { id: saved.id, slug: saved.slug, snapshot: saved, published_at: new Date().toISOString() };
    data.publications = [publication, ...data.publications.filter(site => site.id !== saved.id)];
    writeWorkspace(data);
    return { saved, publication };
  }
  const publication = unwrap(await supabase.rpc('publish_website', { website_id: saved.id }));
  return { saved, publication };
}

export async function unpublishWebsite(id, demo) {
  if (demo) {
    const data = readWorkspace();
    data.publications = data.publications.filter(site => site.id !== id);
    writeWorkspace(data);
  } else {
    if (!supabase) throw new Error('Connect Supabase first.');
    unwrap(await supabase.from('website_publications').delete().eq('id', id));
  }
}

export async function publicWebsite(route, demo) {
  if (demo) {
    if (route.kind !== 'slug') return null;
    return readWorkspace().publications.find(site => site.slug === route.value)?.snapshot || null;
  }
  if (!supabase || route.kind === 'invalid') return null;
  let query = supabase.from('website_publications').select('snapshot');
  if (route.kind === 'domain') {
    const domain = unwrap(await supabase.from('website_domains').select('website_id').eq('hostname', route.value).eq('verified', true).maybeSingle());
    if (!domain) return null;
    query = query.eq('id', domain.website_id);
  } else if (route.kind === 'slug') query = query.eq('slug', route.value);
  else return null;
  return unwrap(await query.maybeSingle())?.snapshot || null;
}

export async function websiteDomains(id) {
  if (!supabase) return [];
  return unwrap(await supabase.from('website_domains').select('hostname,verified').eq('website_id', id));
}
