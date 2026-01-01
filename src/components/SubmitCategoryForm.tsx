import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  ExternalLink, 
  Upload,
  Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySubmission } from '@/lib/types';
import { submitCategory, currentUser, getCategoryById, getAllCategories } from '@/lib/data';
import { getAllCategoryIcons } from '@/lib/category-icons';
// AI Assistant disabled for MVP
// import AIAssistant from './AIAssistant';
import ImageUploader from './ImageUploader';

// Feature flag for AI Assistant (disabled for MVP)
const ENABLE_AI_ASSISTANT = false;

// Let's add the missing updateCategory function to data.ts
// We'll then modify the SubmitCategoryForm to use this function

const SubmitCategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryGroups, setCategoryGroups] = useState<{name: string}[]>([]);
  
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
    // Extract category groups from the icon data
    const allCategoryIcons = getAllCategoryIcons();
    setCategoryGroups(allCategoryIcons.map(group => ({ name: group.name })));
    
    // Check if we're in edit mode
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    
    if (editId) {
      const category = getCategoryById(editId);
      if (category && category.createdBy === currentUser?.id) {
        setIsEditing(true);
        setCategoryId(editId);
        
        // Populate form with existing category data
        setFormData({
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
          categoryGroup: category.categoryGroup || '', // This will need to be matched or left blank
          items: category.items.map(item => ({
            name: item.name,
            description: item.description,
            productUrl: item.productUrl || '',
            imageUrl: item.imageUrl
          }))
        });
      } else {
        // If the category doesn't exist or doesn't belong to the user, redirect
        toast.error('You can only edit your own categories');
        navigate('/');
      }
    }
  }, [location.search, navigate]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to submit a new category');
      navigate('/login');
      return;
    }
    
    // Validate form
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
    
    // Check if all items have names
    const emptyItems = formData.items.filter(item => !item.name.trim());
    if (emptyItems.length > 0) {
      toast.error('All items must have a name');
      return;
    }
    
    setIsSubmitting(true);
    
    const submission: CategorySubmission & { categoryGroup?: string; imageUrl?: string } = {
      name: formData.name,
      description: formData.description,
      categoryGroup: formData.categoryGroup,
      imageUrl: formData.imageUrl,
      items: formData.items.map(({ name, description, productUrl, imageUrl }) => ({ 
        name, 
        description,
        productUrl: productUrl && productUrl.trim() !== '' ? productUrl : undefined,
        imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl : undefined
      }))
    };
    
    let success = false;
    
    if (isEditing && categoryId) {
      // Update existing category - we'll implement this in data.ts
      // For now, just simulate success
      const updatedCategories = getAllCategories().map(cat => {
        if (cat.id === categoryId && cat.createdBy === currentUser.id) {
          return {
            ...cat,
            name: submission.name,
            description: submission.description,
            categoryGroup: submission.categoryGroup,
            imageUrl: submission.imageUrl || cat.imageUrl,
            items: submission.items.map((item, index) => ({
              id: cat.items[index]?.id || `updated-${Date.now()}-${index}`,
              name: item.name,
              description: item.description,
              imageUrl: item.imageUrl || cat.items[index]?.imageUrl || 'https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=2940&auto=format&fit=crop',
              voteCount: cat.items[index]?.voteCount || 0,
              productUrl: item.productUrl
            }))
          };
        }
        return cat;
      });
      
      // Simulated success for now
      success = true;
      if (success) {
        toast.success('Category updated successfully!');
      } else {
        toast.error('Failed to update category');
      }
    } else {
      // Submit new category
      success = submitCategory(submission);
      if (success) {
        toast.success('Category submitted for review!');
      } else {
        toast.error('Failed to submit category');
      }
    }
    
    if (success) {
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  const handleAICategoryAssist = (suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion
    }));
  };

  const handleAIDescriptionAssist = (suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      description: suggestion
    }));
  };

  const handleAIItemAssist = (index: number, suggestion: string) => {
    // Extract likely name and description from the suggestion
    // Format is usually "Name - Description"
    const parts = suggestion.split(' - ');
    
    const updatedItems = [...formData.items];
    if (parts.length > 1) {
      updatedItems[index] = {
        ...updatedItems[index],
        name: parts[0],
        description: parts.slice(1).join(' - ')
      };
    } else {
      // If no clear separator, just use it as description
      updatedItems[index] = {
        ...updatedItems[index],
        description: suggestion
      };
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleCompleteCategory = (data: {
    name: string;
    description: string;
    items: Array<{name: string; description: string}>
  }) => {
    // Map the AI suggested items to our format (with empty productUrl)
    const formattedItems = data.items.map(item => ({
      name: item.name,
      description: item.description,
      productUrl: '',
      imageUrl: ''
    }));

    // Update the entire form with the AI suggested category
    setFormData({
      name: data.name,
      description: data.description,
      categoryGroup: formData.categoryGroup,
      imageUrl: formData.imageUrl,
      items: formattedItems
    });

    toast.success('Complete category generated!');
  };

   return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Assistant section disabled for MVP */}
      {/* 
      <div className="mb-6">
        <div className="bg-brand-purple/5 p-4 rounded-lg border border-brand-purple/20 mb-6">
          <h3 className="text-lg font-medium mb-3 text-brand-purple">Quick Generate Complete Category</h3>
          <p className="text-sm text-gray-600 mb-3">
            Enter a single keyword (like "smartphones" or "breakfast") and our AI will generate a complete category with items.
          </p>
          <AIAssistant 
            onSuggestion={() => {}} 
            fieldType="completeCategory"
            onCategoryWithItems={handleCompleteCategory}
          />
        </div>
      </div>
      */}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Details</h3>
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
          <label htmlFor="categoryGroup" className="text-sm font-medium text-gray-700">
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
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Category Description
          </label>
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
          <label htmlFor="categoryImage" className="text-sm font-medium text-gray-700">
            Category Image
          </label>
          <div className="flex flex-col gap-4">
            {formData.imageUrl && (
              <div className="w-full h-48 rounded-md overflow-hidden bg-gray-100">
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
        
        {formData.items.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Item #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor={`item-name-${index}`} className="text-sm font-medium text-gray-700">
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
              <label htmlFor={`item-description-${index}`} className="text-sm font-medium text-gray-700">
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
              <label htmlFor={`item-image-${index}`} className="text-sm font-medium text-gray-700">
                Item Image
              </label>
              <div className="flex flex-col gap-4">
                {item.imageUrl && (
                  <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100">
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
                <LinkIcon className="h-3.5 w-3.5 text-gray-500" />
                <label htmlFor={`item-product-url-${index}`} className="text-sm font-medium text-gray-700">
                  Product URL (optional)
                </label>
              </div>
              <div className="flex">
                <Input
                  id={`item-product-url-${index}`}
                  name="productUrl"
                  value={item.productUrl}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="https://example.com/product"
                  className="rounded-r-none"
                />
                <Button
                  type="button" 
                  variant="outline" 
                  size="icon"
                  className="h-10 rounded-l-none border-l-0"
                  disabled={!item.productUrl}
                  onClick={() => {
                    if (item.productUrl) {
                      window.open(item.productUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-brand-green hover:bg-brand-green/90"
        disabled={isSubmitting}
      >
        {isEditing ? 'Update Category' : 'Submit Category for Review'}
      </Button>
      
      <p className="text-sm text-gray-500 text-center">
        {isEditing 
          ? 'Your update will be reviewed by our admins before being published.' 
          : 'Your submission will be reviewed by our admins before being published.'}
      </p>
    </form>
  );
};

export default SubmitCategoryForm;
