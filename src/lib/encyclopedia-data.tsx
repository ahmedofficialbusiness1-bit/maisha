
import React from 'react';
import { recipes, type Recipe } from './recipe-data';
import { buildingData } from './building-data';
import { 
    Apple, Bean, Beef, Boat, ToyBrick, Building, Carrot, Citrus, Component, CookingPot,
    Egg, Factory, Feather, Fish, Gem, GlassWater, Grape, Hammer, Leaf, LucideIcon, 
    Milestone, Mountain, Package, Palmtree, Recycle, Shell, Ship, Shrub, Sprout,
    Squirrel, Sun, TreeDeciduous, Utensils, Warehouse, Wheat, Wind, Wrench, FileText, ScrollText, Droplets, Zap,
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
    // Construction
    'Mbao': <Hammer className="text-amber-800" />,
    'Matofali': <ToyBrick className="text-orange-600" />,
    'Nondo': <Component className="text-slate-500" />,
    'Zege': <Building className="text-gray-500" />,
    'Saruji': <Building className="text-gray-400" />,
    'Mabati': <Building className="text-slate-400" />,

    // Raw Materials (Ujenzi)
    'Mchanga': <Shell className="text-yellow-600" />,
    'Mawe': <Mountain className="text-gray-500" />,
    'Kokoto': <Milestone className="text-gray-600" />,
    'Miti': <TreeDeciduous className="text-green-700" />,
    'Madini ya chuma': <Gem className="text-slate-600" />,
    'Chuma': <Wrench className="text-slate-500" />,
    
    // Madini
    'Shaba': <Gem className="text-orange-400" />,
    'Almasi': <Gem className="text-cyan-400" />,
    'Dhahabu': <Gem className="text-yellow-400" />,
    'Silver': <Gem className="text-slate-400" />,
    'Ruby': <Gem className="text-red-500" />,
    'Tanzanite': <Gem className="text-purple-400" />,

    // Agriculture & Food
    'Mbegu': <Sprout className="text-green-400" />,
    'Maharage': <Bean className="text-amber-900" />,
    'Mchele': <Package className="text-gray-200" />,
    'Unga wa ngano': <Wheat className="text-amber-200" />,
    'Unga wa sembe': <Package className="text-yellow-100" />,
    'Ndizi': <Package className="text-yellow-300" />,
    'Viazi mbatata': <Package className="text-amber-500" />,
    'Mboga mboga': <Carrot className="text-orange-500" />,
    'Embe': <Apple className="text-yellow-500" />,
    'Nanasi': <Palmtree className="text-yellow-600" />,
    'Parachichi': <Package className="text-green-800" />,
    'Miwa': <Shrub className="text-lime-500" />,
    'Nyasi': <Leaf className="text-green-500" />,
    'Mbolea': <Recycle className="text-brown-500" />,
    'Zabibu': <Grape className="text-purple-600" />,
    'Apple': <Apple className="text-red-600" />,
    'Chungwa': <Citrus className="text-orange-500" />,
    'Korosho': <Squirrel className="text-amber-700" />,
    'Karafuu': <Sun className="text-red-900" />,
    'Pamba': <Feather className="text-gray-200" />,
    'Katani': <Package className="text-lime-700" />,
    'Yai': <Egg className="text-yellow-200" />,
    'Kuku': <Feather className="text-orange-400" />,
    'Ngombe': <Package className="text-brown-400" />,
    'Nyama': <Beef className="text-red-700" />,
    'Sukari': <Wheat className="text-white" />,
    
    'Wali wa Samaki': <Utensils className="text-white" />,
    'Maharage na Ndizi': <Utensils className="text-white" />,
    'Chipsi Nyama': <Utensils className="text-white" />,
    'Pilau ya Nyama': <Utensils className="text-white" />,
    'Ugali Maharage': <Utensils className="text-white" />,
    'Ugali Samaki': <Utensils className="text-white" />,
    'Chipsi Mayai': <Utensils className="text-white" />,
    'Saladi ya Matunda': <Utensils className="text-white" />,
    'Kachumbari': <Utensils className="text-white" />,
    'Juisi Mchanganyiko': <Utensils className="text-white" />,
    'Githeri': <Utensils className="text-white" />,
    'Burger ya Kuku': <Utensils className="text-white" />,
    'Sandwich ya Mayai': <Utensils className="text-white" />,


    // Mafuta
    'Mafuta Ghafi': <Droplets className="text-black" />,
    'Disel': <Droplets className="text-gray-600" />,
    'Petrol': <Droplets className="text-orange-500" />,

    // Uvuvi
    'Bwawa': <Warehouse className="text-blue-700" />,
    'Boat': <Ship className="text-white" />,
    'Samaki': <Fish className="text-cyan-500" />,
    'Chumvi': <Package className="text-gray-300" />,

    // Utilities
    'Umeme': <Zap className="text-yellow-300" />,
    'Maji': <Droplets className="text-blue-500" />,

    // Mavazi & Nguo
    'Gundi': <FlaskConical className="text-yellow-200" />,
    'Chokaa': <Building2 className="text-stone-400" />,
    'Kioo': <Glasses className="text-cyan-300" />,
    'Kitamba': <Package className="text-pink-400" />,
    'Ngozi': <Package className="text-amber-800" />,
    'Soli': <Footprints className="text-stone-500" />,
    'Saa': <Watch className="text-slate-300" />,
    'Viatu': <Footprints className="text-amber-900" />,
    'Pochi': <Package className="text-amber-700" />,
    'T-Shirt': <Shirt className="text-white" />,
    'Jeans': <Shirt className="text-blue-600" />,
    'Skirt': <Shirt className="text-pink-500" />,
    'Kijora': <Shirt className="text-green-500" />,
    // Vito
    'Mkufu wa Dhahabu': <Medal className="text-yellow-400" />,
    'Saa ya Dhahabu': <Watch className="text-yellow-400" />,
    'Pete ya Dhahabu': <CircleDollarSign className="text-yellow-400" />,
    'Mkufu wa Almasi': <Crown className="text-cyan-300" />,
    'Saa ya Almasi': <Watch className="text-cyan-300" />,
    'Pete ya Almasi': <Gem className="text-cyan-300" />,

    // Electronics
    'TV': <Tv className="text-blue-400" />,
    'Tablet': <Tablet className="text-blue-400" />,
    'Smartphone': <Smartphone className="text-blue-400" />,
    'Laptop': <Laptop className="text-blue-400" />,
    'Processor': <Cpu className="text-purple-400" />,
    'Betri': <Battery className="text-green-400" />,
    'Display': <Monitor className="text-cyan-400" />,
    'Motherboard': <MemoryStick className="text-green-600" />,
    'Vifaa vya ndani': <Wrench className="text-slate-400" />,
    'Housing': <HardDrive className="text-gray-500" />,
    'Nyaya': <Component className="text-yellow-600" />,
    'LCD': <Monitor className="text-blue-300" />,
    'Cathode': <CircuitBoard className="text-red-500" />,
    'Anode': <CircuitBoard className="text-green-500" />,
    'Ram': <MemoryStick className="text-blue-500" />,
    'Rom': <MemoryStick className="text-purple-500" />,
    'PCB': <CircuitBoard className="text-green-700" />,

    // Vehicle Chain
    'Car Body': <Car className="text-gray-400"/>,
    'Bike Body': <Bike className="text-gray-400"/>,
    'Interior': <Package className="text-gray-400"/>,
    'Luxury Interior': <Package className="text-yellow-400"/>,
    'Motor': <Wrench className="text-gray-400"/>,
    'Engine': <Cpu className="text-gray-400"/>,
    'Dashboard': <Monitor className="text-gray-400"/>,
    'Bull Dozer': <Tractor className="text-yellow-600"/>,
    'Lori': <Tractor className="text-red-600"/>,
    'Gari ya kifahari': <Car className="text-purple-500"/>,
    'Gari': <Car className="text-blue-500"/>,
    'Pikipiki ya Kifahari': <Bike className="text-purple-500"/>,
    'Pikipiki': <Bike className="text-blue-500"/>,
    'Ndege': <Plane className="text-cyan-500"/>,
    'Ndege ya kifahari': <Plane className="text-purple-500"/>,
    'Meli': <Ship className="text-indigo-500"/>,
    'Meli ya kifahari': <Ship className="text-purple-500"/>,
    'Bull dozer body': <Package className="text-gray-400"/>,
    'Truck body': <Package className="text-gray-400"/>,
    'Bodi ya Ndege': <Package className="text-gray-400"/>,
    'Bodi ya Meli': <Package className="text-gray-400"/>,
    
    // Space Chain
    'Roketi': <Rocket className="text-red-500" />,
    'Fuselage': <Package className="text-slate-300" />,
    'Wings': <Plane className="text-slate-300" />,
    'Tarakilishi': <Cpu className="text-slate-300" />,
    'Cockpit': <Package className="text-slate-300" />,
    'Attitude Control': <Component className="text-slate-300" />,
    'Rocket Engine': <Cpu className="text-slate-300" />,
    'Heat Shield': <ShieldCheck className="text-slate-300" />,


    // Vifaa & Nyaraka
    'A1 Mashine': <Wrench className="text-gray-400" />,
    'A2 Mashine': <Wrench className="text-gray-400" />,
    'A3 Mashine': <Wrench className="text-gray-400" />,
    'A4 Mashine': <Wrench className="text-gray-400" />,
    'A5 Mashine': <Wrench className="text-gray-400" />,
    'B1 Mashine': <Wrench className="text-gray-400" />,
    'B2 Mashine': <Wrench className="text-gray-400" />,
    'B3 Mashine': <Wrench className="text-gray-400" />,
    'B4 Mashine': <Wrench className="text-gray-400" />,
    'B5 Mashine': <Wrench className="text-gray-400" />,
    'B6 Mashine': <Wrench className="text-gray-400" />,
    'B7 Mashine': <Wrench className="text-gray-400" />,
    'C1 Mashine': <Wrench className="text-gray-400" />,
    'C2 Mashine': <Wrench className="text-gray-400" />,
    'K1 Mashine': <Wrench className="text-purple-400" />,
    'K2 Mashine': <Wrench className="text-purple-400" />,
    'K3 Mashine': <Wrench className="text-purple-400" />,
    'K4 Mashine': <Wrench className="text-purple-400" />,
    'K5 Mashine': <Wrench className="text-purple-400" />,
    'K6 Mashine': <Wrench className="text-purple-400" />,
    'K7 Mashine': <Wrench className="text-purple-400" />,
    'Leseni B1': <FileText className="text-blue-300" />,
    'Leseni B2': <FileText className="text-blue-300" />,
    'Leseni B3': <FileText className="text-blue-300" />,
    'Leseni B4': <FileText className="text-blue-300" />,
    'Leseni B5': <FileText className="text-blue-300" />,
    'Leseni B6': <FileText className="text-blue-300" />,
    'Leseni B7': <FileText className="text-blue-300" />,
    'Karatasi': <ScrollText className="text-white" />,
    'Cheti cha Madini': <FileText className="text-yellow-500" />,
    
    // Default
    'Default': <Package className="text-gray-400" />
};

