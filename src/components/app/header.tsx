'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-md font-bold text-primary-foreground">UA</span>
        </div>
        <span className="text-lg font-semibold">Uchumi wa Afrika</span>
      </div>
    </header>
  );
}
