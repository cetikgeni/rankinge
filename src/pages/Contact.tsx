import { useEffect, useState } from 'react';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Contact = () => {
  const { language, t } = useTranslation();
  const [content, setContent] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', 'contact')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error(language === 'id' ? 'Semua field wajib diisi' : 'All fields are required');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(language === 'id' ? 'Gagal mengirim pesan' : 'Failed to send message');
    } else {
      setIsSubmitted(true);
      toast.success(language === 'id' ? 'Pesan terkirim!' : 'Message sent!');
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content?.content || '') }} />
          </article>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Formulir Kontak' : 'Contact Form'}</CardTitle>
              <CardDescription>
                {language === 'id' 
                  ? 'Isi formulir di bawah dan kami akan merespons sesegera mungkin.' 
                  : 'Fill out the form below and we will respond as soon as possible.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'id' ? 'Terima Kasih!' : 'Thank You!'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'id' 
                      ? 'Pesan Anda telah diterima. Kami akan segera menghubungi Anda.' 
                      : 'Your message has been received. We will contact you soon.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{language === 'id' ? 'Nama' : 'Name'}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'id' ? 'Nama Anda' : 'Your name'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{language === 'id' ? 'Pesan' : 'Message'}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'id' ? 'Tulis pesan Anda...' : 'Write your message...'}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {language === 'id' ? 'Kirim Pesan' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
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

export default Contact;
