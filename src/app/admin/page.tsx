'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Game } from '@/app/game';
import { Loader2 } from 'lucide-react';
import { getDatabase, ref, onValue } from 'firebase/database';
import type { UserData } from '@/services/game-service';


export default function AdminDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (userLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }
    
    // Hardcoded check for the specific admin UID
    if (user.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2') {
        setIsAuthorizedAdmin(true);
        return;
    }

    // Fallback to check the role in the database
    const userRef = ref(getDatabase(), `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val() as UserData;
        if (userData.role === 'admin') {
           setIsAuthorizedAdmin(true);
        } else {
           setIsAuthorizedAdmin(false);
           router.replace('/dashboard'); // Not an admin, kick them out
        }
      } else {
         setIsAuthorizedAdmin(false);
         router.replace('/dashboard'); // User profile doesn't exist
      }
    });

    return () => unsubscribe();
  }, [user, userLoading, router]);

  if (userLoading || isAuthorizedAdmin === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }
  
  if (!isAuthorizedAdmin) {
      // This state should ideally not be visible as the effect will redirect.
      return (
           <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
                <p>Access Denied. Redirecting...</p>
           </div>
      );
  }

  // Render the full game experience, but force the view to 'admin'
  return <Game initialProfileViewId={null} forceAdminView={true} />;
}
