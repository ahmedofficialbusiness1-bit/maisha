'use client';

import * as React from 'react';
import { Game } from '@/app/game';
import { FirebaseClientProvider } from '@/firebase';

export default function DashboardPage() {
  return (
    <FirebaseClientProvider>
      <Game />
    </FirebaseClientProvider>
  );
}
