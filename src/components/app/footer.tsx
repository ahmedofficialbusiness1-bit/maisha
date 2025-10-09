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
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface AppFooterProps {
  activeView: View;
  setView: (view: View) => void;
  unreadMessages: number;
  unreadContracts: number;
  isAdmin: boolean;
  isPresident: boolean;
}

export function AppFooter({ activeView, setView, unreadMessages, unreadContracts, isAdmin, isPresident }: AppFooterProps) {
  const navItems: { view: View; label: string; icon: React.ReactNode; adminOnly: boolean, presidentOnly: boolean }[] = [
    {
      view: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      adminOnly: false,
      presidentOnly: false,
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
      presidentOnly: false,
    },
    {
      view: 'market',
      label: 'Market',
      icon: <CandlestickChart className="h-5 w-5" />,
      adminOnly: false,
      presidentOnly: false,
    },
    {
      view: 'leaderboard',
      label: 'Wanaoongoza',
      icon: <Trophy className="h-5 w-5" />,
      adminOnly: false,
      presidentOnly: false,
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
      presidentOnly: false,
    },
    {
      view: 'office',
      label: 'Ofisi',
      icon: <Crown className="h-5 w-5" />,
      adminOnly: false,
      presidentOnly: true,
    },
     {
      view: 'admin',
      label: 'Admin',
      icon: <Shield className="h-5 w-5" />,
      adminOnly: true,
      presidentOnly: false,
    }
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.presidentOnly) return isPresident || isAdmin;
    return true;
  });

  // This is a TailwindCSS "JIT" safeguard.
  // We need to declare the full class names somewhere in the code so that the Just-In-Time compiler
  // can see them and generate the corresponding CSS. We can't dynamically build them with string interpolation.
  // We make them invisible and non-interactive so they don't affect the layout.
  const jitSafeguard = (
      <div className="hidden grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7"></div>
  );

  return (
    <footer className={cn(
        "sticky bottom-0 z-10 grid items-center justify-around border-t bg-gray-900/95 py-1 px-2 backdrop-blur-sm",
        `grid-cols-${visibleNavItems.length}`
      )}>
      {jitSafeguard}
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
