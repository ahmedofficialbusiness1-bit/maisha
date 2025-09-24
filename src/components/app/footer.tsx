
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
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface AppFooterProps {
  activeView: View;
  setView: (view: View) => void;
}

export function AppFooter({ activeView, setView }: AppFooterProps) {
  const navItems = [
    {
      view: 'dashboard' as View,
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      view: 'inventory' as View,
      label: 'Inventory',
      icon: <Archive className="h-5 w-5" />,
    },
    {
      view: 'market' as View,
      label: 'Market',
      icon: <CandlestickChart className="h-5 w-5" />,
    },
    {
      view: 'leaderboard' as View,
      label: 'Wanaoongoza',
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      view: 'chats' as View,
      label: 'Chats',
      icon: <MessageSquare className="h-5 w-5" />,
    }
  ];

  return (
    <footer className="sticky bottom-0 z-10 grid grid-cols-5 items-center justify-around border-t bg-gray-900/95 py-1 px-2 backdrop-blur-sm">
      {navItems.map((item) => (
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
