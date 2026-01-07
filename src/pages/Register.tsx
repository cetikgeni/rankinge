import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import AdFooter from '@/components/AdFooter';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.email.trim() || !formData.password) {
      toast.error('Mohon isi email dan password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak sama');
      return;
    }

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: formData.username.trim() ? { username: formData.username.trim() } : undefined,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Akun berhasil dibuat');
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
            <CardTitle className="text-2xl">Buat Akun</CardTitle>
            <CardDescription>Daftar dengan email dan password</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative my-2">
              <Separator />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username (opsional)
                  </label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="edardian"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="nickname"
                  />
                </div>

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
                    placeholder="Buat password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Konfirmasi Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isLoading ? 'Memproses...' : 'Buat Akun'}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                Login
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

export default Register;
