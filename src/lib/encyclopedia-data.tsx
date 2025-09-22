

import React from 'react';
import { recipes, type Recipe } from './recipe-data';
import { buildingData } from './building-data';
import { 
    Apple, Bean, Beef, Boat, ToyBrick, Building, Carrot, Citrus, Component,
    Egg, Factory, Feather, Fish, Gem, GlassWater, Grape, Hammer, Leaf, LucideIcon, 
    Milestone, Mountain, Package, Palmtree, Recycle, Shell, Ship, Shrub, Sprout,
    Sun, TreeDeciduous, Utensils, Warehouse, Wheat, Wind, Wrench, FileText, ScrollText, Droplets, Zap,
    Building2, Glasses, FlaskConical, Shirt, Watch, Footprints, CircleDollarSign, Medal, Crown,
    Tv, Tablet, Smartphone, Laptop, Cpu, Battery, MemoryStick, HardDrive, Speaker, CircuitBoard,
    Monitor, Car, Bike, Plane, Tractor, Rocket, ShieldCheck
} from 'lucide-react';


export type EncyclopediaEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  icon: React.ReactNode;
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

const itemIcons: Record<string, React.ReactNode> = {
    // Construction
    'Mbao': <Hammer />,
    'Matofali': <ToyBrick />,
    'Nondo': <Component />,
    'Zege': <Building />,
    'Saruji': <Building />,
    'Mabati': <Building />,

    // Raw Materials (Ujenzi)
    'Mchanga': <Shell />,
    'Mawe': <Mountain />,
    'Kokoto': <Milestone />,
    'Miti': <TreeDeciduous />,
    'Madini ya chuma': <Gem />,
    'Chuma': <Wrench />,
    
    // Madini
    'Shaba': <Gem />,
    'Almasi': <Gem />,
    'Dhahabu': <Gem />,
    'Silver': <Gem />,
    'Ruby': <Gem />,
    'Tanzanite': <Gem />,

    // Agriculture & Food
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
    'Korosho': <Package />, // No squirrel icon
    'Karafuu': <Sun />,
    'Pamba': <Feather />,
    'Katani': <Package />,
    'Yai': <Egg />,
    'Kuku': <Feather />,
    'Ngombe': <Package />,
    'Nyama': <Beef />,
    'Sukari': <Wheat />,
    
    'Wali wa Samaki': <Utensils />,
    'Maharage na Ndizi': <Utensils />,
    'Chipsi Nyama': <Utensils />,
    'Pilau ya Nyama': <Utensils />,
    'Ugali Maharage': <Utensils />,
    'Ugali Samaki': <Utensils />,
    'Chipsi Mayai': <Utensils />,
    'Saladi ya Matunda': <Utensils />,
    'Kachumbari': <Utensils />,
    'Juisi Mchanganyiko': <Utensils />,
    'Githeri': <Utensils />,
    'Burger ya Kuku': <Utensils />,
    'Sandwich ya Mayai': <Utensils />,


    // Mafuta
    'Mafuta Ghafi': <Droplets />,
    'Disel': <Droplets />,
    'Petrol': <Droplets />,

    // Uvuvi
    'Bwawa': <Warehouse />,
    'Boat': <Ship />,
    'Samaki': <Fish />,
    'Chumvi': <Package />,

    // Utilities
    'Umeme': <Zap />,
    'Maji': <Droplets />,

    // Mavazi & Nguo
    'Gundi': <FlaskConical />,
    'Chokaa': <Building2 />,
    'Kioo': <Glasses />,
    'Kitamba': <Package />,
    'Ngozi': <Package />,
    'Soli': <Footprints />,
    'Saa': <Watch />,
    'Viatu': <Footprints />,
    'Pochi': <Package />,
    'T-Shirt': <Shirt />,
    'Jeans': <Shirt />,
    'Skirt': <Shirt />,
    'Kijora': <Shirt />,
    // Vito
    'Mkufu wa Dhahabu': <Medal />,
    'Saa ya Dhahabu': <Watch />,
    'Pete ya Dhahabu': <CircleDollarSign />,
    'Mkufu wa Almasi': <Crown />,
    'Saa ya Almasi': <Watch />,
    'Pete ya Almasi': <Gem />,

    // Electronics
    'TV': <Tv />,
    'Tablet': <Tablet />,
    'Smartphone': <Smartphone />,
    'Laptop': <Laptop />,
    'Processor': <Cpu />,
    'Betri': <Battery />,
    'Display': <Monitor />,
    'Motherboard': <MemoryStick />,
    'Vifaa vya ndani': <Wrench />,
    'Housing': <HardDrive />,
    'Nyaya': <Component />,
    'LCD': <Monitor />,
    'Cathode': <CircuitBoard />,
    'Anode': <CircuitBoard />,
    'Ram': <MemoryStick />,
    'Rom': <MemoryStick />,
    'PCB': <CircuitBoard />,

    // Vehicle Chain
    'Car Body': <Car />,
    'Bike Body': <Bike />,
    'Interior': <Package />,
    'Luxury Interior': <Package />,
    'Motor': <Wrench />,
    'Engine': <Cpu />,
    'Dashboard': <Monitor />,
    'Bull Dozer': <Tractor />,
    'Lori': <Tractor />,
    'Gari ya kifahari': <Car />,
    'Gari': <Car />,
    'Pikipiki ya Kifahari': <Bike />,
    'Pikipiki': <Bike />,
    'Ndege': <Plane />,
    'Ndege ya kifahari': <Plane />,
    'Meli': <Ship />,
    'Meli ya kifahari': <Ship />,
    'Bull dozer body': <Package />,
    'Truck body': <Package />,
    'Bodi ya Ndege': <Package />,
    'Bodi ya Meli': <Package />,
    
    // Space Chain
    'Roketi': <Rocket />,
    'Fuselage': <Package />,
    'Wings': <Plane />,
    'Tarakilishi': <Cpu />,
    'Cockpit': <Package />,
    'Attitude Control': <Component />,
    'Rocket Engine': <Cpu />,
    'Heat Shield': <ShieldCheck />,


    // Vifaa & Nyaraka
    'A1 Mashine': <Wrench />,
    'A2 Mashine': <Wrench />,
    'A3 Mashine': <Wrench />,
    'A4 Mashine': <Wrench />,
    'A5 Mashine': <Wrench />,
    'B1 Mashine': <Wrench />,
    'B2 Mashine': <Wrench />,
    'B3 Mashine': <Wrench />,
    'B4 Mashine': <Wrench />,
    'B5 Mashine': <Wrench />,
    'B6 Mashine': <Wrench />,
    'B7 Mashine': <Wrench />,
    'C1 Mashine': <Wrench />,
    'C2 Mashine': <Wrench />,
    'K1 Mashine': <Wrench />,
    'K2 Mashine': <Wrench />,
    'K3 Mashine': <Wrench />,
    'K4 Mashine': <Wrench />,
    'K5 Mashine': <Wrench />,
    'K6 Mashine': <Wrench />,
    'K7 Mashine': <Wrench />,
    'Leseni B1': <FileText />,
    'Leseni B2': <FileText />,
    'Leseni B3': <FileText />,
    'Leseni B4': <FileText />,
    'Leseni B5': <FileText />,
    'Leseni B6': <FileText />,
    'Leseni B7': <FileText />,
    'Karatasi': <ScrollText />,
    'Cheti cha Madini': <FileText />,
    
    // Default
    'Default': <Package />
};

