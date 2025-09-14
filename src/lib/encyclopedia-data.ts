export type EncyclopediaEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  properties: {
    label: string;
    value: string;
  }[];
  recipe?: {
    input: {
        name: string;
        quantity: number;
        imageUrl: string;
    };
  };
};

export const encyclopediaData: EncyclopediaEntry[] = [
  {
    id: 'corn',
    name: 'Corn',
    category: 'Raw Material',
    description: 'A staple crop, corn is a versatile grain used in many industries, primarily for food production and animal feed. It requires fertile land and significant water to grow.',
    imageUrl: 'https://picsum.photos/seed/corn-item/200/200',
    imageHint: 'corn kernels',
    properties: [
      { label: 'Average Market Price', value: '$150' },
      { label: 'Transport Units', value: '1' },
      { label: 'Volume', value: '1 m³' },
      { label: 'Growth Time', value: '2 hours' },
    ],
  },
  {
    id: 'corn_flour',
    name: 'Corn Flour',
    category: 'Processed Good',
    description: 'Fine flour produced by milling corn. It is a key ingredient for making popular food items like ugali, tortillas, and various pastries.',
    imageUrl: 'https://picsum.photos/seed/flour-bag/200/200',
    imageHint: 'bag of flour',
    properties: [
      { label: 'Average Market Price', value: '$280' },
      { label: 'Transport Units', value: '1' },
      { label: 'Volume', value: '1 m³' },
      { label: 'Production Time', value: '20 mins' },
    ],
    recipe: {
      input: {
        name: 'Corn',
        quantity: 1.5,
        imageUrl: 'https://picsum.photos/seed/corn-item/200/200'
      }
    }
  },
  {
    id: 'maize_mill',
    name: 'Maize Mill',
    category: 'Production Building',
    description: 'An industrial facility for milling raw corn into corn flour. It requires electricity and labor to operate efficiently.',
    imageUrl: 'https://picsum.photos/seed/mill-building/200/200',
    imageHint: 'industrial mill',
    properties: [
      { label: 'Construction Cost', value: '$100,000' },
      { label: 'Construction Time', value: '45 mins' },
      { label: 'Worker Capacity', value: '10' },
      { label: 'Electricity Usage', value: '50 kWh' },
    ],
  },
];
