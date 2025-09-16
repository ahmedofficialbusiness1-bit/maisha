import { recipes, type Recipe } from './recipe-data';
import { buildingData } from './building-data';

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

const getImageUrl = (name: string) => `https://picsum.photos/seed/${name.toLowerCase().replace(/\s/g, '-')}/64/64`;
const getImageHint = (name: string) => name.toLowerCase().split(' ').slice(0, 2).join(' ');


const generatedEntries = recipes.map(recipe => {
    const buildingInfo = buildingData[recipe.buildingId];
    const baseTimePerUnit = buildingInfo ? (3600) / buildingInfo.productionRate : 0; // Time in seconds for 1 unit at level 1

    const entry: EncyclopediaEntry = {
        id: recipe.id,
        name: recipe.output.name,
        category: "Product",
        description: `A product from the ${recipe.buildingId} facility. Used in various other production lines or sold for profit.`,
        imageUrl: getImageUrl(recipe.output.name),
        imageHint: getImageHint(recipe.output.name),
        properties: [
            { label: 'Production Cost', value: `$${recipe.cost}` },
            { label: 'Market Cost', value: `$${Math.ceil(recipe.cost * 1.25)}`},
            { label: 'Base Production Time', value: `${baseTimePerUnit.toFixed(2)}s / unit` },
            { label: 'Output Quantity', value: `${recipe.output.quantity.toLocaleString()} unit(s)` },
            { label: 'Building', value: recipe.buildingId.charAt(0).toUpperCase() + recipe.buildingId.slice(1).replace('_', ' ') }
        ],
    }
    
    if (recipe.inputs.length > 0) {
        entry.recipe = {
            inputs: recipe.inputs.map(input => ({
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
recipes.forEach(recipe => {
    allItemNames.add(recipe.output.name);
    recipe.inputs.forEach(input => allItemNames.add(input.name));
});
Object.values(buildingData).forEach(b => {
    b.buildCost.forEach(cost => allItemNames.add(cost.name));
});


// Add entries for items that are inputs but not outputs
allItemNames.forEach(itemName => {
    if (!generatedEntries.some(entry => entry.name === itemName)) {
        // Find if this item is a build material to get an estimated cost
        let estimatedCost = 10; // Default cost
        Object.values(buildingData).forEach(b => {
            const costItem = b.buildCost.find(c => c.name === itemName);
            if (costItem) {
                // A very rough estimation, can be refined
                estimatedCost = Math.max(estimatedCost, costItem.quantity / 2);
            }
        });


        const entry: EncyclopediaEntry = {
            id: itemName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_'),
            name: itemName,
            category: "Raw Material",
            description: `A fundamental resource used in production. It may be produced or sourced from suppliers.`,
            imageUrl: getImageUrl(itemName),
            imageHint: getImageHint(itemName),
            properties: [
                { label: 'Type', value: 'Base Input' },
                { label: 'Market Cost', value: `$${estimatedCost}` }
            ],
        };
        generatedEntries.push(entry);
    }
});


// Group items by category for the market view
const categoryOrder = ['Raw Material', 'Construction', 'Agriculture', 'Food', 'Product'];
const itemCategorization: Record<string, string> = {
    'Mbao': 'Construction', 'Matofali': 'Construction', 'Nondo': 'Construction', 'Zege': 'Construction',
    'Saruji': 'Construction', 'Mchanga': 'Construction', 'Mawe': 'Construction', 'Kokoto': 'Construction',
    'Miti': 'Raw Material', 'Madini ya chuma': 'Raw Material', 'Chuma': 'Construction',
    'Mbegu': 'Agriculture', 'Maharage': 'Agriculture', 'Mchele': 'Agriculture', 'Unga wa ngano': 'Food',
    'Unga wa sembe': 'Food', 'Ndizi': 'Agriculture', 'Viazi mbatata': 'Agriculture', 'Mboga mboga': 'Agriculture',
    'Embe': 'Agriculture', 'Nanasi': 'Agriculture', 'Parachichi': 'Agriculture', 'Miwa': 'Agriculture',
    'Nyasi': 'Agriculture', 'Mbolea': 'Agriculture', 'Zabibu': 'Agriculture', 'Apple': 'Agriculture',
    'Chungwa': 'Agriculture', 'Korosho': 'Agriculture', 'Karafuu': 'Agriculture', 'Pamba': 'Raw Material',
    'Katani': 'Raw Material',
    'Yai': 'Food', 'Kuku': 'Agriculture', 'Ngombe': 'Agriculture', 'Nyama': 'Food',
    'Sukari': 'Food', 'Juice': 'Food', 'Bwawa': 'Raw Material', 'Boat': 'Raw Material',
    'Samaki': 'Food', 'Chumvi': 'Food',
    'Umeme': 'Raw Material', 'Maji': 'Raw Material',
};

generatedEntries.forEach(entry => {
    if (itemCategorization[entry.name]) {
        entry.category = itemCategorization[entry.name];
    } else if (entry.category === 'Product') {
         // Default if not specified
    }
});


export const encyclopediaData: EncyclopediaEntry[] = generatedEntries.sort((a, b) => {
    const categoryA = categoryOrder.indexOf(a.category);
    const categoryB = categoryOrder.indexOf(b.category);
    if (categoryA !== categoryB) {
        return categoryA - categoryB;
    }
    return a.name.localeCompare(b.name);
});
