'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '@/lib/firebase';


const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Jina la mtumiaji lazima liwe na angalau herufi 3' })
      .max(31, { message: 'Jina la mtumiaji lisizidi herufi 31' }),
    password: z
      .string()
      .min(6, { message: 'Nenosiri lazima liwe na angalau herufi 6' })
      .max(255, { message: 'Nenosiri lisizidi herufi 255' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Manenosiri hayafanani',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState(false);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: ''
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        setIsPending(true);
        setError(null);
        try {
            const auth = getAuth(app);
            const email = `${values.username}@uchumi.app`; // Simulate email
            const userCredential = await createUserWithEmailAndPassword(auth, email, values.password);
            
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
            if (e.code === 'auth/email-already-in-use') {
                setError('Username already taken. Please choose another one.');
            } else {
                setError('An unknown error occurred. Please try again.');
            }
        } finally {
            setIsPending(false);
        }
    }


  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Jisajili</CardTitle>
          <CardDescription className="text-gray-400">
            Tengeneza akaunti mpya ili uanze kucheza.
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="confirmPassword">
                      Thibitisha Nenosiri
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
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
                  <AlertTitle>Kosa la Usajili</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

             <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Inasajili...' : 'Jisajili'}
             </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Tayari una akaunti?{' '}
            <Link href="/login" className="underline text-blue-400">
              Ingia
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
