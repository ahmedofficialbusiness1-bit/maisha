import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

const marketData = [
  { commodity: 'Corn', price: 150.75, volume: '1.2M', change: 1.5, changeType: 'increase' },
  { commodity: 'Sunflower Seeds', price: 320.50, volume: '800K', change: -0.8, changeType: 'decrease' },
  { commodity: 'Eggs', price: 210.00, volume: '2.5M', change: 2.1, changeType: 'increase' },
  { commodity: 'Corn Flour', price: 280.25, volume: '500K', change: 0.5, changeType: 'increase' },
  { commodity: 'Cooking Oil', price: 550.00, volume: '300K', change: -1.2, changeType: 'decrease' },
  { commodity: 'Chicken Feed', price: 180.90, volume: '950K', change: 0.2, changeType: 'increase' },
  { commodity: 'Soybeans', price: 410.10, volume: '600K', change: -2.5, changeType: 'decrease' },
];

export function TradeMarket() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spot Market</CardTitle>
        <CardDescription>
          Buy and sell commodities in a real-time, player-driven market.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commodity</TableHead>
              <TableHead className="text-right">Price (USD)</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketData.map((item) => (
              <TableRow key={item.commodity}>
                <TableCell className="font-medium">{item.commodity}</TableCell>
                <TableCell className="text-right font-mono">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1 font-mono ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.changeType === 'increase' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    {Math.abs(item.change)}%
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{item.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
