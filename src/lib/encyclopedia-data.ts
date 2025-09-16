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

const getImageUrl = (name: string) => `https://picsum.photos/seed/${name.toLowerCase().replace(/\s/g, '-')}/200/200`;
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
buildingData.shamba.buildCost.forEach(cost => allItemNames.add(cost.name));


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


export const encyclopediaData: EncyclopediaEntry[] = generatedEntries.sort((a, b) => a.name.localeCompare(b.name));
