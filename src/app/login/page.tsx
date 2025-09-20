'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState } from 'react-dom';
import { signInWithEmailAndPassword } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, formAction] = useFormState(signInWithEmailAndPassword, null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-sm bg-gray-800/60 border-gray-700">
        <form action={formAction}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Karibu Tena!</CardTitle>
            <CardDescription className="text-gray-400">
              Ingia kwenye akaunti yako ili kuendeleza himaya yako.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Barua Pepe</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jina@mfano.com"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Nenosiri</Label>
                <Link href="#" className="text-xs text-blue-400 hover:underline">
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
             {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Ingia
              </Button>
            <div className="text-center text-sm text-gray-400">
              Huna akaunti?{" "}
              <Link href="/register" className="font-semibold text-blue-400 hover:underline">
                Jisajili
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
