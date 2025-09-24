
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import type { UserData } from '@/app/game';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

export function Leaderboard() {
  const [players, setPlayers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('netWorth', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        playersData.push(doc.data() as UserData);
      });
      setPlayers(playersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ubao wa Viongozi</h1>
        <p className="text-muted-foreground">
          Tazama orodha ya wachezaji matajiri zaidi kwenye mchezo.
        </p>
      </div>

      <Card className="bg-gray-800/60 border-gray-700">
        <CardHeader>
          <CardTitle>Wachezaji Wanaoongoza kwa Utajiri</CardTitle>
          <CardDescription className="text-gray-400">
            Orodha inajipanga kulingana na jumla ya thamani ya mali (Net Worth).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-white w-[60px]">Cheo</TableHead>
                  <TableHead className="text-white">Mchezaji</TableHead>
                  <TableHead className="text-right text-white">Utajiri (Net Worth)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow key={player.uid} className={cn("border-gray-700", index < 3 && "bg-yellow-500/5")}>
                    <TableCell className="font-bold text-lg text-center">
                       {index === 0 && <Crown className="h-6 w-6 text-yellow-400 inline" />}
                       {index === 1 && <Crown className="h-6 w-6 text-slate-400 inline" />}
                       {index === 2 && <Crown className="h-6 w-6 text-amber-600 inline" />}
                       {index > 2 && (index + 1)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://picsum.photos/seed/${player.uid}/40/40`} alt={player.username} data-ai-hint="player avatar" />
                          <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-400 text-lg">
                      ${player.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
