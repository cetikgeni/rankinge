import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export type VoteDisplayMode = 'percentage' | 'count' | 'both';

export interface AppSettings {
  voteDisplayMode: VoteDisplayMode;
  customAiApiKey: string | null;
  customAiProvider: 'lovable' | 'google' | 'openai' | null;
}

const defaultSettings: AppSettings = {
  voteDisplayMode: 'percentage',
  customAiApiKey: null,
  customAiProvider: 'lovable'
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value');
    
    if (error) {
      console.error('Error fetching app settings:', error);
      setIsLoading(false);
      return;
    }

    const newSettings = { ...defaultSettings };
    
    data?.forEach(setting => {
      if (setting.key === 'vote_display') {
        const value = setting.value as { mode?: VoteDisplayMode };
        newSettings.voteDisplayMode = value?.mode || 'percentage';
      }
      if (setting.key === 'ai_config') {
        const value = setting.value as { api_key?: string; provider?: string };
        newSettings.customAiApiKey = value?.api_key || null;
        newSettings.customAiProvider = (value?.provider as AppSettings['customAiProvider']) || 'lovable';
      }
    });

    setSettings(newSettings);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateVoteDisplayMode = async (mode: VoteDisplayMode) => {
    const valueJson = { mode } as unknown as Json;
    
    // First try to update
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .eq('key', 'vote_display')
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from('app_settings')
        .update({ value: valueJson })
        .eq('key', 'vote_display');
      error = result.error;
    } else {
      const result = await supabase
        .from('app_settings')
        .insert([{ key: 'vote_display', value: valueJson }]);
      error = result.error;
    }

    if (error) {
      toast.error('Gagal menyimpan pengaturan / Failed to save settings');
      return false;
    }

    setSettings(prev => ({ ...prev, voteDisplayMode: mode }));
    toast.success('Pengaturan disimpan / Settings saved');
    return true;
  };

  const updateAiConfig = async (provider: AppSettings['customAiProvider'], apiKey?: string) => {
    const valueObj: { provider: typeof provider; api_key?: string } = { provider };
    if (apiKey) {
      valueObj.api_key = apiKey;
    }
    const valueJson = valueObj as unknown as Json;

    // First try to update
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .eq('key', 'ai_config')
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from('app_settings')
        .update({ value: valueJson })
        .eq('key', 'ai_config');
      error = result.error;
    } else {
      const result = await supabase
        .from('app_settings')
        .insert([{ key: 'ai_config', value: valueJson }]);
      error = result.error;
    }

    if (error) {
      toast.error('Gagal menyimpan pengaturan AI / Failed to save AI settings');
      return false;
    }

    setSettings(prev => ({ 
      ...prev, 
      customAiProvider: provider,
      customAiApiKey: apiKey || null
    }));
    toast.success('Pengaturan AI disimpan / AI settings saved');
    return true;
  };

  return { 
    settings, 
    isLoading, 
    updateVoteDisplayMode, 
    updateAiConfig,
    refetch: fetchSettings 
  };
}
