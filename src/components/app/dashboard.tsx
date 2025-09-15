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
import { Factory, Leaf, PlusCircle, ArrowRight, Settings } from 'lucide-react';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { productionLines, type ProductionLine } from '@/lib/production-data';
import { Separator } from '../ui/separator';

const BUILDING_SLOTS = 20;

export type BuildingType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  imageHint: string;
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
    buildings: (BuildingType | null)[];
    setBuildings: React.Dispatch<React.SetStateAction<(BuildingType | null)[]>>;
}

export function Dashboard({ buildings, setBuildings }: DashboardProps) {
  const [isBuildDialogOpen, setIsBuildDialogOpen] = React.useState(false);
  const [isProductionDialogOpen, setIsProductionDialogOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<number | null>(null);
  const [selectedBuilding, setSelectedBuilding] = React.useState<BuildingType | null>(null);

  const handleOpenBuildDialog = (index: number) => {
    setSelectedSlot(index);
    setIsBuildDialogOpen(true);
  };

  const handleSelectBuildingToBuild = (building: BuildingType) => {
    if (selectedSlot !== null) {
      const newBuildings = [...buildings];
      newBuildings[selectedSlot] = building;
      setBuildings(newBuildings);
    }
    setIsBuildDialogOpen(false);
    setSelectedSlot(null);
  };

  const handleOpenProductionDialog = (building: BuildingType) => {
    setSelectedBuilding(building);
    setIsProductionDialogOpen(true);
  };

  const buildingProductionLines = selectedBuilding
    ? productionLines.filter((line) => line.buildingId === selectedBuilding.id)
    : [];

  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My City</h1>
        <p className="text-muted-foreground">
          Build your empire from the ground up. Click a plot to construct or a building to produce.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {buildings.map((building, index) =>
          building ? (
            <Card
              key={index}
              onClick={() => handleOpenProductionDialog(building)}
              className="flex flex-col items-center justify-center h-32 bg-gray-800/80 border-gray-700 overflow-hidden cursor-pointer group relative"
            >
                <Image
                    src={building.image}
                    alt={building.name}
                    width={200}
                    height={200}
                    data-ai-hint={building.imageHint}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors" />
                 <div className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full">
                    <Settings className="h-4 w-4 text-white" />
                </div>
                <div className="absolute bottom-0 p-2 text-center w-full bg-black/60">
                    <p className="text-xs font-bold truncate">{building.name}</p>
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
                    <DialogTitle>Production: {selectedBuilding?.name}</DialogTitle>
                    <DialogDescription>
                        Select a product to start production. Ensure you have the required inputs in your inventory.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 pt-4 max-h-[60vh] overflow-y-auto pr-2">
                    {buildingProductionLines.length > 0 ? (
                        buildingProductionLines.map((line) => (
                            <div key={line.output.name} className="p-3 bg-gray-800/70 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-center">
                                    <div className='flex flex-col'>
                                       <p className='text-lg font-bold'>{line.output.name}</p>
                                       <div className="flex items-center gap-2 text-xs text-gray-400">
                                            {line.inputs.length > 0 ? (
                                                line.inputs.map(input => (
                                                    <span key={input.name}>{input.quantity}x {input.name}</span>
                                                )).reduce((prev, curr, i) => [prev, <span key={`sep-${i}`}>+</span>, curr] as any)
                                            ) : (
                                                <span className='italic'>Hakuna pembejeo zinazohitajika</span>
                                            )}
                                        </div>
                                    </div>
                                    <Button 
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => setIsProductionDialogOpen(false)} // Placeholder action
                                    >
                                        Start Production
                                    </Button>
                                </div>
                                <Separator className='my-2 bg-gray-600/50' />
                                <div className="text-xs text-muted-foreground flex justify-between">
                                    <span>Time: {line.duration}</span>
                                    <span>Cost: ${line.cost.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
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
