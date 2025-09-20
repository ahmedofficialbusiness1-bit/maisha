
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot, type BuildingType, type ActivityInfo } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import type { Recipe } from '@/lib/recipe-data';
import { recipes } from '@/lib/recipe-data';
import { encyclopediaData } from '@/lib/encyclopedia-data.tsx';
import { buildingData } from '@/lib/building-data';
import { Chats } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';
import { PlayerProfile, type ProfileData, type PlayerMetrics } from '@/components/app/profile';


const BUILDING_SLOTS = 20;

export type PlayerStock = {
    ticker: string;
    shares: number;
}

export type View = 'dashboard' | 'inventory' | 'market' | 'chats' | 'encyclopedia' | 'accounting' | 'profile';

export type Notification = {
    id: string;
    message: string;
    timestamp: number;
    read: boolean;
    icon: 'construction' | 'sale' | 'purchase' | 'dividend' | 'production';
};


export type UserData = {
  playerName: string;
  playerAvatar: string;
  privateNotes: string;
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
];

const initialPlayerListings: PlayerListing[] = [
    { id: 1, commodity: 'Maji', seller: 'Flexy suyo', quantity: 450, price: 0.10, avatar: 'https://picsum.photos/seed/flexy/40/40', quality: 1, imageHint: 'player avatar' },
    { id: 2, commodity: 'Yai', seller: 'MKG CIE', quantity: 100, price: 1.50, avatar: 'https://picsum.photos/seed/mkg/40/40', quality: 0, imageHint: 'company logo' },
];

const initialPlayerStocks: PlayerStock[] = [];

const initialCompanyData: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, totalShares: 250000, marketCap: 450.75 * 250000, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo', creditRating: 'AA+', dailyRevenue: 100000, dividendYield: 0.015 },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, totalShares: 1000000, marketCap: 120.50 * 1000000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo', creditRating: 'A-', dailyRevenue: 150000, dividendYield: 0.015 },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
];

const AI_PLAYER_NAME = 'Serekali';


export const productCategoryToShopMap: Record<string, string> = {
    'Space': 'duka_la_anga',
    'Vehicles': 'duka_la_magari',
    'Spares': 'duka_la_magari',
    'Electronics': 'duka_la_electroniki',
    'Mavazi': 'duka_la_nguo_na_vito',
    'Construction': 'duka_la_ujenzi',
    'Raw Material': 'duka_la_ujenzi',
    'Vifaa': 'duka_la_ujenzi',
    'Madini': 'duka_la_ujenzi',
    'Mafuta': 'duka_la_ujenzi',
    'Agriculture': 'duka_kuu',
    'Food': 'duka_kuu',
    'Product': 'duka_kuu', // Default
    'Documents': 'duka_kuu', // Licenses, etc.
};


