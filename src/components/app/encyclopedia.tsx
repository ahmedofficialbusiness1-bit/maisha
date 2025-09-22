

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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { encyclopediaData, type EncyclopediaEntry } from '@/lib/encyclopedia-data';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { productCategoryToShopMap } from './game';
import { availableBuildings } from './dashboard';

export function Encyclopedia() {
  const [selectedEntry, setSelectedEntry] = React.useState<EncyclopediaEntry | null>(encyclopediaData[0] || null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = encyclopediaData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectEntry = (entry: EncyclopediaEntry) => {
    setSelectedEntry(entry);
  };
  
  const relevantShopId = selectedEntry ? productCategoryToShopMap[selectedEntry.category] || 'duka_kuu' : null;
  const relevantShop = relevantShopId ? availableBuildings.find(b => b.id === relevantShopId) : null;

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kamusi ya Mchezo</h1>
        <p className="text-muted-foreground">
            Jifunze kuhusu bidhaa, majengo, na mengine.
        </p>
      </div>

      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Orodha ya Vipengele</CardTitle>
           <CardDescription className="text-gray-400">
             Tafuta na chagua kipengele ili kuona maelezo yake.
           </CardDescription>
        </CardHeader>
        <CardContent>
            <div className='relative mb-4'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input 
                    placeholder="Tafuta kipengele..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 pl-10"
                />
            </div>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pr-4">
              {filteredData.map((item) => (
                <Button 
                    key={item.id} 
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-auto bg-gray-900/50 hover:bg-gray-700/80 border-gray-700",
                      selectedEntry?.id === item.id && "bg-blue-600/80 border-blue-500"
                    )}
                    onClick={() => handleSelectEntry(item)}
                  >
                  {item.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {selectedEntry && (
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-lg border-2 border-gray-600 object-cover p-2 flex items-center justify-center">
                        {React.cloneElement(selectedEntry.icon, {className: "h-full w-full"})}
                    </div>
                    <div>
                        <CardTitle className="text-3xl">{selectedEntry.name}</CardTitle>
                        <CardDescription className="text-gray-400">{selectedEntry.category}</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                    <p className="text-gray-300">{selectedEntry.description}</p>
                    <Separator className="my-4 bg-white/20" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedEntry.properties.map(prop => (
                            <div key={prop.label} className="bg-gray-900/50 p-3 rounded-lg">
                                <p className="text-sm font-semibold text-gray-400">{prop.label}</p>
                                <p className="text-lg font-mono">{prop.value}</p>
                            </div>
                        ))}
                    </div>
                    
                    {selectedEntry.recipe && selectedEntry.recipe.inputs.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mt-4 mb-2">Recipe</h3>
                            <div className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-center gap-4 flex-wrap">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    {selectedEntry.recipe.inputs.map((input, index) => {
                                        const inputEntry = encyclopediaData.find(e => e.name === input.name);
                                        return (
                                        <React.Fragment key={input.name}>
                                            <div className="text-center">
                                                {inputEntry && React.cloneElement(inputEntry.icon, { className: "mx-auto rounded-md h-10 w-10" })}
                                                <p className="text-xs mt-1">{input.quantity}x {input.name}</p>
                                            </div>
                                            {index < selectedEntry.recipe!.inputs.length - 1 && <p className="text-xl font-bold">+</p>}
                                        </React.Fragment>
                                    )})}
                                </div>
                                <p className="text-2xl font-bold mx-2">→</p>
                                <div className="text-center">
                                    {React.cloneElement(selectedEntry.icon, { className: "mx-auto rounded-md h-12 w-12" })}
                                    <p className="text-xs mt-1">{selectedEntry.recipe.output?.quantity || 1}x {selectedEntry.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
        
        {relevantShop && (
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Duka Linalohusika</CardTitle>
                    <CardDescription>Bidhaa hii huuzwa kupitia duka hili.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-4 p-4 rounded-lg bg-gray-900/50'>
                         {React.createElement(relevantShop.icon, {className: "h-16 w-16 text-white"})}
                         <div>
                            <h3 className='text-xl font-bold text-white'>{relevantShop.name}</h3>
                            <p className='text-sm text-gray-400'>{relevantShop.description}</p>
                         </div>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
