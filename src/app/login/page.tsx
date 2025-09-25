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
import { useUser, FirebaseClientProvider } from '@/firebase';


function LoginComponent() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!userLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, userLoading, router]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setAuthLoading(false);
    }
  };
  
  if (userLoading || user) {
      return (
          <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
      )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://picsum.photos/seed/african-savanna/1920/1080')"}} />
      <div className="absolute inset-0 -z-10 bg-black/60"></div>
      <div className="flex flex-col items-center gap-4 rounded-xl bg-gray-800/60 p-8 border border-gray-700 shadow-2xl">
         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 mb-4">
            <span className="text-3xl font-bold text-white">UA</span>
        </div>
        <h1 className="text-3xl font-bold">Karibu Uchumi wa Afrika</h1>
        <p className="text-gray-400">Ingia ili uendelee na himaya yako.</p>
        <Button
          onClick={handleGoogleSignIn}
          className="mt-4 flex items-center gap-2 bg-white text-black hover:bg-gray-200"
          disabled={authLoading}
        >
          {authLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Image src="/google-logo.svg" alt="Google" width={20} height={20} />}
          Ingia na Google
        </Button>
      </div>
    </div>
  );
}


export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <LoginComponent />
        </FirebaseClientProvider>
    )
}
