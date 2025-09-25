
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Leaderboard() {
  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ubao wa Viongozi</h1>
        <p className="text-muted-foreground">
          Tazama orodha ya wachezaji matajiri zaidi kwenye mchezo.
        </p>
      </div>

      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Wachezaji Wanaoongoza kwa Utajiri</CardTitle>
          <CardDescription className="text-gray-400">
            Ubao wa viongozi haupatikani katika hali ya kucheza nje ya mtandao.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-500">
            <p>Unganisha na hifadhidata ya wingu ili kuona ubao wa viongozi.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
