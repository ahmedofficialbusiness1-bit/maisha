'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Game } from '@/app/game';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { getDatabase, ref, onValue } from 'firebase/database';
import type { UserData } from '@/services/game-service';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    // Check user role and redirect if admin
    const userRef = ref(getDatabase(), `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val() as UserData;
        if (userData.role === 'admin') {
          router.replace('/admin');
        }
      }
    });

    return () => unsubscribe();
  }, [user, loading, router]);
  
  const profileId = searchParams.get('viewProfile');

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  // The Game component will handle the initial null state before game state is loaded
  return <Game initialProfileViewId={profileId} />;
}
