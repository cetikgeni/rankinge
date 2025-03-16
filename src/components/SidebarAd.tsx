
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SidebarAdProps {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
}

const SidebarAd = ({ title, description, imageUrl, targetUrl }: SidebarAdProps) => {
  return (
    <Card className="overflow-hidden border-2 border-gray-200 hover:border-brand-purple/30 transition-all">
      <a 
        href={targetUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group"
      >
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform" 
          />
          <Badge variant="outline" className="absolute top-2 right-2 bg-white text-xs">
            Sponsored
          </Badge>
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-sm group-hover:text-brand-purple transition-colors">{title}</h4>
            <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-brand-purple transition-colors" />
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </CardContent>
      </a>
    </Card>
  );
};

export default SidebarAd;
