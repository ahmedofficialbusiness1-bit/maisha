import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Game } from '@/components/app/game';

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Here you would fetch the user's game data from Firestore
  // For now, we'll pass null and let the Game component handle initial state.
  const userGameData = null;

  return <Game initialData={userGameData} />;
}
