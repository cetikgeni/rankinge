
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import SubmitCategoryForm from '@/components/SubmitCategoryForm';
import { currentUser } from '@/lib/data';

const Submit = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      toast.error('You must be logged in to submit a new category');
      navigate('/login');
    }
  }, [navigate]);
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Submit a New Category</h1>
          <p className="text-gray-600 mb-8">
            Create a new category that users can vote on. All submissions are reviewed by admins before being published.
          </p>
          
          <SubmitCategoryForm />
        </div>
      </main>
      
      <footer className="py-6 px-4 bg-gray-50 border-t mt-12">
        <div className="container mx-auto max-w-3xl text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Categlorium. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Submit;
