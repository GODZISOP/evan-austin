export const currencies = ['USD', 'AED', 'PKR'];
export const templates = ['essentials', 'editorial', 'wholesale'];
const reserved = new Set(['www', 'admin', 'api', 'app', 'auth', 'assets']);

export function validSlug(value) {
  return typeof value === 'string' && value.length <= 63 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) && !reserved.has(value);
}

export function normalizeHost(value) {
  return String(value || '').toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
}

export function resolveTenant({ hostname, search = '', platformDomain = '', deploymentHost = '' }) {
  const host = normalizeHost(hostname);
  const root = normalizeHost(platformDomain);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(host);
  const platform = local || (root && (host === root || host === `www.${root}`)) || host === normalizeHost(deploymentHost);
  if (platform) {
    const slug = new URLSearchParams(search).get('store');
    return slug === null ? { kind: 'platform' } : validSlug(slug) ? { kind: 'slug', value: slug } : { kind: 'invalid' };
  }
  if (root && host.endsWith(`.${root}`)) {
    const slug = host.slice(0, -(root.length + 1));
    return validSlug(slug) ? { kind: 'slug', value: slug } : { kind: 'invalid' };
  }
  return { kind: 'domain', value: host };
}

export function blankStore() {
  return { id: crypto.randomUUID(), slug: '', name: '', tagline: '', announcement: '', email: '', phone: '', whatsapp: '', address: '', brand_color: '#235544', currency: 'USD', template: 'essentials', site_mode: 'catalogue', show_catalogue: false, custom_sections: [], published: false, products: [] };
}

export function validateStore(store) {
  if (!store.name.trim()) throw new Error('Enter a store name.');
  if (!validSlug(store.slug)) throw new Error('Use a unique store address with lowercase letters, numbers and hyphens (up to 63 characters). Avoid reserved names such as admin or www.');
  if (!/^#[\da-f]{6}$/i.test(store.brand_color)) throw new Error('Choose a valid brand colour.');
  if (!currencies.includes(store.currency) || !templates.includes(store.template)) throw new Error('Choose a supported currency and template.');
  if (store.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.email)) throw new Error('Check the contact email address.');
  if (store.whatsapp && !/^\+?[1-9]\d{7,14}$/.test(store.whatsapp)) throw new Error('Use a WhatsApp country code and 8 to 15 digits, without spaces.');
  if (!Array.isArray(store.products)) throw new Error('The product list is invalid.');
  const ids = new Set();
  for (const p of store.products) {
    if (!p.id || ids.has(p.id)) throw new Error('Product identifiers must be unique.');
    ids.add(p.id);
    if (!p.name.trim() || !p.sku.trim()) throw new Error('Each product needs a name and SKU.');
    if (p.price === '' || !Number.isFinite(Number(p.price)) || Number(p.price) < 0 || Number(p.price) > 100000000) throw new Error('Product prices must be between 0 and 100,000,000.');
    if (p.image && !safeImage(p.image)) throw new Error('Product images must use an https:// URL.');
  }
  if (new Set(store.products.map(p => p.sku.toLowerCase())).size !== store.products.length) throw new Error('Each product needs a different SKU.');
  return { ...store, name: store.name.trim(), products: store.products.map(p => ({ ...p, price: Math.round(Number(p.price) * 100) / 100 })) };
}

export function safeImage(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; }
}

export function money(amount, currency) {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount);
}

export function orderSummary(store, quantities) {
  const lines = store.products.filter(p => Number.isInteger(quantities[p.id]) && quantities[p.id] > 0 && quantities[p.id] <= 99).map(p => ({ ...p, quantity: quantities[p.id] }));
  const cents = lines.reduce((total, p) => total + Math.round(p.price * 100) * p.quantity, 0);
  return { lines, total: cents / 100, message: `Hello ${store.name}, I would like to request an order:\n\n${lines.map(p => `${p.quantity} x ${p.name} (${p.sku}) - ${money(Math.round(p.price * 100) * p.quantity / 100, store.currency)}`).join('\n')}\n\nSubtotal: ${money(cents / 100, store.currency)}\nPlease confirm availability, delivery charges and payment details.` };
}
