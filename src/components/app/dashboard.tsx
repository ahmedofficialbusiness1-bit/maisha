'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Factory, Leaf, PlusCircle, Settings, Clock, CheckCircle, Gem, Hammer, Mountain, Droplets, Zap, ToyBrick } from 'lucide-react';
import type { Recipe } from '@/lib/recipe-data';
import { Separator } from '../ui/separator';
import { recipes } from '@/lib/recipe-data';
import type { InventoryItem } from './inventory';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { buildingData, BuildingConfig } from '@/lib/building-data';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export type BuildingType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  imageHint: string;
};

export type ProductionInfo = {
    recipeId: string;
    quantity: number;
    startTime: number;
    endTime: number;
};

export type BuildingSlot = {
    building: BuildingType | null;
    level: number;
    production?: ProductionInfo;
};

const availableBuildings: BuildingType[] = [
    {
        id: 'shamba',
        name: 'Shamba',
        icon: <Leaf className="mr-2" />,
        description: 'Huzalisha mazao ya kilimo na mifugo.',
        image: 'https://picsum.photos/seed/farm-land/200/200',
        imageHint: 'fertile farm'
    },
    {
        id: 'kiwanda_cha_samaki',
        name: 'Kiwanda cha Samaki',
        icon: <Droplets className="mr-2" />,
        description: 'Husindika samaki na bidhaa za baharini.',
        image: 'https://picsum.photos/seed/fish-factory/200/200',
        imageHint: 'fish factory'
    },
    {
        id: 'uchimbaji_mawe',
        name: 'Uchimbaji Mawe (Quarry)',
        icon: <Mountain className="mr-2" />,
        description: 'Huchimba mawe na kokoto.',
        image: 'https://picsum.photos/seed/quarry/200/200',
        imageHint: 'stone quarry'
    },
    {
        id: 'uchimbaji_mchanga',
        name: 'Uchimbaji Mchanga',
        icon: <Mountain className="mr-2" />,
        description: 'Huchimba mchanga.',
        image: 'https://picsum.photos/seed/sand-pit/200/200',
        imageHint: 'sand pit'
    },
    {
        id: 'uchimbaji_chuma',
        name: 'Uchimbaji Chuma',
        icon: <Gem className="mr-2" />,
        description: 'Huchimba madini ya chuma.',
        image: 'https://picsum.photos/seed/iron-mine/200/200',
        imageHint: 'iron mine'
    },
    {
        id: 'kiwanda_cha_umeme',
        name: 'Kiwanda cha Umeme',
        icon: <Zap className="mr-2" />,
        description: 'Huzalisha umeme.',
        image: 'https://picsum.photos/seed/power-plant/200/200',
        imageHint: 'power plant'
    },
    {
        id: 'kiwanda_cha_maji',
        name: 'Kiwanda cha Maji',
        icon: <Droplets className="mr-2" />,
        description: 'Huzalisha maji safi.',
        image: 'https://picsum.photos/seed/water-plant/200/200',
        imageHint: 'water plant'
    },
    {
        id: 'kiwanda_cha_mbao',
        name: 'Kiwanda cha Mbao',
        icon: <Hammer className="mr-2" />,
        description: 'Husindika miti kuwa mbao.',
        image: 'https://picsum.photos/seed/lumber-mill/200/200',
        imageHint: 'lumber mill'
    },
    {
        id: 'kiwanda_cha_saruji',
        name: 'Kiwanda cha Saruji',
        icon: <Factory className="mr-2" />,
        description: 'Huzalisha saruji.',
        image: 'https://picsum.photos/seed/cement-factory/200/200',
        imageHint: 'cement factory'
    },
    {
        id: 'kiwanda_cha_matofali',
        name: 'Kiwanda cha Matofali',
        icon: <ToyBrick className="mr-2" />,
        description: 'Huzalisha matofali na zege.',
        image: 'https://picsum.photos/seed/brick-factory/200/200',
        imageHint: 'brick factory'
    },
     {
        id: 'kiwanda_cha_chuma',
        name: 'Kiwanda cha Chuma',
        icon: <Factory className="mr-2" />,
        description: 'Huzalisha nondo za chuma.',
        image: 'https://picsum.photos/seed/steel-mill/200/200',
        imageHint: 'steel mill'
    },
];

