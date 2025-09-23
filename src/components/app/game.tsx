
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
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { buildingData } from '@/lib/building-data';
import { Chats } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';
import { PlayerProfile, type ProfileData, type PlayerMetrics } from '@/components/app/profile';
import { Skeleton } from '../ui/skeleton';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


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
  uid: string;
  email: string;
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

export const getInitialUserData = (uid: string, email: string | null): UserData => {
  const largeNumber = 999_999_999_999;
  const allItemsInventory: InventoryItem[] = encyclopediaData.map(entry => ({
      item: entry.name,
      quantity: largeNumber,
      marketPrice: parseFloat(entry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0')
  }));
    
  return {
    uid,
    email: email || 'unknown',
    playerName: email?.split('@')[0] || 'Mchezaji Mpya',
    playerAvatar: `https://picsum.photos/seed/${uid}/100/100`,
    privateNotes: 'Karibu kwenye wasifu wangu! Mimi ni mtaalamu wa kuzalisha bidhaa bora.',
    money: largeNumber,
    stars: largeNumber,
    playerLevel: 1,
    playerXP: 0,
    inventory: allItemsInventory,
    marketListings: initialPlayerListings,
    companyData: initialCompanyData,
    bondListings: initialBondListings,
    buildingSlots: Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })),
    playerStocks: [],
    transactions: [],
    notifications: [],
  }
};


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
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const processedActivitiesRef = React.useRef<Set<string>>(new Set());
  
  // Auth state listener & data fetcher
  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            const docRef = doc(db, 'users', user.uid);
            const unsubscribeFirestore = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setGameState(doc.data() as UserData);
                } else {
                    const initialData = getInitialUserData(user.uid, user.email);
                    setDoc(docRef, initialData); // Create the document
                    setGameState(initialData); // Set state immediately
                }
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching user data:", error);
                setGameState(null);
                setIsLoading(false);
            });
             return () => unsubscribeFirestore();
        } else {
            // User is not logged in, stop loading and clear state
            setGameState(null);
            setIsLoading(false);
        }
    });
    return () => unsubscribeAuth();
  }, []);

  // Redirect if not logged in after loading
  React.useEffect(() => {
    if (!isLoading && !gameState) {
      router.push('/login');
    }
  }, [isLoading, gameState, router]);


  // Debounced save to Firestore
  const debouncedSave = useDebouncedCallback((newState: UserData) => {
    if(newState.uid) { 
      const docRef = doc(db, "users", newState.uid);
      setDoc(docRef, newState, { merge: true });
    }
  }, 1000);

  // Update state using a single function to ensure consistency and trigger save
  const updateState = (updater: (prevState: UserData) => UserData) => {
    setGameState(prevState => {
        if (!prevState) return null;
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
    if (!gameState) return;
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
        let newInventory = [...prev.inventory];
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
    if (!gameState) return;
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
        let newInventory = [...prev.inventory];
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
    if (!gameState) return;
    const buildingName = gameState?.buildingSlots[slotIndex]?.building?.name || 'Jengo';
    updateState(prev => {
        const newSlots = [...prev.buildingSlots];
        newSlots[slotIndex] = { building: null, level: 0 };
        return { ...prev, buildingSlots: newSlots };
    });
  };


  const handleStartProduction = (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => {
    if (!gameState) return;
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
        let newInventory = [...prev.inventory];
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
     if (!gameState) return;
     const inventoryItem = gameState.inventory.find(i => i.item === item.item);
     if (!inventoryItem || inventoryItem.quantity < quantity) {
       return;
     }

     const now = Date.now();
     const saleValue = quantity * price;

     updateState(prev => {
        let newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === item.item);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity -= quantity;
        }

        const newSlots = [...prev.buildingSlots];
        const slot = newSlots[slotIndex];
        if (slot && slot.building && !slot.activity) {
            newSlots[slotIndex] = {
                ...slot,
                activity: {
                    type: 'sell',
                    recipeId: item.item,
                    quantity,
                    saleValue,
                    startTime: now,
                    endTime: now + durationMs,
                }
            };
        }
        
        return {
            ...prev,
            inventory: newInventory.filter(i => i.quantity > 0),
            buildingSlots: newSlots,
        }
     });
    addNotification(`Umeanza kuuza ${quantity}x ${item.item}.`, 'sale');
  };

  const handleBoostConstruction = (slotIndex: number, starsToUse: number) => {
    if (!gameState || starsToUse <= 0 || gameState.stars < starsToUse) return;

    const timeReductionPerStar = 3 * 60 * 1000;
    const timeReduction = starsToUse * timeReductionPerStar;

    updateState(prev => {
        const newSlots = [...prev.buildingSlots];
        const slot = newSlots[slotIndex];
        if (slot && slot.construction) {
            slot.construction.endTime -= timeReduction;
        }
        return {
            ...prev,
            stars: prev.stars - starsToUse,
            buildingSlots: newSlots,
        };
    });
  };
  
    const handleBuyMaterial = (materialName: string, quantity: number): boolean => {
    if (!gameState) return false;

    const entry = encyclopediaData.find(e => e.name === materialName);
    const costPerUnit = entry ? parseFloat(entry.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : 0;
    if (costPerUnit === 0) return false;

    const totalCost = costPerUnit * quantity;
    if (gameState.money < totalCost) return false;

    updateState(prev => {
        let newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === materialName);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += quantity;
        } else {
            newInventory.push({ item: materialName, quantity, marketPrice: costPerUnit });
        }
        
        addTransaction('expense', totalCost, `Nunua ${quantity}x ${materialName}`);

        return {
            ...prev,
            money: prev.money - totalCost,
            inventory: newInventory,
        }
    });

    addNotification(`Umenunua ${quantity}x ${materialName} kwa $${totalCost.toFixed(2)}.`, 'purchase');
    return true;
  };

  const handleBuyFromMarket = (listing: PlayerListing, quantity: number) => {
    if (!gameState || quantity <= 0) return;

    const totalCost = listing.price * quantity;
    if (gameState.money < totalCost) return;

    updateState(prev => {
        // Remove listing from market (or reduce quantity if partial buy was allowed)
        const newMarketListings = prev.marketListings.filter(l => l.id !== listing.id);

        // Add item to player inventory
        const newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === listing.commodity);
        if (itemIndex !== -1) {
            newInventory[itemIndex].quantity += quantity;
        } else {
            const marketPrice = encyclopediaData.find(e => e.name === listing.commodity)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0';
            newInventory.push({ item: listing.commodity, quantity, marketPrice: parseFloat(marketPrice) });
        }
        
        addTransaction('expense', totalCost, `Nunua ${quantity}x ${listing.commodity} kutoka kwa ${listing.seller}`);

        return {
            ...prev,
            money: prev.money - totalCost,
            inventory: newInventory,
            marketListings: newMarketListings,
        };
    });
    
     addNotification(`Umenunua ${quantity}x ${listing.commodity} kutoka kwa ${listing.seller}.`, 'purchase');
  };
  
    const handleBuyStock = (stock: StockListing, quantity: number) => {
    if (!gameState || quantity <= 0) return;

    const totalCost = stock.stockPrice * quantity;
    if (gameState.money < totalCost) return;

    updateState(prev => {
        const newPlayerStocks = [...prev.playerStocks];
        const stockIndex = newPlayerStocks.findIndex(s => s.ticker === stock.ticker);

        if (stockIndex !== -1) {
            newPlayerStocks[stockIndex].shares += quantity;
        } else {
            newPlayerStocks.push({ ticker: stock.ticker, shares: quantity });
        }
        
        addTransaction('expense', totalCost, `Nunua hisa ${quantity}x ${stock.ticker}`);

        // This is a simplified model. In a real game, you'd update the available shares on the market.
        return {
            ...prev,
            money: prev.money - totalCost,
            playerStocks: newPlayerStocks,
        };
    });

    addNotification(`Umenunua hisa ${quantity}x ${stock.ticker}.`, 'purchase');
  };

  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
     if (!gameState || quantity <= 0 || quantity > item.quantity) return;

     updateState(prev => {
         // Remove from inventory
         const newInventory = [...prev.inventory];
         const itemIndex = newInventory.findIndex(i => i.item === item.item);
         newInventory[itemIndex].quantity -= quantity;

         // Add to market listings
         const newListing: PlayerListing = {
             id: Date.now(),
             commodity: item.item,
             seller: prev.playerName,
             quantity,
             price,
             avatar: prev.playerAvatar,
             quality: 0, // Placeholder
             imageHint: 'player avatar'
         };
         const newMarketListings = [newListing, ...prev.marketListings];
         
         return {
             ...prev,
             inventory: newInventory.filter(i => i.quantity > 0),
             marketListings: newMarketListings,
         }
     });

     addNotification(`${quantity}x ${item.item} imewekwa sokoni.`, 'sale');
  };


  // Game loop for processing finished activities
  React.useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
        const now = Date.now();
        let stateChanged = false;
        
        const newState: UserData = JSON.parse(JSON.stringify(gameState)); // Deep copy

        newState.buildingSlots.forEach((slot, index) => {
            const activityId = slot.activity ? `${index}-${slot.activity.startTime}` : null;
            const constructionId = slot.construction ? `${index}-${slot.construction.startTime}` : null;
            
            // Process construction
            if (slot.construction && now >= slot.construction.endTime && !processedActivitiesRef.current.has(constructionId!)) {
                addNotification(`Ujenzi wa ${slot.building?.name} Lvl ${slot.construction.targetLevel} umekamilika!`, 'construction');
                addXP(100 * slot.construction.targetLevel); // Grant XP for construction
                newState.buildingSlots[index] = { ...slot, level: slot.construction.targetLevel, construction: undefined };
                processedActivitiesRef.current.add(constructionId!);
                stateChanged = true;
            }

            // Process activities (production/sales)
            if (slot.activity && now >= slot.activity.endTime && !processedActivitiesRef.current.has(activityId!)) {
                if (slot.activity.type === 'produce') {
                    const { recipeId: itemName, quantity } = slot.activity;
                    
                    const itemIndex = newState.inventory.findIndex(i => i.item === itemName);
                    const marketPrice = encyclopediaData.find(e => e.name === itemName)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0';
                    
                    if (itemIndex !== -1) {
                        newState.inventory[itemIndex].quantity += quantity;
                    } else {
                        newState.inventory.push({ item: itemName, quantity, marketPrice: parseFloat(marketPrice) });
                    }
                    
                    addNotification(`Uzalishaji wa ${quantity}x ${itemName} umekamilika.`, 'production');
                    addXP(quantity * 2); // 2 XP per item produced

                } else if (slot.activity.type === 'sell') {
                    const { saleValue, quantity, recipeId: itemName } = slot.activity;
                    const marketTax = 0.05;
                    const profit = saleValue * (1 - marketTax);
                    
                    const newTransaction: Transaction = {
                      id: `${Date.now()}-${Math.random()}`, type: 'income',
                      amount: profit, description: `Mauzo ya ${quantity}x ${itemName}`, timestamp: Date.now(),
                    };
                    newState.transactions.unshift(newTransaction);
                    newState.money += profit;
                    
                    addNotification(`Umefanikiwa kuuza ${quantity}x ${itemName} kwa $${profit.toFixed(2)}.`, 'sale');
                    addXP(Math.floor(profit * 0.01));
                }
                
                newState.buildingSlots[index] = { ...slot, activity: undefined };
                processedActivitiesRef.current.add(activityId!); // Mark as processed
                stateChanged = true;
            }
        });

        if (stateChanged) {
           setGameState(newState);
           debouncedSave(newState);
        }

    }, 1000); // Run every second

    return () => clearInterval(interval);

  }, [gameState, debouncedSave]); 

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-700/50 bg-gray-900/95 px-4 backdrop-blur-sm sm:h-20">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-40" />
            <div className="flex-1"></div>
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </header>
        <main className="flex-1 p-4 sm:p-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: BUILDING_SLOTS }).map((_, i) => <Skeleton key={i} className="h-32 aspect-square" />)}
            </div>
        </main>
      </div>
    );
  }

  if (!gameState) {
     // This case is handled by the redirect effect.
     // We return null to prevent rendering the game with no data, which causes errors.
     return null;
  }

  const stockValue = gameState.playerStocks.reduce((total, stock) => {
    const stockInfo = gameState.companyData.find(s => s.ticker === stock.ticker);
    return total + (stockInfo ? stockInfo.stockPrice * stock.shares : 0);
  }, 0);

  const buildingValue = gameState.buildingSlots.reduce((total, slot) => {
      if (!slot.building) return total;
      const buildCost = buildingData[slot.building.id].buildCost;
      let cost = buildCost.reduce((sum, material) => {
          const price = encyclopediaData.find(e => e.name === material.name)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0';
          return sum + (parseFloat(price) * material.quantity);
      }, 0);
      // Add upgrade costs
      for (let i = 2; i <= slot.level; i++) {
        const upgradeCosts = buildingData[slot.building.id].upgradeCost(i);
        cost += upgradeCosts.reduce((sum, material) => {
             const price = encyclopediaData.find(e => e.name === material.name)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0';
             return sum + (parseFloat(price) * material.quantity);
        }, 0);
      }
      return total + cost;
  }, 0);
  
  const netWorth = gameState.money + stockValue + buildingValue;

  const profileMetrics: PlayerMetrics = {
    netWorth,
    buildingValue,
    stockValue,
    ranking: '1',
    rating: 'A+',
  };
  
  const currentProfile: ProfileData = {
      playerName: gameState.playerName,
      avatarUrl: gameState.playerAvatar,
      privateNotes: gameState.privateNotes,
  };
  
  const availableShares = (stock: StockListing): number => {
    // In a real multiplayer game, this would be calculated against what other players own.
    // For single-player, we can assume a portion is always available.
    return Math.floor(stock.totalShares * 0.4);
  };
  const stockListingsWithShares = gameState.companyData.map(s => ({...s, sharesAvailable: availableShares(s)}));


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
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
        );
      case 'inventory':
        return <Inventory inventoryItems={gameState.inventory} onPostToMarket={handlePostToMarket} />;
      case 'market':
        return <TradeMarket 
                    playerListings={gameState.marketListings} 
                    stockListings={stockListingsWithShares} 
                    bondListings={gameState.bondListings}
                    inventory={gameState.inventory} 
                    onBuyStock={handleBuyStock}
                    onBuyFromMarket={handleBuyFromMarket}
                    playerName={gameState.playerName}
                />;
      case 'encyclopedia':
        return <Encyclopedia />;
      case 'chats':
          return <Chats />;
      case 'accounting':
          return <Accounting transactions={gameState.transactions} />;
      case 'profile':
          return <PlayerProfile onSave={handleUpdateProfile} currentProfile={currentProfile} metrics={profileMetrics} />;
      default:
        return null;
    }
  };

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
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderView()}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}
