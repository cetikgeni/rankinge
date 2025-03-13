
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Shield, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { 
  currentUser, 
  getPendingCategories, 
  getApprovedCategories,
  approveCategory,
  rejectCategory
} from '@/lib/data';
import { Category } from '@/lib/types';

const Admin = () => {
  const navigate = useNavigate();
  const [pendingCategories, setPendingCategories] = useState<Category[]>([]);
  const [approvedCategories, setApprovedCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    if (!currentUser?.isAdmin) {
      toast.error('You do not have admin permissions');
      navigate('/');
      return;
    }
    
    // Fetch categories
    setPendingCategories(getPendingCategories());
    setApprovedCategories(getApprovedCategories());
  }, [navigate]);
  
  const handleApprove = (categoryId: string) => {
    if (approveCategory(categoryId)) {
      toast.success('Category approved successfully');
      // Update state
      setPendingCategories(getPendingCategories());
      setApprovedCategories(getApprovedCategories());
    } else {
      toast.error('Failed to approve category');
    }
  };
  
  const handleReject = (categoryId: string) => {
    if (rejectCategory(categoryId)) {
      toast.success('Category rejected');
      // Update state
      setPendingCategories(getPendingCategories());
    } else {
      toast.error('Failed to reject category');
    }
  };
  
  if (!currentUser?.isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-6 w-6 text-brand-purple" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-purple">
                  {pendingCategories.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Approved Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {approvedCategories.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {approvedCategories.reduce((acc, category) => acc + category.items.length, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Pending Approvals</h2>
          
          {pendingCategories.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600">No pending categories to review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{category.name}</CardTitle>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Items ({category.items.length})</h4>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.id} className="text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-600"> - {item.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleReject(category.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"  
                      onClick={() => handleApprove(category.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 px-4 bg-gray-50 border-t mt-12">
        <div className="container mx-auto max-w-6xl text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Categlorium. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Admin;
