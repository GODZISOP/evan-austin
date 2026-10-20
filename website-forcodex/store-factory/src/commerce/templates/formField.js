export function uid() {
  return crypto.randomUUID();
}

export const formFieldTheme = {
  id: 'form',
  name: 'Form & Field',
  niche: 'Home Interiors & Architectural Objects',
  type: 'ecommerce',
  color: '#794b37',
  background: '#f4eee4',
  font: 'serif',
  hero: '/template-images/cleaning.webp',
  title: 'Objects for a life well lived.',
  layout: 'editorial',
  card: 'framed',
  radius: 2
};

export function createFormFieldStore() {
  return {
    id: '00000000-0000-4000-8000-000000000004',
    name: 'Form & Field',
    slug: 'home-interiors-demo',
    theme: 'form',
    sample: true,
    client: {
      name: 'Form & Field Living',
      email: 'studio@formandfield.com',
      domain: 'formandfield.com',
      type: 'ecommerce'
    },
    settings: {
      color: '#794b37',
      background: '#f4eee4',
      font: 'serif',
      radius: 2,
      width: 1320,
      spacing: 'regular',
      header: 'centered',
      footer: 'columns',
      card: 'framed',
      gallery: 'split',
      button: 'solid',
      logo: '',
      announcement: 'Handcrafted stoneware and architectural lighting with complimentary domestic freight',
      currency: 'USD',
      email: 'studio@formandfield.com',
      phone: '+1 (800) 412-HOME',
      whatsapp: '',
      address: '104 Mercer Street, New York, NY 10012',
      shippingInfo: 'Custom double-boxed reinforced shipping with white-glove courier handling for delicate lighting.',
      shippingMethods: [
        { id: uid(), name: 'Standard Fragile Freight (3–5 Days)', price: 0 },
        { id: uid(), name: 'White Glove Inside Delivery', price: 45 }
      ],
      coupons: [
        { id: uid(), code: 'FORM10', type: 'percent', amount: 10, enabled: true }
      ],
      nav: ['shop', 'collections', 'about', 'contact'],
      footerText: 'Thoughtfully designed objects and furniture that bring serenity, proportion, and quiet warmth to daily living.'
    },
    categories: ['Lighting & Lamps', 'Stoneware & Vessels', 'Workstation Objects'],
    collections: [
      { id: 'col-lighting', name: 'Architectural Lighting', description: 'Diffused task lighting and sculpted cast-metal table lamps.', image: '/commerce/headphones.webp' },
      { id: 'col-vessels', name: 'Ceramics & Vessels', description: 'Hand-thrown stoneware finished with raw mineral glazes.', image: '/template-images/cleaning.webp' }
    ],
    products: [
      {
        id: uid(),
        name: 'Nordic Articulated Desk Lamp',
        sku: 'FRM-LMP-01',
        price: 89,
        salePrice: 72,
        stock: 24,
        status: 'published',
        images: ['/commerce/trade-forest.png'],
        category: 'Lighting & Lamps',
        collections: ['col-lighting'],
        description: 'Solid cast-metal architect task lamp engineered with tensioned counterbalanced joints and warm diffused LED illumination.',
        specifications: 'Material: Cast Aluminum & Steel · Finish: Matte Forest Green · Light: 12W Warm Dimmable LED (Included) · Cord: 2m Braided Fabric',
        shipping: 'Shock-proof molded cardboard packaging with spare LED bulb.',
        featured: true,
        bestSeller: true,
        variants: [
          { id: uid(), name: 'Matte Forest Green', size: 'Standard', color: 'Forest Green', sku: 'FRM-LMP-01-GRN', price: 72, stock: 14 },
          { id: uid(), name: 'Brushed Brass', size: 'Standard', color: 'Brushed Brass', sku: 'FRM-LMP-01-BRS', price: 82, stock: 10 }
        ],
        reviews: [
          { id: uid(), name: 'Julian K.', rating: 5, text: 'The build quality is exceptional for the price point. The dimming control is very smooth.' }
        ]
      },
      {
        id: uid(),
        name: 'Minimal Chronograph Accent Clock',
        sku: 'FRM-CLK-02',
        price: 110,
        salePrice: 89,
        stock: 18,
        status: 'published',
        images: ['/commerce/watch.webp'],
        category: 'Workstation Objects',
        collections: ['col-vessels'],
        description: 'Machined aluminum desk timepiece with silent sweeping Japanese quartz mechanism and mineral glass front.',
        specifications: 'Dimensions: 10cm x 10cm x 4cm · Power: 1x AA Battery (Included) · Mechanism: Silent Sweep',
        shipping: 'Gift boxed with custom foam insert.',
        featured: true,
        bestSeller: false,
        variants: [],
        reviews: []
      }
    ],
    sectionLibrary: [],
    pages: {
      home: [
        { id: uid(), type: 'hero', visible: true, layout: 'editorial', spacing: 'regular', background: 'default', title: 'Objects for a life well lived.', text: 'Quiet forms, honest materials, and architectural utility designed for spaces of calm and contemplation.', image: '/template-images/cleaning.webp', button: 'View the Collection', target: 'shop', items: [] },
        { id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Design Disciplines', items: [] },
        { id: uid(), type: 'products', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Curated Objects', source: 'featured', limit: 4, items: [] },
        { id: uid(), type: 'banner', visible: true, layout: 'split', spacing: 'regular', background: 'muted', title: 'Honest Materials. Living Finishes.', text: 'Every vessel and lighting piece is designed to patinate and gather character with age and use.', image: '/commerce/trade-forest.png', button: 'Explore Lighting', target: 'shop', items: [] }
      ],
      shop: [{ id: uid(), type: 'catalog', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'The Living Catalog', items: [] }],
      product: [{ id: uid(), type: 'product', visible: true, items: [] }],
      cart: [{ id: uid(), type: 'cart', visible: true, items: [] }],
      checkout: [{ id: uid(), type: 'checkout', visible: true, items: [] }],
      collections: [{ id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Collections', items: [] }],
      services: [{ id: uid(), type: 'services', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Interior Trade & Architecture Sourcing', items: [] }],
      about: [{ id: uid(), type: 'richtext', visible: true, layout: 'editorial', spacing: 'regular', background: 'default', title: 'Proportion and Serenity', text: 'Form & Field began with an appreciation for spaces stripped of excess ornament, where light and material take center stage.', image: '/template-images/cleaning.webp', items: [] }],
      contact: [{ id: uid(), type: 'contact', visible: true, spacing: 'regular', background: 'default', title: 'Studio Inquiries', items: [] }],
      faq: [{ id: uid(), type: 'faq', visible: true, layout: 'list', spacing: 'regular', background: 'default', title: 'Shipping & Care Guide', items: [] }],
      search: [{ id: uid(), type: 'search', visible: true, title: 'Search Form & Field', items: [] }],
      notfound: [{ id: uid(), type: 'notfound', visible: true, title: 'Object Not Found', text: 'Browse our full interior catalog.', items: [] }]
    }
  };
}
