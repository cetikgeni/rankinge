import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Edit, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CategoryGroup {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

const CategoryGroupManagement = () => {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<CategoryGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    is_active: true,
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('category_groups')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Gagal memuat grup kategori');
      console.error(error);
    } else {
      setGroups(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nama grup harus diisi');
      return;
    }

    if (editingGroup) {
      // Update existing
      const { error } = await supabase
        .from('category_groups')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon.trim() || null,
          is_active: formData.is_active,
        })
        .eq('id', editingGroup.id);

      if (error) {
        toast.error('Gagal memperbarui grup');
        console.error(error);
      } else {
        toast.success('Grup berhasil diperbarui');
        fetchGroups();
        resetForm();
      }
    } else {
      // Create new
      const maxOrder = groups.length > 0 ? Math.max(...groups.map(g => g.display_order)) + 1 : 1;
      
      const { error } = await supabase
        .from('category_groups')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon.trim() || null,
          is_active: formData.is_active,
          display_order: maxOrder,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Grup dengan nama ini sudah ada');
        } else {
          toast.error('Gagal membuat grup');
          console.error(error);
        }
      } else {
        toast.success('Grup berhasil dibuat');
        fetchGroups();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus grup ini? Kategori dengan grup ini tidak akan terpengaruh.')) {
      return;
    }

    const { error } = await supabase
      .from('category_groups')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Gagal menghapus grup');
      console.error(error);
    } else {
      toast.success('Grup berhasil dihapus');
      fetchGroups();
    }
  };

  const handleEdit = (group: CategoryGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      icon: group.icon || '',
      is_active: group.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      is_active: true,
    });
    setIsDialogOpen(false);
  };

  const toggleActive = async (group: CategoryGroup) => {
    const { error } = await supabase
      .from('category_groups')
      .update({ is_active: !group.is_active })
      .eq('id', group.id);

    if (error) {
      toast.error('Gagal mengubah status');
    } else {
      fetchGroups();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen Grup Kategori</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Grup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Edit Grup Kategori' : 'Tambah Grup Kategori'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Grup *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Technology"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi grup..."
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="💻"
                />
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
        {groups.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Belum ada grup kategori. Klik "Tambah Grup" untuk membuat.
          </p>
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xl">{group.icon || '📁'}</span>
                  <div>
                    <p className="font-medium">{group.name}</p>
                    {group.description && (
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={group.is_active}
                    onCheckedChange={() => toggleActive(group)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(group.id)}
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
  );
};

export default CategoryGroupManagement;
