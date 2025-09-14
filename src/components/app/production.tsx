import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const productionLines = [
  {
    id: 'line-1',
    name: 'Maize Mill',
    product: 'Corn Flour',
    status: 'Running',
    output: 500,
    imageUrl: 'https://picsum.photos/seed/mill/600/400',
    imageHint: 'industrial mill',
  },
  {
    id: 'line-2',
    name: 'Oil Press',
    product: 'Cooking Oil',
    status: 'Idle',
    output: 0,
    imageUrl: 'https://picsum.photos/seed/oilpress/600/400',
    imageHint: 'oil press',
  },
  {
    id: 'line-3',
    name: 'Feed Mixer',
    product: 'Chicken Feed',
    status: 'Maintenance',
    output: 0,
    imageUrl: 'https://picsum.photos/seed/mixer/600/400',
    imageHint: 'feed factory',
  },
];

export function Production() {
  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Lines</h1>
        <p className="text-muted-foreground">
          Manage your factories and production facilities.
        </p>
      </div>
      <Separator className="bg-white/20" />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {productionLines.map((line) => (
          <Card key={line.id} className="overflow-hidden bg-gray-800/60 border-gray-700 text-white">
            <CardHeader className="p-0">
              <Image
                src={line.imageUrl}
                alt={line.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={line.imageHint}
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="capitalize mb-2">{line.name}</CardTitle>
              <CardDescription className="text-gray-400">
                <p>Producing: {line.product}</p>
                <p>Status: {line.status}</p>
                <p>Current Output: {line.output} units/hr</p>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
