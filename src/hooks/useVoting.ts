import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useVoting(categoryId: string | undefined) {
  const { user } = useAuth();
  const [userVotedItemId, setUserVotedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !categoryId) {
      setUserVotedItemId(null);
      return;
    }

    const fetchUserVote = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .maybeSingle();

      if (!error && data) {
        setUserVotedItemId(data.item_id);
      }
    };

    fetchUserVote();
  }, [user, categoryId]);

  const vote = async (itemId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Anda harus login untuk vote / You must be logged in to vote');
      return false;
    }

    if (!categoryId) {
      toast.error('Category not found');
      return false;
    }

    setIsLoading(true);

    try {
      // Check if user already voted in this category
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('id, item_id')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingVote) {
        if (existingVote.item_id === itemId) {
          toast.info('Anda sudah memilih item ini / You already voted for this item');
          setIsLoading(false);
          return true;
        }

        // Update existing vote to new item
        const { error: updateError } = await supabase
          .from('votes')
          .update({ item_id: itemId })
          .eq('id', existingVote.id);

        if (updateError) throw updateError;
        
        setUserVotedItemId(itemId);
        toast.success('Vote diperbarui! / Vote updated!');
      } else {
        // Create new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            category_id: categoryId,
            item_id: itemId
          });

        if (insertError) throw insertError;
        
        setUserVotedItemId(itemId);
        toast.success('Vote berhasil! / Vote recorded!');
      }

      return true;
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Gagal menyimpan vote / Failed to record vote');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { userVotedItemId, vote, isLoading };
}
