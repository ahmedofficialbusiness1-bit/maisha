

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
    Apple, Bean, Beef, Boat, ToyBrick, Building, Carrot, Citrus, Component,
    Egg, Factory, Feather, Fish, Gem, GlassWater, Grape, Hammer, Leaf,
    Milestone, Mountain, Package, Palmtree, Recycle, Shell, Ship, Shrub, Sprout,
    Sun, TreeDeciduous, Utensils, Warehouse, Wheat, Wind, Wrench, FileText, ScrollText, Droplets, Zap,
    Building2, Glasses, FlaskConical, Shirt, Watch, Footprints, CircleDollarSign, Medal, Crown,
    Tv, Tablet, Smartphone, Laptop, Cpu, Battery, MemoryStick, HardDrive, Speaker, CircuitBoard,
    Monitor, Car, Bike, Plane, Tractor, Rocket, ShieldCheck, Award
} from 'lucide-react';
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
  recipe?: Recipe;
};

const getImageUrl = (name: string) => `https://picsum.photos/seed/${name.toLowerCase().replace(/\s/g, '-')}/64/64`;
const getImageHint = (name: string) => name.toLowerCase().split(' ').slice(0, 2).join(' ');


// --- Main Execution ---

// A map to look up recipes by their output name quickly.
const recipeMap = new Map<string, Recipe>(recipes.map(r => [r.output.name, r]));

// Get a list of all unique items from recipes and other base items
const allItems = new Set<string>([
    ...recipes.flatMap(r => [r.output.name, ...r.inputs.map(i => i.name)]),
    'Maji', 'Umeme'
]);


// This is the definitive, hardcoded price list for BASE items.
const basePriceList: Record<string, number> = {
  // Base resources that don't have recipes
  'Mbegu': 0.70,
  'Miti': 0.5,
  'Madini ya chuma': 0.9,
  'Ngombe': 100,
  'Bwawa': 500,
  'Boat': 1000,
  'Mawe': 0.2,
  'Maji': 0.05,
  'Umeme': 0.15,
};


// --- Calculate all prices dynamically ---
const calculatedPrices: Record<string, number> = { ...basePriceList };
const priceCalculationCompleted = new Set<string>(Object.keys(basePriceList));

let itemsToCalculate = Array.from(allItems).filter(item => !priceCalculationCompleted.has(item));

let iterations = 0;
const MAX_ITERATIONS = allItems.size * 2; // Prevent infinite loops

while (itemsToCalculate.length > 0 && iterations < MAX_ITERATIONS) {
    const stillToCalculate: string[] = [];
    
    for (const itemName of itemsToCalculate) {
        const recipe = recipeMap.get(itemName);
        if (!recipe) {
            if (calculatedPrices[itemName] === undefined) {
              // This can happen for items in `allItems` that are not in basePriceList and have no recipe
              // e.g., 'Maji', 'Umeme' before they were added to basePriceList
              calculatedPrices[itemName] = 0; // Default to 0 if no other info
            }
            priceCalculationCompleted.add(itemName); 
            continue;
        }

        let canCalculate = true;
        let inputCost = 0;

        for (const input of recipe.inputs) {
            if (!priceCalculationCompleted.has(input.name)) {
                canCalculate = false;
                break;
            }
            inputCost += (calculatedPrices[input.name] || 0) * input.quantity;
        }

        if (canCalculate) {
            if (recipe.buildingId.startsWith('utafiti_')) {
                // Special case for research "products". Their cost is arbitrary.
                // The cost is handled in the recipe definition inputs (or lack thereof)
                // For encyclopedia purposes, we can assign a representative value.
                if(itemName.includes("Kilimo")) inputCost = 10000;
                else if(itemName.includes("Ujenzi")) inputCost = 15000;
                else if(itemName.includes("Nguo")) inputCost = 20000;
                else if(itemName.includes("Electroniki")) inputCost = 50000;
                else if(itemName.includes("Usafiri")) inputCost = 100000;
                else if(itemName.includes("Anga")) inputCost = 500000;
            }
            
            const costPerUnit = inputCost / recipe.output.quantity;
            calculatedPrices[itemName] = costPerUnit * 1.15; // Add a 15% margin for market price
            priceCalculationCompleted.add(itemName);
        } else {
            stillToCalculate.push(itemName);
        }
    }

    if (stillToCalculate.length > 0 && stillToCalculate.length === itemsToCalculate.length) {
        // No progress made, indicates a circular dependency or missing base price
        stillToCalculate.forEach(item => {
            calculatedPrices[item] = 0; // Price as 0 if un-calculatable
            priceCalculationCompleted.add(item);
        });
        itemsToCalculate = []; // break the loop
    } else {
       itemsToCalculate = stillToCalculate;
    }
    
    iterations++;
}


