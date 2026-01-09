import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, ArrowUp, ArrowDown, Minus, Sparkles, ExternalLink, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VoteButton from '@/components/VoteButton';
import ExpandableDescription from '@/components/ExpandableDescription';
import { useCategoryById, useCategories } from '@/hooks/useCategories';
import { useVoting } from '@/hooks/useVoting';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import { useLiveRanking } from '@/hooks/useLiveRanking';
import { useRankingHistory } from '@/hooks/useRankingHistory';
import { useTranslation } from '@/contexts/LanguageContext';
import SidebarAd from '@/components/SidebarAd';
import LiveRankingBadge from '@/components/LiveRankingBadge';
import AdminCategoryEditor from '@/components/admin/AdminCategoryEditor';
import ShareButton from '@/components/ShareButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { category, isLoading, refetch } = useCategoryById(id);
  const { categories } = useCategories(true);
  const { userVotedItemId, vote } = useVoting(category?.id);
  const { settings } = useAppSettings();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { items: liveItems, isLive } = useLiveRanking(category?.id);
  const { getMovement, lastSnapshot } = useRankingHistory(category?.id);
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

  // Get related categories (same category_group, exclude current)
  const relatedCategories = categories
    .filter(cat => 
      cat.category_group === category?.category_group && 
      cat.id !== category?.id &&
      cat.is_approved
    )
    .slice(0, 4);

  // Show loading only if auth is still loading after a reasonable time
  if (isLoading || (authLoading && !category)) {
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

  // Vote display helper - respects admin settings
  const getVoteDisplay = (voteCount: number) => {
    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    switch (settings.voteDisplayMode) {
      case 'count':
        return `${voteCount} ${t('vote.votes')}`;
      case 'both':
        return `${percentage}% (${voteCount})`;
      case 'percentage':
      default:
        return `${percentage}%`;
    }
  };
  
  // Render movement indicator like professional sports rankings
  const renderMovement = (itemId: string, currentRank: number) => {
    const movement = getMovement(itemId);
    
    if (!movement) {
      // No previous data - show as stable
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Minus className="h-3 w-3" />
        </div>
      );
    }
    
    const { movement: type, previousRank } = movement;
    const change = previousRank ? previousRank - currentRank : 0;
    
    if (type === 'new') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs px-1.5 py-0.5">
          <Sparkles className="h-3 w-3 mr-0.5" />
          NEW
        </Badge>
      );
    }
    
    if (type === 'up' && change > 0) {
      return (
        <div className="flex items-center gap-0.5 text-green-600 font-medium text-sm">
          <ArrowUp className="h-4 w-4" />
          <span>{change}</span>
        </div>
      );
    }
    
    if (type === 'down' && change < 0) {
      return (
        <div className="flex items-center gap-0.5 text-red-600 font-medium text-sm">
          <ArrowDown className="h-4 w-4" />
          <span>{Math.abs(change)}</span>
        </div>
      );
    }
    
    // Stable
    return (
      <div className="flex items-center text-muted-foreground">
        <Minus className="h-3 w-3" />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-6 md:py-10 px-3 md:px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <Link 
              to="/categories" 
              className="inline-flex items-center text-primary hover:text-primary/80 text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('categories.backToAll')}
            </Link>
            
            <div className="flex items-center gap-2">
              {/* Share Button */}
              {category && (
                <ShareButton 
                  title={category.name}
                  description={category.description || ''}
                  url={window.location.href}
                  imageUrl={category.image_url || undefined}
                />
              )}
              
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
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-3/4">
              {/* Hero Image - Mobile optimized */}
              <div className="relative h-40 sm:h-52 md:h-64 rounded-lg overflow-hidden mb-6 md:mb-8">
                <img 
                  src={category.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800'} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 md:p-6 text-white">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">{category.name}</h1>
                    <p className="text-white/90 text-sm md:text-base line-clamp-2">{category.description}</p>
                  </div>
                </div>
              </div>
              
              {!category.is_approved && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-md p-3 md:p-4 mb-6 md:mb-8">
                  <p className="font-medium text-sm md:text-base">{t('status.pendingApproval')}</p>
                  <p className="text-xs md:text-sm">{t('status.pendingDesc')}</p>
                </div>
              )}
              
              {/* Voting Rules - Hidden on mobile by default */}
              <div className="hidden sm:block bg-card rounded-md p-4 mb-6 md:mb-8 shadow-sm">
                <h2 className="text-lg font-medium mb-2">{t('vote.rules')}</h2>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('vote.rule1')}</li>
                  <li>• {t('vote.rule2')}</li>
                  <li>• {t('vote.rule3')}</li>
                  <li>• {t('vote.rule4')}</li>
                </ul>
              </div>
              
              {/* Professional Sports-style Ranking */}
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="bg-primary text-primary-foreground px-4 md:px-6 py-3 md:py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide">
                      {category.name.toUpperCase()} - {t('ranking.title').toUpperCase()}
                    </h2>
                    <LiveRankingBadge isLive={isLive} lastUpdated={lastSnapshot} />
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {items.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No items in this category yet.</p>
                    </div>
                  ) : (
                    items.map((item, index) => {
                      const rank = index + 1;
                      const isVoted = userVotedItemId === item.id;
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-colors ${isVoted ? 'bg-primary/5' : ''}`}
                        >
                          {/* Mobile: Top Row - Rank, Image, Name */}
                          <div className="flex items-center gap-3 flex-grow min-w-0">
                            {/* Rank Number */}
                            <div className="flex items-center gap-2 min-w-[50px] sm:min-w-[80px]">
                              <span className={`text-xl sm:text-2xl font-bold tabular-nums ${
                                rank === 1 ? 'text-yellow-500' : 
                                rank === 2 ? 'text-gray-400' : 
                                rank === 3 ? 'text-amber-600' : 
                                'text-muted-foreground'
                              }`}>
                                {String(rank).padStart(2, '0')}
                              </span>
                              <div className="hidden sm:block">
                                {renderMovement(item.id, rank)}
                              </div>
                            </div>
                            
                            {/* Item Image */}
                            <div className="w-12 h-12 sm:w-16 sm:h-12 rounded overflow-hidden flex-shrink-0 border border-border">
                              <img 
                                src={item.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200'} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            
                            {/* Item Info */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                                  {item.name}
                                </h3>
                                <div className="sm:hidden">
                                  {renderMovement(item.id, rank)}
                                </div>
                              </div>
                              {item.description && (
                                <ExpandableDescription 
                                  text={item.description}
                                  maxLines={2}
                                  className="hidden sm:block"
                                />
                              )}
                            </div>
                          </div>
                          
                          {/* Mobile: Bottom Row - Links, Vote count, Vote button */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 ml-[62px] sm:ml-0">
                            {/* Product/Affiliate Links */}
                            <div className="flex flex-wrap gap-2">
                              {item.product_url && (
                                <a
                                  href={item.product_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-xs text-primary hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">{t('action.visitWebsite')}</span>
                                  <span className="sm:hidden">Visit</span>
                                </a>
                              )}
                              {item.affiliate_url && (
                                <a
                                  href={item.affiliate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  {t('action.buy')}
                                </a>
                              )}
                            </div>
                            
                            {/* Vote Section */}
                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                              <div className="text-right">
                                <span className="text-sm sm:text-lg font-bold text-foreground">
                                  {getVoteDisplay(item.vote_count)}
                                </span>
                              </div>
                              <VoteButton 
                                isVoted={isVoted}
                                isLoggedIn={!!user}
                                onVote={() => handleVote(item.id)}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Affiliate Disclosure */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground italic">
                    {t('footer.affiliate')}
                  </p>
                </div>
              </div>
              
              {/* Related Categories Section */}
              {relatedCategories.length > 0 && (
                <div className="mt-6 md:mt-8">
                  <h2 className="text-xl font-bold mb-4">{t('blog.relatedCategories')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedCategories.map((relCat) => (
                      <Link
                        key={relCat.id}
                        to={`/categories/${relCat.slug || relCat.id}`}
                        className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-24 sm:h-32">
                          <img
                            src={relCat.image_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400'}
                            alt={relCat.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-3">
                              <h3 className="text-white font-bold text-sm sm:text-base">{relCat.name}</h3>
                              <p className="text-white/80 text-xs line-clamp-1">{relCat.items?.length || 0} items</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar - Hidden on mobile, shown on lg */}
            <div className="hidden lg:block lg:w-1/4 space-y-6">
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
              
              {/* Movement Legend */}
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-sm mb-3">Movement Legend</h2>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-muted-foreground">Rank improved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-red-600" />
                    <span className="text-muted-foreground">Rank dropped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Minus className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">No change</span>
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
