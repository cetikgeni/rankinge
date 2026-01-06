import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/LanguageContext';

const FAQ = () => {
  const { language } = useTranslation();
  const [content, setContent] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', 'faq')
        .single();

      if (!error && data) {
        setContent({
          title: language === 'id' && data.title_id ? data.title_id : data.title,
          content: language === 'id' && data.content_id ? data.content_id : data.content,
        });
      }
      setIsLoading(false);
    };

    fetchPage();
  }, [language]);

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
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content?.content || '') }} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function formatMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br />');
}

export default FAQ;