interface DashboardProps {
    buildingSlots: BuildingSlot[];
    inventory: InventoryItem[];
    onBuild: (slotIndex: number, building: BuildingType) => void;
    onStartProduction: (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => void;
}

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    if (parseInt(hours) > 0) {
        return `${hours}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
};

export function Dashboard({ buildingSlots, inventory, onBuild, onStartProduction }: DashboardProps) {
  const [isBuildDialogOpen, setIsBuildDialogOpen] = React.useState(false);
  const [isProductionDialogOpen, setIsProductionDialogOpen] = React.useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
  const [now, setNow] = React.useState(Date.now());
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);
  const [productionQuantity, setProductionQuantity] = React.useState(1);
  
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBuildDialog = (index: number) => {
    setSelectedSlotIndex(index);
    setIsBuildDialogOpen(true);
  };

  const handleSelectBuildingToBuild = (building: BuildingType) => {
    if (selectedSlotIndex !== null) {
      onBuild(selectedSlotIndex, building);
    }
    setIsBuildDialogOpen(false);
    setSelectedSlotIndex(null);
  };

  const handleOpenProductionDialog = (index: number) => {
    setSelectedSlotIndex(index);
    setSelectedRecipe(null);
    setProductionQuantity(1);
    setIsProductionDialogOpen(true);
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setProductionQuantity(1);
  }

  const handleConfirmProduction = () => {
      if(selectedSlotIndex !== null && selectedRecipe && productionQuantity > 0) {
          const slot = buildingSlots[selectedSlotIndex];
          const buildingInfo = buildingData[slot.building!.id];
          const baseTimePerUnit = (3600 * 1000) / buildingInfo.productionRate; // Time in ms for 1 unit at level 1
          // TODO: Adjust for level
          const totalDurationMs = baseTimePerUnit * productionQuantity;

          onStartProduction(selectedSlotIndex, selectedRecipe, productionQuantity, totalDurationMs);
          setIsProductionDialogOpen(false);
          setSelectedRecipe(null);
      }
  }

  const selectedSlot = selectedSlotIndex !== null ? buildingSlots[selectedSlotIndex] : null;
  const buildingRecipes = selectedSlot?.building
    ? recipes.filter((recipe) => recipe.buildingId === selectedSlot.building!.id)
    : [];

  const hasEnoughInputs = (recipe: Recipe, quantity: number) => {
    if (!recipe.inputs) return true;
    return recipe.inputs.every(input => {
        const inventoryItem = inventory.find(item => item.item === input.name);
        return inventoryItem && inventoryItem.quantity >= (input.quantity * quantity);
    });
  }

  const getBuildingProductionRate = (slot: BuildingSlot | null): number => {
    if (!slot || !slot.building) return 0;
    const buildingInfo = buildingData[slot.building.id];
    // Simple level logic for now, will be expanded with 1.4x factor later
    return buildingInfo.productionRate * slot.level; 
  }

  const calculateProductionTime = (quantity: number): number => {
      if (!selectedSlot) return 0;
      const ratePerHr = getBuildingProductionRate(selectedSlot);
      if (ratePerHr === 0) return Infinity;
      const hours = quantity / ratePerHr;
      return hours * 3600 * 1000; // time in ms
  }

  const currentProductionRecipe = selectedSlot?.production 
    ? recipes.find(r => r.id === selectedSlot.production!.recipeId) 
    : null;

  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My City</h1>
        <p className="text-muted-foreground">
          Build your empire from the ground up. Click a plot to construct or a building to produce.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {buildingSlots.map((slot, index) =>
          slot.building ? (
            <Card
              key={index}
              onClick={() => !slot.production && handleOpenProductionDialog(index)}
              className={cn(
                "flex flex-col items-center justify-center h-32 bg-gray-800/80 border-gray-700 overflow-hidden group relative",
                !slot.production ? "cursor-pointer" : "cursor-default"
              )}
            >
                <Image
                    src={slot.building.image}
                    alt={slot.building.name}
                    width={200}
                    height={200}
                    data-ai-hint={slot.building.imageHint}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors" />

                {slot.production ? (
                   <div className="absolute top-2 left-2 p-1 bg-yellow-500/80 rounded-full animate-pulse">
                      <Clock className="h-4 w-4 text-white" />
                   </div>
                ) : (
                   <div className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full">
                       <Settings className="h-4 w-4 text-white" />
                   </div>
                )}
                <div className="absolute bottom-0 p-2 text-center w-full bg-black/60">
                    <p className="text-xs font-bold truncate">{slot.building.name} (Lvl {slot.level})</p>
                    {slot.production && currentProductionRecipe ? (
                        <div className='text-xs font-mono text-yellow-300 flex items-center justify-center gap-2'>
                           <span>{formatTime(slot.production.endTime - now)}</span>
                           <span>| {currentProductionRecipe.output.name}</span>
                        </div>
                    ) : (
                        <p className='text-xs text-green-400 font-semibold'>Available</p>
                    )}
                </div>
            </Card>
          ) : (
            <Card
              key={index}
              onClick={() => handleOpenBuildDialog(index)}
              className="flex items-center justify-center h-32 bg-gray-800/60 border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/90 transition-all cursor-pointer"
            >
              <div className="text-center text-gray-500">
                <PlusCircle className="h-8 w-8 mx-auto" />
                <span className="text-xs font-semibold">Build</span>
              </div>
            </Card>
          )
        )}
      </div>

      {/* Build Dialog */}
      <Dialog open={isBuildDialogOpen} onOpenChange={setIsBuildDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Construct a Building</DialogTitle>
                <DialogDescription>
                  Select a building to construct on this plot. Each building has unique benefits.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 pt-4">
                {availableBuildings.map((b) => (
                    <Button
                        key={b.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white"
                        onClick={() => handleSelectBuildingToBuild(b)}
                    >
                        {b.icon}
                        <div className='text-left'>
                            <p className='font-semibold'>{b.name}</p>
                            <p className='text-xs text-gray-400'>{b.description}</p>
                        </div>
                    </Button>
                ))}
              </div>
            </DialogContent>
        </Dialog>

        {/* Production Dialog */}
        <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Production: {selectedSlot?.building?.name} (Lvl {selectedSlot?.level})</DialogTitle>
                    <DialogDescription>
                        Select a product, enter quantity, and start production.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {/* Recipe List */}
                  <div className="col-span-1 flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2">
                    {buildingRecipes.length > 0 ? (
                        buildingRecipes.map((recipe) => (
                            <Button
                                key={recipe.id}
                                variant="outline"
                                className={cn(
                                    "w-full justify-start h-auto py-2 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white",
                                    selectedRecipe?.id === recipe.id && "bg-blue-600 border-blue-400"
                                )}
                                onClick={() => handleSelectRecipe(recipe)}
                            >
                                {recipe.output.name}
                            </Button>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No recipes for this building.</p>
                    )}
                  </div>
                  {/* Production Details */}
                  <div className="col-span-2">
                    {selectedRecipe ? (
                        <div className='space-y-4 p-4 bg-gray-800/50 rounded-lg'>
                            <h3 className='text-xl font-bold'>{selectedRecipe.output.name}</h3>
                            
                            {/* Inputs */}
                            <div>
                                <h4 className='font-semibold mb-2'>Inputs Required</h4>
                                {selectedRecipe.inputs.length > 0 ? (
                                    <ul className='text-sm space-y-1 text-gray-300 list-disc list-inside'>
                                      {selectedRecipe.inputs.map(input => (
                                          <li key={input.name}>{input.quantity * productionQuantity}x {input.name}</li>
                                      ))}
                                    </ul>
                                ) : <p className='text-sm text-gray-400 italic'>No inputs required.</p>}
                            </div>

                            {/* Quantity */}
                            <div className='space-y-2'>
                               <Label htmlFor='quantity'>Production Quantity</Label>
                               <Input 
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={productionQuantity}
                                  onChange={(e) => setProductionQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                  className='bg-gray-700 border-gray-600'
                               />
                            </div>
                            
                            <Separator className='my-4 bg-gray-600'/>

                            {/* Summary & Action */}
                            <div className='space-y-3'>
                                <div className='flex justify-between items-center'>
                                  <span className='text-gray-400'>Total Cost:</span>
                                  <span className='font-bold'>${(selectedRecipe.cost * productionQuantity).toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                  <span className='text-gray-400'>Est. Time:</span>
                                  <span className='font-bold'>{formatTime(calculateProductionTime(productionQuantity))}</span>
                                </div>
                                <Button
                                  className='w-full bg-green-600 hover:bg-green-700'
                                  disabled={!hasEnoughInputs(selectedRecipe, productionQuantity)}
                                  onClick={handleConfirmProduction}
                                >
                                  <CheckCircle className='mr-2'/>
                                  Start Production
                                </Button>
                                {!hasEnoughInputs(selectedRecipe, productionQuantity) && <p className='text-xs text-center text-red-400'>Not enough resources in inventory.</p>}
                            </div>

                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                          <p>Select a recipe from the left to begin.</p>
                        </div>
                    )}
                  </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    