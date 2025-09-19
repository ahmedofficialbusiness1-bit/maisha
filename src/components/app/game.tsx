
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot, type BuildingType } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import type { Recipe } from '@/lib/recipe-data';
import { recipes } from '@/lib/recipe-data';
import { useToast } from '@/hooks/use-toast';
import { encyclopediaData } from '@/lib/encyclopedia-data.tsx';
import { buildingData } from '@/lib/building-data';
import { Chats } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';

const BUILDING_SLOTS = 20;

export type PlayerStock = {
    ticker: string;
    shares: number;
}

export type View = 'dashboard' | 'inventory' | 'market' | 'chats' | 'encyclopedia' | 'accounting';

export type UserData = {
  money: number;
  stars: number;
  inventory: InventoryItem[];
  marketListings: PlayerListing[];
  companyData: StockListing[];
  bondListings: BondListing[];
  buildingSlots: BuildingSlot[];
  playerStocks: PlayerStock[];
  transactions: Transaction[];
};

const initialInventoryItems: InventoryItem[] = [
  { item: 'Maji', quantity: 15000, marketPrice: 0.02 },
  { item: 'Mbegu', quantity: 8000, marketPrice: 0.2 },
  { item: 'Yai', quantity: 25000, marketPrice: 2.5 },
  { item: 'Bwawa', quantity: 10, marketPrice: 250 },
  { item: 'Boat', quantity: 5, marketPrice: 500 },
  { item: 'Mbao', quantity: 500, marketPrice: 50 },
  { item: 'Matofali', quantity: 1000, marketPrice: 75 },
  { item: 'Nondo', quantity: 200, marketPrice: 625 },
  { item: 'Zege', quantity: 100, marketPrice: 125 },
  { item: 'Mashine A1', quantity: 10, marketPrice: 5000 },
  { item: 'Mashine A2', quantity: 10, marketPrice: 5500 },
  { item: 'Mashine A3', quantity: 10, marketPrice: 6000 },
  { item: 'Mashine A4', quantity: 10, marketPrice: 6500 },
  { item: 'Mashine A5', quantity: 10, marketPrice: 7000 },
  { item: 'Mashine B1', quantity: 10, marketPrice: 12500 },
  { item: 'Mashine B2', quantity: 10, marketPrice: 13000 },
  { item: 'Mashine B3', quantity: 10, marketPrice: 13500 },
  { item: 'Mashine B4', quantity: 10, marketPrice: 14000 },
  { item: 'Mashine B5', quantity: 10, marketPrice: 14500 },
  { item: 'Mashine B6', quantity: 10, marketPrice: 15000 },
  { item: 'Mashine B7', quantity: 10, marketPrice: 15500 },
  { item: 'Mashine C1', quantity: 10, marketPrice: 25000 },
  { item: 'Mashine C2', quantity: 10, marketPrice: 27500 },
  { item: 'K1 Mashine', quantity: 2, marketPrice: 750000 },
  { item: 'K2 Mashine', quantity: 2, marketPrice: 800000 },
  { item: 'K3 Mashine', quantity: 2, marketPrice: 850000 },
  { item: 'K4 Mashine', quantity: 2, marketPrice: 900000 },
  { item: 'K5 Mashine', quantity: 2, marketPrice: 950000 },
  { item: 'K6 Mashine', quantity: 2, marketPrice: 1000000 },
  { item: 'K7 Mashine', quantity: 2, marketPrice: 1050000 },
  { item: 'Leseni B1', quantity: 10, marketPrice: 25000 },
  { item: 'Leseni B2', quantity: 10, marketPrice: 25000 },
  { item: 'Leseni B3', quantity: 10, marketPrice: 25000 },
  { item: 'Leseni B4', quantity: 10, marketPrice: 25000 },
  { item: 'Leseni B5', quantity: 10, marketPrice: 25000 },
  { item: 'Leseni B6', quantity: 10, marketPrice: 25000 },
  { item: 'Leseni B7', quantity: 10, marketPrice: 25000 },
  { item: 'Shaba', quantity: 100, marketPrice: 125 },
  { item: 'Miti', quantity: 1000, marketPrice: 3 },
  { item: 'Saruji', quantity: 1000, marketPrice: 12.5 },
  { item: 'Chuma', quantity: 200, marketPrice: 8 },
  { item: 'Kokoto', quantity: 1000, marketPrice: 5 },
  { item: 'Mawe', quantity: 1000, marketPrice: 0.8 },
  { item: 'Umeme', quantity: 10000, marketPrice: 0.04 },
  { item: 'Mchanga', quantity: 1000, marketPrice: 0.6 },
  { item: 'Madini ya chuma', quantity: 1000, marketPrice: 8 },
];

