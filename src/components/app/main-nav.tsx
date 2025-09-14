'use client';

import * as React from 'react';
import type { View } from '@/app/page';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  CandlestickChart,
  Cpu,
  Factory,
  LayoutDashboard,
  Map,
} from 'lucide-react';

interface MainNavProps {
  activeView: View;
  setView: (view: View) => void;
}

export function MainNav({ activeView, setView }: MainNavProps) {
  const navItems = [
    {
      view: 'dashboard' as View,
      label: 'Dashboard',
      icon: <LayoutDashboard />,
    },
    {
      view: 'regions' as View,
      label: 'Regions',
      icon: <Map />,
    },
    {
      view: 'market' as View,
      label: 'Trade Market',
      icon: <CandlestickChart />,
    },
    {
      view: 'production' as View,
      label: 'Production',
      icon: <Factory />,
    },
    {
      view: 'simulator' as View,
      label: 'Price Simulator',
      icon: <Cpu />,
    },
  ];

  return (
    <SidebarContent>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.view}>
            <SidebarMenuButton
              onClick={() => setView(item.view)}
              isActive={activeView === item.view}
              tooltip={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
