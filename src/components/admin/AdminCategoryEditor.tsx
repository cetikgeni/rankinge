import { useState } from 'react';
import { Pencil, Save, X, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    image_url: '',
    product_url: '',
    affiliate_url: ''
  });

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

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      toast.error('Item name is required');
      return;
    }

    setIsSaving(true);
    
    const { data, error } = await supabase
      .from('items')
      .insert({
        category_id: category.id,
        name: newItem.name,
        description: newItem.description || null,
        image_url: newItem.image_url || null,
        product_url: newItem.product_url || null,
        affiliate_url: newItem.affiliate_url || null,
        vote_count: 0
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add item');
    } else {
      toast.success('Item added');
      setItemsData(prev => [...prev, {
        id: data.id,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        product_url: data.product_url,
        affiliate_url: data.affiliate_url
      }]);
      setNewItem({
        name: '',
        description: '',
        image_url: '',
        product_url: '',
        affiliate_url: ''
      });
      setIsAddingItem(false);
      onUpdate();
    }
    
    setIsSaving(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setIsSaving(true);
    
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast.error('Failed to delete item');
    } else {
      toast.success('Item deleted');
      setItemsData(prev => prev.filter(item => item.id !== itemId));
      onUpdate();
    }
    
    setIsSaving(false);
  };

  const updateItem = (id: string, updates: Partial<ItemData>) => {
    setItemsData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create a temporary URL for preview (in production, upload to storage)
    const url = URL.createObjectURL(file);
    setCategoryData({ ...categoryData, image_url: url });
    toast.info('Image selected. Save to apply changes.');
  };

  const handleItemImageUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    updateItem(itemId, { image_url: url });
    toast.info('Image selected. Save to apply changes.');
  };

  const handleNewItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setNewItem({ ...newItem, image_url: url });
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
            <TabsTrigger value="items">Items ({itemsData.length})</TabsTrigger>
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
              <Label>Category Image</Label>
              <div className="flex gap-2 flex-wrap">
                <Input
                  value={categoryData.image_url || ''}
                  onChange={(e) => setCategoryData({ ...categoryData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 min-w-[200px]"
                />
                <FreeImageSearch 
                  onImageSelected={(url) => setCategoryData({ ...categoryData, image_url: url })}
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Edit item details. Note: Editing does NOT affect vote counts or rankings.
              </p>
              <Button 
                size="sm" 
                onClick={() => setIsAddingItem(true)}
                disabled={isAddingItem}
                className="bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {/* Add New Item Form */}
            {isAddingItem && (
              <div className="border-2 border-dashed border-primary/50 rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-primary">New Item</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setIsAddingItem(false);
                        setNewItem({
                          name: '',
                          description: '',
                          image_url: '',
                          product_url: '',
                          affiliate_url: ''
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleAddItem}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name *</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      rows={2}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Image</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Input
                        value={newItem.image_url}
                        onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 min-w-[150px]"
                      />
                      <FreeImageSearch 
                        onImageSelected={(url) => setNewItem({ ...newItem, image_url: url })}
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewItemImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {newItem.image_url && (
                      <img 
                        src={newItem.image_url} 
                        alt="Preview" 
                        className="h-24 w-full object-cover rounded-md mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Product URL</Label>
                    <Input
                      value={newItem.product_url}
                      onChange={(e) => setNewItem({ ...newItem, product_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Affiliate URL</Label>
                    <Input
                      value={newItem.affiliate_url}
                      onChange={(e) => setNewItem({ ...newItem, affiliate_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}
            
            {itemsData.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">#{index + 1} {item.name}</span>
                  <div className="flex gap-2">
                    {editingItemId === item.id ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingItemId(item.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isSaving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
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
                      <Label className="text-xs">Image</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Input
                          value={item.image_url || ''}
                          onChange={(e) => updateItem(item.id, { image_url: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 min-w-[150px]"
                        />
                        <FreeImageSearch 
                          onImageSelected={(url) => updateItem(item.id, { image_url: url })}
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleItemImageUpload(item.id, e)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt="Preview" 
                          className="h-24 w-full object-cover rounded-md mt-2"
                        />
                      )}
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
                  <div className="flex gap-3">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {item.description?.slice(0, 100)}...
                    </p>
                  </div>
                )}
              </div>
            ))}

            {itemsData.length === 0 && !isAddingItem && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items in this category.</p>
                <Button 
                  className="mt-2"
                  onClick={() => setIsAddingItem(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Item
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCategoryEditor;
