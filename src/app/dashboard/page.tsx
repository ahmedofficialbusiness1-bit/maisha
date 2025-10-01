'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/app/game';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!user) {
    return null; // The redirect will handle it
  }

  return <Game />;
}
