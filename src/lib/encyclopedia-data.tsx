
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

const itemIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    // Construction
    'Mbao': (props) => <Hammer {...props} className="text-amber-800" />,
    'Matofali': (props) => <ToyBrick {...props} className="text-orange-600" />,
    'Nondo': (props) => <Component {...props} className="text-slate-500" />,
    'Zege': (props) => <Building {...props} className="text-gray-500" />,
    'Saruji': (props) => <Building {...props} className="text-gray-400" />,
    'Mabati': (props) => <Building {...props} className="text-slate-400" />,

    // Raw Materials (Ujenzi)
    'Mchanga': (props) => <Shell {...props} className="text-yellow-600" />,
    'Mawe': (props) => <Mountain {...props} className="text-gray-500" />,
    'Kokoto': (props) => <Milestone {...props} className="text-gray-600" />,
    'Miti': (props) => <TreeDeciduous {...props} className="text-green-700" />,
    'Madini ya chuma': (props) => <Gem {...props} className="text-slate-600" />,
    'Chuma': (props) => <Wrench {...props} className="text-slate-500" />,
    
    // Madini
    'Shaba': (props) => <Gem {...props} className="text-orange-400" />,
    'Almasi': (props) => <Gem {...props} className="text-cyan-400" />,
    'Dhahabu': (props) => <Gem {...props} className="text-yellow-400" />,
    'Silver': (props) => <Gem {...props} className="text-slate-400" />,
    'Ruby': (props) => <Gem {...props} className="text-red-500" />,
    'Tanzanite': (props) => <Gem {...props} className="text-purple-400" />,

    // Agriculture & Food
    'Mbegu': (props) => <Sprout {...props} className="text-green-400" />,
    'Maharage': (props) => <Bean {...props} className="text-amber-900" />,
    'Mchele': (props) => <Package {...props} className="text-gray-200" />,
    'Unga wa ngano': (props) => <Wheat {...props} className="text-amber-200" />,
    'Unga wa sembe': (props) => <Package {...props} className="text-yellow-100" />,
    'Ndizi': (props) => <Package {...props} className="text-yellow-300" />,
    'Viazi mbatata': (props) => <Package {...props} className="text-amber-500" />,
    'Mboga mboga': (props) => <Carrot {...props} className="text-orange-500" />,
    'Embe': (props) => <Apple {...props} className="text-yellow-500" />,
    'Nanasi': (props) => <Palmtree {...props} className="text-yellow-600" />,
    'Parachichi': (props) => <Package {...props} className="text-green-800" />,
    'Miwa': (props) => <Shrub {...props} className="text-lime-500" />,
    'Nyasi': (props) => <Leaf {...props} className="text-green-500" />,
    'Mbolea': (props) => <Recycle {...props} className="text-brown-500" />,
    'Zabibu': (props) => <Grape {...props} className="text-purple-600" />,
    'Apple': (props) => <Apple {...props} className="text-red-600" />,
    'Chungwa': (props) => <Citrus {...props} className="text-orange-500" />,
    'Korosho': (props) => <Squirrel {...props} className="text-amber-700" />,
    'Karafuu': (props) => <Sun {...props} className="text-red-900" />,
    'Pamba': (props) => <Feather {...props} className="text-gray-200" />,
    'Katani': (props) => <Package {...props} className="text-lime-700" />,
    'Yai': (props) => <Egg {...props} className="text-yellow-200" />,
    'Kuku': (props) => <Feather {...props} className="text-orange-400" />,
    'Ngombe': (props) => <Package {...props} className="text-brown-400" />,
    'Nyama': (props) => <Beef {...props} className="text-red-700" />,
    'Sukari': (props) => <Wheat {...props} className="text-white" />,
    
    'Wali wa Samaki': (props) => <Utensils {...props} className="text-white" />,
    'Maharage na Ndizi': (props) => <Utensils {...props} className="text-white" />,
    'Chipsi Nyama': (props) => <Utensils {...props} className="text-white" />,
    'Pilau ya Nyama': (props) => <Utensils {...props} className="text-white" />,
    'Ugali Maharage': (props) => <Utensils {...props} className="text-white" />,
    'Ugali Samaki': (props) => <Utensils {...props} className="text-white" />,
    'Chipsi Mayai': (props) => <Utensils {...props} className="text-white" />,
    'Saladi ya Matunda': (props) => <Utensils {...props} className="text-white" />,
    'Kachumbari': (props) => <Utensils {...props} className="text-white" />,
    'Juisi Mchanganyiko': (props) => <Utensils {...props} className="text-white" />,
    'Githeri': (props) => <Utensils {...props} className="text-white" />,
    'Burger ya Kuku': (props) => <Utensils {...props} className="text-white" />,
    'Sandwich ya Mayai': (props) => <Utensils {...props} className="text-white" />,


    // Mafuta
    'Mafuta Ghafi': (props) => <Droplets {...props} className="text-black" />,
    'Disel': (props) => <Droplets {...props} className="text-gray-600" />,
    'Petrol': (props) => <Droplets {...props} className="text-orange-500" />,

    // Uvuvi
    'Bwawa': (props) => <Warehouse {...props} className="text-blue-700" />,
    'Boat': (props) => <Ship {...props} className="text-white" />,
    'Samaki': (props) => <Fish {...props} className="text-cyan-500" />,
    'Chumvi': (props) => <Package {...props} className="text-gray-300" />,

    // Utilities
    'Umeme': (props) => <Zap {...props} className="text-yellow-300" />,
    'Maji': (props) => <Droplets {...props} className="text-blue-500" />,

    // Mavazi & Nguo
    'Gundi': (props) => <FlaskConical {...props} className="text-yellow-200" />,
    'Chokaa': (props) => <Building2 {...props} className="text-stone-400" />,
    'Kioo': (props) => <Glasses {...props} className="text-cyan-300" />,
    'Kitamba': (props) => <Package {...props} className="text-pink-400" />,
    'Ngozi': (props) => <Package {...props} className="text-amber-800" />,
    'Soli': (props) => <Footprints {...props} className="text-stone-500" />,
    'Saa': (props) => <Watch {...props} className="text-slate-300" />,
    'Viatu': (props) => <Footprints {...props} className="text-amber-900" />,
    'Pochi': (props) => <Package {...props} className="text-amber-700" />,
    'T-Shirt': (props) => <Shirt {...props} className="text-white" />,
    'Jeans': (props) => <Shirt {...props} className="text-blue-600" />,
    'Skirt': (props) => <Shirt {...props} className="text-pink-500" />,
    'Kijora': (props) => <Shirt {...props} className="text-green-500" />,
    // Vito
    'Mkufu wa Dhahabu': (props) => <Medal {...props} className="text-yellow-400" />,
    'Saa ya Dhahabu': (props) => <Watch {...props} className="text-yellow-400" />,
    'Pete ya Dhahabu': (props) => <CircleDollarSign {...props} className="text-yellow-400" />,
    'Mkufu wa Almasi': (props) => <Crown {...props} className="text-cyan-300" />,
    'Saa ya Almasi': (props) => <Watch {...props} className="text-cyan-300" />,
    'Pete ya Almasi': (props) => <Gem {...props} className="text-cyan-300" />,

    // Electronics
    'TV': (props) => <Tv {...props} className="text-blue-400" />,
    'Tablet': (props) => <Tablet {...props} className="text-blue-400" />,
    'Smartphone': (props) => <Smartphone {...props} className="text-blue-400" />,
    'Laptop': (props) => <Laptop {...props} className="text-blue-400" />,
    'Processor': (props) => <Cpu {...props} className="text-purple-400" />,
    'Betri': (props) => <Battery {...props} className="text-green-400" />,
    'Display': (props) => <Monitor {...props} className="text-cyan-400" />,
    'Motherboard': (props) => <MemoryStick {...props} className="text-green-600" />,
    'Vifaa vya ndani': (props) => <Wrench {...props} className="text-slate-400" />,
    'Housing': (props) => <HardDrive {...props} className="text-gray-500" />,
    'Nyaya': (props) => <Component {...props} className="text-yellow-600" />,
    'LCD': (props) => <Monitor {...props} className="text-blue-300" />,
    'Cathode': (props) => <CircuitBoard {...props} className="text-red-500" />,
    'Anode': (props) => <CircuitBoard {...props} className="text-green-500" />,
    'Ram': (props) => <MemoryStick {...props} className="text-blue-500" />,
    'Rom': (props) => <MemoryStick {...props} className="text-purple-500" />,
    'PCB': (props) => <CircuitBoard {...props} className="text-green-700" />,

    // Vehicle Chain
    'Car Body': (props) => <Car {...props} className="text-gray-400"/>,
    'Bike Body': (props) => <Bike {...props} className="text-gray-400"/>,
    'Interior': (props) => <Package {...props} className="text-gray-400"/>,
    'Luxury Interior': (props) => <Package {...props} className="text-yellow-400"/>,
    'Motor': (props) => <Wrench {...props} className="text-gray-400"/>,
    'Engine': (props) => <Cpu {...props} className="text-gray-400"/>,
    'Dashboard': (props) => <Monitor {...props} className="text-gray-400"/>,
    'Bull Dozer': (props) => <Tractor {...props} className="text-yellow-600"/>,
    'Lori': (props) => <Tractor {...props} className="text-red-600"/>,
    'Gari ya kifahari': (props) => <Car {...props} className="text-purple-500"/>,
    'Gari': (props) => <Car {...props} className="text-blue-500"/>,
    'Pikipiki ya Kifahari': (props) => <Bike {...props} className="text-purple-500"/>,
    'Pikipiki': (props) => <Bike {...props} className="text-blue-500"/>,
    'Ndege': (props) => <Plane {...props} className="text-cyan-500"/>,
    'Ndege ya kifahari': (props) => <Plane {...props} className="text-purple-500"/>,
    'Meli': (props) => <Ship {...props} className="text-indigo-500"/>,
    'Meli ya kifahari': (props) => <Ship {...props} className="text-purple-500"/>,
    'Bull dozer body': (props) => <Package {...props} className="text-gray-400"/>,
    'Truck body': (props) => <Package {...props} className="text-gray-400"/>,
    'Bodi ya Ndege': (props) => <Package {...props} className="text-gray-400"/>,
    'Bodi ya Meli': (props) => <Package {...props} className="text-gray-400"/>,
    
    // Space Chain
    'Roketi': (props) => <Rocket {...props} className="text-red-500" />,
    'Fuselage': (props) => <Package {...props} className="text-slate-300" />,
    'Wings': (props) => <Plane {...props} className="text-slate-300" />,
    'Tarakilishi': (props) => <Cpu {...props} className="text-slate-300" />,
    'Cockpit': (props) => <Package {...props} className="text-slate-300" />,
    'Attitude Control': (props) => <Component {...props} className="text-slate-300" />,
    'Rocket Engine': (props) => <Cpu {...props} className="text-slate-300" />,
    'Heat Shield': (props) => <ShieldCheck {...props} className="text-slate-300" />,


    // Vifaa & Nyaraka
    'A1 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'A2 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'A3 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'A4 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'A5 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B1 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B2 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B3 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B4 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B5 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B6 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'B7 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'C1 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'C2 Mashine': (props) => <Wrench {...props} className="text-gray-400" />,
    'K1 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'K2 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'K3 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'K4 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'K5 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'K6 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'K7 Mashine': (props) => <Wrench {...props} className="text-purple-400" />,
    'Leseni B1': (props) => <FileText {...props} className="text-blue-300" />,
    'Leseni B2': (props) => <FileText {...props} className="text-blue-300" />,
    'Leseni B3': (props) => <FileText {...props} className="text-blue-300" />,
    'Leseni B4': (props) => <FileText {...props} className="text-blue-300" />,
    'Leseni B5': (props) => <FileText {...props} className="text-blue-300" />,
    'Leseni B6': (props) => <FileText {...props} className="text-blue-300" />,
    'Leseni B7': (props) => <FileText {...props} className="text-blue-300" />,
    'Karatasi': (props) => <ScrollText {...props} className="text-white" />,
    'Cheti cha Madini': (props) => <FileText {...props} className="text-yellow-500" />,
    
    // Default
    'Default': (props) => <Package {...props} className="text-gray-400" />
};

const getIcon = (name: string): React.ReactElement => {
    const IconComponent = itemIcons[name] || itemIcons['Default'];
    return <IconComponent />;
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

    if (stillToCalculate.length > 0 && stillToCalculate.length === itemsToCalculate.length) {
        // No progress made, indicates a circular dependency or missing base price
        console.error("Could not calculate prices for:", stillToCalculate);
        // For items that couldn't be calculated, set their price to 0 to avoid breaking the loop
        stillToCalculate.forEach(item => {
            calculatedPrices[item] = 0;
            priceCalculationCompleted.add(item);
        });
        itemsToCalculate = []; // exit loop
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

    