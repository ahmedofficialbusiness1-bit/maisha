
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { app } from '@/lib/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({
    message: 'Tafadhali ingiza anwani sahihi ya barua pepe.',
  }),
  password: z.string().min(1, {
    message: 'Nenosiri linahitajika.',
  }),
});

export default function LoginPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      router.push('/dashboard');
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential') {
        setError('Barua pepe au nenosiri si sahihi.');
      } else {
        setError('Hitilafu imetokea. Tafadhali jaribu tena.');
      }
      console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Ingia</CardTitle>
          <CardDescription className="text-gray-400">
            Ingiza taarifa zako ili kuendelea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Hitilafu ya Kuingia</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barua Pepe</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jina@mfano.com"
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
                  <FormItem>
                    <FormLabel>Nenosiri</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="bg-gray-700 border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ingia
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm text-gray-400">
             Huna akaunti?{' '}
            <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
              Jisajili
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
