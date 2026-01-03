import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ExternalLink, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { useCategories, Category } from '@/hooks/useCategories';
import { useVoting } from '@/hooks/useVoting';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import VoteButton from '@/components/VoteButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Categories = () => {
  const { categories, isLoading } = useCategories(true);
  const categoryGroups = getAllCategoryIcons();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { settings } = useAppSettings();
  const { user } = useAuth();
  
  // Build hierarchical structure for sidebar
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const childCategories = categories.filter(cat => cat.parent_id);

  // Filter categories based on search term and selected group
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup 
      ? category.category_group === selectedGroup ||
        categoryGroups.find(group => group.name === selectedGroup)?.subcategories
          .some(sub => category.name.toLowerCase().includes(sub.name.toLowerCase())) 
      : true;
    
    return matchesSearch && matchesGroup;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
                <h2 className="font-bold text-lg mb-4">Category Groups</h2>
                <div className="space-y-1">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedGroup === null ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                    onClick={() => setSelectedGroup(null)}
                  >
                    All Categories
                  </button>
                  
                  {categoryGroups.map(group => (
                    <Collapsible key={group.name}>
                      <CollapsibleTrigger asChild>
                        <button 
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors
                            ${selectedGroup === group.name ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                          onClick={() => setSelectedGroup(group.name === selectedGroup ? null : group.name)}
                        >
                          <span className="flex items-center">
                            <group.icon className="mr-2 h-4 w-4" />
                            {group.name}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-6 mt-1 space-y-1">
                          {/* Show child categories */}
                          {categories
                            .filter(cat => cat.category_group === group.name)
                            .slice(0, 5)
                            .map(cat => (
                              <Link
                                key={cat.id}
                                to={`/categories/${cat.id}`}
                                className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                              >
                                {cat.name}
                              </Link>
                            ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">Quick Links</h2>
                <div className="space-y-2 text-sm">
                  <Link 
                    to="/submit"
                    className="flex items-center text-primary hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Submit New Category
                  </Link>
                  <Link 
                    to="/"
                    className="flex items-center text-primary hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Featured Categories
                  </Link>
                  <Link 
                    to="/advertise"
                    className="flex items-center text-primary hover:underline"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Advertise with Us
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-bold mb-4 text-foreground">Browse Categories</h1>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
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
                    <Badge variant="outline" className="mr-2 bg-primary/5 text-primary">
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
                <div className="bg-card rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 divide-y divide-border">
                    {filteredCategories.map((category) => (
                      <CategoryListItem 
                        key={category.id} 
                        category={category}
                        voteDisplayMode={settings.voteDisplayMode}
                        isLoggedIn={!!user}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
                  <p className="text-muted-foreground mb-4">
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
      <footer className="py-6 px-4 bg-muted/50 border-t">
        <div className="container mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rankinge. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

interface CategoryListItemProps {
  category: Category;
  voteDisplayMode: string;
  isLoggedIn: boolean;
}

const CategoryListItem = ({ category, voteDisplayMode, isLoggedIn }: CategoryListItemProps) => {
  // Get top 3 items
  const topItems = [...category.items]
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 3);
  
  const [isOpen, setIsOpen] = useState(false);
  const { userVotedItemId, vote } = useVoting(category.id);
  
  const totalVotes = category.items.reduce((sum, item) => sum + item.vote_count, 0);

  const getVoteDisplay = (voteCount: number) => {
    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    switch (voteDisplayMode) {
      case 'count':
        return `${voteCount} votes`;
      case 'both':
        return `${percentage}% (${voteCount})`;
      case 'percentage':
      default:
        return `${percentage}%`;
    }
  };
  
  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start">
        <img 
          src={category.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200'} 
          alt={category.name} 
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              {category.category_group && (
                <Badge 
                  variant="outline" 
                  className="bg-muted text-xs capitalize"
                >
                  {category.category_group}
                </Badge>
              )}
            </div>
            <Link 
              to={`/categories/${category.id}`} 
              className="text-primary text-sm flex items-center hover:underline"
            >
              View Details <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{category.description}</p>
          
          {/* Collapsible top items */}
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border rounded-md overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center p-2 bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Top Items ({topItems.length})</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 p-2">
                {topItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-2 bg-card border-b last:border-b-0"
                  >
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
                      <Badge variant="outline" className="ml-2 bg-muted text-xs">
                        {getVoteDisplay(item.vote_count)}
                      </Badge>
                    </div>
                    
                    <VoteButton 
                      isVoted={userVotedItemId === item.id}
                      isLoggedIn={isLoggedIn}
                      onVote={() => vote(item.id)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="mt-3 text-sm text-right">
            <span className="text-muted-foreground">Total: {category.items.length} items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
