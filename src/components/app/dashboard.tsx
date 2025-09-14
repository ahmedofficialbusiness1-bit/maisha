'use client';

import * as React from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building, Factory, Home, PlusCircle, Store } from 'lucide-react';

const BUILDING_SLOTS = 20;

const availableBuildings = [
  { name: 'Residential House', icon: <Home className="mr-2" />, description: 'Increases population capacity.' },
  { name: 'Factory', icon: <Factory className="mr-2" />, description: 'Produces goods and materials.' },
  { name: 'Market', icon: <Store className="mr-2" />, description: 'Generates revenue from sales.' },
  { name: 'Office Building', icon: <Building className="mr-2" />, description: 'Unlocks corporate actions.' },
];

export function Dashboard() {
  // TODO: In the future, this state will hold the building placed in each slot.
  const [buildings, setBuildings] = React.useState<(string | null)[]>(
    Array(BUILDING_SLOTS).fill(null)
  );

  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My City</h1>
        <p className="text-muted-foreground">
          Build your empire from the ground up. Click a plot to construct a new building.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {buildings.map((building, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="flex items-center justify-center h-32 bg-gray-800/60 border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/90 transition-all cursor-pointer">
                <div className="text-center text-gray-500">
                  <PlusCircle className="h-8 w-8 mx-auto" />
                  <span className="text-xs font-semibold">Build</span>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Construct a Building</DialogTitle>
                <DialogDescription>
                  Select a building to construct on this plot.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 pt-4">
                {availableBuildings.map((b) => (
                    <Button key={b.name} variant="outline" className="w-full justify-start h-auto py-3 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white">
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
        ))}
      </div>
    </div>
  );
}
