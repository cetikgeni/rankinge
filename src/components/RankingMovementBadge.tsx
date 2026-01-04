import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/contexts/LanguageContext';

interface RankingMovementBadgeProps {
  movement: 'up' | 'down' | 'stable' | 'new';
  previousRank?: number | null;
}

const RankingMovementBadge = ({ movement, previousRank }: RankingMovementBadgeProps) => {
  const { t } = useTranslation();

  if (movement === 'new') {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
        <Sparkles className="h-3 w-3 mr-1" />
        New
      </Badge>
    );
  }

  if (movement === 'up') {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
        <TrendingUp className="h-3 w-3 mr-1" />
        {t('ranking.movement.up')}
      </Badge>
    );
  }

  if (movement === 'down') {
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs">
        <TrendingDown className="h-3 w-3 mr-1" />
        {t('ranking.movement.down')}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
      <Minus className="h-3 w-3 mr-1" />
      {t('ranking.movement.stable')}
    </Badge>
  );
};

export default RankingMovementBadge;
