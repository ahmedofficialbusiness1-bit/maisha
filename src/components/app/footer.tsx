'use client';

import * as React from 'react';
import type { View } from '@/app/page';
import { Button } from '@/components/ui/button';
import {
  Archive,
  CandlestickChart,
  Cpu,
  Factory,
  LayoutDashboard,
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
      icon: <LayoutDashboard />,
    },
    {
      view: 'regions' as View,
      label: 'Inventory',
      icon: <Archive />,
    },
    {
      view: 'market' as View,
      label: 'Market',
      icon: <CandlestickChart />,
    },
    {
      view: 'production' as View,
      label: 'Production',
      icon: <Factory />,
    },
    {
      view: 'simulator' as View,
      label: 'Simulator',
      icon: <Cpu />,
    },
  ];

  return (
    <footer className="sticky bottom-0 z-10 flex items-center justify-around border-t bg-gray-900/95 p-2 backdrop-blur-sm md:hidden">
      {navItems.map((item) => (
        <Button
            key={item.view}
            variant="ghost"
            className={cn(
                "flex flex-col h-auto items-center justify-center gap-1 text-white/70 hover:bg-gray-700/50 hover:text-white",
                activeView === item.view && "text-white bg-gray-700/80"
            )}
            onClick={() => setView(item.view)}
        >
            {item.icon}
            <span className="text-xs">{item.label}</span>
        </Button>
      ))}
    </footer>
  );
}
