import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_group: string | null;
  is_approved: boolean | null;
  created_at: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  image_url: string;
  category_group: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image_url: '',
    category_group: '',
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal memuat kategori / Failed to load categories');
      console.error(error);
    } else {
      setCategories(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      category_group: '',
    });
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
      category_group: category.category_group || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nama kategori wajib diisi / Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            category_group: formData.category_group || null,
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Kategori berhasil diperbarui / Category updated successfully');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            category_group: formData.category_group || null,
            is_approved: true, // Admin-created categories are auto-approved
          });

        if (error) throw error;
        toast.success('Kategori berhasil dibuat / Category created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan / An error occurred');
    }
  };

  const handleApprove = async (categoryId: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ is_approved: true })
      .eq('id', categoryId);

    if (error) {
      toast.error('Gagal menyetujui kategori / Failed to approve category');
    } else {
      toast.success('Kategori disetujui / Category approved');
      fetchCategories();
    }
  };

  const handleReject = async (categoryId: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ is_approved: false })
      .eq('id', categoryId);

    if (error) {
      toast.error('Gagal menolak kategori / Failed to reject category');
    } else {
      toast.success('Kategori ditolak / Category rejected');
      fetchCategories();
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini? / Are you sure you want to delete this category?')) {
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      toast.error('Gagal menghapus kategori / Failed to delete category');
    } else {
      toast.success('Kategori dihapus / Category deleted');
      fetchCategories();
    }
  };

  const pendingCategories = categories.filter(c => c.is_approved === false || c.is_approved === null);
  const approvedCategories = categories.filter(c => c.is_approved === true);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Kelola Kategori / Category Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori / Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory 
                  ? 'Edit Kategori / Edit Category' 
                  : 'Tambah Kategori Baru / Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama / Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama kategori"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi / Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi kategori"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar / Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_group">Grup Kategori / Category Group</Label>
                <Input
                  id="category_group"
                  value={formData.category_group}
                  onChange={(e) => setFormData({ ...formData, category_group: e.target.value })}
                  placeholder="e.g., Technology, Lifestyle"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal / Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Simpan / Save' : 'Buat / Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Categories */}
      {pendingCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Menunggu Persetujuan / Pending Approval ({pendingCategories.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description || 'Tidak ada deskripsi / No description'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleApprove(category.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleReject(category.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Kategori Disetujui / Approved Categories ({approvedCategories.length})
        </h3>
        {approvedCategories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Belum ada kategori yang disetujui / No approved categories yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Approved
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description || 'Tidak ada deskripsi / No description'}
                  </p>
                  {category.category_group && (
                    <Badge variant="secondary" className="mb-4">
                      {category.category_group}
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(category)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
