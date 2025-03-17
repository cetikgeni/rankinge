
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  Smartphone, 
  Home as HomeIcon, 
  Gamepad, 
  Car, 
  Shirt,
  Star,
  Trophy,
  Coffee,
  Utensils,
  Check,
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AdFooter from '@/components/AdFooter';

// Define category type for simplicity
interface CategoryItem {
  name: string;
  link: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  subcategories: CategoryItem[];
}

// Define ranking entry type
interface RankEntry {
  id: number;
  name: string;
  votes: {
    up: number;
    down: number;
  };
}

interface RankingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  entries: RankEntry[];
}

const HomeAlt = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Categories data
  const categories: Category[] = [
    {
      title: "Electronics",
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      subcategories: [
        { name: "Computers & Tablets", link: "/categories/computers" },
        { name: "Camera & Photo", link: "/categories/cameras" },
        { name: "TV, Audio & Electronics", link: "/categories/tv-audio" },
        { name: "Cell phones & Accessories", link: "/categories/phones" },
        { name: "Smart Homes", link: "/categories/smart-home" },
      ]
    },
    {
      title: "Home & Garden",
      icon: <HomeIcon className="h-5 w-5 text-green-500" />,
      subcategories: [
        { name: "Yard, Garden & Outdoor", link: "/categories/garden" },
        { name: "Bubba Kush", link: "/categories/plants" },
        { name: "Crafts", link: "/categories/crafts" },
        { name: "Home Improvement", link: "/categories/home-improvement" },
        { name: "Pet supplies", link: "/categories/pet-supplies" },
      ]
    },
    {
      title: "Toys & Hobbies",
      icon: <Gamepad className="h-5 w-5 text-purple-500" />,
      subcategories: [
        { name: "Action figures", link: "/categories/action-figures" },
        { name: "Building toys", link: "/categories/building-toys" },
        { name: "Remote control toys", link: "/categories/rc-toys" },
        { name: "Collectables", link: "/categories/collectables" },
        { name: "Dolls & Plushies", link: "/categories/dolls" },
      ]
    },
    {
      title: "Auto Parts & Accessories",
      icon: <Car className="h-5 w-5 text-red-500" />,
      subcategories: [
        { name: "GPS & Security Devices", link: "/categories/auto-gps" },
        { name: "Radar & Laser Detectors", link: "/categories/radar" },
        { name: "Care & Detailing", link: "/categories/auto-care" },
        { name: "Scooter Parts & Accessories", link: "/categories/scooter" },
        { name: "Carnageddon & Beauty", link: "/categories/car-accessories" },
      ]
    },
    {
      title: "Fashion & Style",
      icon: <Shirt className="h-5 w-5 text-pink-500" />,
      subcategories: [
        { name: "Women", link: "/categories/women" },
        { name: "Men", link: "/categories/men" },
        { name: "Watches", link: "/categories/watches" },
        { name: "Shoes", link: "/categories/shoes" },
        { name: "Bags", link: "/categories/bags" },
      ]
    },
  ];
  
  // Rankings data
  const rankings: RankingSection[] = [
    {
      id: "technology",
      title: "Technology",
      icon: <Smartphone className="h-5 w-5" />,
      entries: [
        { id: 1, name: "Samsung Galaxy S10", votes: { up: 245, down: 32 } },
        { id: 2, name: "OnePlus 7 Pro", votes: { up: 198, down: 41 } },
        { id: 3, name: "Google Pixel 4 XL", votes: { up: 167, down: 38 } },
        { id: 4, name: "Samsung Galaxy S10+", votes: { up: 156, down: 29 } },
        { id: 5, name: "Google Pixel 4a", votes: { up: 142, down: 25 } },
      ]
    },
    {
      id: "football",
      title: "Top Football Teams",
      icon: <Trophy className="h-5 w-5" />,
      entries: [
        { id: 1, name: "Bayern Munich", votes: { up: 312, down: 78 } },
        { id: 2, name: "Liverpool", votes: { up: 289, down: 92 } },
        { id: 3, name: "Real Madrid", votes: { up: 267, down: 105 } },
        { id: 4, name: "Paris Saint Germain", votes: { up: 234, down: 87 } },
        { id: 5, name: "Barcelona", votes: { up: 212, down: 94 } },
      ]
    },
    {
      id: "coffee",
      title: "Top Coffee Brands",
      icon: <Coffee className="h-5 w-5" />,
      entries: [
        { id: 1, name: "Kopi Kapal Api", votes: { up: 178, down: 42 } },
        { id: 2, name: "Indocafe Coffemix 3 in 1", votes: { up: 154, down: 37 } },
        { id: 3, name: "Good Day Caribbean Nut", votes: { up: 132, down: 29 } },
        { id: 4, name: "Luwak White Koffie", votes: { up: 121, down: 31 } },
        { id: 5, name: "Kopi Nescafe", votes: { up: 108, down: 27 } },
      ]
    },
    {
      id: "food",
      title: "Noodle Food",
      icon: <Utensils className="h-5 w-5" />,
      entries: [
        { id: 1, name: "Indomie Goreng Special", votes: { up: 289, down: 34 } },
        { id: 2, name: "Indocafe Coffemix 3 in 1", votes: { up: 257, down: 41 } },
        { id: 3, name: "Good Day Caribbean Nut", votes: { up: 234, down: 38 } },
        { id: 4, name: "Luwak White Koffie", votes: { up: 210, down: 45 } },
        { id: 5, name: "Kopi Nescafe", votes: { up: 192, down: 52 } },
      ]
    }
  ];

  // Feature benefits data
  const benefits = [
    {
      title: "Support Your Favorite Brands",
      description: "Let's boost your marketplace",
      icon: <Star className="h-6 w-6 text-green-500" />
    },
    {
      title: "Make Informed Decisions",
      description: "Speed up with Sensation rankings",
      icon: <Trophy className="h-6 w-6 text-indigo-500" />
    },
    {
      title: "Customizable & Reusable",
      description: "Take our UI patterns and rebuild",
      icon: <Star className="h-6 w-6 text-pink-500" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row bg-white rounded-lg border overflow-hidden shadow-sm">
            <div className="lg:w-1/3 p-6 flex items-center justify-center bg-blue-50">
              <img 
                src="https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=2187&auto=format&fit=crop" 
                alt="Vote Illustration" 
                className="h-64 object-contain"
              />
            </div>
            <div className="lg:w-2/3 p-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                2023 - Rank Awards
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Join the Vote,{" "}
                <span className="text-brand-teal">See the Ranks</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Discover the best products, brands, and services as voted by users like you.
                Vote for your favorites and see what's trending in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-brand-purple">
                  Vote Now!
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Bar */}
      <section className="py-6 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search rankings now!"
              className="pl-10 pr-4 py-6 text-base h-12 w-full rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow border-gray-200">
                <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Category</h2>
            <Link to="/categories" className="text-brand-purple text-sm font-medium flex items-center">
              See all Categories
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-gray-800">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.subcategories.map((subcat, i) => (
                    <li key={i}>
                      <Link 
                        to={subcat.link} 
                        className="text-gray-600 hover:text-brand-purple text-sm transition-colors"
                      >
                        {subcat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Ranking Sections */}
      {rankings.map((section, sectionIndex) => (
        <section key={section.id} className={`py-10 px-4 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              <Link to={`/categories/${section.id}`} className="text-brand-purple text-sm font-medium flex items-center">
                See all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex items-center mb-3">
                    <Badge className="mr-2 bg-gray-200 text-gray-800 font-semibold">{entry.id}</Badge>
                    <span className="text-gray-800 font-medium">{entry.name}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center text-sm">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {entry.votes.up}
                      </Button>
                    </div>
                    <div className="flex items-center text-sm">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        {entry.votes.down}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button 
                variant="ghost" 
                className="text-brand-purple font-medium"
                asChild
              >
                <Link to={`/categories/${section.id}`}>
                  More List
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ))}
      
      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-brand-purple to-brand-teal text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join the community?</h2>
          <p className="text-lg mb-8 opacity-90">
            Sign up today and start voting for your favorite products and brands.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="bg-white text-brand-purple hover:bg-gray-100"
            >
              <Link to="/register">Register Now</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
            >
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer with Ads */}
      <AdFooter />
    </div>
  );
};

export default HomeAlt;
