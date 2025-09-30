'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useUser } from '@/firebase';
import { signInWithGoogle } from '@/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 5.106 29.613 3 24 3C12.955 3 4 11.955 4 23s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691c-1.346 2.538-2.115 5.42-2.115 8.309s.769 5.771 2.115 8.309l-5.376 4.192C.998 31.391 0 27.34 0 23s.998-8.391 2.93-11.801l5.376 3.492z"
      />
      <path
        fill="#4CAF50"
        d="M24 48c5.613 0 10.552-1.854 14.193-5.025l-5.89-4.577c-1.928 1.29-4.324 2.05-6.915 2.05c-5.22 0-9.623-3.351-11.231-7.892l-5.632 4.417C5.908 41.61 14.075 48 24 48z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l5.89 4.577c3.41-3.133 5.45-7.999 5.45-13.151c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}


function LoginComponent() {
    const router = useRouter();
    const { user, loading } = useUser();
    const { toast } = useToast();
    
    React.useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            // The useEffect above will handle the redirect after successful login
        } catch (error) {
            if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') {
                 toast({
                    title: 'Umesitisha Kuingia',
                    description: 'Dirisha la kuingia limefungwa. Jaribu tena.',
                    variant: 'default',
                 });
            } else {
                console.error("Error signing in: ", error);
                toast({
                    title: 'Kosa Limetokea',
                    description: 'Imeshindikana kuingia. Tafadhali jaribu tena.',
                    variant: 'destructive',
                });
            }
        }
    };

    if (loading || user) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Inapakia...</div>;
    }

    return (
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-white">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://picsum.photos/seed/african-savanna/1920/1080')"}} />
            <div className="absolute inset-0 -z-10 bg-black/60"></div>
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    Karibu <span className="text-blue-400">Uchumi wa Afrika</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Jenga himaya yako ya kiuchumi, kutoka kilimo hadi teknolojia ya anga, na uwe mchumi mkuu barani Afrika.
                </p>
                <div className="mt-8">
                     <Button 
                        size="lg" 
                        className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full"
                        onClick={handleLogin}
                    >
                        <GoogleIcon className="h-6 w-6 mr-3" />
                        Ingia na Google
                    </Button>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <LoginComponent />
        </FirebaseClientProvider>
    );
}
