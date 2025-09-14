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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CandlestickChart, FileText } from 'lucide-react';

const inventoryItems = [
  { item: 'Corn', quantity: 15000, category: 'Raw Material', value: 75000 },
  {
    item: 'Sunflower Seeds',
    quantity: 8000,
    category: 'Raw Material',
    value: 120000,
  },
  { item: 'Eggs', quantity: 25000, category: 'Raw Material', value: 50000 },
  {
    item: 'Crude Oil',
    quantity: 1000,
    category: 'Raw Material',
    value: 70000,
  },
  {
    item: 'Gold',
    quantity: 500,
    category: 'Precious Metal',
    value: 350000,
  },
  {
    item: 'Corn Flour',
    quantity: 5000,
    category: 'Processed Good',
    value: 90000,
  },
  {
    item: 'Cooking Oil',
    quantity: 3000,
    category: 'Processed Good',
    value: 150000,
  },
  {
    item: 'Chicken Feed',
    quantity: 10000,
    category: 'Processed Good',
    value: 45000,
  },
];

export function Inventory() {
  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ghala (Inventory)</h1>
        <p className="text-muted-foreground">
          Tazama na dhibiti bidhaa zako zote ulizonunua na kuzalisha.
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
                <TableHead className="text-white">Aina</TableHead>
                <TableHead className="text-right text-white">Idadi</TableHead>
                <TableHead className="text-right text-white">
                  Thamani (USD)
                </TableHead>
                <TableHead className="text-right text-white">Vitendo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map(item => (
                <TableRow
                  key={item.item}
                  className="border-gray-700 hover:bg-gray-700/50"
                >
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="text-gray-400">
                    {item.category}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${item.value.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Fungua menyu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-800 border-gray-700 text-white"
                      >
                        <DropdownMenuItem className="hover:bg-gray-700">
                          <CandlestickChart className="mr-2 h-4 w-4" />
                          <span>Uza Sokoni</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-700">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Tengeneza Mkataba</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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