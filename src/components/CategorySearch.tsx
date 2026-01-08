import { useState, useEffect, useMemo, useCallback, memo } from 'react';
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

const CategorySearch = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  
  // Memoize all categories to prevent recalculation
  const allCategories = useMemo(() => getAllCategoryIcons(), []);
  
  // Memoize all search results
  const allSearchResults = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];
    
    allCategories.forEach(category => {
      results.push({
        name: category.name,
        type: 'category',
        path: `/categories?filter=${encodeURIComponent(category.name.toLowerCase())}`
      });
      
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
  }, [allCategories]);
  
  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.length < 2 && !showAllCategories) {
      setSearchResults([]);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = allSearchResults.filter(result => 
      showAllCategories || result.name.toLowerCase().includes(lowerSearchTerm)
    );
    
    setSearchResults(showAllCategories ? results : results.slice(0, 10));
    if (showAllCategories) {
      setCurrentPage(1);
    }
  }, [searchTerm, showAllCategories, allSearchResults]);
  
  // Get paginated results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return allSearchResults.slice(startIndex, startIndex + resultsPerPage);
  }, [allSearchResults, currentPage, resultsPerPage]);
  
  // Total pages calculation
  const totalPages = useMemo(() => 
    Math.ceil(allSearchResults.length / resultsPerPage), 
    [allSearchResults.length, resultsPerPage]
  );
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleFocus = useCallback(() => setIsVisible(true), []);
  const handleBlur = useCallback(() => setTimeout(() => setIsVisible(false), 200), []);
  const toggleShowAll = useCallback(() => setShowAllCategories(prev => !prev), []);
  
  return (
    <div className="relative max-w-md w-full mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search categories or subcategories..."
          className="pl-10"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      
      {isVisible && (searchResults.length > 0 || showAllCategories) && (
        <div className="absolute z-10 mt-1 w-full bg-card shadow-lg rounded-md border border-border max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-border flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {showAllCategories 
                ? `Showing ${paginatedResults.length} of ${allSearchResults.length} categories`
                : `Search results for "${searchTerm}"`}
            </span>
            <button
              onClick={toggleShowAll}
              className="text-xs text-primary hover:underline"
            >
              {showAllCategories ? 'Hide all' : 'View all categories'}
            </button>
          </div>
          
          {showAllCategories ? (
            <>
              <ul className="py-2">
                {paginatedResults.map((result, index) => (
                  <li key={`${result.type}-${result.name}-${index}`}>
                    <Link
                      to={result.path}
                      className="block px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{result.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {result.type === 'category' ? 'Category' : 'Subcategory'}
                        </Badge>
                      </div>
                      {result.type === 'subcategory' && result.parentCategory && (
                        <div className="text-sm text-muted-foreground">in {result.parentCategory}</div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-border p-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum = currentPage - 2 + i;
                      
                      if (currentPage < 3) {
                        pageNum = i + 1;
                      }
                      
                      if (currentPage > totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      }
                      
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
                    className="block px-4 py-2 hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-foreground">{result.name}</div>
                    {result.type === 'subcategory' && result.parentCategory && (
                      <div className="text-sm text-muted-foreground">in {result.parentCategory}</div>
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
});

CategorySearch.displayName = 'CategorySearch';

export default CategorySearch;