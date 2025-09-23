import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Uchumi wa Afrika',
  description: 'Build Africa’s Next Conglomerate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
       <body className={cn('font-body antialiased bg-background text-foreground')}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://picsum.photos/seed/african-savanna/1920/1080')"}} />
        <div className="absolute inset-0 -z-10 bg-black/60"></div>
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
