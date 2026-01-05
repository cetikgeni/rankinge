import { useState } from 'react';
import { Loader2, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface GenerationOptions {
  generateCategories: boolean;
  generateItems: boolean;
  generateBlog: boolean;
  seedRanking: boolean;
}

interface QuantitySettings {
  categories: number;
  itemsPerCategory: number;
  blogArticles: number;
}

const AIContentGenerator = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { generate, isGenerating } = useAIGenerate();
  
  const [options, setOptions] = useState<GenerationOptions>({
    generateCategories: true,
    generateItems: true,
    generateBlog: false,
    seedRanking: false,
  });
  
  const [quantities, setQuantities] = useState<QuantitySettings>({
    categories: 3,
    itemsPerCategory: 5,
    blogArticles: 2,
  });
  
  const [language, setLanguage] = useState<'en' | 'id' | 'both'>('en');
  const [categoryGroup, setCategoryGroup] = useState('Technology');
  const [generationStep, setGenerationStep] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleOptionChange = (key: keyof GenerationOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQuantityChange = (key: keyof QuantitySettings, value: number) => {
    setQuantities(prev => ({ ...prev, [key]: Math.max(1, Math.min(10, value)) }));
  };

  const generateContent = async () => {
    try {
      // Step 1: Generate categories if selected
      if (options.generateCategories) {
        setGenerationStep('Generating categories...');
        
        const categoriesResult = await generate('complete_category', 
          `Generate ${quantities.categories} unique category ideas for a ranking website. Category group: ${categoryGroup}. Language: ${language === 'both' ? 'English with Indonesian translation' : language}`,
          { count: quantities.categories, categoryGroup, language }
        );
        
        if (!categoriesResult) throw new Error('Failed to generate categories');
        
        // Parse and store categories
        const categories = Array.isArray(categoriesResult) ? categoriesResult : [categoriesResult];
        
        for (const cat of categories) {
          // Insert category
          const { data: categoryData, error: catError } = await supabase
            .from('categories')
            .insert({
              name: cat.name || cat.title || 'Untitled Category',
              description: cat.description || '',
              category_group: categoryGroup,
              is_approved: true,
              image_url: getDefaultImageForCategory(categoryGroup),
            })
            .select()
            .single();
          
          if (catError) {
            console.error('Error creating category:', catError);
            continue;
          }
          
          // Step 2: Generate items for this category if selected
          if (options.generateItems && categoryData) {
            setGenerationStep(`Generating items for ${categoryData.name}...`);
            
            const itemsResult = await generate('category_items',
              `Generate ${quantities.itemsPerCategory} items/products for the category "${categoryData.name}". Language: ${language === 'both' ? 'English with Indonesian translation' : language}`,
              { categoryId: categoryData.id, count: quantities.itemsPerCategory, language }
            );
            
            if (itemsResult) {
              const items = Array.isArray(itemsResult) ? itemsResult : [itemsResult];
              
              for (const item of items) {
                await supabase.from('items').insert({
                  category_id: categoryData.id,
                  name: item.name || 'Untitled Item',
                  description: item.description || '',
                  image_url: getDefaultImageForCategory(categoryGroup),
                  vote_count: options.seedRanking ? Math.floor(Math.random() * 50) + 10 : 0,
                  product_url: item.product_url || null,
                });
              }
            }
          }
        }
      }
      
      // Step 3: Generate blog content if selected
      if (options.generateBlog) {
        setGenerationStep('Generating blog articles...');
        
        for (let i = 0; i < quantities.blogArticles; i++) {
          const blogResult = await generate('blog_content',
            `Write an SEO-optimized blog article about ${categoryGroup} topics. Language: ${language === 'both' ? 'English with Indonesian translation' : language}`,
            { categoryGroup, language }
          );
          
          if (blogResult) {
            const slug = generateSlug(blogResult.title || `article-${Date.now()}`);
            
            await supabase.from('blog_posts').insert({
              title: blogResult.title || 'Untitled Article',
              title_id: language === 'both' ? blogResult.title_id : null,
              slug,
              content: blogResult.content || '',
              content_id: language === 'both' ? blogResult.content_id : null,
              excerpt: blogResult.excerpt || '',
              excerpt_id: language === 'both' ? blogResult.excerpt_id : null,
              meta_title: blogResult.title || '',
              meta_description: blogResult.excerpt || '',
              is_published: false,
              cover_image_url: getDefaultImageForCategory(categoryGroup),
            });
          }
        }
      }
      
      setGenerationStep(null);
      toast.success(t('ai.success'));
      
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStep(null);
      toast.error(t('ai.error'));
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 100);
  };

  const getDefaultImageForCategory = (group: string): string => {
    const images: Record<string, string> = {
      'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      'Food & Beverages': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      'Fashion & Apparel': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
      'Entertainment': 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&h=600&fit=crop',
      'Sports & Fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
      'Home & Living': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    };
    return images[group] || images['Technology'];
  };

  const categoryGroups = [
    'Technology',
    'Food & Beverages',
    'Fashion & Apparel',
    'Entertainment',
    'Sports & Fitness',
    'Home & Living',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('ai.generator')}</h1>
              <p className="text-muted-foreground">Generate categories, items, and blog content safely</p>
            </div>
          </div>

          {/* Warning Banner */}
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">Important Guidelines</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>AI generates TEXT content only - images are fetched from Unsplash</li>
                <li>Seed rankings are separate from real user votes</li>
                <li>Generated content will be marked as seed content</li>
                <li>Review content before publishing to production</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Content Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Content Types</CardTitle>
                <CardDescription>Select what content to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="categories" 
                    checked={options.generateCategories}
                    onCheckedChange={() => handleOptionChange('generateCategories')}
                  />
                  <Label htmlFor="categories">{t('ai.generateCategories')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="items" 
                    checked={options.generateItems}
                    onCheckedChange={() => handleOptionChange('generateItems')}
                    disabled={!options.generateCategories}
                  />
                  <Label htmlFor="items" className={!options.generateCategories ? 'opacity-50' : ''}>
                    {t('ai.generateItems')}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="blog" 
                    checked={options.generateBlog}
                    onCheckedChange={() => handleOptionChange('generateBlog')}
                  />
                  <Label htmlFor="blog">{t('ai.generateBlog')}</Label>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="seed" 
                    checked={options.seedRanking}
                    onCheckedChange={() => handleOptionChange('seedRanking')}
                    disabled={!options.generateItems}
                  />
                  <Label htmlFor="seed" className={!options.generateItems ? 'opacity-50' : ''}>
                    {t('ai.seedRanking')}
                  </Label>
                </div>
                
                {options.seedRanking && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 pl-6">
                    {t('ai.seedWarning')}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure generation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category Group</Label>
                  <Select value={categoryGroup} onValueChange={setCategoryGroup}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('ai.language')}</Label>
                  <Select value={language} onValueChange={(v: 'en' | 'id' | 'both') => setLanguage(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                      <SelectItem value="both">Both (Bilingual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10}
                      value={quantities.categories}
                      onChange={(e) => handleQuantityChange('categories', parseInt(e.target.value) || 1)}
                      disabled={!options.generateCategories}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Items/Category</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10}
                      value={quantities.itemsPerCategory}
                      onChange={(e) => handleQuantityChange('itemsPerCategory', parseInt(e.target.value) || 1)}
                      disabled={!options.generateItems}
                    />
                  </div>
                </div>
                
                {options.generateBlog && (
                  <div className="space-y-2">
                    <Label>Blog Articles</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={5}
                      value={quantities.blogArticles}
                      onChange={(e) => handleQuantityChange('blogArticles', parseInt(e.target.value) || 1)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generation Status */}
          {generationStep && (
            <Alert className="mt-6 border-primary bg-primary/5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <AlertTitle>Generating Content</AlertTitle>
              <AlertDescription>{generationStep}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <div className="mt-8 flex justify-center">
            <Button 
              size="lg" 
              onClick={generateContent}
              disabled={isGenerating || (!options.generateCategories && !options.generateBlog)}
              className="min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('ai.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('ai.generate')}
                </>
              )}
            </Button>
          </div>

          {/* Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Generation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {options.generateCategories && (
                  <li>• Will generate {quantities.categories} categories in {categoryGroup}</li>
                )}
                {options.generateItems && (
                  <li>• Will generate {quantities.itemsPerCategory} items per category</li>
                )}
                {options.seedRanking && (
                  <li className="text-amber-600">• Will add initial vote distribution (seed data)</li>
                )}
                {options.generateBlog && (
                  <li>• Will generate {quantities.blogArticles} blog articles</li>
                )}
                <li className="text-muted-foreground">• Images will be fetched from Unsplash (royalty-free)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIContentGenerator;
