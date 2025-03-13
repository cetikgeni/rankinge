
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { Link } from 'react-router-dom';

interface SearchResult {
  name: string;
  type: 'category' | 'subcategory';
  parentCategory?: string;
  path: string;
}

const CategorySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const allCategories = getAllCategoryIcons();
    const results: SearchResult[] = [];
    
    // Search for matching categories
    allCategories.forEach(category => {
      if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          name: category.name,
          type: 'category',
          path: `/categories?filter=${encodeURIComponent(category.name.toLowerCase())}`
        });
      }
      
      // Search for matching subcategories
      category.subcategories.forEach(subcategory => {
        if (subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            name: subcategory.name,
            type: 'subcategory',
            parentCategory: category.name,
            path: `/categories?filter=${encodeURIComponent(subcategory.name.toLowerCase())}`
          });
        }
      });
    });
    
    setSearchResults(results.slice(0, 10)); // Limit to 10 results
  }, [searchTerm]);
  
  return (
    <div className="relative max-w-md w-full mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search categories or subcategories..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setTimeout(() => setIsVisible(false), 200)}
        />
      </div>
      
      {isVisible && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-80 overflow-y-auto">
          <ul className="py-2">
            {searchResults.map((result, index) => (
              <li key={index}>
                <Link
                  to={result.path}
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{result.name}</div>
                  {result.type === 'subcategory' && result.parentCategory && (
                    <div className="text-sm text-gray-500">in {result.parentCategory}</div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySearch;
