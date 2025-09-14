'use client';

import { Button } from '@/components/ui/button';
import { Bell, Menu, Shield } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-gray-900/95 px-4 text-white backdrop-blur-sm sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
       <div className="flex items-center gap-2">
         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700">
          <span className="text-xl font-bold text-white">UA</span>
        </div>
        <h1 className="text-lg font-bold hidden md:block">Uchumi wa Afrika</h1>
      </div>

      <div className="flex items-center ml-auto gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6"/>
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-green-500/20 p-1 pr-4 border border-green-500/50">
            <div className="text-lg font-bold text-white">$1,989,212</div>
        </div>
        <Shield className="h-8 w-8 text-yellow-400" />
      </div>
    </header>
  );
}
