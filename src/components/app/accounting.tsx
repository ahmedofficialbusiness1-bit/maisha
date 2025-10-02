'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Banknote, Warehouse, LineChart, Building, Wallet, TrendingUp, TrendingDown, Percent, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { startOfDay, startOfWeek, startOfMonth, isAfter, subDays, subWeeks, subMonths } from 'date-fns';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  timestamp: number;
};

interface AccountingProps {
  transactions: Transaction[];
  netWorth: number;
  inventoryValue: number;
  stockValue: number;
  buildingValue: number;
  cash: number;
}

const ReportCard = ({ title, value, type }: { title: string, value: number, type: 'income' | 'expense' | 'profit' }) => {
    const isProfit = type === 'profit';
    const isIncome = type === 'income';
    const isExpense = type === 'expense';
    const isPositiveProfit = isProfit && value >= 0;

    return (
        <Card className={cn(
            isIncome && "bg-green-500/10 border-green-500/30",
            isExpense && "bg-red-500/10 border-red-500/30",
            isProfit && (isPositiveProfit ? "bg-blue-500/10 border-blue-500/30" : "bg-orange-500/10 border-orange-500/30")
        )}>
            <CardHeader>
                <CardTitle className={cn(
                    "flex items-center gap-2",
                    isIncome && "text-green-300",
                    isExpense && "text-red-300",
                    isProfit && (isPositiveProfit ? "text-blue-300" : "text-orange-300")
                )}>
                   {isIncome && <ArrowUpRight />}
                   {isExpense && <ArrowDownLeft />}
                   {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-white">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
        </Card>
    );
}

const ReportPeriodView = ({ transactions }: { transactions: Transaction[] }) => {
    const { totalIncome, totalExpenses, netProfit } = React.useMemo(() => {
        const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpenses;
        return { totalIncome, totalExpenses, netProfit };
    }, [transactions]);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <ReportCard title="Jumla ya Mapato" value={totalIncome} type="income" />
                <ReportCard title="Jumla ya Matumizi" value={totalExpenses} type="expense" />
                <ReportCard title="Faida/Hasara Halisi" value={netProfit} type="profit" />
            </div>

             <Card className="bg-gray-800/60 border-gray-700 text-white">
                <CardHeader>
                <CardTitle>Orodha ya Miamala</CardTitle>
                <CardDescription className="text-gray-400">
                    Historia ya miamala yote ya kifedha kwa kipindi hiki.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <ScrollArea className="h-[40vh]">
                    <Table>
                    <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-700/50 sticky top-0 bg-gray-800/95">
                        <TableHead className="text-white">Aina</TableHead>
                        <TableHead className="text-white">Maelezo</TableHead>
                        <TableHead className="text-white hidden sm:table-cell">Muda</TableHead>
                        <TableHead className="text-right text-white">Kiasi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                        <TableRow key={t.id} className="border-gray-700 hover:bg-gray-700/50">
                            <TableCell className="p-2 sm:p-4">
                            <span
                                className={cn(
                                'flex items-center gap-2 font-semibold',
                                t.type === 'income' ? 'text-green-400' : 'text-red-400'
                                )}
                            >
                                {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                <span className="hidden sm:inline">{t.type === 'income' ? 'Mapato' : 'Matumizi'}</span>
                            </span>
                            </TableCell>
                            <TableCell className="text-gray-300 p-2 sm:p-4">{t.description}</TableCell>
                            <TableCell className="text-gray-400 text-xs hidden sm:table-cell p-2 sm:p-4">
                                {new Date(t.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell className={cn(
                                'text-right font-mono p-2 sm:p-4',
                                t.type === 'income' ? 'text-green-400' : 'text-red-400'
                            )}>
                            {t.type === 'expense' ? '-' : ''}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    {transactions.length === 0 && (
                        <div className="flex items-center justify-center h-48 text-gray-400">
                            <p>Hakuna miamala iliyorekodiwa kwa kipindi hiki.</p>
                        </div>
                    )}
                </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

const NetWorthView = ({ netWorth, inventoryValue, stockValue, buildingValue, cash }: Omit<AccountingProps, 'transactions'>) => {
    
    const MetricCard = ({ title, value, icon }: { title: string, value: number, icon: React.ElementType }) => (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
                {React.createElement(icon, { className: "h-5 w-5 text-gray-400" })}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4">
            <Card className="bg-blue-900/30 border-blue-500/50">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-blue-300">Utajiri Wako Wote (Net Worth)</CardTitle>
                    <CardDescription className="text-blue-400">Jumla ya thamani ya mali zako zote.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold text-white">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </CardContent>
            </Card>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Pesa Taslimu" value={cash} icon={Banknote} />
                <MetricCard title="Thamani ya Bidhaa" value={inventoryValue} icon={Warehouse} />
                <MetricCard title="Thamani ya Hisa" value={stockValue} icon={LineChart} />
                <MetricCard title="Thamani ya Majengo" value={buildingValue} icon={Building} />
             </div>
        </div>
    )
}

const AnalyticsView = ({ transactions, netWorth }: Pick<AccountingProps, 'transactions' | 'netWorth'>) => {
    
    const chartData = React.useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const sortedTransactions = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
        let currentBalance = 0;
        const dataPoints = sortedTransactions.map(t => {
            const change = t.type === 'income' ? t.amount : -t.amount;
            currentBalance += change;
            return {
                date: new Date(t.timestamp).toLocaleDateString(),
                netWorth: currentBalance, // This is simplified, real net worth is more complex
            };
        });

        // For this example, let's just create some dummy historical net worth data
        // A real implementation would process transactions to build this history
        const data = [];
        let runningWorth = netWorth / 2; // Start from half of current net worth for demo
        for (let i = 30; i >= 0; i--) {
            runningWorth += (Math.random() - 0.45) * (runningWorth / 20);
             data.push({
                date: subDays(new Date(), i).toISOString().split('T')[0],
                netWorth: Math.max(0, runningWorth),
            });
        }
        
        return data;

    }, [transactions, netWorth]);

    const chartConfig = {
        netWorth: {
          label: "Net Worth",
          color: "hsl(var(--chart-1))",
        },
    } satisfies import('recharts').ChartConfig;


    const { dailyChange, weeklyChange, monthlyChange, returnOnSales } = React.useMemo(() => {
        const now = new Date();
        const dayAgo = subDays(now, 1).getTime();
        const weekAgo = subWeeks(now, 1).getTime();
        const monthAgo = subMonths(now, 1).getTime();

        const findClosestPoint = (targetTime: number) => 
            chartData.reduce((prev, curr) => 
                (Math.abs(new Date(curr.date).getTime() - targetTime) < Math.abs(new Date(prev.date).getTime() - targetTime) ? curr : prev),
                chartData[0]
            );

        const lastPoint = chartData[chartData.length - 1];
        if (!lastPoint) return { dailyChange: 0, weeklyChange: 0, monthlyChange: 0, returnOnSales: 0 };

        const dayAgoPoint = findClosestPoint(dayAgo);
        const weekAgoPoint = findClosestPoint(weekAgo);
        const monthAgoPoint = findClosestPoint(monthAgo);

        const daily = dayAgoPoint ? ((lastPoint.netWorth - dayAgoPoint.netWorth) / dayAgoPoint.netWorth) * 100 : 0;
        const weekly = weekAgoPoint ? ((lastPoint.netWorth - weekAgoPoint.netWorth) / weekAgoPoint.netWorth) * 100 : 0;
        const monthly = monthAgoPoint ? ((lastPoint.netWorth - monthAgoPoint.netWorth) / monthAgoPoint.netWorth) * 100 : 0;
        
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const ros = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        return {
            dailyChange: isFinite(daily) ? daily : 0,
            weeklyChange: isFinite(weekly) ? weekly : 0,
            monthlyChange: isFinite(monthly) ? monthly : 0,
            returnOnSales: isFinite(ros) ? ros : 0,
        };

    }, [chartData, transactions]);


    const StatCard = ({ title, value, unit, change }: { title: string, value: number, unit: string, change?: number }) => (
        <Card className="bg-gray-800/50">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toFixed(2)}{unit}</div>
                {change !== undefined && (
                    <div className={cn("text-xs flex items-center gap-1 mt-1", change >= 0 ? "text-green-400" : "text-red-400")}>
                        {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {change.toFixed(2)}%
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Ukuaji wa Utajiri (Net Worth)</CardTitle>
                    <CardDescription>Jinsi thamani ya kampuni yako imebadilika kwa muda.</CardDescription>
                </CardHeader>
                <CardContent className="pr-0">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: "3 3" }}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Line type="monotone" dataKey="netWorth" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <StatCard title="Ukuaji wa Siku" value={dailyChange} unit="%" change={dailyChange} />
                <StatCard title="Ukuaji wa Wiki" value={weeklyChange} unit="%" change={weeklyChange} />
                <StatCard title="Faida kwa Mauzo (RoS)" value={returnOnSales} unit="%" />
            </div>

        </div>
    );
};


export function Accounting({ transactions, netWorth, inventoryValue, stockValue, buildingValue, cash }: AccountingProps) {
  
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const dailyTransactions = transactions.filter(t => isAfter(t.timestamp, todayStart));
  const weeklyTransactions = transactions.filter(t => isAfter(t.timestamp, weekStart));
  const monthlyTransactions = transactions.filter(t => isAfter(t.timestamp, monthStart));

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ripoti ya Kifedha</h1>
        <p className="text-muted-foreground">
          Fuatilia mapato, matumizi, na angalia afya ya kifedha ya himaya yako.
        </p>
      </div>
      
       <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/80 max-w-2xl">
            <TabsTrigger value="daily">Leo</TabsTrigger>
            <TabsTrigger value="weekly">Wiki Hii</TabsTrigger>
            <TabsTrigger value="monthly">Mwezi Huu</TabsTrigger>
            <TabsTrigger value="net_worth"><Wallet className="mr-2 h-4 w-4"/> Thamani Halisi</TabsTrigger>
            <TabsTrigger value="analytics"><LineChart className="mr-2 h-4 w-4"/> Uchambuzi</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
            <ReportPeriodView transactions={dailyTransactions} />
        </TabsContent>
         <TabsContent value="weekly" className="mt-4">
            <ReportPeriodView transactions={weeklyTransactions} />
        </TabsContent>
         <TabsContent value="monthly" className="mt-4">
            <ReportPeriodView transactions={monthlyTransactions} />
        </TabsContent>
        <TabsContent value="net_worth" className="mt-4">
            <NetWorthView netWorth={netWorth} inventoryValue={inventoryValue} stockValue={stockValue} buildingValue={buildingValue} cash={cash} />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
            <AnalyticsView transactions={transactions} netWorth={netWorth} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    