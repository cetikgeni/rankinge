import { useState, useEffect } from 'react';
import { Loader2, Pencil, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  title_id: string | null;
  content: string;
  content_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  updated_at: string;
}

const StaticPagesManagement = () => {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('static_pages')
      .select('*')
      .order('slug');

    if (error) {
      toast.error('Failed to load pages');
    } else {
      setPages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page: StaticPage) => {
    setEditingPage({ ...page });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPage) return;
    
    setIsSaving(true);
    
    const { error } = await supabase
      .from('static_pages')
      .update({
        title: editingPage.title,
        title_id: editingPage.title_id,
        content: editingPage.content,
        content_id: editingPage.content_id,
        meta_title: editingPage.meta_title,
        meta_description: editingPage.meta_description,
        is_published: editingPage.is_published,
      })
      .eq('id', editingPage.id);

    setIsSaving(false);

    if (error) {
      toast.error('Failed to save page');
    } else {
      toast.success('Page saved successfully');
      setIsDialogOpen(false);
      setEditingPage(null);
      fetchPages();
    }
  };

  const togglePublish = async (page: StaticPage) => {
    const { error } = await supabase
      .from('static_pages')
      .update({ is_published: !page.is_published })
      .eq('id', page.id);

    if (error) {
      toast.error('Failed to update page');
    } else {
      toast.success(page.is_published ? 'Page unpublished' : 'Page published');
      fetchPages();
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Static Pages</h2>
      </div>

      <div className="grid gap-4">
        {pages.map(page => (
          <Card key={page.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{page.title}</h3>
                    <Badge variant={page.is_published ? "default" : "secondary"}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(page)}
                  >
                    {page.is_published ? (
                      <><EyeOff className="h-4 w-4 mr-1" /> Unpublish</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-1" /> Publish</>
                    )}
                  </Button>
                  <Button size="sm" onClick={() => handleEdit(page)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Page: {editingPage?.slug}</DialogTitle>
          </DialogHeader>

          {editingPage && (
            <Tabs defaultValue="english" className="mt-4">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="indonesian">Indonesian</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="english" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content (EN)</Label>
                  <Textarea
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Supports Markdown formatting</p>
                </div>
              </TabsContent>

              <TabsContent value="indonesian" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title (ID)</Label>
                  <Input
                    value={editingPage.title_id || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, title_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content (ID)</Label>
                  <Textarea
                    value={editingPage.content_id || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, content_id: e.target.value })}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={editingPage.meta_title || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, meta_title: e.target.value })}
                    placeholder="SEO title (50-60 characters)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={editingPage.meta_description || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                    placeholder="SEO description (150-160 characters)"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingPage.is_published}
                    onCheckedChange={(checked) => setEditingPage({ ...editingPage, is_published: checked })}
                  />
                  <Label>Published</Label>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaticPagesManagement;
