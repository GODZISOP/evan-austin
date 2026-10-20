export function uid() {
  return crypto.randomUUID();
}

export const botanicaTheme = {
  id: 'botanica',
  name: 'Botanica Apothecary',
  niche: 'Beauty, Fragrance & Organic Skincare',
  type: 'ecommerce',
  color: '#556448',
  background: '#f2f3e9',
  font: 'serif',
  hero: '/commerce/perfume.webp',
  title: 'A moment, just for you.',
  layout: 'centered',
  card: 'minimal',
  radius: 24
};

export function createBotanicaStore() {
  return {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Botanica Apothecary',
    slug: 'beauty-demo',
    theme: 'botanica',
    sample: true,
    client: {
      name: 'Botanica Apothecary Ltd.',
      email: 'care@botanicabotanica.com',
      domain: 'botanicabotanica.com',
      type: 'ecommerce'
    },
    settings: {
      color: '#556448',
      background: '#f2f3e9',
      font: 'serif',
      radius: 24,
      width: 1280,
      spacing: 'airy',
      header: 'centered',
      footer: 'minimal',
      card: 'minimal',
      gallery: 'stacked',
      button: 'soft',
      logo: '',
      announcement: '🌿 Free herbal samples included with every seasonal order over $60',
      currency: 'USD',
      email: 'care@botanicabotanica.com',
      phone: '+1 (800) 843-HERB',
      whatsapp: '',
      address: '28 Provence Lane, Ojai, CA 93023',
      shippingInfo: 'Plastic-free biodegradable packaging with recyclable amber glass bottles.',
      shippingMethods: [
        { id: uid(), name: 'Standard Carbon-Neutral Delivery', price: 0 },
        { id: uid(), name: 'Priority Express Air', price: 15 }
      ],
      coupons: [
        { id: uid(), code: 'BOTANICAL15', type: 'percent', amount: 15, enabled: true }
      ],
      nav: ['shop', 'collections', 'about', 'contact'],
      footerText: 'Cold-pressed botanical oils, restorative fragrances, and clean daily rituals.'
    },
    categories: ['Fragrance & Scents', 'Botanical Skincare', 'Bath & Rituals'],
    collections: [
      { id: 'col-fragrance', name: 'Artisan Scents', description: 'Concentrated perfume oils extracted from wild bergamot, cedar, and vetiver.', image: '/commerce/perfume.webp' },
      { id: 'col-rituals', name: 'Daily Rituals', description: 'Nourishing cleansers, body oils, and soothing herbal infusions.', image: '/template-images/cleaning.webp' }
    ],
    products: [
      {
        id: uid(),
        name: 'Botanical Extract Eau De Parfum',
        sku: 'BOT-SCN-01',
        price: 85,
        salePrice: 69,
        stock: 30,
        status: 'published',
        images: ['/commerce/perfume.webp'],
        category: 'Fragrance & Scents',
        collections: ['col-fragrance'],
        description: 'Wild-harvested organic botanical extract featuring sparkling Italian bergamot, smoked cedarwood, and delicate amber resin.',
        specifications: 'Volume: 100ml / 3.4 oz · 18% Pure Essential Oil Concentration · 100% Vegan & Cruelty-Free',
        shipping: 'Packed in protective recycled embossed paper tubes.',
        featured: true,
        bestSeller: true,
        variants: [
          { id: uid(), name: '50ml Travel Flacon', size: '50ml', color: 'Amber Glass', sku: 'BOT-SCN-01-50', price: 49, stock: 15 },
          { id: uid(), name: '100ml Full Flacon', size: '100ml', color: 'Amber Glass', sku: 'BOT-SCN-01-100', price: 69, stock: 15 }
        ],
        reviews: [
          { id: uid(), name: 'Camilla R.', rating: 5, text: 'The bergamot opening is luminous, settling into a grounding warm cedar. Truly mesmerizing.' }
        ]
      },
      {
        id: uid(),
        name: 'Restorative Herbal Elixir',
        sku: 'BOT-OIL-02',
        price: 54,
        salePrice: '',
        stock: 45,
        status: 'published',
        images: ['/template-images/cleaning.webp'],
        category: 'Botanical Skincare',
        collections: ['col-rituals'],
        description: 'Multi-active cold-pressed face oil rich in antioxidants, omega fatty acids, and blue tansy extract.',
        specifications: 'Volume: 30ml / 1 oz · Certified USDA Organic · Cold-Pressed Unrefined Oils',
        shipping: 'UV-blocking violet glass bottle with precision dropper.',
        featured: true,
        bestSeller: true,
        variants: [],
        reviews: []
      }
    ],
    sectionLibrary: [],
    pages: {
      home: [
        { id: uid(), type: 'hero', visible: true, layout: 'centered', spacing: 'airy', background: 'default', title: 'A moment, just for you.', text: 'Formulated with cold-pressed unrefined botanicals and clean aromatherapy notes to ground your everyday routine.', image: '/commerce/perfume.webp', button: 'Explore Botanicals', target: 'shop', items: [] },
        { id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Daily Rituals', items: [] },
        { id: uid(), type: 'products', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Seasonal Favourites', source: 'featured', limit: 4, items: [] },
        { id: uid(), type: 'banner', visible: true, layout: 'centered', spacing: 'airy', background: 'muted', title: 'Wild Sourced. Purely Bottled.', text: 'Every formulation begins with traceable regenerative crops harvested at peak potency.', image: '/commerce/perfume.webp', button: 'Read Our Story', target: 'about', items: [] }
      ],
      shop: [{ id: uid(), type: 'catalog', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'The Apothecary Shop', items: [] }],
      product: [{ id: uid(), type: 'product', visible: true, items: [] }],
      cart: [{ id: uid(), type: 'cart', visible: true, items: [] }],
      checkout: [{ id: uid(), type: 'checkout', visible: true, items: [] }],
      collections: [{ id: uid(), type: 'collections', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Collections', items: [] }],
      services: [{ id: uid(), type: 'services', visible: true, layout: 'tiles', spacing: 'regular', background: 'default', title: 'Bespoke Scent Formulations', items: [] }],
      about: [{ id: uid(), type: 'richtext', visible: true, layout: 'centered', spacing: 'regular', background: 'default', title: 'Clean Sourcing Promise', text: 'We believe skincare should be an invitation to slow down and reconnect with nature.', image: '/commerce/perfume.webp', items: [] }],
      contact: [{ id: uid(), type: 'contact', visible: true, spacing: 'regular', background: 'default', title: 'Botanica Concierge', items: [] }],
      faq: [{ id: uid(), type: 'faq', visible: true, layout: 'list', spacing: 'regular', background: 'default', title: 'Ingredients & Purity FAQs', items: [] }],
      search: [{ id: uid(), type: 'search', visible: true, title: 'Search Botanica', items: [] }],
      notfound: [{ id: uid(), type: 'notfound', visible: true, title: 'Elixir Not Found', text: 'Browse our full botanical collection.', items: [] }]
    }
  };
}
