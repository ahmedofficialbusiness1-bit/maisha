import { Crown, Gem, Shield, Star, Rocket, Building, Anchor, LucideIcon } from "lucide-react";

export type PlayerTier = {
  name: string;
  minNetWorth: number;
  icon: LucideIcon;
  color: string; // Tailwind CSS class for background color
};

const tiers: PlayerTier[] = [
  { name: 'Newcomer', minNetWorth: 0, icon: Star, color: 'bg-gray-500' },
  { name: 'Trailblazer', minNetWorth: 100000, icon: Star, color: 'bg-green-600' },
  { name: 'Rising Venture', minNetWorth: 500000, icon: Building, color: 'bg-blue-600' },
  { name: 'Stronghold', minNetWorth: 1000000, icon: Shield, color: 'bg-indigo-600' },
  { name: 'Challenger', minNetWorth: 3000000, icon: Shield, color: 'bg-purple-600' },
  { name: 'Aspiring Force', minNetWorth: 5000000, icon: Gem, color: 'bg-pink-600' },
  { name: 'Emerging Power', minNetWorth: 15000000, icon: Gem, color: 'bg-red-600' },
  { name: 'Dominant Player', minNetWorth: 30000000, icon: Rocket, color: 'bg-orange-600' },
  { name: 'Industrial Titan', minNetWorth: 50000000, icon: Anchor, color: 'bg-yellow-600 text-black' },
  { name: 'Economic Giant', minNetWorth: 75000000, icon: Anchor, color: 'bg-yellow-500 text-black' },
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
