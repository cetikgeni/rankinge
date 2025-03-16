
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, LogIn, Google } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { login } from '@/lib/data';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    // Attempt login
    const user = login(formData.username, formData.password);
    
    if (user) {
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/');
    } else {
      toast.error('Invalid credentials. Try "admin" with any password for demo.');
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google login with delay
    setTimeout(() => {
      const user = login('google_user', 'google_pass');
      
      if (user) {
        toast.success(`Welcome, ${user.username}!`);
        navigate('/');
      } else {
        toast.error('Google login failed. Try regular login for demo.');
        setIsLoading(false);
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <BarChart className="h-8 w-8 text-brand-purple" />
            </div>
            <CardTitle className="text-2xl">Log in to Rankinge</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Google className="h-4 w-4" />
              Continue with Google
            </Button>
            
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link 
                      to="#" 
                      className="text-xs text-brand-purple hover:text-brand-purple/80"
                      onClick={(e) => {
                        e.preventDefault();
                        toast('For the demo, use any username with any password. Try "admin"!');
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-brand-purple hover:bg-brand-purple/90"
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                
                <div className="text-sm text-center text-gray-500">
                  For demo purposes, try username <span className="font-medium text-gray-700">"admin"</span> with any password
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-purple hover:text-brand-purple/80 font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="py-6 px-4 border-t">
        <div className="container mx-auto max-w-7xl">
          <AdFooter />
        </div>
      </footer>
    </div>
  );
};

export default Login;
