
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import type { Recipe } from '@/lib/recipe-data';
import { buildingData } from '@/lib/building-data';
import { Chats } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';
import { PlayerProfile, type ProfileData, type PlayerMetrics } from '@/components/app/profile';
import { Leaderboard } from '@/components/app/leaderboard';
import { AdminPanel } from '@/components/app/admin-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { getInitialUserData, saveUserData, type UserData } from '@/services/game-service';
import { useUser, useDatabase } from '@/firebase';
import { useLeaderboard } from '@/firebase/firestore/use-leaderboard';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, onValue, set, runTransaction, get } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';

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

const BUILDING_SLOTS = 20;

const initialCompanyData: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, totalShares: 250000, marketCap: 450.75 * 250000, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo', creditRating: 'AA+', dailyRevenue: 100000, dividendYield: 0.015 },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, totalShares: 1000000, marketCap: 120.50 * 1000000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo', creditRating: 'A-', dailyRevenue: 150000, dividendYield: 0.015 },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
];

const calculatedPrices = encyclopediaData.reduce((acc, item) => {
    const priceString = item.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '');
    if (priceString) {
        acc[item.name] = parseFloat(priceString);
    }
    return acc;
}, {} as Record<string, number>);


export function Game() {
  const { user, loading: userLoading } = useUser();
  const { db: firestore } = useDatabase();
  const database = getDatabase();
  const router = useRouter();
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [playerListings, setPlayerListings] = React.useState<PlayerListing[]>([]);
  const [gameStateLoading, setGameStateLoading] = React.useState(true);
  const [view, setView] = React.useState<View>('dashboard');
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialCompanyData);
  const { toast } = useToast();
  
  const { data: leaderboardData } = useLeaderboard();

  // State for viewing other players' profiles
  const [viewedProfileUid, setViewedProfileUid] = React.useState<string | null>(null);
  const [viewedProfileData, setViewedProfileData] = React.useState<UserData | null>(null);
  const [isViewingProfile, setIsViewingProfile] = React.useState(false);

  // Refs for Firebase paths
  const userRef = React.useMemo(() => database && user ? ref(database, `users/${user.uid}`) : null, [database, user]);
  const playerPublicRef = React.useMemo(() => database && user ? ref(database, `players/${user.uid}`) : null, [database, user]);
  const marketRef = React.useMemo(() => database ? ref(database, 'market') : null, [database]);
  
  // Firestore ref for leaderboard - IMPORTANT: It uses gameState.uid to correctly identify the player document
  const leaderboardDocRef = React.useMemo(() => 
    firestore && gameState?.uid ? doc(firestore, 'leaderboard', gameState.uid) : null
  , [firestore, gameState?.uid]);
  
  const updateState = React.useCallback((updater: (prevState: UserData) => Partial<UserData>) => {
    setGameState(prev => {
        if(!prev) return null;
        const updates = updater(prev);
        const newState = { ...prev, ...updates };
        return newState;
    });
  }, []);

  // Periodically update lastSeen to keep user online
  React.useEffect(() => {
      const interval = setInterval(() => {
          updateState(() => ({ lastSeen: Date.now() }));
      }, 60 * 1000); // every minute

      return () => clearInterval(interval);
  }, [updateState]);

  // Load user data or initialize if new
  React.useEffect(() => {
    if (userLoading || !database) return;
    if (!user) {
      router.replace('/');
      return;
    }
    if (!userRef) return;

    const unsubscribe = onValue(userRef, (snapshot) => {
      setGameStateLoading(false);
      if (snapshot.exists()) {
        const data = snapshot.val();
         // Force admin check on load
        const isAdmin = data.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2' || data.email === 'elonjazz89@gmail.com';
        if (isAdmin && (data.role !== 'admin' || data.email !== user.email)) {
            data.role = 'admin';
            data.email = user.email; // Ensure email is in the private user data
        }
        setGameState(data);
      } else {
        const initialData = getInitialUserData(user.uid, user.displayName || 'Mchezaji', user.email);
        saveUserData(userRef, initialData).then(() => {
          setGameState(initialData);
        });
      }
    }, (error) => {
        console.error("Firebase onValue error:", error);
        setGameStateLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading, router, userRef, database]);

  // Effect to fetch data for a viewed profile
  React.useEffect(() => {
    if (viewedProfileUid && database) {
        const profileUserRef = ref(database, `users/${viewedProfileUid}`);
        get(profileUserRef).then((snapshot) => {
            if (snapshot.exists()) {
                setViewedProfileData(snapshot.val() as UserData);
                setIsViewingProfile(true); // Explicitly set the viewing state
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not find player profile.' });
                setViewedProfileUid(null);
            }
        });
    } else {
        setViewedProfileData(null);
        setIsViewingProfile(false);
    }
  }, [viewedProfileUid, database, toast]);

  
  // Listen for market changes
  React.useEffect(() => {
    if (!marketRef) return;
    const unsubscribe = onValue(marketRef, (snapshot) => {
        const listings: PlayerListing[] = [];
        snapshot.forEach(childSnapshot => {
            listings.push({ id: childSnapshot.key, ...childSnapshot.val() } as PlayerListing);
        });
        setPlayerListings(listings);
    });
    return () => unsubscribe();
  }, [marketRef]);

  // Save game state whenever it changes
  React.useEffect(() => {
    if (gameState && userRef) {
      saveUserData(userRef, gameState);
    }
  }, [gameState, userRef]);

  // Update public player data (RTDB) and leaderboard (Firestore) whenever critical info changes
  React.useEffect(() => {
    if (!gameState || !gameState.uid || !gameState.username || !leaderboardDocRef || !user) return;
    
    // Check and apply admin role
    const isAdmin = gameState.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2' || user.email === 'elonjazz89@gmail.com';
    const currentRole = isAdmin ? 'admin' : 'player';

    // Update RTDB for general player info
    if (playerPublicRef) {
        set(playerPublicRef, {
            uid: gameState.uid,
            username: gameState.username,
            netWorth: gameState.netWorth,
            avatar: gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/40/40`,
            level: gameState.playerLevel,
            role: currentRole
        });
    }

    // Update Firestore for leaderboard
    setDoc(leaderboardDocRef, {
        playerId: gameState.uid,
        username: gameState.username,
        score: gameState.netWorth,
        avatar: gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/100/100`,
        level: gameState.playerLevel,
    }, { merge: true });
    
    // Update local game state if role or email changed
    if (gameState.role !== currentRole || gameState.email !== user.email) {
        updateState(prev => ({ ...prev, role: currentRole, email: user.email }));
    }

  }, [gameState?.uid, gameState?.username, gameState?.netWorth, gameState?.playerLevel, gameState?.avatarUrl, playerPublicRef, leaderboardDocRef, user, updateState]);


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
        ...prev,
        notifications: [newNotification, ...(prev.notifications || [])].slice(0, 50)
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
        return { ...prev, playerXP: newXP, playerLevel: newLevel };
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
        ...prev,
        transactions: [newTransaction, ...(prev.transactions || [])]
    }));
    if (type === 'income') {
        addXP(Math.floor(amount * 0.01));
    }
  }, [updateState, addXP]);

  const handleMarkNotificationsRead = () => {
    updateState(prev => ({
        ...prev,
        notifications: (prev.notifications || []).map(n => ({ ...n, read: true }))
    }));
  }

  const handleUpdateProfile = (data: ProfileData) => {
    updateState(prev => ({
        ...prev,
        username: data.playerName,
        avatarUrl: data.avatarUrl,
        privateNotes: data.privateNotes || ''
    }));
    setView('dashboard');
  }

  const handleViewProfile = (playerId: string) => {
    if (playerId === user?.uid) {
        setView('profile');
    } else {
        setViewedProfileUid(playerId);
    }
  };

  const handleBackFromProfileView = () => {
      setViewedProfileUid(null);
  };


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
      const newInventory = [...prev.inventory];
      for (const cost of costs) {
        const itemIndex = newInventory.findIndex(i => i.item === cost.name);
        if (itemIndex > -1) {
            newInventory[itemIndex] = { ...newInventory[itemIndex], quantity: newInventory[itemIndex].quantity - cost.quantity };
        }
      }

      const newSlots = [...prev.buildingSlots];
      newSlots[slotIndex] = {
        building,
        level: 0,
        construction: { startTime: now, endTime: now + constructionTimeMs, targetLevel: 1 },
      };

      return { ...prev, inventory: newInventory.filter(item => item.quantity > 0), buildingSlots: newSlots };
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
      const newInventory = [...prev.inventory];
      for (const cost of costs) {
        const itemIndex = newInventory.findIndex(i => i.item === cost.name);
         if (itemIndex > -1) {
            newInventory[itemIndex] = { ...newInventory[itemIndex], quantity: newInventory[itemIndex].quantity - cost.quantity };
        }
      }

      const newSlots = [...prev.buildingSlots];
      newSlots[slotIndex] = {
        ...slot,
        construction: { startTime: now, endTime: now + constructionTimeMs, targetLevel: slot.level + 1 },
      };

      return { ...prev, inventory: newInventory.filter(item => item.quantity > 0), buildingSlots: newSlots };
    });
    addNotification(`Uboreshaji wa ${slot.building.name} hadi Lvl ${slot.level + 1} umeanza.`, 'construction');
  };

  const handleDemolishBuilding = (slotIndex: number) => {
    updateState(prev => {
        const newSlots = [...prev.buildingSlots];
        newSlots[slotIndex] = { building: null, level: 0 };
        return { ...prev, buildingSlots: newSlots };
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
            ...prev,
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
            ...prev,
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
        return { ...prev, stars: prev.stars - starsToUse, buildingSlots: newSlots };
    });
  };
  
  const handleBuyMaterial = (materialName: string, quantity: number): boolean => {
    if (!gameState) return false;
    const costPerUnit = calculatedPrices[materialName] || 0;
    if (costPerUnit === 0) return false;

    const totalCost = costPerUnit * quantity;
    if (gameState.money < totalCost) return false;

    updateState(prev => {
        let newInventory = [...(prev.inventory || [])];
        const itemIndex = newInventory.findIndex(i => i.item === materialName);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += quantity;
        } else {
            newInventory.push({ item: materialName, quantity, marketPrice: costPerUnit });
        }
        addTransaction('expense', totalCost, `Nunua ${quantity}x ${materialName}`);
        return { ...prev, money: prev.money - totalCost, inventory: newInventory };
    });

    addNotification(`Umenunua ${quantity}x ${materialName} kwa $${totalCost.toFixed(2)}.`, 'purchase');
    return true;
  };

  const handleBuyFromMarket = async (listing: PlayerListing, quantityToBuy: number) => {
    if (!database || !user || !gameState) return;
    if (listing.sellerUid === user.uid) {
        toast({ variant: 'destructive', title: 'Action Denied', description: 'You cannot buy your own items.' });
        return;
    }
    
    const totalCost = listing.price * quantityToBuy;
    if (gameState.money < totalCost) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: `You need $${totalCost.toFixed(2)} to make this purchase.` });
        return;
    }

    const listingRef = ref(database, `market/${listing.id}`);

    try {
        const transactionResult = await runTransaction(listingRef, (currentListing) => {
            if (currentListing === null) {
                return; // Listing already sold or removed
            }
            if (currentListing.quantity < quantityToBuy) {
                 throw new Error("Not enough quantity available.");
            }
            if (currentListing.quantity === quantityToBuy) {
                return null; // Remove the listing
            } else {
                currentListing.quantity -= quantityToBuy;
                return currentListing;
            }
        });

        if (!transactionResult.committed) {
             throw new Error("Market transaction to remove listing failed.");
        }


        // 2. Update buyer's state (client-side)
        updateState(prev => {
            const newInventory = [...(prev.inventory || [])];
            const itemIndex = newInventory.findIndex(i => i.item === listing.commodity);
            if (itemIndex > -1) {
                newInventory[itemIndex].quantity += quantityToBuy;
            } else {
                newInventory.push({ item: listing.commodity, quantity: quantityToBuy, marketPrice: listing.price });
            }
            addTransaction('expense', totalCost, `Bought ${quantityToBuy}x ${listing.commodity} from ${listing.seller}`);
            return {
                ...prev,
                money: prev.money - totalCost,
                inventory: newInventory
            };
        });

        // 3. Update seller's state (server-side transaction)
        const sellerUserRef = ref(database, `users/${listing.sellerUid}`);
        await runTransaction(sellerUserRef, (sellerData) => {
            if (sellerData) {
                sellerData.money += totalCost;
                
                const newTransaction: Transaction = { id: `${Date.now()}-sale`, type: 'income', amount: totalCost, description: `Sold ${quantityToBuy}x ${listing.commodity} to ${gameState.username}`, timestamp: Date.now() };
                sellerData.transactions = [newTransaction, ...(sellerData.transactions || [])];

                const newNotification: Notification = { id: `${Date.now()}-sale-notify`, message: `You sold ${quantityToBuy}x ${listing.commodity} for $${totalCost.toFixed(2)} to ${gameState.username}.`, timestamp: Date.now(), read: false, icon: 'sale' };
                sellerData.notifications = [newNotification, ...(sellerData.notifications || [])];
            }
            return sellerData;
        });
        
        addNotification(`Umenunua ${quantityToBuy}x ${listing.commodity} from ${listing.seller}`, 'purchase');
        toast({ title: 'Purchase Successful' });

    } catch (error: any) {
        console.error("Market transaction failed:", error);
        toast({ variant: 'destructive', title: 'Purchase Failed', description: error.message || 'The transaction could not be completed.' });
    }
  };
  
  const handleBuyStock = (stock: StockListing, quantity: number) => {
    if (!gameState || quantity <= 0) return;
    const totalCost = stock.stockPrice * quantity;
    if (gameState.money < totalCost) return;

    updateState(prev => {
        const newPlayerStocks = [...(prev.playerStocks || [])];
        const stockIndex = newPlayerStocks.findIndex(s => s.ticker === stock.ticker);
        if (stockIndex !== -1) {
            newPlayerStocks[stockIndex].shares += quantity;
        } else {
            newPlayerStocks.push({ ticker: stock.ticker, shares: quantity });
        }
        addTransaction('expense', totalCost, `Nunua hisa ${quantity}x ${stock.ticker}`);
        return { ...prev, money: prev.money - totalCost, playerStocks: newPlayerStocks };
    });
    addNotification(`Umenunua hisa ${quantity}x ${stock.ticker}.`, 'purchase');
  };

  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
     if (!database || !user || !gameState || quantity <= 0 || quantity > item.quantity) return;

     updateState(prev => {
        const newInventory = [...(prev.inventory || [])];
        const itemIndex = newInventory.findIndex(i => i.item === item.item);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity -= quantity;
        }
        return {
            ...prev,
            inventory: newInventory.filter(i => i.quantity > 0)
        }
     });
     
     const listingId = `${user.uid}-${Date.now()}`;
     const listingRef = ref(database, `market/${listingId}`);

     const productInfo = encyclopediaData.find(e => e.name === item.item);

     const newListing: Omit<PlayerListing, 'id'> = {
         commodity: item.item,
         quantity,
         price,
         seller: gameState.username,
         sellerUid: user.uid,
         avatar: gameState.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
         quality: 1, // Placeholder
         imageHint: productInfo?.imageHint || 'product photo'
     };

     set(listingRef, newListing).then(() => {
        toast({ title: 'Item Posted', description: `${quantity}x ${item.item} has been listed on the market.` });
     }).catch(error => {
        console.error("Failed to post to market:", error);
        // TODO: Add the item back to inventory on failure
        toast({ variant: 'destructive', title: 'Failed to List Item' });
     });
  };

  // Game loop for processing finished activities
  React.useEffect(() => {
    const interval = setInterval(() => {
        if (!gameState) return;

        const now = Date.now();
        let changed = false;
        
        const newBuildingSlots: BuildingSlot[] = JSON.parse(JSON.stringify(gameState.buildingSlots));

        const finishedActivities: { type: 'construction' | 'production' | 'sale', slotIndex: number, details: any }[] = [];

        newBuildingSlots.forEach((slot, index) => {
            // Process construction
            if (slot.construction && now >= slot.construction.endTime) {
                finishedActivities.push({type: 'construction', slotIndex: index, details: { targetLevel: slot.construction.targetLevel, buildingName: slot.building?.name }});
                slot.level = slot.construction.targetLevel;
                delete slot.construction;
                changed = true;
            }

            // Process activity
            if (slot.activity && now >= slot.activity.endTime) {
                if (slot.activity.type === 'produce') {
                    finishedActivities.push({type: 'production', slotIndex: index, details: { ...slot.activity }});
                } else if (slot.activity.type === 'sell') {
                    finishedActivities.push({type: 'sale', slotIndex: index, details: { ...slot.activity }});
                }
                delete slot.activity;
                changed = true;
            }
        });
        
        if (changed) {
            updateState(prev => {
                let newMoney = prev.money;
                let newXP = prev.playerXP;
                const newInventory = [...(prev.inventory || []).map(i => ({...i}))];
                let newTransactions = [...(prev.transactions || [])];
                let newNotifications = [...(prev.notifications || [])];

                for (const activity of finishedActivities) {
                    if (activity.type === 'construction') {
                        newNotifications.unshift({ id: `${now}-construction-${Math.random()}`, message: `Ujenzi wa ${activity.details.buildingName} Lvl ${activity.details.targetLevel} umekamilika!`, timestamp: now, read: false, icon: 'construction' });
                        newXP += 100 * activity.details.targetLevel;
                    } else if (activity.type === 'production') {
                        const { quantity, recipeId: itemName } = activity.details;
                        const itemIndex = newInventory.findIndex(i => i.item === itemName);
                        if (itemIndex !== -1) {
                            newInventory[itemIndex].quantity += quantity;
                        } else {
                            newInventory.push({ item: itemName, quantity, marketPrice: calculatedPrices[itemName] || 0 });
                        }
                        newNotifications.unshift({ id: `${now}-production-${Math.random()}`, message: `Uzalishaji wa ${quantity}x ${itemName} umekamilika.`, timestamp: now, read: false, icon: 'production' });
                        newXP += quantity * 2;
                    } else if (activity.type === 'sale') {
                        const { saleValue, quantity, recipeId: itemName } = activity.details;
                        const profit = saleValue * 0.95; // 5% tax
                        newTransactions.unshift({ id: `${now}-sale-${Math.random()}`, type: 'income', amount: profit, description: `Mauzo ya ${quantity}x ${itemName}`, timestamp: now });
                        newMoney += profit;
                        newNotifications.unshift({ id: `${now}-sale-notify-${Math.random()}`, message: `Umefanikiwa kuuza ${quantity}x ${itemName} kwa $${profit.toFixed(2)}.`, timestamp: now, read: false, icon: 'sale' });
                        newXP += Math.floor(profit * 0.01);
                    }
                }

                // Level up check
                let currentLevel = prev.playerLevel;
                let currentXP = newXP;
                let xpForNextLevel = getXpForNextLevel(currentLevel);
                while (currentXP >= xpForNextLevel) {
                    currentXP -= xpForNextLevel;
                    currentLevel++;
                    newNotifications.unshift({ id: `${now}-levelup-${currentLevel}`, message: `Hongera! Umefikia Level ${currentLevel}!`, timestamp: now, read: false, icon: 'level-up' });
                    xpForNextLevel = getXpForNextLevel(currentLevel);
                }

                return {
                    ...prev,
                    buildingSlots: newBuildingSlots,
                    inventory: newInventory.filter(i => i.quantity > 0),
                    money: newMoney,
                    transactions: newTransactions,
                    playerXP: currentXP,
                    playerLevel: currentLevel,
                    notifications: newNotifications
                };
            });
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, updateState, addXP, addNotification]);

  const { buildingValue, stockValue } = React.useMemo(() => {
    if (!gameState) return { buildingValue: 0, stockValue: 0 };

    const currentStockValue = (gameState.playerStocks || []).reduce((total, stock) => {
        const stockInfo = companyData.find(s => s.ticker === stock.ticker);
        return total + (stockInfo ? stockInfo.stockPrice * stock.shares : 0);
    }, 0);

    const currentBuildingValue = gameState.buildingSlots.reduce((total, slot) => {
        if (!slot?.building) return total;
        const buildCost = buildingData[slot.building.id].buildCost;
        let cost = buildCost.reduce((sum, material) => sum + ((calculatedPrices[material.name] || 0) * material.quantity), 0);
        for (let i = 2; i <= slot.level; i++) {
            const upgradeCosts = buildingData[slot.building.id].upgradeCost(i);
            cost += upgradeCosts.reduce((sum, material) => sum + ((calculatedPrices[material.name] || 0) * material.quantity), 0);
        }
        return total + cost * 0.5; // Buildings depreciate to 50% of build cost
    }, 0);

    return { buildingValue: currentBuildingValue, stockValue: currentStockValue };
  }, [gameState, companyData]);


  // Recalculate net worth 
  React.useEffect(() => {
    if (!gameState) return;
    
    const inventoryValue = (gameState.inventory || []).reduce((total, item) => total + (item.quantity * (item.marketPrice || 0)), 0);
    const netWorth = gameState.money + stockValue + buildingValue + inventoryValue;

    if (netWorth !== gameState.netWorth) {
        updateState(prev => ({ ...prev, netWorth }));
    }
  }, [gameState, buildingValue, stockValue, updateState]);


  const getPlayerRating = (netWorth: number) => {
      if (netWorth > 1_000_000) return 'A+';
      if (netWorth > 500_000) return 'A';
      if (netWorth > 250_000) return 'B+';
      if (netWorth > 100_000) return 'B';
      if (netWorth > 50_000) return 'C+';
      if (netWorth > 10_000) return 'C';
      return 'D';
  };

  const playerRank = React.useMemo(() => {
      if (!leaderboardData || !gameState?.uid) return 'N/A';
      const rank = leaderboardData.findIndex(p => p.playerId === gameState.uid);
      return rank !== -1 ? `#${rank + 1}` : '100+';
  }, [leaderboardData, gameState?.uid]);


  if (userLoading || gameStateLoading) {
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

  if (!gameState || !user) return null; // Should be redirected by useEffect
  
  const currentProfile: ProfileData = {
      uid: gameState.uid,
      playerName: gameState.username,
      avatarUrl: gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/100/100`,
      privateNotes: gameState.privateNotes,
      status: gameState.status,
      lastSeen: new Date(gameState.lastSeen || Date.now()),
      role: gameState.role,
  };
  
  const viewedProfileForDisplay: ProfileData | null = viewedProfileData ? {
        uid: viewedProfileData.uid,
        playerName: viewedProfileData.username,
        avatarUrl: viewedProfileData.avatarUrl || `https://picsum.photos/seed/${viewedProfileData.uid}/100/100`,
        privateNotes: viewedProfileData.privateNotes,
        status: viewedProfileData.status,
        lastSeen: new Date(viewedProfileData.lastSeen || Date.now()),
        role: viewedProfileData.role,
  } : null;

  const getMetricsForProfile = (profileData: UserData | null): PlayerMetrics => {
    if (!profileData) return { netWorth: 0, buildingValue: 0, stockValue: 0, ranking: 'N/A', rating: 'D' };
    const rank = leaderboardData?.findIndex(p => p.playerId === profileData.uid);
    // Note: buildingValue and stockValue would need to be calculated for the other user. 
    // This is a simplification and only shows Net Worth correctly.
    return {
        netWorth: profileData.netWorth,
        buildingValue: 0, // Simplified for now
        stockValue: 0, // Simplified for now
        ranking: rank !== -1 && rank !== undefined ? `#${rank + 1}` : '100+',
        rating: getPlayerRating(profileData.netWorth),
    }
  }
  
  const stockListingsWithShares = companyData.map(s => ({...s, sharesAvailable: Math.floor(s.totalShares * 0.4)}));

  const renderView = () => {
    if (isViewingProfile && viewedProfileForDisplay) {
        return <PlayerProfile 
                    currentProfile={viewedProfileForDisplay} 
                    metrics={getMetricsForProfile(viewedProfileData)}
                    onSave={() => {}} 
                    isViewOnly={true}
                    onBack={handleBackFromProfileView}
                />;
    }
    switch (view) {
      case 'dashboard':
        return <Dashboard buildingSlots={gameState.buildingSlots} inventory={gameState.inventory || []} stars={gameState.stars} onBuild={handleBuild} onStartProduction={handleStartProduction} onStartSelling={handleStartSelling} onBoostConstruction={handleBoostConstruction} onUpgradeBuilding={handleUpgradeBuilding} onDemolishBuilding={handleDemolishBuilding} onBuyMaterial={handleBuyMaterial} />;
      case 'inventory':
        return <Inventory inventoryItems={gameState.inventory || []} onPostToMarket={handlePostToMarket} />;
      case 'market':
        return <TradeMarket playerListings={playerListings} stockListings={stockListingsWithShares} bondListings={initialBondListings} inventory={gameState.inventory || []} onBuyStock={handleBuyStock} onBuyFromMarket={handleBuyFromMarket} playerName={gameState.username} />;
      case 'encyclopedia':
        return <Encyclopedia />;
      case 'chats':
          return <Chats user={{ uid: gameState.uid, username: gameState.username, avatarUrl: gameState.avatarUrl }} onViewProfile={handleViewProfile} />;
      case 'accounting':
          return <Accounting transactions={gameState.transactions || []} />;
      case 'leaderboard':
          return <Leaderboard onViewProfile={handleViewProfile} />;
      case 'profile':
          return <PlayerProfile onSave={handleUpdateProfile} currentProfile={currentProfile} metrics={getMetricsForProfile(gameState)} />;
      case 'admin':
          return <AdminPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader money={gameState.money} stars={gameState.stars} setView={setView} playerName={gameState.username} playerAvatar={gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/40/40`} notifications={gameState.notifications || []} onNotificationsRead={handleMarkNotificationsRead} playerLevel={gameState.playerLevel} playerXP={gameState.playerXP} xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} isAdmin={gameState.role === 'admin'} />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderView()}
      </main>
      <AppFooter activeView={view} setView={setView} />
    </div>
  );
}

    

    


    





    

    