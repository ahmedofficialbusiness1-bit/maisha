import { getDatabase, ref, get, set, DatabaseReference } from 'firebase/database';
import type { PlayerStock } from '@/app/game';

// Define the shape of the user data
export type UserData = {
  uid: string;
  username: string;
  email: string | null;
  lastLogin: number;
  money: number;
  stars: number;
  netWorth: number;
  buildingSlots: any[]; // Adjust this type based on your BuildingSlot definition
  inventory: any[]; // Adjust this type
  playerStocks: PlayerStock[];
  transactions: any[];
  notifications: any[];
  playerLevel: number;
  playerXP: number;
  privateNotes: string;
  status: 'online' | 'offline';
  role: 'player' | 'admin';
  lastSeen: number;
};

// Function to get initial user data
export const getInitialUserData = (uid: string, username: string, email: string | null): UserData => ({
  uid,
  username,
  email,
  lastLogin: Date.now(),
  money: 10000,
  stars: 20,
  netWorth: 10000,
  buildingSlots: Array(20).fill({ building: null, level: 0 }),
  inventory: [
    { item: 'Mbao', quantity: 2000, marketPrice: 2.5 },
    { item: 'Matofali', quantity: 4000, marketPrice: 1.2 },
    { item: 'Saruji', quantity: 1000, marketPrice: 10 },
  ],
  playerStocks: [],
  transactions: [],
  notifications: [],
  playerLevel: 1,
  playerXP: 0,
  privateNotes: '',
  status: 'online',
  role: 'player',
  lastSeen: Date.now(),
});

// Function to save game state to Realtime Database
export const saveGameState = async (userRef: DatabaseReference, gameState: UserData): Promise<void> => {
  await set(userRef, gameState);
};

// Function to load game state from Realtime Database
export const loadGameState = async (userRef: DatabaseReference): Promise<UserData | null> => {
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val() as UserData;
  }
  return null;
};
