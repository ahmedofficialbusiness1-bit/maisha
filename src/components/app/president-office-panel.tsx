
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Banknote, Building2, Handshake, Landmark, LineChart, Package, Percent } from 'lucide-react';
import type { EconomyData, NationalOrder, TreasuryData } from '@/services/game-service';

interface PresidentOfficePanelProps {
    treasury: TreasuryData | null;
    economy: EconomyData | null;
    officialPrices: Record<string, number>;
    nationalOrders: Record<string, NationalOrder>;
}

const StatCard = ({ title, value, icon, description, formatAsCurrency = true }: { title: string, value: number | string, icon: React.ElementType, description: string, formatAsCurrency?: boolean }) => (
    <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {React.createElement(icon, { className: "h-5 w-5 text-gray-400" })}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {typeof value === 'number' && formatAsCurrency ? `$${value.toLocaleString()}` : value}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export function PresidentOfficePanel({ treasury, economy, officialPrices, nationalOrders }: PresidentOfficePanelProps) {
  
  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ofisi ya Rais</h1>
        <p className="text-muted-foreground">
          Simamia sera za kiuchumi na maendeleo ya taifa.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/80">
          <TabsTrigger value="overview"><LineChart className="mr-2 h-4 w-4" />Uchumi</TabsTrigger>
          <TabsTrigger value="fiscal"><Percent className="mr-2 h-4 w-4" />Kodi na Ruzuku</TabsTrigger>
          <TabsTrigger value="prices"><Banknote className="mr-2 h-4 w-4" />Bei Elekezi</TabsTrigger>
          <TabsTrigger value="orders"><Handshake className="mr-2 h-4 w-4" />Tenda za Taifa</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Mfuko wa Taifa" 
                    value={treasury?.balance || 0}
                    icon={Landmark}
                    description="Jumla ya fedha katika hazina ya taifa."
                />
                 <StatCard 
                    title="Kodi ya Soko" 
                    value={`${((economy?.taxRate || 0) * 100).toFixed(1)}%`}
                    icon={Percent}
                    description="Kiwango cha sasa cha kodi kwenye mauzo ya soko."
                    formatAsCurrency={false}
                />
                 <StatCard 
                    title="Tenda Zilizo Wazi" 
                    value={Object.values(nationalOrders || {}).filter(o => o.status === 'open').length}
                    icon={Handshake}
                    description="Idadi ya tenda za taifa zinazosubiri wazabuni."
                    formatAsCurrency={false}
                />
                <StatCard 
                    title="Sekta za Uchumi" 
                    value={7} // Hardcoded for now
                    icon={Building2}
                    description="Jumla ya sekta za kiuchumi nchini."
                    formatAsCurrency={false}
                />
            </div>
            <Card className="mt-4 bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Ripoti ya Uchumi</CardTitle>
                    <CardDescription>Inakuja hivi karibuni...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Sehemu hii itaonyesha grafu za ukuaji wa Pato la Taifa (GDP), mfumuko wa bei, na takwimu nyingine muhimu.</p>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Fiscal Tools Tab */}
        <TabsContent value="fiscal" className="mt-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Zana za Kodi na Ruzuku</CardTitle>
                    <CardDescription>Inakuja hivi karibuni...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Sehemu hii itamruhusu Rais kuweka kiwango cha kodi na kupendekeza ruzuku kwa sekta mbalimbali, ambazo zitaidhinishwa na Admin.</p>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Price Control Tab */}
        <TabsContent value="prices" className="mt-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Usimamizi wa Bei Elekezi</CardTitle>
                    <CardDescription>Inakuja hivi karibuni...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Sehemu hii itamruhusu Rais kupanga bei rasmi (elekezi) za bidhaa mbalimbali sokoni.</p>
                </CardContent>
            </Card>
        </TabsContent>

        {/* National Orders Tab */}
        <TabsContent value="orders" className="mt-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Usimamizi wa Tenda za Taifa</CardTitle>
                    <CardDescription>Inakuja hivi karibuni...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Sehemu hii itamruhusu Rais kupendekeza tenda za taifa kwa bidhaa maalum, ambazo zitaidhinishwa na Admin.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