const initialPlayerListings: PlayerListing[] = [
    { id: 1, commodity: 'Maji', seller: 'Flexy suyo', quantity: 450, price: 0.02, avatar: 'https://picsum.photos/seed/flexy/40/40', quality: 1, imageHint: 'player avatar' },
    { id: 2, commodity: 'Yai', seller: 'MKG CIE', quantity: 100, price: 1.25, avatar: 'https://picsum.photos/seed/mkg/40/40', quality: 0, imageHint: 'company logo' },
];

const initialCompanyData: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, sharesAvailable: 10000, marketCap: 4507500, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo', creditRating: 'AA+', dailyRevenue: 500000, dividendYield: 0.015 },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, sharesAvailable: 50000, marketCap: 6025000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo', creditRating: 'A-', dailyRevenue: 250000, dividendYield: 0.021 },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
];

const AI_PLAYER_NAME = 'Serekali';
const PLAYER_NAME = 'Mchezaji';

export function Game() {
  const { toast } = useToast();

  const [view, setView] = React.useState<View>('dashboard');

  const initialData: UserData | null = null;
  // State Management
  const [money, setMoney] = React.useState(initialData?.money ?? 100000000);
  const [stars, setStars] = React.useState(initialData?.stars ?? 50);
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialData?.inventory ?? initialInventoryItems);
  const [marketListings, setMarketListings] = React.useState<PlayerListing[]>(initialData?.marketListings ?? initialPlayerListings);
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialData?.companyData ?? initialCompanyData);
  const [bondListings, setBondListings] = React.useState<BondListing[]>(initialData?.bondListings ?? initialBondListings);
  const [buildingSlots, setBuildingSlots] = React.useState<BuildingSlot[]>(initialData?.buildingSlots ?? Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })));
  const [playerStocks, setPlayerStocks] = React.useState<PlayerStock[]>(initialData?.playerStocks ?? []);
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialData?.transactions ?? []);

  // Demand tracking for Serekali AI
  const [serekaliDemand, setSerekaliDemand] = React.useState<Record<string, number>>({});


   const addTransaction = (type: 'income' | 'expense', amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      amount,
      description,
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
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
    
    // Check for required inputs and calculate cost
    for (const input of inputs) {
        const inventoryItem = inventory.find(i => i.item === input.name);
        const requiredQuantity = input.quantity * quantity;

        if (!inventoryItem || inventoryItem.quantity < requiredQuantity) {
            toast({
                variant: "destructive",
                title: "Uhaba wa Rasilimali",
                description: `Huna ${input.name} za kutosha. Unahitaji ${requiredQuantity.toLocaleString()}.`,
            });
            return;
        }
    }
    
    const now = Date.now();
    
    // Deduct inputs from inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      for (const input of inputs) {
        const itemIndex = newInventory.findIndex(i => i.item === input.name);
        const requiredQuantity = input.quantity * quantity;
        if (itemIndex > -1) {
          newInventory[itemIndex].quantity -= requiredQuantity;
        }
      }
      return newInventory.filter(item => item.quantity > 0);
    });

    // Set production state on building
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
        seller: PLAYER_NAME, // current player
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

 const handleBuyMaterial = (materialName: string, quantityToBuy: number): boolean => {
    const listingsForMaterial = marketListings
      .filter(l => l.commodity === materialName)
      .sort((a, b) => a.price - b.price); // Sort by cheapest first

    if (listingsForMaterial.length === 0) {
      toast({ variant: 'destructive', title: 'Bidhaa Haipo Sokoni', description: `Samahani, ${materialName} haipatikani sokoni kwa sasa.` });
      return false;
    }

    let quantityLeftToBuy = quantityToBuy;
    let totalCost = 0;
    const purchases: { from: PlayerListing, quantity: number }[] = [];

    // Figure out what can be bought
    for (const listing of listingsForMaterial) {
        if (quantityLeftToBuy <= 0) break;
        
        const quantityToBuyFromThisSeller = Math.min(listing.quantity, quantityLeftToBuy);
        
        purchases.push({ from: listing, quantity: quantityToBuyFromThisSeller });
        totalCost += quantityToBuyFromThisSeller * listing.price;
        quantityLeftToBuy -= quantityToBuyFromThisSeller;
    }

    if (quantityLeftToBuy > 0) {
        toast({ variant: 'destructive', title: 'Kiasi Hakitoshi Sokoni', description: `Ni ${quantityToBuy - quantityLeftToBuy}x ${materialName} pekee zinazopatikana sokoni.` });
        return false;
    }
    
    if (money < totalCost) {
        toast({ variant: 'destructive', title: 'Pesa Haitoshi', description: `Unahitaji $${totalCost.toLocaleString()} kununua ${quantityToBuy}x ${materialName}.` });
        return false;
    }

    // --- Execute the purchases ---
    setMoney(prevMoney => prevMoney - totalCost);
    addTransaction('expense', totalCost, `Bought ${quantityToBuy.toLocaleString()}x ${materialName} from market`);

    // Add to inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      const itemIndex = newInventory.findIndex(i => i.item === materialName);
      if (itemIndex > -1) {
        newInventory[itemIndex].quantity += quantityToBuy;
      } else {
        const encyclopediaEntry = encyclopediaData.find(e => e.name === materialName);
        newInventory.push({ item: materialName, quantity: quantityToBuy, marketPrice: encyclopediaEntry?.properties.find(p => p.label.includes("Market Cost"))?.value ? parseFloat(encyclopediaEntry.properties.find(p => p.label.includes("Market Cost"))!.value.replace('$', '')) : 0 });
      }
      return newInventory;
    });

    // Update market listings
    setMarketListings(prevListings => {
        let newListings = [...prevListings];
        purchases.forEach(purchase => {
            // Do not deplete Serekali's stock
            if (purchase.from.seller === AI_PLAYER_NAME) {
                 // Track demand for Serekali's items
                setSerekaliDemand(prevDemand => ({
                    ...prevDemand,
                    [purchase.from.commodity]: (prevDemand[purchase.from.commodity] || 0) + purchase.quantity,
                }));
                return; 
            }
            
            const listingIndex = newListings.findIndex(l => l.id === purchase.from.id);
            if (listingIndex > -1) {
                newListings[listingIndex].quantity -= purchase.quantity;
            }
        });
        return newListings.filter(l => l.quantity > 0);
    });

    toast({
        title: "Manunuzi Yamekamilika",
        description: `Umenunua ${quantityToBuy.toLocaleString()}x ${materialName} kwa $${totalCost.toLocaleString()}.`
    });

    return true;
};

  const handleBuyStock = (stock: StockListing, quantity: number) => {
      const totalCost = stock.stockPrice * quantity;
      if (money < totalCost) {
        toast({ variant: 'destructive', title: 'Pesa Haitoshi', description: `Unahitaji $${totalCost.toLocaleString()} kununua hisa hizi.` });
        return;
      }

      setMoney(prev => prev - totalCost);
      addTransaction('expense', totalCost, `Bought ${quantity.toLocaleString()} shares of ${stock.ticker}`);
      
      // Update player's stock portfolio
      setPlayerStocks(prev => {
          const existingStock = prev.find(s => s.ticker === stock.ticker);
          if (existingStock) {
              return prev.map(s => s.ticker === stock.ticker ? { ...s, shares: s.shares + quantity } : s);
          } else {
              return [...prev, { ticker: stock.ticker, shares: quantity }];
          }
      });
      
      // Update company's available shares
      setCompanyData(prev => prev.map(c => 
          c.ticker === stock.ticker 
          ? { ...c, sharesAvailable: c.sharesAvailable - quantity }
          : c
      ));

      toast({ title: 'Umefanikiwa Kununua Hisa!', description: `Umenunua hisa ${quantity.toLocaleString()} za ${stock.ticker}.` });
  }

  const handleBuyFromMarket = (listing: PlayerListing, quantity: number) => {
    if (listing.seller === PLAYER_NAME) {
        toast({ variant: "destructive", title: "Action not allowed", description: "Huwezi kununua bidhaa zako mwenyewe." });
        return;
    }

    const totalCost = listing.price * quantity;

    if (money < totalCost) {
        toast({ variant: "destructive", title: "Pesa Haitoshi", description: `Unahitaji $${totalCost.toLocaleString()} kununua bidhaa hii.` });
        return;
    }

    // 1. Deduct money from player
    setMoney(prev => prev - totalCost);
    addTransaction('expense', totalCost, `Bought ${quantity.toLocaleString()}x ${listing.commodity} from market`);


    // 2. Add item to player's inventory
    setInventory(prevInventory => {
        const newInventory = [...prevInventory];
        const itemIndex = newInventory.findIndex(i => i.item === listing.commodity);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += quantity;
        } else {
            const encyclopediaEntry = encyclopediaData.find(e => e.name === listing.commodity);
            newInventory.push({
                item: listing.commodity,
                quantity: quantity,
                marketPrice: encyclopediaEntry?.properties.find(p => p.label.includes("Market Cost"))?.value.replace('$', '') ? parseFloat(encyclopediaEntry.properties.find(p => p.label.includes("Market Cost"))!.value.replace('$', '')) : 0,
            });
        }
        return newInventory;
    });

    // 3. Update market listing
    setMarketListings(prevListings => {
        // Do not deplete Serekali's stock
        if (listing.seller === AI_PLAYER_NAME) {
            // Track demand for Serekali's items
            setSerekaliDemand(prevDemand => ({
                ...prevDemand,
                [listing.commodity]: (prevDemand[listing.commodity] || 0) + quantity,
            }));
            return prevListings;
        }

        const newListings = prevListings.map(l => {
            if (l.id === listing.id) {
                return { ...l, quantity: l.quantity - quantity };
            }
            return l;
        });
        // Remove listing if quantity is zero, but never remove Serekali
        return newListings.filter(l => l.quantity > 0);
    });

    // 4. (Future) Credit the seller. For now, only Serekali and others are sellers.
    // If seller is not Serekali, we can assume it's another player.
    // For now, the money just "leaves the system".

    toast({ title: 'Manunuzi Yamekamilika', description: `Umenunua ${quantity.toLocaleString()}x ${listing.commodity} kwa $${totalCost.toLocaleString()}.` });
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

    const dividendInterval = setInterval(() => {
        let totalDividends = 0;
        const dividendMessages: string[] = [];

        playerStocks.forEach(playerStock => {
            const company = companyData.find(c => c.ticker === playerStock.ticker);
            if (company && playerStock.shares > 0) {
                // Calculate dividend per share
                // (dailyRevenue * dividendYield) / totalShares
                const totalShares = company.sharesAvailable + playerStocks.reduce((acc, ps) => (ps.ticker === company.ticker ? acc + ps.shares : acc), 0) // This is a simplification
                const dividendPerShare = (company.dailyRevenue * company.dividendYield) / totalShares;
                const dividendForPlayer = dividendPerShare * playerStock.shares;

                if (dividendForPlayer > 0) {
                    totalDividends += dividendForPlayer;
                    dividendMessages.push(`$${dividendForPlayer.toFixed(2)} from ${company.ticker}`);
                }
            }
        });

        if (totalDividends > 0) {
            setMoney(prev => prev + totalDividends);
            addTransaction('income', totalDividends, `Dividend Payout (${dividendMessages.join(', ')})`);
            toast({
                title: 'Umelipwa Gawio!',
                description: `Umepokea jumla ya $${totalDividends.toFixed(2)}. (${dividendMessages.join(', ')})`
            });
        }
    }, 24 * 60 * 60000); // Every 24 hours to simulate a "day"

    // Stock market fluctuation interval
    const marketFluctuationInterval = setInterval(() => {
        setCompanyData(prevData => prevData.map(company => {
            const priceChangePercent = (Math.random() - 0.49) * 0.05; // -2.5% to +2.5%
            const revenueChangePercent = (Math.random() - 0.45) * 0.1; // -5% to +5%
            
            const newPrice = Math.max(1, company.stockPrice * (1 + priceChangePercent));
            const newRevenue = Math.max(1000, company.dailyRevenue * (1 + revenueChangePercent));
            const newMarketCap = newPrice * (company.sharesAvailable + playerStocks.find(ps => ps.ticker === company.ticker)?.shares || 0);

            return {
                ...company,
                stockPrice: newPrice,
                dailyRevenue: newRevenue,
                marketCap: newMarketCap
            };
        }));
    }, 60 * 60000); // Every hour


    return () => {
      clearInterval(interval);
      clearInterval(dividendInterval);
      clearInterval(marketFluctuationInterval);
    }
  }, [toast, playerStocks, companyData]);
  
  // "Serekali" AI Market Maker Logic
  React.useEffect(() => {
    const allPossibleProducts = encyclopediaData;

    setMarketListings(currentListings => {
        const serekaliListingsMap = new Map(
            currentListings.filter(l => l.seller === AI_PLAYER_NAME).map(l => [l.commodity, l])
        );
        const playerListings = currentListings.filter(l => l.seller !== AI_PLAYER_NAME);
        
        allPossibleProducts.forEach(product => {
            if (!serekaliListingsMap.has(product.name)) {
                const priceProp = product.properties.find(p => p.label === 'Market Cost');
                const price = priceProp ? parseFloat(priceProp.value.replace('$', '')) : 1_000_000;
                
                const newListing: PlayerListing = {
                    id: Date.now() + Math.random(),
                    commodity: product.name,
                    seller: AI_PLAYER_NAME,
                    quantity: 1500000, 
                    price: price,
                    avatar: 'https://picsum.photos/seed/tza-gov/40/40',
                    quality: 5,
                    imageHint: 'government seal',
                };
                serekaliListingsMap.set(product.name, newListing);
            }
        });

        return [...playerListings, ...Array.from(serekaliListingsMap.values())];
    });
  }, []); 

  // Serekali Price Adjustment Logic (Supply & Demand Simulation)
  React.useEffect(() => {
    const adjustmentInterval = setInterval(() => {
        setMarketListings(prevListings => {
            const playerListings = prevListings.filter(l => l.seller !== AI_PLAYER_NAME);
            const serekaliListings = prevListings.filter(l => l.seller === AI_PLAYER_NAME);

            const adjustedSerekaliListings = serekaliListings.map(listing => {
                const demand = serekaliDemand[listing.commodity] || 0;
                const basePriceEntry = encyclopediaData.find(e => e.name === listing.commodity);
                const basePrice = basePriceEntry ? parseFloat(basePriceEntry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '') || '0') : listing.price;
                
                let newPrice = listing.price;

                if (demand > 0) {
                    // Price increases with demand
                    const increaseFactor = 0.005; // 0.5% price increase per demand cycle
                    newPrice *= (1 + increaseFactor);
                } else {
                    // Price slowly decays back to base price if no demand
                    const decayFactor = 0.999; // 0.1% decay
                    newPrice = Math.max(basePrice, newPrice * decayFactor);
                }

                return { ...listing, price: newPrice };
            });
            
            // Reset demand for the next cycle
            setSerekaliDemand({});

            return [...playerListings, ...adjustedSerekaliListings];
        });
    }, 5 * 60 * 1000); // Adjust prices every 5 minutes

    return () => clearInterval(adjustmentInterval);
  }, [serekaliDemand]);



  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader money={money} stars={stars} setView={setView} />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && (
          <Dashboard 
            buildingSlots={buildingSlots} 
            inventory={inventory}
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
            stockListings={companyData}
            bondListings={bondListings}
            inventory={inventory} 
            onBuyStock={handleBuyStock}
            onBuyFromMarket={handleBuyFromMarket}
          />
        )}
        {view === 'chats' && <Chats />}
        {view === 'encyclopedia' && <Encyclopedia />}
        {view === 'accounting' && <Accounting transactions={transactions} />}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
