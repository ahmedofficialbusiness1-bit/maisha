import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function Regions() {
  const regions = PlaceHolderImages;

  return (
    <div className="flex flex-col gap-4 text-white">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Geographical Regions</h1>
            <p className="text-muted-foreground">
                Explore diverse regions, each with unique economic advantages.
            </p>
        </div>
        <Separator className="bg-white/20" />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {regions.map((region) => (
          <Card key={region.id} className="overflow-hidden bg-gray-800/60 border-gray-700">
            <CardHeader className="p-0">
              <Image
                src={region.imageUrl}
                alt={region.description}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={region.imageHint}
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="capitalize mb-2 text-white">
                {region.id.split('-')[0]}
              </CardTitle>
              <CardDescription className="text-gray-400">{region.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
