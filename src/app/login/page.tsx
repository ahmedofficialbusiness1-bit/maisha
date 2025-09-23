'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, validateRequest } from '@/app/actions';
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
import { useEffect } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Jina la mtumiaji linahitajika' }),
  password: z.string().min(1, { message: 'Nenosiri linahitajika' }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Inaingia...' : 'Ingia'}
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, undefined);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (state && !state.error) {
       router.push('/dashboard');
    }
  }, [state, router]);

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
              action={formAction}
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

              {state?.error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Kosa la Kuingia</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <SubmitButton />
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
