
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { VoteHistoryPoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { Badge } from './ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface VoteHistoryProps {
  history: VoteHistoryPoint[];
  itemName: string;
}

const VoteHistory = ({ history, itemName }: VoteHistoryProps) => {
  // Sort history by date
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate position changes
  const historyWithChanges = sortedHistory.map((point, index) => {
    if (index === 0) {
      return { ...point, change: 0 };
    }
    
    const prevPosition = sortedHistory[index - 1].position;
    const currentPosition = point.position;
    const change = prevPosition - currentPosition; // Positive means improved rank (moved up)
    
    return { ...point, change };
  });
  
  // Prepare data for recharts (needs to be in a specific format)
  const chartData = historyWithChanges.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    position: point.position,
    votes: point.voteCount,
  }));
  
  // Function to render position change indicator
  const renderPositionChange = (change: number) => {
    if (change > 0) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />
          {change}
        </Badge>
      );
    } else if (change < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
          <ArrowDown className="h-3 w-3" />
          {Math.abs(change)}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 flex items-center gap-1">
          <Minus className="h-3 w-3" />
        </Badge>
      );
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ranking History for {itemName}</CardTitle>
      </CardHeader>
      <CardContent>
        {historyWithChanges.length > 1 ? (
          <>
            <div className="h-48 mt-4 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPosition" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="position" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorPosition)" 
                    name="Position"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="votes" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorVotes)" 
                    name="Votes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyWithChanges.slice().reverse().map((point, index) => (
                  <TableRow key={point.date}>
                    <TableCell className="font-medium">
                      {formatDistance(new Date(point.date), new Date(), { addSuffix: true })}
                    </TableCell>
                    <TableCell>#{point.position}</TableCell>
                    <TableCell>{renderPositionChange(point.change)}</TableCell>
                    <TableCell>{point.voteCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Not enough data to show history yet. Check back after more votes!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoteHistory;
