import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveItem {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  vote_count: number;
  product_url: string | null;
  affiliate_url: string | null;
}

export const useLiveRanking = (categoryId: string | undefined) => {
  const [items, setItems] = useState<LiveItem[]>([]);
  const [isLive, setIsLive] = useState(false);

  const sortItems = (itemList: LiveItem[]) => {
    return [...itemList].sort((a, b) => b.vote_count - a.vote_count);
  };

  const fetchItems = useCallback(async () => {
    if (!categoryId) return;

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('category_id', categoryId)
      .order('vote_count', { ascending: false });

    if (!error && data) {
      setItems(sortItems(data));
    }
  }, [categoryId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (!categoryId) return;

    // Subscribe to realtime changes on items table
    const channel = supabase
      .channel(`items-${categoryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `category_id=eq.${categoryId}`,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            setItems(prev => {
              const updated = prev.map(item =>
                item.id === payload.new.id
                  ? { ...item, ...payload.new }
                  : item
              );
              return sortItems(updated);
            });
          } else if (payload.eventType === 'INSERT') {
            setItems(prev => sortItems([...prev, payload.new as LiveItem]));
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => sortItems(prev.filter(item => item.id !== payload.old.id)));
          }
        }
      )
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryId]);

  return {
    items,
    isLive,
    refresh: fetchItems,
  };
};
