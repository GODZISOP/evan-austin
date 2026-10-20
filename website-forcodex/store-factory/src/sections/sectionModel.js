export const BLOCKS = {
  heading: { label: 'Heading', defaults: { text: 'Your section heading', level: 'h2' } },
  paragraph: { label: 'Paragraph', defaults: { text: 'Describe your service and what visitors can expect.' } },
  button: { label: 'Button', defaults: { text: 'Contact us', url: '', newTab: false } },
  image: { label: 'Image', defaults: { url: '', alt: '' } },
  icon: { label: 'Icon', defaults: { icon: 'check', label: 'Your icon label' } },
  badge: { label: 'Badge', defaults: { text: 'Your label' } },
  stats: { label: 'Stats', defaults: { value: '', label: 'Add a verified statistic' } },
  service: { label: 'Service Card', defaults: { title: 'Your service', text: 'Explain what this service includes.', icon: 'briefcase', url: '', linkText: 'View service' } },
  testimonial: { label: 'Testimonial', defaults: { quote: '', author: '', role: '' } },
  logo: { label: 'Logo', defaults: { url: '', alt: '', link: '' } },
  divider: { label: 'Divider', defaults: {} },
  spacer: { label: 'Spacer', defaults: { height: 32 } },
  video: { label: 'Video', defaults: { url: '', title: 'Video', poster: '' } },
  list: { label: 'List', defaults: { items: 'First item\nSecond item\nThird item', ordered: false } },
  contact: { label: 'Contact Detail', defaults: { label: 'Email us', value: '', kind: 'email' } },
};

