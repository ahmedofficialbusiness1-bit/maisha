'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { type BuildingType } from './dashboard';
import { Warehouse } from 'lucide-react';


const allProductionLines = [
  {
    id: 'line-1',
    buildingId: 'maize_mill',
    name: 'Maize Mill',
    product: 'Corn Flour',
    status: 'Idle',
    output: 500,
    imageUrl: 'https://picsum.photos/seed/mill/600/400',
    imageHint: 'industrial mill',
  },
  {
    id: 'line-2',
    buildingId: 'oil_press', // Example ID for a building not yet in the list
    name: 'Oil Press',
    product: 'Cooking Oil',
    status: 'Idle',
    output: 0,
    imageUrl: 'https://picsum.photos/seed/oilpress/600/400',
    imageHint: 'oil press',
  },
  {
    id: 'line-3',
    buildingId: 'feed_mixer', // Example ID
    name: 'Feed Mixer',
    product: 'Chicken Feed',
    status: 'Idle',
    output: 0,
    imageUrl: 'https://picsum.photos/seed/mixer/600/400',
    imageHint: 'feed factory',
  },
];

interface ProductionProps {
    buildings: (BuildingType | null)[];
}


export function Production({ buildings }: ProductionProps) {

  const builtBuildingIds = new Set(buildings.filter(b => b).map(b => b!.id));
  const activeProductionLines = allProductionLines.filter(line => builtBuildingIds.has(line.buildingId));


  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Lines</h1>
        <p className="text-muted-foreground">
          Manage your factories and production facilities. Only facilities you have built will appear here.
        </p>
      </div>
      <Separator className="bg-white/20" />

        {activeProductionLines.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {activeProductionLines.map((line) => (
                <Card key={line.id} className="overflow-hidden bg-gray-800/60 border-gray-700 text-white">
                    <CardHeader className="p-0">
                    <Image
                        src={line.imageUrl}
                        alt={line.name}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                        data-ai-hint={line.imageHint}
                    />
                    </CardHeader>
                    <CardContent className="p-6">
                    <CardTitle className="capitalize mb-2">{line.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                        <p>Producing: {line.product}</p>
                        <p>Status: {line.status}</p>
                        <p>Current Output: {line.output} units/hr</p>
                    </CardDescription>
                    </CardContent>
                </Card>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-700 text-center">
                <Warehouse className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-xl font-semibold">No Production Lines Active</h3>
                <p className="mt-2 text-muted-foreground">
                    Go to the Dashboard to build a production facility.
                </p>
            </div>
        )}
    </div>
  );
}
