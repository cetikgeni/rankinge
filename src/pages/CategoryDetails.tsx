import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import { useCategoryById } from '@/hooks/useCategories';
import { useVoting } from '@/hooks/useVoting';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import AdFooter from '@/components/AdFooter';
import SidebarAd from '@/components/SidebarAd';

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { category, isLoading } = useCategoryById(id);
  const { userVotedItemId, vote } = useVoting(id);
  const { settings } = useAppSettings();
  const { user } = useAuth();
  
  const [items, setItems] = useState(category?.items || []);

  useEffect(() => {
    if (category?.items) {
      const sortedItems = [...category.items].sort((a, b) => b.vote_count - a.vote_count);
      setItems(sortedItems);
    }
  }, [category]);

  const handleVote = async (itemId: string) => {
    const success = await vote(itemId);
    if (success && category) {
      // Refresh items (in a real app, we'd refetch from server)
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          return { ...item, vote_count: item.vote_count + 1 };
        }
        if (item.id === userVotedItemId) {
          return { ...item, vote_count: Math.max(0, item.vote_count - 1) };
        }
        return item;
      });
      setItems(updatedItems.sort((a, b) => b.vote_count - a.vote_count));
    }
  };

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
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-4">The category you're looking for doesn't exist or has been removed.</p>
            <Link to="/categories" className="text-primary hover:underline">
              Back to all categories
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const totalVotes = items.reduce((sum, item) => sum + item.vote_count, 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <Link 
            to="/categories" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all categories
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <div className="relative h-64 rounded-lg overflow-hidden mb-8">
                <img 
                  src={category.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800'} 
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
              
              {!category.is_approved && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-8">
                  <p className="font-medium">This category is pending approval</p>
                  <p className="text-sm">
                    This category has been submitted and is awaiting admin review before it becomes available for public voting.
                  </p>
                </div>
              )}
              
              <div className="bg-card rounded-md p-4 mb-8 shadow-sm">
                <h2 className="text-lg font-medium mb-2">Voting Rules</h2>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You can vote for one item in this category. / Anda dapat memilih satu item dalam kategori ini.</li>
                  <li>• You can change your vote at any time. / Anda dapat mengubah pilihan kapan saja.</li>
                  <li>• Results are updated in real-time. / Hasil diperbarui secara real-time.</li>
                  <li>• Rankings are based on user votes only. / Peringkat hanya berdasarkan suara pengguna.</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">Rankings</h2>
                
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <ItemCard 
                      key={item.id}
                      item={{
                        id: item.id,
                        name: item.name,
                        description: item.description || '',
                        imageUrl: item.image_url || '',
                        voteCount: item.vote_count,
                        productUrl: item.product_url || undefined,
                        affiliateUrl: item.affiliate_url || undefined
                      }}
                      category={{
                        id: category.id,
                        name: category.name,
                        description: category.description || '',
                        imageUrl: category.image_url || '',
                        items: [],
                        isApproved: category.is_approved,
                        createdBy: '',
                        settings: { displayVoteAs: 'count' }
                      }}
                      rank={index + 1}
                      onVote={handleVote}
                      userVotedItemId={userVotedItemId || undefined}
                      totalVotesInCategory={totalVotes}
                      voteDisplayMode={settings.voteDisplayMode}
                      isLoggedIn={!!user}
                    />
                  ))}
                </div>
                
                {/* Affiliate Disclosure */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    Beberapa tautan adalah tautan afiliasi. / Some links are affiliate links.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/4 space-y-6">
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">About This Ranking</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <span className="ml-2 font-medium">{items.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Votes:</span>
                    <span className="ml-2 font-medium">
                      {totalVotes}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Your Vote:</span>
                    <span className="ml-2 font-medium">
                      {userVotedItemId 
                        ? items.find(item => item.id === userVotedItemId)?.name || "Unknown" 
                        : "Not voted yet"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Display Format:</span>
                    <span className="ml-2 font-medium capitalize">
                      {settings.voteDisplayMode}
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
      
      <footer className="py-6 px-4 bg-card border-t">
        <div className="container mx-auto max-w-7xl">
          <AdFooter />
        </div>
      </footer>
    </div>
  );
};

export default CategoryDetails;
