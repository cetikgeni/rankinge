import { useState } from 'react';
import { Search, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FreeImageSearchProps {
  onImageSelected: (imageUrl: string) => void;
}

// Using Unsplash Source for free images (no API key needed for basic usage)
const UNSPLASH_COLLECTIONS = [
  { id: 'technology', name: 'Technology' },
  { id: 'food', name: 'Food' },
  { id: 'nature', name: 'Nature' },
  { id: 'business', name: 'Business' },
  { id: 'people', name: 'People' },
];

export function FreeImageSearch({ onImageSelected }: FreeImageSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchImages = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Generate multiple Unsplash source URLs based on search query
    const imageUrls: string[] = [];
    for (let i = 0; i < 12; i++) {
      // Unsplash Source API provides random images based on query
      const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(searchQuery)}&sig=${i}`;
      imageUrls.push(url);
    }
    
    setImages(imageUrls);
    setIsLoading(false);
  };

  const handleSelect = (imageUrl: string) => {
    onImageSelected(imageUrl);
    setIsOpen(false);
    setSearchQuery('');
    setImages([]);
  };

  const searchByCollection = (collection: string) => {
    setSearchQuery(collection);
    setIsLoading(true);
    
    const imageUrls: string[] = [];
    for (let i = 0; i < 12; i++) {
      const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(collection)}&sig=${Date.now() + i}`;
      imageUrls.push(url);
    }
    
    setImages(imageUrls);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          Cari Gambar Gratis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Cari Gambar Gratis / Free Image Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gambar... (e.g., smartphone, coffee)"
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
            {UNSPLASH_COLLECTIONS.map(collection => (
              <Button
                key={collection.id}
                variant="outline"
                size="sm"
                onClick={() => searchByCollection(collection.id)}
              >
                {collection.name}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[400px]">
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => handleSelect(url)}
                  >
                    <img
                      src={url}
                      alt={`Search result ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                <p>Cari gambar untuk memulai / Search for images to start</p>
              </div>
            )}
          </ScrollArea>

          <p className="text-xs text-muted-foreground text-center">
            Gambar dari Unsplash - Gratis untuk penggunaan komersial
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
