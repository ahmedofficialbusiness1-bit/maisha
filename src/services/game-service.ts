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
  securityFund: number;
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
  role: 'player' | 'admin' | 'president';
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
  const initialMoney = 10000;
  const initialSharePrice = 10;
  const initialTotalShares = 1000000;
  const initialTicker = initialUsername.slice(0, 5).toUpperCase();
  const avatarUrl = `https://picsum.photos/seed/${uid}/100/100`;

  const emptySlot = { building: null, level: 0, quality: 0, locked: false };
  const lockedSlot = { building: null, level: 0, quality: 0, locked: true };

  const buildingSlots = [
      ...Array(10).fill(emptySlot),
      ...Array(10).fill(lockedSlot)
    ];
    
  let role: 'player' | 'admin' = 'player';
  if (uid === '7IHauUXBXjUhDJ9YUVVs97fwO9o1' || email === 'lamerckalbert@gmail.com') {
    role = 'admin';
  }
  
  return {
    uid,
    username: initialUsername,
    lastLogin: Date.now(),
    avatarUrl: avatarUrl,
    money: initialMoney,
    stars: 650,
    netWorth: initialMoney,
    buildingSlots: buildingSlots,
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
    role: role,
    lastSeen: Date.now(),
    lastPublicRead: { general: 0, trade: 0, help: 0 },
    companyProfile: {
      companyName: `${initialUsername} Inc.`,
      ticker: initialTicker,
      logo: avatarUrl,
      totalShares: initialTotalShares,
      availableShares: initialTotalShares, // Initially all shares are private
      sharePrice: initialSharePrice,
      marketCap: initialTotalShares * initialSharePrice,
      isPublic: false,
      ownerUid: uid,
      securityFund: 0,
    },
  };
}

// Function to save private user data to Realtime Database
export const saveUserData = async (userRef: DatabaseReference, gameState: UserData): Promise<void> => {
  await set(userRef, gameState);
};
