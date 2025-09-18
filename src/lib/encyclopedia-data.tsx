

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
    'Juice': <CookingPot className="text-pink-500" />,

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
    'Mashine A1': <Wrench className="text-gray-400" />,
    'Mashine A2': <Wrench className="text-gray-400" />,
    'Mashine A3': <Wrench className="text-gray-400" />,
    'Mashine A4': <Wrench className="text-gray-400" />,
    'Mashine A5': <Wrench className="text-gray-400" />,
    'Mashine B1': <Wrench className="text-gray-400" />,
    'Mashine B2': <Wrench className="text-gray-400" />,
    'Mashine B3': <Wrench className="text-gray-400" />,
    'Mashine B4': <Wrench className="text-gray-400" />,
    'Mashine B5': <Wrench className="text-gray-400" />,
    'Mashine B6': <Wrench className="text-gray-400" />,
    'Mashine B7': <Wrench className="text-gray-400" />,
    'Mashine C1': <Wrench className="text-gray-400" />,
    'Mashine C2': <Wrench className="text-gray-400" />,
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


// Create a map of all recipe costs for easy lookup
const recipeCosts = new Map<string, number>();
recipes.forEach(recipe => {
    recipeCosts.set(recipe.output.name, recipe.cost);
});

// Helper to calculate market cost (production cost + profit margin)
const calculateMarketCost = (itemName: string): number => {
    const productionCost = recipeCosts.get(itemName) || 0;
    // Add a 25% profit margin, rounding to nearest integer
    return Math.ceil(productionCost * 1.25); 
};


const generatedEntries = recipes.map(recipe => {
    const buildingInfo = buildingData[recipe.buildingId];
    const baseTimePerUnit = buildingInfo ? (3600) / buildingInfo.productionRate : 0; // Time in seconds for 1 unit at level 1
    const marketCost = calculateMarketCost(recipe.output.name);

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
            { label: 'Market Cost', value: `$${marketCost}`},
            { label: 'Base Production Time', value: `${baseTimePerUnit.toFixed(2)}s / unit` },
            { label: 'Output Quantity', value: `${recipe.output.quantity.toLocaleString()} unit(s)` },
            { label: 'Building', value: recipe.buildingId.charAt(0).toUpperCase() + recipe.buildingId.slice(1).replace(/_/g, ' ') }
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


// Define base costs for fundamental raw materials
const baseMaterialCosts: Record<string, number> = {
    'Maji': 0.02,
    'Umeme': 0.03,
    'Mbegu': 0.1,
    'Nyasi': 0.05,
    'Miti': 1.5,
    'Mawe': 0.5,
    'Mchanga': 0.4,
    'Madini ya chuma': 5,
};


// Add entries for items that are inputs but not outputs
allItemNames.forEach(itemName => {
    if (!generatedEntries.some(entry => entry.name === itemName)) {
        let estimatedCost = baseMaterialCosts[itemName] || 10; // Use base cost or a default
        
        if (itemName.startsWith('Leseni')) {
            estimatedCost = 10000;
        } else if (itemName === 'Cheti cha Madini') {
            estimatedCost = 5000;
        }

        const entry: EncyclopediaEntry = {
            id: itemName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_'),
            name: itemName,
            category: "Raw Material",
            description: `A fundamental resource or piece of equipment used in production. It may be produced or sourced from suppliers.`,
            imageUrl: getImageUrl(itemName),
            imageHint: getImageHint(itemName),
            icon: getIcon(itemName),
            properties: [
                { label: 'Type', value: 'Base Input' },
                { label: 'Market Cost', value: `$${estimatedCost.toLocaleString(undefined, {minimumFractionDigits: 2})}` }
            ],
        };
        generatedEntries.push(entry);
    }
});


// Group items by category for the market view
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
    'Sukari': 'Food', 'Juice': 'Food', 'Bwawa': 'Vifaa', 'Boat': 'Vifaa',
    'Samaki': 'Food', 'Chumvi': 'Food',
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
allItemNames.forEach(itemName => {
    if (itemName.startsWith('Mashine')) {
        itemCategorization[itemName] = 'Vifaa';
    }
    if (itemName.startsWith('Leseni')) {
        itemCategorization[itemName] = 'Documents';
    }
    if (itemName.startsWith('K') && itemName.endsWith('Mashine')) {
        itemCategorization[itemName] = 'Vifaa';
    }
});

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

