
import { Item } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoteButton from './VoteButton';
import { currentUser } from '@/lib/data';

interface ItemCardProps {
  item: Item;
  categoryId: string;
  rank: number;
  onVote: (itemId: string) => void;
  userVotedItemId: string | undefined;
}

const ItemCard = ({ item, categoryId, rank, onVote, userVotedItemId }: ItemCardProps) => {
  const isVoted = userVotedItemId === item.id;
  
  return (
    <Card className={`overflow-hidden transition-all ${isVoted ? 'ring-2 ring-brand-purple/20' : ''}`}>
      <div className="flex md:flex-row flex-col">
        <div className="relative md:w-1/3 h-48 md:h-auto">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
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
          </div>
        </div>
        
        <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
              <Badge variant="outline" className="ml-2 bg-gray-50">
                {item.voteCount} votes
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
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
