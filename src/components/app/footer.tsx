
'use client';

import * as React from 'react';
import type { View } from '@/app/game';
import { Button } from '@/components/ui/button';
import {
  Archive,
  BookOpen,
  CandlestickChart,
  MessageSquare,
  LayoutDashboard,
  Trophy,
  Briefcase,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface AppFooterProps {
  activeView: View;
  setView: (view: View) => void;
  unreadMessages: number;
  unreadContracts: number;
  isAdmin: boolean;
}

export function AppFooter({ activeView, setView, unreadMessages, unreadContracts, isAdmin }: AppFooterProps) {
  const navItems: { view: View; label: string; icon: React.ReactNode; adminOnly: boolean }[] = [
    {
      view: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      view: 'inventory',
      label: 'Inventory',
      icon: (
        <div className="relative">
          <Archive className="h-5 w-5" />
          {unreadContracts > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadContracts}
            </span>
          )}
        </div>
      ),
      adminOnly: false,
    },
    {
      view: 'market',
      label: 'Market',
      icon: <CandlestickChart className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      view: 'leaderboard',
      label: 'Wanaoongoza',
      icon: <Trophy className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      view: 'chats',
      label: 'Chats',
      icon: (
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadMessages}
            </span>
          )}
        </div>
      ),
      adminOnly: false,
    },
     {
      view: 'office',
      label: 'Ofisi',
      icon: <Briefcase className="h-5 w-5" />,
      adminOnly: true,
    }
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <footer className={cn(
        "sticky bottom-0 z-10 grid items-center justify-around border-t bg-gray-900/95 py-1 px-2 backdrop-blur-sm",
        isAdmin ? 'grid-cols-6' : 'grid-cols-5'
      )}>
      {visibleNavItems.map((item) => (
        <Button
            key={item.view}
            variant="ghost"
            className={cn(
                "flex flex-col h-auto items-center justify-center gap-1 p-2 text-white/70 hover:bg-gray-700/50 hover:text-white",
                activeView === item.view && "text-white bg-gray-700/80 rounded-lg"
            )}
            onClick={() => setView(item.view)}
        >
            {item.icon}
            <span className="text-[11px]">{item.label}</span>
        </Button>
      ))}
    </footer>
  );
}
