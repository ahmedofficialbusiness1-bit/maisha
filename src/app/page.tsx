
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl bg-gray-900/80 border-gray-700/60 text-white backdrop-blur-sm text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Uchumi wa Afrika</CardTitle>
          <CardDescription className="text-lg text-gray-300 pt-2">
            Jenga Himaya Yako ya Kiuchumi
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base text-gray-400 space-y-4">
            <p>
                Anza kama mjasiriamali mdogo na ukuze biashara yako kuwa kongwe la kimataifa. Lima, chakata, zalisha bidhaa, na uuze katika soko la ushindani. 
            </p>
            <p>
                Wekeza kwenye soko la hisa, dhibiti fedha zako, na shindana na wachezaji wengine kuwa tajiri namba moja barani Afrika.
            </p>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Link href="/signup">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                    Anza Mchezo
                </Button>
            </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
