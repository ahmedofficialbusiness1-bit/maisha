'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
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
import { signUpWithEmailAndPassword } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [state, formAction] = useActionState(signUpWithEmailAndPassword, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === false) {
      toast({
        title: 'Usajili Umeshindwa',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="mx-auto max-w-sm bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Tengeneza Akaunti</CardTitle>
          <CardDescription>
            Weka maelezo yako hapa chini ili kuanza safari yako ya uchumi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="displayName">Jina la Kampuni</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="Jina la Kampuni Yako"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
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
              <Label htmlFor="password">Nenosiri</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Tengeneza Akaunti
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Tayari una akaunti?{' '}
            <Link href="/login" className="underline">
              Ingia
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