export const LAYOUTS = {
  one: { label: '1 column', count: 1 }, two: { label: '2 columns', count: 2 },
  three: { label: '3 columns', count: 3 }, four: { label: '4 columns', count: 4 },
  split: { label: 'Split layout', count: 2 }, grid: { label: 'Grid layout', count: 3 },
  stacked: { label: 'Stacked layout', count: 1 },
};
export const DEVICES = ['desktop', 'tablet', 'mobile'];
export const BASE_STYLE = {
  width: 100, maxWidth: 1120, paddingTop: 64, paddingBottom: 64, paddingX: 24,
  columnGap: 32, rowGap: 24, align: 'start', textAlign: 'left', background: '#ffffff',
  backgroundImage: '', color: '#24382f', borderWidth: 0, borderColor: '#d7ddd3',
  radius: 0, shadow: 'none', headingSize: 40, bodySize: 17, fontWeight: 400,
  buttonStyle: 'solid', buttonColor: '#235544', buttonTextColor: '#ffffff',
  imageWidth: 100, imagePosition: 'center', imageRadius: 8, hidden: false,
};
const numeric = {
  width: [20, 100], maxWidth: [280, 1800], paddingTop: [0, 240], paddingBottom: [0, 240], paddingX: [0, 120],
  columnGap: [0, 120], rowGap: [0, 120], borderWidth: [0, 12], radius: [0, 100],
  headingSize: [16, 120], bodySize: [12, 40], fontWeight: [300, 900], imageWidth: [10, 100], imageRadius: [0, 100], columns: [1, 4],
};
const enums = {
  align: ['start', 'center', 'end', 'stretch'], textAlign: ['left', 'center', 'right'],
  shadow: ['none', 'soft', 'medium', 'strong'], buttonStyle: ['solid', 'outline', 'text'],
  imagePosition: ['left', 'center', 'right', 'top', 'bottom'],
};
export const uid = () => crypto.randomUUID();
export function createBlock(type) {
  if (!BLOCKS[type]) throw new Error('Choose a supported block.');
  return { id: uid(), type, content: { ...BLOCKS[type].defaults }, styles: { desktop: {}, tablet: {}, mobile: {} } };
}
export function createSection() {
  return {
    id: uid(), name: 'Untitled section', layout: 'one',
    columns: [{ id: uid(), blocks: [] }],
    styles: { desktop: { ...BASE_STYLE }, tablet: { headingSize: 32, paddingTop: 48, paddingBottom: 48, columns: 2 }, mobile: { headingSize: 28, paddingTop: 32, paddingBottom: 32, paddingX: 16, columns: 1 } },
  };
}
export function cloneSection(section) {
  return { ...structuredClone(section), id: uid(), columns: section.columns.map(c => ({ ...structuredClone(c), id: uid(), blocks: c.blocks.map(b => ({ ...structuredClone(b), id: uid() })) })) };
}
export function changeLayout(section, layout) {
  if (!LAYOUTS[layout]) return section;
  const count = LAYOUTS[layout].count;
  const columns = section.columns.slice(0, count).map(c => ({ ...c, blocks: [...c.blocks] }));
  while (columns.length < count) columns.push({ id: uid(), blocks: [] });
  for (const removed of section.columns.slice(count)) columns[count - 1].blocks.push(...removed.blocks);
  const desktop = { ...section.styles.desktop };
  delete desktop.columns;
  return { ...section, layout, columns, styles: { ...section.styles, desktop } };
}
export function moveBlock(section, blockId, targetColumnId, beforeBlockId = null) {
  if (blockId === beforeBlockId || !section.columns.some(c => c.id === targetColumnId)) return section;
  const block = section.columns.flatMap(c => c.blocks).find(b => b.id === blockId);
  if (!block) return section;
  const columns = section.columns.map(c => ({ ...c, blocks: c.blocks.filter(b => b.id !== blockId) }));
  const target = columns.find(c => c.id === targetColumnId);
  const before = target.blocks.findIndex(b => b.id === beforeBlockId);
  target.blocks.splice(before < 0 ? target.blocks.length : before, 0, block);
  return { ...section, columns };
}
export function reorder(items, id, beforeId) {
  if (id === beforeId) return items;
  const item = items.find(s => s.id === id);
  if (!item) return items;
  const next = items.filter(s => s.id !== id);
  const index = next.findIndex(s => s.id === beforeId);
  next.splice(index < 0 ? next.length : index, 0, item);
  return next;
}
export function effectiveStyle(styles, device) {
  return { ...BASE_STYLE, ...styles?.desktop, ...(device !== 'desktop' ? styles?.tablet : {}), ...(device === 'mobile' ? styles?.mobile : {}) };
}
export function blockStyle(block, device) {
  return { ...block.styles?.desktop, ...(device !== 'desktop' ? block.styles?.tablet : {}), ...(device === 'mobile' ? block.styles?.mobile : {}) };
}
export function safeLink(value) {
  if (typeof value !== 'string' || /[\x00-\x20\\]/.test(value)) return '';
  if (/^#[\w-]+$/.test(value) || /^\/(?!\/)/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) && !url.username && !url.password ? value : '';
  } catch { return ''; }
}
export function safeMedia(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function videoSource(value) {
  const safe = safeMedia(value);
  if (!safe) return null;
  const u = new URL(safe);
  if (['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(u.hostname)) {
    const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') || u.pathname.split('/').at(-1);
    return /^[\w-]{11}$/.test(id || '') ? { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${id}` } : null;
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(u.hostname)) {
    const id = u.pathname.split('/').at(-1);
    return /^\d+$/.test(id || '') ? { type: 'embed', url: `https://player.vimeo.com/video/${id}` } : null;
  }
  return /\.(mp4|webm|ogg)$/i.test(u.pathname) ? { type: 'file', url: safe } : null;
}
function cleanStyles(styles = {}) {
  const result = {};
  for (const device of DEVICES) {
    result[device] = {};
    for (const [key, value] of Object.entries(styles[device] || {})) {
      if (numeric[key] && Number.isFinite(Number(value))) result[device][key] = Math.max(numeric[key][0], Math.min(numeric[key][1], Number(value)));
      else if (enums[key]?.includes(value)) result[device][key] = value;
      else if (['background', 'color', 'borderColor', 'buttonColor', 'buttonTextColor'].includes(key) && /^#[\da-f]{6}$/i.test(value)) result[device][key] = value;
      else if (key === 'backgroundImage') result[device][key] = safeMedia(value);
      else if (key === 'hidden' && typeof value === 'boolean') result[device][key] = value;
    }
  }
  return result;
}
export function validateSections(sections = []) {
  if (!Array.isArray(sections) || sections.length > 50) throw new Error('A page supports up to 50 custom sections.');
  const ids = new Set();
  const checkId = value => {
    if (typeof value !== 'string' || !/^[\w-]{1,80}$/.test(value) || ids.has(value)) throw new Error('Section, column and block identifiers must be unique.');
    ids.add(value); return value;
  };
  return sections.map(s => {
    if (!LAYOUTS[s.layout] || !Array.isArray(s.columns) || s.columns.length !== LAYOUTS[s.layout].count) throw new Error('A section has an invalid column layout.');
    return {
      id: checkId(s.id), name: String(s.name || 'Untitled section').slice(0, 120), layout: s.layout, styles: cleanStyles(s.styles),
      columns: s.columns.map(c => {
        if (!Array.isArray(c.blocks) || c.blocks.length > 100) throw new Error('A column supports up to 100 blocks.');
        return { id: checkId(c.id), blocks: c.blocks.map(b => {
          if (!BLOCKS[b.type]) throw new Error('This section contains an unsupported block.');
          const content = {};
          for (const [key, fallback] of Object.entries(BLOCKS[b.type].defaults)) {
            const val = b.content?.[key];
            content[key] = typeof fallback === 'boolean' ? Boolean(val) : typeof fallback === 'number' ? Math.max(0, Math.min(240, Number(val) || 0)) : String(val ?? fallback).slice(0, 10000);
          }
          return { id: checkId(b.id), type: b.type, content, styles: cleanStyles(b.styles) };
        }) };
      }),
    };
  });
}
