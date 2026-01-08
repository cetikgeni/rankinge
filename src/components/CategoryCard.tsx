import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/types';
import { ArrowRight, Clock } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = memo(({ category }: CategoryCardProps) => {
  // Sort items by vote count
  const sortedItems = [...category.items].sort((a, b) => b.voteCount - a.voteCount);
  // Get top 3 items
  const topItems = sortedItems.slice(0, 3);
  
  // Badge colors for top 3 items using semantic tokens
  const getTopItemBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
      case 1:
        return "bg-muted text-muted-foreground border-border";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700";
      default:
        return "bg-muted";
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={category.imageUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400'} 
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {!category.isApproved && (
          <div className="absolute top-0 right-0 m-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Pending</span>
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-lg font-bold mb-2 text-foreground">{category.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{category.description}</p>
        
        {category.isApproved && topItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Top Items</p>
            {topItems.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className={`text-foreground truncate mr-2 ${index === 0 ? 'font-medium' : ''}`}>
                  {index + 1}. {item.name}
                </span>
                <Badge variant="outline" className={getTopItemBadgeColor(index)}>
                  {item.voteCount}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Link 
          to={`/categories/${category.slug || category.id}`}
          className="text-primary hover:text-primary/80 flex items-center text-sm font-medium transition-colors"
        >
          View details
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;