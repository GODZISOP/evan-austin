import { findTemplate, websiteTemplates } from './website-templates.js';
import { validSlug, resolveTenant, normalizeHost } from './model.js';

export const pageNames = { home: 'Home', services: 'Services', about: 'About', contact: 'Contact' };
export const draftStorageKey = 'website-factory:workspace:v1';

export function newWebsite(template = 'agency') {
  return {
    id: crypto.randomUUID(), name: '', slug: '', template,
    brand_color: findTemplate(template).color,
    content: {
      logo: '', heroTitle: '', heroText: '', heroImage: findTemplate(template).image, heroImageAlt: `${findTemplate(template).name} stock photograph`,
      aboutTitle: 'About us', about: '', aboutImage: '', aboutImageAlt: '',
      email: '', phone: '', whatsapp: '', address: '', services: [],
      pageMode: 'landing', pages: ['home', 'services', 'about', 'contact'],
    },
  };
}

export function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 63).replace(/-$/, '');
}

export function safeWebsiteImage(value) {
  if (/^\/template-images\/(agency|construction|cleaning|healthcare|fitness|amazon|restaurant|real-estate|lawyer|consulting)\.webp$/.test(value)) return true;
  if (/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}

export function validateWebsite(value, publishing = false) {
  if (!value || typeof value !== 'object') throw new Error('The website data could not be read.');
  if (typeof value.name !== 'string' || !value.name.trim()) throw new Error('Enter the client’s business name.');
  if (value.name.length > 120) throw new Error('Keep the business name within 120 characters.');
  if (!validSlug(value.slug)) throw new Error('Use a website address with lowercase letters, numbers and hyphens, up to 63 characters. Names such as admin and www are reserved.');
  if (!websiteTemplates.some(template => template.id === value.template)) throw new Error('Select a website template.');
  if (!/^#[0-9a-f]{6}$/i.test(value.brand_color)) throw new Error('Choose a valid brand colour.');
  const content = value.content;
  if (!content || !Array.isArray(content.services) || !Array.isArray(content.pages)) throw new Error('The website content is invalid.');
  if (!['landing', 'pages'].includes(content.pageMode)) throw new Error('Choose a landing page or separate pages.');
  if (!content.pages.includes('home') || content.pages.some(page => !pageNames[page]) || new Set(content.pages).size !== content.pages.length) throw new Error('Choose Home and up to three additional pages.');
  for (const field of ['logo', 'heroTitle', 'heroText', 'heroImage', 'heroImageAlt', 'aboutTitle', 'about', 'aboutImage', 'aboutImageAlt', 'email', 'phone', 'whatsapp', 'address']) {
    if (typeof content[field] !== 'string') throw new Error(`The ${field} field must be text.`);
    if (content[field].length > (field.toLowerCase().includes('image') || field === 'logo' ? 750000 : 10000)) throw new Error(`The ${field} field is too large.`);
  }
  if (content.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) throw new Error('Check the contact email address.');
  if (content.phone && !/^\+?[\d\s().-]{7,25}$/.test(content.phone)) throw new Error('Check the phone number.');
  if (content.whatsapp && !/^\+?[1-9]\d{7,14}$/.test(content.whatsapp)) throw new Error('WhatsApp needs a country code and 8–15 digits, without spaces.');
  const images = [content.logo, content.heroImage, content.aboutImage];
  const ids = new Set();
  if (content.services.length > 30) throw new Error('Use up to 30 services per website.');
  for (const service of content.services) {
    if (!service.id || ids.has(service.id) || typeof service.title !== 'string' || typeof service.description !== 'string' || typeof service.image !== 'string') throw new Error('Each service needs a unique identifier and text fields.');
    if (!service.title.trim()) throw new Error('Give each service a title, or remove the empty service.');
    ids.add(service.id);
    images.push(service.image);
  }
  if (images.some(image => image && !safeWebsiteImage(image))) throw new Error('Use an HTTPS image URL or an uploaded PNG, JPEG or WebP image.');
  if (JSON.stringify(value).length > 3500000) throw new Error('This website is too large. Use hosted image URLs or smaller photos.');
  if (publishing) {
    if (!content.heroTitle.trim() || !content.heroText.trim()) throw new Error('Add a headline and introduction before publishing.');
    if (content.pages.includes('services') && !content.services.length) throw new Error('Add a service or switch off the Services page.');
    if (content.pages.includes('about') && !content.about.trim()) throw new Error('Add an About description or switch off the About page.');
    if (!content.phone && !content.whatsapp && !content.email) throw new Error('Add a phone number, WhatsApp or email before publishing.');
  }
  return { ...value, name: value.name.trim(), content: structuredClone(content) };
}

export function websiteRoute(options) {
  const params = new URLSearchParams(options.search || '');
  if (params.has('site')) params.set('store', params.get('site'));
  return resolveTenant({ ...options, search: params.toString() });
}

export function websiteUrl(site, { origin, hostname, platformDomain = '', demo = false }) {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(normalizeHost(hostname));
  const root = normalizeHost(platformDomain);
  if (!demo && !local && root) return `https://${site.slug}.${root}/`;
  return `${origin}/?site=${encodeURIComponent(site.slug)}${demo ? '&demo=1' : ''}`;
}

export function foregroundFor(hex) {
  const rgb = hex.slice(1).match(/../g).map(part => parseInt(part, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  return (luminance + .05) / .05 > 1.05 / (luminance + .05) ? '#000000' : '#ffffff';
}
