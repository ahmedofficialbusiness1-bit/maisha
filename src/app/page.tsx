import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Uchumi wa Afrika</h1>
        <p className="text-xl text-gray-300">
          Build Africa’s Next Conglomerate.
        </p>
        <p className="max-w-2xl mx-auto text-gray-400">
          Anza na mtaji mdogo, jenga viwanda, zalisha bidhaa, na uuze kwenye soko. Panda ngazi kutoka kwa mfanyabiashara mdogo hadi kuwa tajiri anayeongoza uchumi wa bara zima.
        </p>
        <Link href="/login">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg h-12 px-8">
            Anza Kucheza
          </Button>
        </Link>
      </div>
    </main>
  );
}
