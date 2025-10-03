import { Crown, Gem, Shield, Sprout, Coins, Rocket, LucideIcon } from "lucide-react";

export type PlayerTier = {
  name: string;
  minNetWorth: number;
  icon: LucideIcon;
  color: string; // Tailwind CSS class for background, border, and text color
};

const tiers: PlayerTier[] = [
  { name: 'Bronze Seed', minNetWorth: 0, icon: Sprout, color: 'border-orange-500/50 bg-orange-900/40 text-orange-300' },
  { name: 'Iron Hand', minNetWorth: 200000, icon: Shield, color: 'border-slate-500/50 bg-slate-800/40 text-slate-300' },
  { name: 'Silver Path', minNetWorth: 800000, icon: Coins, color: 'border-slate-400/50 bg-slate-700/40 text-slate-200' },
  { name: 'Golden Rise', minNetWorth: 1500000, icon: Gem, color: 'border-yellow-400/50 bg-yellow-800/40 text-yellow-300' },
  { name: 'Diamond Edge', minNetWorth: 3000000, icon: Gem, color: 'border-cyan-400/50 bg-cyan-900/40 text-cyan-300' },
  { name: 'Aspiring Force', minNetWorth: 5000000, icon: Rocket, color: 'border-pink-500/50 bg-pink-900/40 text-pink-300' },
  { name: 'Emerging Power', minNetWorth: 15000000, icon: Rocket, color: 'border-red-500/50 bg-red-900/40 text-red-300' },
  { name: 'Dominant Player', minNetWorth: 30000000, icon: Crown, color: 'border-orange-400/50 bg-orange-800/40 text-orange-200' },
  { name: 'Industrial Titan', minNetWorth: 50000000, icon: Crown, color: 'border-yellow-400/60 bg-yellow-700/50 text-yellow-200' },
  { name: 'Economic Giant', minNetWorth: 75000000, icon: Crown, color: 'border-yellow-300/70 bg-yellow-600/60 text-yellow-100' },
  { name: 'Titan of Industry', minNetWorth: 100000001, icon: Crown, color: 'border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
  { name: 'Supreme Empire', minNetWorth: 1000000001, icon: Crown, color: 'border-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-white' }
];

export const getPlayerTier = (netWorth: number): PlayerTier => {
  let currentTier: PlayerTier = tiers[0];
  for (const tier of tiers) {
    if (netWorth >= tier.minNetWorth) {
      currentTier = tier;
    } else {
      break;
    }
  }
  return currentTier;
};

export const getRankTitle = (rank: number): string | null => {
  switch (rank) {
    case 1:
      return 'GOD FATHER';
    case 2:
      return 'CHAMPION';
    case 3:
      return 'NOT HUMAN';
    default:
      return null;
  }
};
