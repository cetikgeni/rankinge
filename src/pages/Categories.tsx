
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Filter, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { getApprovedCategories, voteForItem, currentUser } from '@/lib/data';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { Category, Item } from '@/lib/types';
import VoteButton from '@/components/VoteButton';

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
                      <CategoryListItem key={category.id} category={category} categoryGroups={categoryGroups} />
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

const CategoryListItem = ({ category, categoryGroups }: { category: Category, categoryGroups: ReturnType<typeof getAllCategoryIcons> }) => {
  // Get top 3 items
  const topItems = [...category.items]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3);
  
  // State to track which item is expanded for voting
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Get user's current vote for this category
  const userVotedItemId = currentUser?.votes[category.id];
  
  // Handle vote action
  const handleVote = (itemId: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to vote');
      return;
    }
    
    const success = voteForItem(category.id, itemId);
    
    if (success) {
      // If already voted for this item, show a different message
      if (userVotedItemId === itemId) {
        toast('You already voted for this item');
      } else {
        toast.success('Your vote has been recorded!');
      }
    } else {
      toast.error('Failed to record your vote');
    }
  };
  
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <Link 
              to={`/categories/${category.id}`} 
              className="text-brand-purple text-sm flex items-center hover:underline"
            >
              View Details <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">{category.description}</p>
          
          {/* Top items with expanded voting */}
          <div className="space-y-3">
            {topItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`border rounded-md p-2 ${expandedItem === item.id ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge 
                      variant="secondary" 
                      className={`mr-2 text-xs font-semibold ${
                        index === 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : index === 1 
                          ? 'bg-gray-200 text-gray-800' 
                          : index === 2 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="outline" className="ml-2 bg-gray-50 text-xs">
                      {item.voteCount} votes
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedItem === item.id ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => setExpandedItem(null)}
                      >
                        Collapse
                      </Button>
                    ) : (
                      <VoteButton 
                        isVoted={userVotedItemId === item.id}
                        isLoggedIn={!!currentUser}
                        onVote={() => {
                          handleVote(item.id);
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {expandedItem === item.id && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-sm text-right">
            <span className="text-gray-500">Total: {category.items.length} items</span>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end">
          <Badge variant="outline" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {selectedGroupForCategory(category, categoryGroups)}
          </Badge>
        </div>
      </div>
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
