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
import { Factory, Leaf, PlusCircle, Settings, Clock, CheckCircle } from 'lucide-react';
import type { ProductionLine } from '@/lib/production-data';
import { Separator } from '../ui/separator';
import { productionLines } from '@/lib/production-data';
import type { InventoryItem } from './inventory';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

export type BuildingType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  imageHint: string;
};

export type BuildingSlot = {
    building: BuildingType | null;
    production?: {
      line: ProductionLine;
      startTime: number;
      endTime: number;
    };
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
        icon: <Factory className="mr-2" />,
        description: 'Husindika samaki na bidhaa za baharini.',
        image: 'https://picsum.photos/seed/fish-factory/200/200',
        imageHint: 'fish factory'
    },
];

interface DashboardProps {
    buildingSlots: BuildingSlot[];
    inventory: InventoryItem[];
    onBuild: (slotIndex: number, building: BuildingType) => void;
    onStartProduction: (slotIndex: number, line: ProductionLine) => void;
}

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export function Dashboard({ buildingSlots, inventory, onBuild, onStartProduction }: DashboardProps) {
  const [isBuildDialogOpen, setIsBuildDialogOpen] = React.useState(false);
  const [isProductionDialogOpen, setIsProductionDialogOpen] = React.useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
  const [now, setNow] = React.useState(Date.now());

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
    setIsProductionDialogOpen(true);
  };
  
  const handleSelectProductionLine = (line: ProductionLine) => {
      if(selectedSlotIndex !== null) {
          onStartProduction(selectedSlotIndex, line);
      }
      setIsProductionDialogOpen(false);
  }

  const selectedSlot = selectedSlotIndex !== null ? buildingSlots[selectedSlotIndex] : null;
  const buildingProductionLines = selectedSlot?.building
    ? productionLines.filter((line) => line.buildingId === selectedSlot.building!.id)
    : [];

  const hasEnoughInputs = (line: ProductionLine) => {
    return line.inputs.every(input => {
        const inventoryItem = inventory.find(item => item.item === input.name);
        return inventoryItem && inventoryItem.quantity >= input.quantity;
    });
  }


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
                    <p className="text-xs font-bold truncate">{slot.building.name}</p>
                    {slot.production ? (
                        <div className='text-xs font-mono text-yellow-300 flex items-center justify-center gap-2'>
                           <span>{formatTime(slot.production.endTime - now)}</span>
                           <span>| {slot.production.line.output.name}</span>
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
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>Production: {selectedSlot?.building?.name}</DialogTitle>
                    <DialogDescription>
                        Select a product to start production. Ensure you have the required inputs in your inventory.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 pt-4 max-h-[60vh] overflow-y-auto pr-2">
                    {buildingProductionLines.length > 0 ? (
                        buildingProductionLines.map((line) => {
                            const canProduce = hasEnoughInputs(line);
                            return (
                                <div key={line.output.name} className="p-3 bg-gray-800/70 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div className='flex flex-col'>
                                           <div className='flex items-center gap-2'>
                                            <p className='text-lg font-bold'>{line.output.name}</p>
                                            <Badge variant="secondary">${line.cost.toLocaleString()}</Badge>
                                           </div>
                                           <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                                                {line.inputs.length > 0 ? (
                                                    line.inputs.map(input => (
                                                        <span key={input.name}>{input.quantity.toLocaleString()}x {input.name}</span>
                                                    )).reduce((prev, curr, i) => [prev, <span key={`sep-${i}`}>+</span>, curr] as any)
                                                ) : (
                                                    <span className='italic'>Hakuna pembejeo zinazohitajika</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button 
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleSelectProductionLine(line)}
                                            disabled={!!selectedSlot?.production || !canProduce}
                                        >
                                            <CheckCircle className='mr-2'/>
                                            Start
                                        </Button>
                                    </div>
                                    <Separator className='my-2 bg-gray-600/50' />
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                        <span>Time: {line.duration}</span>
                                        <span>Output: {line.output.quantity.toLocaleString()} units</span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No production lines available for this building.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
