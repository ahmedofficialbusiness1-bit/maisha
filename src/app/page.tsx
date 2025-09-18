
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot, type BuildingType } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import { HumanResources } from '@/components/app/human-resources';
import type { Recipe } from '@/lib/recipe-data';
import { recipes } from '@/lib/recipe-data';
import { useToast } from '@/hooks/use-toast';
import { encyclopediaData } from '@/lib/encyclopedia-data.tsx';
import { buildingData } from '@/lib/building-data';
import { workerData, type Worker } from '@/lib/worker-data.tsx';


const initialInventoryItems: InventoryItem[] = [
  { item: 'Maji', quantity: 15000, marketPrice: 0.02 },
  { item: 'Mbegu', quantity: 8000, marketPrice: 0.1 },
  { item: 'Yai', quantity: 25000, marketPrice: 1.25 },
  { item: 'Bwawa', quantity: 10, marketPrice: 125 },
  { item: 'Boat', quantity: 5, marketPrice: 250 },
  { item: 'Mbao', quantity: 500, marketPrice: 12.5 },
  { item: 'Matofali', quantity: 1000, marketPrice: 18.75 },
  { item: 'Nondo', quantity: 200, marketPrice: 312.5 },
  { item: 'Zege', quantity: 100, marketPrice: 37.5 },
  { item: 'Mashine A1', quantity: 10, marketPrice: 2500 },
  { item: 'Mashine A2', quantity: 10, marketPrice: 2750 },
  { item: 'Mashine A3', quantity: 10, marketPrice: 3000 },
  { item: 'Mashine A4', quantity: 10, marketPrice: 3250 },
  { item: 'Mashine A5', quantity: 10, marketPrice: 3500 },
  { item: 'Mashine B7', quantity: 10, marketPrice: 7750 },
  { item: 'Mashine C1', quantity: 10, marketPrice: 12500 },
  { item: 'Mashine C2', quantity: 10, marketPrice: 13750 },
  { item: 'Leseni B7', quantity: 10, marketPrice: 12500 },
  { item: 'Shaba', quantity: 100, marketPrice: 62.5 },
  { item: 'Miti', quantity: 1000, marketPrice: 6.25 },
  { item: 'Saruji', quantity: 1000, marketPrice: 6.25 },
  { item: 'Chuma', quantity: 200, marketPrice: 125 },
  { item: 'Kokoto', quantity: 1000, marketPrice: 2.5 },
  { item: 'Mawe', quantity: 1000, marketPrice: 1.25 },
  { item: 'Umeme', quantity: 10000, marketPrice: 0.03 },
  { item: 'Mchanga', quantity: 1000, marketPrice: 0.5 },
];

const initialPlayerListings: PlayerListing[] = [
    { id: 1, commodity: 'Maji', seller: 'Flexy suyo', quantity: 450, price: 0.02, avatar: 'https://picsum.photos/seed/flexy/40/40', quality: 1, imageHint: 'player avatar' },
    { id: 2, commodity: 'Yai', seller: 'MKG CIE', quantity: 100, price: 1.25, avatar: 'https://picsum.photos/seed/mkg/40/40', quality: 0, imageHint: 'company logo' },
    { id: 3, commodity: 'Maji', seller: 'Atul Company', quantity: 944, price: 0.02, avatar: 'https://picsum.photos/seed/atul/40/40', quality: 0, imageHint: 'company logo' },
    { id: 4, commodity: 'Yai', seller: 'Prometheucls co', quantity: 1969, price: 1.30, avatar: 'https://picsum.photos/seed/prom/40/40', quality: 1, imageHint: 'company logo' },
    { id: 5, commodity: 'Mbao', seller: 'laptop si gera', quantity: 421, price: 13.00, avatar: 'https://picsum.photos/seed/laptop/40/40', quality: 4, imageHint: 'player avatar' },
    { id: 6, commodity: 'Nondo', seller: 'Mustika70', quantity: 119, price: 320.00, avatar: 'https://picsum.photos/seed/mustika/40/40', quality: 4, imageHint: 'company logo' },
    { id: 7, commodity: 'Matofali', seller: 'Schreinerei', quantity: 440, price: 19.00, avatar: 'https://picsum.photos/seed/schrein/40/40', quality: 2, imageHint: 'company logo' },
];

