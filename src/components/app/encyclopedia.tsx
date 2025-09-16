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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { encyclopediaData, type EncyclopediaEntry } from '@/lib/encyclopedia-data.tsx';
import { ScrollArea } from '../ui/scroll-area';

export function Encyclopedia() {
  const [selectedEntry, setSelectedEntry] = React.useState<EncyclopediaEntry | null>(encyclopediaData[0] || null);

  const handleSelectChange = (id: string) => {
    const entry = encyclopediaData.find((item) => item.id === id) || null;
    setSelectedEntry(entry);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
      {/* Left Panel: Navigation */}
      <div className="md:col-span-1">
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle>Kamusi ya Mchezo</CardTitle>
            <CardDescription className="text-gray-400">
              Jifunze kuhusu bidhaa, majengo, na mengine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleSelectChange} defaultValue={selectedEntry?.id}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Chagua Kipengele" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <ScrollArea className="h-72">
                    {encyclopediaData.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                        {item.name}
                    </SelectItem>
                    ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Content Display */}
      <div className="md:col-span-2">
        <Card className="bg-gray-800/60 border-gray-700 min-h-[400px]">
          {selectedEntry ? (
            <ScrollArea className="h-[60vh]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedEntry.imageUrl}
                    alt={selectedEntry.name}
                    width={80}
                    height={80}
                    className="rounded-lg border-2 border-gray-600 object-cover"
                    data-ai-hint={selectedEntry.imageHint}
                  />
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
                                {selectedEntry.recipe.inputs.map((input, index) => (
                                    <React.Fragment key={input.name}>
                                        <div className="text-center">
                                            <Image src={input.imageUrl} alt={input.name} width={40} height={40} className="mx-auto rounded-md" />
                                            <p className="text-xs mt-1">{input.quantity}x {input.name}</p>
                                        </div>
                                        {index < selectedEntry.recipe!.inputs.length - 1 && <p className="text-xl font-bold">+</p>}
                                    </React.Fragment>
                                ))}
                            </div>
                            <p className="text-2xl font-bold mx-2">→</p>
                            <div className="text-center">
                                <Image src={selectedEntry.imageUrl} alt={selectedEntry.name} width={48} height={48} className="mx-auto rounded-md" />
                                <p className="text-xs mt-1">{selectedEntry.properties.find(p => p.label === "Output Quantity")?.value.split(' ')[0] || 1}x {selectedEntry.name}</p>
                            </div>
                        </div>
                    </div>
                )}
              </CardContent>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <p className="text-muted-foreground">Chagua kipengele ili kuona maelezo.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
