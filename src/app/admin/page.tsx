'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import type { UserData } from '@/services/game-service';
import { AdminPanel } from '@/components/app/admin-panel';
import { Loader2 } from 'lucide-react';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { getInitialUserData } from '@/services/game-service';

export default function AdminDashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [gameState, setGameState] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { players: allPlayers } = useAllPlayers();

  const [president, setPresident] = React.useState<PlayerPublicData | null>(null);
  const [electionState, setElectionState] = React.useState<'open' | 'closed'>('closed');
  const database = getDatabase();

  React.useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    // Force admin status for specific UID for testing purposes
    if (user.uid === 'nfw3CtiEyBWZkXCnh7wderFbFFA2') {
        const adminData = getInitialUserData(user.uid, user.displayName || 'Admin', user.email);
        adminData.role = 'admin';
        setGameState(adminData);
        setLoading(false);
    } else {
        const userRef = ref(getDatabase(), `users/${user.uid}`);
        const unsubscribeUser = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val() as UserData;
            if (data.role !== 'admin') {
              router.replace('/dashboard'); // Not an admin, kick them out
            } else {
              setGameState(data);
              setLoading(false);
            }
          } else {
            // User data doesn't exist, they can't be an admin
            router.replace('/login');
          }
        });
        return () => unsubscribeUser();
    }
    
    const electionRef = ref(database, 'election');
    const unsubscribeElection = onValue(electionRef, (snapshot) => {
        const electionData = snapshot.val();
        if (electionData && allPlayers) {
            setElectionState(electionData.state || 'closed');
            const presidentPlayer = allPlayers.find(p => p.uid === electionData.presidentUid);
            setPresident(presidentPlayer || null);
        } else {
            setPresident(null);
        }
    });


    return () => {
      // No need for user unsubscribe here as it's handled in the else block
      unsubscribeElection();
    };
  }, [user, userLoading, router, database, allPlayers]);
  
  const handleViewProfile = (playerId: string) => {
      // Admin dashboard doesn't have a profile view, redirect to the main app with a query param
      router.push(`/dashboard?viewProfile=${playerId}`);
  };

  const handleAdminAction = (action: Function) => (...args: any[]) => {
    if (gameState?.role !== 'admin') return;
    action(...args);
  };
  
  const handleAdminAppointPresident = (uid: string) => {
    if (gameState?.role !== 'admin') return;
    const updates: Record<string, any> = {};
    updates[`/election/presidentUid`] = uid;
    update(ref(database), updates);
  };
  
  const handleAdminRemovePresident = () => {
    if (gameState?.role !== 'admin') return;
    update(ref(database), { '/election/presidentUid': null });
  };
  
  const handleAdminManageElection = (state: 'open' | 'closed') => {
      if (gameState?.role !== 'admin') return;
      update(ref(database), { '/election/state': state });
  };

  if (loading || userLoading || !gameState || !allPlayers) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white">
      <AdminPanel
        onViewProfile={handleViewProfile}
        onAdminSendItem={() => {}} // Dummy functions, real logic is in game.tsx, but AdminPanel requires them.
        onAdminSendMoney={() => {}} // We can refactor this later.
        onAdminSendStars={() => {}}
        onAdminSetRole={() => {}}
        onAdminAppointPresident={handleAdminAppointPresident}
        onAdminRemovePresident={handleAdminRemovePresident}
        onAdminManageElection={handleAdminManageElection}
        president={president}
        electionState={electionState}
      />
    </div>
  );
}
