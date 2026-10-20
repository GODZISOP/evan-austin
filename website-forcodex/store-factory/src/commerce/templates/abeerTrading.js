export function uid() {
  return crypto.randomUUID();
}

export const abeerTradingTheme = {
  id: 'tradehouse',
  name: 'Abeer Trading & Co.',
  niche: 'Wholesale & General Trading · Full eCommerce',
  type: 'ecommerce',
  color: '#0c363d',
  background: '#f4f6f8',
  font: 'serif',
  hero: '/commerce/trade-forest.png',
  title: 'Wholesale, Sourced Thoughtfully.',
  layout: 'cover',
  card: 'framed',
  radius: 10,
  featured: true,
  badge: 'Flagship Store'
};

export function createAbeerTradingStore() {
  const collectionList = [
    {
      id: 'col-daily-essentials',
      name: 'Daily Essentials',
      description: 'Everyday premium lifestyle items, insulated drinkware, and personal essentials curated for durability.',
      image: '/template-images/cleaning.webp'
    },
    {
      id: 'col-fashion-finds',
      name: 'Fashion & Apparel',
      description: 'Refined watches, weather-resistant technical bags, knitwear, and lifestyle footwear.',
      image: '/commerce/fashion.webp'
    },
    {
      id: 'col-home-living',
      name: 'Home & Workplace',
      description: 'Architectural desk lamps, ambient lighting, and minimalist interior utility fixtures.',
      image: '/commerce/trade-forest.png'
    },
    {
      id: 'col-electronics-tech',
      name: 'Electronics & Audio',
      description: 'Commercial-grade audio gear, active noise cancellation headphones, and compact creator cameras.',
      image: '/commerce/headphones.webp'
    }
  ];

  const products = [
    {
      id: 'abr-prod-01',
      name: 'Minimal Chrono Watch',
      sku: 'ABR-TOP-01',
      price: 145,
      salePrice: 119,
      stock: 24,
      status: 'published',
      images: ['/commerce/watch.webp'],
      category: 'Top Picks',
      collections: ['col-fashion-finds'],
      description: 'Precision engineered stainless steel chronograph with sapphire crystal lens and genuine Italian leather strap. Designed for timeless presence and rigorous daily reliability.',
      specifications: 'Movement: Quartz Chronograph · Glass: Anti-Reflective Sapphire Crystal · Water Resistance: 5 ATM / 50M · Case: 40mm 316L Stainless Steel · Warranty: 2 Years International',
      shipping: 'Express 2–3 day global dispatch with door-to-door tracking and protective insurance.',
      featured: true,
      bestSeller: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      variants: [
        { id: uid(), name: 'Classic Onyx / Brown Leather', size: '40mm', color: 'Onyx / Brown', sku: 'ABR-TOP-01-BRN', price: 119, stock: 14 },
        { id: uid(), name: 'Silver Sunray / Steel Mesh', size: '40mm', color: 'Silver / Mesh', sku: 'ABR-TOP-01-SLV', price: 129, stock: 10 }
      ],
      reviews: [
        { id: uid(), name: 'Faisal Al-Otaibi', rating: 5, text: 'Outstanding build quality. Arrived in Riyadh within 48 hours in luxury packaging.' },
        { id: uid(), name: 'Hamza Tariq', rating: 5, text: 'Clean dial and very solid weight. Exactly as described.' }
      ]
    },
    {
      id: 'abr-prod-02',
      name: 'Insulated Thermal Flask',
      sku: 'ABR-ESS-02',
      price: 34,
      salePrice: 27,
      stock: 80,
      status: 'published',
      images: ['/template-images/cleaning.webp'],
      category: 'Daily Essentials',
      collections: ['col-daily-essentials'],
      description: 'Double-walled vacuum insulated 304 food-grade stainless steel flask. Keeps beverages steaming hot for 12 hours and ice-cold for 24 hours with zero condensation and leakproof cap.',
      specifications: 'Capacity: 750ml / 25 fl oz · Material: Food-Grade 304 Stainless Steel · BPA & Toxin Free · Silicone Leakproof Seal',
      shipping: 'Free express shipping on orders over $50. Bulk carton dispatch available.',
      featured: true,
      bestSeller: true,
      createdAt: '2026-01-02T00:00:00.000Z',
      variants: [
        { id: uid(), name: 'Forest Teal / 750ml', size: '750ml', color: 'Forest Teal', sku: 'ABR-ESS-02-TEA', price: 27, stock: 45 },
        { id: uid(), name: 'Matte Obsidian / 750ml', size: '750ml', color: 'Matte Obsidian', sku: 'ABR-ESS-02-BLK', price: 27, stock: 35 }
      ],
      reviews: [
        { id: uid(), name: 'Bilal Khan', rating: 5, text: 'Keeps coffee boiling hot throughout my 10 hour work shift. Fantastic purchase.' }
      ]
    },
    {
      id: 'abr-prod-03',
      name: 'Studio Pro Wireless Headphones',
      sku: 'ABR-ELC-03',
      price: 189,
      salePrice: 149,
      stock: 32,
      status: 'published',
      images: ['/commerce/headphones.webp'],
      category: 'Electronics & Tech',
      collections: ['col-electronics-tech'],
      description: 'High-fidelity hybrid active noise cancellation (ANC) over-ear headphones. Features 40mm titanium drivers, ambient transparency mode, and ultra-plush memory foam earcups for 40-hour playback.',
      specifications: 'Driver: 40mm Custom Titanium · Battery: 40 Hours (ANC On) · Connectivity: Bluetooth 5.3 & 3.5mm Aux · Charging: USB-C Fast Charge · Weight: 260g',
      shipping: 'Dispatched in custom protective hard-shell travel case with international warranty.',
      featured: true,
      bestSeller: true,
      createdAt: '2026-01-03T00:00:00.000Z',
      variants: [
        { id: uid(), name: 'Midnight Navy', size: 'Over-Ear', color: 'Midnight Navy', sku: 'ABR-ELC-03-NVY', price: 149, stock: 18 },
        { id: uid(), name: 'Matte Silver', size: 'Over-Ear', color: 'Matte Silver', sku: 'ABR-ELC-03-SLV', price: 149, stock: 14 }
      ],
      reviews: [
        { id: uid(), name: 'Zayd M.', rating: 5, text: 'The ANC kills airplane engine noise completely. Sound signature is rich and detailed.' }
      ]
    },
    {
      id: 'abr-prod-04',
      name: 'Technical Weatherproof Daypack',
      sku: 'ABR-FAS-04',
      price: 95,
      salePrice: 79,
      stock: 35,
      status: 'published',
      images: ['/commerce/sweater.webp'],
      category: 'Fashion Finds',
      collections: ['col-fashion-finds'],
      description: 'Ballistic weather-resistant nylon backpack engineered for executives, commuters, and travelers. Houses up to 16" laptops with dedicated tech sleeves and magnetic quick-access compartments.',
      specifications: 'Dimensions: 46 x 30 x 15cm · Volume: 22 Liters · Shell: 1000D Ballistic Cordura · Zippers: Water-Repellent YKK Aquaguard',
      shipping: 'Direct fulfillment from regional fulfillment warehouse with tracking.',
      featured: true,
      bestSeller: false,
      createdAt: '2026-01-04T00:00:00.000Z',
      variants: [],
      reviews: [
        { id: uid(), name: 'Kareem S.', rating: 5, text: 'Very ergonomic straps and the laptop section is well padded. Perfect travel bag.' }
      ]
    },
    {
      id: 'abr-prod-05',
      name: 'Nordic Articulated Desk Lamp',
      sku: 'ABR-HOM-05',
      price: 89,
      salePrice: 72,
      stock: 20,
      status: 'published',
      images: ['/commerce/trade-forest.png'],
      category: 'Home Living',
      collections: ['col-home-living'],
      description: 'Solid cast-metal articulated architect desk lamp with 3-tier color temperature dimming, counterbalanced joints, and warm diffused glare-free illumination.',
      specifications: 'Power: 12W LED (Included) · Lumens: 900lm · Color Temperature: 3000K-5500K · Voltage: 100-240V · Finish: Matte Forest Green',
      shipping: 'Heavy secure packaging with anti-shock molded foam.',
      featured: false,
      bestSeller: true,
      createdAt: '2026-01-05T00:00:00.000Z',
      variants: [],
      reviews: []
    },
    {
      id: 'abr-prod-06',
      name: 'Precision Compact 4K Camera',
      sku: 'ABR-ELC-06',
      price: 349,
      salePrice: 289,
      stock: 15,
      status: 'published',
      images: ['/commerce/camera.webp'],
      category: 'Electronics & Tech',
      collections: ['col-electronics-tech'],
      description: 'Pocket-sized 4K 60fps digital compact camera with f/1.8 bright prime lens and advanced optical image stabilization. Designed for creators, trade inspections, and travel photography.',
      specifications: 'Sensor: 1-inch 20.1MP CMOS · Video: 4K 60p / 1080p 120p · Lens: 24-70mm equivalent f/1.8-2.8 · Connectivity: WiFi, Bluetooth & USB-C',
      shipping: 'Includes 64GB High-Speed SD card and extra rechargeable battery.',
      featured: true,
      bestSeller: false,
      createdAt: '2026-01-06T00:00:00.000Z',
      variants: [],
      reviews: [
        { id: uid(), name: 'Rashid Al-Hassan', rating: 5, text: 'Crisp 4K video and very fast autofocus. Excellent trade companion.' }
      ]
    },
    {
      id: 'abr-prod-07',
      name: 'Urban Pace Runner Sneakers',
      sku: 'ABR-FAS-07',
      price: 125,
      salePrice: 98,
      stock: 40,
      status: 'published',
      images: ['/commerce/sneakers.webp'],
      category: 'Fashion Finds',
      collections: ['col-fashion-finds'],
      description: 'Lightweight breathable engineered knit runners with responsive dual-density cushioning and slip-resistant rubber tread.',
      specifications: 'Upper: Recycled Breathable Knit · Midsole: CloudFoam Dual Density EVA · Weight: 240g per shoe · Fit: True to Size',
      shipping: 'Shipped in original branded box with spare laces.',
      featured: false,
      bestSeller: false,
      createdAt: '2026-01-07T00:00:00.000Z',
      variants: [
        { id: uid(), name: 'EU 41 / US 8', size: '41', color: 'Monochrome Grey', sku: 'ABR-FAS-07-41', price: 98, stock: 10 },
        { id: uid(), name: 'EU 42 / US 9', size: '42', color: 'Monochrome Grey', sku: 'ABR-FAS-07-42', price: 98, stock: 15 },
        { id: uid(), name: 'EU 43 / US 10', size: '43', color: 'Monochrome Grey', sku: 'ABR-FAS-07-43', price: 98, stock: 15 }
      ],
      reviews: []
    },
    {
      id: 'abr-prod-08',
      name: 'Botanical Extract Eau De Parfum',
      sku: 'ABR-ESS-08',
      price: 85,
      salePrice: 69,
      stock: 28,
      status: 'published',
      images: ['/commerce/perfume.webp'],
      category: 'Daily Essentials',
      collections: ['col-daily-essentials'],
      description: 'Artisanal concentrated fragrance featuring bergamot, cedarwood, cardamom, and amber notes. Long-lasting 10-hour sillage.',
      specifications: 'Volume: 100ml / 3.4 fl oz · Concentration: Eau de Parfum (18% oil) · Country of Origin: Grasse, France',
      shipping: 'Courier approved dangerous goods compliant safety packaging.',
      featured: true,
      bestSeller: false,
      createdAt: '2026-01-08T00:00:00.000Z',
      variants: [],
      reviews: [
        { id: uid(), name: 'Omar D.', rating: 5, text: 'Subtle, masculine, and sophisticated. Compliments every time I wear it.' }
      ]
    }
  ];

  return {
    id: '00000000-0000-4000-8000-000000000000',
    name: 'Abeer Trading Co.',
    slug: 'abeer-trading',
    theme: 'tradehouse',
    sample: true,
    client: {
      name: 'Abeer Trading Co.',
      email: 'Abeer.tahir2025@gmail.com',
      domain: 'abeertrading.com',
      type: 'ecommerce'
    },
    settings: {
      color: '#0c363d',
      background: '#f4f6f8',
      font: 'serif',
      radius: 10,
      width: 1360,
      spacing: 'regular',
      header: 'catalogue',
      footer: 'columns',
      card: 'framed',
      gallery: 'split',
      button: 'solid',
      logo: '',
      announcement: '⚡ Fast Global Dispatch · Verified Institutional Procurement · Direct B2B Desk: (+966) 547035184',
      currency: 'USD',
      email: 'Abeer.tahir2025@gmail.com',
      phone: '(+966) 547035184',
      whatsapp: '+966547035184',
      address: 'Abeer Trading Company LLC · Institutional Procurement & Wholesale Trade Operations',
      shippingInfo: 'Express 24-48h air cargo and sea freight dispatch. Door-to-door delivery with customs pre-clearance.',
      shippingMethods: [
        { id: uid(), name: 'Standard Insured Freight (3–5 Days)', price: 0 },
        { id: uid(), name: 'Express Air Priority Dispatch (24–48 Hours)', price: 25 }
      ],
      coupons: [
        { id: uid(), code: 'ABEER10', type: 'percent', amount: 10, enabled: true },
        { id: uid(), code: 'WHOLESALE20', type: 'percent', amount: 20, enabled: true }
      ],
      nav: ['shop', 'collections', 'services', 'about', 'contact'],
      footerText: 'Thoughtfully selected wholesale & retail commerce. Managed and operated by Tahir Mehmood.'
    },
    categories: ['Daily Essentials', 'Fashion Finds', 'Home Living', 'Electronics & Tech', 'Top Picks'],
    collections: collectionList,
    products: products,
    sectionLibrary: [],
    pages: {
      home: [
        {
          id: uid(),
          type: 'hero',
          visible: true,
          layout: 'cover',
          spacing: 'regular',
          background: 'default',
          title: 'Wholesale & Retail Sourcing, Thoughtfully Curated.',
          eyebrow: 'Abeer Trading Company LLC · Official Store',
          text: 'Owned and managed by Tahir Mehmood. Providing institutional partners and discerning customers with verified wholesale sourcing, certified procurement, and cross-border distribution. For direct commercial inquiries, contact our executive trade desk at (+966) 547035184 or email Abeer.tahir2025@gmail.com.',
          image: '/commerce/trade-forest.png',
          button: 'Explore Products',
          target: 'shop',
          secondaryButton: 'B2B Trade Desk',
          secondaryTarget: 'contact',
          items: []
        },
        {
          id: uid(),
          type: 'collections',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'Product Collections',
          eyebrow: 'SHOP BY CATEGORY',
          text: 'Explore dedicated product lines selected for commercial buyers and retail customers alike.',
          items: []
        },
        {
          id: uid(),
          type: 'products',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'Featured Bestsellers',
          eyebrow: 'VERIFIED COMMERCE INVENTORY',
          source: 'featured',
          limit: 8,
          items: []
        },
        {
          id: uid(),
          type: 'banner',
          visible: true,
          layout: 'split',
          spacing: 'regular',
          background: 'muted',
          title: 'Direct Commercial Procurement & Sourcing',
          text: 'Looking for bulk containers or institutional trade supply? Get in touch with Tahir Mehmood directly on WhatsApp or email for commercial pricing sheets, MOQs, and FOB shipping schedules.',
          image: '/commerce/trade-forest.png',
          button: 'Request B2B Quote',
          target: 'contact',
          items: []
        },
        {
          id: uid(),
          type: 'products',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'Fresh Arrivals',
          eyebrow: 'JUST ADDED TO WAREHOUSE',
          source: 'new',
          limit: 4,
          items: []
        },
        {
          id: uid(),
          type: 'richtext',
          visible: true,
          layout: 'reverse',
          spacing: 'regular',
          background: 'default',
          title: 'Your Trusted Global Trade Partner.',
          text: 'ABEER TRADING COMPANY LLC delivers dependable procurement across consumer electronics, lifestyle, home goods, and apparel. Certified quality inspections on every batch.',
          image: '/commerce/watch.webp',
          button: 'About Abeer Trading Co.',
          target: 'about',
          items: []
        },
        {
          id: uid(),
          type: 'contact',
          visible: true,
          spacing: 'regular',
          background: 'white',
          title: 'Executive Trade Desk & Wholesale Inquiries',
          items: []
        }
      ],
      shop: [
        {
          id: uid(),
          type: 'catalog',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'The Store Catalog',
          items: []
        }
      ],
      product: [
        { id: uid(), type: 'product', visible: true, items: [] }
      ],
      cart: [
        { id: uid(), type: 'cart', visible: true, items: [] }
      ],
      checkout: [
        { id: uid(), type: 'checkout', visible: true, items: [] }
      ],
      collections: [
        {
          id: uid(),
          type: 'collections',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'Curated Categories',
          text: 'Select a category to view verified in-stock items.',
          items: []
        },
        {
          id: uid(),
          type: 'catalog',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'All Category Products',
          items: []
        }
      ],
      services: [
        {
          id: uid(),
          type: 'services',
          visible: true,
          layout: 'tiles',
          spacing: 'regular',
          background: 'default',
          title: 'Institutional Trade Capabilities',
          text: 'Custom supply solutions provided by Abeer Trading Company LLC.',
          items: [
            {
              id: uid(),
              title: 'Bulk & Container Procurement',
              text: 'Direct factory-to-warehouse sourcing for corporate buyers and distributor networks across the GCC and Europe.',
              image: '/commerce/trade-forest.png'
            },
            {
              id: uid(),
              title: 'Certified Batch Quality Inspection',
              text: 'Multi-stage quality audits, compliance verification, and standardized packaging inspections before dispatch.',
              image: '/template-images/cleaning.webp'
            },
            {
              id: uid(),
              title: 'Express Cross-Border Logistics',
              text: 'Air and sea cargo consolidation with customs pre-clearance to minimize lead times.',
              image: '/commerce/camera.webp'
            }
          ]
        }
      ],
      about: [
        {
          id: uid(),
          type: 'richtext',
          visible: true,
          layout: 'split',
          spacing: 'regular',
          background: 'default',
          title: 'A Considered Approach to Trade & Distribution.',
          text: 'ABEER TRADING COMPANY LLC is owned and operated by Tahir Mehmood. Founded on the principle that international procurement should be transparent, certified, and punctual, we connect global manufacturers with commercial and retail partners worldwide.',
          image: '/commerce/trade-forest.png',
          button: 'Explore Catalog',
          target: 'shop',
          items: []
        }
      ],
      contact: [
        {
          id: uid(),
          type: 'contact',
          visible: true,
          spacing: 'regular',
          background: 'default',
          title: 'Direct Commercial & Wholesale Inquiries',
          text: 'Speak directly with Tahir Mehmood or email the trade desk for catalog sheets and volume orders.',
          items: []
        }
      ],
      faq: [
        {
          id: uid(),
          type: 'faq',
          visible: true,
          layout: 'list',
          spacing: 'regular',
          background: 'default',
          title: 'Frequently Asked Questions',
          items: [
            {
              id: uid(),
              title: 'How do I place a bulk or wholesale inquiry?',
              text: 'You can contact Tahir Mehmood directly via WhatsApp at (+966) 547035184 or email Abeer.tahir2025@gmail.com with your required SKUs, quantities, and destination port.'
            },
            {
              id: uid(),
              title: 'Are products 100% authentic and certified?',
              text: 'Yes. Every batch procured by Abeer Trading Company LLC undergoes strict origin verification and quality inspection.'
            },
            {
              id: uid(),
              title: 'What are the delivery lead times?',
              text: 'Standard in-stock retail and regional B2B orders dispatch within 24–48 hours. International air cargo takes 3–5 business days.'
            },
            {
              id: uid(),
              title: 'What payment options are available for corporate orders?',
              text: 'We support bank wire transfers, formal corporate purchase orders, and commercial invoicing.'
            }
          ]
        }
      ],
      search: [
        { id: uid(), type: 'search', visible: true, title: 'Search the Catalog', items: [] }
      ],
      notfound: [
        { id: uid(), type: 'notfound', visible: true, title: 'Item Not Found', text: 'Browse our full catalog for in-stock collections.', items: [] }
      ]
    }
  };
}