const getIcon = (name: string): React.ReactNode => {
    return itemIcons[name] || itemIcons['Default'];
};


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
            const costPerUnit = inputCost / recipe.output.quantity;
            calculatedPrices[itemName] = costPerUnit * 1.15; // Add a 15% margin for market price
            priceCalculationCompleted.add(itemName);
        } else {
            stillToCalculate.push(itemName);
        }
    }

    if (stillToCalculate.length > 0 && stillToCalculate.length === itemsToCalculate.length) {
        // No progress made, indicates a circular dependency or missing base price
        console.error("Could not calculate prices for:", stillToCalculate);
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
        
        const buildingInfo = buildingData[recipe.buildingId];
        // Time in seconds for one BATCH
        const baseTimeForBatch = buildingInfo ? (3600) / (buildingInfo.productionRate) : 0; 
        
        properties.unshift({ label: 'Production Cost', value: `$${(inputCost / recipe.output.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})} per unit` });
        properties.push({ label: 'Base Production Time', value: `${(baseTimeForBatch).toFixed(0)}s per batch` });
        properties.push({ label: 'Output per Batch', value: `${recipe.output.quantity.toLocaleString()} unit(s)` });
        properties.push({ label: 'Building', value: recipe.buildingId.charAt(0).toUpperCase() + recipe.buildingId.slice(1).replace(/_/g, ' ') });

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
        icon: getIcon(itemName),
        properties: properties,
        recipe: recipe ? {
            inputs: recipe.inputs.map(input => ({
                name: input.name,
                quantity: input.quantity,
                imageUrl: getImageUrl(input.name)
            }))
        } : undefined,
    });
});


// Final Categorization and Sorting
const categoryOrder = ['Space', 'Vehicles', 'Spares', 'Electronics', 'Construction', 'Vifaa', 'Documents', 'Madini', 'Mafuta', 'Raw Material', 'Agriculture', 'Food', 'Mavazi', 'Product'];
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
    'Motor': 'Spares',
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
