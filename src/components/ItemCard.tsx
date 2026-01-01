
import { Item, Category } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoteButton from './VoteButton';
import { currentUser } from '@/lib/data';
import ItemIcon from './ItemIcon';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemCardProps {
  item: Item & { productUrl?: string; affiliateUrl?: string };
  category: Category;
  rank: number;
  onVote: (itemId: string) => void;
  userVotedItemId: string | undefined;
  totalVotesInCategory: number;
}

const ItemCard = ({ item, category, rank, onVote, userVotedItemId, totalVotesInCategory }: ItemCardProps) => {
  const isVoted = userVotedItemId === item.id;
  
  // For demo purposes, generate a product URL if none exists
  const productUrl = item.productUrl || `https://example.com/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Dynamic vote display logic
  // If total votes < 30: show percentage only + "Early Ranking" label
  // If total votes >= 30: show both percentage and vote count
  const isEarlyRanking = totalVotesInCategory < 30;
  const percentage = totalVotesInCategory > 0 ? Math.round((item.voteCount / totalVotesInCategory) * 100) : 0;
  
  const voteDisplay = isEarlyRanking 
    ? `${percentage}%`
    : `${percentage}% (${item.voteCount} votes)`;
  
  return (
    <Card className={`overflow-hidden transition-all ${isVoted ? 'ring-2 ring-brand-purple/20' : ''}`}>
      <div className="flex md:flex-row flex-col">
        <div className="relative md:w-1/3 h-48 md:h-auto">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge 
              variant="secondary" 
              className={`text-xs font-semibold ${
                rank === 1 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : rank === 2 
                  ? 'bg-gray-200 text-gray-800' 
                  : rank === 3 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-white text-gray-800'
              }`}
            >
              #{rank}
            </Badge>
            {isEarlyRanking && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                Peringkat Awal
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <ItemIcon itemName={item.name} targetUrl={productUrl} />
              </div>
              <Badge variant="outline" className="ml-2 bg-gray-50">
                {voteDisplay}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {productUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8 text-brand-purple border-brand-purple/20 hover:bg-brand-purple/5"
                  onClick={() => window.open(productUrl, '_blank', 'noopener,noreferrer')}
                >
                  Visit Website
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              )}
              
              {item.affiliateUrl && (
                <Button 
                  size="sm" 
                  className="text-xs h-8 bg-brand-green hover:bg-brand-green/90"
                  onClick={() => window.open(item.affiliateUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ShoppingCart className="mr-1.5 h-3 w-3" />
                  Beli / Buy
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <VoteButton 
              isVoted={isVoted}
              isLoggedIn={!!currentUser}
              onVote={() => onVote(item.id)}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ItemCard;
