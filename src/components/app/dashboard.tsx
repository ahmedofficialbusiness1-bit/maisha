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
import { Building, Factory, Home, Hospital, PlusCircle, Store } from 'lucide-react';

const BUILDING_SLOTS = 20;

type BuildingType = {
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  imageHint: string;
};

const availableBuildings: BuildingType[] = [
  { 
    name: 'Residential House', 
    icon: <Home className="mr-2" />, 
    description: 'Increases population capacity.',
    image: 'https://picsum.photos/seed/residence/200/200',
    imageHint: 'modern house'
  },
  { 
    name: 'Factory', 
    icon: <Factory className="mr-2" />, 
    description: 'Produces goods and materials.',
    image: 'https://picsum.photos/seed/industrial-factory/200/200',
    imageHint: 'industrial factory'
  },
  { 
    name: 'Market', 
    icon: <Store className="mr-2" />, 
    description: 'Generates revenue from sales.',
    image: 'https://picsum.photos/seed/local-market/200/200',
    imageHint: 'outdoor market'
  },
  { 
    name: 'Office Building', 
    icon: <Building className="mr-2" />, 
    description: 'Unlocks corporate actions.',
    image: 'https://picsum.photos/seed/corporate-office/200/200',
    imageHint: 'office building'
  },
  { 
    name: 'Hospital', 
    icon: <Hospital className="mr-2" />, 
    description: 'Improves city health.',
    image: 'https://picsum.photos/seed/modern-hospital/200/200',
    imageHint: 'modern hospital'
  },
];


export function Dashboard() {
  const [buildings, setBuildings] = React.useState<(BuildingType | null)[]>(
    Array(BUILDING_SLOTS).fill(null)
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<number | null>(null);

  const handleOpenDialog = (index: number) => {
    setSelectedSlot(index);
    setIsDialogOpen(true);
  };

  const handleSelectBuilding = (building: BuildingType) => {
    if (selectedSlot !== null) {
      const newBuildings = [...buildings];
      newBuildings[selectedSlot] = building;
      setBuildings(newBuildings);
    }
    setIsDialogOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My City</h1>
        <p className="text-muted-foreground">
          Build your empire from the ground up. Click a plot to construct a new building.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {buildings.map((building, index) =>
          building ? (
            <Card key={index} className="flex flex-col items-center justify-center h-32 bg-gray-800/80 border-gray-700 overflow-hidden">
                <Image 
                    src={building.image} 
                    alt={building.name} 
                    width={200} 
                    height={200}
                    data-ai-hint={building.imageHint}
                    className="w-full h-2/3 object-cover"
                />
                <div className="p-2 text-center w-full bg-black/50">
                    <p className="text-xs font-bold truncate">{building.name}</p>
                </div>
            </Card>
          ) : (
            <Card
              key={index}
              onClick={() => handleOpenDialog(index)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        key={b.name} 
                        variant="outline" 
                        className="w-full justify-start h-auto py-3 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white"
                        onClick={() => handleSelectBuilding(b)}
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
    </div>
  );
}
