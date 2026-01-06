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

// Extended image collections with many more categories and working Unsplash/Pexels URLs
const SAMPLE_COLLECTIONS: Record<string, string[]> = {
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&h=600&fit=crop',
  ],
  food: [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1482049016gy9w-d10747dfc776?w=800&h=600&fit=crop',
  ],
  nature: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  ],
  business: [
    'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop',
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
  ],
  travel: [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
  ],
  health: [
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&h=600&fit=crop',
  ],
  home: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop',
  ],
  education: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
  ],
  automotive: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
  ],
  gaming: [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b-9c5a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583241475880-083f84372725?w=800&h=600&fit=crop',
  ],
  music: [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop',
  ],
  pets: [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop',
  ],
  art: [
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579783900882-c0d0ce9e89db?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
  ],
};

// Keyword aliases to map common search terms to collections
const KEYWORD_ALIASES: Record<string, string> = {
  // Technology aliases
  'tech': 'technology',
  'computer': 'technology',
  'laptop': 'technology',
  'smartphone': 'technology',
  'phone': 'technology',
  'gadget': 'technology',
  'software': 'technology',
  'hardware': 'technology',
  'coding': 'technology',
  'programming': 'technology',
  
  // Food aliases
  'restaurant': 'food',
  'cooking': 'food',
  'meal': 'food',
  'cuisine': 'food',
  'recipe': 'food',
  'drink': 'food',
  'coffee': 'food',
  'beverages': 'food',
  
  // Nature aliases
  'landscape': 'nature',
  'forest': 'nature',
  'mountain': 'nature',
  'ocean': 'nature',
  'beach': 'nature',
  'sky': 'nature',
  'sunset': 'nature',
  'flower': 'nature',
  
  // Business aliases
  'office': 'business',
  'corporate': 'business',
  'work': 'business',
  'meeting': 'business',
  'finance': 'business',
  'marketing': 'business',
  
  // Fashion aliases
  'clothing': 'fashion',
  'style': 'fashion',
  'dress': 'fashion',
  'shoes': 'fashion',
  'accessories': 'fashion',
  
  // Entertainment aliases
  'movie': 'entertainment',
  'film': 'entertainment',
  'cinema': 'entertainment',
  'show': 'entertainment',
  'concert': 'entertainment',
  'party': 'entertainment',
  
  // Sports aliases
  'fitness': 'sports',
  'gym': 'sports',
  'exercise': 'sports',
  'workout': 'sports',
  'football': 'sports',
  'basketball': 'sports',
  'soccer': 'sports',
  
  // Travel aliases
  'vacation': 'travel',
  'holiday': 'travel',
  'trip': 'travel',
  'tourism': 'travel',
  'destination': 'travel',
  'adventure': 'travel',
  
  // Health aliases
  'wellness': 'health',
  'medical': 'health',
  'yoga': 'health',
  'meditation': 'health',
  'nutrition': 'health',
  
  // Home aliases
  'interior': 'home',
  'furniture': 'home',
  'decor': 'home',
  'kitchen': 'home',
  'living': 'home',
  'bedroom': 'home',
  
  // Education aliases
  'school': 'education',
  'university': 'education',
  'learning': 'education',
  'study': 'education',
  'book': 'education',
  'library': 'education',
  
  // Automotive aliases
  'car': 'automotive',
  'vehicle': 'automotive',
  'motorcycle': 'automotive',
  'auto': 'automotive',
  'driving': 'automotive',
  
  // Gaming aliases
  'game': 'gaming',
  'video game': 'gaming',
  'esports': 'gaming',
  'console': 'gaming',
  'playstation': 'gaming',
  'xbox': 'gaming',
  
  // Beauty aliases
  'makeup': 'beauty',
  'cosmetics': 'beauty',
  'skincare': 'beauty',
  'salon': 'beauty',
  'spa': 'beauty',
  
  // Music aliases
  'instrument': 'music',
  'guitar': 'music',
  'piano': 'music',
  'band': 'music',
  'singer': 'music',
  
  // Pets aliases
  'dog': 'pets',
  'cat': 'pets',
  'animal': 'pets',
  'puppy': 'pets',
  'kitten': 'pets',
  
  // Art aliases
  'painting': 'art',
  'drawing': 'art',
  'sculpture': 'art',
  'gallery': 'art',
  'museum': 'art',
  'creative': 'art',
};

const COLLECTION_BUTTONS = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'health', name: 'Health', icon: '💪' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'pets', name: 'Pets', icon: '🐕' },
  { id: 'art', name: 'Art', icon: '🎨' },
];

export function FreeImageSearch({ onImageSelected }: FreeImageSearchProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const findMatchingCollection = (query: string): string | null => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Direct collection match
    if (SAMPLE_COLLECTIONS[lowerQuery]) {
      return lowerQuery;
    }
    
    // Check aliases
    if (KEYWORD_ALIASES[lowerQuery]) {
      return KEYWORD_ALIASES[lowerQuery];
    }
    
    // Partial match in collection names
    for (const key of Object.keys(SAMPLE_COLLECTIONS)) {
      if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
        return key;
      }
    }
    
    // Partial match in aliases
    for (const [alias, collection] of Object.entries(KEYWORD_ALIASES)) {
      if (alias.includes(lowerQuery) || lowerQuery.includes(alias)) {
        return collection;
      }
    }
    
    return null;
  };

  const searchImages = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const matchedCollection = findMatchingCollection(searchQuery);
    
    if (matchedCollection) {
      setImages(SAMPLE_COLLECTIONS[matchedCollection] || []);
      setSelectedCollection(matchedCollection);
    } else {
      // If no match, combine images from multiple related collections
      const allImages: string[] = [];
      Object.values(SAMPLE_COLLECTIONS).forEach(imgs => {
        allImages.push(...imgs.slice(0, 2)); // Take 2 from each
      });
      // Shuffle and take first 12
      const shuffled = allImages.sort(() => 0.5 - Math.random());
      setImages(shuffled.slice(0, 12));
      setSelectedCollection(null);
    }
    
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
    setSearchQuery(collectionId);
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
      <DialogContent className="sm:max-w-3xl max-h-[85vh]">
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
              className="flex-1"
            />
            <Button onClick={searchImages} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="w-full">
            <div className="flex flex-wrap gap-2 pb-2">
              {COLLECTION_BUTTONS.map(collection => (
                <Button
                  key={collection.id}
                  variant={selectedCollection === collection.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectCollection(collection.id)}
                  className="text-xs"
                >
                  <span className="mr-1">{collection.icon}</span>
                  {collection.name}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <ScrollArea className="h-[350px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
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
                <p className="text-xs mt-2">Try: technology, food, nature, sports, travel...</p>
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
