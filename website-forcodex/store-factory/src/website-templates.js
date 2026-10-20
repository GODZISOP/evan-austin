export const websiteTemplates = [
  { id: 'agency', name: 'Agency', category: 'Creative & digital', layout: 'split', color: '#314e78', title: 'A clear direction for your next project.', description: 'A bold introduction, a service index, and space for your agency story.', serviceLabel: 'What we do', aboutFirst: false },
  { id: 'construction', name: 'Construction', category: 'Property & trades', layout: 'industrial', color: '#80431e', title: 'Built around your next project.', description: 'Strong typography and a practical, numbered list of capabilities.', serviceLabel: 'Our capabilities', aboutFirst: false },
  { id: 'cleaning', name: 'Cleaning', category: 'Home & everyday', layout: 'friendly', color: '#25634d', title: 'Make room for a cleaner day.', description: 'An approachable layout with clear services and direct contact options.', serviceLabel: 'Cleaning services', aboutFirst: false },
  { id: 'healthcare', name: 'Healthcare', category: 'Health & wellbeing', layout: 'calm', color: '#27626a', title: 'Care starts with a conversation.', description: 'A calm introduction, an About section, and easy-to-find practice details.', serviceLabel: 'Our services', aboutFirst: true },
  { id: 'fitness', name: 'Fitness / Coach', category: 'Health & wellbeing', layout: 'bold', color: '#863e28', title: 'A plan for your next chapter.', description: 'Large, direct headlines and a focused coaching programme list.', serviceLabel: 'Ways to work together', aboutFirst: false },
  { id: 'amazon', name: 'Amazon Services', category: 'Creative & digital', layout: 'index', color: '#544b85', title: 'Support for your Amazon business.', description: 'An organised service directory for account and marketplace support.', serviceLabel: 'Marketplace services', aboutFirst: false },
  { id: 'restaurant', name: 'Restaurant', category: 'Home & everyday', layout: 'editorial', color: '#803e37', title: 'A place at our table.', description: 'An editorial opening with room for food photography and your story.', serviceLabel: 'At our restaurant', aboutFirst: true },
  { id: 'real-estate', name: 'Real Estate', category: 'Property & trades', layout: 'panorama', color: '#56643b', title: 'Find a place that fits.', description: 'A wide image-led introduction followed by property services.', serviceLabel: 'Property services', aboutFirst: false },
  { id: 'lawyer', name: 'Lawyer', category: 'Professional services', layout: 'formal', color: '#384e65', title: 'Clarity for the decisions ahead.', description: 'Restrained serif typography and an ordered list of practice areas.', serviceLabel: 'Practice areas', aboutFirst: true },
  { id: 'consulting', name: 'Consulting', category: 'Professional services', layout: 'ledger', color: '#625735', title: 'A considered approach to business.', description: 'A compact, text-first layout that puts expertise and services first.', serviceLabel: 'How we can help', aboutFirst: false },
].map(template => ({ ...template, image: `/template-images/${template.id}.webp` }));

export function findTemplate(id) {
  return websiteTemplates.find(template => template.id === id) || websiteTemplates[0];
}

export function templateExample(id) {
  const template = findTemplate(id);
  return {
    id: `example-${id}`, name: `Your ${template.name.toLowerCase()}`, slug: 'your-business',
    template: template.id, brand_color: template.color,
    content: {
      logo: '', heroTitle: template.title, heroText: 'This is a template preview. Add your client’s own introduction, images and contact details in the editor.',
      heroImage: template.image, heroImageAlt: `${template.name} template stock photograph`, aboutTitle: 'The people behind the work',
      about: 'Use this space for your client’s story, approach and the people they help. Every word and image can be changed without rebuilding the website.',
      aboutImage: '', aboutImageAlt: '', email: '', phone: '', whatsapp: '', address: '',
      pageMode: 'landing', pages: ['home', 'services', 'about', 'contact'],
      services: [
        { id: 'sample-one', title: 'Your first service', description: 'Explain what this service includes and who it is for.', image: '' },
        { id: 'sample-two', title: 'Your second service', description: 'Describe another way your business can help a customer.', image: '' },
        { id: 'sample-three', title: 'Your third service', description: 'Give visitors a clear reason to contact your business.', image: '' },
      ],
    },
  };
}