const initialStockListings: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, sharesAvailable: 10000, marketCap: 4507500, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo' },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, sharesAvailable: 50000, marketCap: 6025000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
    { id: 'MADINI', ticker: 'MADINI', companyName: 'Madini Resources', stockPrice: 87.20, sharesAvailable: 25000, marketCap: 2180000, logo: 'https://picsum.photos/seed/madini/40/40', imageHint: 'mining company' },
    { id: 'TEKNOLO', ticker: 'TEKNOLO', companyName: 'Teknolojia Solutions', stockPrice: 320.00, sharesAvailable: 15000, marketCap: 4800000, logo: 'https://picsum.photos/seed/teknolo/40/40', imageHint: 'tech logo' },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
    { id: 3, issuer: 'Uchumi wa Afrika', faceValue: 5000, couponRate: 6.0, maturityDate: '2035-01-01', price: 4950, quantityAvailable: 100, creditRating: 'AA-', issuerLogo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo' },
];

const BUILDING_SLOTS = 20;

export type View = 'dashboard' | 'inventory' | 'market' | 'simulator' | 'encyclopedia' | 'hr';

export default function Home() {
  const [view, setView] = React.useState<View>('dashboard');
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventoryItems);
  const [marketListings, setMarketListings] = React.useState<PlayerListing[]>(initialPlayerListings);
  const [stockListings, setStockListings] = React.useState<StockListing[]>(initialStockListings);
  const [bondListings, setBondListings] = React.useState<BondListing[]>(initialBondListings);
  const [buildingSlots, setBuildingSlots] = React.useState<BuildingSlot[]>(
    Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 }))
  );
  const { toast } = useToast();
  const [money, setMoney] = React.useState(1900000);
  const [stars, setStars] = React.useState(50); // Initial stars for testing
  
  const [availableWorkers, setAvailableWorkers] = React.useState<Worker[]>(workerData);
  const [hiredWorkers, setHiredWorkers] = React.useState<Worker[]>([]);

  const handleHireWorker = (workerId: string) => {
    const workerToHire = availableWorkers.find(w => w.id === workerId);
    if (!workerToHire || money < workerToHire.salary) {
      toast({
        variant: "destructive",
        title: "Haiwezekani Kuajiri",
        description: workerToHire ? "Huna pesa za kutosha kulipa mshahara wa awali." : "Mfanyakazi hapatikani.",
      });
      return;
    }
    setMoney(prev => prev - workerToHire.salary); // Initial salary payment
    setHiredWorkers(prev => [...prev, workerToHire]);
    setAvailableWorkers(prev => prev.filter(w => w.id !== workerId));
    toast({
      title: "Umeajiri Mfanyakazi Mpya!",
      description: `${workerToHire.name} amejiunga na timu yako.`,
    });
  };

  const handleFireWorker = (workerId: string) => {
    const workerToFire = hiredWorkers.find(w => w.id === workerId);
    if (!workerToFire) return;

    setHiredWorkers(prev => prev.filter(w => w.id !== workerId));
    setAvailableWorkers(prev => [...prev, workerToFire]);
    toast({
      variant: 'destructive',
      title: "Mfanyakazi Amefukuzwa",
      description: `${workerToFire.name} hayupo tena kazini.`,
    });
  };


  const handleBuild = (slotIndex: number, building: BuildingType) => {
    const costs = buildingData[building.id].buildCost;
    
    // 1. Check for required build materials
    for (const cost of costs) {
        const inventoryItem = inventory.find(i => i.item === cost.name);
        if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
            toast({
                variant: "destructive",
                title: "Uhaba wa Vifaa vya Ujenzi",
                description: `Huna ${cost.name} za kutosha kujenga ${building.name}.`,
            });
            return;
        }
    }

    // 2. Deduct build materials from inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      for (const cost of costs) {
        const itemIndex = newInventory.findIndex(i => i.item === cost.name);
        if (itemIndex > -1) {
          newInventory[itemIndex].quantity -= cost.quantity;
        }
      }
      return newInventory.filter(item => item.quantity > 0);
    });
    
    const now = Date.now();
    const constructionTimeMs = 15 * 60 * 1000; // 15 minutes

    // 3. Place building into construction state
    setBuildingSlots(prev => {
        const newSlots = [...prev];
        newSlots[slotIndex] = { 
            building, 
            level: 0, // It's at level 0 while constructing
            construction: {
                startTime: now,
                endTime: now + constructionTimeMs,
                targetLevel: 1
            }
        };
        return newSlots;
    });

    toast({
        title: "Ujenzi Umeanza!",
        description: `${building.name} itakuwa tayari baada ya dakika 15.`,
    });
  };
  
    const handleUpgradeBuilding = (slotIndex: number) => {
    const slot = buildingSlots[slotIndex];
    if (!slot || !slot.building) return;

    const costs = buildingData[slot.building.id].upgradeCost(slot.level + 1);

    // 1. Check for required upgrade materials
    for (const cost of costs) {
      const inventoryItem = inventory.find(i => i.item === cost.name);
      if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
        toast({
          variant: "destructive",
          title: "Uhaba wa Vifaa vya Uboreshaji",
          description: `Huna ${cost.name} za kutosha kuboresha ${slot.building.name}.`,
        });
        return;
      }
    }

    // 2. Deduct upgrade materials from inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      for (const cost of costs) {
        const itemIndex = newInventory.findIndex(i => i.item === cost.name);
        if (itemIndex > -1) {
          newInventory[itemIndex].quantity -= cost.quantity;
        }
      }
      return newInventory.filter(item => item.quantity > 0);
    });

    const now = Date.now();
    // Time doubles for each new level, based on the initial 15 minutes
    const constructionTimeMs = (15 * 60 * 1000) * Math.pow(2, slot.level);

    // 3. Place building into construction state for upgrade
    setBuildingSlots(prev => {
      const newSlots = [...prev];
      newSlots[slotIndex] = {
        ...slot,
        construction: {
          startTime: now,
          endTime: now + constructionTimeMs,
          targetLevel: slot.level + 1
        }
      };
      return newSlots;
    });

    toast({
      title: "Uboreshaji Umeanza!",
      description: `${slot.building.name} itakuwa Level ${slot.level + 1} baada ya muda.`,
    });
  };

  const handleDemolishBuilding = (slotIndex: number) => {
    const buildingName = buildingSlots[slotIndex]?.building?.name || 'Jengo';
    setBuildingSlots(prev => {
        const newSlots = [...prev];
        newSlots[slotIndex] = { building: null, level: 0 };
        return newSlots;
    });
    toast({
        title: "Jengo Limefutwa",
        description: `${buildingName} limeondolewa kwenye kiwanja.`,
    })
  };


  const handleStartProduction = (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => {
    const inputs = recipe.inputs || [];
    // 1. Check for required inputs
    for (const input of inputs) {
        const inventoryItem = inventory.find(i => i.item === input.name);
        if (!inventoryItem || inventoryItem.quantity < (input.quantity * quantity)) {
            toast({
                variant: "destructive",
                title: "Uhaba wa Rasilimali",
                description: `Huna ${input.name} za kutosha kuanzisha uzalishaji.`,
            });
            return;
        }
    }
    
    // Check for money
    const totalCost = recipe.cost * quantity;
    if (money < totalCost) {
        toast({
            variant: "destructive",
            title: "Pesa haitoshi",
            description: `Huna pesa za kutosha kuanzisha uzalishaji. Unahitaji $${totalCost.toLocaleString()}.`,
        });
        return;
    }

    // Check for required workers
    for (const req of recipe.requiredWorkers) {
        const availableSpecialists = hiredWorkers.filter(w => w.specialty === req.specialty).length;
        if (availableSpecialists < req.count) {
            toast({
                variant: "destructive",
                title: "Uhaba wa Wafanyakazi",
                description: `Unahitaji ${req.count} ${req.specialty} lakini una ${availableSpecialists} pekee.`,
            });
            return;
        }
    }

    const now = Date.now();
    
    // 2. Deduct inputs from inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      for (const input of inputs) {
        const itemIndex = newInventory.findIndex(i => i.item === input.name);
        if (itemIndex > -1) {
          newInventory[itemIndex].quantity -= (input.quantity * quantity);
        }
      }
      return newInventory.filter(item => item.quantity > 0);
    });

    // 3. Deduct cost from player's money
    setMoney(prevMoney => prevMoney - totalCost);

    // 4. Set production state on building
    setBuildingSlots(prev => {
      const newSlots = [...prev];
      const slot = newSlots[slotIndex];
      if(slot && slot.building && !slot.production) {
        newSlots[slotIndex] = {
          ...slot,
          production: {
            recipeId: recipe.id,
            quantity: quantity,
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
        avatar: 'https://picsum.photos/seed/mchezaji/40/40',
        quality: 5,
        imageHint: 'player avatar'
      };
      return [newListing, ...prevListings];
    });
  };
  
  const handleBoostConstruction = (slotIndex: number, starsToUse: number) => {
      const timeReductionPerStar = 3 * 60 * 1000; // 3 minutes per star
      const timeReduction = starsToUse * timeReductionPerStar;

      if (stars < starsToUse) {
          toast({
              variant: "destructive",
              title: "Star Boost Hazitoshi",
              description: `Huna Star Boosts za kutosha. Unahitaji ${starsToUse}.`,
          });
          return;
      }
      
      setStars(prev => prev - starsToUse);
      setBuildingSlots(prev => {
          const newSlots = [...prev];
          const slot = newSlots[slotIndex];
          if (slot?.construction) {
              slot.construction.endTime -= timeReduction;
          }
          return newSlots;
      });

      const hours = Math.floor(timeReduction / (60 * 60 * 1000));
      const minutes = Math.floor((timeReduction % (60 * 60 * 1000)) / (60 * 1000));
      let reductionText = "";
      if(hours > 0) reductionText += `${hours} saa `;
      if(minutes > 0) reductionText += `${minutes} dakika`;

      toast({
          title: "Umeharakisha Ujenzi!",
          description: `Umetumia ${starsToUse} Star Boosts kupunguza muda wa ujenzi kwa ${reductionText.trim()}.`,
      });
  };

  const handleBuyMaterial = (materialName: string, quantityNeeded: number) => {
    const entry = encyclopediaData.find(e => e.name === materialName);
    const priceProp = entry?.properties.find(p => p.label === "Market Cost");
    if (!priceProp) {
        toast({ variant: "destructive", title: "Hitilafu", description: `Bei ya ${materialName} haipatikani.`});
        return;
    }

    const pricePerUnit = parseFloat(priceProp.value.replace('$', ''));
    const totalCost = pricePerUnit * quantityNeeded;

    if (money < totalCost) {
        toast({ variant: "destructive", title: "Pesa Haitoshi", description: `Unahitaji $${totalCost.toLocaleString()} kununua ${quantityNeeded.toLocaleString()}x ${materialName}.`});
        return;
    }

    setMoney(prevMoney => prevMoney - totalCost);
    setInventory(prevInventory => {
        const newInventory = [...prevInventory];
        const itemIndex = newInventory.findIndex(i => i.item === materialName);

        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += quantityNeeded;
        } else {
            newInventory.push({ item: materialName, quantity: quantityNeeded, marketPrice: pricePerUnit });
        }
        return newInventory;
    });

    toast({
        title: "Manunuzi Yamekamilika",
        description: `Umenunua ${quantityNeeded.toLocaleString()}x ${materialName} kwa $${totalCost.toLocaleString()}.`
    });
  };
  
   React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let inventoryUpdated = false;
      let itemsProduced: string[] = [];
      let constructionCompleted: string[] = [];

      setBuildingSlots(prevSlots => {
        let slotsChanged = false;
        const newSlots = prevSlots.map(slot => {
          // Check for completed production
          if (slot && slot.production && now >= slot.production.endTime) {
            slotsChanged = true;
            inventoryUpdated = true;
            
            const recipe = recipes.find(r => r.id === slot.production!.recipeId);
            if (!recipe) return { ...slot, production: undefined };

            const { output } = recipe;
            itemsProduced.push(`${(output.quantity * slot.production!.quantity).toLocaleString()}x ${output.name}`);
            
            setInventory(prevInventory => {
              const newInventory = [...prevInventory];
              const itemIndex = newInventory.findIndex(i => i.item === output.name);
              
              if (itemIndex > -1) {
                newInventory[itemIndex].quantity += (output.quantity * slot.production!.quantity);
              } else {
                 const encyclopediaEntry = encyclopediaData.find(e => e.name === output.name);
                 const marketPrice = encyclopediaEntry 
                    ? parseFloat(encyclopediaEntry.properties.find(p => p.label.includes("Market Cost"))?.value.replace('$', '') || '100')
                    : 100;

                newInventory.push({ item: output.name, quantity: (output.quantity * slot.production!.quantity), marketPrice });
              }
              return newInventory;
            });
            
            return { ...slot, production: undefined };
          }
          
          // Check for completed construction
          if (slot && slot.construction && now >= slot.construction.endTime) {
            slotsChanged = true;
            if(slot.building) {
                constructionCompleted.push(slot.building.name);
            }
            return { 
                ...slot, 
                level: slot.construction.targetLevel,
                construction: undefined 
            };
          }

          return slot;
        });

        if (slotsChanged) {
            return newSlots;
        }
        return prevSlots;
      });

      if(inventoryUpdated){
        toast({
            title: "Uzalishaji Umekamilika!",
            description: `Umeongeza ${itemsProduced.join(', ')} kwenye ghala lako.`,
        })
      }
      
      if(constructionCompleted.length > 0){
        toast({
            title: "Ujenzi Umekamilika!",
            description: `${constructionCompleted.join(', ')} sasa inapatikana.`,
        })
      }

    }, 1000);

     // Salary payment interval (every minute)
    const salaryInterval = setInterval(() => {
        const totalSalary = hiredWorkers.reduce((acc, worker) => acc + worker.salary, 0);
        if (totalSalary > 0) {
            setMoney(prevMoney => {
                if (prevMoney < totalSalary) {
                    toast({
                        variant: "destructive",
                        title: "Pesa haitoshi kulipa mishahara!",
                        description: `Unahitaji $${totalSalary.toLocaleString()} lakini una $${prevMoney.toLocaleString()} pekee.`
                    });
                    // Here you might want to add logic to fire workers automatically
                    return prevMoney;
                }
                toast({
                    title: "Mishahara Imelipwa",
                    description: `Umelipa jumla ya $${totalSalary.toLocaleString()} kwa wafanyakazi wako.`
                });
                return prevMoney - totalSalary;
            });
        }
    }, 60000); // Every 60 seconds (1 minute)

    return () => {
      clearInterval(interval);
      clearInterval(salaryInterval);
    }
  }, [toast, hiredWorkers]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader money={money} stars={stars} />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && (
          <Dashboard 
            buildingSlots={buildingSlots} 
            inventory={inventory}
            hiredWorkers={hiredWorkers}
            stars={stars}
            onBuild={handleBuild}
            onStartProduction={handleStartProduction}
            onBoostConstruction={handleBoostConstruction}
            onUpgradeBuilding={handleUpgradeBuilding}
            onDemolishBuilding={handleDemolishBuilding}
            onBuyMaterial={handleBuyMaterial}
          />
        )}
        {view === 'inventory' && <Inventory inventoryItems={inventory} onPostToMarket={handlePostToMarket} />}
        {view === 'market' && (
          <TradeMarket 
            playerListings={marketListings} 
            stockListings={stockListings}
            bondListings={bondListings}
            inventory={inventory} 
          />
        )}
        {view === 'simulator' && <CommoditySimulator />}
        {view === 'encyclopedia' && <Encyclopedia />}
        {view === 'hr' && (
          <HumanResources
            availableWorkers={availableWorkers}
            hiredWorkers={hiredWorkers}
            money={money}
            onHireWorker={handleHireWorker}
            onFireWorker={handleFireWorker}
          />
        )}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
