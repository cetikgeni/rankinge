import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  AlignJustify, 
  BarChart, 
  LogIn, 
  LogOut, 
  UserPlus, 
  User,
  X,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Send,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth, signOut } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isHomePage = location.pathname === '/';
  const isAltHomePage = location.pathname === '/alt';

  return (
    <nav className="bg-background py-4 shadow-sm sticky top-0 z-10 border-b border-border">
      <div className="container px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BarChart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Rankinge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link to="/categories" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5">
            <FolderOpen className="h-4 w-4" />
            {t('nav.categories')}
          </Link>
          <Link to="/blog" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {t('nav.blog')}
          </Link>
          <Link to="/submit" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5">
            <Send className="h-4 w-4" />
            {t('nav.submit')}
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              {t('nav.admin')}
            </Link>
          )}

          {/* Home version switcher */}
          {isHomePage && (
            <Link 
              to="/alt" 
              className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Alt Home</span>
            </Link>
          )}
          {isAltHomePage && (
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Classic Home</span>
            </Link>
          )}

          <div className="w-px h-6 bg-border mx-2" />

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/80 hover:text-primary"
            title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-foreground">
                <span className="font-medium">{user.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-foreground/80 hover:text-destructive" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>{t('nav.login')}</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>{t('nav.register')}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-foreground focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <AlignJustify className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background shadow-lg absolute top-16 inset-x-0 z-20 py-2 border-b border-border">
          <div className="container px-4 mx-auto flex flex-col space-y-3">
            <Link 
              to="/categories" 
              className="text-foreground/80 py-2 hover:text-primary flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FolderOpen className="h-4 w-4" />
              {t('nav.categories')}
            </Link>
            <Link 
              to="/blog" 
              className="text-foreground/80 py-2 hover:text-primary flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              {t('nav.blog')}
            </Link>
            <Link 
              to="/submit" 
              className="text-foreground/80 py-2 hover:text-primary flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Send className="h-4 w-4" />
              {t('nav.submit')}
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-foreground/80 py-2 hover:text-primary flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                {t('nav.admin')}
              </Link>
            )}

            {/* Home version switcher for mobile */}
            {isHomePage && (
              <Link 
                to="/alt" 
                className="text-foreground/80 py-2 hover:text-primary flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Alt Home</span>
              </Link>
            )}
            {isAltHomePage && (
              <Link 
                to="/" 
                className="text-foreground/80 py-2 hover:text-primary flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Classic Home</span>
              </Link>
            )}

            <hr className="border-border" />

            {/* Language switcher for mobile */}
            <div className="py-2">
              <LanguageSwitcher />
            </div>

            {/* Dark mode toggle for mobile */}
            <Button
              variant="ghost"
              className="justify-start px-0 text-foreground/80 hover:text-primary"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              <span>{theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}</span>
            </Button>

            {user ? (
              <>
                <div className="flex items-center py-2">
                  <User className="h-4 w-4 mr-2 text-foreground" />
                  <span className="text-sm font-medium text-foreground">{user.email?.split('@')[0]}</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="justify-start px-0 text-foreground/80 hover:text-destructive" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t('nav.logout')}</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="outline" 
                  className="justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span>{t('nav.login')}</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>{t('nav.register')}</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
