import { useState } from 'react';
import { Settings, Key, Percent, Hash, Eye, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAppSettings, VoteDisplayMode } from '@/hooks/useAppSettings';

type AiProviderType = 'lovable' | 'google' | 'openai';

const AdminSettings = () => {
  const { settings, isLoading, updateVoteDisplayMode, updateAiConfig } = useAppSettings();
  const [aiProvider, setAiProvider] = useState<AiProviderType>(settings.customAiProvider || 'lovable');
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleVoteDisplayChange = async (value: VoteDisplayMode) => {
    setIsSaving(true);
    await updateVoteDisplayMode(value);
    setIsSaving(false);
  };

  const handleSaveAiConfig = async () => {
    setIsSaving(true);
    await updateAiConfig(aiProvider as 'lovable' | 'google' | 'openai', apiKey || undefined);
    setApiKey(''); // Clear API key from UI after saving
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Pengaturan / Settings</h2>
      </div>

      {/* Vote Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Tampilan Vote / Vote Display
          </CardTitle>
          <CardDescription>
            Pilih bagaimana vote ditampilkan di halaman kategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.voteDisplayMode}
            onValueChange={(value) => handleVoteDisplayChange(value as VoteDisplayMode)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage" className="flex items-center gap-2 cursor-pointer flex-1">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Persentase Saja</p>
                  <p className="text-sm text-muted-foreground">Tampilkan vote sebagai persentase (45%)</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="count" id="count" />
              <Label htmlFor="count" className="flex items-center gap-2 cursor-pointer flex-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Jumlah Saja</p>
                  <p className="text-sm text-muted-foreground">Tampilkan jumlah vote (123 votes)</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="flex items-center gap-2 cursor-pointer flex-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Keduanya</p>
                  <p className="text-sm text-muted-foreground">Tampilkan persentase dan jumlah (45% - 123 votes)</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Konfigurasi AI / AI Configuration
          </CardTitle>
          <CardDescription>
            Pilih provider AI dan masukkan API key jika menggunakan provider eksternal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select 
              value={aiProvider} 
              onValueChange={(value: string) => setAiProvider(value as AiProviderType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lovable">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Lovable AI (Default - Tidak perlu API key)
                  </div>
                </SelectItem>
                <SelectItem value="google">Google Gemini</SelectItem>
                <SelectItem value="openai">OpenAI GPT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {aiProvider !== 'lovable' && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  API Key {aiProvider === 'google' ? 'Google Gemini' : 'OpenAI'}
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... atau AIza..."
                />
                <p className="text-xs text-muted-foreground">
                  {aiProvider === 'google' 
                    ? 'Dapatkan API key di console.cloud.google.com'
                    : 'Dapatkan API key di platform.openai.com'}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveAiConfig} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Simpan Konfigurasi AI
            </Button>
          </div>

          {settings.customAiProvider && settings.customAiProvider !== 'lovable' && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
              ✓ Saat ini menggunakan: {settings.customAiProvider === 'google' ? 'Google Gemini' : 'OpenAI GPT'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
