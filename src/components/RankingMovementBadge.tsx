import { ArrowUp, ArrowDown, Minus, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface RankingMovementBadgeProps {
  movement: 'up' | 'down' | 'stable' | 'new';
  previousRank?: number | null;
  currentRank?: number;
  size?: 'sm' | 'md' | 'lg';
}

const RankingMovementBadge = ({ 
  movement, 
  previousRank, 
  currentRank,
  size = 'md' 
}: RankingMovementBadgeProps) => {
  const { t } = useTranslation();
  
  const rankChange = previousRank && currentRank 
    ? previousRank - currentRank 
    : previousRank 
    ? previousRank 
    : 0;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  if (movement === 'new') {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          sizeClasses[size]
        )}
      >
        <Sparkles className={cn(iconSize[size], "mr-1")} />
        New
      </Badge>
    );
  }

  if (movement === 'up') {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-bold",
          sizeClasses[size]
        )}
      >
        <ArrowUp className={cn(iconSize[size], "mr-0.5")} />
        {Math.abs(rankChange) > 0 && <span>+{Math.abs(rankChange)}</span>}
      </Badge>
    );
  }

  if (movement === 'down') {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-bold",
          sizeClasses[size]
        )}
      >
        <ArrowDown className={cn(iconSize[size], "mr-0.5")} />
        {Math.abs(rankChange) > 0 && <span>-{Math.abs(rankChange)}</span>}
      </Badge>
    );
  }

  // Stable
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-muted text-muted-foreground",
        sizeClasses[size]
      )}
    >
      <Minus className={iconSize[size]} />
    </Badge>
  );
};

export default RankingMovementBadge;
