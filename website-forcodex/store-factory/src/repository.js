import { createClient } from '@supabase/supabase-js';
import { demoStores } from './data.js';
import { validateStore } from './model.js';
import { validateSections } from './sections/sectionModel.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key);
export const configError = Boolean(url) !== Boolean(key);
export const supabase = configured ? createClient(url, key) : null;
const storageKey = 'store-factory:stores:v1';

function localStores() {
  let raw;
  try { raw = localStorage.getItem(storageKey); } catch { throw new Error('Browser storage is unavailable. Allow site storage to use the local demo.'); }
  if (!raw) return demoStores();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error();
    return parsed.map(validateStore);
  } catch { throw new Error('Saved demo data could not be read. Export browser storage before clearing this site’s data, then reload.'); }
}

function result(data, error) {
  if (error) throw new Error(error.code === '23505' ? 'That store address is already taken. Choose another.' : error.message);
  return data;
}

export async function listStores(user, demo = false) {
  if (demo || !supabase) return localStores();
  if (!user) return [];
  const { data, error } = await supabase.from('stores').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });
  return result(data, error);
}

export async function saveStore(value, user, demo = false) {
  const store = validateStore(value);
  store.custom_sections = validateSections(store.custom_sections || []);
  if (demo || !supabase) {
    const all = localStores();
    if (all.some(s => s.slug === store.slug && s.id !== store.id)) throw new Error('That store address is already taken. Choose another.');
    const next = all.some(s => s.id === store.id) ? all.map(s => s.id === store.id ? store : s) : [store, ...all];
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { throw new Error('The browser could not save your changes. Check available storage and try again.'); }
    return store;
  }
  if (!user) throw new Error('Sign in before saving a store.');
  const fields = ['id', 'slug', 'name', 'tagline', 'announcement', 'email', 'phone', 'whatsapp', 'address', 'brand_color', 'currency', 'template', 'site_mode', 'show_catalogue', 'custom_sections', 'published', 'products'];
  const payload = Object.fromEntries(fields.map(field => [field, store[field]]));
  const { data, error } = await supabase.from('stores').upsert({ ...payload, owner_id: user.id }).select().single();
  return result(data, error);
}

const libraryKey = 'store-factory:section-library:v1';
export async function listSectionLibrary(user, demo = false) {
  if (!supabase || demo) {
    let parsed;
    try { parsed = JSON.parse(localStorage.getItem(libraryKey) || '[]'); }
    catch { throw new Error('The local section library could not be read.'); }
    if (!Array.isArray(parsed)) throw new Error('The local section library is invalid.');
    return parsed;
  }
  if (!user) return [];
  const { data, error } = await supabase.from('theme_section_library').select('id,name,section,updated_at').eq('owner_id', user.id).order('updated_at', { ascending: false });
  return result(data, error);
}

export async function saveLibrarySection(name, section, user, demo = false, libraryId = null) {
  const safeName = String(name || '').trim().slice(0, 120);
  if (!safeName) throw new Error('Give this section a name before saving it.');
  const clean = validateSections([section])[0];
  if (!supabase || demo) {
    const library = await listSectionLibrary(user, true);
    const id = libraryId || crypto.randomUUID();
    const record = { id, name: safeName, section: clean, updated_at: new Date().toISOString() };
    const next = library.some(item => item.id === id) ? library.map(item => item.id === id ? record : item) : [record, ...library];
    try { localStorage.setItem(libraryKey, JSON.stringify(next)); } catch { throw new Error('Browser storage is full. Remove some saved sections and try again.'); }
    return record;
  }
  if (!user) throw new Error('Sign in before saving to the shared section library.');
  const payload = { name: safeName, section: clean, owner_id: user.id };
  if (libraryId) payload.id = libraryId;
  const { data, error } = await supabase.from('theme_section_library').upsert(payload).select('id,name,section,updated_at').single();
  return result(data, error);
}

export async function deleteLibrarySection(id, user, demo = false) {
  if (!supabase || demo) {
    const library = await listSectionLibrary(user, true);
    try { localStorage.setItem(libraryKey, JSON.stringify(library.filter(item => item.id !== id))); }
    catch { throw new Error('Could not update the local section library.'); }
    return;
  }
  if (!user) throw new Error('Sign in before editing the shared library.');
  const { error } = await supabase.from('theme_section_library').delete().eq('id', id).eq('owner_id', user.id);
  result(null, error);
}

export async function getStore(route, demo = false) {
  if (demo || !supabase) {
    if (route.kind !== 'slug') return null;
    return localStores().find(s => s.slug === route.value && s.published) || null;
  }
  let query = supabase.from('stores').select('*').eq('published', true);
  if (route.kind === 'domain') {
    const { data, error } = await supabase.from('store_domains').select('store_id').eq('hostname', route.value).eq('verified', true).maybeSingle();
    result(data, error);
    if (!data) return null;
    query = query.eq('id', data.store_id);
  } else if (route.kind === 'slug') query = query.eq('slug', route.value);
  else return null;
  const { data, error } = await query.maybeSingle();
  return result(data, error);
}

export async function getDomains(storeId) {
  if (!supabase) return [];
  const { data, error } = await supabase.from('store_domains').select('hostname,verified').eq('store_id', storeId);
  return result(data, error);
}