export function Game() {
  const [view, setView] = React.useState<View>('dashboard');

  const initialData: UserData | null = null;
  // State Management
  const [playerName, setPlayerName] = React.useState(initialData?.playerName ?? 'Mchezaji');
  const [playerAvatar, setPlayerAvatar] = React.useState(initialData?.playerAvatar ?? 'https://picsum.photos/seed/player/100/100');
  const [privateNotes, setPrivateNotes] = React.useState(initialData?.privateNotes ?? 'Welcome to my company profile! I specialize in producing high-quality goods.');
  const [money, setMoney] = React.useState(initialData?.money ?? 10000);
  const [stars, setStars] = React.useState(initialData?.stars ?? 5);
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialData?.inventory ?? initialInventoryItems);
  const [marketListings, setMarketListings] = React.useState<PlayerListing[]>(initialData?.marketListings ?? initialPlayerListings);
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialData?.companyData ?? initialCompanyData);
  const [bondListings, setBondListings] = React.useState<BondListing[]>(initialData?.bondListings ?? initialBondListings);
  const [buildingSlots, setBuildingSlots] = React.useState<BuildingSlot[]>(initialData?.buildingSlots ?? Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })));
  const [playerStocks, setPlayerStocks] = React.useState<PlayerStock[]>(initialData?.playerStocks ?? initialPlayerStocks);
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialData?.transactions ?? []);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const processedActivitiesRef = React.useRef<Set<string>>(new Set());

  const addNotification = (message: string, icon: Notification['icon']) => {
    const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        timestamp: Date.now(),
        read: false,
        icon,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const handleUpdateProfile = (data: ProfileData) => {
    setPlayerName(data.playerName);
    if(data.avatarUrl) setPlayerAvatar(data.avatarUrl);
    setPrivateNotes(data.privateNotes || '');
    setView('dashboard'); // Go back to dashboard after saving
  }

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
    const costs = buildingData[building.id]?.buildCost;
    if (!costs) return;
    
    // 1. Check for required build materials
    for (const cost of costs) {
        const inventoryItem = inventory.find(i => i.item === cost.name);
        if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
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

    addNotification(`Ujenzi wa ${building.name} umeanza.`, 'construction');
  };
  
    const handleUpgradeBuilding = (slotIndex: number) => {
    const slot = buildingSlots[slotIndex];
    if (!slot || !slot.building) return;

    const costs = buildingData[slot.building.id].upgradeCost(slot.level + 1);

    // 1. Check for required upgrade materials
    for (const cost of costs) {
      const inventoryItem = inventory.find(i => i.item === cost.name);
      if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
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

    addNotification(`Uboreshaji wa ${slot.building.name} hadi Lvl ${slot.level + 1} umeanza.`, 'construction');
  };

  const handleDemolishBuilding = (slotIndex: number) => {
    const buildingName = buildingSlots[slotIndex]?.building?.name || 'Jengo';
    setBuildingSlots(prev => {
        const newSlots = [...prev];
        newSlots[slotIndex] = { building: null, level: 0 };
        return newSlots;
    });
  };


  const handleStartProduction = (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => {
    const inputs = recipe.inputs || [];
    
    // Check for required inputs
    for (const input of inputs) {
        const inventoryItem = inventory.find(i => i.item === input.name);
        const requiredQuantity = input.quantity * quantity;

        if (!inventoryItem || inventoryItem.quantity < requiredQuantity) {
            return;
        }
    }
    
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
    
     const now = Date.now();
 
     // Set activity state on the building slot
     setBuildingSlots(prev => {
       const newSlots = [...prev];
       const slot = newSlots[slotIndex];
       if (slot && slot.building && !slot.activity) {
         newSlots[slotIndex] = {
           ...slot,
           activity: {
             type: 'produce',
             recipeId: recipe.output.name, // The item being produced
             quantity: recipe.output.quantity * quantity,
             saleValue: 0, // No sale value for production
             startTime: now,
             endTime: now + durationMs,
           }
         };
       }
       return newSlots;
     });

    addNotification(`Umeanza kuzalisha ${recipe.output.quantity * quantity}x ${recipe.output.name}.`, 'production');
  };

  const handleStartSelling = (slotIndex: number, item: InventoryItem, quantity: number, price: number, durationMs: number) => {
     // 1. Check if player has enough of the item
     const inventoryItem = inventory.find(i => i.item === item.item);
     if (!inventoryItem || inventoryItem.quantity < quantity) {
       return; // Not enough to sell
     }
 
     // 2. Deduct the item from inventory
     setInventory(prevInventory => {
       return prevInventory.map(invItem => {
         if (invItem.item === item.item) {
           return { ...invItem, quantity: invItem.quantity - quantity };
         }
         return invItem;
       }).filter(invItem => invItem.quantity > 0); // Remove if quantity is zero
     });
 
     const now = Date.now();
     const totalSaleValue = quantity * price;
 
     // 3. Set selling state on the building slot
     setBuildingSlots(prev => {
       const newSlots = [...prev];
       const slot = newSlots[slotIndex];
       if (slot && slot.building && !slot.activity) {
         newSlots[slotIndex] = {
           ...slot,
           activity: {
             type: 'sell',
             recipeId: item.item,
             quantity: quantity,
             saleValue: totalSaleValue,
             startTime: now,
             endTime: now + durationMs,
           }
         };
       }
       return newSlots;
     });

    addNotification(`Unaanza kuuza ${quantity.toLocaleString()}x ${item.item}.`, 'sale');
  }

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
        seller: playerName, // current player
        quantity,
        price,
        avatar: playerAvatar,
        quality: 5,
        imageHint: 'player avatar'
      };
      return [newListing, ...prevListings];
    });

    addNotification(`Umeweka ${quantity.toLocaleString()}x ${item.item} sokoni.`, 'sale');
  };
  
  const handleBoostConstruction = (slotIndex: number, starsToUse: number) => {
      const timeReductionPerStar = 3 * 60 * 1000; // 3 minutes per star
      const timeReduction = starsToUse * timeReductionPerStar;

      if (stars < starsToUse) {
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

  };

 const handleBuyMaterial = (materialName: string, quantityToBuy: number): boolean => {
    const listingsForMaterial = marketListings
      .filter(l => l.commodity === materialName)
      .sort((a, b) => a.price - b.price); // Sort by cheapest first

    if (listingsForMaterial.length === 0) {
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
        return false;
    }
    
    if (money < totalCost) {
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
            // Do not deplete Serekali's stock, as it has infinite quantity
            if (purchase.from.seller === AI_PLAYER_NAME) {
                 return; 
            }
            
            const listingIndex = newListings.findIndex(l => l.id === purchase.from.id);
            if (listingIndex > -1) {
                newListings[listingIndex].quantity -= purchase.quantity;
            }
        });
        return newListings.filter(l => l.quantity > 0);
    });

    addNotification(`Umenunua ${quantityToBuy.toLocaleString()}x ${materialName} kwa $${totalCost.toLocaleString()}.`, 'purchase');

    return true;
};

    const calculateAvailableShares = (stock: StockListing) => {
        const ownedByPlayers = playerStocks
            .filter(ps => ps.ticker === stock.ticker)
            .reduce((sum, ps) => sum + ps.shares, 0);
        const maxSellable = Math.floor(stock.totalShares * 0.70);
        return Math.max(0, maxSellable - ownedByPlayers);
    }

  const handleBuyStock = (stock: StockListing, quantity: number) => {
      const totalCost = stock.stockPrice * quantity;
      if (money < totalCost) {
        return;
      }

      const availableShares = calculateAvailableShares(stock);
      if (quantity > availableShares) {
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

      addNotification(`Umenunua hisa ${quantity.toLocaleString()} za ${stock.companyName}.`, 'purchase');
  }

  const handleBuyFromMarket = (listing: PlayerListing, quantity: number) => {
    if (listing.seller === playerName) {
        return;
    }

    const totalCost = listing.price * quantity;

    if (money < totalCost) {
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

    addNotification(`Umenunua ${quantity.toLocaleString()}x ${listing.commodity} kutoka kwa ${listing.seller}.`, 'purchase');
  };
  
   // AI Player (Serekali) automatic market seeding
   React.useEffect(() => {
    const aiListings: PlayerListing[] = encyclopediaData
      .filter(entry => entry.properties.some(p => p.label === 'Market Cost'))
      .map((entry, index) => {
          const marketCostProp = entry.properties.find(p => p.label === 'Market Cost');
          const price = marketCostProp ? parseFloat(marketCostProp.value.replace('$', '').replace(/,/g, '')) : 0;
          
          return {
              id: 10000 + index, // Unique ID range for AI
              commodity: entry.name,
              seller: AI_PLAYER_NAME,
              quantity: 999999, // Infinite quantity
              price: price,
              avatar: 'https://picsum.photos/seed/serekali/40/40',
              quality: 5,
              imageHint: 'government seal'
          };
      })
      .filter(listing => listing.price > 0); // Only list items with a price

    setMarketListings(prev => [
        ...prev.filter(p => p.seller !== AI_PLAYER_NAME), // Remove old AI listings
        ...aiListings,
    ]);
  }, []);

   React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setBuildingSlots(prevSlots => {
        let slotsChanged = false;
        const newSlots = [...prevSlots];
        
        newSlots.forEach((slot, index) => {
          // Check for completed activities
          if (slot && slot.activity && now >= slot.activity.endTime) {
            const activityId = `${index}-${slot.activity.startTime}`;

            if (!processedActivitiesRef.current.has(activityId)) {
                slotsChanged = true;
                const { type, recipeId: itemName, quantity: totalQuantity, saleValue } = slot.activity;

                if (type === 'sell' && saleValue > 0) {
                    setMoney(prevMoney => prevMoney + saleValue);
                    addTransaction('income', saleValue, `Sold ${totalQuantity.toLocaleString()}x ${itemName}`);
                    addNotification(`Umepokea $${saleValue.toLocaleString()} kwa kuuza ${totalQuantity.toLocaleString()}x ${itemName}.`, 'sale');
                } else if (type === 'produce') {
                    setInventory(prevInventory => {
                        const newInventory = [...prevInventory];
                        const itemIndex = newInventory.findIndex(i => i.item === itemName);
                        if (itemIndex > -1) {
                            newInventory[itemIndex].quantity += totalQuantity;
                        } else {
                            const productInfo = encyclopediaData.find(e => e.name === itemName);
                            const price = productInfo ? parseFloat(productInfo.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : 0;
                            newInventory.push({ item: itemName, quantity: totalQuantity, marketPrice: price });
                        }
                        return newInventory;
                    });
                     addNotification(`Uzalishaji wa ${totalQuantity.toLocaleString()}x ${itemName} umekamilika.`, 'production');
                }
                
                newSlots[index] = { ...slot, activity: undefined };
                processedActivitiesRef.current.add(activityId);
            }
          }
          
          // Check for completed construction
          if (slot && slot.construction && now >= slot.construction.endTime) {
            slotsChanged = true;
            addNotification(`Ujenzi wa ${slot.building?.name} Lvl ${slot.construction.targetLevel} umekamilika!`, 'construction');
            newSlots[index] = { 
                ...slot, 
                level: slot.construction.targetLevel,
                construction: undefined 
            };
          }
        });

        return slotsChanged ? newSlots : prevSlots;
      });

    }, 1000);

    const dividendInterval = setInterval(() => {
        let totalDividends = 0;
        const dividendMessages: string[] = [];

        playerStocks.forEach(playerStock => {
            const company = companyData.find(c => c.ticker === playerStock.ticker);
            if (company && playerStock.shares > 0) {
                // Calculate dividend per share
                // (dailyRevenue * dividendYield) / totalShares
                const totalShares = company.totalShares;
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
            addNotification(`Umepokea $${totalDividends.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} kama gawio la hisa.`, 'dividend');
        }
    }, 24 * 60 * 60000); // Every 24 hours to simulate a "day"

    // Stock market fluctuation interval
    const marketFluctuationInterval = setInterval(() => {
        setCompanyData(prevData => prevData.map(company => {
            const priceChangePercent = (Math.random() - 0.49) * 0.05; // -2.5% to +2.5%
            const revenueChangePercent = (Math.random() - 0.45) * 0.1; // -5% to +5%
            
            const newPrice = Math.max(1, company.stockPrice * (1 + priceChangePercent));
            const newRevenue = Math.max(1000, company.dailyRevenue * (1 + revenueChangePercent));
            const newMarketCap = newPrice * company.totalShares;

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
  }, [playerStocks, companyData]);


  const calculatePlayerMetrics = React.useCallback((): PlayerMetrics => {
    // 1. Calculate Inventory Value
    const inventoryValue = inventory.reduce((acc, item) => {
        return acc + (item.quantity * item.marketPrice);
    }, 0);

    // 2. Calculate Building Value
    const buildingValue = buildingSlots.reduce((acc, slot) => {
        if (slot.building) {
            const costs = buildingData[slot.building.id]?.buildCost;
            if (costs) {
                const buildCostValue = costs.reduce((costAcc, cost) => {
                    const itemPrice = encyclopediaData.find(e => e.name === cost.name)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || 0;
                    return costAcc + (cost.quantity * parseFloat(itemPrice.toString()));
                }, 0);
                // Add value for each level
                return acc + (buildCostValue * Math.pow(1.5, slot.level));
            }
        }
        return acc;
    }, 0);
    
    // 3. Calculate Stock Value
    const stockValue = playerStocks.reduce((acc, pStock) => {
        const stockInfo = companyData.find(c => c.ticker === pStock.ticker);
        return acc + (pStock.shares * (stockInfo?.stockPrice || 0));
    }, 0);

    // 4. Calculate Net Worth
    const netWorth = money + inventoryValue + buildingValue;
    
    // 5. Determine Rating
    let rating = 'C';
    if (netWorth > 1_000_000_000) rating = 'AAA';
    else if (netWorth > 500_000_000) rating = 'AA';
    else if (netWorth > 100_000_000) rating = 'A';
    else if (netWorth > 50_000_000) rating = 'BBB';
    else if (netWorth > 10_000_000) rating = 'BB';
    else if (netWorth > 1_000_000) rating = 'B';

    // 6. Determine Ranking (simulated)
    const baseRanking = 50000;
    const rank = Math.max(1, Math.floor(baseRanking / (Math.log10(netWorth) || 1)));

    return { netWorth, ranking: `#${rank.toLocaleString()}`, rating, buildingValue, stockValue };
  }, [money, inventory, buildingSlots, playerStocks, companyData]);
  
  const playerMetrics = calculatePlayerMetrics();


  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader 
        money={money} 
        stars={stars} 
        setView={setView} 
        playerName={playerName} 
        playerAvatar={playerAvatar} 
        notifications={notifications}
        onNotificationsRead={handleMarkNotificationsRead}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && (
          <Dashboard 
            buildingSlots={buildingSlots} 
            inventory={inventory}
            stars={stars}
            onBuild={handleBuild}
            onStartProduction={handleStartProduction}
            onStartSelling={handleStartSelling}
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
            stockListings={companyData.map(stock => ({
                ...stock,
                sharesAvailable: calculateAvailableShares(stock)
            }))}
            bondListings={bondListings}
            inventory={inventory} 
            onBuyStock={handleBuyStock}
            onBuyFromMarket={handleBuyFromMarket}
            playerName={playerName}
          />
        )}
        {view === 'chats' && <Chats />}
        {view === 'encyclopedia' && <Encyclopedia />}
        {view === 'accounting' && <Accounting transactions={transactions} />}
        {view === 'profile' && <PlayerProfile onSave={handleUpdateProfile} currentProfile={{ playerName, avatarUrl: playerAvatar, privateNotes }} metrics={playerMetrics} />}

      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
