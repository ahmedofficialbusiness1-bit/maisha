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
import { Button } from '../ui/button';


const allProductionLines = [
  // Shamba Productions
  { id: 'prod-maharage', buildingId: 'shamba', name: 'Maharage', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/beans/600/400', imageHint: 'beans field' },
  { id: 'prod-mchele', buildingId: 'shamba', name: 'Mchele', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/rice/600/400', imageHint: 'rice paddy' },
  { id: 'prod-ngano', buildingId: 'shamba', name: 'Unga wa Ngano', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/wheat/600/400', imageHint: 'wheat field' },
  { id: 'prod-sembe', buildingId: 'shamba', name: 'Unga wa Sembe', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/maize-flour/600/400', imageHint: 'maize field' },
  { id: 'prod-ndizi', buildingId: 'shamba', name: 'Ndizi', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/banana/600/400', imageHint: 'banana plantation' },
  { id: 'prod-viazi', buildingId: 'shamba', name: 'Viazi Mbatata', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/potato/600/400', imageHint: 'potato harvest' },
  { id: 'prod-mboga', buildingId: 'shamba', name: 'Mboga Mboga', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/vegetables/600/400', imageHint: 'vegetable patch' },
  { id: 'prod-embe', buildingId: 'shamba', name: 'Embe', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/mango/600/400', imageHint: 'mango tree' },
  { id: 'prod-nanasi', buildingId: 'shamba', name: 'Nanasi', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/pineapple/600/400', imageHint: 'pineapple farm' },
  { id: 'prod-parachichi', buildingId: 'shamba', name: 'Parachichi', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/avocado/600/400', imageHint: 'avocado orchard' },
  { id: 'prod-miwa', buildingId: 'shamba', name: 'Miwa', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/sugarcane/600/400', imageHint: 'sugarcane field' },
  { id: 'prod-sukari', buildingId: 'shamba', name: 'Sukari', inputs: 'Miwa', imageUrl: 'https://picsum.photos/seed/sugar/600/400', imageHint: 'sugar processing' },
  { id: 'prod-nyama', buildingId: 'shamba', name: 'Nyama', inputs: 'Ngombe (Nyasi + Mbolea)', imageUrl: 'https://picsum.photos/seed/meat/600/400', imageHint: 'cattle ranch' },
  { id: 'prod-nyasi', buildingId: 'shamba', name: 'Nyasi', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/grass/600/400', imageHint: 'grass field' },
  { id: 'prod-mbolea', buildingId: 'shamba', name: 'Mbolea', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/fertilizer/600/400', imageHint: 'compost pile' },
  { id: 'prod-kuku', buildingId: 'shamba', name: 'Kuku', inputs: 'Yai + Mbolea', imageUrl: 'https://picsum.photos/seed/chicken/600/400', imageHint: 'poultry farm' },
  { id: 'prod-yai', buildingId: 'shamba', name: 'Yai', inputs: 'Mbolea + Maji', imageUrl: 'https://picsum.photos/seed/egg/600/400', imageHint: 'chicken eggs' },
  { id: 'prod-zabibu', buildingId: 'shamba', name: 'Zabibu', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/grapes/600/400', imageHint: 'vineyard' },
  { id: 'prod-apple', buildingId: 'shamba', name: 'Apple', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/apple-orchard/600/400', imageHint: 'apple orchard' },
  { id: 'prod-chungwa', buildingId: 'shamba', name: 'Chungwa', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/orange-grove/600/400', imageHint: 'orange grove' },
  { id: 'prod-korosho', buildingId: 'shamba', name: 'Korosho', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/cashew/600/400', imageHint: 'cashew tree' },
  { id: 'prod-karafuu', buildingId: 'shamba', name: 'Karafuu', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/cloves/600/400', imageHint: 'clove tree' },
  { id: 'prod-pamba', buildingId: 'shamba', name: 'Pamba', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/cotton/600/400', imageHint: 'cotton field' },
  { id: 'prod-katani', buildingId: 'shamba', name: 'Katani', inputs: 'Maji + Mbegu', imageUrl: 'https://picsum.photos/seed/sisal/600/400', imageHint: 'sisal plantation' },
  
  // Kiwanda cha Samaki Productions
  { id: 'prod-samaki', buildingId: 'kiwanda_cha_samaki', name: 'Samaki', inputs: 'Bwawa + Boat', imageUrl: 'https://picsum.photos/seed/fishing/600/400', imageHint: 'fishing trawler' },
  { id: 'prod-juice', buildingId: 'kiwanda_cha_samaki', name: 'Juice', inputs: 'Maembe + Nanasi + Parachichi + Sukari', imageUrl: 'https://picsum.photos/seed/juice-factory/600/400', imageHint: 'juice production' },
  { id: 'prod-chumvi', buildingId: 'kiwanda_cha_samaki', name: 'Chumvi', inputs: 'Bwawa', imageUrl: 'https://picsum.photos/seed/salt-pans/600/400', imageHint: 'salt evaporation' },
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {activeProductionLines.map((line) => (
                    <Card key={line.id} className="overflow-hidden bg-gray-800/60 border-gray-700 text-white flex flex-col">
                        <CardHeader className="p-0">
                        <Image
                            src={line.imageUrl}
                            alt={line.name}
                            width={600}
                            height={400}
                            className="w-full h-40 object-cover"
                            data-ai-hint={line.imageHint}
                        />
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col flex-grow">
                            <CardTitle className="capitalize mb-2 text-lg">{line.name}</CardTitle>
                            <CardDescription className="text-gray-400 text-xs">
                                Inahitaji: {line.inputs}
                            </CardDescription>
                             <div className="flex-grow"></div>
                            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Anza Uzalishaji</Button>
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
