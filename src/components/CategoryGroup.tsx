
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { getApprovedCategories } from '@/lib/data';
import CategoryCard from '@/components/CategoryCard';

interface CategoryGroupProps {
  title: string;
  categoryGroup: string;
  showImages?: boolean;
  limit?: number;
}

// The CategoryGroup component shows categories by group name
const CategoryGroup = ({
  title,
  categoryGroup,
  showImages = false,
  limit = 4
}: CategoryGroupProps) => {
  const allCategoryIcons = getAllCategoryIcons();
  const groupData = allCategoryIcons.find(group => group.name === categoryGroup);
  
  if (!groupData) return null;
  
  const categories = getApprovedCategories().filter(cat => {
    // Match category to subcategory names in the group
    return groupData.subcategories.some(sub => 
      cat.name.toLowerCase().includes(sub.name.toLowerCase()) || 
      sub.name.toLowerCase().includes(cat.name.toLowerCase())
    );
  }).slice(0, limit);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link 
            to={`/categories?group=${categoryGroup.toLowerCase()}`} 
            className="text-brand-green hover:text-brand-green/80 flex items-center text-sm font-medium"
          >
            View all in {categoryGroup}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              showImage={showImages} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGroup;
