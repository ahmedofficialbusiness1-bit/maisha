import { DatabaseReference, set } from 'firebase/database';
import type { PlayerStock } from '@/app/game';

// This is the private user data, stored under /users/{uid}
export type UserData = {
  uid: string;
  username: string;
  email: string | null;
  lastLogin: number;
  money: number;
  stars: number;
  netWorth: number;
  buildingSlots: any[]; 
  inventory: any[]; 
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

// This is public-facing player data, stored under /players/{uid}
export type PlayerPublicData = {
    uid: string;
    username: string;
    avatar: string;
    netWorth: number;
    level: number;
    role: 'player' | 'admin';
};


// Function to get initial user data
export const getInitialUserData = (uid: string, displayName: string | null, email: string | null): UserData => {
  // For email sign-up, displayName is null. Create a default username.
  const initialUsername = displayName || (email ? email.split('@')[0] : 'Mchezaji');
  const isAdmin = uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2';
  
  return {
    uid,
    username: initialUsername,
    email,
    lastLogin: Date.now(),
    money: isAdmin ? 1000000 : 10000,
    stars: isAdmin ? 1000 : 20,
    netWorth: isAdmin ? 1000000 : 10000,
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
    privateNotes: `Karibu kwenye wasifu wangu! Mimi ni mchezaji mpya kwenye Uchumi wa Afrika na nina matumaini ya kujenga himaya kubwa.`,
    status: 'online',
    role: isAdmin ? 'admin' : 'player',
    lastSeen: Date.now(),
  };
}

// Function to save private user data to Realtime Database
export const saveUserData = async (userRef: DatabaseReference, gameState: UserData): Promise<void> => {
  await set(userRef, gameState);
};
