
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Worker } from '@/lib/worker-data';

interface HumanResourcesProps {
  availableWorkers: Worker[];
  hiredWorkers: Worker[];
  money: number;
  onHireWorker: (workerId: string) => void;
  onFireWorker: (workerId: string) => void;
}

export function HumanResources({
  availableWorkers,
  hiredWorkers,
  money,
  onHireWorker,
  onFireWorker,
}: HumanResourcesProps) {

  const renderWorkerCard = (worker: Worker, isHired: boolean) => (
    <Card key={worker.id} className="bg-gray-800/80 border-gray-700">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-700 rounded-md">{React.cloneElement(worker.icon, { className: "h-6 w-6"})}</div>
          <div>
            <CardTitle className="text-lg">{worker.name}</CardTitle>
            <CardDescription className="text-sm text-yellow-400">{worker.specialty}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <p className="text-xs text-gray-400 h-10">{worker.description}</p>
        <Separator className="bg-gray-600"/>
        <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Mshahara:</span>
            <span className="font-mono text-orange-400">${worker.salary.toLocaleString()}/dak.</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Athari:</span>
            <span className="font-mono text-green-400">
                {worker.effect.value}% {worker.effect.type === 'PRODUCTION_BOOST' ? 'Kasi' : 'Punguzo'}
            </span>
        </div>
        {isHired ? (
             <Button className="w-full mt-2" variant="destructive" onClick={() => onFireWorker(worker.id)}>
                Fukuza Kazi
             </Button>
        ) : (
            <Button className="w-full mt-2" variant="secondary" onClick={() => onHireWorker(worker.id)} disabled={money < worker.salary}>
                Ajiri
            </Button>
        )}
      </CardContent>
    </Card>
  );


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
        {/* Soko la Ajira */}
        <div>
            <h2 className="text-2xl font-bold mb-4">Soko la Ajira</h2>
            <Card className="bg-gray-800/60 border-gray-700">
                <ScrollArea className="h-[70vh]">
                    <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {availableWorkers.length > 0 ? (
                            availableWorkers.map(worker => renderWorkerCard(worker, false))
                        ) : (
                            <p className="text-center text-gray-500 col-span-2 py-10">
                                Hakuna wafanyakazi wapya sokoni kwa sasa.
                            </p>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>

        {/* Wafanyakazi Wako */}
        <div>
            <h2 className="text-2xl font-bold mb-4">Wafanyakazi Wako ({hiredWorkers.length})</h2>
            <Card className="bg-gray-800/60 border-gray-700">
                 <ScrollArea className="h-[70vh]">
                    <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                         {hiredWorkers.length > 0 ? (
                            hiredWorkers.map(worker => renderWorkerCard(worker, true))
                        ) : (
                            <p className="text-center text-gray-500 col-span-2 py-10">
                                Bado hujaajiri mfanyakazi yeyote.
                            </p>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
    </div>
  );
}
