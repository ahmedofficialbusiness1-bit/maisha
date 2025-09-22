
'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
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
import { Skeleton } from '../ui/skeleton';


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
    icon: 'construction' | 'sale' | 'purchase' | 'dividend' | 'production' | 'level-up';
};


export type UserData = {
  playerName: string;
  playerAvatar: string;
  privateNotes: string;
  money: number;
  stars: number;
  playerLevel: number;
  playerXP: number;
  inventory: InventoryItem[];
  marketListings: PlayerListing[];
  companyData: StockListing[];
  bondListings: BondListing[];
  buildingSlots: BuildingSlot[];
  playerStocks: PlayerStock[];
  transactions: Transaction[];
  notifications: Notification[];
};

const initialPlayerListings: PlayerListing[] = [
    { id: 1, commodity: 'Maji', seller: 'Flexy suyo', quantity: 450, price: 0.10, avatar: 'https://picsum.photos/seed/flexy/40/40', quality: 1, imageHint: 'player avatar' },
    { id: 2, commodity: 'Yai', seller: 'MKG CIE', quantity: 100, price: 1.50, avatar: 'https://picsum.photos/seed/mkg/40/40', quality: 0, imageHint: 'company logo' },
];

const initialCompanyData: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, totalShares: 250000, marketCap: 450.75 * 250000, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo', creditRating: 'AA+', dailyRevenue: 100000, dividendYield: 0.015 },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, totalShares: 1000000, marketCap: 120.50 * 1000000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo', creditRating: 'A-', dailyRevenue: 150000, dividendYield: 0.015 },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
];

const AI_PLAYER_NAME = 'Serekali';

