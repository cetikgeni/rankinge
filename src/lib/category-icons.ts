import {
  ShoppingBag, Coffee, Utensils, LucideIcon, Shirt, Car, Laptop, Plane,
  Smartphone, Headphones, Book, Camera, Monitor, Dumbbell, Watch, Gamepad,
  Home, Brush, Baby, Gift, Wine, Mic, Music, 
  Briefcase, School, Building, Leaf, Beaker, Heart, Pill, Dog, Flower, Cloud,
  Sun, Umbrella, Trees, Fish, Bike, BarChart3, Trophy, Palette, PenTool,
  Tv, Dice1, TrendingUp, Zap, Scissors
} from 'lucide-react';

export interface SubCategory {
  name: string;
  icon: LucideIcon;
}

export interface CategoryGroup {
  name: string;
  icon: LucideIcon;
  subcategories: SubCategory[];
}

export const getAllCategoryIcons = (): CategoryGroup[] => {
  return [
    {
      name: 'Food & Beverages',
      icon: Utensils,
      subcategories: [
        { name: 'Soft Drinks', icon: Coffee },
        { name: 'Coffee Brands', icon: Coffee },
        { name: 'Fast Food Chains', icon: Utensils },
        { name: 'Pizza Brands', icon: Utensils },
        { name: 'Ice Cream Brands', icon: Utensils },
        { name: 'Chocolate Brands', icon: Utensils },
        { name: 'Cereal Brands', icon: Utensils },
        { name: 'Snack Foods', icon: Utensils },
        { name: 'Energy Drinks', icon: Coffee },
        { name: 'Beer Brands', icon: Wine },
        { name: 'Breakfast Foods', icon: Utensils },
        { name: 'Juice Brands', icon: Utensils }
      ]
    },
    {
      name: 'Fashion & Apparel',
      icon: Shirt,
      subcategories: [
        { name: 'Sneakers', icon: ShoppingBag },
        { name: 'Luxury Brands', icon: ShoppingBag },
        { name: 'Jeans Brands', icon: Shirt },
        { name: 'Sports Apparel', icon: Shirt },
        { name: 'Watch Brands', icon: Watch },
        { name: 'Designer Bags', icon: ShoppingBag },
        { name: 'Jewelry Brands', icon: ShoppingBag },
        { name: 'Sunglasses', icon: ShoppingBag },
        { name: 'Activewear', icon: Shirt },
        { name: 'Formal Wear', icon: Shirt },
        { name: 'Footwear', icon: ShoppingBag },
        { name: 'Accessories', icon: ShoppingBag }
      ]
    },
    {
      name: 'Technology',
      icon: Laptop,
      subcategories: [
        { name: 'Smartphones', icon: Smartphone },
        { name: 'Laptops', icon: Laptop },
        { name: 'Headphones', icon: Headphones },
        { name: 'Gaming Consoles', icon: Gamepad },
        { name: 'Smartwatches', icon: Watch },
        { name: 'Tablets', icon: Laptop },
        { name: 'Cameras', icon: Camera },
        { name: 'TVs', icon: Tv },
        { name: 'Streaming Services', icon: Monitor },
        { name: 'Computer Brands', icon: Laptop },
        { name: 'Audio Equipment', icon: Headphones },
        { name: 'Smart Home Devices', icon: Home }
      ]
    },
    {
      name: 'Automotive',
      icon: Car,
      subcategories: [
        { name: 'Car Brands', icon: Car },
        { name: 'Motorcycles', icon: Bike },
        { name: 'SUVs', icon: Car },
        { name: 'Electric Cars', icon: Car },
        { name: 'Luxury Cars', icon: Car },
        { name: 'Sports Cars', icon: Car },
        { name: 'Car Accessories', icon: Car },
        { name: 'Tires', icon: Car },
        { name: 'Auto Insurance', icon: Car },
        { name: 'Car Rental Services', icon: Car },
        { name: 'Auto Parts', icon: Car },
        { name: 'Car Wash Services', icon: Car }
      ]
    },
    {
      name: 'Travel & Leisure',
      icon: Plane,
      subcategories: [
        { name: 'Airlines', icon: Plane },
        { name: 'Hotels', icon: Building },
        { name: 'Travel Destinations', icon: Plane },
        { name: 'Theme Parks', icon: Plane },
        { name: 'Cruise Lines', icon: Plane },
        { name: 'Travel Agencies', icon: Plane },
        { name: 'Luggage Brands', icon: Plane },
        { name: 'Vacation Rentals', icon: Building },
        { name: 'Travel Gadgets', icon: Plane },
        { name: 'Travel Credit Cards', icon: Plane },
        { name: 'Tour Operators', icon: Plane },
        { name: 'Travel Insurance', icon: Plane }
      ]
    },
    {
      name: 'Home & Living',
      icon: Home,
      subcategories: [
        { name: 'Furniture Brands', icon: Home },
        { name: 'Appliance Brands', icon: Home },
        { name: 'Home Decor', icon: Home },
        { name: 'Bedding Brands', icon: Home },
        { name: 'Kitchen Gadgets', icon: Utensils },
        { name: 'Cleaning Products', icon: Home },
        { name: 'Lighting Fixtures', icon: Home },
        { name: 'Smart Home Systems', icon: Home },
        { name: 'Garden Supplies', icon: Flower },
        { name: 'Tools & Hardware', icon: Home },
        { name: 'Home Security', icon: Home },
        { name: 'Storage Solutions', icon: Home }
      ]
    },
    {
      name: 'Health & Beauty',
      icon: Heart,
      subcategories: [
        { name: 'Skincare Brands', icon: Heart },
        { name: 'Makeup Brands', icon: Brush },
        { name: 'Fragrances', icon: Heart },
        { name: 'Hair Care', icon: Scissors },
        { name: 'Supplements', icon: Pill },
        { name: 'Fitness Equipment', icon: Dumbbell },
        { name: 'Wellness Apps', icon: Smartphone },
        { name: 'Gyms & Fitness Centers', icon: Dumbbell },
        { name: 'Dental Care', icon: Heart },
        { name: 'Natural Remedies', icon: Leaf },
        { name: 'Health Trackers', icon: Watch },
        { name: 'Organic Beauty', icon: Heart }
      ]
    },
    {
      name: 'Entertainment',
      icon: Music,
      subcategories: [
        { name: 'Streaming Platforms', icon: Tv },
        { name: 'Video Games', icon: Gamepad },
        { name: 'Music Services', icon: Music },
        { name: 'Movie Studios', icon: Tv },
        { name: 'Gaming Studios', icon: Gamepad },
        { name: 'Board Games', icon: Dice1 },
        { name: 'Book Publishers', icon: Book },
        { name: 'Music Labels', icon: Music },
        { name: 'Concert Venues', icon: Mic },
        { name: 'VR Experiences', icon: Tv },
        { name: 'Comics & Graphic Novels', icon: Book },
        { name: 'Podcast Platforms', icon: Mic }
      ]
    },
    {
      name: 'Business & Finance',
      icon: Briefcase,
      subcategories: [
        { name: 'Banks', icon: Briefcase },
        { name: 'Credit Cards', icon: Briefcase },
        { name: 'Investment Apps', icon: TrendingUp },
        { name: 'Insurance Companies', icon: Briefcase },
        { name: 'Financial Advisors', icon: Briefcase },
        { name: 'Tax Software', icon: Briefcase },
        { name: 'Accounting Software', icon: Briefcase },
        { name: 'Business Consultants', icon: Briefcase },
        { name: 'Payment Processors', icon: Briefcase },
        { name: 'Mortgage Lenders', icon: Home },
        { name: 'Stock Trading Platforms', icon: TrendingUp },
        { name: 'Cryptocurrencies', icon: Zap }
      ]
    },
    {
      name: 'Education',
      icon: School,
      subcategories: [
        { name: 'Online Courses', icon: School },
        { name: 'Language Learning Apps', icon: School },
        { name: 'Educational Toys', icon: School },
        { name: 'Tutoring Services', icon: School },
        { name: 'Study Materials', icon: Book },
        { name: 'Universities', icon: School },
        { name: 'Coding Bootcamps', icon: Laptop },
        { name: 'Teaching Resources', icon: School },
        { name: 'Educational Games', icon: Gamepad },
        { name: 'Professional Certifications', icon: School },
        { name: 'School Supplies', icon: PenTool },
        { name: 'Online Libraries', icon: Book }
      ]
    },
    {
      name: 'Pets & Animals',
      icon: Dog,
      subcategories: [
        { name: 'Pet Food Brands', icon: Dog },
        { name: 'Pet Supplies', icon: Dog },
        { name: 'Veterinary Services', icon: Dog },
        { name: 'Pet Insurance', icon: Dog },
        { name: 'Pet Toys', icon: Dog },
        { name: 'Pet Grooming', icon: Dog },
        { name: 'Pet Accessories', icon: Dog },
        { name: 'Animal Shelters', icon: Dog },
        { name: 'Pet Training', icon: Dog },
        { name: 'Aquarium Supplies', icon: Fish },
        { name: 'Bird Supplies', icon: Dog },
        { name: 'Pet Tech Gadgets', icon: Dog }
      ]
    },
    {
      name: 'Hobbies & Crafts',
      icon: Palette,
      subcategories: [
        { name: 'Art Supplies', icon: Palette },
        { name: 'Craft Kits', icon: Palette },
        { name: 'Photography Equipment', icon: Camera },
        { name: 'Musical Instruments', icon: Music },
        { name: 'Collectibles', icon: Gift },
        { name: 'Outdoor Recreation', icon: Sun },
        { name: 'Gardening Tools', icon: Flower },
        { name: 'Cooking Equipment', icon: Utensils },
        { name: 'DIY Tools', icon: PenTool },
        { name: 'Sewing & Fabric', icon: Scissors },
        { name: 'Model Building', icon: PenTool },
        { name: 'Stationery', icon: PenTool }
      ]
    }
  ];
};