const getIcon = (name: string): React.ReactElement<LucideIcon> => {
    return itemIcons[name] || itemIcons['Default'];
};


// --- Main Execution ---

// A map to look up recipes by their output name quickly.
const recipeMap = new Map<string, Recipe>(recipes.map(r => [r.output.name, r]));

// Get a list of all unique items from recipes and other base items
const allItems = new Set<string>([
    ...recipes.flatMap(r => [r.output.name, ...r.inputs.map(i => i.name)]),
    'Maji', 'Umeme' // Manually add base items not in recipes
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
  'Maji': 0.05, // Added base price
  'Umeme': 0.15, // Added base price
};


// --- Calculate all prices dynamically ---
const calculatedPrices: Record<string, number> = { ...basePriceList };
const priceCalculationCompleted = new Set<string>(Object.keys(basePriceList));

let itemsToCalculate = Array.from(allItems).filter(item => !priceCalculationCompleted.has(item));

let iterations = 0;
const MAX_ITERATIONS = allItems.size; // Prevent infinite loops

while (itemsToCalculate.length > 0 && iterations < MAX_ITERATIONS) {
    const stillToCalculate: string[] = [];
    
    itemsToCalculate.forEach(itemName => {
        const recipe = recipeMap.get(itemName);
        if (!recipe) {
            // Should be a base item, but if not in basePriceList, we can't price it.
            if (!calculatedPrices[itemName]) {
              // console.warn(`Item "${itemName}" has no recipe and no base price. Setting to 0.`);
              calculatedPrices[itemName] = 0;
            }
            priceCalculationCompleted.add(itemName); 
            return;
        }

        let canCalculate = true;
        let inputCost = 0;

        for (const input of recipe.inputs) {
            if (calculatedPrices[input.name] === undefined) {
                canCalculate = false;
                break;
            }
            inputCost += calculatedPrices[input.name] * input.quantity;
        }

        if (canCalculate) {
            const costPerUnit = inputCost / recipe.output.quantity;
            calculatedPrices[itemName] = costPerUnit * 1.15; // Add a 15% margin for market price
            priceCalculationCompleted.add(itemName);
        } else {
            stillToCalculate.push(itemName);
        }
    });

    if (stillToCalculate.length === itemsToCalculate.length) {
        // No progress made, indicates a circular dependency or missing base price
        console.error("Could not calculate prices for:", stillToCalculate);
        break; 
    }
    
    itemsToCalculate = stillToCalculate;
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
