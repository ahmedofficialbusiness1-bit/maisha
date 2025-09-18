import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Game } from '@/components/app/game';

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // The Game component will handle its own initial data fetching or state.
  return <Game />;
}
