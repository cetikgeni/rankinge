import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySubmission } from '@/lib/types';
import { getAllCategoryIcons } from '@/lib/category-icons';
import ImageUploader from './ImageUploader';
import { AIGenerateButton } from './AIGenerateButton';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const SubmitCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryGroups, setCategoryGroups] = useState<{name: string}[]>([]);
  
  const { generate, isGenerating } = useAIGenerate();
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CategorySubmission & { 
    items: Array<{ name: string; description: string; productUrl?: string; imageUrl?: string }>,
    categoryGroup?: string;
    imageUrl?: string;
  }>({
    name: '',
    description: '',
    categoryGroup: '',
    imageUrl: '',
    items: [
      { name: '', description: '', productUrl: '', imageUrl: '' },
      { name: '', description: '', productUrl: '', imageUrl: '' },
      { name: '', description: '', productUrl: '', imageUrl: '' },
    ]
  });
  
  useEffect(() => {
    const allCategoryIcons = getAllCategoryIcons();
    setCategoryGroups(allCategoryIcons.map(group => ({ name: group.name })));
    
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    
    if (editId) {
      loadCategoryForEdit(editId);
    }
  }, [location.search]);

  const loadCategoryForEdit = async (editId: string) => {
    if (!user) return;
    
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', editId)
      .eq('created_by', user.id)
      .single();

    if (error || !category) {
      toast.error('You can only edit your own categories');
      navigate('/');
      return;
    }

    const { data: items } = await supabase
      .from('items')
      .select('*')
      .eq('category_id', editId);

    setIsEditing(true);
    setCategoryId(editId);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.image_url || '',
      categoryGroup: category.category_group || '',
      items: items?.map(item => ({
        name: item.name,
        description: item.description || '',
        productUrl: item.product_url || '',
        imageUrl: item.image_url || ''
      })) || [{ name: '', description: '', productUrl: '', imageUrl: '' }]
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryGroupChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryGroup: value
    }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value
    };
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
  };

  const handleItemImageUpload = (index: number, imageUrl: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      imageUrl
    };
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', productUrl: '', imageUrl: '' }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 2) {
      toast.error('You need at least 2 items in a category');
      return;
    }
    
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // AI Generation handlers
  const handleGenerateDescription = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a category name first');
      return;
    }
    setGeneratingField('description');
    const result = await generate('category_description', formData.name);
    if (result) {
      setFormData(prev => ({ ...prev, description: result as string }));
      toast.success('Description generated!');
    }
    setGeneratingField(null);
  };

  const handleGenerateItems = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a category name first');
      return;
    }
    setGeneratingField('items');
    const result = await generate('category_items', formData.name);
    if (result && Array.isArray(result)) {
      const newItems = result.map((item: { name: string; description: string }) => ({
        name: item.name,
        description: item.description,
        productUrl: '',
        imageUrl: ''
      }));
      setFormData(prev => ({ ...prev, items: newItems }));
      toast.success('Items generated!');
    }
    setGeneratingField(null);
  };

  const handleGenerateComplete = async () => {
    const topic = formData.name.trim() || formData.categoryGroup;
    if (!topic) {
      toast.error('Please enter a category name or select a group');
      return;
    }
    setGeneratingField('complete');
    const result = await generate('complete_category', topic);
    if (result && typeof result === 'object') {
      const data = result as { name: string; description: string; items: Array<{ name: string; description: string }> };
      setFormData(prev => ({
        ...prev,
        name: data.name,
        description: data.description,
        items: data.items.map(item => ({
          name: item.name,
          description: item.description,
          productUrl: '',
          imageUrl: ''
        }))
      }));
      toast.success('Complete category generated!');
    }
    setGeneratingField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a new category');
      navigate('/login');
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Category description is required');
      return;
    }
    
    if (formData.items.length < 2) {
      toast.error('You need at least 2 items in a category');
      return;
    }
    
    const emptyItems = formData.items.filter(item => !item.name.trim());
    if (emptyItems.length > 0) {
      toast.error('All items must have a name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && categoryId) {
        // Update existing category
        const { error: categoryError } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description,
            category_group: formData.categoryGroup || null,
            image_url: formData.imageUrl || null,
          })
          .eq('id', categoryId);

        if (categoryError) throw categoryError;

        // Delete existing items and insert new ones
        await supabase.from('items').delete().eq('category_id', categoryId);

        const { error: itemsError } = await supabase
          .from('items')
          .insert(formData.items.map(item => ({
            category_id: categoryId,
            name: item.name,
            description: item.description || null,
            product_url: item.productUrl || null,
            image_url: item.imageUrl || null,
          })));

        if (itemsError) throw itemsError;
        
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description,
            category_group: formData.categoryGroup || null,
            image_url: formData.imageUrl || null,
            created_by: user.id,
            is_approved: false, // Requires admin approval
          })
          .select()
          .single();

        if (categoryError) throw categoryError;

        const { error: itemsError } = await supabase
          .from('items')
          .insert(formData.items.map(item => ({
            category_id: category.id,
            name: item.name,
            description: item.description || null,
            product_url: item.productUrl || null,
            image_url: item.imageUrl || null,
          })));

        if (itemsError) throw itemsError;
        
        toast.success('Category submitted for review!');
      }
      
      navigate('/');
    } catch (error: unknown) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Quick Generate Section */}
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Quick Generate with AI</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Enter a topic and let AI generate a complete category with items.
        </p>
        <div className="flex gap-2">
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Best Smartphones 2024"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleGenerateComplete}
            disabled={generatingField === 'complete'}
          >
            {generatingField === 'complete' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Details</h3>
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Category Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleCategoryChange}
            placeholder="e.g., Breakfast Cereals"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="categoryGroup" className="text-sm font-medium text-foreground">
            Category Group
          </label>
          <Select
            value={formData.categoryGroup}
            onValueChange={handleCategoryGroupChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category group" />
            </SelectTrigger>
            <SelectContent>
              {categoryGroups.map((group, index) => (
                <SelectItem key={index} value={group.name}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Category Description
            </label>
            <AIGenerateButton
              onClick={handleGenerateDescription}
              isGenerating={generatingField === 'description'}
              tooltip="Generate description with AI"
            />
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleCategoryChange}
            placeholder="Describe what this category is about..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="categoryImage" className="text-sm font-medium text-foreground">
            Category Image
          </label>
          <div className="flex flex-col gap-4">
            {formData.imageUrl && (
              <div className="w-full h-48 rounded-md overflow-hidden bg-muted">
                <img 
                  src={formData.imageUrl} 
                  alt="Category" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <ImageUploader onImageUploaded={handleImageUpload} />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Items</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateItems}
              disabled={generatingField === 'items'}
            >
              {generatingField === 'items' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              AI Generate
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addItem}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
        
        {formData.items.map((item, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-foreground">Item #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor={`item-name-${index}`} className="text-sm font-medium text-foreground">
                Item Name
              </label>
              <Input
                id={`item-name-${index}`}
                name="name"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="e.g., Cheerios"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor={`item-description-${index}`} className="text-sm font-medium text-foreground">
                Item Description
              </label>
              <Textarea
                id={`item-description-${index}`}
                name="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Describe this item..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`item-image-${index}`} className="text-sm font-medium text-foreground">
                Item Image
              </label>
              <div className="flex flex-col gap-4">
                {item.imageUrl && (
                  <div className="w-full h-32 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name || "Item"} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <ImageUploader onImageUploaded={(url) => handleItemImageUpload(index, url)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <label htmlFor={`item-product-url-${index}`} className="text-sm font-medium text-foreground">
                  Product URL (optional)
                </label>
              </div>
              <Input
                id={`item-product-url-${index}`}
                name="productUrl"
                value={item.productUrl}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEditing ? 'Updating...' : 'Submitting...'}
            </>
          ) : (
            isEditing ? 'Update Category' : 'Submit Category for Review'
          )}
        </Button>
        
        <p className="text-sm text-center text-muted-foreground">
          {isEditing 
            ? 'Your changes will be reviewed by an admin before they are published.'
            : 'Your category will be reviewed by an admin before it is published.'}
        </p>
      </div>
    </form>
  );
};

export default SubmitCategoryForm;
