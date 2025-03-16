
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CategorySubmission } from '@/lib/types';
import { submitCategory, currentUser } from '@/lib/data';
import AIAssistant from './AIAssistant';

const SubmitCategoryForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CategorySubmission & { items: Array<{ name: string; description: string; productUrl?: string }> }>({
    name: '',
    description: '',
    items: [
      { name: '', description: '', productUrl: '' },
      { name: '', description: '', productUrl: '' },
      { name: '', description: '', productUrl: '' }
    ]
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', productUrl: '' }]
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
    
    // Create submission without productUrl
    const submission: CategorySubmission = {
      name: formData.name,
      description: formData.description,
      items: formData.items.map(({ name, description }) => ({ name, description }))
    };
    
    // Submit category
    const success = submitCategory(submission);
    
    if (success) {
      toast.success('Category submitted for review!');
      navigate('/');
    } else {
      toast.error('Failed to submit category');
      setIsSubmitting(false);
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Category Details</h3>
          <AIAssistant onSuggestion={handleAICategoryAssist} fieldType="category" />
        </div>
        
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
          <div className="flex justify-between items-center">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Category Description
            </label>
            <AIAssistant onSuggestion={handleAIDescriptionAssist} fieldType="description" currentValue={formData.description} />
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
              <div className="flex items-center gap-2">
                <AIAssistant 
                  onSuggestion={(suggestion) => handleAIItemAssist(index, suggestion)} 
                  fieldType="item" 
                  currentValue={item.description}
                />
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
        className="w-full bg-brand-purple hover:bg-brand-purple/90"
        disabled={isSubmitting}
      >
        Submit Category for Review
      </Button>
      
      <p className="text-sm text-gray-500 text-center">
        Your submission will be reviewed by our admins before being published.
      </p>
    </form>
  );
};

export default SubmitCategoryForm;
