import { DatabaseReference, set } from 'firebase/database';
import type { PlayerStock } from '@/app/game';

export type UserChatData = {
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
};

export type CompanyProfile = {
  companyName: string;
  ticker: string;
  logo: string;
  totalShares: number;
  availableShares: number;
  sharePrice: number;
  marketCap: number;
  isPublic: boolean;
  ownerUid: string;
};

// This is the private user data, stored under /users/{uid}
export type UserData = {
  uid: string;
  username: string;
  avatarUrl?: string; // Made optional
  lastLogin: number;
  money: number;
  stars: number;
  netWorth: number;
  buildingSlots: any[]; 
  inventory: any[]; 
  playerStocks: PlayerStock[];
  transactions: Record<string, any>;
  notifications: Record<string, any>;
  playerLevel: number;
  playerXP: number;
  privateNotes: string;
  status: 'online' | 'offline';
  role: 'player' | 'admin';
  lastSeen: number;
  lastPublicRead: Record<string, number>;
  companyProfile: CompanyProfile;
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
  const initialUsername = displayName || (email ? email.split('@')[0] : 'Mchezaji');
  const isAdmin = uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2';
  const initialMoney = isAdmin ? 1000000 : 10000;
  const initialSharePrice = 10;
  const initialTotalShares = 1000000;
  const initialTicker = initialUsername.slice(0, 5).toUpperCase();
  
  return {
    uid,
    username: initialUsername,
    lastLogin: Date.now(),
    avatarUrl: `https://picsum.photos/seed/${uid}/100/100`,
    money: initialMoney,
    stars: isAdmin ? 1000 : 20,
    netWorth: initialMoney,
    buildingSlots: Array(20).fill({ building: null, level: 0 }),
    inventory: [
      { item: 'Mbao', quantity: 2000, marketPrice: 2.5 },
      { item: 'Matofali', quantity: 4000, marketPrice: 1.2 },
      { item: 'Saruji', quantity: 1000, marketPrice: 10 },
    ],
    playerStocks: [],
    transactions: {},
    notifications: {},
    playerLevel: 1,
    playerXP: 0,
    privateNotes: `Karibu kwenye wasifu wangu! Mimi ni mchezaji mpya kwenye Uchumi wa Afrika na nina matumaini ya kujenga himaya kubwa.`,
    status: 'online',
    role: isAdmin ? 'admin' : 'player',
    lastSeen: Date.now(),
    lastPublicRead: { general: 0, trade: 0, help: 0 },
    companyProfile: {
      companyName: `${initialUsername} Inc.`,
      ticker: initialTicker,
      logo: `https://picsum.photos/seed/${initialTicker}/40/40`,
      totalShares: initialTotalShares,
      availableShares: initialTotalShares, // Initially all shares are private
      sharePrice: initialSharePrice,
      marketCap: initialTotalShares * initialSharePrice,
      isPublic: false,
      ownerUid: uid,
    },
  };
}

// Function to save private user data to Realtime Database
export const saveUserData = async (userRef: DatabaseReference, gameState: UserData): Promise<void> => {
  await set(userRef, gameState);
};
