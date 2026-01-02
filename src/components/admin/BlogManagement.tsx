import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  is_published: boolean;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image_url: '',
    is_published: false,
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal memuat artikel / Failed to load posts');
      console.error(error);
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      cover_image_url: '',
      is_published: false,
    });
    setEditingPost(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      cover_image_url: post.cover_image_url || '',
      is_published: post.is_published || false,
    });
    setIsDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Judul dan konten wajib diisi / Title and content are required');
      return;
    }

    const slug = formData.slug || generateSlug(formData.title);

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            slug,
            content: formData.content,
            excerpt: formData.excerpt || null,
            cover_image_url: formData.cover_image_url || null,
            is_published: formData.is_published,
            published_at: formData.is_published && !editingPost.published_at 
              ? new Date().toISOString() 
              : editingPost.published_at,
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Artikel berhasil diperbarui / Post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: formData.title,
            slug,
            content: formData.content,
            excerpt: formData.excerpt || null,
            cover_image_url: formData.cover_image_url || null,
            is_published: formData.is_published,
            published_at: formData.is_published ? new Date().toISOString() : null,
          });

        if (error) throw error;
        toast.success('Artikel berhasil dibuat / Post created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Slug sudah digunakan / Slug already exists');
      } else {
        toast.error(error.message || 'Terjadi kesalahan / An error occurred');
      }
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const newPublishedState = !post.is_published;
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        is_published: newPublishedState,
        published_at: newPublishedState && !post.published_at 
          ? new Date().toISOString() 
          : post.published_at,
      })
      .eq('id', post.id);

    if (error) {
      toast.error('Gagal mengubah status / Failed to toggle status');
    } else {
      toast.success(
        newPublishedState 
          ? 'Artikel dipublikasikan / Post published' 
          : 'Artikel disembunyikan / Post unpublished'
      );
      fetchPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini? / Are you sure you want to delete this post?')) {
      return;
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast.error('Gagal menghapus artikel / Failed to delete post');
    } else {
      toast.success('Artikel dihapus / Post deleted');
      fetchPosts();
    }
  };

  const publishedPosts = posts.filter(p => p.is_published);
  const draftPosts = posts.filter(p => !p.is_published);

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
          Kelola Blog / Blog Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Tulis Artikel / Write Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost 
                  ? 'Edit Artikel / Edit Post' 
                  : 'Tulis Artikel Baru / Write New Post'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul / Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Judul artikel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{formData.slug || 'your-slug'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan / Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Konten / Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis konten artikel di sini... (Mendukung Markdown)"
                  rows={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_image_url">URL Gambar Cover / Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">
                  Publikasikan sekarang / Publish now
                </Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal / Cancel
                </Button>
                <Button type="submit">
                  {editingPost ? 'Simpan / Save' : 'Buat / Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Draft Posts */}
      {draftPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-gray-500" />
            Draft ({draftPosts.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {draftPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      Draft
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Dibuat: {format(new Date(post.created_at), 'dd MMM yyyy')}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => togglePublish(post)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(post)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Published Posts */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-500" />
          Dipublikasikan / Published ({publishedPosts.length})
        </h3>
        {publishedPosts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              Belum ada artikel yang dipublikasikan / No published posts yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Published
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Dipublikasikan: {post.published_at && format(new Date(post.published_at), 'dd MMM yyyy')}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-600"
                      onClick={() => togglePublish(post)}
                    >
                      <EyeOff className="h-4 w-4 mr-1" />
                      Unpublish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(post)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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

export default BlogManagement;
