'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useFirebaseApp, useUser } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const app = useFirebaseApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        setLoading(false);
      }
    }
  }, [user, userLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!app) return;
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  
  if (loading || userLoading) {
      return (
          <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
      )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-gray-800/60 p-8 border border-gray-700 shadow-2xl">
         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 mb-4">
            <span className="text-3xl font-bold text-white">UA</span>
        </div>
        <h1 className="text-3xl font-bold">Karibu Uchumi wa Afrika</h1>
        <p className="text-gray-400">Ingia ili uendelee na himaya yako.</p>
        <Button
          onClick={handleGoogleSignIn}
          className="mt-4 flex items-center gap-2 bg-white text-black hover:bg-gray-200"
        >
          <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
          Ingia na Google
        </Button>
      </div>
    </div>
  );
}