// --- Generate Encyclopedia Entries using the final calculated prices ---
const finalEntries: EncyclopediaEntry[] = [];
allItems.forEach(itemName => {
    const recipe = recipeMap.get(itemName);
    const marketCost = calculatedPrices[itemName] || 0;
    
    let properties: { label: string; value: string }[] = [
        { label: 'Market Cost', value: `$${marketCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}` }
    ];

    if (recipe) {
        // It's a produced good
        let inputCost = 0;
        for (const input of recipe.inputs) {
            inputCost += (calculatedPrices[input.name] || 0) * input.quantity;
        }

        if (recipe.buildingId.startsWith('utafiti_')) {
            // Special case for research "products". Their cost is arbitrary.
            if(itemName.includes("Kilimo")) inputCost = 10000;
            else if(itemName.includes("Ujenzi")) inputCost = 15000;
            else if(itemName.includes("Nguo")) inputCost = 20000;
            else if(itemName.includes("Electroniki")) inputCost = 50000;
            else if(itemName.includes("Usafiri")) inputCost = 100000;
            else if(itemName.includes("Anga")) inputCost = 500000;
        }
        
        const buildingInfo = buildingData[recipe.buildingId];
        // Time in seconds for one BATCH
        const baseTimeForBatch = buildingInfo ? (3600) / (buildingInfo.productionRate) : 0; 
        
        const xpGain = (inputCost / recipe.output.quantity) * 5; // XP is 5x the cost of a single unit

        properties.unshift({ label: 'Production Cost', value: `$${(inputCost / recipe.output.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})} per unit` });
        properties.push({ label: 'Base Production Time', value: `${(baseTimeForBatch).toFixed(0)}s per batch` });
        properties.push({ label: 'Output per Batch', value: `${recipe.output.quantity.toLocaleString()} unit(s)` });
        properties.push({ label: 'Building', value: recipe.buildingId.charAt(0).toUpperCase() + recipe.buildingId.slice(1).replace(/_/g, ' ') });
        properties.push({ label: 'XP Gained', value: `${xpGain.toFixed(2)}` });
    } else {
        // It's a base material
        properties.unshift({ label: 'Type', value: 'Base Resource' });
    }

    finalEntries.push({
        id: itemName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_'),
        name: itemName,
        category: "Product", // Default, will be overridden
        description: `Description for ${itemName}.`,
        imageUrl: getImageUrl(itemName),
        imageHint: getImageHint(itemName),
        properties: properties,
        recipe: recipe ? recipe : undefined,
    });
});


