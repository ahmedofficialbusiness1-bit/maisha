'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bell, Menu, Star, Coins } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b border-gray-700/50 bg-gray-900/95 px-4 text-white backdrop-blur-sm sm:px-6">
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
      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        {/* Money */}
        <div className="flex items-center gap-2 rounded-full bg-green-500/20 p-1 pr-4 border border-green-500/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
             <Coins className="h-5 w-5 text-yellow-300"/>
          </div>
          <div className="text-lg font-bold text-white">$1,989,212</div>
        </div>

        {/* Player Profile & Level */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-yellow-400">
            <AvatarImage src="https://picsum.photos/seed/player/100/100" data-ai-hint="player avatar" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">Mchezaji</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Level 5</span>
              <Progress value={45} className="h-2 w-20 bg-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Star Boost */}
        <div className="flex items-center gap-2 rounded-full bg-yellow-400/20 p-2 border border-yellow-400/50">
            <Star className="h-6 w-6 text-yellow-400" />
            <span className="font-bold text-white">x2</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
