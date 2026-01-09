import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface ExpandableDescriptionProps {
  text: string;
  maxLines?: number;
  className?: string;
}

const ExpandableDescription = ({ text, maxLines = 2, className = '' }: ExpandableDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  
  // Rough estimate: if text is longer than ~100 chars per line * maxLines, it's likely to overflow
  const isLongText = text.length > maxLines * 80;

  if (!text) return null;

  if (!isLongText) {
    return (
      <p className={`text-sm text-muted-foreground ${className}`}>
        {text}
      </p>
    );
  }

  return (
    <div className={className}>
      <p className={`text-sm text-muted-foreground ${!isExpanded ? `line-clamp-${maxLines}` : ''}`}>
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
      >
        {isExpanded ? (
          <>
            {t('action.showLess')}
            <ChevronUp className="h-3 w-3" />
          </>
        ) : (
          <>
            {t('action.showMore')}
            <ChevronDown className="h-3 w-3" />
          </>
        )}
      </button>
    </div>
  );
};

export default ExpandableDescription;
