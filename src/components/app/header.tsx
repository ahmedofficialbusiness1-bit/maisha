'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bell, Menu, Star, Coins, LogOut } from 'lucide-react';
import { useMemo } from 'react';
import { signOut } from '@/lib/auth';

interface AppHeaderProps {
    money: number;
    stars: number;
}

function formatCurrency(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value}`;
}

export function AppHeader({ money, stars }: AppHeaderProps) {
    const formattedMoney = useMemo(() => formatCurrency(money), [money]);
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-gray-700/50 bg-gray-900/95 px-2 text-white backdrop-blur-sm sm:h-20 sm:px-4">
      {/* App Logo and Name - kept for brand recognition */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700">
          <span className="text-xl font-bold text-white">UA</span>
        </div>
        <h1 className="text-lg font-bold">Uchumi wa Afrika</h1>
      </div>

      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Player Stats - Right Aligned */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4 md:gap-6">
        {/* Money */}
        <div className="flex items-center gap-1 rounded-full bg-green-500/20 p-1 pr-2 sm:gap-2 sm:pr-4 border border-green-500/50">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-600">
             <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300"/>
          </div>
          <div className="text-sm sm:text-lg font-bold text-white">{formattedMoney}</div>
        </div>

        {/* Player Profile & Level */}
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 sm:h-12 sm:w-12 border-2 border-yellow-400">
            <AvatarImage src="https://picsum.photos/seed/player/100/100" data-ai-hint="player avatar" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-sm">Mchezaji</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Level 5</span>
              <Progress value={45} className="h-1.5 w-16 bg-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Star Boost */}
        <div className="flex items-center gap-1 rounded-full bg-yellow-400/20 p-1.5 sm:p-2 border border-yellow-400/50">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
            <span className="font-bold text-white text-sm sm:text-base">{stars}</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* Logout Button */}
        <form action={signOut}>
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Logout</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
