import { productionLines } from './production-data';

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
    inputs: {
        name: string;
        quantity: number;
        imageUrl: string;
    }[];
  };
};

const getImageUrl = (name: string) => `https://picsum.photos/seed/${name.toLowerCase().replace(/\s/g, '-')}/200/200`;
const getImageHint = (name: string) => name.toLowerCase().split(' ').slice(0, 2).join(' ');


const generatedEntries = productionLines.map(line => {
    const entry: EncyclopediaEntry = {
        id: line.output.name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_'),
        name: line.output.name,
        category: "Product",
        description: `A product from the ${line.buildingId} facility. Used in various other production lines or sold for profit.`,
        imageUrl: getImageUrl(line.output.name),
        imageHint: getImageHint(line.output.name),
        properties: [
            { label: 'Production Cost', value: `$${line.cost}` },
            { label: 'Production Time', value: line.duration },
            { label: 'Output Quantity', value: `${line.output.quantity.toLocaleString()} units` },
            { label: 'Building', value: line.buildingId.charAt(0).toUpperCase() + line.buildingId.slice(1).replace('_', ' ') }
        ],
    }
    
    if (line.inputs.length > 0) {
        entry.recipe = {
            inputs: line.inputs.map(input => ({
                name: input.name,
                quantity: input.quantity,
                imageUrl: getImageUrl(input.name)
            }))
        }
    }
    
    return entry;
});

// Create a set of all item names to avoid duplicates in encyclopedia
const allItemNames = new Set<string>();
productionLines.forEach(line => {
    allItemNames.add(line.output.name);
    line.inputs.forEach(input => allItemNames.add(input.name));
});

// Add entries for items that are inputs but not outputs
allItemNames.forEach(itemName => {
    if (!generatedEntries.some(entry => entry.name === itemName)) {
        const entry: EncyclopediaEntry = {
            id: itemName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_'),
            name: itemName,
            category: "Raw Material",
            description: `A fundamental resource used in production. It may be produced or sourced from suppliers.`,
            imageUrl: getImageUrl(itemName),
            imageHint: getImageHint(itemName),
            properties: [
                { label: 'Type', value: 'Base Input' }
            ],
        };
        generatedEntries.push(entry);
    }
});


export const encyclopediaData: EncyclopediaEntry[] = generatedEntries.sort((a, b) => a.name.localeCompare(b.name));
