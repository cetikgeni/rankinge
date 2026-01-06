import { useState } from 'react';
import { Pencil, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FreeImageSearch } from '@/components/FreeImageSearch';

interface CategoryData {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_group: string | null;
}

interface ItemData {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  product_url: string | null;
  affiliate_url: string | null;
}

interface AdminCategoryEditorProps {
  category: CategoryData;
  items: ItemData[];
  onUpdate: () => void;
}

const AdminCategoryEditor = ({ category, items, onUpdate }: AdminCategoryEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryData, setCategoryData] = useState(category);
  const [itemsData, setItemsData] = useState(items);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleSaveCategory = async () => {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('categories')
      .update({
        name: categoryData.name,
        description: categoryData.description,
        image_url: categoryData.image_url,
        category_group: categoryData.category_group,
      })
      .eq('id', category.id);

    if (error) {
      toast.error('Failed to save category');
    } else {
      toast.success('Category saved');
      onUpdate();
    }
    
    setIsSaving(false);
  };

  const handleSaveItem = async (item: ItemData) => {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('items')
      .update({
        name: item.name,
        description: item.description,
        image_url: item.image_url,
        product_url: item.product_url,
        affiliate_url: item.affiliate_url,
      })
      .eq('id', item.id);

    if (error) {
      toast.error('Failed to save item');
    } else {
      toast.success('Item saved');
      setEditingItemId(null);
      onUpdate();
    }
    
    setIsSaving(false);
  };

  const updateItem = (id: string, updates: Partial<ItemData>) => {
    setItemsData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Category & Items</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="category" className="mt-4">
          <TabsList>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="items">Items ({items.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="category" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                value={categoryData.name}
                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={categoryData.description || ''}
                onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category Group</Label>
              <Input
                value={categoryData.category_group || ''}
                onChange={(e) => setCategoryData({ ...categoryData, category_group: e.target.value })}
                placeholder="e.g., Technology, Food & Beverages"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <Input
                  value={categoryData.image_url || ''}
                  onChange={(e) => setCategoryData({ ...categoryData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
                <FreeImageSearch 
                  onImageSelected={(url) => setCategoryData({ ...categoryData, image_url: url })}
                />
              </div>
              {categoryData.image_url && (
                <img 
                  src={categoryData.image_url} 
                  alt="Preview" 
                  className="h-32 w-full object-cover rounded-md mt-2"
                />
              )}
            </div>

            <Button onClick={handleSaveCategory} disabled={isSaving} className="w-full">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Category
            </Button>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Edit item details. Note: Editing does NOT affect vote counts or rankings.
            </p>
            
            {itemsData.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">#{index + 1} {item.name}</span>
                  {editingItemId === item.id ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItemId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleSaveItem(item)}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingItemId(item.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {editingItemId === item.id ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={item.image_url || ''}
                          onChange={(e) => updateItem(item.id, { image_url: e.target.value })}
                          className="flex-1"
                        />
                        <FreeImageSearch 
                          onImageSelected={(url) => updateItem(item.id, { image_url: url })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Product URL</Label>
                      <Input
                        value={item.product_url || ''}
                        onChange={(e) => updateItem(item.id, { product_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Affiliate URL</Label>
                      <Input
                        value={item.affiliate_url || ''}
                        onChange={(e) => updateItem(item.id, { affiliate_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {item.description?.slice(0, 100)}...
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCategoryEditor;
