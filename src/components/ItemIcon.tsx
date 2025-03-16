
import { 
  ShoppingCart, Coffee, Utensils, Beer, Pizza, Tv, Music, 
  Smartphone, Laptop, Monitor, Car, Plane, Gamepad, Ball, 
  BarChart, FileImage, Globe, ExternalLink, Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemIconProps {
  itemName: string;
  targetUrl?: string;
}

const ItemIcon = ({ itemName, targetUrl }: ItemIconProps) => {
  const name = itemName.toLowerCase();
  let Icon = ShoppingCart;
  
  // Determine icon based on item name
  if (name.includes('coffee') || name.includes('latte') || name.includes('espresso')) {
    Icon = Coffee;
  } else if (name.includes('food') || name.includes('meal') || name.includes('dish')) {
    Icon = Utensils;
  } else if (name.includes('beer') || name.includes('wine') || name.includes('drink')) {
    Icon = Beer;
  } else if (name.includes('pizza') || name.includes('burger')) {
    Icon = Pizza;
  } else if (name.includes('tv') || name.includes('show') || name.includes('series')) {
    Icon = Tv;
  } else if (name.includes('music') || name.includes('song') || name.includes('band')) {
    Icon = Music;
  } else if (name.includes('phone') || name.includes('mobile')) {
    Icon = Smartphone;
  } else if (name.includes('laptop') || name.includes('computer')) {
    Icon = Laptop;
  } else if (name.includes('monitor') || name.includes('display')) {
    Icon = Monitor;
  } else if (name.includes('car') || name.includes('vehicle') || name.includes('auto')) {
    Icon = Car;
  } else if (name.includes('airline') || name.includes('flight') || name.includes('plane')) {
    Icon = Plane;
  } else if (name.includes('game') || name.includes('gaming')) {
    Icon = Gamepad;
  } else if (name.includes('sport') || name.includes('ball')) {
    Icon = Ball;
  } else if (name.includes('chart') || name.includes('graph') || name.includes('stat')) {
    Icon = BarChart;
  } else if (name.includes('image') || name.includes('picture') || name.includes('photo')) {
    Icon = FileImage;
  } else if (name.includes('website') || name.includes('web') || name.includes('site')) {
    Icon = Globe;
  }
  
  if (targetUrl) {
    return (
      <Button 
        asChild 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full"
      >
        <a 
          href={targetUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          title={`Visit ${itemName}`}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4" />
        </a>
      </Button>
    );
  }
  
  return <Icon className="h-4 w-4 text-gray-500" />;
};

export default ItemIcon;
