
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { getApprovedCategories } from '@/lib/data';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { Category } from '@/lib/types';

const Categories = () => {
  const allCategories = getApprovedCategories();
  const categoryGroups = getAllCategoryIcons();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  
  // Filter categories based on search term and selected group
  const filteredCategories = allCategories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup 
      ? categoryGroups.find(group => group.name === selectedGroup)?.subcategories
          .some(sub => category.name.toLowerCase().includes(sub.name.toLowerCase())) 
      : true;
    
    return matchesSearch && matchesGroup;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h2 className="font-bold text-lg mb-4">Category Groups</h2>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedGroup === null ? 'bg-brand-purple/10 text-brand-purple' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setSelectedGroup(null)}
                  >
                    All Categories
                  </button>
                  
                  {categoryGroups.map(group => (
                    <button 
                      key={group.name}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors
                        ${selectedGroup === group.name ? 'bg-brand-purple/10 text-brand-purple' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setSelectedGroup(group.name === selectedGroup ? null : group.name)}
                    >
                      <group.icon className="mr-2 h-4 w-4" />
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">Quick Links</h2>
                <div className="space-y-2 text-sm">
                  <Link 
                    to="/submit"
                    className="flex items-center text-brand-purple hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Submit New Category
                  </Link>
                  <Link 
                    to="/"
                    className="flex items-center text-brand-purple hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Featured Categories
                  </Link>
                  <Link 
                    to="/advertise"
                    className="flex items-center text-brand-purple hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Advertise with Us
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Browse Categories</h1>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {selectedGroup && (
                  <div className="mb-4 flex items-center">
                    <Badge variant="outline" className="mr-2 bg-brand-purple/5 text-brand-purple">
                      {selectedGroup}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => setSelectedGroup(null)}
                    >
                      Clear filter
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Categories List */}
              {filteredCategories.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 divide-y">
                    {filteredCategories.map((category) => (
                      <CategoryListItem key={category.id} category={category} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? `No categories matching "${searchTerm}"`
                      : "There are no categories available for this filter."}
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setSelectedGroup(null);
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-100 border-t">
        <div className="container mx-auto max-w-7xl text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Categlorium. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const CategoryListItem = ({ category }: { category: Category }) => {
  // Get top 3 items
  const topItems = [...category.items]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3);
  
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <Link to={`/categories/${category.id}`} className="block">
        <div className="flex items-start">
          <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{category.description}</p>
            
            {/* Top items badges */}
            <div className="flex flex-wrap gap-2">
              {topItems.map((item, index) => (
                <Badge key={item.id} variant="outline" className="bg-gray-50">
                  #{index + 1} {item.name} ({item.voteCount})
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end">
            <Badge className="mb-2 bg-brand-purple/10 text-brand-purple border-brand-purple/20">
              {category.items.length} items
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {selectedGroupForCategory(category, categoryGroups)}
            </Badge>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Helper function to find which group a category belongs to
const selectedGroupForCategory = (category: Category, categoryGroups: ReturnType<typeof getAllCategoryIcons>) => {
  for (const group of categoryGroups) {
    for (const subCategory of group.subcategories) {
      if (category.name.toLowerCase().includes(subCategory.name.toLowerCase())) {
        return group.name;
      }
    }
  }
  return "Other";
};

export default Categories;
