

'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app/header';
import { AppFooter } from '@/components/app/footer';
import { Dashboard, type BuildingSlot } from '@/components/app/dashboard';
import { Inventory, type InventoryItem } from '@/components/app/inventory';
import { TradeMarket, type PlayerListing, type StockListing, type BondListing, type MarketShareListing } from '@/components/app/trade-market';
import { Encyclopedia } from '@/components/app/encyclopedia';
import type { Recipe } from '@/lib/recipe-data';
import { buildingData } from '@/lib/building-data';
import { Chats, type ChatMetadata } from '@/components/app/chats';
import { Accounting, type Transaction } from '@/components/app/accounting';
import { PlayerProfile, type ProfileData } from '@/components/app/profile';
import { Leaderboard } from '@/components/app/leaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { encyclopediaData } from '@/lib/encyclopedia-data';
import { getInitialUserData, saveUserData, type UserData } from '@/services/game-service';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, onValue, set, get, push, remove, runTransaction, update } from 'firebase/database';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { recipes } from '@/lib/recipe-data';
import { AdminPanel } from '@/components/app/admin-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type PlayerStock = {
    ticker: string;
    shares: number;
}

export type View = 'dashboard' | 'inventory' | 'market' | 'chats' | 'encyclopedia' | 'accounting' | 'profile' | 'leaderboard' | 'admin' | 'office';

export type Notification = {
    id: string;
    message: string;
    timestamp: number;
    read: boolean;
    icon: 'construction' | 'sale' | 'purchase' | 'dividend' | 'production' | 'level-up';
};

const BUILDING_SLOTS = 20;

const initialCompanyData: StockListing[] = [
    { id: 'UCHUMI', ticker: 'UCHUMI', companyName: 'Uchumi wa Afrika', stockPrice: 450.75, totalShares: 250000, marketCap: 450.75 * 250000, logo: 'https://picsum.photos/seed/uchumi/40/40', imageHint: 'company logo', creditRating: 'AA+', dailyRevenue: 100000, dividendYield: 0.015, isPlayerCompany: false },
    { id: 'KILIMO', ticker: 'KILIMO', companyName: 'Kilimo Fresh Inc.', stockPrice: 120.50, totalShares: 1000000, marketCap: 120.50 * 1000000, logo: 'https://picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo', creditRating: 'A-', dailyRevenue: 150000, dividendYield: 0.022, isPlayerCompany: false },
];

const initialBondListings: BondListing[] = [
    { id: 1, issuer: 'Serikali ya Tanzania', faceValue: 1000, couponRate: 5.5, maturityDate: '2030-12-31', price: 980, quantityAvailable: 500, creditRating: 'A+', issuerLogo: 'https://picsum.photos/seed/tza-gov/40/40', imageHint: 'government seal' },
    { id: 2, issuer: 'Kilimo Fresh Inc.', faceValue: 1000, couponRate: 7.2, maturityDate: '2028-06-30', price: 1010, quantityAvailable: 2000, creditRating: 'BBB', issuerLogo: 'https/picsum.photos/seed/kilimo/40/40', imageHint: 'farm logo' },
];

const getPriceWithQuality = (itemName: string, quality: number) => {
    const basePrice = encyclopediaData.find(e => e.name === itemName)?.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '');
    const price = parseFloat(basePrice || '0');
    if (isNaN(price)) return 0;
    
    // Each quality level adds 20% to the base price
    const qualityBonus = quality * 0.20;
    return price * (1 + qualityBonus);
};


