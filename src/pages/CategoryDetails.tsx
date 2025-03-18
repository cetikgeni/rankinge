
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import { getCategoryById, voteForItem, currentUser } from '@/lib/data';
import { Item } from '@/lib/types';
import { AdCard } from '@/components/SponsoredSection';
import AdFooter from '@/components/AdFooter';
import SidebarAd from '@/components/SidebarAd';

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const category = getCategoryById(id || '');
  const [items, setItems] = useState<Item[]>([]);
  
  useEffect(() => {
    if (category) {
      // Sort items by vote count
      const sortedItems = [...category.items].sort((a, b) => b.voteCount - a.voteCount);
      setItems(sortedItems);
    }
  }, [category]);
  
  const userVotedItemId = currentUser?.votes[id || ''];
  
  const handleVote = (itemId: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to vote');
      return;
    }
    
    const success = voteForItem(id || '', itemId);
    
    if (success) {
      // If already voted for this item, show a different message
      if (userVotedItemId === itemId) {
        toast('You already voted for this item');
      } else {
        toast.success('Your vote has been recorded!');
      }
      
      // Update the items to reflect the new vote count
      if (category) {
        const sortedItems = [...category.items].sort((a, b) => b.voteCount - a.voteCount);
        setItems(sortedItems);
      }
    } else {
      toast.error('Failed to record your vote');
    }
  };
  
  // Sponsored product data - in a real app this would come from an API
  const sponsoredProduct = {
    title: "Premium " + (category?.name || "Product"),
    description: "Ultra-comfortable design with advanced features. Limited time offer.",
    imageUrl: category?.items[0]?.imageUrl || "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2560&auto=format&fit=crop",
    targetUrl: "https://example.com/premium-product",
    category: category?.name || "Products"
  };
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
            <p className="text-gray-600 mb-4">The category you're looking for doesn't exist or has been removed.</p>
            <Link to="/categories" className="text-brand-purple hover:underline">
              Back to all categories
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          {/* Back Link */}
          <Link 
            to="/categories" 
            className="inline-flex items-center text-brand-purple hover:text-brand-purple/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all categories
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              {/* Category Header */}
              <div className="relative h-64 rounded-lg overflow-hidden mb-8">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                    <p className="text-white/90">{category.description}</p>
                  </div>
                </div>
              </div>
              
              {!category.isApproved && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-8">
                  <p className="font-medium">This category is pending approval</p>
                  <p className="text-sm">
                    This category has been submitted and is awaiting admin review before it becomes available for public voting.
                  </p>
                </div>
              )}
              
              {/* Voting Instructions */}
              <div className="bg-white rounded-md p-4 mb-8 shadow-sm">
                <h2 className="text-lg font-medium mb-2">Voting Rules</h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• You can vote for one item in this category.</li>
                  <li>• You can change your vote at any time.</li>
                  <li>• Results are updated in real-time.</li>
                </ul>
              </div>
              
              {/* Items List */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">Rankings</h2>
                
                <div className="space-y-6">
                  {items.map((item, index) => {
                    // Insert sponsored product after the second item (at position 3)
                    if (index === 2) {
                      return (
                        <div key={`sponsored-${item.id}`} className="space-y-6">
                          <div className="relative">
                            <ItemCard 
                              item={item}
                              categoryId={category.id}
                              rank={index + 1}
                              onVote={handleVote}
                              userVotedItemId={userVotedItemId}
                            />
                          </div>
                          
                          <div className="relative rounded-lg overflow-hidden border border-brand-purple/20 bg-gradient-to-r from-brand-purple/5 to-brand-teal/5">
                            <div className="absolute top-0 left-0 bg-brand-purple text-white text-xs font-bold py-1 px-3 rounded-br-lg">
                              Sponsored
                            </div>
                            <AdCard 
                              title={sponsoredProduct.title}
                              description={sponsoredProduct.description}
                              imageUrl={sponsoredProduct.imageUrl}
                              targetUrl={sponsoredProduct.targetUrl}
                              category={sponsoredProduct.category}
                            />
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <ItemCard 
                        key={item.id}
                        item={item}
                        categoryId={category.id}
                        rank={index + 1}
                        onVote={handleVote}
                        userVotedItemId={userVotedItemId}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:w-1/4 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">About This Ranking</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Items:</span>
                    <span className="ml-2 font-medium">{items.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Votes:</span>
                    <span className="ml-2 font-medium">
                      {items.reduce((sum, item) => sum + item.voteCount, 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Your Vote:</span>
                    <span className="ml-2 font-medium">
                      {userVotedItemId 
                        ? items.find(item => item.id === userVotedItemId)?.name || "Unknown" 
                        : "Not voted yet"}
                    </span>
                  </div>
                </div>
              </div>
              
              <SidebarAd 
                title="Try Our Mobile App"
                description="Vote on rankings on the go"
                imageUrl="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop"
                targetUrl="https://example.com/app"
              />
              
              <SidebarAd 
                title="Share Your Opinion"
                description="Create your own rankings today"
                imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop"
                targetUrl="https://example.com/create"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 bg-white border-t">
        <div className="container mx-auto max-w-7xl">
          <AdFooter />
        </div>
      </footer>
    </div>
  );
};

export default CategoryDetails;
