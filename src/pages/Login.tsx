
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, LogIn, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { login } from '@/lib/data';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import AdFooter from '@/components/AdFooter';

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
    
    // Mock Google login without the delay - fix for simulated Google login
    const user = login('demo_user', 'demo_password');
      
    if (user) {
      toast.success(`Welcome, ${user.username}!`);
      navigate('/');
    } else {
      toast.error('For demo purposes, please use the regular login form with username "admin".');
      setIsLoading(false);
    }
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="mr-1">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
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
