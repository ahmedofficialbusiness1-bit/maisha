import { validateRequest } from '@/app/actions';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const { user } = await validateRequest();
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
