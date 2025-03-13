
import { Link } from 'react-router-dom';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdProps {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  category: string;
  isSponsored?: boolean;
}

export const AdCard = ({ title, description, imageUrl, targetUrl, category, isSponsored = true }: AdProps) => {
  return (
    <Card className="overflow-hidden h-full border-2 border-gray-200 hover:border-brand-purple/30 transition-all">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover" 
        />
        {isSponsored && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-white">
            Sponsored
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full mt-2">
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Product
            <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const SponsoredSection = () => {
  // Example sponsored content - in a real application, these would come from your backend
  const sponsoredItems: AdProps[] = [
    {
      title: "Ultra Boost Sneakers",
      description: "Premium athletic footwear with responsive cushioning for ultimate comfort and performance.",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2940&auto=format&fit=crop",
      targetUrl: "https://example.com/product1",
      category: "Sneakers"
    },
    {
      title: "Organic Coffee Blend",
      description: "Single-origin, fair trade coffee with rich flavor notes and smooth finish.",
      imageUrl: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=2938&auto=format&fit=crop", 
      targetUrl: "https://example.com/product2",
      category: "Coffee Brands"
    },
    {
      title: "Flagship Smartphone",
      description: "Next-generation smartphone with advanced camera system and all-day battery life.",
      imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2940&auto=format&fit=crop",
      targetUrl: "https://example.com/product3",
      category: "Smartphones"
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link 
            to="/advertise" 
            className="text-brand-purple hover:text-brand-purple/80 flex items-center text-sm font-medium"
          >
            Advertise with us
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sponsoredItems.map((item, index) => (
            <AdCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsoredSection;
