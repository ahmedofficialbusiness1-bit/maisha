'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard } from '@/components/app/dashboard';
import { Inventory } from '@/components/app/inventory';
import { CommoditySimulator } from '@/components/app/commodity-simulator';
import { TradeMarket } from '@/components/app/trade-market';
import { Production } from '@/components/app/production';

export type View = 'dashboard' | 'inventory' | 'market' | 'simulator' | 'production';

export default function Home() {
  const [view, setView] = React.useState<View>('dashboard');

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && <Dashboard />}
        {view === 'inventory' && <Inventory />}
        {view === 'market' && <TradeMarket />}
        {view === 'simulator' && <CommoditySimulator />}
        {view === 'production' && <Production />}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </>
  );
}
