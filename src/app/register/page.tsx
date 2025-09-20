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
import { signUpWithEmailAndPassword } from "@/app/auth/actions";

export default function RegisterPage() {
  const [state, formAction] = useFormState(signUpWithEmailAndPassword, null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-sm bg-gray-800/60 border-gray-700">
        <form action={formAction}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tengeneza Akaunti Mpya</CardTitle>
            <CardDescription className="text-gray-400">
              Jaza fomu ili kuanza safari yako ya kiuchumi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">Jina la Mchezaji/Kampuni</Label>
              <Input
                id="playerName"
                name="playerName"
                type="text"
                placeholder="Mfano: Juma Enterprises"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
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
              <Label htmlFor="password">Nenosiri</Label>
              <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Thibitisha Nenosiri</Label>
              <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  className="bg-gray-700 border-gray-600"
              />
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Jisajili
              </Button>
            <div className="text-center text-sm text-gray-400">
              Tayari una akaunti?{" "}
              <Link href="/login" className="font-semibold text-blue-400 hover:underline">
                Ingia
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
