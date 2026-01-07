import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CategoryItem {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  vote_count: number;
  product_url: string | null;
  affiliate_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  category_group: string | null;
  is_approved: boolean;
  parent_id: string | null;
  vote_display_mode: string | null;
  created_at: string;
  items: CategoryItem[];
  children?: Category[];
}

export function useCategories(approvedOnly = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    
    let query = supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (approvedOnly) {
      query = query.eq('is_approved', true);
    }
    
    const { data: categoriesData, error: categoriesError } = await query;
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      toast.error('Failed to load categories');
      setIsLoading(false);
      return;
    }

    // Fetch items for all categories
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .order('vote_count', { ascending: false });

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    }

    // Map items to categories
    const categoriesWithItems: Category[] = (categoriesData || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.image_url,
      category_group: cat.category_group,
      is_approved: cat.is_approved ?? false,
      parent_id: cat.parent_id,
      vote_display_mode: cat.vote_display_mode,
      created_at: cat.created_at,
      items: (itemsData || []).filter(item => item.category_id === cat.id).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image_url: item.image_url,
        vote_count: item.vote_count ?? 0,
        product_url: item.product_url,
        affiliate_url: item.affiliate_url
      })),
      children: []
    }));

    // Build hierarchy
    categoriesWithItems.forEach(parent => {
      parent.children = categoriesWithItems.filter(child => child.parent_id === parent.id);
    });

    setCategories(categoriesWithItems);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [approvedOnly]);

  return { categories, isLoading, refetch: fetchCategories };
}

export function useCategoryById(idOrSlug: string | undefined) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategory = async () => {
    if (!idOrSlug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Try to find by slug first, then by id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    let categoryData = null;
    let categoryError = null;
    
    if (isUUID) {
      const result = await supabase
        .from('categories')
        .select('*')
        .eq('id', idOrSlug)
        .maybeSingle();
      categoryData = result.data;
      categoryError = result.error;
    } else {
      // Try slug first
      const result = await supabase
        .from('categories')
        .select('*')
        .eq('slug', idOrSlug)
        .maybeSingle();
      categoryData = result.data;
      categoryError = result.error;
    }
    
    if (categoryError || !categoryData) {
      console.error('Error fetching category:', categoryError);
      setCategory(null);
      setIsLoading(false);
      return;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('category_id', categoryData.id)
      .order('vote_count', { ascending: false });

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    }

    setCategory({
      ...categoryData,
      items: itemsData || []
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategory();
  }, [idOrSlug]);

  return { category, isLoading, refetch: fetchCategory };
}
