'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bell, Menu, Star, Coins, Scale, User, CheckCheck, Hammer, CircleDollarSign, Tractor, LogOut, Award, Shield, BookOpen } from 'lucide-react';
import { useMemo } from 'react';
import type { View } from '@/app/game';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { Notification } from '@/app/game';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
    money: number;
    stars: number;
    playerName: string;
    playerAvatar: string;
    setView: (view: View) => void;
    notifications: Notification[];
    onNotificationsRead: () => void;
    playerLevel: number;
    playerXP: number;
    xpForNextLevel: number;
    isAdmin?: boolean;
}

function formatCurrency(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

export function AppHeader({ money, stars, playerName, playerAvatar, setView, notifications, onNotificationsRead, playerLevel, playerXP, xpForNextLevel, isAdmin }: AppHeaderProps) {
    const router = useRouter();
    const formattedMoney = useMemo(() => formatCurrency(money), [money]);
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleOpenNotifications = () => {
        if (unreadCount > 0) {
            onNotificationsRead();
        }
    }
    
    const xpPercentage = (playerXP / xpForNextLevel) * 100;
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-gray-700/50 bg-gray-900/95 px-2 text-white backdrop-blur-sm sm:h-20 sm:px-4">
      {/* App Logo and Name - kept for brand recognition */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700">
          <span className="text-xl font-bold text-white">UA</span>
        </div>
        <h1 className="text-lg font-bold">Uchumi wa Afrika</h1>
      </div>
      
      <Button variant="ghost" className="md:hidden" onClick={() => setView('encyclopedia')}><BookOpen /></Button>

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
            <AvatarImage src={playerAvatar} data-ai-hint="player avatar" />
            <AvatarFallback>{playerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-sm">{playerName}</span>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-gray-400">Level {playerLevel}</span>
                            <Progress value={xpPercentage} className="h-1.5 w-16 bg-gray-700" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                        <p>XP: {Math.floor(playerXP).toLocaleString()} / {xpForNextLevel.toLocaleString()}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Star Boost */}
        <div className="flex items-center gap-1 rounded-full bg-yellow-400/20 p-1 sm:p-1.5 border border-yellow-400/50">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
            <span className="font-bold text-white text-xs sm:text-sm">{stars}</span>
        </div>

        {/* Notifications */}
        <DropdownMenu onOpenChange={(open) => open && handleOpenNotifications()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-7 w-7 sm:h-8 sm:w-8">
                  <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                        {unreadCount}
                     </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                        <Button variant="link" className="p-0 h-auto text-xs" onClick={onNotificationsRead}>
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-gray-600'/>
                <ScrollArea className="h-96">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <DropdownMenuItem key={n.id} className="gap-3 items-start focus:bg-gray-700/80">
                                <div className="flex-shrink-0 mt-1">
                                    {n.icon === 'construction' && <Hammer className="h-4 w-4 text-orange-400" />}
                                    {n.icon === 'sale' && <CircleDollarSign className="h-4 w-4 text-green-400" />}
                                    {n.icon === 'production' && <Tractor className="h-4 w-4 text-blue-400" />}
                                    {n.icon === 'purchase' && <CircleDollarSign className="h-4 w-4 text-red-400" />}
                                    {n.icon === 'dividend' && <Coins className="h-4 w-4 text-yellow-400" />}
                                    {n.icon === 'level-up' && <Award className="h-4 w-4 text-yellow-300" />}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm leading-tight">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                </div>
                                {!n.read && <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="text-center text-sm text-gray-400 p-4">
                            No notifications yet.
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className='bg-gray-600'/>
                 <DropdownMenuItem className="justify-center focus:bg-gray-700/80">
                    <CheckCheck className="mr-2 h-4 w-4" />
                    <span>View All</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
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
                {isAdmin && (
                    <DropdownMenuItem onSelect={() => setView('admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => setView('accounting')}>
                    <Scale className="mr-2 h-4 w-4" />
                    <span>Uhasibu</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => setView('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Wasifu</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
