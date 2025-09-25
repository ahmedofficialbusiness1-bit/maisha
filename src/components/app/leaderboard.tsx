'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Trophy } from 'lucide-react';

export type LeaderboardEntry = {
    uid: string;
    username: string;
    netWorth: number;
    avatar: string;
}

interface LeaderboardProps {
    allPlayers: LeaderboardEntry[];
}

export function Leaderboard({ allPlayers }: LeaderboardProps) {
  const sortedPlayers = React.useMemo(() => {
    return [...allPlayers].sort((a,b) => b.netWorth - a.netWorth)
  }, [allPlayers]);

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
            Ubao wa wanaoongoza haupatikani kwenye mchezo wa ndani.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {sortedPlayers.length > 0 ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white w-16">#</TableHead>
                        <TableHead className="text-white">Mchezaji</TableHead>
                        <TableHead className="text-right text-white">Utajiri (Net Worth)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedPlayers.map((player, index) => (
                        <TableRow key={player.uid}>
                            <TableCell className="font-bold text-lg flex items-center gap-2">
                                {index + 1}
                                {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                                {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                                {index === 2 && <Trophy className="h-5 w-5 text-orange-400" />}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={player.avatar} alt={player.username} data-ai-hint="player avatar" />
                                        <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold">{player.username}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-lg text-green-400">
                                ${player.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
           ) : (
             <div className="flex items-center justify-center h-48 text-gray-500">
                <p>Hakuna data ya wachezaji kwa sasa.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
