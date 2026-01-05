import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/CategoryCard';

interface CategoryGroupProps {
  title: string;
  categoryGroup: string;
  showImages?: boolean;
  limit?: number;
}

const CategoryGroup = ({
  title,
  categoryGroup,
  showImages = false,
  limit = 4
}: CategoryGroupProps) => {
  const { categories, isLoading } = useCategories(true);
  
  // Filter categories by group
  const groupCategories = categories
    .filter(cat => cat.category_group === categoryGroup)
    .slice(0, limit);
  
  // Don't render if no categories in this group
  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }
  
  if (groupCategories.length === 0) {
    return null;
  }
  
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <Link 
            to={`/categories?group=${encodeURIComponent(categoryGroup)}`} 
            className="text-primary hover:text-primary/80 flex items-center text-sm font-medium"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groupCategories.map(category => (
            <CategoryCard 
              key={category.id} 
              category={{
                id: category.id,
                name: category.name,
                description: category.description || '',
                imageUrl: showImages ? (category.image_url || '') : '',
                items: category.items.map(item => ({
                  id: item.id,
                  name: item.name,
                  description: item.description || '',
                  imageUrl: item.image_url || '',
                  voteCount: item.vote_count
                })),
                isApproved: category.is_approved,
                createdBy: '',
                settings: { displayVoteAs: 'count' }
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGroup;
