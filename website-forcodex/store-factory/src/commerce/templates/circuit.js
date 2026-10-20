export function uid() {
  return crypto.randomUUID();
}

export const circuitTheme = {
  id: 'circuit',
  name: 'Circuit Supply',
  niche: 'Electronics & Audio Technology',
  type: 'ecommerce',
  color: '#243c7b',
  background: '#f5f6fa',
  font: 'modern',
  hero: '/commerce/headphones.webp',
  title: 'Make room for better sound.',
  layout: 'split',
  card: 'solid',
  radius: 12
};

export function createCircuitStore() {
  return {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Circuit Supply',
    slug: 'electronics-demo',
    theme: 'circuit',
    sample: true,
    client: {
      name: 'Circuit Supply Co.',
      email: 'support@circuitsupply.io',
      domain: 'circuitsupply.io',
      type: 'ecommerce'
    },
    settings: {
      color: '#243c7b',
      background: '#f5f6fa',
      font: 'modern',
      radius: 12,
      width: 1360,
      spacing: 'regular',
      header: 'catalogue',
      footer: 'columns',
      card: 'solid',
      gallery: 'split',
      button: 'solid',
      logo: '',
      announcement: '⚡ Ultra-Fast 24h Dispatch on All Audio & Creator Tech',
      currency: 'USD',
      email: 'support@circuitsupply.io',
      phone: '+1 (888) 920-TECH',
      whatsapp: '',
      address: '500 Technology Way, Silicon Valley, CA 94025',
      shippingInfo: 'Antistatic, tamper-proof packaging with 2-year warranty on all electronics.',
      shippingMethods: [
        { id: uid(), name: 'Ground Insured Freight (3–5 Days)', price: 0 },
        { id: uid(), name: 'Air Express Expedited (Next Day)', price: 18 }
      ],
      coupons: [
        { id: uid(), code: 'CIRCUIT10', type: 'percent', amount: 10, enabled: true }
      ],
      nav: ['shop', 'collections', 'services', 'about', 'contact'],
      footerText: 'Engineered acoustics, visual equipment, and everyday productivity gear.'
    },
    categories: ['Audio & Sound', 'Cameras & Video', 'Everyday Carry', 'Workstation'],
    collections: [
      { id: 'col-audio', name: 'Acoustic Sound', description: 'Studio monitoring headphones and wireless spatial audio.', image: '/commerce/headphones.webp' },
      { id: 'col-imaging', name: 'Creator Imaging', description: 'Pocket 4K cameras and optical stabilization tools.', image: '/commerce/camera.webp' }
    ],
    products: [
      {
        id: uid(),
        name: 'Studio Pro Wireless Headphones',
        sku: 'CKT-AUD-01',
        price: 189,
        salePrice: 149,
        stock: 35,
        status: 'published',
        images: ['/commerce/headphones.webp'],
        category: 'Audio & Sound',
        collections: ['col-audio'],
        description: 'Titanium-driver hybrid ANC headphones engineered for studio acoustics and low-latency wireless streaming.',
        specifications: 'Drivers: 40mm Titanium · Battery: 40 Hours · Bluetooth 5.3 + AAC/LDAC · Weight: 260g',
        shipping: 'Includes protective hard travel case and braided auxiliary cable.',
        featured: true,
        bestSeller: true,
        variants: [
          { id: uid(), name: 'Matte Slate', size: 'Over-Ear', color: 'Matte Slate', sku: 'CKT-AUD-01-SLT', price: 149, stock: 20 },
          { id: uid(), name: 'Cobalt Blue', size: 'Over-Ear', color: 'Cobalt Blue', sku: 'CKT-AUD-01-CBL', price: 149, stock: 15 }
        ],
        reviews: [
          { id: uid(), name: 'Marcus L.', rating: 5, text: 'Outstanding clarity in the mids and crisp punchy bass. Best headphones under $200.' }
        ]
      },
      {
        id: uid(),
        name: 'Precision Compact 4K Camera',
        sku: 'CKT-CAM-02',
        price: 349,
        salePrice: 299,
        stock: 14,
        status: 'published',
        images: ['/commerce/camera.webp'],
        category: 'Cameras & Video',
        collections: ['col-imaging'],
        description: 'Ultra-portable 4K 60fps digital camera with bright f/1.8 lens and fast phase-detect autofocus.',
        specifications: 'Sensor: 1-inch 20.1MP CMOS · 4K 60p HDR Video · Flip-Up Touchscreen · USB-C Live Stream Capable',
        shipping: 'Includes 64GB high-speed memory card and dual charger.',
        featured: true,
        bestSeller: true,
        variants: [],
        reviews: []
      },
      {
        id: uid(),
        name: 'Minimal Steel Chrono',
        sku: 'CKT-ACC-03',
        price: 129,
        salePrice: 99,
        stock: 20,
        status: 'published',
        images: ['/commerce/watch.webp'],
        category: 'Everyday Carry',
        collections: ['col-audio'],
        description: 'Sleek industrial chronograph with matte gunmetal finish and sapphire anti-scratch glass.',
        specifications: 'Case: 41mm 316L Stainless Steel · Quartz Movement · 5 ATM Water Resistant',
        shipping: 'Includes metal link adjustment tool.',
        featured: false,
        bestSeller: false,
        variants: [],
        reviews: []
      }
    ],
    sectionLibrary: [],
    pages: {
      home: [
        { id: uid(), type: 'hero', visible: true, layout: 'split', spacing: 'regular', background: 'default', title: 'Make room for better sound.', text: 'High fidelity audio, digital imaging, and workstation essentials engineered for modern creators.', image: '/commerce/headphones.webp', button: 'Explore Devices', target: 'shop', items: [] },
        { id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Hardware Categories', items: [] },
        { id: uid(), type: 'products', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Top Rated Tech', source: 'featured', limit: 4, items: [] },
        { id: uid(), type: 'banner', visible: true, layout: 'split', spacing: 'regular', background: 'muted', title: 'Studio Acoustic Precision', text: 'Tuned by acoustic engineers with custom drivers and zero distortion at high gain.', image: '/commerce/camera.webp', button: 'View Catalogue', target: 'shop', items: [] }
      ],
      shop: [{ id: uid(), type: 'catalog', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Circuit Hardware Catalog', items: [] }],
      product: [{ id: uid(), type: 'product', visible: true, items: [] }],
      cart: [{ id: uid(), type: 'cart', visible: true, items: [] }],
      checkout: [{ id: uid(), type: 'checkout', visible: true, items: [] }],
      collections: [{ id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Collections', items: [] }],
      services: [{ id: uid(), type: 'services', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Enterprise Hardware & Fleet Sourcing', items: [] }],
      about: [{ id: uid(), type: 'richtext', visible: true, layout: 'split', spacing: 'regular', background: 'default', title: 'The Circuit Philosophy', text: 'Hardware that gets out of the way. Clean lines, tactile controls, and durable materials designed to outlast trend cycles.', image: '/commerce/headphones.webp', items: [] }],
      contact: [{ id: uid(), type: 'contact', visible: true, spacing: 'regular', background: 'default', title: 'Technical Support & Sales', items: [] }],
      faq: [{ id: uid(), type: 'faq', visible: true, layout: 'list', spacing: 'regular', background: 'default', title: 'Support & Compatibility', items: [] }],
      search: [{ id: uid(), type: 'search', visible: true, title: 'Search Circuit Hardware', items: [] }],
      notfound: [{ id: uid(), type: 'notfound', visible: true, title: 'Hardware Not Found', text: 'Browse our current inventory in the shop.', items: [] }]
    }
  };
}
