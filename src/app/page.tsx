'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingType } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { CommoditySimulator } from '@/components/app/commodity-simulator';
import { TradeMarket, type PlayerListing } from '@/components/app/trade-market';
import { Production } from '@/components/app/production';
import { Encyclopedia } from '@/components/app/encyclopedia';


const initialInventoryItems: InventoryItem[] = [
  { item: 'Corn', quantity: 15000, marketPrice: 150 },
  { item: 'Sunflower Seeds', quantity: 8000, marketPrice: 320 },
  { item: 'Eggs', quantity: 25000, marketPrice: 210 },
  { item: 'Crude Oil', quantity: 1000, marketPrice: 700 },
  { item: 'Gold', quantity: 500, marketPrice: 1800 },
  { item: 'Corn Flour', quantity: 5000, marketPrice: 280 },
  { item: 'Cooking Oil', quantity: 3000, marketPrice: 550 },
  { item: 'Chicken Feed', quantity: 10000, marketPrice: 180 },
];

const initialPlayerListings: PlayerListing[] = [
    { id: 1, commodity: 'Corn', seller: 'Mkulima Hodari', quantity: 5000, price: 151.00 },
    { id: 2, commodity: 'Eggs', seller: 'Mfanyabiashara Mjanja', quantity: 10000, price: 209.50 },
    { id: 3, commodity: 'Cooking Oil', seller: 'Wazalishaji wa Pwani', quantity: 1500, price: 545.00 },
    { id: 4, commodity: 'Gold', seller: 'Mgodi wa Almasi', quantity: 100, price: 1800.00 },
    { id: 5, commodity: 'Chicken Feed', seller: 'Mkulima Hodari', quantity: 8000, price: 181.25 },
];

const BUILDING_SLOTS = 20;

export type View = 'dashboard' | 'inventory' | 'market' | 'simulator' | 'production' | 'encyclopedia';

export default function Home() {
  const [view, setView] = React.useState<View>('dashboard');
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventoryItems);
  const [marketListings, setMarketListings] = React.useState<PlayerListing[]>(initialPlayerListings);
  const [buildings, setBuildings] = React.useState<(BuildingType | null)[]>(
    Array(BUILDING_SLOTS).fill(null)
  );

  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
    // 1. Update inventory
    setInventory(prevInventory => 
      prevInventory.map(invItem => 
        invItem.item === item.item
          ? { ...invItem, quantity: invItem.quantity - quantity }
          : invItem
      )
    );

    // 2. Add to market listings
    setMarketListings(prevListings => {
      const newListing: PlayerListing = {
        id: prevListings.length + Date.now(), // simple unique id
        commodity: item.item,
        seller: 'Mchezaji', // current player
        quantity,
        price,
      };
      return [newListing, ...prevListings];
    });
  };


  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && <Dashboard buildings={buildings} setBuildings={setBuildings} />}
        {view === 'inventory' && <Inventory inventoryItems={inventory} onPostToMarket={handlePostToMarket} />}
        {view === 'market' && <TradeMarket playerListings={marketListings} />}
        {view === 'simulator' && <CommoditySimulator />}
        {view === 'production' && <Production buildings={buildings} />}
        {view === 'encyclopedia' && <Encyclopedia />}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
