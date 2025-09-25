
'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot, type BuildingType } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import type { Recipe } from '@/lib/recipe-data';
import { recipes } from '@/lib/recipe-data';
import { buildingData } from '@/lib/building-data';
import { Chats } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';
import { PlayerProfile, type ProfileData, type PlayerMetrics } from '@/components/app/profile';
import { Leaderboard } from '@/components/app/leaderboard';
import { AdminPanel } from '@/components/app/admin-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, setDoc, onSnapshot, serverTimestamp, updateDoc, collection, query, runTransaction, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type AuthenticatedUser = {
    uid: string;
    username: string;
    email: string | null;
}

const BUILDING_SLOTS = 20;
const ADMIN_EMAIL = 'ahmedofficialbusiness1@gmail.com';

export type PlayerStock = {
    ticker: string;
    shares: number;
}

export type View = 'dashboard' | 'inventory' | 'market' | 'chats' | 'encyclopedia' | 'accounting' | 'profile' | 'leaderboard' | 'admin';

export type Notification = {
    id: string;
    message: string;
    timestamp: number;
    read: boolean;
    icon: 'construction' | 'sale' | 'purchase' | 'dividend' | 'production' | 'level-up';
};


export type UserData = {
  uid: string;
  username: string;
  email: string | null;
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
  status: 'online' | 'offline';
  lastSeen: any; // Firestore ServerTimestamp
  netWorth: number;
  role: 'player' | 'admin';
};


const initialCompanyData: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, totalShares: 250000, marketCap: 450.75 * 250000, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo', creditRating: 'AA+', dailyRevenue: 100000, dividendYield: 0.015 },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, totalShares: 1000000, marketCap: 120.50 * 1000000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo', creditRating: 'A-', dailyRevenue: 150000, dividendYield: 0.015 },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
];

export const getInitialUserData = (user: AuthenticatedUser): UserData => {
  const startingMoney = 100000;
  const initialItems: InventoryItem[] = [
    { item: 'Mbao', quantity: 5000, marketPrice: calculatedPrices['Mbao'] || 1.15 },
    { item: 'Matofali', quantity: 10000, marketPrice: calculatedPrices['Matofali'] || 2.13 },
  ];
    
  return {
    uid: user.uid,
    username: user.username,
    email: user.email,
    privateNotes: `Karibu kwenye wasifu wangu! Mimi ni ${user.username}, mtaalamu wa kuzalisha bidhaa bora.`,
    money: startingMoney,
    stars: 100,
    playerLevel: 1,
    playerXP: 0,
    inventory: initialItems,
    marketListings: [],
    companyData: initialCompanyData,
    bondListings: initialBondListings,
    buildingSlots: Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })),
    playerStocks: [],
    transactions: [],
    notifications: [],
    status: 'online',
    lastSeen: serverTimestamp(),
    netWorth: startingMoney,
    role: user.email === ADMIN_EMAIL ? 'admin' : 'player',
  }
};

const calculatedPrices = encyclopediaData.reduce((acc, item) => {
    const priceString = item.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '');
    if (priceString) {
        acc[item.name] = parseFloat(priceString);
    }
    return acc;
}, {} as Record<string, number>);


