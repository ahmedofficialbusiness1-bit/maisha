'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPassword } from '@/app/auth/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [state, formAction] = useFormState(signInWithEmailAndPassword, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === false) {
      toast({
        title: 'Kuingia Imeshindwa',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="mx-auto max-w-sm bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Karibu Tena!</CardTitle>
          <CardDescription>
            Ingiza barua pepe yako hapa chini ili uingie kwenye akaunti yako.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Barua pepe</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@mfano.com"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Nenosiri</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Umesahau nenosiri?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Ingia
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Huna akaunti?{' '}
            <Link href="/register" className="underline">
              Jisajili
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
