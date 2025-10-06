'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import type { UserData } from '@/services/game-service';
import { AdminPanel } from '@/components/app/admin-panel';
import { Loader2 } from 'lucide-react';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';

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
      unsubscribeUser();
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
    onValue(ref(database), updates);
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
        onAdminRemovePresident={() => {}}
        onAdminManageElection={() => {}}
        president={president}
        electionState={electionState}
      />
    </div>
  );
}
