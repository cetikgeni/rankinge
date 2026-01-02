import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FolderOpen, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import CategoryManagement from '@/components/admin/CategoryManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalCategories: 0,
    pendingCategories: 0,
    totalPosts: 0,
    publishedPosts: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Anda tidak memiliki akses admin / You do not have admin access');
      navigate('/');
      return;
    }

    if (isAdmin) {
      fetchStats();
    }
  }, [authLoading, isAdmin, navigate]);

  const fetchStats = async () => {
    setStatsLoading(true);
    
    // Fetch category stats
    const { data: categories } = await supabase
      .from('categories')
      .select('is_approved');
    
    // Fetch blog stats
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('is_published');

    setStats({
      totalCategories: categories?.length || 0,
      pendingCategories: categories?.filter(c => !c.is_approved).length || 0,
      totalPosts: posts?.length || 0,
      publishedPosts: posts?.filter(p => p.is_published).length || 0,
    });
    setStatsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? '-' : stats.totalCategories}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Menunggu Persetujuan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {statsLoading ? '-' : stats.pendingCategories}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Artikel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? '-' : stats.totalPosts}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Artikel Published
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statsLoading ? '-' : stats.publishedPosts}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Management Tabs */}
          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Kategori
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>
            
            <TabsContent value="blog">
              <BlogManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 px-4 bg-muted/50 border-t mt-12">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rankinge. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Admin;
