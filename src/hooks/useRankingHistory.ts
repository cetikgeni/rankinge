import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RankingSnapshot {
  id: string;
  item_id: string;
  rank_position: number;
  vote_count: number;
  snapshot_at: string;
}

interface RankingMovement {
  itemId: string;
  currentRank: number;
  previousRank: number | null;
  movement: 'up' | 'down' | 'stable' | 'new';
  lastUpdated: string | null;
}

export const useRankingHistory = (categoryId: string | undefined) => {
  const [movements, setMovements] = useState<Map<string, RankingMovement>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);

  const fetchRankingHistory = useCallback(async () => {
    if (!categoryId) return;

    try {
      // Get the two most recent snapshots to calculate movement
      const { data: snapshots, error } = await supabase
        .from('ranking_snapshots')
        .select('*')
        .eq('category_id', categoryId)
        .order('snapshot_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (!snapshots || snapshots.length === 0) {
        setIsLoading(false);
        return;
      }

      // Group by snapshot_at to get distinct snapshots
      const snapshotGroups = new Map<string, RankingSnapshot[]>();
      snapshots.forEach(s => {
        const key = s.snapshot_at;
        if (!snapshotGroups.has(key)) {
          snapshotGroups.set(key, []);
        }
        snapshotGroups.get(key)!.push(s);
      });

      const sortedKeys = Array.from(snapshotGroups.keys()).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );

      const currentSnapshot = snapshotGroups.get(sortedKeys[0]) || [];
      const previousSnapshot = sortedKeys.length > 1 ? snapshotGroups.get(sortedKeys[1]) : null;

      const movementMap = new Map<string, RankingMovement>();

      currentSnapshot.forEach(curr => {
        const prev = previousSnapshot?.find(p => p.item_id === curr.item_id);
        
        let movement: 'up' | 'down' | 'stable' | 'new' = 'new';
        if (prev) {
          if (curr.rank_position < prev.rank_position) movement = 'up';
          else if (curr.rank_position > prev.rank_position) movement = 'down';
          else movement = 'stable';
        }

        movementMap.set(curr.item_id, {
          itemId: curr.item_id,
          currentRank: curr.rank_position,
          previousRank: prev?.rank_position || null,
          movement,
          lastUpdated: curr.snapshot_at,
        });
      });

      setMovements(movementMap);
      setLastSnapshot(sortedKeys[0] || null);
    } catch (error) {
      console.error('Error fetching ranking history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchRankingHistory();
  }, [fetchRankingHistory]);

  const getMovement = (itemId: string): RankingMovement | undefined => {
    return movements.get(itemId);
  };

  return {
    movements,
    getMovement,
    lastSnapshot,
    isLoading,
    refresh: fetchRankingHistory,
  };
};
