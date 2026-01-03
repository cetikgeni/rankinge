import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FolderOpen, FileText, Loader2, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import CategoryManagement from '@/components/admin/CategoryManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import AdminSettings from '@/components/admin/AdminSettings';
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
    if (authLoading) return;

    if (!isAdmin) {
      toast.error('Anda tidak memiliki akses admin / You do not have admin access');
      return;
    }

    fetchStats();
  }, [authLoading, isAdmin]);

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
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-grow py-10 px-4">
          <div className="container mx-auto max-w-xl">
            <Card>
              <CardHeader>
                <CardTitle>Akses ditolak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Anda tidak memiliki akses admin / You do not have admin access.
                </p>

                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Email:</span> {user?.email ?? '-'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">User ID:</span>{' '}
                    <code className="text-xs">{user?.id ?? '-'}</code>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => user?.id && navigator.clipboard.writeText(user.id)}
                    disabled={!user?.id}
                  >
                    Salin User ID
                  </Button>
                  <Button type="button" onClick={() => navigate('/')}>Kembali ke Beranda</Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Kirim <span className="font-medium">User ID</span> di atas ke saya, lalu saya set role admin di backend.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
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
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Kategori
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>
            
            <TabsContent value="blog">
              <BlogManagement />
            </TabsContent>
            
            <TabsContent value="settings">
              <AdminSettings />
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
