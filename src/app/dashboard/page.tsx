
'use client';

import * as React from 'react';
import { Game } from '@/app/game';

// Since we are moving to local storage, we can use a mock user.
const localUser = {
    uid: 'local-player-01',
    username: 'Mchezaji',
    email: 'mchezaji@uchumi.africa',
}

export default function DashboardPage() {
  return <Game user={localUser} />;
}
