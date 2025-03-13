
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  
  // Get all categories and subcategories
  const allCategories = getAllCategoryIcons();
  
  // Create a flat list of all search results for pagination display
  const getAllSearchResults = (): SearchResult[] => {
    const results: SearchResult[] = [];
    
    allCategories.forEach(category => {
      // Add the main category
      results.push({
        name: category.name,
        type: 'category',
        path: `/categories?filter=${encodeURIComponent(category.name.toLowerCase())}`
      });
      
      // Add all subcategories
      category.subcategories.forEach(subcategory => {
        results.push({
          name: subcategory.name,
          type: 'subcategory',
          parentCategory: category.name,
          path: `/categories?filter=${encodeURIComponent(subcategory.name.toLowerCase())}`
        });
      });
    });
    
    return results;
  };
  
  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.length < 2 && !showAllCategories) {
      setSearchResults([]);
      return;
    }
    
    const results: SearchResult[] = [];
    
    // Search for matching categories
    allCategories.forEach(category => {
      if (category.name.toLowerCase().includes(searchTerm.toLowerCase()) || showAllCategories) {
        results.push({
          name: category.name,
          type: 'category',
          path: `/categories?filter=${encodeURIComponent(category.name.toLowerCase())}`
        });
      }
      
      // Search for matching subcategories
      category.subcategories.forEach(subcategory => {
        if (subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) || showAllCategories) {
          results.push({
            name: subcategory.name,
            type: 'subcategory',
            parentCategory: category.name,
            path: `/categories?filter=${encodeURIComponent(subcategory.name.toLowerCase())}`
          });
        }
      });
    });
    
    setSearchResults(showAllCategories ? results : results.slice(0, 10));
    if (showAllCategories) {
      setCurrentPage(1);
    }
  }, [searchTerm, showAllCategories]);
  
  // Get paginated results
  const getPaginatedResults = () => {
    const allResults = getAllSearchResults();
    const startIndex = (currentPage - 1) * resultsPerPage;
    return allResults.slice(startIndex, startIndex + resultsPerPage);
  };
  
  // Total pages calculation
  const totalPages = Math.ceil(getAllSearchResults().length / resultsPerPage);
  
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
      
      {isVisible && (searchResults.length > 0 || showAllCategories) && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-2 border-b flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {showAllCategories 
                ? `Showing ${getPaginatedResults().length} of ${getAllSearchResults().length} categories`
                : `Search results for "${searchTerm}"`}
            </span>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs text-brand-purple hover:underline"
            >
              {showAllCategories ? 'Hide all' : 'View all categories'}
            </button>
          </div>
          
          {showAllCategories ? (
            <>
              <ul className="py-2">
                {getPaginatedResults().map((result, index) => (
                  <li key={`${result.type}-${result.name}-${index}`}>
                    <Link
                      to={result.path}
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {result.type === 'category' ? 'Category' : 'Subcategory'}
                        </Badge>
                      </div>
                      {result.type === 'subcategory' && result.parentCategory && (
                        <div className="text-sm text-gray-500">in {result.parentCategory}</div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="border-t p-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Show pages around current page
                      let pageNum = currentPage - 2 + i;
                      
                      // Adjust if we're at the start
                      if (currentPage < 3) {
                        pageNum = i + 1;
                      }
                      
                      // Adjust if we're at the end
                      if (currentPage > totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      }
                      
                      // Make sure pageNum is valid
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;
