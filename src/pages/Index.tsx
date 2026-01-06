import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ThumbsUp, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { useCategories } from '@/hooks/useCategories';
import CategorySearch from '@/components/CategorySearch';
import CategoryGroup from '@/components/CategoryGroup';
import { useTranslation } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useTranslation();
  const { categories, isLoading } = useCategories(true);
  
  // Get featured categories (first 8)
  const featuredCategories = categories.slice(0, 8);
  
  // Group categories by category_group
  const categoryGroups = categories.reduce((acc, cat) => {
    const group = cat.category_group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cat);
    return acc;
  }, {} as Record<string, typeof categories>);
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/categories">{t('hero.browseCategories')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/submit">{t('hero.submitCategory')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories with images */}
      <CategoryGroup title={t('categories.featured')} categoryGroup="Technology" showImages={true} limit={4} />
      
      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{t('categories.popular')}</h2>
            <Link to="/categories" className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
              {t('categories.viewAll')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {featuredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCategories.map(category => (
                <CategoryCard 
                  key={category.id} 
                  category={{
                    id: category.id,
                    name: category.name,
                    description: category.description || '',
                    imageUrl: category.image_url || '',
                    items: category.items.map(item => ({
                      id: item.id,
                      name: item.name,
                      description: item.description || '',
                      imageUrl: item.image_url || '',
                      voteCount: item.vote_count
                    })),
                    isApproved: category.is_approved,
                    createdBy: '',
                    settings: { displayVoteAs: 'count' }
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg">
              <p className="text-muted-foreground">{t('categories.empty')}</p>
              <Button asChild className="mt-4">
                <Link to="/submit">{t('categories.createFirst')}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Category Groups from Database */}
      {Object.entries(categoryGroups).slice(0, 3).map(([groupName, groupCategories]) => (
        <CategoryGroup 
          key={groupName} 
          title={groupName} 
          categoryGroup={groupName} 
          showImages={false} 
          limit={4} 
        />
      ))}
      
      {/* Categories Search & Browse Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">{t('categories.browseAll')}</h2>
          
          {/* Search Box */}
          <div className="mb-10">
            <CategorySearch />
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(categoryGroups).map(([groupName, groupCats]) => (
                <div key={groupName} className="mb-8">
                  <h3 className="text-lg font-bold mb-4 text-foreground">
                    {groupName}
                  </h3>
                  <ul className="space-y-2">
                    {groupCats.slice(0, 6).map(cat => (
                      <li key={cat.id}>
                        <Link 
                          to={`/categories/${cat.id}`} 
                          className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                    {groupCats.length > 6 && (
                      <li className="pt-1">
                        <Link 
                          to={`/categories?group=${encodeURIComponent(groupName)}`} 
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          + {groupCats.length - 6} more
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('categories.noCategories')}</p>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-foreground mb-12 text-center">{t('howItWorks.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{t('howItWorks.vote.title')}</h3>
                <p className="text-muted-foreground">
                  {t('howItWorks.vote.desc')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{t('howItWorks.view.title')}</h3>
                <p className="text-muted-foreground">
                  {t('howItWorks.view.desc')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{t('howItWorks.submit.title')}</h3>
                <p className="text-muted-foreground">
                  {t('howItWorks.submit.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-lg mb-8 opacity-90">
            {t('cta.subtitle')}
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90">
            <Link to="/categories">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
