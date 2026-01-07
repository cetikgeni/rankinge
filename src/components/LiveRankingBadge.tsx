import { Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/contexts/LanguageContext';

interface LiveRankingBadgeProps {
  isLive: boolean;
  lastUpdated?: string | null;
}

const LiveRankingBadge = ({ isLive, lastUpdated }: LiveRankingBadgeProps) => {
  const { t } = useTranslation();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isLive ? "default" : "secondary"}
        className={isLive ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""}
      >
        <Radio className="h-3 w-3 mr-1" />
        {t('ranking.live')}
      </Badge>
      {lastUpdated && (
        <span className="text-xs text-muted-foreground">
          {t('ranking.lastUpdated')}: {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  );
};

export default LiveRankingBadge;
