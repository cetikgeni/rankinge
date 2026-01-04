import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/LanguageContext';

interface BlogPost {
  id: string;
  title: string;
  title_id: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_id: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, title_id, slug, excerpt, excerpt_id, cover_image_url, published_at, meta_title, meta_description')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  const getTitle = (post: BlogPost) => {
    if (language === 'id' && post.title_id) return post.title_id;
    return post.title;
  };

  const getExcerpt = (post: BlogPost) => {
    if (language === 'id' && post.excerpt_id) return post.excerpt_id;
    return post.excerpt;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{t('blog.title')}</h1>
            <p className="text-muted-foreground text-lg">
              {t('blog.subtitle')}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-medium text-muted-foreground mb-2">
                  {t('blog.noPosts')}
                </h3>
                <p className="text-muted-foreground">
                  {t('blog.comingSoon')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {post.cover_image_url && (
                        <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                          <img
                            src={post.cover_image_url}
                            alt={getTitle(post)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <CardHeader>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
                            {getTitle(post)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {getExcerpt(post) && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {getExcerpt(post)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {post.published_at && format(new Date(post.published_at), 'dd MMMM yyyy')}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 px-4 bg-muted/50 border-t">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rankinge. {t('footer.rights')}
        </div>
      </footer>
    </div>
  );
};

export default Blog;
