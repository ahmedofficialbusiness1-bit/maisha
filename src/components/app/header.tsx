'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bell, Menu, Star, Coins, Scale } from 'lucide-react';
import { useMemo } from 'react';
import type { View } from './game';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
    money: number;
    stars: number;
    setView: (view: View) => void;
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

export function AppHeader({ money, stars, setView }: AppHeaderProps) {
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

      {/* Spacer */}
      <div className="flex-1"></div>


      {/* Player Stats - Right Aligned */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Money */}
        <div className="flex items-center gap-1 rounded-full bg-green-500/20 p-1 pr-2 sm:gap-1 sm:pr-3 border border-green-500/50">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 sm:h-5 sm:w-5">
             <Coins className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-300"/>
          </div>
          <div className="text-xs sm:text-base font-bold text-white">{formattedMoney}</div>
        </div>

        {/* Player Profile & Level */}
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-yellow-400">
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
        <div className="flex items-center gap-1 rounded-full bg-yellow-400/20 p-1 sm:p-1.5 border border-yellow-400/50">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
            <span className="font-bold text-white text-xs sm:text-sm">{stars}</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-7 w-7 sm:h-8 sm:w-8">
          <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* Hamburger Menu */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                    <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                 <DropdownMenuLabel>Management</DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-gray-600'/>
                <DropdownMenuItem onSelect={() => setView('accounting')}>
                    <Scale className="mr-2 h-4 w-4" />
                    <span>Uhasibu</span>
                </DropdownMenuItem>
                {/* Add other menu items here in the future */}
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