export function Game({ initialProfileViewId, forceAdminView = false }: { initialProfileViewId: string | null, forceAdminView?: boolean }) {
  const { user, loading: userLoading } = useUser();
  const database = getDatabase();
  const router = useRouter();
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [playerListings, setPlayerListings] = React.useState<PlayerListing[]>([]);
  const [contractListings, setContractListings] = React.useState<any[]>([]);
  const [marketShareListings, setMarketShareListings] = React.useState<MarketShareListing[]>([]);
  const [gameStateLoading, setGameStateLoading] = React.useState(true);
  const [view, setView] = React.useState<View>(forceAdminView ? 'admin' : 'dashboard');
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialCompanyData);
  const { toast } = useToast();
  
  // State for viewing other players' profiles
  const [viewedProfileUid, setViewedProfileUid] = React.useState<string | null>(null);
  const [viewedProfileData, setViewedProfileData] = React.useState<UserData | null>(null);
  
  // State for opening private chat from profile
  const [initialPrivateChatUid, setInitialPrivateChatUid] = React.useState<string | null>(null);
  
  // State for public chat metadata
  const [chatMetadata, setChatMetadata] = React.useState<Record<string, ChatMetadata>>({});
  const { players: allPlayers } = useAllPlayers();

  // Dialog states
  const [dialogState, setDialogState] = React.useState({
      build: false,
      manage: false,
      production: false,
      boost: false,
      demolish: false,
      unlock: false,
  });
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);

  // Presidency state
  const [president, setPresident] = React.useState<PlayerPublicData | null>(null);
  const [candidates, setCandidates] = React.useState<any[]>([]);
  const [electionState, setElectionState] = React.useState<'open' | 'closed'>('closed');
  const [votes, setVotes] = React.useState<Record<string, number>>({});


  // Refs for Firebase paths
  const userRef = React.useMemo(() => user ? ref(database, `users/${user.uid}`) : null, [database, user]);
  const playerPublicRef = React.useMemo(() => user ? ref(database, `players/${user.uid}`) : null, [database, user]);
  const marketRef = React.useMemo(() => ref(database, 'market'), [database]);
  const contractsRef = React.useMemo(() => ref(database, 'contracts'), [database]);
  const marketSharesRef = React.useMemo(() => ref(database, 'marketShares'), [database]);
  const chatMetadataRef = React.useMemo(() => ref(database, 'chat-metadata'), [database]);
  const electionRef = React.useMemo(() => ref(database, 'election'), [database]);
  
  const handleSetView = React.useCallback((newView: View) => {
    setView(newView);
    if (newView !== 'profile') {
        setViewedProfileUid(null);
    }
    if (newView !== 'chats') {
        setInitialPrivateChatUid(null);
    }
  }, []);
  
    React.useEffect(() => {
        if (initialProfileViewId) {
            handleViewProfile(initialProfileViewId);
        }
    }, [initialProfileViewId]);


  // Periodically update lastSeen to keep user online
  React.useEffect(() => {
      if (!userRef) return;
      
      const interval = setInterval(() => {
          if(document.hasFocus() && userRef) {
            runTransaction(userRef, (currentData) => {
                if (currentData) {
                    currentData.lastSeen = Date.now();
                }
                return currentData;
            });
          }
      }, 60 * 1000); // every minute

      return () => clearInterval(interval);
  }, [userRef]);

  // Unified listener for all user data
  React.useEffect(() => {
    if (userLoading) return;
    if (!user) {
        router.replace('/');
        return;
    }
    if (!userRef) return;

    const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val() as UserData;
            if (!data.lastPublicRead) {
                data.lastPublicRead = { general: 0, trade: 0, help: 0 };
            }
             // Retroactively add company profile if it's missing
            if (!data.companyProfile || !('securityFund' in data.companyProfile)) {
                const initialData = getInitialUserData(user.uid, data.username, null);
                 data.companyProfile = {
                    ...initialData.companyProfile,
                    ...data.companyProfile // Keep existing values if any
                };
                if (!('securityFund' in data.companyProfile)) {
                    data.companyProfile.securityFund = 0;
                }

                 // Save the updated data back to Firebase
                saveUserData(userRef, data);
            }
            setGameState(data);
        } else {
            // New user, create initial data
            const initialData = getInitialUserData(user.uid, user.displayName || 'Mchezaji', user.email);
            saveUserData(userRef, initialData);
            setGameState(initialData);
        }
        setGameStateLoading(false);
    }, (error) => {
        console.error("Firebase user data listener error:", error);
        setGameStateLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading, database, userRef, router]);
  
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
    if (viewedProfileUid) {
        const profileUserRef = ref(database, `users/${viewedProfileUid}`);
        get(profileUserRef).then((snapshot) => {
            if (snapshot.exists()) {
                setViewedProfileData(snapshot.val() as UserData);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not find player profile.' });
                setViewedProfileUid(null);
            }
        });
    } else {
        setViewedProfileData(null);
    }
  }, [viewedProfileUid, database, toast]);

    // Listen for election changes
  React.useEffect(() => {
      if (!electionRef || !allPlayers) return;

      const unsubscribe = onValue(electionRef, (snapshot) => {
          const electionData = snapshot.val();
          if (electionData) {
              setElectionState(electionData.state || 'closed');
               const candidatesData = electionData.candidates || {};
                const candidatesList = Object.keys(candidatesData).map(key => ({
                    id: key,
                    ...candidatesData[key]
                }));
              setCandidates(candidatesList || []);
              setVotes(electionData.votes || {});
              const presidentPlayer = allPlayers.find(p => p.uid === electionData.presidentUid);
              setPresident(presidentPlayer || null);
          } else {
              setPresident(null);
          }
      });

      return () => unsubscribe();
  }, [electionRef, allPlayers]);
  
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
        const listings: any[] = [];
        snapshot.forEach(childSnapshot => {
            listings.push({ id: childSnapshot.key!, ...childSnapshot.val() } as any);
        });
        setContractListings(listings);
    });
    return () => unsubscribe();
  }, [contractsRef]);

    // Listen for market share changes
  React.useEffect(() => {
    if (!marketSharesRef) return;
    const unsubscribe = onValue(marketSharesRef, (snapshot) => {
        const listings: MarketShareListing[] = [];
        snapshot.forEach(childSnapshot => {
            listings.push({ orderId: childSnapshot.key!, ...childSnapshot.val() } as MarketShareListing);
        });
        setMarketShareListings(listings);
    });
    return () => unsubscribe();
  }, [marketSharesRef]);

  // Update public player data (RTDB) whenever critical info changes
  React.useEffect(() => {
    if (!gameState || !gameState.uid || !gameState.username || !user || !playerPublicRef) return;
    
    // Admin role is supreme and should not be overridden by presidency
    const finalRole = gameState.role === 'admin' ? 'admin' : (president?.uid === gameState.uid ? 'president' : 'player');

    const publicData: PlayerPublicData = {
        uid: gameState.uid,
        username: gameState.username,
        netWorth: gameState.netWorth,
        avatar: gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/40/40`,
        level: gameState.playerLevel,
        role: finalRole,
    };

    runTransaction(playerPublicRef, (currentPublicData) => {
      return publicData;
    });

  }, [gameState, playerPublicRef, user, president]);


  const getXpForNextLevel = (level: number) => {
    return level * 1000;
  };
  
 const addNotification = React.useCallback((message: string, icon: Notification['icon']) => {
    if (!userRef || !user) return;
    runTransaction(userRef, (currentData) => {
        if (currentData) {
            const newNotifRef = push(ref(database, `users/${user.uid}/notifications`));
            const newNotification: Notification = {
                id: newNotifRef.key!,
                message,
                timestamp: Date.now(),
                read: false,
                icon,
            };
            currentData.notifications = {...(currentData.notifications || {}), [newNotifRef.key!]: newNotification};
        }
        return currentData;
    });
  }, [userRef, user, database]);


 const addTransaction = React.useCallback((type: 'income' | 'expense', amount: number, description: string) => {
    if (!userRef || !user) return;
    runTransaction(userRef, (currentData) => {
        if (currentData) {
            const newTransRef = push(ref(database, `users/${user.uid}/transactions`));
            const newTransaction: Transaction = {
                id: newTransRef.key!,
                type,
                amount,
                description,
                timestamp: Date.now(),
            };
            currentData.transactions = {...(currentData.transactions || {}), [newTransRef.key!]: newTransaction};
        }
        return currentData;
    });
}, [userRef, user, database]);


  const handleMarkNotificationsRead = () => {
    if (!gameState || !userRef) return;
    runTransaction(userRef, (currentData) => {
        if (currentData && currentData.notifications) {
            for (const key in currentData.notifications) {
                currentData.notifications[key].read = true;
            }
        }
        return currentData;
    });
  }

  const handleUpdateProfile = (data: ProfileData) => {
    if (!allPlayers || !gameState || !userRef || !marketRef || !user) return;
  
    const newName = data.playerName;
    const newAvatar = data.avatarUrl;
    const newSector = data.sector;

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
        
    // 1. Update the user's private data
    runTransaction(userRef, (currentData) => {
        if (currentData) {
            currentData.username = newName;
            currentData.avatarUrl = newAvatar;
            currentData.privateNotes = data.privateNotes || '';
            // Only set sector if it's not already set
            if (!currentData.sector && newSector) {
                currentData.sector = newSector;
            }
            
            // Ensure companyProfile exists before updating it
             if (!currentData.companyProfile) {
                const initial = getInitialUserData(currentData.uid, newName, null);
                currentData.companyProfile = initial.companyProfile;
            }
            currentData.companyProfile.companyName = newName;
            currentData.companyProfile.logo = newAvatar || '';
            currentData.companyProfile.sector = newSector;
        }
        return currentData;
    }).then(() => {
        // 2. After successful update, find and update all market listings
        const updates: Record<string, any> = {};
        playerListings.forEach(listing => {
            if (listing.sellerUid === user.uid) {
                updates[`/market/${listing.id}/seller`] = newName;
                updates[`/market/${listing.id}/avatar`] = newAvatar;
            }
        });
  
        // 3. Perform the multi-path update on the market
        if (Object.keys(updates).length > 0) {
            update(ref(database), updates);
        }
  
        toast({ title: 'Wasifu Umehifadhiwa', description: 'Mabadiliko yako yamehifadhiwa kote.' });
        handleSetView('dashboard');
    }).catch(error => {
        console.error("Profile update failed:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update profile.' });
    });
  }

  const handleChangeSector = (newSector: string) => {
    if (!userRef || !gameState) return;
    const cost = 100;
    if (gameState.stars < cost) {
      toast({
        variant: 'destructive',
        title: 'Nyota Hazitoshi',
        description: `Unahitaji nyota ${cost} kubadilisha sekta.`,
      });
      return;
    }

    runTransaction(userRef, (currentData) => {
      if (currentData && currentData.stars >= cost) {
        currentData.stars -= cost;
        currentData.sector = newSector;
        if (currentData.companyProfile) {
          currentData.companyProfile.sector = newSector;
        }
      }
      return currentData;
    }).then(() => {
      toast({ title: 'Sekta Imebadilishwa', description: `Sasa unashiriki katika sekta ya ${newSector}.` });
    }).catch((error) => {
      console.error("Sector change failed:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not change sector.' });
    });
  };

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

  const handleUnlockSlot = (slotIndex: number) => {
    if (!userRef || !user || !gameState) return;

    const calculateUnlockCost = (index: number) => {
        if (index < 10) return 0;
        const baseCost = 650;
        const exponent = index - 10;
        return Math.floor(baseCost * Math.pow(1.6, exponent));
    };

    const cost = calculateUnlockCost(slotIndex);
    if (gameState.stars < cost) {
        toast({ variant: 'destructive', title: 'Nyota Hazitoshi', description: `Unahitaji nyota ${cost.toLocaleString()} kufungua nafasi hii.`});
        return;
    }

    runTransaction(userRef, (currentData) => {
        if (currentData && currentData.stars >= cost) {
            currentData.stars -= cost;
            currentData.buildingSlots[slotIndex].locked = false;
        }
        return currentData;
    }).then(() => {
        toast({ title: "Nafasi Imefunguliwa!", description: "Sasa unaweza kujenga kwenye nafasi hii mpya." });
    }).catch(error => {
        toast({ variant: 'destructive', title: 'Imeshindikana Kufungua', description: error.message });
    });
  };
  
  const handleBuild = (slotIndex: number, building: any) => {
    if (!userRef || !user) return;

    runTransaction(userRef, (currentData) => {
        if (!currentData) return currentData;

        const costs = buildingData[building.id]?.buildCost;
        if (!costs) return currentData;

        for (const cost of costs) {
            const inventoryItem = currentData.inventory.find((i: InventoryItem) => i.item === cost.name);
            if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
                // Not enough materials, abort transaction by returning undefined
                return;
            }
        }

        const now = Date.now();
        const constructionTimeMs = 15 * 60 * 1000;

        // Deduct costs
        for (const cost of costs) {
            const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === cost.name);
            if (itemIndex > -1) {
                currentData.inventory[itemIndex].quantity -= cost.quantity;
            }
        }
        currentData.inventory = currentData.inventory.filter((i: InventoryItem) => i.quantity > 0);


        // Add new building
        currentData.buildingSlots[slotIndex] = {
            building,
            level: 0,
            construction: { startTime: now, endTime: now + constructionTimeMs, targetLevel: 1 },
        };
        
        // Add notification
        const newNotifRef = push(ref(database, `users/${user.uid}/notifications`));
        const newNotification: Notification = { 
            id: newNotifRef.key!, 
            message: `Ujenzi wa ${building.name} umeanza.`, 
            timestamp: now, 
            read: false, 
            icon: 'construction' 
        };
        currentData.notifications = { ...(currentData.notifications || {}), [newNotifRef.key!]: newNotification };

        return currentData;
    }).catch(error => console.error("Build transaction failed: ", error));
  };
  
  const handleUpgradeBuilding = (slotIndex: number) => {
    if (!userRef || !user) return;

    runTransaction(userRef, (currentData) => {
        if (!currentData) return currentData;

        const slot = currentData.buildingSlots[slotIndex];
        if (!slot || !slot.building) return currentData;

        const costs = buildingData[slot.building.id].upgradeCost(slot.level + 1);
        for (const cost of costs) {
            const inventoryItem = currentData.inventory.find((i: InventoryItem) => i.item === cost.name);
            if (!inventoryItem || inventoryItem.quantity < cost.quantity) {
                // Abort
                return;
            }
        }

        const now = Date.now();
        const constructionTimeMs = (15 * 60 * 1000) * Math.pow(2, slot.level);

        // Deduct costs
        for (const cost of costs) {
            const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === cost.name);
            if (itemIndex > -1) {
                currentData.inventory[itemIndex].quantity -= cost.quantity;
            }
        }
        currentData.inventory = currentData.inventory.filter((i: InventoryItem) => i.quantity > 0);

        // Update slot with construction info
        currentData.buildingSlots[slotIndex].construction = { 
            startTime: now, 
            endTime: now + constructionTimeMs, 
            targetLevel: slot.level + 1 
        };
        
        // Add notification
        const notifRef = push(ref(database, `users/${user.uid}/notifications`));
        const newNotification: Notification = { 
            id: notifRef.key!, 
            message: `Uboreshaji wa ${slot.building.name} hadi Lvl ${slot.level + 1} umeanza.`, 
            timestamp: Date.now(), 
            read: false, 
            icon: 'construction' 
        };
        currentData.notifications = { ...(currentData.notifications || {}), [newNotification.id]: newNotification };

        return currentData;
    });
  };

  const handleDemolishBuilding = (slotIndex: number) => {
    if (!userRef) return;
    runTransaction(userRef, (currentData) => {
        if (currentData) {
            currentData.buildingSlots[slotIndex] = { building: null, level: 0 };
        }
        return currentData;
    });
  };

  const handleStartProduction = (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => {
     if (!userRef || !user) return;
     runTransaction(userRef, (currentData) => {
         if (!currentData) return;

         for (const input of (recipe.inputs || [])) {
             const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === input.name);
             if (itemIndex === -1 || currentData.inventory[itemIndex].quantity < input.quantity * quantity) {
                 return; // Abort
             }
             currentData.inventory[itemIndex].quantity -= input.quantity * quantity;
         }
         currentData.inventory = currentData.inventory.filter((i: InventoryItem) => i.quantity > 0);


         const slot = currentData.buildingSlots[slotIndex];
         if (slot && slot.building && !slot.activity) {
             currentData.buildingSlots[slotIndex].activity = {
                 type: 'produce',
                 recipeId: recipe.output.name,
                 quantity: recipe.output.quantity * quantity,
                 saleValue: 0,
                 startTime: Date.now(),
                 endTime: Date.now() + durationMs,
             };
         }
         
         const notifRef = push(ref(database, `users/${user.uid}/notifications`));
         const newNotification: Notification = { 
            id: notifRef.key!, 
            message: `Umeanza kuzalisha ${recipe.output.quantity * quantity}x ${recipe.output.name}.`, 
            timestamp: Date.now(), 
            read: false, 
            icon: 'production' 
         };
         currentData.notifications = { ...(currentData.notifications || {}), [newNotification.id]: newNotification };
         
         return currentData;
     });
  };

  const handleStartSelling = (slotIndex: number, item: InventoryItem, quantity: number, price: number, durationMs: number) => {
    if (!userRef || !user) return;
    runTransaction(userRef, (currentData) => {
        if (!currentData) return;

        const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === item.item);
        if (itemIndex === -1 || currentData.inventory[itemIndex].quantity < quantity) {
            return; // Abort
        }
        currentData.inventory[itemIndex].quantity -= quantity;
        currentData.inventory = currentData.inventory.filter((i: InventoryItem) => i.quantity > 0);


        const slot = currentData.buildingSlots[slotIndex];
        if (slot && slot.building && !slot.activity) {
            currentData.buildingSlots[slotIndex].activity = {
                type: 'sell',
                recipeId: item.item,
                quantity,
                saleValue: quantity * price,
                startTime: Date.now(),
                endTime: Date.now() + durationMs,
            };
        }
        
        const notifRef = push(ref(database, `users/${user.uid}/notifications`));
        const newNotification: Notification = { 
            id: notifRef.key!, 
            message: `Umeanza kuuza ${quantity}x ${item.item}.`, 
            timestamp: Date.now(), read: false, 
            icon: 'sale' 
        };
        currentData.notifications = { ...(currentData.notifications || {}), [newNotification.id]: newNotification };

        return currentData;
    });
  };

  const handleBoostConstruction = (slotIndex: number, starsToUse: number) => {
    if (!userRef || starsToUse <= 0) return;
    runTransaction(userRef, (currentData) => {
        if (!currentData || currentData.stars < starsToUse) return; // Abort

        const timeReduction = starsToUse * 3 * 60 * 1000;
        const slot = currentData.buildingSlots[slotIndex];
        if (slot && slot.construction) {
            slot.construction.endTime -= timeReduction;
            currentData.stars -= starsToUse;
        }
        return currentData;
    });
  };
  
    const handleBuyMaterial = async (materialName: string, quantity: number): Promise<boolean> => {
        if (!userRef || !user || !gameState) return false;

        const cheapestListing = playerListings
            .filter(l => l.commodity === materialName && l.sellerUid !== user.uid)
            .sort((a, b) => a.price - b.price)[0];

        const systemPrice = getPriceWithQuality(materialName, 0) || Infinity;

        if (cheapestListing && cheapestListing.price <= systemPrice) {
            // Market is cheaper or equal, buy from market
            const quantityToBuy = Math.min(quantity, cheapestListing.quantity);
            try {
                await handleBuyFromMarket(cheapestListing, quantityToBuy);
                const remainingQuantity = quantity - quantityToBuy;
                if (remainingQuantity > 0) {
                    // If more is needed, recursively call to buy the rest (will likely buy from system now)
                    return await handleBuyMaterial(materialName, remainingQuantity);
                }
                return true;
            } catch (error) {
                // If market buy fails for some reason (e.g., item was just sold), fall back to system
                return await buyFromSystem(materialName, quantity);
            }
        } else {
            // System is cheaper or no market listings available, buy from system
            return await buyFromSystem(materialName, quantity);
        }
    };

    const buyFromSystem = async (materialName: string, quantity: number): Promise<boolean> => {
        if (!userRef || !user) return false;
        
        const costPerUnit = getPriceWithQuality(materialName, 0) || 0;
        if (costPerUnit === 0) {
             toast({ variant: 'destructive', title: "Item Not Available", description: `${materialName} cannot be purchased from the system.` });
             return false;
        }

        const totalCost = costPerUnit * quantity;

        try {
            const { committed } = await runTransaction(userRef, (currentData) => {
                if (!currentData || currentData.money < totalCost) {
                    return; // Abort transaction (insufficient funds)
                }
                
                currentData.money -= totalCost;
                
                let newInventory = [...(currentData.inventory || [])];
                const itemIndex = newInventory.findIndex((i: InventoryItem) => i.item === materialName);
                if (itemIndex > -1) {
                    newInventory[itemIndex].quantity += quantity;
                } else {
                    newInventory.push({ item: materialName, quantity, marketPrice: costPerUnit });
                }
                currentData.inventory = newInventory;
                
                const newTransaction: Transaction = {
                    id: push(ref(database, `users/${user.uid}/transactions`)).key!,
                    type: 'expense', amount: totalCost, 
                    description: `Bought ${quantity}x ${materialName} from system`, timestamp: Date.now()
                };
                
                const newNotification: Notification = {
                    id: push(ref(database, `users/${user.uid}/notifications`)).key!,
                    message: `You bought ${quantity}x ${materialName} for $${totalCost.toFixed(2)}.`, 
                    timestamp: Date.now(), read: false, icon: 'purchase'
                };

                currentData.transactions = { ...currentData.transactions, [newTransaction.id]: newTransaction };
                currentData.notifications = { ...currentData.notifications, [newNotification.id]: newNotification };
                
                return currentData;
            });

            if (committed) {
                toast({ title: 'Purchase Successful', description: `Bought ${quantity}x ${materialName} from system.` });
                return true;
            } else {
                toast({ variant: 'destructive', title: "Insufficient Funds" });
                return false;
            }
        } catch (error) {
            console.error("System purchase failed:", error);
            toast({ variant: 'destructive', title: 'Purchase Failed' });
            return false;
        }
    }


  const handleBuyFromMarket = async (listing: PlayerListing, quantityToBuy: number) => {
    if (!user || !gameState || !database) return;
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
        // Step 1: Secure the item from the market listing
        const transactionResult = await runTransaction(listingRef, (currentListing) => {
            if (currentListing === null) {
                return; // Listing already sold or removed, abort
            }
            if (currentListing.quantity < quantityToBuy) {
                 throw new Error("Not enough quantity available.");
            }
            if (currentListing.quantity === quantityToBuy) {
                return null; // Remove the listing entirely
            } else {
                currentListing.quantity -= quantityToBuy;
                return currentListing; // Update the quantity
            }
        });

        if (!transactionResult.committed) {
             throw new Error("Market transaction failed. The item may have been sold.");
        }

        // Step 2: Update buyer's state (money and inventory)
        await runTransaction(userRef!, (currentData) => {
            if (currentData && currentData.money >= totalCost) {
                const newInventory = [...(currentData.inventory || [])];
                const itemIndex = newInventory.findIndex((i: InventoryItem) => i.item === listing.commodity);
                if (itemIndex > -1) {
                    newInventory[itemIndex].quantity += quantityToBuy;
                } else {
                    newInventory.push({ item: listing.commodity, quantity: quantityToBuy, marketPrice: listing.price });
                }
                
                const transRefKey = push(ref(database, `users/${user.uid}/transactions`)).key!;
                const newTransaction: Transaction = { id: transRefKey, type: 'expense', amount: totalCost, description: `Bought ${quantityToBuy}x ${listing.commodity} from ${listing.seller}`, timestamp: Date.now() };

                const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
                const newNotification: Notification = { id: notifRefKey, message: `Umenunua ${quantityToBuy}x ${listing.commodity} from ${listing.seller}`, timestamp: Date.now(), read: false, icon: 'purchase' };

                currentData.money -= totalCost;
                currentData.inventory = newInventory;
                currentData.transactions = { ...currentData.transactions, [transRefKey]: newTransaction };
                currentData.notifications = { ...currentData.notifications, [notifRefKey]: newNotification };
            }
            return currentData;
        });

        // Step 3: Add payment to seller's payout queue (System-Mediated)
        const sellerPayoutsRef = ref(database, `users/${listing.sellerUid}/payouts`);
        const newPayoutRef = push(sellerPayoutsRef);
        await set(newPayoutRef, {
            amount: totalCost,
            description: `Sold ${quantityToBuy}x ${listing.commodity} to ${gameState.username}`,
            timestamp: Date.now()
        });
        
        toast({ title: 'Purchase Successful' });

    } catch (error: any) {
        console.error("Market transaction failed:", error);
        toast({ variant: 'destructive', title: 'Purchase Failed', description: error.message || 'The transaction could not be completed.' });
    }
  };
  
 const handleBuyStock = React.useCallback((stock: StockListing, quantity: number) => {
    if (!userRef || quantity <= 0 || !user || !database) return;
    
    runTransaction(userRef, currentData => {
        if (!currentData) return;
        const totalCost = stock.stockPrice * quantity;
        if (currentData.money < totalCost) return; // Abort

        currentData.money -= totalCost;

        const newPlayerStocks = [...(currentData.playerStocks || [])];
        const existingStockIndex = newPlayerStocks.findIndex(s => s.ticker === stock.ticker);
        if (existingStockIndex > -1) {
            newPlayerStocks[existingStockIndex].shares += quantity;
        } else {
            newPlayerStocks.push({ ticker: stock.ticker, shares: quantity });
        }
        currentData.playerStocks = newPlayerStocks;
        
        const transRefKey = push(ref(database, `users/${user.uid}/transactions`)).key!;
        const newTransaction: Transaction = { id: transRefKey, type: 'expense', amount: totalCost, description: `Nunua hisa ${quantity}x ${stock.ticker}`, timestamp: Date.now() };
        
        const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
        const newNotification: Notification = { id: notifRefKey, message: `Umenunua hisa ${quantity}x ${stock.ticker}.`, timestamp: Date.now(), read: false, icon: 'purchase' };

        currentData.transactions = { ...currentData.transactions, [transRefKey]: newTransaction };
        currentData.notifications = { ...currentData.notifications, [notifRefKey]: newNotification };
        
        return currentData;
    });
  }, [userRef, user, database]);


 const handleSellStock = React.useCallback((ticker: string, shares: number) => {
    if (!userRef || shares <= 0 || !user || !database) return;
    
    const stockInfo = companyData.find(s => s.ticker === ticker);
    if (!stockInfo) return;

    runTransaction(userRef, currentData => {
        if (!currentData) return;

        const playerStock = (currentData.playerStocks || []).find((s: PlayerStock) => s.ticker === ticker);
        if (!playerStock || playerStock.shares < shares) return; // Abort

        const totalSale = stockInfo.stockPrice * shares;
        currentData.money += totalSale;

        const newPlayerStocks = (currentData.playerStocks || []).map((s: PlayerStock) => {
            if (s.ticker === ticker) {
                return { ...s, shares: s.shares - shares };
            }
            return s;
        }).filter((s: PlayerStock) => s.shares > 0);
        currentData.playerStocks = newPlayerStocks;

        const transRefKey = push(ref(database, `users/${user.uid}/transactions`)).key!;
        const newTransaction: Transaction = { id: transRefKey, type: 'income', amount: totalSale, description: `Uza hisa ${shares}x ${ticker}`, timestamp: Date.now() };

        const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
        const newNotification: Notification = { id: notifRefKey, message: `Umeuza hisa ${shares}x ${ticker}.`, timestamp: Date.now(), read: false, icon: 'sale' };

        currentData.transactions = { ...currentData.transactions, [transRefKey]: newTransaction };
        currentData.notifications = { ...currentData.notifications, [notifRefKey]: newNotification };
        
        return currentData;
    });
  }, [userRef, companyData, user, database]);

  const handleIssueShares = (sharesToSell: number, pricePerShare: number) => {
      if (!userRef || !gameState || !netWorth || !database) return;
       // IPO Conditions Check
        if (netWorth < 1000000) {
            toast({ variant: 'destructive', title: 'Thamani ya Kampuni Haitoshi', description: `Unahitaji thamani ya angalau $1,000,000. Thamani yako sasa ni $${netWorth.toLocaleString()}.`});
            return;
        }
        if (gameState.money < 1000000) {
            toast({ variant: 'destructive', title: 'Pesa Taslimu Hazitoshi', description: `Unahitaji kuwa na angalau $1,000,000 taslimu. Una $${gameState.money.toLocaleString()}.`});
            return;
        }

      runTransaction(userRef, (currentData: UserData | null) => {
          if (!currentData || !currentData.companyProfile) return;
          
          const maxSharesPlayerCanSell = currentData.companyProfile.totalShares - 200000;
           if (sharesToSell <= 0 || sharesToSell > maxSharesPlayerCanSell) {
              toast({ variant: 'destructive', title: 'Idadi ya Hisa si Sahihi', description: `Unaweza kuuza hadi hisa ${maxSharesPlayerCanSell.toLocaleString()} pekee.`});
              return; // Abort
          }

          const moneyGained = sharesToSell * pricePerShare;
          currentData.money += moneyGained;
          currentData.companyProfile.availableShares -= sharesToSell;

           // Block the security fund if it hasn't been blocked yet
          if (currentData.companyProfile.securityFund === 0) {
              currentData.money -= 1000000;
              currentData.companyProfile.securityFund = 1000000;
          }
          
          // Add transaction & notification
          const transRef = push(ref(database, `users/${currentData.uid}/transactions`));
          const newTransaction: Transaction = { id: transRef.key!, type: 'income', amount: moneyGained, description: `Uuzaji wa hisa (IPO) ${sharesToSell}x ${currentData.companyProfile.ticker}`, timestamp: Date.now() };
          currentData.transactions = { ...currentData.transactions, [newTransaction.id]: newTransaction };
            
          const notifRef = push(ref(database, `users/${currentData.uid}/notifications`));
          const newNotification: Notification = { id: notifRef.key!, message: `Umefanikiwa kuuza hisa ${sharesToSell.toLocaleString()} za kampuni yako kwa $${moneyGained.toLocaleString()}`, timestamp: Date.now(), read: false, icon: 'sale' };
          currentData.notifications = { ...currentData.notifications, [newNotification.id]: newNotification };

          return currentData;
      }).then(() => {
          toast({ title: 'IPO Imefanikiwa!', description: 'Hisa zako sasa zinapatikana sokoni.'});
      }).catch((err) => {
          toast({ variant: 'destructive', title: 'Uuzaji wa Hisa Umeshindikana', description: err.message });
      })
  };


  const handlePostToMarket = (item: InventoryItem, quantity: number, price: number) => {
     if (!user || !gameState || !userRef || quantity <= 0 || quantity > item.quantity) return;
     // Optimistically update inventory via transaction to be safe
     runTransaction(userRef, (currentData) => {
         if (!currentData) return;
         const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === item.item);
         if (itemIndex === -1 || currentData.inventory[itemIndex].quantity < quantity) {
             toast({ variant: 'destructive', title: 'Insufficient Inventory', description: 'Could not update inventory.' });
             return; // Abort if item not found or not enough quantity
         }
         currentData.inventory[itemIndex].quantity -= quantity;
         currentData.inventory = currentData.inventory.filter((i: InventoryItem) => i.quantity > 0);
         return currentData;
     }).then(transactionResult => {
         if (!transactionResult.committed) {
             return;
         }

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
             quality: (productInfo?.properties.find(p => p.label === 'Quality')?.value ? parseInt(productInfo.properties.find(p => p.label === 'Quality')!.value) : 1) ?? 0,
             imageHint: productInfo?.imageHint || 'product photo'
         };

         set(listingRef, newListing).then(() => {
            toast({ title: 'Item Posted', description: `${quantity}x ${item.item} has been listed on the market.` });
         }).catch(error => {
            console.error("Failed to post to market:", error);
            // Revert inventory change on failure
            runTransaction(userRef, (currentData) => {
                if (currentData) {
                    const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === item.item);
                    if (itemIndex > -1) {
                        currentData.inventory[itemIndex].quantity += quantity;
                    } else {
                        currentData.inventory.push({ ...item, quantity });
                    }
                }
                return currentData;
            });
            toast({ variant: 'destructive', title: 'Failed to List Item' });
         });
     });
  };

  const handleCreateContract = React.useCallback((item: InventoryItem, quantity: number, pricePerUnit: number, targetIdentifier: string) => {
    if (!user || !gameState || !userRef || !allPlayers) return;
    
    runTransaction(userRef, (currentData) => {
        if (!currentData) return;
        const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === item.item);
        if (itemIndex === -1 || currentData.inventory[itemIndex].quantity < quantity) {
            toast({ variant: 'destructive', title: 'Insufficient Inventory', description: `You only have ${currentData.inventory[itemIndex]?.quantity || 0} units to create this contract.` });
            return;
        }
        currentData.inventory[itemIndex].quantity -= quantity;
        currentData.inventory = currentData.inventory.filter((i: InventoryItem) => i.quantity > 0);
        return currentData;
    }).then(transactionResult => {
        if (!transactionResult.committed) {
            return;
        }

        const newContractRef = push(ref(database, 'contracts'));
        const productInfo = encyclopediaData.find(e => e.name === item.item);

        const newContract: Omit<any, 'id'> = {
            commodity: item.item,
            quantity,
            pricePerUnit,
            sellerUid: user.uid,
            sellerName: gameState.username,
            sellerAvatar: gameState.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
            status: 'open',
            createdAt: Date.now(),
            expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000, 
            buyerIdentifier: targetIdentifier,
            imageHint: productInfo?.imageHint || 'product photo'
        };

        set(newContractRef, newContract).then(() => {
            toast({ title: 'Contract Created', description: `Your contract for ${item.item} has been posted.` });

            if (targetIdentifier && allPlayers) {
                const targetPlayer = allPlayers.find(p => p.username.toLowerCase() === targetIdentifier.toLowerCase() || p.uid === targetIdentifier);
                if (targetPlayer) {
                    const targetUserRef = ref(database, `users/${targetPlayer.uid}`);
                    runTransaction(targetUserRef, (targetData) => {
                        if (targetData) {
                            const notifRef = push(ref(database, `users/${targetPlayer.uid}/notifications`));
                            const newNotification: Notification = { 
                                id: notifRef.key!,
                                message: `You have received a new contract from ${gameState.username} for ${quantity}x ${item.item}.`,
                                timestamp: Date.now(),
                                read: false,
                                icon: 'purchase'
                            };
                            targetData.notifications = { ...(targetData.notifications || {}), [newNotification.id]: newNotification };
                        }
                        return targetData;
                    });
                }
            }
        }).catch(error => {
            console.error("Failed to create contract:", error);
            toast({ variant: 'destructive', title: 'Failed to Create Contract' });
            runTransaction(userRef, (currentData) => {
                if(currentData) {
                    const itemIndex = currentData.inventory.findIndex((i: InventoryItem) => i.item === item.item);
                    if (itemIndex > -1) {
                        currentData.inventory[itemIndex].quantity += quantity;
                    } else {
                        currentData.inventory.push({ ...item, quantity });
                    }
                }
                return currentData;
            });
        });
    });
  }, [database, user, gameState, userRef, allPlayers, toast]);

  const handleAcceptContract = React.useCallback(async (contract: any) => {
    if (!user || !gameState || !userRef || !database) return;

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
        await runTransaction(userRef, (currentData) => {
            if (currentData) {
                const newInventory = [...(currentData.inventory || [])];
                const itemIndex = newInventory.findIndex((i: InventoryItem) => i.item === contract.commodity);
                if (itemIndex > -1) {
                    newInventory[itemIndex].quantity += contract.quantity;
                } else {
                    newInventory.push({ item: contract.commodity, quantity: contract.quantity, marketPrice: contract.pricePerUnit });
                }
                
                const transRef = push(ref(database, `users/${user.uid}/transactions`));
                const newTransaction: Transaction = { id: transRef.key!, type: 'expense', amount: totalCost, description: `Contract purchase: ${contract.quantity}x ${contract.commodity}`, timestamp: Date.now() };
                
                currentData.money -= totalCost;
                currentData.inventory = newInventory;
                currentData.transactions = { ...currentData.transactions, [newTransaction.id]: newTransaction };
            }
            return currentData;
        });

        // Add payment to seller's payout queue (System-Mediated)
        if (contract.sellerUid !== 'admin-system') {
            const sellerPayoutsRef = ref(database, `users/${contract.sellerUid}/payouts`);
            const newPayoutRef = push(sellerPayoutsRef);
            await set(newPayoutRef, {
                amount: totalCost,
                description: `Contract sale: ${contract.quantity}x ${contract.commodity} to ${gameState.username}`,
                timestamp: Date.now()
            });
        }

        toast({ title: 'Contract Accepted!', description: `You purchased ${contract.quantity}x ${contract.commodity}.` });

    } catch (error: any) {
        console.error("Contract acceptance failed:", error);
        toast({ variant: 'destructive', title: 'Contract Failed', description: error.message || 'The contract could not be completed.' });
    }
  }, [database, user, gameState, userRef, toast]);
  
  const handleRejectContract = React.useCallback(async (contract: any) => {
    if (!user || !gameState || !userRef) return;

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

                const notifRef = push(ref(database, `users/${contract.sellerUid}/notifications`));
                const newNotification: Notification = { id: notifRef.key!, message: `Your contract for ${contract.quantity}x ${contract.commodity} was rejected. Items have been returned.`, timestamp: Date.now(), read: false, icon: 'purchase' };
                sellerData.notifications = { ...sellerData.notifications, [newNotification.id]: newNotification };
            }
            return sellerData;
        });
    }

    toast({ title: 'Mkataba umekataliwa.' });
  }, [database, user, gameState, toast, userRef]);

  const handleCancelContract = React.useCallback(async (contract: any) => {
    if (!user || !userRef) return;
    if (user.uid !== contract.sellerUid) return;

    const contractRef = ref(database, `contracts/${contract.id}`);
    await remove(contractRef);

    // Return items to seller
    runTransaction(userRef, currentData => {
        if(currentData) {
            const newInventory = [...currentData.inventory];
            const itemIndex = newInventory.findIndex((i: InventoryItem) => i.item === contract.commodity);
            if (itemIndex > -1) {
                newInventory[itemIndex].quantity += contract.quantity;
            } else {
                newInventory.push({ item: contract.commodity, quantity: contract.quantity, marketPrice: contract.pricePerUnit });
            }
            currentData.inventory = newInventory;
        }
        return currentData;
    });

    toast({ title: 'Mkataba umeghairiwa.' });
  }, [database, user, userRef, toast]);

  const handleDailyDividends = React.useCallback(() => {
    if (!userRef || !gameState || !user) return;
    runTransaction(userRef, (currentGameState) => {
        if (!currentGameState || !currentGameState.playerStocks || currentGameState.playerStocks.length === 0) return currentGameState;
        
        let totalDividend = 0;

        for (const playerStock of currentGameState.playerStocks) {
            const stockInfo = companyData.find(s => s.ticker === playerStock.ticker);
            if (stockInfo && stockInfo.dividendYield > 0) {
                const dividendPerShare = stockInfo.stockPrice * stockInfo.dividendYield;
                const dividendEarned = dividendPerShare * playerStock.shares;
                totalDividend += dividendEarned;
                
                const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
                const newNotification: Notification = {
                    id: notifRefKey,
                    message: `Umelipwa gawio la $${dividendEarned.toFixed(2)} kutoka kwa hisa za ${playerStock.ticker}.`,
                    timestamp: Date.now(),
                    read: false,
                    icon: 'dividend',
                };
                currentGameState.notifications = { ...(currentGameState.notifications || {}), [notifRefKey]: newNotification };
            }
        }

        if (totalDividend > 0) {
            const transRefKey = push(ref(database, `users/${user.uid}/transactions`)).key!;
            const newTransaction: Transaction = {
                id: transRefKey,
                type: 'income',
                amount: totalDividend,
                description: 'Jumla ya gawio la hisa',
                timestamp: Date.now(),
            };

            currentGameState.money += totalDividend;
            currentGameState.transactions = {...(currentGameState.transactions || {}), [transRefKey]: newTransaction};
        }
        return currentGameState;
    });
  }, [companyData, userRef, gameState, user, database]);
  
  // Game loop for processing finished activities
  React.useEffect(() => {
    if (!userRef || !gameState || !user) return;
    const activityInterval = setInterval(() => {
        runTransaction(userRef, (currentGameState: UserData | null) => {
            if (!currentGameState) return null;

            const now = Date.now();
            let changed = false;
            
            // Ensure buildingSlots is an array before processing
            if (!currentGameState.buildingSlots || !Array.isArray(currentGameState.buildingSlots)) {
                currentGameState.buildingSlots = Array(BUILDING_SLOTS).fill({ building: null, level: 0 });
            }

            const newBuildingSlots: BuildingSlot[] = JSON.parse(JSON.stringify(currentGameState.buildingSlots));
            let newMoney = currentGameState.money;
            let newXP = currentGameState.playerXP;
            let newLevel = currentGameState.playerLevel;
            const newInventory = [...(currentGameState.inventory || []).map(i => ({...i}))];
            const newTransactions = { ...(currentGameState.transactions || {}) };
            const newNotifications = { ...(currentGameState.notifications || {}) };


            newBuildingSlots.forEach((slot, index) => {
                // Process construction
                if (slot.construction && now >= slot.construction.endTime) {
                    slot.level = slot.construction.targetLevel;
                    const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
                    newNotifications[notifRefKey] = { id: notifRefKey, message: `Ujenzi wa ${slot.building?.name} Lvl ${slot.level} umekamilika!`, timestamp: now, read: false, icon: 'construction' };
                    newXP += 100 * slot.level;
                    delete slot.construction;
                    changed = true;
                }

                // Process activity
                if (slot.activity && now >= slot.activity.endTime) {
                    if (slot.activity.type === 'produce') {
                        const { quantity, recipeId: itemName } = slot.activity;
                        const itemIndex = newInventory.findIndex((i: InventoryItem) => i.item === itemName);
                        if (itemIndex !== -1) {
                            newInventory[itemIndex].quantity += quantity;
                        } else {
                            newInventory.push({ item: itemName, quantity, marketPrice: getPriceWithQuality(itemName, slot.quality || 0) });
                        }
                        const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
                        newNotifications[notifRefKey] = { id: notifRefKey, message: `Uzalishaji wa ${quantity}x ${itemName} umekamilika.`, timestamp: now, read: false, icon: 'production' };
                        newXP += quantity * 2;
                    } else if (slot.activity.type === 'sell') {
                        const { saleValue, quantity, recipeId: itemName } = slot.activity;
                        const profit = saleValue * 0.95; // 5% tax
                        const transRefKey = push(ref(database, `users/${user.uid}/transactions`)).key!;
                        newTransactions[transRefKey] = { id: transRefKey, type: 'income', amount: profit, description: `Mauzo ya ${quantity}x ${itemName}`, timestamp: now };
                        newMoney += profit;
                        const notifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
                        newNotifications[notifRefKey] = { id: notifRefKey, message: `Umefanikiwa kuuza ${quantity}x ${itemName} kwa $${profit.toFixed(2)}.`, timestamp: now, read: false, icon: 'sale' };
                        newXP += Math.floor(profit * 0.01);
                    }
                    delete slot.activity;
                    changed = true;
                }
            });
            
            if (changed) {
                // Level up check
                let xpForNextLevel = getXpForNextLevel(newLevel);
                while (newXP >= xpForNextLevel) {
                    newXP -= xpForNextLevel;
                    newLevel++;
                    const levelUpNotifRefKey = push(ref(database, `users/${user.uid}/notifications`)).key!;
                    newNotifications[levelUpNotifRefKey] = { id: levelUpNotifRefKey, message: `Hongera! Umefikia Level ${newLevel}!`, timestamp: now, read: false, icon: 'level-up' };
                    xpForNextLevel = getXpForNextLevel(newLevel);
                }
                
                currentGameState.buildingSlots = newBuildingSlots;
                currentGameState.inventory = newInventory.filter((i: InventoryItem) => i.quantity > 0);
                currentGameState.money = newMoney;
                currentGameState.transactions = newTransactions;
                currentGameState.playerXP = newXP;
                currentGameState.playerLevel = newLevel;
                currentGameState.notifications = newNotifications;
            }
            
            return currentGameState;
        });
    }, 1000);

    const dividendInterval = setInterval(() => {
        handleDailyDividends();
    }, 24 * 60 * 60 * 1000); // Once every 24 hours

    const payoutInterval = setInterval(() => {
        if (!userRef || !user) return;
        const payoutsRef = ref(database, `users/${user.uid}/payouts`);
        
        runTransaction(payoutsRef, (payouts) => {
            if (payouts) {
                const payoutUpdates: any = {};
                Object.keys(payouts).forEach(payoutId => {
                    const payout = payouts[payoutId];
                    // Add to user's main transaction log
                    addTransaction('income', payout.amount, payout.description);
                    // Add notification
                    addNotification(`You were paid $${payout.amount.toFixed(2)} for: ${payout.description}`, 'sale');
                    // Add money directly
                    runTransaction(userRef, (userData) => {
                        if (userData) {
                            userData.money += payout.amount;
                        }
                        return userData;
                    });
                });
                return null; // Clear all processed payouts
            }
            return payouts;
        });
    }, 5000); // Process payouts every 5 seconds

    return () => {
        clearInterval(activityInterval);
        clearInterval(dividendInterval);
        clearInterval(payoutInterval);
    };
  }, [userRef, gameState, handleDailyDividends, user, database, addTransaction, addNotification]);

  const { netWorth, buildingValue, stockValue, inventoryValue } = React.useMemo(() => {
    if (!gameState) return { netWorth: 0, buildingValue: 0, stockValue: 0, inventoryValue: 0 };

    const currentStockValue = (gameState.playerStocks || []).reduce((total, stock) => {
        const stockInfo = companyData.find(s => s.ticker === stock.ticker);
        return total + (stockInfo ? stockInfo.stockPrice * stock.shares : 0);
    }, 0);

    const currentBuildingValue = (gameState.buildingSlots || []).reduce((total, slot) => {
        if (!slot?.building || slot.level === 0) return total;
        const buildConfig = buildingData[slot.building.id];
        if (!buildConfig) return total;
    
        let totalCostToLevel = (buildConfig.buildCost || []).reduce((sum, material) => {
            const price = getPriceWithQuality(material.name, 0) || 0;
            return sum + (price * material.quantity);
        }, 0);
    
        for (let i = 2; i <= slot.level; i++) {
            const upgradeCosts = buildConfig.upgradeCost(i);
            totalCostToLevel += upgradeCosts.reduce((sum, material) => {
                const price = getPriceWithQuality(material.name, 0) || 0;
                return sum + (price * material.quantity);
            }, 0);
        }
    
        return total + totalCostToLevel * 0.5; // 50% depreciation
    }, 0);

    const currentInventoryValue = (gameState.inventory || []).reduce((total, item) => {
        // Find the building that produces this item to determine quality
        const producingBuildingSlot = gameState.buildingSlots.find(slot => slot.building && buildingData[slot.building.id] && recipes.some(r => r.buildingId === slot.building!.id && r.output.name === item.item));
        const quality = producingBuildingSlot?.quality || 0;
        
        const price = getPriceWithQuality(item.item, quality) || item.marketPrice || 0;
        return total + (item.quantity * price);
    }, 0);

    const currentNetWorth = gameState.money + currentStockValue + currentBuildingValue + currentInventoryValue;

    return { 
        netWorth: currentNetWorth, 
        buildingValue: currentBuildingValue, 
        stockValue: currentStockValue, 
        inventoryValue: currentInventoryValue 
    };
  }, [gameState, companyData]);


  // Sync net worth to Firebase if it changes
  React.useEffect(() => {
    if (!userRef || !gameState) return;
    if (Math.abs(netWorth - gameState.netWorth) > 1) { // Use a small threshold to avoid float precision issues
      runTransaction(userRef, (currentData) => {
        if (currentData) {
          currentData.netWorth = netWorth;
        }
        return currentData;
      });
    }
  }, [netWorth, userRef, gameState?.netWorth]);


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


  const handleRunForPresidency = React.useCallback((slogan: string) => {
      if (!user || !gameState || !electionRef) return;
      const cost = 10000; // New cost in Star Boosts
      if (gameState.stars < cost) {
          toast({ variant: 'destructive', title: 'Nyota Hazitoshi', description: `Unahitaji nyota ${cost.toLocaleString()} kugombea urais.`});
          return;
      }
      
      const isAlreadyCandidate = candidates.some(c => c.uid === user.uid);
      if (isAlreadyCandidate) {
          toast({ variant: 'destructive', title: 'Tayari wewe ni mgombea.'});
          return;
      }

      runTransaction(userRef, (currentData) => {
          if (currentData && currentData.stars >= cost) {
              currentData.stars -= cost;
              return currentData;
          }
          return;
      }).then(({ committed }) => {
          if (committed) {
              const candidateData = {
                  uid: user.uid,
                  username: gameState.username,
                  avatar: gameState.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
                  slogan: slogan || "Nitaongoza kwa Haki na Maendeleo!",
              };
              const candidatesRef = ref(database, `election/candidates/${user.uid}`);
              set(candidatesRef, candidateData);
              toast({ title: 'Umefanikiwa Kujisajili!', description: 'Sasa wewe ni mgombea wa urais.'});
          } else {
              toast({ variant: 'destructive', title: 'Nyota Hazitoshi'});
          }
      });
  }, [user, gameState, electionRef, candidates, database, toast, userRef]);

  const handleVote = React.useCallback((candidateUid: string) => {
      if (!user || !gameState || !electionRef) return;
      const cost = 100; // Cost in stars
      if (gameState.stars < cost) {
          toast({ variant: 'destructive', title: 'Nyota Hazitoshi', description: `Unahitaji nyota ${cost.toLocaleString()} kupiga kura.`});
          return;
      }

      runTransaction(userRef, (currentData) => {
          if (currentData && currentData.stars >= cost) {
              currentData.stars -= cost;
              return currentData;
          }
          return;
      }).then(({ committed }) => {
          if (committed) {
              const voteRef = ref(database, `election/votes/${candidateUid}`);
              runTransaction(voteRef, (currentVotes) => (currentVotes || 0) + 1);
              toast({ title: 'Kura Imepigwa!', description: 'Asante kwa kushiriki katika demokrasia.'});
          } else {
              toast({ variant: 'destructive', title: 'Nyota Hazitoshi'});
          }
      });
  }, [user, gameState, electionRef, database, toast, userRef]);

  const onAdminAppointPresident = React.useCallback((uid: string) => {
    const updates: Record<string, any> = {};
    updates[`/election/presidentUid`] = uid;
    updates[`/users/${uid}/role`] = 'president';
    updates[`/players/${uid}/role`] = 'president';
    update(ref(database), updates);
  }, [database]);

  const onAdminRemovePresident = React.useCallback(() => {
    if (president) {
      const updates: Record<string, any> = {};
      updates[`/election/presidentUid`] = null;
      updates[`/users/${president.uid}/role`] = 'player';
      updates[`/players/${president.uid}/role`] = 'player';
      update(ref(database), updates);
    }
  }, [database, president]);

  const onAdminManageElection = React.useCallback((state: 'open' | 'closed') => {
    update(ref(database), { '/election/state': state });
  }, [database]);

  const onAdminRemoveCandidate = React.useCallback((candidateId: string) => {
      const candidateRef = ref(database, `election/candidates/${candidateId}`);
      remove(candidateRef);
  }, [database]);


  if (userLoading || gameStateLoading || !allPlayers) {
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
  
  const isAdmin = user.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2' || gameState.role === 'admin';
  const isPresident = president?.uid === user.uid;

  let role: 'player' | 'admin' | 'president' = 'player';
  if (isAdmin) {
    role = 'admin';
  } else if (isPresident) {
    role = 'president';
  }

  const currentProfile: ProfileData = {
      uid: gameState.uid,
      playerName: gameState.username,
      avatarUrl: gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/100/100`,
      privateNotes: gameState.privateNotes,
      status: gameState.status,
      lastSeen: new Date(gameState.lastSeen || Date.now()),
      role: role,
      sector: gameState.sector,
  };
  
  const viewedProfileForDisplay: ProfileData | null = viewedProfileData ? {
        uid: viewedProfileData.uid,
        playerName: viewedProfileData.username,
        avatarUrl: viewedProfileData.avatarUrl || `https://picsum.photos/seed/${viewedProfileData.uid}/100/100`,
        privateNotes: viewedProfileData.privateNotes,
        status: viewedProfileData.status,
        lastSeen: new Date(viewedProfileData.lastSeen || Date.now()),
        role: viewedProfileData.role,
        sector: viewedProfileData.sector,
  } : null;

  const sortedPlayers = [...allPlayers].sort((a, b) => b.netWorth - a.netWorth);

  const getMetricsForProfile = (profileData: UserData | null): PlayerMetrics => {
    if (!profileData || !allPlayers) return { netWorth: 0, inventoryValue: 0, buildingValue: 0, stockValue: 0, ranking: 'N/A', rating: 'D' };
    
    const publicData = allPlayers.find(p => p.uid === profileData.uid);
    const currentNetWorth = publicData?.netWorth || profileData.netWorth;

    const rank = sortedPlayers.findIndex(p => p.uid === profileData.uid);
    
    // For the current player, use the detailed, memoized values
    if (profileData.uid === user.uid) {
        return {
            netWorth: netWorth,
            inventoryValue: inventoryValue,
            buildingValue: buildingValue,
            stockValue: stockValue,
            ranking: rank !== -1 ? `#${rank + 1}` : '100+',
            rating: getPlayerRating(netWorth),
        }
    }
    
    // For other players, this is a simplification and only shows Net Worth correctly.
    // We would need to fetch their full user data to calculate other values.
    return {
        netWorth: currentNetWorth,
        inventoryValue: 0, // Not calculated for other players to save performance
        buildingValue: 0, // Not calculated for other players
        stockValue: 0, // Not calculated for other players
        ranking: rank !== -1 ? `#${rank + 1}` : '100+',
        rating: getPlayerRating(currentNetWorth),
    }
  }

  const currentPlayerRank = sortedPlayers.findIndex(p => p.uid === user.uid) + 1;
  
  const stockListingsWithShares = companyData.map(s => ({...s, sharesAvailable: Math.floor(s.totalShares * 0.4)}));

  const handlePublicRoomRead = (roomId: string) => {
    if (user) {
        const readRef = ref(database, `users/${user.uid}/lastPublicRead/${roomId}`);
        set(readRef, Date.now());
    }
  };
  
    const handleCardClick = (slot: BuildingSlot, index: number) => {
        setSelectedSlotIndex(index);
        if (slot.locked) {
            setDialogState(prev => ({ ...prev, unlock: true }));
        } else if (slot.construction) {
            setDialogState(prev => ({ ...prev, boost: true }));
        } else if (slot.building && !slot.activity) {
            setDialogState(prev => ({ ...prev, manage: true }));
        } else if (!slot.building) {
            setDialogState(prev => ({ ...prev, build: true }));
        }
    }


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard 
                    buildingSlots={gameState.buildingSlots || []} 
                    inventory={gameState.inventory || []} 
                    stars={gameState.stars}
                    playerRank={currentPlayerRank}
                    isPresident={isPresident}
                    playerSector={gameState.sector}
                    onBuild={handleBuild} 
                    onStartProduction={handleStartProduction} 
                    onStartSelling={handleStartSelling} 
                    onBoostConstruction={handleBoostConstruction} 
                    onUpgradeBuilding={handleUpgradeBuilding} 
                    onUpgradeQuality={() => {}}
                    onDemolishBuilding={handleDemolishBuilding} 
                    onBuyMaterial={handleBuyMaterial} 
                    onUnlockSlot={handleUnlockSlot} 
                    onCardClick={handleCardClick} 
                    dialogState={dialogState}
                    setDialogState={setDialogState}
                    selectedSlotIndex={selectedSlotIndex}
                 />;
      case 'inventory':
        return <Inventory inventoryItems={gameState.inventory || []} playerStocks={gameState.playerStocks || []} stockListings={companyData} contractListings={contractListings || []} onPostToMarket={handlePostToMarket} onCreateContract={handleCreateContract} onAcceptContract={handleAcceptContract} onRejectContract={handleRejectContract} onCancelContract={handleCancelContract} onSellStock={handleSellStock} onIssueShares={handleIssueShares} currentUserId={user.uid} currentUsername={gameState.username} companyProfile={gameState.companyProfile} netWorth={netWorth} playerMoney={gameState.money} />;
      case 'market':
        return <TradeMarket playerListings={playerListings} stockListings={stockListingsWithShares} bondListings={initialBondListings} inventory={gameState.inventory || []} onBuyStock={handleBuyStock} onBuyFromMarket={handleBuyFromMarket} playerName={gameState.username} marketShareListings={marketShareListings} onRunForPresidency={handleRunForPresidency} onVote={handleVote} president={president} candidates={candidates} electionState={electionState} votes={votes} currentUser={gameState} />;
      case 'encyclopedia':
        return <Encyclopedia />;
      case 'chats':
          return <Chats user={{ uid: gameState.uid, username: gameState.username, avatarUrl: gameState.avatarUrl }} initialPrivateChatUid={initialPrivateChatUid} onChatOpened={handleChatOpened} players={allPlayers || []} chatMetadata={chatMetadata} unreadPublicChats={unreadPublicChats} onPublicRoomRead={handlePublicRoomRead} president={president} />;
      case 'accounting':
          return <Accounting 
                    transactions={Object.values(gameState.transactions || {}).sort((a,b) => b.timestamp - a.timestamp)} 
                    netWorth={netWorth}
                    inventoryValue={inventoryValue}
                    stockValue={stockValue}
                    buildingValue={buildingValue}
                    cash={gameState.money}
                 />;
      case 'leaderboard':
          return <Leaderboard onViewProfile={handleViewProfile} president={president} />;
      case 'profile':
          if (viewedProfileForDisplay) {
            return <PlayerProfile 
                        currentProfile={viewedProfileForDisplay} 
                        metrics={getMetricsForProfile(viewedProfileData)}
                        onSave={handleUpdateProfile} 
                        onChangeSector={handleChangeSector}
                        isViewOnly={true}
                        onBack={handleBackFromProfileView}
                        viewerRole={gameState.role}
                        setView={setView}
                        onStartPrivateChat={handleStartPrivateChat}
                        isPresident={viewedProfileData?.uid === president?.uid}
                        stars={gameState.stars}
                    />;
        }
        return <PlayerProfile onSave={handleUpdateProfile} onChangeSector={handleChangeSector} currentProfile={currentProfile} metrics={getMetricsForProfile(gameState)} setView={setView} onStartPrivateChat={handleStartPrivateChat} isPresident={isPresident} stars={gameState.stars} />;
      case 'admin':
        return <AdminPanel
                  onViewProfile={handleViewProfile}
                  president={president}
                  electionState={electionState}
                  candidates={candidates}
                  onAdminAppointPresident={onAdminAppointPresident}
                  onAdminRemovePresident={onAdminRemovePresident}
                  onAdminManageElection={onAdminManageElection}
                  onAdminRemoveCandidate={onAdminRemoveCandidate}
                />;
      case 'office':
        // Placeholder for the "Ofisi" view
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ofisi ya Rais</CardTitle>
                    <CardDescription>Zana za kusimamia nchi (zinakuja hivi karibuni).</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming Soon...</p>
                </CardContent>
            </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AppHeader 
        money={gameState.money} 
        stars={gameState.stars} 
        setView={handleSetView} 
        playerName={gameState.username} 
        playerAvatar={gameState.avatarUrl || `https://picsum.photos/seed/${gameState.uid}/40/40`} 
        notifications={Object.values(gameState.notifications || {})} 
        onNotificationsRead={handleMarkNotificationsRead} 
        playerLevel={gameState.playerLevel} 
        playerXP={gameState.playerXP} 
        xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} 
        isAdmin={isAdmin} 
        isPresident={isPresident}
      />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderView()}
      </main>
      <AppFooter 
        activeView={view} 
        setView={handleSetView} 
        unreadMessages={totalUnreadMessages} 
        unreadContracts={unreadContracts} 
        isAdmin={isAdmin}
        isPresident={isPresident}
      />
    </div>
  );
}

    

    

