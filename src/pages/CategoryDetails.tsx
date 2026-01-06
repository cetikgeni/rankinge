import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';
import { useCategoryById } from '@/hooks/useCategories';
import { useVoting } from '@/hooks/useVoting';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import { useLiveRanking } from '@/hooks/useLiveRanking';
import { useRankingHistory } from '@/hooks/useRankingHistory';
import { useTranslation } from '@/contexts/LanguageContext';
import SidebarAd from '@/components/SidebarAd';
import LiveRankingBadge from '@/components/LiveRankingBadge';
import RankingMovementBadge from '@/components/RankingMovementBadge';
import AdminCategoryEditor from '@/components/admin/AdminCategoryEditor';

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { category, isLoading, refetch } = useCategoryById(id);
  const { userVotedItemId, vote } = useVoting(id);
  const { settings } = useAppSettings();
  const { user, isAdmin } = useAuth();
  const { items: liveItems, isLive } = useLiveRanking(id);
  const { getMovement, lastSnapshot } = useRankingHistory(id);
  const { t } = useTranslation();
  
  const [items, setItems] = useState(liveItems);

  useEffect(() => {
    if (liveItems.length > 0) {
      setItems(liveItems);
    } else if (category?.items) {
      const sortedItems = [...category.items].sort((a, b) => b.vote_count - a.vote_count);
      setItems(sortedItems);
    }
  }, [category, liveItems]);

  const handleVote = async (itemId: string) => {
    const success = await vote(itemId);
    if (success && category) {
      // Items will be updated via realtime subscription
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('categories.notFound')}</h2>
            <p className="text-muted-foreground mb-4">{t('categories.notFoundDesc')}</p>
            <Link to="/categories" className="text-primary hover:underline">
              {t('categories.backToAll')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const totalVotes = items.reduce((sum, item) => sum + item.vote_count, 0);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/categories" 
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('categories.backToAll')}
            </Link>
            
            {/* Admin Edit Button */}
            {isAdmin && category && (
              <AdminCategoryEditor
                category={{
                  id: category.id,
                  name: category.name,
                  description: category.description,
                  image_url: category.image_url,
                  category_group: category.category_group,
                }}
                items={items.map(item => ({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  image_url: item.image_url,
                  product_url: item.product_url,
                  affiliate_url: item.affiliate_url,
                }))}
                onUpdate={refetch}
              />
            )}
          </div>
          
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
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-md p-4 mb-8">
                  <p className="font-medium">{t('status.pendingApproval')}</p>
                  <p className="text-sm">{t('status.pendingDesc')}</p>
                </div>
              )}
              
              <div className="bg-card rounded-md p-4 mb-8 shadow-sm">
                <h2 className="text-lg font-medium mb-2">{t('vote.rules')}</h2>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('vote.rule1')}</li>
                  <li>• {t('vote.rule2')}</li>
                  <li>• {t('vote.rule3')}</li>
                  <li>• {t('vote.rule4')}</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{t('ranking.title')}</h2>
                  <LiveRankingBadge isLive={isLive} lastUpdated={lastSnapshot} />
                </div>
                
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No items in this category yet.</p>
                    </div>
                  ) : (
                    items.map((item, index) => {
                      const movement = getMovement(item.id);
                      const rank = index + 1;
                      return (
                        <div key={item.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors">
                          {/* Rank Number */}
                          <div className="flex flex-col items-center min-w-[60px]">
                            <span className={`text-2xl font-bold ${
                              rank === 1 ? 'text-yellow-500' : 
                              rank === 2 ? 'text-gray-400' : 
                              rank === 3 ? 'text-amber-600' : 
                              'text-muted-foreground'
                            }`}>
                              {String(rank).padStart(2, '0')}
                            </span>
                            {movement && (
                              <RankingMovementBadge 
                                movement={movement.movement} 
                                previousRank={movement.previousRank}
                                currentRank={rank}
                                size="sm"
                              />
                            )}
                          </div>
                          
                          {/* Item Content */}
                          <div className="flex-grow">
                            <ItemCard 
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
                              rank={rank}
                              onVote={handleVote}
                              userVotedItemId={userVotedItemId || undefined}
                              totalVotesInCategory={totalVotes}
                              voteDisplayMode={settings.voteDisplayMode}
                              isLoggedIn={!!user}
                              hideRank={true}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Affiliate Disclosure */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    {t('footer.affiliate')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/4 space-y-6">
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">{t('ranking.about')}</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('ranking.items')}:</span>
                    <span className="ml-2 font-medium">{items.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('ranking.totalVotes')}:</span>
                    <span className="ml-2 font-medium">{totalVotes}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('ranking.yourVote')}:</span>
                    <span className="ml-2 font-medium">
                      {userVotedItemId 
                        ? items.find(item => item.id === userVotedItemId)?.name || "Unknown" 
                        : t('ranking.notVotedYet')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('ranking.displayFormat')}:</span>
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
      
      <Footer />
    </div>
  );
};

export default CategoryDetails;
