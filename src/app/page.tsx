'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { CommoditySimulator } from '@/components/app/commodity-simulator';
import { TradeMarket, type PlayerListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import type { ProductionLine } from '@/lib/production-data';
import { BuildingType } from '@/components/app/dashboard';
import { useToast } from '@/hooks/use-toast';
import { encyclopediaData } from '@/lib/encyclopedia-data';


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

const parseDuration = (duration: string): number => {
    const value = parseInt(duration.slice(0, -1));
    const unit = duration.slice(-1);
    switch (unit) {
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 's': return value * 1000;
        default: return 0;
    }
}

export type View = 'dashboard' | 'inventory' | 'market' | 'simulator' | 'encyclopedia';

export default function Home() {
  const [view, setView] = React.useState<View>('dashboard');
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventoryItems);
  const [marketListings, setMarketListings] = React.useState<PlayerListing[]>(initialPlayerListings);
  const [buildingSlots, setBuildingSlots] = React.useState<BuildingSlot[]>(
    Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null }))
  );
  const { toast } = useToast();

  const handleBuild = (slotIndex: number, building: BuildingType) => {
    setBuildingSlots(prev => {
        const newSlots = [...prev];
        newSlots[slotIndex] = { building };
        return newSlots;
    });
  };
  
  const handleStartProduction = (slotIndex: number, line: ProductionLine) => {
    // Check for required inputs
    for (const input of line.inputs) {
        const inventoryItem = inventory.find(i => i.item === input.name);
        if (!inventoryItem || inventoryItem.quantity < input.quantity) {
            toast({
                variant: "destructive",
                title: "Uhaba wa Rasilimali",
                description: `Huna ${input.name} za kutosha kuanzisha uzalishaji.`,
            });
            return;
        }
    }

    const durationMs = parseDuration(line.duration);
    const now = Date.now();
    
    // Deduct inputs from inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      for (const input of line.inputs) {
        const itemIndex = newInventory.findIndex(i => i.item === input.name);
        if (itemIndex > -1) {
          newInventory[itemIndex].quantity -= input.quantity;
        }
      }
      return newInventory.filter(item => item.quantity > 0);
    });

    // TODO: Deduct cost from player's money

    setBuildingSlots(prev => {
      const newSlots = [...prev];
      const slot = newSlots[slotIndex];
      if(slot && slot.building && !slot.production) {
        newSlots[slotIndex] = {
          ...slot,
          production: {
            line,
            startTime: now,
            endTime: now + durationMs,
          }
        };
      }
      return newSlots;
    });
  };

  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
    // 1. Update inventory
    setInventory(prevInventory =>
      prevInventory.map(invItem =>
        invItem.item === item.item
          ? { ...invItem, quantity: invItem.quantity - quantity }
          : invItem
      ).filter(item => item.quantity > 0)
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
  
   React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let inventoryUpdated = false;

      setBuildingSlots(prevSlots => {
        let slotsChanged = false;
        const newSlots = prevSlots.map(slot => {
          if (slot.production && now >= slot.production.endTime) {
            slotsChanged = true;
            inventoryUpdated = true;
            
            const { output } = slot.production.line;
            
            setInventory(prevInventory => {
              const newInventory = [...prevInventory];
              const itemIndex = newInventory.findIndex(i => i.item === output.name);
              
              if (itemIndex > -1) {
                newInventory[itemIndex].quantity += output.quantity;
              } else {
                 const encyclopediaEntry = encyclopediaData.find(e => e.name === output.name);
                 const marketPrice = encyclopediaEntry 
                    ? parseFloat(encyclopediaEntry.properties.find(p => p.label.includes("Price"))?.value.replace('$', '') || '100')
                    : 100;

                newInventory.push({ item: output.name, quantity: output.quantity, marketPrice });
              }
              return newInventory;
            });
            
            return { ...slot, production: undefined };
          }
          return slot;
        });

        return slotsChanged ? newSlots : prevSlots;
      });

      if(inventoryUpdated){
        toast({
            title: "Uzalishaji Umekamilika!",
            description: "Bidhaa mpya zimeongezwa kwenye ghala lako.",
        })
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && (
          <Dashboard 
            buildingSlots={buildingSlots} 
            inventory={inventory}
            onBuild={handleBuild}
            onStartProduction={handleStartProduction}
          />
        )}
        {view === 'inventory' && <Inventory inventoryItems={inventory} onPostToMarket={handlePostToMarket} />}
        {view === 'market' && <TradeMarket playerListings={marketListings} />}
        {view === 'simulator' && <CommoditySimulator />}
        {view === 'encyclopedia' && <Encyclopedia />}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
