
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdFooter = () => {
  const ads = [
    {
      title: "Premium Membership",
      description: "Unlock exclusive features with Rankinge Premium",
      url: "https://example.com/premium",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop"
    },
    {
      title: "Download Our App",
      description: "Get the Rankinge experience on mobile",
      url: "https://example.com/app",
      image: "https://images.unsplash.com/photo-1601637875137-742788aec7bf?w=600&auto=format&fit=crop"
    },
    {
      title: "Partner with Us",
      description: "Advertise your products on Rankinge",
      url: "https://example.com/partner",
      image: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Sponsored</h3>
        <Button variant="link" size="sm" className="text-xs">
          <a href="https://example.com/ads" target="_blank" rel="noopener noreferrer">
            Advertise with us
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ads.map((ad, index) => (
          <a 
            key={index} 
            href={ad.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="h-24 overflow-hidden bg-gray-100">
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm group-hover:text-brand-purple transition-colors">{ad.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{ad.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
      <div className="mt-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Rankinge. All rights reserved.
      </div>
    </div>
  );
};

export default AdFooter;
