import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import AdFooter from '@/components/AdFooter';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Mohon isi email dan password');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Login berhasil');
    navigate('/');
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
            <CardTitle className="text-2xl">Masuk</CardTitle>
            <CardDescription>Masuk untuk akses akun Anda</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative my-2">
              <Separator />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Setelah login, buka <span className="font-medium">/admin</span> untuk dashboard admin.
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                Daftar
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
