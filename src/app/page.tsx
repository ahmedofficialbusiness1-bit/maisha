
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  // Since authentication is now handled on the client-side,
  // the root page's only job is to redirect to the entry point.
  redirect('/login');
}
