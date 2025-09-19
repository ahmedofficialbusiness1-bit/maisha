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

const BUILDING_SLOTS = 20;

export type PlayerStock = {
    ticker: string;
    shares: number;
}

export type View = 'dashboard' | 'inventory' | 'market' | 'chats' | 'encyclopedia';

export type UserData = {
  money: number;
  stars: number;
  inventory: InventoryItem[];
  marketListings: PlayerListing[];
  companyData: StockListing[];
  bondListings: BondListing[];
  buildingSlots: BuildingSlot[];
  playerStocks: PlayerStock[];
};

const initialInventoryItems: InventoryItem[] = [
  { item: 'Maji', quantity: 15000, marketPrice: 0.01 },
  { item: 'Mbegu', quantity: 8000, marketPrice: 0.1 },
  { item: 'Yai', quantity: 25000, marketPrice: 1.25 },
  { item: 'Bwawa', quantity: 10, marketPrice: 125 },
  { item: 'Boat', quantity: 5, marketPrice: 250 },
  { item: 'Mbao', quantity: 500, marketPrice: 25 },
  { item: 'Matofali', quantity: 1000, marketPrice: 37.5 },
  { item: 'Nondo', quantity: 200, marketPrice: 312.5 },
  { item: 'Zege', quantity: 100, marketPrice: 62.5 },
  { item: 'Mashine A1', quantity: 10, marketPrice: 2500 },
  { item: 'Mashine A2', quantity: 10, marketPrice: 2750 },
  { item: 'Mashine A3', quantity: 10, marketPrice: 3000 },
  { item: 'Mashine A4', quantity: 10, marketPrice: 3250 },
  { item: 'Mashine A5', quantity: 10, marketPrice: 3500 },
  { item: 'Mashine B1', quantity: 10, marketPrice: 6250 },
  { item: 'Mashine B2', quantity: 10, marketPrice: 6500 },
  { item: 'Mashine B3', quantity: 10, marketPrice: 6750 },
  { item: 'Mashine B4', quantity: 10, marketPrice: 7000 },
  { item: 'Mashine B5', quantity: 10, marketPrice: 7250 },
  { item: 'Mashine B6', quantity: 10, marketPrice: 7500 },
  { item: 'Mashine B7', quantity: 10, marketPrice: 7750 },
  { item: 'Mashine C1', quantity: 10, marketPrice: 12500 },
  { item: 'Mashine C2', quantity: 10, marketPrice: 13750 },
  { item: 'K1 Mashine', quantity: 2, marketPrice: 375000 },
  { item: 'K2 Mashine', quantity: 2, marketPrice: 400000 },
  { item: 'K3 Mashine', quantity: 2, marketPrice: 425000 },
  { item: 'K4 Mashine', quantity: 2, marketPrice: 450000 },
  { item: 'K5 Mashine', quantity: 2, marketPrice: 475000 },
  { item: 'K6 Mashine', quantity: 2, marketPrice: 500000 },
  { item: 'K7 Mashine', quantity: 2, marketPrice: 525000 },
  { item: 'Leseni B1', quantity: 10, marketPrice: 12500 },
  { item: 'Leseni B2', quantity: 10, marketPrice: 12500 },
  { item: 'Leseni B3', quantity: 10, marketPrice: 12500 },
  { item: 'Leseni B4', quantity: 10, marketPrice: 12500 },
  { item: 'Leseni B5', quantity: 10, marketPrice: 12500 },
  { item: 'Leseni B6', quantity: 10, marketPrice: 12500 },
  { item: 'Leseni B7', quantity: 10, marketPrice: 12500 },
  { item: 'Shaba', quantity: 100, marketPrice: 62.5 },
  { item: 'Miti', quantity: 1000, marketPrice: 1.5 },
  { item: 'Saruji', quantity: 1000, marketPrice: 6.25 },
  { item: 'Chuma', quantity: 200, marketPrice: 2.00 },
  { item: 'Kokoto', quantity: 1000, marketPrice: 2.5 },
  { item: 'Mawe', quantity: 1000, marketPrice: 0.2 },
  { item: 'Umeme', quantity: 10000, marketPrice: 0.01 },
  { item: 'Mchanga', quantity: 1000, marketPrice: 0.15 },
  { item: 'Madini ya chuma', quantity: 1000, marketPrice: 2 },
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
  const [money, setMoney] = React.useState(initialData?.money ?? 1900000);
  const [stars, setStars] = React.useState(initialData?.stars ?? 50);
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialData?.inventory ?? initialInventoryItems);
  const [marketListings, setMarketListings] = React.useState<PlayerListing[]>(initialData?.marketListings ?? initialPlayerListings);
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialData?.companyData ?? initialCompanyData);
  const [bondListings, setBondListings] = React.useState<BondListing[]>(initialData?.bondListings ?? initialBondListings);
  const [buildingSlots, setBuildingSlots] = React.useState<BuildingSlot[]>(initialData?.buildingSlots ?? Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })));
  const [playerStocks, setPlayerStocks] = React.useState<PlayerStock[]>(initialData?.playerStocks ?? []);

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
        if (itemIndex > -1) {
          newInventory[itemIndex].quantity -= (input.quantity * quantity);
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

  const handleBuyStock = (stock: StockListing, quantity: number) => {
      const totalCost = stock.stockPrice * quantity;
      if (money < totalCost) {
        toast({ variant: 'destructive', title: 'Pesa Haitoshi', description: `Unahitaji $${totalCost.toLocaleString()} kununua hisa hizi.` });
        return;
      }

      setMoney(prev => prev - totalCost);
      
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
        const newListings = prevListings.map(l => {
            if (l.id === listing.id) {
                return { ...l, quantity: l.quantity - quantity };
            }
            return l;
        });
        // Remove listing if quantity is zero
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
    const playerListedCommodities = new Set(
        marketListings
            .filter(l => l.seller !== AI_PLAYER_NAME)
            .map(l => l.commodity)
    );

    setMarketListings(currentListings => {
        let updated = false;
        let newListings = [...currentListings];

        // 1. Add Serekali listings for unlisted products
        allPossibleProducts.forEach(product => {
            if (!playerListedCommodities.has(product.name)) {
                // Check if Serekali has already listed this
                const serekaliListingExists = newListings.some(
                    l => l.seller === AI_PLAYER_NAME && l.commodity === product.name
                );
                if (!serekaliListingExists) {
                    const priceProp = product.properties.find(p => p.label === 'Market Cost');
                    const price = priceProp ? parseFloat(priceProp.value.replace('$', '')) : 1_000_000;
                    
                    const newListing: PlayerListing = {
                        id: Date.now() + Math.random(),
                        commodity: product.name,
                        seller: AI_PLAYER_NAME,
                        quantity: 100, // Serekali always has 100 to start
                        price: price,
                        avatar: 'https://picsum.photos/seed/tza-gov/40/40',
                        quality: 5,
                        imageHint: 'government seal',
                    };
                    newListings.push(newListing);
                    updated = true;
                }
            }
        });
        
        // 2. Remove Serekali listings if a player has listed the same product
        const listingsToRemove = new Set<number>();
        newListings.forEach(listing => {
            if (listing.seller === AI_PLAYER_NAME && playerListedCommodities.has(listing.commodity)) {
                listingsToRemove.add(listing.id);
                updated = true;
            }
        });
        
        if (updated) {
            return newListings.filter(l => !listingsToRemove.has(l.id));
        }

        return currentListings; // No changes
    });

  }, [marketListings]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader money={money} stars={stars} />
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
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
