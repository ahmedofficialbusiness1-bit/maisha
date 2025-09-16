import React from 'react';
import { recipes, type Recipe } from './recipe-data';
import { buildingData } from './building-data';
import { 
    Apple, Bean, Beef, Boat, ToyBrick, Building, Carrot, Citrus, Component, CookingPot,
    Egg, Factory, Feather, Fish, Gem, GlassWater, Grape, Hammer, Leaf, LucideIcon, 
    Milestone, Mountain, Package, Palmtree, Recycle, Shell, Ship, Shrub, Sprout,
    Squirrel, Sun, TreeDeciduous, Utensils, Warehouse, Wheat, Wind, Wrench
} from 'lucide-react';


export type EncyclopediaEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  icon: React.ReactElement<LucideIcon>;
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

const itemIcons: Record<string, React.ReactElement<LucideIcon>> = {
    'Mbao': <Hammer />,
    'Matofali': <ToyBrick />,
    'Nondo': <Component />,
    'Zege': <Building />,
    'Saruji': <Building />,
    'Mchanga': <Shell />,
    'Mawe': <Mountain />,
    'Kokoto': <Milestone />,
    'Miti': <TreeDeciduous />,
    'Madini ya chuma': <Gem />,
    'Chuma': <Wrench />,
    'Mbegu': <Sprout />,
    'Maharage': <Bean />,
    'Mchele': <Package />,
    'Unga wa ngano': <Wheat />,
    'Unga wa sembe': <Package />,
    'Ndizi': <Package />,
    'Viazi mbatata': <Package />,
    'Mboga mboga': <Carrot />,
    'Embe': <Apple />,
    'Nanasi': <Palmtree />,
    'Parachichi': <Package />,
    'Miwa': <Shrub />,
    'Nyasi': <Leaf />,
    'Mbolea': <Recycle />,
    'Zabibu': <Grape />,
    'Apple': <Apple />,
    'Chungwa': <Citrus />,
    'Korosho': <Squirrel />,
    'Karafuu': <Sun />,
    'Pamba': <Feather />,
    'Katani': <Package />,
    'Yai': <Egg />,
    'Kuku': <Feather />,
    'Ngombe': <Package />,
    'Nyama': <Beef />,
    'Sukari': <Wheat />,
    'Juice': <CookingPot />,
    'Bwawa': <Warehouse />,
    'Boat': <Ship />,
    'Samaki': <Fish />,
    'Chumvi': <Package />,
    'Umeme': <Wind />,
    'Maji': <GlassWater />,
    'Default': <Package />
};

const getIcon = (name: string): React.ReactElement<LucideIcon> => {
    return itemIcons[name] || itemIcons['Default'];
};


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
        icon: getIcon(recipe.output.name),
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
            icon: getIcon(itemName),
            properties: [
                { label: 'Type', value: 'Base Input' },
                { label: 'Market Cost', value: `$${estimatedCost}` }
            ],
        };
        generatedEntries.push(entry);
    }
});


// Group items by category for the market view
const categoryOrder = ['Construction', 'Raw Material', 'Agriculture', 'Food', 'Product'];
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
    const categoryAIndex = categoryOrder.indexOf(a.category);
    const categoryBIndex = categoryOrder.indexOf(b.category);

    const effectiveA = categoryAIndex === -1 ? Infinity : categoryAIndex;
    const effectiveB = categoryBIndex === -1 ? Infinity : categoryBIndex;

    if (effectiveA !== effectiveB) {
        return effectiveA - effectiveB;
    }
    return a.name.localeCompare(b.name);
});