// Final Categorization and Sorting
const categoryOrder = ['Utafiti', 'Space', 'Vehicles', 'Spares', 'Electronics', 'Construction', 'Vifaa', 'Documents', 'Madini', 'Mafuta', 'Raw Material', 'Agriculture', 'Food', 'Mavazi', 'Product'];
const itemCategorization: Record<string, string> = {
    'Mbao': 'Construction', 'Matofali': 'Construction', 'Nondo': 'Construction', 'Zege': 'Construction', 'Mabati': 'Construction',
    'Saruji': 'Construction', 'Mchanga': 'Construction', 'Mawe': 'Construction', 'Kokoto': 'Construction',
    'Miti': 'Raw Material', 'Madini ya chuma': 'Raw Material', 'Chuma': 'Construction',
    'Almasi': 'Madini', 'Dhahabu': 'Madini', 'Silver': 'Madini', 'Ruby': 'Madini', 'Tanzanite': 'Madini', 'Shaba': 'Madini',
    'Mafuta Ghafi': 'Mafuta', 'Disel': 'Mafuta', 'Petrol': 'Mafuta',
    'Mbegu': 'Agriculture', 'Maharage': 'Agriculture', 'Mchele': 'Agriculture', 'Unga wa ngano': 'Food',
    'Unga wa sembe': 'Food', 'Ndizi': 'Agriculture', 'Viazi mbatata': 'Agriculture', 'Mboga mboga': 'Agriculture',
    'Embe': 'Agriculture', 'Nanasi': 'Agriculture', 'Parachichi': 'Agriculture', 'Miwa': 'Agriculture',
    'Nyasi': 'Agriculture', 'Mbolea': 'Agriculture', 'Zabibu': 'Agriculture', 'Apple': 'Agriculture',
    'Chungwa': 'Agriculture', 'Korosho': 'Agriculture', 'Karafuu': 'Agriculture', 'Pamba': 'Raw Material',
    'Katani': 'Raw Material',
    'Yai': 'Food', 'Kuku': 'Agriculture', 'Ngombe': 'Agriculture', 'Nyama': 'Food',
    'Sukari': 'Food', 'Bwawa': 'Vifaa', 'Boat': 'Vifaa',
    'Samaki': 'Food', 'Chumvi': 'Food',
    'Wali wa Samaki': 'Food',
    'Maharage na Ndizi': 'Food',
    'Chipsi Nyama': 'Food',
    'Pilau ya Nyama': 'Food',
    'Ugali Maharage': 'Food',
    'Ugali Samaki': 'Food',
    'Chipsi Mayai': 'Food',
    'Saladi ya Matunda': 'Food',
    'Kachumbari': 'Food',
    'Juisi Mchanganyiko': 'Food',
    'Githeri': 'Food',
    'Burger ya Kuku': 'Food',
    'Sandwich ya Mayai': 'Food',
    'Umeme': 'Raw Material', 'Maji': 'Raw Material',
    'Karatasi': 'Product', 'Cheti cha Madini': 'Documents',

    // Mavazi
    'Gundi': 'Raw Material',
    'Chokaa': 'Raw Material',
    'Kioo': 'Product',
    'Kitamba': 'Product',
    'Ngozi': 'Product',
    'Soli': 'Product',
    'Saa': 'Mavazi',
    'Viatu': 'Mavazi',
    'Pochi': 'Mavazi',
    'T-Shirt': 'Mavazi',
    'Jeans': 'Mavazi',
    'Skirt': 'Mavazi',
    'Kijora': 'Mavazi',
    'Mkufu wa Dhahabu': 'Mavazi',
    'Saa ya Dhahabu': 'Mavazi',
    'Pete ya Dhahabu': 'Mavazi',
    'Mkufu wa Almasi': 'Mavazi',
    'Saa ya Almasi': 'Mavazi',
    'Pete ya Almasi': 'Mavazi',

    // Electronics
    'TV': 'Electronics',
    'Tablet': 'Electronics',
    'Smartphone': 'Electronics',
    'Laptop': 'Electronics',
    'Processor': 'Electronics',
    'Betri': 'Electronics',
    'Display': 'Electronics',
    'Motherboard': 'Electronics',
    'Vifaa vya ndani': 'Electronics',
    'Housing': 'Electronics',
    'Nyaya': 'Electronics',
    'LCD': 'Electronics',
    'Cathode': 'Electronics',
    'Anode': 'Electronics',
    'Ram': 'Electronics',
    'Rom': 'Electronics',
    'PCB': 'Electronics',

    // Vehicle Chain
    'Car Body': 'Spares',
    'Bike Body': 'Spares',
    'Interior': 'Spares',
    'Luxury Interior': 'Spares',
    'Motor': 'Wrench',
    'Engine': 'Spares',
    'Dashboard': 'Spares',
    'Bull dozer body': 'Spares',
    'Truck body': 'Spares',
    'Bodi ya Ndege': 'Spares',
    'Bodi ya Meli': 'Spares',
    'Bull Dozer': 'Vehicles',
    'Lori': 'Vehicles',
    'Gari ya kifahari': 'Vehicles',
    'Gari': 'Vehicles',
    'Pikipiki ya Kifahari': 'Vehicles',
    'Pikipiki': 'Vehicles',
    'Ndege': 'Vehicles',
    'Ndege ya kifahari': 'Vehicles',
    'Meli': 'Vehicles',
    'Meli ya kifahari': 'Vehicles',
    
    // Space Chain
    'Roketi': 'Space',
    'Fuselage': 'Space',
    'Wings': 'Space',
    'Tarakilishi': 'Space',
    'Cockpit': 'Space',
    'Attitude Control': 'Space',
    'Rocket Engine': 'Space',
    'Heat Shield': 'Space',

    // Research
    'Utafiti wa Kilimo': 'Utafiti',
    'Utafiti wa Ujenzi': 'Utafiti',
    'Utafiti wa Nguo': 'Utafiti',
    'Utafiti wa Electroniki': 'Utafiti',
    'Utafiti wa Usafiri': 'Utafiti',
    'Utafiti wa Anga': 'Utafiti',
};

// Auto-categorize Machines and Licenses
finalEntries.forEach(entry => {
    if (entry.name.endsWith('Mashine')) {
        itemCategorization[entry.name] = 'Vifaa';
    }
    if (entry.name.startsWith('Leseni')) {
        itemCategorization[entry.name] = 'Documents';
    }
});

finalEntries.forEach(entry => {
    if (itemCategorization[entry.name]) {
        entry.category = itemCategorization[entry.name];
    }
});


export const encyclopediaData: EncyclopediaEntry[] = finalEntries.sort((a, b) => {
    const categoryAIndex = categoryOrder.indexOf(a.category);
    const categoryBIndex = categoryOrder.indexOf(b.category);

    const effectiveA = categoryAIndex === -1 ? Infinity : categoryAIndex;
    const effectiveB = categoryBIndex === -1 ? Infinity : categoryBIndex;

    if (effectiveA !== effectiveB) {
        return effectiveA - effectiveB;
    }
    return a.name.localeCompare(b.name);
});

    