const getInitialUserData = (): UserData => ({
    playerName: 'Mchezaji Mpya',
    playerAvatar: `https://picsum.photos/seed/player/100/100`,
    privateNotes: 'Karibu kwenye wasifu wangu! Mimi ni mtaalamu wa kuzalisha bidhaa bora.',
    money: 10000,
    stars: 5,
    playerLevel: 1,
    playerXP: 0,
    inventory: [
      { item: 'Maji', quantity: 10000, marketPrice: 0.05 },
      { item: 'Umeme', quantity: 10000, marketPrice: 0.15 },
      { item: 'Mbegu', quantity: 10000, marketPrice: 0.70 },
      { item: 'Mbao', quantity: 2000, marketPrice: 1.15 },
      { item: 'Matofali', quantity: 2000, marketPrice: 2.16 },
      { item: 'Nondo', quantity: 2000, marketPrice: 2.46 },
      { item: 'Zege', quantity: 2000, marketPrice: 1.44 },
      { item: 'Mabati', quantity: 2000, marketPrice: 2.07 },
      { item: 'Saruji', quantity: 2000, marketPrice: 0.75 },
      { item: 'Chuma', quantity: 2000, marketPrice: 2.07 },
      { item: 'Mchanga', quantity: 2000, marketPrice: 0.12 },
      { item: 'Mawe', quantity: 2000, marketPrice: 0.20 },
      { item: 'Kokoto', quantity: 2000, marketPrice: 0.23 },
    ],
    marketListings: initialPlayerListings, // These could be global or also user-specific
    companyData: initialCompanyData,
    bondListings: initialBondListings,
    buildingSlots: Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })),
    playerStocks: [],
    transactions: [],
    notifications: [],
});


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
  const [isLoading, setIsLoading] = React.useState(true);
  const [gameState, setGameState] = React.useState<UserData>(getInitialUserData());

  const processedActivitiesRef = React.useRef<Set<string>>(new Set());
  
  // Load game state from localStorage
  React.useEffect(() => {
    const savedState = localStorage.getItem('maisha-game-state');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
    setIsLoading(false);
  }, []);

  // Save game state to localStorage with debounce
  const debouncedSave = useDebouncedCallback((newState: UserData) => {
    localStorage.setItem('maisha-game-state', JSON.stringify(newState));
  }, 1000);

  // Update state using a single function to ensure consistency and trigger save
  const updateState = (updater: (prevState: UserData) => UserData) => {
    setGameState(prevState => {
        const newState = updater(prevState);
        debouncedSave(newState);
        return newState;
    });
  };

  const getXpForNextLevel = (level: number) => {
    return level * 1000;
  };

  const addXP = (amount: number) => {
    updateState(prev => {
        let newXP = prev.playerXP + amount;
        let newLevel = prev.playerLevel;
        let xpForNextLevel = getXpForNextLevel(newLevel);
        
        while (newXP >= xpForNextLevel) {
            newXP -= xpForNextLevel;
            newLevel++;
            addNotification(`Hongera! Umefikia Level ${newLevel}!`, 'level-up');
            xpForNextLevel = getXpForNextLevel(newLevel);
        }

        return { ...prev, playerXP: newXP, playerLevel: newLevel };
    });
  };

  const addNotification = (message: string, icon: Notification['icon']) => {
    const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        timestamp: Date.now(),
        read: false,
        icon,
    };
    updateState(prev => ({
        ...prev,
        notifications: [newNotification, ...prev.notifications].slice(0, 50)
    }));
  };

  const handleMarkNotificationsRead = () => {
    updateState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  }

  const handleUpdateProfile = (data: ProfileData) => {
    updateState(prev => ({
        ...prev,
        playerName: data.playerName,
        playerAvatar: data.avatarUrl || prev.playerAvatar,
        privateNotes: data.privateNotes || ''
    }));
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
    updateState(prev => ({
        ...prev,
        transactions: [newTransaction, ...prev.transactions]
    }));

    // Grant XP for income
    if (type === 'income') {
        addXP(Math.floor(amount * 0.01)); // 1 XP for every $100 earned
    }
  };

  const handleBuild = (slotIndex: number, building: BuildingType) => {
    const costs = buildingData[building.id]?.buildCost;
    if (!costs) return;
    
    for (const cost of costs) {
        const inventoryItem = gameState.inventory.find(i => i.item === cost.name);
        if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
            return;
        }
    }

    const now = Date.now();
    const constructionTimeMs = 15 * 60 * 1000;

    updateState(prev => {
        const newInventory = [...prev.inventory];
        for (const cost of costs) {
            const itemIndex = newInventory.findIndex(i => i.item === cost.name);
            if (itemIndex > -1) {
            newInventory[itemIndex].quantity -= cost.quantity;
            }
        }
        
        const newSlots = [...prev.buildingSlots];
        newSlots[slotIndex] = { 
            building, 
            level: 0,
            construction: {
                startTime: now,
                endTime: now + constructionTimeMs,
                targetLevel: 1
            }
        };

        return { 
            ...prev, 
            inventory: newInventory.filter(item => item.quantity > 0),
            buildingSlots: newSlots 
        };
    });

    addNotification(`Ujenzi wa ${building.name} umeanza.`, 'construction');
  };
  
    const handleUpgradeBuilding = (slotIndex: number) => {
    const slot = gameState.buildingSlots[slotIndex];
    if (!slot || !slot.building) return;

    const costs = buildingData[slot.building.id].upgradeCost(slot.level + 1);

    for (const cost of costs) {
      const inventoryItem = gameState.inventory.find(i => i.item === cost.name);
      if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
        return;
      }
    }

    const now = Date.now();
    const constructionTimeMs = (15 * 60 * 1000) * Math.pow(2, slot.level);

    updateState(prev => {
        const newInventory = [...prev.inventory];
        for (const cost of costs) {
            const itemIndex = newInventory.findIndex(i => i.item === cost.name);
            if (itemIndex > -1) {
            newInventory[itemIndex].quantity -= cost.quantity;
            }
        }
        
        const newSlots = [...prev.buildingSlots];
        newSlots[slotIndex] = {
            ...slot,
            construction: {
            startTime: now,
            endTime: now + constructionTimeMs,
            targetLevel: slot.level + 1
            }
        };

        return { 
            ...prev,
            inventory: newInventory.filter(item => item.quantity > 0),
            buildingSlots: newSlots
        };
    });

    addNotification(`Uboreshaji wa ${slot.building.name} hadi Lvl ${slot.level + 1} umeanza.`, 'construction');
  };

  const handleDemolishBuilding = (slotIndex: number) => {
    const buildingName = gameState?.buildingSlots[slotIndex]?.building?.name || 'Jengo';
    updateState(prev => {
        const newSlots = [...prev.buildingSlots];
        newSlots[slotIndex] = { building: null, level: 0 };
        return { ...prev, buildingSlots: newSlots };
    });
  };


  const handleStartProduction = (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => {
    const inputs = recipe.inputs || [];
    
    for (const input of inputs) {
        const inventoryItem = gameState.inventory.find(i => i.item === input.name);
        const requiredQuantity = input.quantity * quantity;

        if (!inventoryItem || inventoryItem.quantity < requiredQuantity) {
            return;
        }
    }
    
     const now = Date.now();
 
     updateState(prev => {
        const newInventory = [...prev.inventory];
        for (const input of inputs) {
            const itemIndex = newInventory.findIndex(i => i.item === input.name);
            const requiredQuantity = input.quantity * quantity;
            if (itemIndex > -1) {
            newInventory[itemIndex].quantity -= requiredQuantity;
            }
        }

        const newSlots = [...prev.buildingSlots];
        const slot = newSlots[slotIndex];
        if (slot && slot.building && !slot.activity) {
            newSlots[slotIndex] = {
            ...slot,
            activity: {
                type: 'produce',
                recipeId: recipe.output.name,
                quantity: recipe.output.quantity * quantity,
                saleValue: 0,
                startTime: now,
                endTime: now + durationMs,
            }
            };
        }
        
        return {
            ...prev,
            inventory: newInventory.filter(item => item.quantity > 0),
            buildingSlots: newSlots,
        }
     });

    addNotification(`Umeanza kuzalisha ${recipe.output.quantity * quantity}x ${recipe.output.name}.`, 'production');
  };

  const handleStartSelling = (slotIndex: number, item: InventoryItem, quantity: number, price: number, durationMs: number) => {
     const inventoryItem = gameState.inventory.find(i => i.item === item.item);
     if (!inventoryItem || inventoryItem.quantity < quantity) {
       return;
     }
 
     const now = Date.now();
     const totalSaleValue = quantity * price;
 
     updateState(prev => {
        const newInventory = prev.inventory.map(invItem => {
            if (invItem.item === item.item) {
                return { ...invItem, quantity: invItem.quantity - quantity };
            }
            return invItem;
        }).filter(invItem => invItem.quantity > 0);

        const newSlots = [...prev.buildingSlots];
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
        
        return {
            ...prev,
            inventory: newInventory,
            buildingSlots: newSlots,
        }
     });

    addNotification(`Unaanza kuuza ${quantity.toLocaleString()}x ${item.item}.`, 'sale');
  }

  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
    updateState(prev => {
        const newInventory = prev.inventory.map(invItem =>
            invItem.item === item.item
            ? { ...invItem, quantity: invItem.quantity - quantity }
            : invItem
        ).filter(item => item.quantity > 0);

        const newListing: PlayerListing = {
            id: prev.marketListings.length + Date.now(),
            commodity: item.item,
            seller: prev.playerName,
            quantity,
            price,
            avatar: prev.playerAvatar,
            quality: 5,
            imageHint: 'player avatar'
        };

        return {
            ...prev,
            inventory: newInventory,
            marketListings: [newListing, ...prev.marketListings]
        }
    });

    addNotification(`Umeweka ${quantity.toLocaleString()}x ${item.item} sokoni.`, 'sale');
  };
  
  const handleBoostConstruction = (slotIndex: number, starsToUse: number) => {
      if (gameState.stars < starsToUse) return;
      
      const timeReductionPerStar = 3 * 60 * 1000;
      const timeReduction = starsToUse * timeReductionPerStar;

      updateState(prev => {
          const newSlots = [...prev.buildingSlots];
          const slot = newSlots[slotIndex];
          if (slot?.construction) {
              slot.construction.endTime -= timeReduction;
          }
          return { ...prev, stars: prev.stars - starsToUse, buildingSlots: newSlots };
      });
  };

 const handleBuyMaterial = (materialName: string, quantityToBuy: number): boolean => {
    const listingsForMaterial = gameState.marketListings
      .filter(l => l.commodity === materialName)
      .sort((a, b) => a.price - b.price);

    if (listingsForMaterial.length === 0) return false;

    let quantityLeftToBuy = quantityToBuy;
    let totalCost = 0;
    const purchases: { from: PlayerListing, quantity: number }[] = [];

    for (const listing of listingsForMaterial) {
        if (quantityLeftToBuy <= 0) break;
        const quantityToBuyFromThisSeller = Math.min(listing.quantity, quantityLeftToBuy);
        purchases.push({ from: listing, quantity: quantityToBuyFromThisSeller });
        totalCost += quantityToBuyFromThisSeller * listing.price;
        quantityLeftToBuy -= quantityToBuyFromThisSeller;
    }

    if (quantityLeftToBuy > 0) return false;
    if (gameState.money < totalCost) return false;

    updateState(prev => {
        const newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === materialName);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += quantityToBuy;
        } else {
            const encyclopediaEntry = encyclopediaData.find(e => e.name === materialName);
            newInventory.push({ item: materialName, quantity: quantityToBuy, marketPrice: encyclopediaEntry?.properties.find(p => p.label.includes("Market Cost"))?.value ? parseFloat(encyclopediaEntry.properties.find(p => p.label.includes("Market Cost"))!.value.replace('$', '')) : 0 });
        }
        
        let newMarketListings = [...prev.marketListings];
        purchases.forEach(purchase => {
            if (purchase.from.seller === AI_PLAYER_NAME) return;
            const listingIndex = newMarketListings.findIndex(l => l.id === purchase.from.id);
            if (listingIndex > -1) {
                newMarketListings[listingIndex].quantity -= purchase.quantity;
            }
        });

        addTransaction('expense', totalCost, `Bought ${quantityToBuy.toLocaleString()}x ${materialName} from market`);

        return {
            ...prev,
            money: prev.money - totalCost,
            inventory: newInventory,
            marketListings: newMarketListings.filter(l => l.quantity > 0)
        };
    });

    addNotification(`Umenunua ${quantityToBuy.toLocaleString()}x ${materialName} kwa $${totalCost.toLocaleString()}.`, 'purchase');
    return true;
};

    const calculateAvailableShares = (stock: StockListing) => {
        const ownedByPlayers = gameState.playerStocks
            .filter(ps => ps.ticker === stock.ticker)
            .reduce((sum, ps) => sum + ps.shares, 0);
        const maxSellable = Math.floor(stock.totalShares * 0.70);
        return Math.max(0, maxSellable - ownedByPlayers);
    }

  const handleBuyStock = (stock: StockListing, quantity: number) => {
      const totalCost = stock.stockPrice * quantity;
      if (gameState.money < totalCost) return;

      const availableShares = calculateAvailableShares(stock);
      if (quantity > availableShares) return;

      updateState(prev => {
        addTransaction('expense', totalCost, `Bought ${quantity.toLocaleString()} shares of ${stock.ticker}`);
        
        const existingStock = prev.playerStocks.find(s => s.ticker === stock.ticker);
        let newPlayerStocks: PlayerStock[];
        if (existingStock) {
            newPlayerStocks = prev.playerStocks.map(s => s.ticker === stock.ticker ? { ...s, shares: s.shares + quantity } : s);
        } else {
            newPlayerStocks = [...prev.playerStocks, { ticker: stock.ticker, shares: quantity }];
        }

        return { ...prev, money: prev.money - totalCost, playerStocks: newPlayerStocks };
      });

      addNotification(`Umenunua hisa ${quantity.toLocaleString()} za ${stock.companyName}.`, 'purchase');
  }

  const handleBuyFromMarket = (listing: PlayerListing, quantity: number) => {
    if (listing.seller === gameState.playerName) return;

    const totalCost = listing.price * quantity;
    if (gameState.money < totalCost) return;

    updateState(prev => {
        addTransaction('expense', totalCost, `Bought ${quantity.toLocaleString()}x ${listing.commodity} from market`);

        const newInventory = [...prev.inventory];
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
        
        let newMarketListings = prev.marketListings;
        if (listing.seller !== AI_PLAYER_NAME) {
            newMarketListings = prev.marketListings.map(l => 
                l.id === listing.id ? { ...l, quantity: l.quantity - quantity } : l
            ).filter(l => l.quantity > 0);
        }
        
        return {
            ...prev,
            money: prev.money - totalCost,
            inventory: newInventory,
            marketListings: newMarketListings
        };
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
      .filter(listing => listing.price > 0);

    updateState(prev => ({
        ...prev,
        marketListings: [
            ...prev.marketListings.filter(p => p.seller !== AI_PLAYER_NAME),
            ...aiListings,
        ]
    }));
  // This effect should run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   React.useEffect(() => {
    const interval = setInterval(() => {
        const now = Date.now();
        let changed = false;
        const newState = { ...gameState };

        const updatedSlots = newState.buildingSlots.map((slot, index) => {
            if (slot && slot.activity && now >= slot.activity.endTime) {
                const activityId = `${index}-${slot.activity.startTime}`;
                if (!processedActivitiesRef.current.has(activityId)) {
                    changed = true;
                    processedActivitiesRef.current.add(activityId);
                    const { type, recipeId: itemName, quantity: totalQuantity, saleValue } = slot.activity;

                    if (type === 'sell' && saleValue > 0) {
                        newState.money += saleValue;
                        addTransaction('income', saleValue, `Sold ${totalQuantity.toLocaleString()}x ${itemName}`);
                        addNotification(`Umepokea $${saleValue.toLocaleString()} kwa kuuza ${totalQuantity.toLocaleString()}x ${itemName}.`, 'sale');
                    } else if (type === 'produce') {
                        const itemIndex = newState.inventory.findIndex(i => i.item === itemName);
                        if (itemIndex > -1) {
                            newState.inventory[itemIndex].quantity += totalQuantity;
                        } else {
                            const productInfo = encyclopediaData.find(e => e.name === itemName);
                            const price = productInfo ? parseFloat(productInfo.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : 0;
                            newState.inventory.push({ item: itemName, quantity: totalQuantity, marketPrice: price });
                        }
                        const productInfo = encyclopediaData.find(e => e.name === itemName);
                        const xpGain = parseFloat(productInfo?.properties.find(p => p.label === "XP Gained")?.value || '0');
                        addXP(xpGain * (totalQuantity / (productInfo?.recipe?.inputs[0]?.quantity || 1)));

                        addNotification(`Uzalishaji wa ${totalQuantity.toLocaleString()}x ${itemName} umekamilika.`, 'production');
                    }
                    return { ...slot, activity: undefined };
                }
            }
            if (slot && slot.construction && now >= slot.construction.endTime) {
                changed = true;
                addXP(100 * slot.construction.targetLevel); // XP for construction/upgrade
                addNotification(`Ujenzi wa ${slot.building?.name} Lvl ${slot.construction.targetLevel} umekamilika!`, 'construction');
                return { ...slot, level: slot.construction.targetLevel, construction: undefined };
            }
            return slot;
        });

        if (changed) {
            updateState(prev => ({...prev, buildingSlots: updatedSlots, money: newState.money, inventory: newState.inventory }));
        }
    }, 1000);

    const dividendInterval = setInterval(() => {
        let totalDividends = 0;
        const dividendMessages: string[] = [];

        gameState.playerStocks.forEach(playerStock => {
            const company = gameState.companyData.find(c => c.ticker === playerStock.ticker);
            if (company && playerStock.shares > 0) {
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
            updateState(prev => ({...prev, money: prev.money + totalDividends}));
            addTransaction('income', totalDividends, `Dividend Payout (${dividendMessages.join(', ')})`);
            addNotification(`Umepokea $${totalDividends.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} kama gawio la hisa.`, 'dividend');
        }
    }, 24 * 60 * 60000);

    const marketFluctuationInterval = setInterval(() => {
        updateState(prev => {
            const newCompanyData = prev.companyData.map(company => {
                const priceChangePercent = (Math.random() - 0.49) * 0.05;
                const revenueChangePercent = (Math.random() - 0.45) * 0.1;
                
                const newPrice = Math.max(1, company.stockPrice * (1 + priceChangePercent));
                const newRevenue = Math.max(1000, company.dailyRevenue * (1 + revenueChangePercent));
                const newMarketCap = newPrice * company.totalShares;

                return { ...company, stockPrice: newPrice, dailyRevenue: newRevenue, marketCap: newMarketCap };
            });
            return {...prev, companyData: newCompanyData };
        });
    }, 60 * 60000);


    return () => {
      clearInterval(interval);
      clearInterval(dividendInterval);
      clearInterval(marketFluctuationInterval);
    }
  }, [gameState]);


  const calculatePlayerMetrics = React.useCallback((): PlayerMetrics => {
    const inventoryValue = gameState.inventory.reduce((acc, item) => acc + (item.quantity * item.marketPrice), 0);
    const buildingValue = gameState.buildingSlots.reduce((acc, slot) => {
        if (slot.building) {
            const costs = buildingData[slot.building.id]?.buildCost;
            if (costs) {
                const buildCostValue = costs.reduce((costAcc, cost) => {
                    const itemPrice = encyclopediaData.find(e => e.name === cost.name)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || 0;
                    return costAcc + (cost.quantity * parseFloat(itemPrice.toString()));
                }, 0);
                return acc + (buildCostValue * Math.pow(1.5, slot.level));
            }
        }
        return acc;
    }, 0);
    
    const stockValue = gameState.playerStocks.reduce((acc, pStock) => {
        const stockInfo = gameState.companyData.find(c => c.ticker === pStock.ticker);
        return acc + (pStock.shares * (stockInfo?.stockPrice || 0));
    }, 0);

    const netWorth = gameState.money + inventoryValue + buildingValue;
    
    let rating = 'F';
    if (netWorth > 50_000_000) rating = 'A';
    else if (netWorth > 5_000_000) rating = 'B';
    else if (netWorth > 500_000) rating = 'C';
    else if (netWorth > 50_000) rating = 'D';

    const baseRanking = 50000;
    const rank = Math.max(1, Math.floor(baseRanking / (Math.log10(netWorth) || 1)));

    return { netWorth, ranking: `#${rank.toLocaleString()}`, rating, buildingValue, stockValue };
  }, [gameState]);
  
  const playerMetrics = calculatePlayerMetrics();

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 p-8 items-center justify-center">
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex-grow w-full grid grid-cols-5 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader 
        money={gameState.money} 
        stars={gameState.stars} 
        setView={setView} 
        playerName={gameState.playerName} 
        playerAvatar={gameState.playerAvatar} 
        notifications={gameState.notifications}
        onNotificationsRead={handleMarkNotificationsRead}
        playerLevel={gameState.playerLevel}
        playerXP={gameState.playerXP}
        xpForNextLevel={getXpForNextLevel(gameState.playerLevel)}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
        {view === 'dashboard' && (
          <Dashboard 
            buildingSlots={gameState.buildingSlots} 
            inventory={gameState.inventory}
            stars={gameState.stars}
            onBuild={handleBuild}
            onStartProduction={handleStartProduction}
            onStartSelling={handleStartSelling}
            onBoostConstruction={handleBoostConstruction}
            onUpgradeBuilding={handleUpgradeBuilding}
            onDemolishBuilding={handleDemolishBuilding}
            onBuyMaterial={handleBuyMaterial}
          />
        )}
        {view === 'inventory' && <Inventory inventoryItems={gameState.inventory} onPostToMarket={handlePostToMarket} />}
        {view === 'market' && (
          <TradeMarket 
            playerListings={gameState.marketListings} 
            stockListings={gameState.companyData.map(stock => ({
                ...stock,
                sharesAvailable: calculateAvailableShares(stock)
            }))}
            bondListings={gameState.bondListings}
            inventory={gameState.inventory} 
            onBuyStock={handleBuyStock}
            onBuyFromMarket={handleBuyFromMarket}
            playerName={gameState.playerName}
          />
        )}
        {view === 'chats' && <Chats />}
        {view === 'encyclopedia' && <Encyclopedia />}
        {view === 'accounting' && <Accounting transactions={gameState.transactions} />}
        {view === 'profile' && <PlayerProfile onSave={handleUpdateProfile} currentProfile={{ playerName: gameState.playerName, avatarUrl: gameState.playerAvatar, privateNotes: gameState.privateNotes }} metrics={playerMetrics} />}

      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}

    
