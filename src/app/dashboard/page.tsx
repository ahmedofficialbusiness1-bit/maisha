import { validateRequest } from '@/app/actions';
import { Game } from '@/components/app/game';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/login');
  }
  return <Game user={user} />;
}
