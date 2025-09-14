'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/app/main-nav';
import { AppHeader } from '@/components/app/header';
import { Dashboard } from '@/components/app/dashboard';
import { Regions } from '@/components/app/regions';
import { CommoditySimulator } from '@/components/app/commodity-simulator';
import { TradeMarket } from '@/components/app/trade-market';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type View = 'dashboard' | 'regions' | 'market' | 'simulator' | 'production';

export default function Home() {
  const [view, setView] = React.useState<View>('dashboard');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">UA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-sidebar-foreground">Uchumi wa Afrika</span>
            </div>
          </div>
        </SidebarHeader>
        <MainNav activeView={view} setView={setView} />
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start gap-3 w-full p-2 h-auto">
                 <Avatar className="h-9 w-9">
                  <AvatarImage src="https://picsum.photos/seed/player/100/100" alt="Player" />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sidebar-foreground">Player One</span>
                  <span className="text-xs text-muted-foreground">Premium Member</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 ml-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Player One</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    player.one@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {view === 'dashboard' && <Dashboard />}
          {view === 'regions' && <Regions />}
          {view === 'market' && <TradeMarket />}
          {view === 'simulator' && <CommoditySimulator />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
