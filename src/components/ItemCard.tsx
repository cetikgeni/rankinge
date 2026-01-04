import { Item, Category } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoteButton from './VoteButton';
import ItemIcon from './ItemIcon';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoteDisplayMode } from '@/hooks/useAppSettings';
import { useTranslation } from '@/contexts/LanguageContext';

interface ItemCardProps {
  item: Item & { productUrl?: string; affiliateUrl?: string };
  category: Category;
  rank: number;
  onVote: (itemId: string) => void;
  userVotedItemId: string | undefined;
  totalVotesInCategory: number;
  voteDisplayMode?: VoteDisplayMode;
  isLoggedIn?: boolean;
}

const ItemCard = ({ 
  item, 
  category, 
  rank, 
  onVote, 
  userVotedItemId, 
  totalVotesInCategory,
  voteDisplayMode = 'percentage',
  isLoggedIn = false
}: ItemCardProps) => {
  const isVoted = userVotedItemId === item.id;
  const { t } = useTranslation();
  
  // For demo purposes, generate a product URL if none exists
  const productUrl = item.productUrl || `https://example.com/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Calculate percentage
  const percentage = totalVotesInCategory > 0 ? Math.round((item.voteCount / totalVotesInCategory) * 100) : 0;
  
  // Determine vote display based on settings
  const getVoteDisplay = () => {
    switch (voteDisplayMode) {
      case 'count':
        return `${item.voteCount} ${t('vote.votes')}`;
      case 'both':
        return `${percentage}% (${item.voteCount} ${t('vote.votes')})`;
      case 'percentage':
      default:
        return `${percentage}%`;
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all ${isVoted ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="flex md:flex-row flex-col">
        <div className="relative md:w-1/3 h-48 md:h-auto">
          <img 
            src={item.imageUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400'} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge 
              variant="secondary" 
              className={`text-xs font-semibold ${
                rank === 1 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' 
                  : rank === 2 
                  ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
                  : rank === 3 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' 
                  : 'bg-background text-foreground'
              }`}
            >
              #{rank}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                <ItemIcon itemName={item.name} targetUrl={productUrl} />
              </div>
              <Badge variant="outline" className="ml-2 bg-muted">
                {getVoteDisplay()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {productUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8 text-primary border-primary/20 hover:bg-primary/5"
                  onClick={() => window.open(productUrl, '_blank', 'noopener,noreferrer')}
                >
                  {t('action.visitWebsite')}
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              )}
              
              {item.affiliateUrl && (
                <Button 
                  size="sm" 
                  className="text-xs h-8 bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(item.affiliateUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ShoppingCart className="mr-1.5 h-3 w-3" />
                  {t('action.buy')}
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <VoteButton 
              isVoted={isVoted}
              isLoggedIn={isLoggedIn}
              onVote={() => onVote(item.id)}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ItemCard;
