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
import { getInitialUserData, saveGameState, loadGameState, type UserData } from '@/services/game-service';
import { useUser, useDatabase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, onValue, DatabaseReference } from 'firebase/database';

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
  const database = useDatabase();
  const router = useRouter();
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [gameStateLoading, setGameStateLoading] = React.useState(true);
  const [view, setView] = React.useState<View>('dashboard');
  const [companyData, setCompanyData] = React.useState<StockListing[]>(initialCompanyData);
  const { toast } = useToast();

  const userRef = React.useMemo(() => {
    if (database && user) {
        return ref(database, `users/${user.uid}`);
    }
    return null;
  }, [database, user]);

  // Load or initialize game state
  React.useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!userRef) {
        // Still waiting for database or user
        return;
    }

    const unsubscribe = onValue(userRef, (snapshot) => {
      setGameStateLoading(false);
      if (snapshot.exists()) {
        setGameState(snapshot.val());
      } else {
        // User exists but has no data, create initial data
        console.log("Creating initial data for new user...");
        const initialData = getInitialUserData(user.uid, user.displayName || 'Mchezaji', user.email);
        saveGameState(userRef, initialData).then(() => {
            setGameState(initialData);
        });
      }
    }, (error) => {
        console.error("Firebase onValue error:", error);
        setGameStateLoading(false);
    });

    return () => unsubscribe();
  }, [user, userLoading, router, userRef]);

  // Save game state whenever it changes
  React.useEffect(() => {
    if (gameState && userRef) {
      saveGameState(userRef, gameState);
    }
  }, [gameState, userRef]);


  const updateState = React.useCallback((updater: (prevState: UserData) => Partial<UserData>) => {
    setGameState(prev => {
        if(!prev) return null;
        const updates = updater(prev);
        const newState = { ...prev, ...updates, lastSeen: Date.now() };
        return newState;
    });
  }, []);


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
        transactions: [newTransaction, ...(prev.transactions || [])]
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

  const handleBuyFromMarket = (listing: PlayerListing, quantityToBuy: number) => {
    addNotification("Soko la wachezaji halipatikani bado.", 'purchase');
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
     addNotification("Soko la wachezaji halipatikani bado.", 'sale');
  };

  // Game loop for processing finished activities
  React.useEffect(() => {
    const interval = setInterval(() => {
        if (!gameState) return;

        const now = Date.now();
        let changed = false;
        
        const newBuildingSlots = [...gameState.buildingSlots.map(s => ({...s, activity: s.activity ? {...s.activity} : undefined, construction: s.construction ? {...s.construction} : undefined }))];

        const finishedActivities: { type: 'construction' | 'production' | 'sale', slotIndex: number, details: any }[] = [];

        newBuildingSlots.forEach((slot, index) => {
            // Process construction
            if (slot.construction && now >= slot.construction.endTime) {
                finishedActivities.push({type: 'construction', slotIndex: index, details: { targetLevel: slot.construction.targetLevel, buildingName: slot.building?.name }});
                slot.level = slot.construction.targetLevel;
                slot.construction = undefined;
                changed = true;
            }

            // Process activity
            if (slot.activity && now >= slot.activity.endTime) {
                if (slot.activity.type === 'produce') {
                    finishedActivities.push({type: 'production', slotIndex: index, details: { ...slot.activity }});
                } else if (slot.activity.type === 'sell') {
                    finishedActivities.push({type: 'sale', slotIndex: index, details: { ...slot.activity }});
                }
                slot.activity = undefined;
                changed = true;
            }
        });
        
        if (changed) {
            updateState(prev => {
                let newMoney = prev.money;
                let newXP = prev.playerXP;
                const newInventory = [...prev.inventory.map(i => ({...i}))];
                let newTransactions = [...prev.transactions];
                let newNotifications = [...prev.notifications];

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


  // Recalculate net worth 
  React.useEffect(() => {
    if (!gameState) return;

    const stockValue = gameState.playerStocks.reduce((total, stock) => {
        const stockInfo = companyData.find(s => s.ticker === stock.ticker);
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
  }, [gameState?.money, gameState?.playerStocks, gameState?.buildingSlots, companyData, gameState?.inventory]);

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
  
  const myLeaderboardRank = 1;

  const profileMetrics: PlayerMetrics = {
    netWorth: gameState.netWorth,
    buildingValue: 0, // placeholder
    stockValue: 0, // placeholder
    ranking: `${myLeaderboardRank}`,
    rating: 'A+', // placeholder
  };
  
  const currentProfile: ProfileData = {
      playerName: gameState.username,
      avatarUrl: `https://picsum.photos/seed/${gameState.uid}/100/100`,
      privateNotes: gameState.privateNotes,
      status: gameState.status,
      lastSeen: new Date(gameState.lastSeen || Date.now()),
      role: gameState.role,
  };
  
  const stockListingsWithShares = companyData.map(s => ({...s, sharesAvailable: Math.floor(s.totalShares * 0.4)}));

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard buildingSlots={gameState.buildingSlots} inventory={gameState.inventory} stars={gameState.stars} onBuild={handleBuild} onStartProduction={handleStartProduction} onStartSelling={handleStartSelling} onBoostConstruction={handleBoostConstruction} onUpgradeBuilding={handleUpgradeBuilding} onDemolishBuilding={handleDemolishBuilding} onBuyMaterial={handleBuyMaterial} />;
      case 'inventory':
        return <Inventory inventoryItems={gameState.inventory} onPostToMarket={handlePostToMarket} />;
      case 'market':
        return <TradeMarket playerListings={[]} stockListings={stockListingsWithShares} bondListings={initialBondListings} inventory={gameState.inventory} onBuyStock={handleBuyStock} onBuyFromMarket={handleBuyFromMarket} playerName={gameState.username} />;
      case 'encyclopedia':
        return <Encyclopedia />;
      case 'chats':
          return <Chats user={{ uid: gameState.uid, username: gameState.username }} />;
      case 'accounting':
          return <Accounting transactions={gameState.transactions} />;
      case 'leaderboard':
          return <Leaderboard allPlayers={[{uid: 'local-player', username: gameState.username, netWorth: gameState.netWorth, avatar: `https://picsum.photos/seed/${gameState.uid}/40/40`}]} />;
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