export function Game({ user }: { user: AuthenticatedUser }) {
  const [view, setView] = React.useState<View>('dashboard');
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [allMarketListings, setAllMarketListings] = React.useState<PlayerListing[]>([]);
  const { toast } = useToast();

  // Effect for fetching ALL market listings for a true multiplayer market
  React.useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const listings: PlayerListing[] = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data() as UserData;
            if (userData.marketListings && userData.marketListings.length > 0) {
                const userListings = userData.marketListings.map(listing => ({
                    ...listing,
                    sellerUid: userData.uid 
                }));
                listings.push(...userListings);
            }
        });
        setAllMarketListings(listings);
    });

    return () => unsubscribe();
  }, []);

  // Main effect to load user data from Firestore
  React.useEffect(() => {
    if (!user?.uid) {
        setIsLoading(false);
        return;
    };

    const docRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        const mergedData: UserData = { ...getInitialUserData(user), ...data };
        
        // Ensure essential fields are not undefined before setting state
        if (mergedData.netWorth === undefined || mergedData.role === undefined || mergedData.email === undefined || mergedData.marketListings === undefined) {
             await updateDoc(docRef, { 
                netWorth: mergedData.netWorth ?? 0,
                role: mergedData.role ?? 'player',
                email: mergedData.email ?? user.email,
                marketListings: mergedData.marketListings ?? []
            });
        }
        
        setGameState(mergedData);
        await updateDoc(docRef, { status: 'online', lastSeen: serverTimestamp() });

      } else {
        const initialData = getInitialUserData(user);
        await setDoc(docRef, initialData);
        setGameState(initialData);
      }
      setIsLoading(false);
    });
    
    const handleBeforeUnload = () => {
        updateDoc(docRef, { status: 'offline', lastSeen: serverTimestamp() });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        unsubscribe();
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (user?.uid) handleBeforeUnload();
    };
  }, [user]);

  // Debounced save to Firestore
  const debouncedSave = useDebouncedCallback((newState: UserData) => {
    if(newState.uid) { 
      const docRef = doc(db, "users", newState.uid);
      setDoc(docRef, newState, { merge: true });
    }
  }, 1000);
  
  // Single update function to manage state and trigger saves
  const updateState = React.useCallback((updater: (prevState: UserData) => Partial<UserData>) => {
    setGameState(prevState => {
        if (!prevState) return null;
        const updates = updater(prevState);
        const newState = { ...prevState, ...updates };
        debouncedSave(newState);
        return newState;
    });
  }, [debouncedSave]);

  const getXpForNextLevel = (level: number) => {
    return level * 1000;
  };
  
  const addNotification = React.useCallback((message: string, icon: Notification['icon']) => {
    const newNotification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        timestamp: Date.now(),
        read: false,
        icon,
    };
    updateState(prev => ({
        notifications: [newNotification, ...prev.notifications].slice(0, 50)
    }));
  }, [updateState]);

  const addXP = React.useCallback((amount: number) => {
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
        return { playerXP: newXP, playerLevel: newLevel };
    });
  }, [updateState, addNotification]);

  const addTransaction = React.useCallback((type: 'income' | 'expense', amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      amount,
      description,
      timestamp: Date.now(),
    };
    updateState(prev => ({
        transactions: [newTransaction, ...prev.transactions]
    }));
    if (type === 'income') {
        addXP(Math.floor(amount * 0.01));
    }
  }, [updateState, addXP]);

  const handleMarkNotificationsRead = () => {
    updateState(prev => ({
        notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  }

  const handleUpdateProfile = (data: ProfileData) => {
    updateState(prev => ({
        username: data.playerName,
        privateNotes: data.privateNotes || ''
    }));
    setView('dashboard');
  }

  const handleBuild = (slotIndex: number, building: BuildingType) => {
    if (!gameState) return;
    const costs = buildingData[building.id]?.buildCost;
    if (!costs) return;

    for (const cost of costs) {
      const inventoryItem = gameState.inventory.find(i => i.item === cost.name);
      if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
        addNotification(`Huna vifaa vya kutosha kujenga ${building.name}.`, 'construction');
        return;
      }
    }

    const now = Date.now();
    const constructionTimeMs = 15 * 60 * 1000;

    updateState(prev => {
      let newInventory = [...prev.inventory];
      for (const cost of costs) {
        const itemIndex = newInventory.findIndex(i => i.item === cost.name);
        newInventory[itemIndex] = { ...newInventory[itemIndex], quantity: newInventory[itemIndex].quantity - cost.quantity };
      }

      const newSlots = [...prev.buildingSlots];
      newSlots[slotIndex] = {
        building,
        level: 0,
        construction: { startTime: now, endTime: now + constructionTimeMs, targetLevel: 1 },
      };

      return { inventory: newInventory.filter(item => item.quantity > 0), buildingSlots: newSlots };
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
        addNotification(`Huna vifaa vya kutosha kuboresha ${slot.building.name}.`, 'construction');
        return;
      }
    }

    const now = Date.now();
    const constructionTimeMs = (15 * 60 * 1000) * Math.pow(2, slot.level);

    updateState(prev => {
      let newInventory = [...prev.inventory];
      for (const cost of costs) {
        const itemIndex = newInventory.findIndex(i => i.item === cost.name);
        newInventory[itemIndex] = { ...newInventory[itemIndex], quantity: newInventory[itemIndex].quantity - cost.quantity };
      }

      const newSlots = [...prev.buildingSlots];
      newSlots[slotIndex] = {
        ...slot,
        construction: { startTime: now, endTime: now + constructionTimeMs, targetLevel: slot.level + 1 },
      };

      return { inventory: newInventory.filter(item => item.quantity > 0), buildingSlots: newSlots };
    });
    addNotification(`Uboreshaji wa ${slot.building.name} hadi Lvl ${slot.level + 1} umeanza.`, 'construction');
  };

  const handleDemolishBuilding = (slotIndex: number) => {
    updateState(prev => {
        const newSlots = [...prev.buildingSlots];
        newSlots[slotIndex] = { building: null, level: 0 };
        return { buildingSlots: newSlots };
    });
  };

  const handleStartProduction = (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => {
     updateState(prev => {
        let newInventory = [...prev.inventory];
        for (const input of (recipe.inputs || [])) {
            const itemIndex = newInventory.findIndex(i => i.item === input.name);
            newInventory[itemIndex].quantity -= input.quantity * quantity;
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
                startTime: Date.now(),
                endTime: Date.now() + durationMs,
            }
            };
        }
        
        return {
            inventory: newInventory.filter(item => item.quantity > 0),
            buildingSlots: newSlots,
        }
     });
    addNotification(`Umeanza kuzalisha ${recipe.output.quantity * quantity}x ${recipe.output.name}.`, 'production');
  };

  const handleStartSelling = (slotIndex: number, item: InventoryItem, quantity: number, price: number, durationMs: number) => {
     updateState(prev => {
        let newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === item.item);
        newInventory[itemIndex].quantity -= quantity;

        const newSlots = [...prev.buildingSlots];
        const slot = newSlots[slotIndex];
        if (slot && slot.building && !slot.activity) {
            newSlots[slotIndex] = {
                ...slot,
                activity: {
                    type: 'sell',
                    recipeId: item.item,
                    quantity,
                    saleValue: quantity * price,
                    startTime: Date.now(),
                    endTime: Date.now() + durationMs,
                }
            };
        }
        
        return {
            inventory: newInventory.filter(i => i.quantity > 0),
            buildingSlots: newSlots,
        }
     });
    addNotification(`Umeanza kuuza ${quantity}x ${item.item}.`, 'sale');
  };

  const handleBoostConstruction = (slotIndex: number, starsToUse: number) => {
    if (!gameState || starsToUse <= 0 || gameState.stars < starsToUse) return;
    const timeReduction = starsToUse * 3 * 60 * 1000;
    updateState(prev => {
        const newSlots = [...prev.buildingSlots];
        const slot = newSlots[slotIndex];
        if (slot && slot.construction) {
            slot.construction.endTime -= timeReduction;
        }
        return { stars: prev.stars - starsToUse, buildingSlots: newSlots };
    });
  };
  
  const handleBuyMaterial = (materialName: string, quantity: number): boolean => {
    if (!gameState) return false;
    const costPerUnit = calculatedPrices[materialName] || 0;
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
        return { money: prev.money - totalCost, inventory: newInventory };
    });

    addNotification(`Umenunua ${quantity}x ${materialName} kwa $${totalCost.toFixed(2)}.`, 'purchase');
    return true;
  };

  const handleBuyFromMarket = async (listing: PlayerListing, quantityToBuy: number) => {
    if (!gameState || !listing.sellerUid || quantityToBuy <= 0) return;
    if (listing.sellerUid === gameState.uid) return;

    const totalCost = listing.price * quantityToBuy;
    if (gameState.money < totalCost) {
        addNotification('Huna pesa za kutosha kununua bidhaa hii.', 'purchase');
        return;
    }

    try {
        await runTransaction(db, async (transaction) => {
            const buyerDocRef = doc(db, 'users', gameState.uid);
            const sellerDocRef = doc(db, 'users', listing.sellerUid!);

            const [buyerDoc, sellerDoc] = await Promise.all([transaction.get(buyerDocRef), transaction.get(sellerDocRef)]);

            if (!buyerDoc.exists() || !sellerDoc.exists()) throw new Error("Mchezaji hayupo!");

            const buyerData = buyerDoc.data() as UserData;
            const sellerData = sellerDoc.data() as UserData;
            
            const sellerListingIndex = sellerData.marketListings.findIndex(l => l.id === listing.id);
            if (sellerListingIndex === -1) throw new Error("Bidhaa hii haipo tena sokoni.");
            
            const actualListing = sellerData.marketListings[sellerListingIndex];
            if (actualListing.quantity < quantityToBuy) throw new Error(`Kuna ${actualListing.quantity} pekee zinazopatikana.`);

            if (buyerData.money < totalCost) throw new Error("Huna pesa za kutosha.");

            // Buyer updates
            const newBuyerInventory = [...buyerData.inventory];
            const itemIndex = newBuyerInventory.findIndex(i => i.item === listing.commodity);
            if (itemIndex > -1) {
                newBuyerInventory[itemIndex].quantity += quantityToBuy;
            } else {
                 newBuyerInventory.push({ item: listing.commodity, quantity: quantityToBuy, marketPrice: calculatedPrices[listing.commodity] || 0 });
            }
            const newBuyerTransaction: Transaction = { id: `${Date.now()}-buy`, type: 'expense', amount: totalCost, description: `Nunua ${quantityToBuy}x ${listing.commodity} kutoka kwa ${listing.seller}`, timestamp: Date.now() };

            // Seller updates
            const profit = totalCost * (1 - 0.05);
            let newSellerMarketListings = [...sellerData.marketListings];
            if (actualListing.quantity === quantityToBuy) {
                newSellerMarketListings.splice(sellerListingIndex, 1);
            } else {
                newSellerMarketListings[sellerListingIndex].quantity -= quantityToBuy;
            }
            
            const newSellerTransaction: Transaction = { id: `${Date.now()}-sell`, type: 'income', amount: profit, description: `Mauzo ya ${quantityToBuy}x ${listing.commodity} kwa ${buyerData.username}`, timestamp: Date.now() };
            const sellerNotification: Notification = { id: `${Date.now()}-sell-notify`, message: `Umefanikiwa kuuza ${quantityToBuy}x ${listing.commodity} kwa $${profit.toFixed(2)} kwa ${buyerData.username}.`, timestamp: Date.now(), read: false, icon: 'sale' };
            
            transaction.update(buyerDocRef, { money: buyerData.money - totalCost, inventory: newBuyerInventory, transactions: [newBuyerTransaction, ...buyerData.transactions] });
            transaction.update(sellerDocRef, { money: sellerData.money + profit, marketListings: newSellerMarketListings, transactions: [newSellerTransaction, ...sellerData.transactions], notifications: [sellerNotification, ...sellerData.notifications] });
        });
        addNotification(`Umenunua ${quantityToBuy}x ${listing.commodity} kutoka kwa ${listing.seller}.`, 'purchase');
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Ununuzi haujafanikiwa', description: e.message });
    }
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
        return { money: prev.money - totalCost, playerStocks: newPlayerStocks };
    });
    addNotification(`Umenunua hisa ${quantity}x ${stock.ticker}.`, 'purchase');
  };

  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
     if (!gameState || quantity <= 0 || quantity > item.quantity) return;
     updateState(prev => {
         const newInventory = [...prev.inventory];
         const itemIndex = newInventory.findIndex(i => i.item === item.item);
         newInventory[itemIndex].quantity -= quantity;
         const newListing: PlayerListing = {
             id: Date.now(),
             commodity: item.item,
             seller: prev.username,
             quantity,
             price,
             avatar: `https://picsum.photos/seed/${prev.uid}/40/40`,
             quality: 0,
             imageHint: 'player avatar'
         };
         return {
             inventory: newInventory.filter(i => i.quantity > 0),
             marketListings: [newListing, ...prev.marketListings],
         }
     });
     addNotification(`${quantity}x ${item.item} imewekwa sokoni.`, 'sale');
  };

  // Game loop for processing finished activities
  React.useEffect(() => {
    const processedActivities = new Set<string>();

    const interval = setInterval(() => {
        updateState(prevState => {
            const now = Date.now();
            const newState: Partial<UserData> = {};
            const newNotifications = [...prevState.notifications];
            let newXP = prevState.playerXP;

            const updatedSlots = prevState.buildingSlots.map((slot, index) => {
                const newSlot = { ...slot };
                const constructionId = newSlot.construction ? `${index}-${newSlot.construction.startTime}` : null;
                const activityId = newSlot.activity ? `${index}-${newSlot.activity.startTime}` : null;

                // Process construction
                if (newSlot.construction && now >= newSlot.construction.endTime && !processedActivities.has(constructionId!)) {
                    newSlot.level = newSlot.construction.targetLevel;
                    newNotifications.unshift({ id: `${now}-construction-${index}`, message: `Ujenzi wa ${newSlot.building?.name} Lvl ${newSlot.construction.targetLevel} umekamilika!`, timestamp: now, read: false, icon: 'construction' });
                    newXP += 100 * newSlot.construction.targetLevel;
                    newSlot.construction = undefined;
                    processedActivities.add(constructionId!);
                }

                // Process activity
                if (newSlot.activity && now >= newSlot.activity.endTime && !processedActivities.has(activityId!)) {
                    if (newSlot.activity.type === 'produce') {
                        const { recipeId: itemName, quantity } = newSlot.activity;
                        const itemIndex = prevState.inventory.findIndex(i => i.item === itemName);
                        if (itemIndex !== -1) {
                            (newState.inventory = newState.inventory || [...prevState.inventory])[itemIndex].quantity += quantity;
                        } else {
                            (newState.inventory = newState.inventory || [...prevState.inventory]).push({ item: itemName, quantity, marketPrice: calculatedPrices[itemName] || 0 });
                        }
                        newNotifications.unshift({ id: `${now}-production-${index}`, message: `Uzalishaji wa ${quantity}x ${itemName} umekamilika.`, timestamp: now, read: false, icon: 'production' });
                        newXP += quantity * 2;
                    } else if (newSlot.activity.type === 'sell') {
                        const { saleValue, quantity, recipeId: itemName } = newSlot.activity;
                        const profit = saleValue * 0.95;
                        (newState.transactions = newState.transactions || [...prevState.transactions]).unshift({ id: `${now}-sale-${index}`, type: 'income', amount: profit, description: `Mauzo ya ${quantity}x ${itemName}`, timestamp: now });
                        newState.money = (newState.money ?? prevState.money) + profit;
                        newNotifications.unshift({ id: `${now}-sale-notify-${index}`, message: `Umefanikiwa kuuza ${quantity}x ${itemName} kwa $${profit.toFixed(2)}.`, timestamp: now, read: false, icon: 'sale' });
                        newXP += Math.floor(profit * 0.01);
                    }
                    newSlot.activity = undefined;
                    processedActivities.add(activityId!);
                }
                return newSlot;
            });
            
            newState.buildingSlots = updatedSlots;
            newState.notifications = newNotifications;
            
            // Handle level up
            let newLevel = prevState.playerLevel;
            let xpForNextLevel = getXpForNextLevel(newLevel);
            while (newXP >= xpForNextLevel) {
                newXP -= xpForNextLevel;
                newLevel++;
                newNotifications.unshift({ id: `${now}-levelup-${newLevel}`, message: `Hongera! Umefikia Level ${newLevel}!`, timestamp: now, read: false, icon: 'level-up' });
                xpForNextLevel = getXpForNextLevel(newLevel);
            }
            newState.playerXP = newXP;
            newState.playerLevel = newLevel;

            return newState;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [updateState, getXpForNextLevel]);

  // Recalculate net worth when dependencies change
  React.useEffect(() => {
    if (!gameState) return;

    const stockValue = gameState.playerStocks.reduce((total, stock) => {
        const stockInfo = gameState.companyData.find(s => s.ticker === stock.ticker);
        return total + (stockInfo ? stockInfo.stockPrice * stock.shares : 0);
    }, 0);

    const buildingValue = gameState.buildingSlots.reduce((total, slot) => {
        if (!slot?.building) return total;
        const buildCost = buildingData[slot.building.id].buildCost;
        let cost = buildCost.reduce((sum, material) => sum + ((calculatedPrices[material.name] || 0) * material.quantity), 0);
        for (let i = 2; i <= slot.level; i++) {
            const upgradeCosts = buildingData[slot.building.id].upgradeCost(i);
            cost += upgradeCosts.reduce((sum, material) => sum + ((calculatedPrices[material.name] || 0) * material.quantity), 0);
        }
        return total + cost;
    }, 0);
    
    const inventoryValue = gameState.inventory.reduce((total, item) => total + (item.quantity * (item.marketPrice || 0)), 0);

    const netWorth = gameState.money + stockValue + buildingValue + inventoryValue;

    if (netWorth !== gameState.netWorth) {
        updateState(prev => ({ netWorth }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.money, gameState?.playerStocks, gameState?.buildingSlots, gameState?.companyData, gameState?.inventory]);

  if (isLoading || !gameState) {
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
  
  const profileMetrics: PlayerMetrics = {
    netWorth: gameState.netWorth,
    buildingValue: 0,
    stockValue: 0,
    ranking: '1',
    rating: 'A+',
  };
  
  const currentProfile: ProfileData = {
      playerName: gameState.username,
      avatarUrl: `https://picsum.photos/seed/${gameState.uid}/100/100`,
      privateNotes: gameState.privateNotes,
      status: gameState.status,
      lastSeen: gameState.lastSeen && gameState.lastSeen.toDate ? gameState.lastSeen.toDate() : gameState.lastSeen,
      role: gameState.role,
  };
  
  const stockListingsWithShares = gameState.companyData.map(s => ({...s, sharesAvailable: Math.floor(s.totalShares * 0.4)}));

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard buildingSlots={gameState.buildingSlots} inventory={gameState.inventory} stars={gameState.stars} onBuild={handleBuild} onStartProduction={handleStartProduction} onStartSelling={handleStartSelling} onBoostConstruction={handleBoostConstruction} onUpgradeBuilding={handleUpgradeBuilding} onDemolishBuilding={handleDemolishBuilding} onBuyMaterial={handleBuyMaterial} />;
      case 'inventory':
        return <Inventory inventoryItems={gameState.inventory} onPostToMarket={handlePostToMarket} />;
      case 'market':
        return <TradeMarket playerListings={allMarketListings} stockListings={stockListingsWithShares} bondListings={gameState.bondListings} inventory={gameState.inventory} onBuyStock={handleBuyStock} onBuyFromMarket={handleBuyFromMarket} playerName={gameState.username} />;
      case 'encyclopedia':
        return <Encyclopedia />;
      case 'chats':
          return <Chats user={{ uid: user.uid, username: user.username}} />;
      case 'accounting':
          return <Accounting transactions={gameState.transactions} />;
      case 'leaderboard':
          return <Leaderboard />;
      case 'profile':
          return <PlayerProfile onSave={handleUpdateProfile} currentProfile={currentProfile} metrics={profileMetrics} />;
      case 'admin':
          return <AdminPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader money={gameState.money} stars={gameState.stars} setView={setView} playerName={gameState.username} playerAvatar={`https://picsum.photos/seed/${gameState.uid}/40/40`} notifications={gameState.notifications} onNotificationsRead={handleMarkNotificationsRead} playerLevel={gameState.playerLevel} playerXP={gameState.playerXP} xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} isAdmin={gameState.role === 'admin'} />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderView()}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}

      