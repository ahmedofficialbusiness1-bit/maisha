
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900 text-white">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/maisha/1920/1080"
          alt="African Economic Landscape"
          fill
          className="object-cover"
          data-ai-hint="economic landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-4">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4">
            Karibu Kwenye <span className="text-yellow-400">Uchumi wa Afrika</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Jenga himaya yako ya kiuchumi kutoka mwanzo. Zalisha, biashara, wekeza, na tawala soko la Afrika. Je, unaweza kuwa kinara wa uchumi?
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-600 h-12 px-8 text-lg">
              Anza Kucheza
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
