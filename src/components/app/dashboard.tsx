'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Warehouse,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: 'January', assets: 18600, liabilities: 8000 },
  { month: 'February', assets: 30500, liabilities: 12000 },
  { month: 'March', assets: 23700, liabilities: 15000 },
  { month: 'April', assets: 27300, liabilities: 19000 },
  { month: 'May', assets: 40900, liabilities: 22000 },
  { month: 'June', assets: 45900, liabilities: 25000 },
];

const chartConfig = {
  assets: {
    label: 'Assets',
    color: 'hsl(var(--chart-1))',
  },
  liabilities: {
    label: 'Liabilities',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const productionData = [
  { id: 'PROD-001', item: 'Corn Flour', quantity: 500, status: 'Completed' },
  { id: 'PROD-002', item: 'Cooking Oil', quantity: 250, status: 'In Progress' },
  { id: 'PROD-003', item: 'Chicken Feed', quantity: 1000, status: 'In Progress' },
  { id: 'PROD-004', item: 'Eggs', quantity: 1200, status: 'Pending' },
];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-8 text-white">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-$2,105.41</div>
            <p className="text-xs text-muted-foreground">-15.3% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,750.00</div>
            <p className="text-xs text-muted-foreground">Across 3 warehouses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle>Balance Sheet Overview</CardTitle>
            <CardDescription>
              A monthly summary of your company's assets and liabilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2}/>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  stroke="hsl(var(--muted-foreground))"
                />
                 <YAxis 
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="assets" fill="var(--color-assets)" radius={4} />
                <Bar dataKey="liabilities" fill="var(--color-liabilities)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle>Active Production</CardTitle>
            <CardDescription>
              A snapshot of your current factory production lines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionData.map((prod) => (
                  <TableRow key={prod.id} className="border-gray-700">
                    <TableCell className="font-medium">{prod.item}</TableCell>
                    <TableCell className="text-right">{prod.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          prod.status === 'Completed'
                            ? 'default'
                            : prod.status === 'In Progress'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={
                           prod.status === 'Completed' ? 'bg-green-600/80 text-white' 
                           : prod.status === 'In Progress' ? 'bg-blue-600/80 text-white' 
                           : 'bg-gray-600/80 text-white'
                        }
                      >
                        {prod.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
