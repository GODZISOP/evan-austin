export function uid() {
  return crypto.randomUUID();
}

export const atelierTheme = {
  id: 'atelier',
  name: 'Atelier Studio',
  niche: 'Fashion & Luxury Apparel',
  type: 'ecommerce',
  color: '#384537',
  background: '#f6f4ef',
  font: 'editorial',
  hero: '/commerce/fashion.webp',
  title: 'A little less ordinary.',
  layout: 'split',
  card: 'minimal',
  radius: 0
};

export function createAtelierStore() {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Atelier Studio',
    slug: 'fashion-demo',
    theme: 'atelier',
    sample: true,
    client: {
      name: 'Atelier Studio',
      email: 'concierge@atelierstudio.com',
      domain: 'atelierstudio.com',
      type: 'ecommerce'
    },
    settings: {
      color: '#384537',
      background: '#f6f4ef',
      font: 'editorial',
      radius: 0,
      width: 1360,
      spacing: 'regular',
      header: 'balanced',
      footer: 'columns',
      card: 'minimal',
      gallery: 'split',
      button: 'solid',
      logo: '',
      announcement: 'Complimentary shipping on seasonal orders over $150',
      currency: 'USD',
      email: 'concierge@atelierstudio.com',
      phone: '+1 (800) 555-0144',
      whatsapp: '',
      address: '742 Broadway, Soho, New York, NY 10003',
      shippingInfo: 'Hand-packed in sustainable branded gift boxes. Worldwide insured delivery.',
      shippingMethods: [
        { id: uid(), name: 'Standard Courier (3–5 Business Days)', price: 0 },
        { id: uid(), name: 'Next-Day Express Priority', price: 20 }
      ],
      coupons: [
        { id: uid(), code: 'ATELIER15', type: 'percent', amount: 15, enabled: true }
      ],
      nav: ['shop', 'collections', 'services', 'about', 'contact'],
      footerText: 'Thoughtfully constructed garments and considered accents for everyday elegance.'
    },
    categories: ['Clothing', 'Accessories', 'Footwear'],
    collections: [
      { id: 'col-atelier-edit', name: 'The Seasonal Edit', description: 'Understated staples woven from organic cotton, silk, and virgin wool.', image: '/commerce/fashion.webp' },
      { id: 'col-atelier-acc', name: 'Curated Accents', description: 'Handcrafted timepieces and leather everyday carry items.', image: '/commerce/watch.webp' }
    ],
    products: [
      {
        id: uid(),
        name: 'The Everyday Knit Sweater',
        sku: 'ATL-KNT-01',
        price: 79,
        salePrice: 65,
        stock: 24,
        status: 'published',
        images: ['/commerce/sweater.webp'],
        category: 'Clothing',
        collections: ['col-atelier-edit'],
        description: 'Ribbed crewneck sweater spun from soft breathable merino wool. Relaxed dropped shoulder silhouette.',
        specifications: 'Material: 100% Extra-Fine Merino Wool · Care: Hand Wash Cold · Origin: Italy',
        shipping: 'Free returns within 30 days.',
        featured: true,
        bestSeller: true,
        variants: [
          { id: uid(), name: 'Size S / Oatmeal', size: 'S', color: 'Oatmeal', sku: 'ATL-KNT-01-S', price: 65, stock: 8 },
          { id: uid(), name: 'Size M / Oatmeal', size: 'M', color: 'Oatmeal', sku: 'ATL-KNT-01-M', price: 65, stock: 10 },
          { id: uid(), name: 'Size L / Oatmeal', size: 'L', color: 'Oatmeal', sku: 'ATL-KNT-01-L', price: 65, stock: 6 }
        ],
        reviews: [
          { id: uid(), name: 'Elena V.', rating: 5, text: 'Incredible texture and drape. One of my favorite winter knits.' }
        ]
      },
      {
        id: uid(),
        name: 'Essential Cotton Oxford Tee',
        sku: 'ATL-TEE-02',
        price: 45,
        salePrice: '',
        stock: 50,
        status: 'published',
        images: ['/commerce/shirt.webp'],
        category: 'Clothing',
        collections: ['col-atelier-edit'],
        description: 'Heavyweight organic combed cotton t-shirt with a structured collar and tailored drape.',
        specifications: 'Material: 100% GOTS Organic Cotton (240 GSM) · Pre-Shrunk',
        shipping: 'Dispatched next business day.',
        featured: true,
        bestSeller: true,
        variants: [
          { id: uid(), name: 'Size M / Crisp White', size: 'M', color: 'Crisp White', sku: 'ATL-TEE-02-M', price: 45, stock: 25 },
          { id: uid(), name: 'Size L / Crisp White', size: 'L', color: 'Crisp White', sku: 'ATL-TEE-02-L', price: 45, stock: 25 }
        ],
        reviews: []
      },
      {
        id: uid(),
        name: 'Heritage Minimal Watch',
        sku: 'ATL-WTH-03',
        price: 135,
        salePrice: 110,
        stock: 18,
        status: 'published',
        images: ['/commerce/watch.webp'],
        category: 'Accessories',
        collections: ['col-atelier-acc'],
        description: 'Slim brushed steel timepiece with monochrome dial and vegetable-tanned bridle leather strap.',
        specifications: 'Case: 38mm Stainless Steel · Movement: Swiss Quartz · Glass: Sapphire Crystal',
        shipping: 'Includes embossed leather travel pouch.',
        featured: true,
        bestSeller: false,
        variants: [],
        reviews: []
      },
      {
        id: uid(),
        name: 'Studio Low-Top Sneakers',
        sku: 'ATL-SNK-04',
        price: 120,
        salePrice: 95,
        stock: 22,
        status: 'published',
        images: ['/commerce/sneakers.webp'],
        category: 'Footwear',
        collections: ['col-atelier-acc'],
        description: 'Handcrafted minimalist leather court sneakers with waxed cotton laces and Margom vulcanized rubber sole.',
        specifications: 'Upper: Full-Grain Italian Calfskin · Lining: Calf Leather · Sole: Italian Rubber',
        shipping: 'Includes dust bags and spare waxed laces.',
        featured: false,
        bestSeller: true,
        variants: [],
        reviews: []
      }
    ],
    sectionLibrary: [],
    pages: {
      home: [
        { id: uid(), type: 'hero', visible: true, layout: 'split', spacing: 'regular', background: 'default', title: 'A little less ordinary.', text: 'Thoughtfully constructed garments and considered accents designed for everyday elegance.', image: '/commerce/fashion.webp', button: 'Shop the Collection', target: 'shop', items: [] },
        { id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Curated Lines', items: [] },
        { id: uid(), type: 'products', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Considered Favourites', source: 'featured', limit: 4, items: [] },
        { id: uid(), type: 'banner', visible: true, layout: 'split', spacing: 'regular', background: 'muted', title: 'The Tailored Edit', text: 'Crafted in small batches with certified mills in Northern Italy and Portugal.', image: '/commerce/sweater.webp', button: 'Browse the Shop', target: 'shop', items: [] },
        { id: uid(), type: 'newsletter', visible: true, spacing: 'regular', background: 'default', title: 'A note from us, now and then.', text: 'Subscribe for studio previews and seasonal catalog releases.', items: [] }
      ],
      shop: [{ id: uid(), type: 'catalog', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'The Atelier Shop', items: [] }],
      product: [{ id: uid(), type: 'product', visible: true, items: [] }],
      cart: [{ id: uid(), type: 'cart', visible: true, items: [] }],
      checkout: [{ id: uid(), type: 'checkout', visible: true, items: [] }],
      collections: [{ id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Collections', items: [] }],
      services: [{ id: uid(), type: 'services', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Atelier Bespoke & Tailoring', items: [] }],
      about: [{ id: uid(), type: 'richtext', visible: true, layout: 'split', spacing: 'regular', background: 'default', title: 'Our Design Ethos', text: 'Founded with an uncompromising belief that daily dressing should feel effortless, lasting, and tactile.', image: '/commerce/fashion.webp', items: [] }],
      contact: [{ id: uid(), type: 'contact', visible: true, spacing: 'regular', background: 'default', title: 'Atelier Concierge', items: [] }],
      faq: [{ id: uid(), type: 'faq', visible: true, layout: 'list', spacing: 'regular', background: 'default', title: 'Care & Sizing Guide', items: [] }],
      search: [{ id: uid(), type: 'search', visible: true, title: 'Search Atelier', items: [] }],
      notfound: [{ id: uid(), type: 'notfound', visible: true, title: 'Page Not Found', text: 'Discover our newest garments in the shop.', items: [] }]
    }
  };
}
