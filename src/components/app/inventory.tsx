'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '../ui/separator';

const inventoryItems = [
  { item: 'Corn', quantity: 15000 },
  {
    item: 'Sunflower Seeds',
    quantity: 8000,
  },
  { item: 'Eggs', quantity: 25000 },
  {
    item: 'Crude Oil',
    quantity: 1000,
  },
  {
    item: 'Gold',
    quantity: 500,
  },
  {
    item: 'Corn Flour',
    quantity: 5000,
  },
  {
    item: 'Cooking Oil',
    quantity: 3000,
  },
  {
    item: 'Chicken Feed',
    quantity: 10000,
  },
];

export function Inventory() {
  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ghala (Inventory)</h1>
        <p className="text-muted-foreground">
          Tazama bidhaa zako zote ulizonunua na kuzalisha.
        </p>
      </div>
      <Separator className="bg-white/20" />
      <Card className="bg-gray-800/60 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Orodha ya Bidhaa</CardTitle>
          <CardDescription className="text-gray-400">
            Hizi ndizo bidhaa ulizonazo kwenye ghala lako.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                <TableHead className="text-white">Bidhaa</TableHead>
                <TableHead className="text-right text-white">Idadi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map(item => (
                <TableRow
                  key={item.item}
                  className="border-gray-700 hover:bg-gray-700/50"
                >
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.quantity.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
