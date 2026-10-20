const profiles = [
  ['zaroora', 'Zaroora LLC', 'Everyday essentials, thoughtfully selected.', '#1e7087', 'PKR', 'essentials'],
  ['abeertrading', 'Abeer Trading LLC', 'Your catalogue for general trading and wholesale.', '#235544', 'AED', 'wholesale'],
  ['hasanfarid', 'Hasan Farid LLC', 'Leather goods and everyday companions.', '#79563b', 'USD', 'editorial'],
  ['etheshaam', 'Etheshaam Luxury', 'A considered collection of accessories.', '#67446e', 'USD', 'editorial'],
  ['sbrinenational', 'Sbrine National', 'Consumer supplies for your next bulk order.', '#964731', 'PKR', 'wholesale'],
];

export function demoStores() {
  return profiles.map(([slug, name, tagline, brand_color, currency, template], index) => ({
    id: `demo-${slug}`, slug, name, tagline, brand_color, currency, template,
    announcement: 'Sample catalogue. Replace the example products before sharing.',
    email: '', phone: '', whatsapp: '', address: '', published: true,
    products: [
      { id: `${slug}-1`, name: 'Sample canvas tote', sku: 'DEMO-001', category: 'Everyday', price: (index + 1) * 20, description: 'Example product for testing your catalogue. Replace with your own details.', image: '' },
      { id: `${slug}-2`, name: 'Sample desk notebook', sku: 'DEMO-002', category: 'Workspace', price: (index + 1) * 12, description: 'Example product. Prices and availability are for demonstration only.', image: '' },
      { id: `${slug}-3`, name: 'Sample travel pouch', sku: 'DEMO-003', category: 'Everyday', price: (index + 1) * 15, description: 'Example product for testing cart quantities and order requests.', image: '' },
    ],
  }));
}
