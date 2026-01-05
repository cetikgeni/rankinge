import { useState } from 'react';
import { Search, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/contexts/LanguageContext';

interface FreeImageSearchProps {
  onImageSelected: (imageUrl: string) => void;
}

// Predefined image collections with actual working Unsplash images
const SAMPLE_COLLECTIONS: Record<string, string[]> = {
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop',
  ],
  food: [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  ],
  nature: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
  ],
  business: [
    'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=600&fit=crop',
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
  ],
};

const COLLECTION_BUTTONS = [
  { id: 'technology', name: 'Technology' },
  { id: 'food', name: 'Food' },
  { id: 'nature', name: 'Nature' },
  { id: 'business', name: 'Business' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'entertainment', name: 'Entertainment' },
];

export function FreeImageSearch({ onImageSelected }: FreeImageSearchProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const searchImages = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Find matching collection based on search query
    const query = searchQuery.toLowerCase();
    let matchedImages: string[] = [];
    
    // Check if query matches any collection
    for (const [key, urls] of Object.entries(SAMPLE_COLLECTIONS)) {
      if (key.includes(query) || query.includes(key)) {
        matchedImages = [...urls];
        break;
      }
    }
    
    // If no match, use technology as default
    if (matchedImages.length === 0) {
      matchedImages = [...SAMPLE_COLLECTIONS.technology];
    }
    
    setImages(matchedImages);
    setSelectedCollection(null);
    setIsLoading(false);
  };

  const handleSelect = (imageUrl: string) => {
    onImageSelected(imageUrl);
    setIsOpen(false);
    setSearchQuery('');
    setImages([]);
    setSelectedCollection(null);
  };

  const selectCollection = (collectionId: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedCollection(collectionId);
    
    const collectionImages = SAMPLE_COLLECTIONS[collectionId] || [];
    setImages(collectionImages);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          {t('imageSearch.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t('imageSearch.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('imageSearch.placeholder')}
              onKeyDown={(e) => e.key === 'Enter' && searchImages()}
            />
            <Button onClick={searchImages} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {COLLECTION_BUTTONS.map(collection => (
              <Button
                key={collection.id}
                variant={selectedCollection === collection.id ? "default" : "outline"}
                size="sm"
                onClick={() => selectCollection(collection.id)}
              >
                {collection.name}
              </Button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => handleSelect(url)}
                  >
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                <p>{t('imageSearch.empty')}</p>
              </div>
            )}
          </ScrollArea>

          <p className="text-xs text-muted-foreground text-center">
            {t('imageSearch.attribution')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
