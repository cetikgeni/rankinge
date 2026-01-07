import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Edit, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FreeImageSearch } from '@/components/FreeImageSearch';

interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  priority: number;
  clicks: number;
  impressions: number;
  advertiser_name: string | null;
  advertiser_email: string | null;
}

interface AdRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  plan: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const AdvertisementManagement = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    placement: 'sidebar',
    is_active: true,
    priority: 0,
    advertiser_name: '',
    advertiser_email: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    const [adsRes, requestsRes] = await Promise.all([
      supabase.from('advertisements').select('*').order('priority', { ascending: false }),
      supabase.from('ad_requests').select('*').order('created_at', { ascending: false }),
    ]);

    if (adsRes.error) console.error('Ads error:', adsRes.error);
    if (requestsRes.error) console.error('Requests error:', requestsRes.error);

    setAds(adsRes.data || []);
    setAdRequests(requestsRes.data || []);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Judul iklan harus diisi');
      return;
    }

    const adData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      link_url: formData.link_url.trim() || null,
      placement: formData.placement,
      is_active: formData.is_active,
      priority: formData.priority,
      advertiser_name: formData.advertiser_name.trim() || null,
      advertiser_email: formData.advertiser_email.trim() || null,
    };

    if (editingAd) {
      const { error } = await supabase
        .from('advertisements')
        .update(adData)
        .eq('id', editingAd.id);

      if (error) {
        toast.error('Gagal memperbarui iklan');
        console.error(error);
      } else {
        toast.success('Iklan berhasil diperbarui');
        fetchData();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('advertisements')
        .insert(adData);

      if (error) {
        toast.error('Gagal membuat iklan');
        console.error(error);
      } else {
        toast.success('Iklan berhasil dibuat');
        fetchData();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus iklan ini?')) return;

    const { error } = await supabase.from('advertisements').delete().eq('id', id);

    if (error) {
      toast.error('Gagal menghapus iklan');
    } else {
      toast.success('Iklan berhasil dihapus');
      fetchData();
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      placement: ad.placement,
      is_active: ad.is_active,
      priority: ad.priority,
      advertiser_name: ad.advertiser_name || '',
      advertiser_email: ad.advertiser_email || '',
    });
    setIsDialogOpen(true);
  };

  const toggleActive = async (ad: Advertisement) => {
    const { error } = await supabase
      .from('advertisements')
      .update({ is_active: !ad.is_active })
      .eq('id', ad.id);

    if (error) {
      toast.error('Gagal mengubah status');
    } else {
      fetchData();
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('ad_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Gagal mengubah status');
    } else {
      toast.success(`Status diubah ke ${status}`);
      fetchData();
    }
  };

  const resetForm = () => {
    setEditingAd(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      placement: 'sidebar',
      is_active: true,
      priority: 0,
      advertiser_name: '',
      advertiser_email: '',
    });
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="ads" className="space-y-4">
      <TabsList>
        <TabsTrigger value="ads">Iklan Aktif ({ads.length})</TabsTrigger>
        <TabsTrigger value="requests">Permintaan ({adRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
      </TabsList>

      <TabsContent value="ads">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manajemen Iklan</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Iklan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAd ? 'Edit Iklan' : 'Tambah Iklan'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Gambar</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="URL gambar"
                      />
                      <FreeImageSearch onImageSelected={(url) => setFormData({ ...formData, image_url: url })} />
                    </div>
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="mt-2 h-20 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="link_url">Link URL</Label>
                    <Input
                      id="link_url"
                      value={formData.link_url}
                      onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Penempatan</Label>
                    <Select
                      value={formData.placement}
                      onValueChange={(value) => setFormData({ ...formData, placement: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="sponsored">Sponsored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioritas (0-100)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="advertiser_name">Nama Pengiklan</Label>
                      <Input
                        id="advertiser_name"
                        value={formData.advertiser_name}
                        onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="advertiser_email">Email Pengiklan</Label>
                      <Input
                        id="advertiser_email"
                        type="email"
                        value={formData.advertiser_email}
                        onChange={(e) => setFormData({ ...formData, advertiser_email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {ads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada iklan.
              </p>
            ) : (
              <div className="space-y-3">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      {ad.image_url && (
                        <img src={ad.image_url} alt={ad.title} className="h-12 w-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{ad.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{ad.placement}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {ad.impressions} tayangan • {ad.clicks} klik
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(ad)}
                        title={ad.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {ad.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requests">
        <Card>
          <CardHeader>
            <CardTitle>Permintaan Iklan</CardTitle>
          </CardHeader>
          <CardContent>
            {adRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada permintaan iklan.
              </p>
            ) : (
              <div className="space-y-3">
                {adRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{request.name}</p>
                        {request.company && <p className="text-sm text-muted-foreground">{request.company}</p>}
                      </div>
                      <Badge 
                        variant={request.status === 'pending' ? 'default' : 
                                 request.status === 'approved' ? 'secondary' : 'destructive'}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Email:</span> {request.email}</p>
                      {request.phone && <p><span className="text-muted-foreground">Telp:</span> {request.phone}</p>}
                      {request.plan && <p><span className="text-muted-foreground">Paket:</span> {request.plan}</p>}
                      {request.message && <p className="text-muted-foreground mt-2">{request.message}</p>}
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => updateRequestStatus(request.id, 'approved')}>
                          Setujui
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateRequestStatus(request.id, 'rejected')}>
                          Tolak
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdvertisementManagement;
