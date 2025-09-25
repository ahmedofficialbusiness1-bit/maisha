'use client';

import type { BuildingSlot, InventoryItem, PlayerStock, Transaction, Notification } from '@/app/game';
import { encyclopediaData } from '@/lib/encyclopedia-data';

const GAME_STATE_KEY = 'uchumi-wa-afrika-game-state';
const BUILDING_SLOTS = 20;

export type UserData = {
  uid: string;
  username: string;
  privateNotes: string;
  money: number;
  stars: number;
  playerLevel: number;
  playerXP: number;
  inventory: InventoryItem[];
  buildingSlots: BuildingSlot[];
  playerStocks: PlayerStock[];
  transactions: Transaction[];
  notifications: Notification[];
  status: 'online' | 'offline';
  lastSeen: number; 
  netWorth: number;
  role: 'player' | 'admin';
};


const calculatedPrices = encyclopediaData.reduce((acc, item) => {
    const priceString = item.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '');
    if (priceString) {
        acc[item.name] = parseFloat(priceString);
    }
    return acc;
}, {} as Record<string, number>);


export function getInitialUserData(): UserData {
  const startingMoney = 100000;
  const initialItems: InventoryItem[] = [
    { item: 'Mbao', quantity: 5000, marketPrice: calculatedPrices['Mbao'] || 1.15 },
    { item: 'Matofali', quantity: 10000, marketPrice: calculatedPrices['Matofali'] || 2.13 },
  ];
    
  return {
    uid: `local-player-${Date.now()}`,
    username: 'Mchezaji',
    privateNotes: `Karibu kwenye wasifu wangu! Mimi ni Mchezaji, mtaalamu wa kuzalisha bidhaa bora.`,
    money: startingMoney,
    stars: 100,
    playerLevel: 1,
    playerXP: 0,
    inventory: initialItems,
    buildingSlots: Array(BUILDING_SLOTS).fill(null).map(() => ({ building: null, level: 0 })),
    playerStocks: [],
    transactions: [],
    notifications: [],
    status: 'online',
    lastSeen: Date.now(),
    netWorth: startingMoney,
    role: 'admin', // Set to admin for local development
  }
};

export function saveGameState(state: UserData) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  }
}

export function loadGameState(): UserData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const savedState = window.localStorage.getItem(GAME_STATE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error("Failed to parse saved game state:", e);
      return null;
    }
  }
  return null;
}
