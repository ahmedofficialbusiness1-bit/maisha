import { Crown, Gem, Shield, Sprout, Coins, Rocket, LucideIcon } from "lucide-react";

export type PlayerTier = {
  name: string;
  minNetWorth: number;
  icon: LucideIcon;
  color: string; // Tailwind CSS class for background color
};

const tiers: PlayerTier[] = [
  { name: 'Bronze Seed', minNetWorth: 0, icon: Sprout, color: 'bg-orange-700' },
  { name: 'Iron Hand', minNetWorth: 200000, icon: Shield, color: 'bg-slate-600' },
  { name: 'Silver Path', minNetWorth: 800000, icon: Coins, color: 'bg-slate-400 text-black' },
  { name: 'Golden Rise', minNetWorth: 1500000, icon: Gem, color: 'bg-yellow-500 text-black' },
  { name: 'Diamond Edge', minNetWorth: 3000000, icon: Gem, color: 'bg-cyan-500' },
  { name: 'Aspiring Force', minNetWorth: 5000000, icon: Rocket, color: 'bg-pink-600' },
  { name: 'Emerging Power', minNetWorth: 15000000, icon: Rocket, color: 'bg-red-600' },
  { name: 'Dominant Player', minNetWorth: 30000000, icon: Crown, color: 'bg-orange-600' },
  { name: 'Industrial Titan', minNetWorth: 50000000, icon: Crown, color: 'bg-yellow-600 text-black' },
  { name: 'Economic Giant', minNetWorth: 75000000, icon: Crown, color: 'bg-yellow-500 text-black' },
  { name: 'Titan of Industry', minNetWorth: 100000001, icon: Crown, color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
  { name: 'Supreme Empire', minNetWorth: 1000000001, icon: Crown, color: 'bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-white' }
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
