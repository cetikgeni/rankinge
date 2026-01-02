
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SubmitCategoryForm from '@/components/SubmitCategoryForm';
import { useAuth } from '@/hooks/useAuth';
import SidebarAd from '@/components/SidebarAd';
import AdFooter from '@/components/AdFooter';

const Submit = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('You must be logged in to submit a new category');
      navigate('/login');
    }
  }, [isLoading, user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold mb-2">Submit a New Category</h1>
              <p className="text-gray-600 mb-8">
                Create a new category that users can vote on. All submissions are reviewed by admins before being published.
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <SubmitCategoryForm />
              </div>
            </div>
            
            {/* Sidebar with Ads */}
            <div className="md:w-1/4 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-bold text-lg mb-4">Tips for Great Categories</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-bold text-brand-purple">•</span>
                    <span>Be specific with your category name</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-brand-purple">•</span>
                    <span>Include at least 5 items for better rankings</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-brand-purple">•</span>
                    <span>Write detailed descriptions for each item</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-brand-purple">•</span>
                    <span>Add product links to make it easier for users</span>
                  </li>
                </ul>
              </div>
              
              <SidebarAd 
                title="Upgrade to Rankinge Pro"
                description="Create unlimited categories and get verified status"
                imageUrl="https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=600&auto=format&fit=crop"
                targetUrl="https://example.com/pro"
              />
              
              <SidebarAd 
                title="Join Our Discord"
                description="Connect with other category creators"
                imageUrl="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&auto=format&fit=crop"
                targetUrl="https://example.com/discord"
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-4 bg-white border-t">
        <div className="container mx-auto max-w-7xl">
          <AdFooter />
        </div>
      </footer>
    </div>
  );
};

export default Submit;
