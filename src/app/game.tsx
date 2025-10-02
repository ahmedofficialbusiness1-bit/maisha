

'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing, type ContractListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import type { Recipe } from '@/lib/recipe-data';
import { buildingData } from '@/lib/building-data';
import { Chats, type ChatMetadata } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';
import { PlayerProfile, type ProfileData, type PlayerMetrics } from '@/components/app/profile';
import { Leaderboard } from '@/components/app/leaderboard';
import { AdminPanel } from '@/components/app/admin-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { getInitialUserData, saveUserData, type UserData } from '@/services/game-service';
import { useUser, useDatabase } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDatabase, ref, onValue, set, runTransaction, get, push, update, remove } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';

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
  const searchParams = useSearchParams();
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [playerListings, setPlayerListings] = React.useState<PlayerListing[]>([]);
  const [contractListings, setContractListings] = React.useState<ContractListing[]>([]);
  const [gameStateLoading, setGameStateLoading] = React.useState(true);
  const [view, setView] = React.useState<View>('dashboard');
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialCompanyData);
  const { toast } = useToast();
  
  // State for viewing other players' profiles
  const [viewedProfileUid, setViewedProfileUid] = React.useState<string | null>(null);
  const [viewedProfileData, setViewedProfileData] = React.useState<UserData | null>(null);
  const [isViewingProfile, setIsViewingProfile] = React.useState(false);
  
  // State for opening private chat from profile
  const [initialPrivateChatUid, setInitialPrivateChatUid] = React.useState<string | null>(null);
  
  // State for public chat metadata
  const [chatMetadata, setChatMetadata] = React.useState<Record<string, ChatMetadata>>({});
  const { players: allPlayers } = useAllPlayers();

  // Refs for Firebase paths
  const userRef = React.useMemo(() => database && user ? ref(database, `users/${user.uid}`) : null, [database, user]);
  const playerPublicRef = React.useMemo(() => database && user ? ref(database, `players/${user.uid}`) : null, [database, user]);
  const marketRef = React.useMemo(() => database ? ref(database, 'market') : null, [database]);
  const contractsRef = React.useMemo(() => database ? ref(database, 'contracts') : null, [database]);
  const chatMetadataRef = React.useMemo(() => database ? ref(database, 'chat-metadata') : null, [database]);

  
  const updateState = React.useCallback((updater: (prevState: UserData) => Partial<UserData>) => {
    if (!userRef) return;
  
    // Use the functional form of setGameState to ensure we have the latest state
    setGameState(prev => {
        if (!prev) return null;
        const updates = updater(prev);
        // Persist only the updates to Firebase
        update(userRef, updates);
        // Return the new state for React
        return { ...prev, ...updates };
    });
  }, [userRef]);
  
  const handleSetView = React.useCallback((newView: View) => {
    setView(newView);
    if (newView !== 'profile') {
        setViewedProfileUid(null);
    }
    if (newView !== 'chats') {
        setInitialPrivateChatUid(null);
    }
  }, []);

  // Periodically update lastSeen to keep user online
  React.useEffect(() => {
      const interval = setInterval(() => {
          if(document.hasFocus() && userRef) {
            update(userRef, { lastSeen: Date.now() });
          }
      }, 60 * 1000); // every minute

      return () => clearInterval(interval);
  }, [userRef]);

  // Load user data or initialize if new
  React.useEffect(() => {
    if (userLoading || !database) return;
    if (!user) {
      router.replace('/');
      return;
    }
    if (!userRef) return;

    // Fetch initial data once
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Force admin check on load
        const isAdmin = data.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2';
        if (isAdmin && data.role !== 'admin') {
            data.role = 'admin';
        }
        if (!data.lastPublicRead) {
            data.lastPublicRead = { general: 0, trade: 0, help: 0 };
        }
        setGameState(data);
      } else {
        getInitialUserData(user.uid, user.displayName || 'Mchezaji', user.email).then(initialData => {
            saveUserData(userRef, initialData).then(() => {
              setGameState(initialData);
            });
        });
      }
      setGameStateLoading(false);
    }).catch(error => {
        console.error("Firebase get error:", error);
        setGameStateLoading(false);
    });
    
    // Set up targeted listeners for critical real-time updates
    const listeners = [
        'money', 'stars', 'buildingSlots', 'inventory', 'notifications',
        'playerStocks', 'playerLevel', 'playerXP', 'netWorth', 'lastPublicRead'
    ].map(key => {
        const pathRef = ref(database, `users/${user.uid}/${key}`);
        const unsubscribe = onValue(pathRef, snapshot => {
            setGameState(prev => prev ? ({ ...prev, [key]: snapshot.val() }) : null);
        });
        return unsubscribe;
    });

    return () => listeners.forEach(unsubscribe => unsubscribe());
  }, [user, userLoading, router, userRef, database]);
  
  // Listen for chat metadata changes
    React.useEffect(() => {
        if (!chatMetadataRef) return;
        const unsubscribe = onValue(chatMetadataRef, (snapshot) => {
            setChatMetadata(snapshot.val() || {});
        });
        return () => unsubscribe();
    }, [chatMetadataRef]);


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
            listings.push({ id: childSnapshot.key!, ...childSnapshot.val() } as PlayerListing);
        });
        setPlayerListings(listings);
    });
    return () => unsubscribe();
  }, [marketRef]);
  
    // Listen for contract changes
  React.useEffect(() => {
    if (!contractsRef) return;
    const unsubscribe = onValue(contractsRef, (snapshot) => {
        const listings: ContractListing[] = [];
        snapshot.forEach(childSnapshot => {
            listings.push({ id: childSnapshot.key!, ...childSnapshot.val() } as ContractListing);
        });
        setContractListings(listings);
    });
    return () => unsubscribe();
  }, [contractsRef]);


  // Update public player data (RTDB) and leaderboard (Firestore) whenever critical info changes
  React.useEffect(() => {
    if (!gameState || !gameState.uid || !gameState.username || !user || !playerPublicRef) return;
    
    // Check and apply admin role
    const isAdmin = gameState.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2';
    const currentRole = isAdmin ? 'admin' : 'player';

    const publicData = {
        uid: gameState.uid,
        username: gameState.username,
        netWorth: gameState.netWorth,
        avatar: gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/40/40`,
        level: gameState.playerLevel,
        role: currentRole
    };

    set(playerPublicRef, publicData);
    
    // Update local game state if role or email changed
    if (gameState.role !== currentRole) {
        update(userRef!, { role: currentRole });
    }

  }, [gameState?.uid, gameState?.username, gameState?.netWorth, gameState?.playerLevel, gameState?.avatarUrl, playerPublicRef, user, userRef]);


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
        notifications: [newNotification, ...(prev.notifications || [])].slice(0, 50)
    }));
  }, [updateState]);

  const addTransaction = React.useCallback((type: 'income' | 'expense', amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      amount,
      description,
      timestamp: Date.now(),
    };
    const xpFromTransaction = type === 'income' ? Math.floor(amount * 0.01) : 0;
    
    updateState(prev => {
        let newXP = prev.playerXP + xpFromTransaction;
        let newLevel = prev.playerLevel;
        let xpForNextLevel = getXpForNextLevel(newLevel);
        const newNotifications = [...(prev.notifications || [])];

        while (newXP >= xpForNextLevel) {
            newXP -= xpForNextLevel;
            newLevel++;
            newNotifications.unshift({ id: `${Date.now()}-levelup-${newLevel}`, message: `Hongera! Umefikia Level ${newLevel}!`, timestamp: Date.now(), read: false, icon: 'level-up' });
            xpForNextLevel = getXpForNextLevel(newLevel);
        }

        return {
            transactions: [newTransaction, ...(prev.transactions || [])],
            playerXP: newXP,
            playerLevel: newLevel,
            notifications: newNotifications
        }
    });

  }, [updateState]);

  const handleMarkNotificationsRead = () => {
    updateState(prev => ({
        notifications: (prev.notifications || []).map(n => ({ ...n, read: true }))
    }));
  }

  const handleUpdateProfile = (data: ProfileData) => {
    if (!allPlayers || !gameState) return;

    const newName = data.playerName;
    const isNameTaken = allPlayers.some(player => 
        player.username.toLowerCase() === newName.toLowerCase() && player.uid !== gameState.uid
    );

    if (isNameTaken) {
        toast({
            variant: 'destructive',
            title: 'Jina Tayari Linatumika',
            description: 'Tafadhali chagua jina lingine.',
        });
        return;
    }
      
    updateState(prev => ({
        username: data.playerName,
        avatarUrl: data.avatarUrl,
        privateNotes: data.privateNotes || ''
    }));
    toast({ title: 'Wasifu Umehifadhiwa', description: 'Mabadiliko yako yamehifadhiwa.' });
    handleSetView('dashboard');
  }

  const handleViewProfile = (playerId: string) => {
    if (playerId === user?.uid) {
        setView('profile');
        setViewedProfileUid(null);
    } else {
        setViewedProfileUid(playerId);
        setView('profile'); // Switch to profile view
    }
  };

  const handleBackFromProfileView = () => {
      setViewedProfileUid(null);
      setView('leaderboard'); // Or wherever you want to go back to
  };

  const handleStartPrivateChat = (uid: string) => {
    setInitialPrivateChatUid(uid);
    setView('chats');
  }

  const handleChatOpened = () => {
    setInitialPrivateChatUid(null);
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
      
      const newNotifications = [
        { id: `${Date.now()}-build-start`, message: `Ujenzi wa ${building.name} umeanza.`, timestamp: now, read: false, icon: 'construction' },
        ...(prev.notifications || [])
      ];

      return { inventory: newInventory.filter(item => item.quantity > 0), buildingSlots: newSlots, notifications: newNotifications };
    });
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
      
      const newNotifications = [
        { id: `${Date.now()}-upgrade-start`, message: `Uboreshaji wa ${slot.building.name} hadi Lvl ${slot.level + 1} umeanza.`, timestamp: now, read: false, icon: 'construction' },
        ...(prev.notifications || [])
      ];

      return { inventory: newInventory.filter(item => item.quantity > 0), buildingSlots: newSlots, notifications: newNotifications };
    });
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
        
        const newNotifications = [
            { id: `${Date.now()}-prod-start`, message: `Umeanza kuzalisha ${recipe.output.quantity * quantity}x ${recipe.output.name}.`, timestamp: Date.now(), read: false, icon: 'production' },
            ...(prev.notifications || [])
        ];

        return {
            inventory: newInventory.filter(item => item.quantity > 0),
            buildingSlots: newSlots,
            notifications: newNotifications
        }
     });
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
        
        const newNotifications = [
             { id: `${Date.now()}-sell-start`, message: `Umeanza kuuza ${quantity}x ${item.item}.`, timestamp: Date.now(), read: false, icon: 'sale' },
            ...(prev.notifications || [])
        ];

        return {
            inventory: newInventory.filter(i => i.quantity > 0),
            buildingSlots: newSlots,
            notifications: newNotifications
        }
     });
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
        let newInventory = [...(prev.inventory || [])];
        const itemIndex = newInventory.findIndex(i => i.item === materialName);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += quantity;
        } else {
            newInventory.push({ item: materialName, quantity, marketPrice: costPerUnit });
        }
        const newTransaction: Transaction = {
          id: `${Date.now()}-buy-mat`, type: 'expense', amount: totalCost, 
          description: `Nunua ${quantity}x ${materialName}`, timestamp: Date.now()
        };
        const newNotification: Notification = {
          id: `${Date.now()}-buy-notify`, message: `Umenunua ${quantity}x ${materialName} kwa $${totalCost.toFixed(2)}.`, 
          timestamp: Date.now(), read: false, icon: 'purchase'
        };

        return { 
            money: prev.money - totalCost, 
            inventory: newInventory,
            transactions: [newTransaction, ...(prev.transactions || [])],
            notifications: [newNotification, ...(prev.notifications || [])]
        };
    });

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
            addNotification(`Umenunua ${quantityToBuy}x ${listing.commodity} from ${listing.seller}`, 'purchase');

            return {
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
        addNotification(`Umenunua hisa ${quantity}x ${stock.ticker}.`, 'purchase');
        return { money: prev.money - totalCost, playerStocks: newPlayerStocks };
    });
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
        // Add the item back to inventory on failure
        updateState(prev => {
            const inv = [...prev.inventory];
            const idx = inv.findIndex(i => i.item === item.item);
            if (idx > -1) inv[idx].quantity += quantity;
            else inv.push({ ...item, quantity });
            return { inventory: inv };
        });
        toast({ variant: 'destructive', title: 'Failed to List Item' });
     });
  };

  const handleCreateContract = (item: InventoryItem, quantity: number, pricePerUnit: number, targetIdentifier: string) => {
    if (!database || !user || !gameState || quantity <= 0 || pricePerUnit <= 0) return;
    if (quantity > item.quantity) {
        toast({ variant: 'destructive', title: 'Insufficient Inventory', description: `You only have ${item.quantity} units to create this contract.` });
        return;
    }

    const newContractRef = push(ref(database, 'contracts'));
    const productInfo = encyclopediaData.find(e => e.name === item.item);

    const newContract: Omit<ContractListing, 'id'> = {
        commodity: item.item,
        quantity,
        pricePerUnit,
        sellerUid: user.uid,
        sellerName: gameState.username,
        sellerAvatar: gameState.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
        status: 'open',
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days expiry
        buyerIdentifier: targetIdentifier,
        imageHint: productInfo?.imageHint || 'product photo'
    };
    
    // Deduct items from inventory optimistically
    updateState(prev => {
        const newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === item.item);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity -= quantity;
        }
        return { inventory: newInventory.filter(i => i.quantity > 0) };
    });

    set(newContractRef, newContract).then(() => {
        toast({ title: 'Contract Created', description: `Your contract for ${item.item} has been posted.` });
    }).catch(error => {
        console.error("Failed to create contract:", error);
        toast({ variant: 'destructive', title: 'Failed to Create Contract' });
        // Re-add items to inventory on failure
        updateState(prev => {
            const newInventory = [...prev.inventory];
            const itemIndex = newInventory.findIndex(i => i.item === item.item);
            if (itemIndex > -1) {
                newInventory[itemIndex].quantity += quantity;
            } else {
                newInventory.push({ ...item, quantity });
            }
            return { inventory: newInventory };
        });
    });
  }

  const handleAdminSendItem = (itemName: string, quantity: number, targetUid: string) => {
    if (!database || !user || !gameState || gameState.role !== 'admin') return;

    const newContractRef = push(ref(database, 'contracts'));
    const productInfo = encyclopediaData.find(e => e.name === itemName);

    const newContract: Omit<ContractListing, 'id'> = {
        commodity: itemName,
        quantity,
        pricePerUnit: 0, // It's free
        sellerUid: 'admin-system',
        sellerName: 'System Admin',
        sellerAvatar: `https://picsum.photos/seed/admin/40/40`,
        status: 'open',
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days expiry
        buyerIdentifier: targetUid,
        imageHint: productInfo?.imageHint || 'product photo'
    };

    set(newContractRef, newContract).catch(error => {
        console.error("Failed to create admin contract:", error);
        toast({ variant: 'destructive', title: 'Failed to Create Admin Contract' });
    });
  };

  const handleAdminSendMoney = (amount: number, targetUid: string) => {
    if (!database || !user || gameState?.role !== 'admin' || amount <= 0 || !targetUid) return;

    const targetUserRef = ref(database, `users/${targetUid}`);
    runTransaction(targetUserRef, (userData) => {
        if (userData) {
            userData.money += amount;
            const newTransaction: Transaction = { id: `${Date.now()}-admin-gift`, type: 'income', amount: amount, description: `Admin Gift: Money`, timestamp: Date.now() };
            userData.transactions = [newTransaction, ...(userData.transactions || [])];
            const newNotification: Notification = { id: `${Date.now()}-admin-money`, message: `You received $${amount.toLocaleString()} from an Admin.`, timestamp: Date.now(), read: false, icon: 'purchase' };
            userData.notifications = [newNotification, ...(userData.notifications || [])];
        }
        return userData;
    }).then(() => {
        toast({ title: "Money Sent!", description: `Sent $${amount.toLocaleString()} to player ${targetUid}`});
    }).catch((error) => {
        console.error("Failed to send money:", error);
        toast({ variant: 'destructive', title: 'Failed to Send Money' });
    });
  }

  const handleAdminSendStars = (amount: number, targetUid: string) => {
    if (!database || !user || gameState?.role !== 'admin' || amount <= 0 || !targetUid) return;
    
    const targetUserRef = ref(database, `users/${targetUid}`);
    runTransaction(targetUserRef, (userData) => {
        if (userData) {
            userData.stars += amount;
            const newNotification: Notification = { id: `${Date.now()}-admin-stars`, message: `You received ${amount.toLocaleString()} Stars from an Admin.`, timestamp: Date.now(), read: false, icon: 'purchase' };
            userData.notifications = [newNotification, ...(userData.notifications || [])];
        }
        return userData;
    }).then(() => {
        toast({ title: "Stars Sent!", description: `Sent ${amount.toLocaleString()} Stars to player ${targetUid}`});
    }).catch((error) => {
        console.error("Failed to send stars:", error);
        toast({ variant: 'destructive', title: 'Failed to Send Stars' });
    });
  }

  const handleAcceptContract = async (contract: ContractListing) => {
    if (!database || !user || !gameState) return;

    if (contract.sellerUid === user.uid) {
        toast({ variant: 'destructive', title: 'Action Denied', description: 'You cannot accept your own contract.' });
        return;
    }

    const totalCost = contract.quantity * contract.pricePerUnit;
    if (gameState.money < totalCost) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: `You need $${totalCost.toFixed(2)} for this contract.` });
        return;
    }

    const contractRef = ref(database, `contracts/${contract.id}`);

    try {
        const transactionResult = await runTransaction(contractRef, (currentContract) => {
            if (currentContract && currentContract.status === 'open') {
                return null; // Atomically remove the contract if it's still open
            }
            return; // Abort if contract is already taken, or doesn't exist
        });

        if (!transactionResult.committed) {
             throw new Error("Contract is no longer available.");
        }

        // Buyer gets items and loses money
        updateState(prev => {
            const newInventory = [...(prev.inventory || [])];
            const itemIndex = newInventory.findIndex(i => i.item === contract.commodity);
            if (itemIndex > -1) {
                newInventory[itemIndex].quantity += contract.quantity;
            } else {
                newInventory.push({ item: contract.commodity, quantity: contract.quantity, marketPrice: contract.pricePerUnit });
            }
            addTransaction('expense', totalCost, `Contract purchase: ${contract.quantity}x ${contract.commodity}`);
            return {
                money: prev.money - totalCost,
                inventory: newInventory
            };
        });

        // Seller gets money and notification (unless it's an admin)
        if (contract.sellerUid !== 'admin-system') {
            const sellerUserRef = ref(database, `users/${contract.sellerUid}`);
            await runTransaction(sellerUserRef, (sellerData) => {
                if (sellerData) {
                    sellerData.money += totalCost;
                    const newTransaction: Transaction = { id: `${Date.now()}-contract-sale`, type: 'income', amount: totalCost, description: `Contract sale: ${contract.quantity}x ${contract.commodity} to ${gameState.username}`, timestamp: Date.now() };
                    sellerData.transactions = [newTransaction, ...(sellerData.transactions || [])];
                    const newNotification: Notification = { id: `${Date.now()}-contract-notify`, message: `Your contract for ${contract.quantity}x ${contract.commodity} was accepted by ${gameState.username}.`, timestamp: Date.now(), read: false, icon: 'sale' };
                    sellerData.notifications = [newNotification, ...(sellerData.notifications || [])];
                }
                return sellerData;
            });
        }

        toast({ title: 'Contract Accepted!', description: `You purchased ${contract.quantity}x ${contract.commodity}.` });

    } catch (error: any) {
        console.error("Contract acceptance failed:", error);
        toast({ variant: 'destructive', title: 'Contract Failed', description: error.message || 'The contract could not be completed.' });
    }
  };
  
  const handleRejectContract = async (contract: ContractListing) => {
    if (!database || !user || !gameState) return;
    if (contract.buyerIdentifier && contract.buyerIdentifier !== user.uid && contract.buyerIdentifier !== gameState?.username) return;

    // Just remove the contract. If seller is not admin, return items.
    const contractRef = ref(database, `contracts/${contract.id}`);
    await remove(contractRef);

    if (contract.sellerUid !== 'admin-system') {
        const sellerUserRef = ref(database, `users/${contract.sellerUid}`);
        await runTransaction(sellerUserRef, (sellerData) => {
            if (sellerData) {
                const itemIndex = sellerData.inventory.findIndex((i: InventoryItem) => i.item === contract.commodity);
                if (itemIndex > -1) {
                    sellerData.inventory[itemIndex].quantity += contract.quantity;
                } else {
                    sellerData.inventory.push({ item: contract.commodity, quantity: contract.quantity, marketPrice: contract.pricePerUnit });
                }
                const newNotification: Notification = { id: `${Date.now()}-contract-reject`, message: `Your contract for ${contract.quantity}x ${contract.commodity} was rejected. Items have been returned.`, timestamp: Date.now(), read: false, icon: 'purchase' };
                sellerData.notifications = [newNotification, ...(sellerData.notifications || [])];
            }
            return sellerData;
        });
    }

    toast({ title: 'Mkataba umekataliwa.' });
  };

  const handleCancelContract = async (contract: ContractListing) => {
    if (!database || !user || user.uid !== contract.sellerUid) return;

    const contractRef = ref(database, `contracts/${contract.id}`);
    await remove(contractRef);

    // Return items to seller
    updateState(prev => {
        const newInventory = [...prev.inventory];
        const itemIndex = newInventory.findIndex(i => i.item === contract.commodity);
        if (itemIndex > -1) {
            newInventory[itemIndex].quantity += contract.quantity;
        } else {
            newInventory.push({ item: contract.commodity, quantity: contract.quantity, marketPrice: contract.pricePerUnit });
        }
        return { inventory: newInventory };
    });

    toast({ title: 'Mkataba umeghairiwa.' });
  };


  // Game loop for processing finished activities
  React.useEffect(() => {
    const interval = setInterval(() => {
        // Use a functional update for setGameState to get the latest state
        setGameState(currentGameState => {
            if (!currentGameState) return null;

            const now = Date.now();
            let changed = false;
            
            // Deep copy of building slots to avoid direct mutation
            const newBuildingSlots: BuildingSlot[] = JSON.parse(JSON.stringify(currentGameState.buildingSlots));

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
            
            if (changed && userRef) {
                let newMoney = currentGameState.money;
                let newXP = currentGameState.playerXP;
                let newLevel = currentGameState.playerLevel;
                const newInventory = [...(currentGameState.inventory || []).map(i => ({...i}))];
                let newTransactions = [...(currentGameState.transactions || [])];
                let newNotifications = [...(currentGameState.notifications || [])];

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
                let xpForNextLevel = getXpForNextLevel(newLevel);
                while (newXP >= xpForNextLevel) {
                    newXP -= xpForNextLevel;
                    newLevel++;
                    newNotifications.unshift({ id: `${now}-levelup-${newLevel}`, message: `Hongera! Umefikia Level ${newLevel}!`, timestamp: now, read: false, icon: 'level-up' });
                    xpForNextLevel = getXpForNextLevel(newLevel);
                }
                
                const updates = {
                    buildingSlots: newBuildingSlots,
                    inventory: newInventory.filter(i => i.quantity > 0),
                    money: newMoney,
                    transactions: newTransactions,
                    playerXP: newXP,
                    playerLevel: newLevel,
                    notifications: newNotifications
                };
                
                // Atomically update firebase
                update(userRef, updates);

                // Return the new state for React
                return { ...currentGameState, ...updates };
            }
            
            // If no changes, return the current state to avoid re-render
            return currentGameState;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [userRef]);

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
    if (!gameState || !userRef) return;
    
    const inventoryValue = (gameState.inventory || []).reduce((total, item) => total + (item.quantity * (item.marketPrice || 0)), 0);
    const netWorth = gameState.money + stockValue + buildingValue + inventoryValue;

    if (netWorth !== gameState.netWorth) {
        update(userRef, { netWorth });
    }
  }, [gameState, buildingValue, stockValue, userRef]);


  const getPlayerRating = (netWorth: number) => {
      if (netWorth > 1_000_000) return 'A+';
      if (netWorth > 500_000) return 'A';
      if (netWorth > 250_000) return 'B+';
      if (netWorth > 100_000) return 'B';
      if (netWorth > 50_000) return 'C+';
      if (netWorth > 10_000) return 'C';
      return 'D';
  };

    const unreadPrivateMessagesCount = React.useMemo(() => {
        if (!chatMetadata || !user) return 0;
        let count = 0;
        for (const chatId in chatMetadata) {
            const metadata = chatMetadata[chatId];
            const otherPlayerId = Object.keys(metadata.participants || {}).find(pId => pId !== user.uid);
            if (otherPlayerId && metadata.participants && metadata.participants[user.uid]) {
                const selfParticipant = metadata.participants[user.uid];
                if (metadata.lastMessageTimestamp > (selfParticipant.lastReadTimestamp || 0)) {
                    count++;
                }
            }
        }
        return count;
    }, [chatMetadata, user]);
  
  const unreadPublicChats = React.useMemo(() => {
    if (!gameState || !gameState.lastPublicRead || !chatMetadata) return {};
    const unread: Record<string, boolean> = {};
    for (const roomId in chatMetadata) {
        if (['general', 'trade', 'help'].includes(roomId) && chatMetadata[roomId].lastMessageTimestamp > (gameState.lastPublicRead[roomId] || 0)) {
            unread[roomId] = true;
        }
    }
    return unread;
  }, [gameState, chatMetadata]);

  const totalUnreadPublicMessages = Object.values(unreadPublicChats).filter(Boolean).length;
  const totalUnreadMessages = unreadPrivateMessagesCount + totalUnreadPublicMessages;

  const unreadContracts = React.useMemo(() => {
    if (!contractListings || !user || !gameState) return 0;
    return contractListings.filter(c => {
        const isTargeted = !c.buyerIdentifier || c.buyerIdentifier === user.uid || c.buyerIdentifier === gameState.username;
        return c.status === 'open' && c.sellerUid !== user.uid && isTargeted;
    }).length;
  }, [contractListings, user, gameState]);


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
    if (!profileData || !allPlayers) return { netWorth: 0, buildingValue: 0, stockValue: 0, ranking: 'N/A', rating: 'D' };
    
    const publicData = allPlayers.find(p => p.uid === profileData.uid);
    const netWorth = publicData?.netWorth || profileData.netWorth;

    const sortedPlayers = [...allPlayers].sort((a, b) => b.netWorth - a.netWorth);
    const rank = sortedPlayers.findIndex(p => p.uid === profileData.uid);
    
    // Note: buildingValue and stockValue would need to be calculated for the other user. 
    // This is a simplification and only shows Net Worth correctly.
    return {
        netWorth: netWorth,
        buildingValue: 0, // Simplified for now
        stockValue: 0, // Simplified for now
        ranking: rank !== -1 ? `#${rank + 1}` : '100+',
        rating: getPlayerRating(netWorth),
    }
  }
  
  const stockListingsWithShares = companyData.map(s => ({...s, sharesAvailable: Math.floor(s.totalShares * 0.4)}));

  const handlePublicRoomRead = (roomId: string) => {
    if (database && user) {
        const readRef = ref(database, `users/${user.uid}/lastPublicRead/${roomId}`);
        set(readRef, Date.now());
    }
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard buildingSlots={gameState.buildingSlots} inventory={gameState.inventory || []} stars={gameState.stars} onBuild={handleBuild} onStartProduction={handleStartProduction} onStartSelling={handleStartSelling} onBoostConstruction={handleBoostConstruction} onUpgradeBuilding={handleUpgradeBuilding} onDemolishBuilding={handleDemolishBuilding} onBuyMaterial={handleBuyMaterial} />;
      case 'inventory':
        return <Inventory inventoryItems={gameState.inventory || []} contractListings={contractListings} onPostToMarket={handlePostToMarket} onCreateContract={handleCreateContract} onAcceptContract={handleAcceptContract} onRejectContract={handleRejectContract} onCancelContract={handleCancelContract} currentUserId={user.uid} currentUsername={gameState.username} />;
      case 'market':
        return <TradeMarket playerListings={playerListings} stockListings={stockListingsWithShares} bondListings={initialBondListings} inventory={gameState.inventory || []} onBuyStock={handleBuyStock} onBuyFromMarket={handleBuyFromMarket} playerName={gameState.username} />;
      case 'encyclopedia':
        return <Encyclopedia />;
      case 'chats':
          return <Chats user={{ uid: gameState.uid, username: gameState.username, avatarUrl: gameState.avatarUrl }} initialPrivateChatUid={initialPrivateChatUid} onChatOpened={handleChatOpened} players={allPlayers || []} chatMetadata={chatMetadata} unreadPublicChats={unreadPublicChats} onPublicRoomRead={handlePublicRoomRead} />;
      case 'accounting':
          return <Accounting transactions={gameState.transactions || []} />;
      case 'leaderboard':
          return <Leaderboard onViewProfile={handleViewProfile} />;
      case 'profile':
          if (isViewingProfile && viewedProfileForDisplay) {
            return <PlayerProfile 
                        currentProfile={viewedProfileForDisplay} 
                        metrics={getMetricsForProfile(viewedProfileData)}
                        onSave={() => {}} 
                        isViewOnly={true}
                        onBack={handleBackFromProfileView}
                        viewerRole={gameState.role}
                        setView={setView}
                        onStartPrivateChat={handleStartPrivateChat}
                    />;
        }
        return <PlayerProfile onSave={handleUpdateProfile} currentProfile={currentProfile} metrics={getMetricsForProfile(gameState)} setView={setView} onStartPrivateChat={handleStartPrivateChat} />;
      case 'admin':
          return <AdminPanel onViewProfile={handleViewProfile} onAdminSendItem={handleAdminSendItem} onAdminSendMoney={handleAdminSendMoney} onAdminSendStars={handleAdminSendStars} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader money={gameState.money} stars={gameState.stars} setView={handleSetView} playerName={gameState.username} playerAvatar={gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/40/40`} notifications={gameState.notifications || []} onNotificationsRead={handleMarkNotificationsRead} playerLevel={gameState.playerLevel} playerXP={gameState.playerXP} xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} isAdmin={gameState.role === 'admin'} />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderView()}
      </main>
      <AppFooter activeView={view} setView={handleSetView} unreadMessages={totalUnreadMessages} unreadContracts={unreadContracts} />
    </div>
  );
}
