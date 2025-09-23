'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { app } from '@/lib/firebase';


const loginSchema = z.object({
  username: z.string().min(1, { message: 'Jina la mtumiaji linahitajika' }),
  password: z.string().min(1, { message: 'Nenosiri linahitajika' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsPending(true);
    setError(null);
    try {
        const auth = getAuth(app);
        // Firebase Auth doesn't support direct username/password sign-in.
        // We simulate it by creating an "email" from the username.
        // In a real app, you would typically use email as the identifier.
        const email = `${values.username}@uchumi.app`;
        const userCredential = await signInWithEmailAndPassword(auth, email, values.password);

        const idToken = await userCredential.user.getIdToken();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (response.ok) {
            router.push('/dashboard');
        } else {
            const data = await response.json();
            setError(data.error || 'Failed to create session.');
        }

    } catch (e: any) {
        switch (e.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                setError('Incorrect username or password.');
                break;
            default:
                setError('An unknown error occurred. Please try again.');
                break;
        }
    } finally {
        setIsPending(false);
    }
  };
  
  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Ingia</CardTitle>
          <CardDescription className="text-gray-400">
            Weka jina lako la mtumiaji na nenosiri ili kuendelea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="username">Jina la Mtumiaji</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        required
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="password">Nenosiri</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Kosa la Kuingia</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Inaingia...' : 'Ingia'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Huna akaunti?{' '}
            <Link href="/signup" className="underline text-blue-400">
              Jisajili
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
