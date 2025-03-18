
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { getApprovedCategories } from '@/lib/data';

interface CategoryGroupProps {
  title: string;
  categoryGroup: string;
  showImages?: boolean;
  limit?: number;
}

// The CategoryGroup component shows categories by group name
export const CategoryGroup = ({ title, categoryGroup, showImages = false, limit = 4 }: CategoryGroupProps) => {
  const allCategoryIcons = getAllCategoryIcons();
  const groupData = allCategoryIcons.find(group => group.name === categoryGroup);
  
  if (!groupData) return null;
  
  const categories = getApprovedCategories()
    .filter(cat => {
      // Match category to subcategory names in the group
      return groupData.subcategories.some(sub => 
        cat.name.toLowerCase().includes(sub.name.toLowerCase()) ||
        sub.name.toLowerCase().includes(cat.name.toLowerCase())
      );
    })
    .slice(0, limit);
  
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link 
            to={`/categories?group=${categoryGroup.toLowerCase()}`}
            className="text-brand-purple hover:text-brand-purple/80 flex items-center text-sm font-medium"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/categories/${category.id}`}
              className="block p-4 rounded-lg border border-gray-200 hover:border-brand-purple/30 transition-all hover:shadow-sm"
            >
              {showImages ? (
                <div className="mb-4 h-32 overflow-hidden rounded-md">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-12 items-center">
                  {groupData.subcategories.find(sub => 
                    category.name.toLowerCase().includes(sub.name.toLowerCase()) ||
                    sub.name.toLowerCase().includes(category.name.toLowerCase())
                  )?.icon && (
                    <div className="bg-brand-purple/10 rounded-full w-10 h-10 mr-3 flex items-center justify-center">
                      {React.createElement(
                        groupData.subcategories.find(sub => 
                          category.name.toLowerCase().includes(sub.name.toLowerCase()) ||
                          sub.name.toLowerCase().includes(category.name.toLowerCase())
                        )?.icon || groupData.icon, 
                        { className: "h-5 w-5 text-brand-purple" }
                      )}
                    </div>
                  )}
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                </div>
              )}
              
              <div className="text-sm text-gray-600 line-clamp-2">
                {category.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGroup;
