
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/types';
import { ArrowRight, Clock } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Sort items by vote count
  const sortedItems = [...category.items].sort((a, b) => b.voteCount - a.voteCount);
  // Get top 3 items
  const topItems = sortedItems.slice(0, 3);
  
  // Badge colors for top 3 items
  const getTopItemBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-100 text-amber-800 border-amber-200"; // Gold for 1st
      case 1:
        return "bg-gray-100 text-gray-800 border-gray-200"; // Silver for 2nd
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200"; // Bronze for 3rd
      default:
        return "bg-gray-50"; // Default for the rest
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover"
        />
        {!category.isApproved && (
          <div className="absolute top-0 right-0 m-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Pending</span>
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-lg font-bold mb-2 text-gray-900">{category.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
        
        {category.isApproved && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Top Items</p>
            {topItems.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className={`text-gray-800 ${index === 0 ? 'font-medium' : ''}`}>
                  {index + 1}. {item.name}
                </span>
                <Badge variant="outline" className={getTopItemBadgeColor(index)}>
                  {item.voteCount} votes
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Link 
          to={`/categories/${category.id}`}
          className="text-brand-purple hover:text-brand-purple/80 flex items-center text-sm font-medium transition-colors"
        >
          View details
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
