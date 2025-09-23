'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/app/actions';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Inasajili...' : 'Jisajili'}
    </Button>
  );
}

export default function SignupPage() {
    const router = useRouter();
    const [state, formAction] = useActionState(signup, undefined);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: ''
        },
    });

    useEffect(() => {
        if (state && !state.error) {
            router.push('/dashboard');
        }
    }, [state, router]);

    const onSubmit = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            const values = form.getValues();
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('password', values.password);
            formAction(formData);
        }
    };

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
              
               {state?.error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Kosa la Usajili</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <SubmitButton />
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
