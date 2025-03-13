
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { getApprovedCategories } from '@/lib/data';
import { Category } from '@/lib/types';

const Categories = () => {
  const allCategories = getApprovedCategories();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter categories based on search term
  const filteredCategories = allCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">All Categories</h1>
          <p className="text-gray-600 mb-8">Browse and vote in all available categories</p>
          
          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
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
          
          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No categories matching "${searchTerm}"`
                  : "There are no categories available at the moment."}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-50 border-t">
        <div className="container mx-auto max-w-6xl text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Categlorium. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Categories;
