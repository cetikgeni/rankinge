import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/LanguageContext';

interface BlogPost {
  id: string;
  title: string;
  title_id: string | null;
  slug: string;
  content: string;
  content_id: string | null;
  excerpt: string | null;
  excerpt_id: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  category: string | null;
}

interface RelatedCategory {
  id: string;
  name: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedCategories, setRelatedCategories] = useState<RelatedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { language, t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
        
        // Update document meta tags for SEO
        if (data.meta_title) {
          document.title = data.meta_title;
        } else {
          document.title = `${data.title} - Rankinge Blog`;
        }
        
        // Fetch related categories if category tag exists
        if (data.category) {
          const { data: cats } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', `%${data.category}%`)
            .eq('is_approved', true)
            .limit(3);
          if (cats) setRelatedCategories(cats);
        }
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [slug]);

  const getTitle = () => {
    if (!post) return '';
    if (language === 'id' && post.title_id) return post.title_id;
    return post.title;
  };

  const getContent = () => {
    if (!post) return '';
    if (language === 'id' && post.content_id) return post.content_id;
    return post.content;
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

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-bold mb-4 text-foreground">{t('blog.postNotFound')}</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering (basic)
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-foreground">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 text-foreground">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4 leading-relaxed text-foreground">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <article className="container mx-auto max-w-3xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog')}
            </Button>
          </Link>
          
          {post.cover_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.cover_image_url}
                alt={getTitle()}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
          
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{getTitle()}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {post.published_at && format(new Date(post.published_at), 'dd MMMM yyyy')}
              </span>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {renderContent(getContent())}
          </div>

          {/* Related Categories */}
          {relatedCategories.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-bold mb-4 text-foreground">{t('blog.relatedCategories')}</h3>
              <div className="flex flex-wrap gap-2">
                {relatedCategories.map(cat => (
                  <Link 
                    key={cat.id} 
                    to={`/categories/${cat.id}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      
      <footer className="py-6 px-4 bg-muted/50 border-t mt-12">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rankinge. {t('footer.rights')}
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
