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
  FileText
} from 'lucide-react';
import { useAuth, signOut } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isHomePage = location.pathname === '/';
  const isAltHomePage = location.pathname === '/';

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-10">
      <div className="container px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BarChart className="h-6 w-6 text-brand-green" />
          <span className="text-xl font-bold bg-gradient-to-r from-brand-green to-brand-darkgreen bg-clip-text text-transparent">
            Rankinge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link to="/categories" className="text-gray-700 hover:text-brand-green transition-colors">
            Categories
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-brand-green transition-colors flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Blog
          </Link>
          <Link to="/submit" className="text-gray-700 hover:text-brand-green transition-colors">
            Submit
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className="text-gray-700 hover:text-brand-green transition-colors">
              Admin
            </Link>
          )}

          {/* Home version switcher */}
          {isHomePage ? (
            <Link 
              to="/alt" 
              className="text-gray-700 hover:text-brand-green transition-colors flex items-center gap-1"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Alt Home</span>
            </Link>
          ) : isAltHomePage ? (
            <Link 
              to="/" 
              className="text-gray-700 hover:text-brand-green transition-colors flex items-center gap-1"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Classic Home</span>
            </Link>
          ) : null}

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-gray-700 hover:text-red-600" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              <Button asChild variant="default" size="sm" className="bg-brand-green hover:bg-brand-green/90">
                <Link to="/register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
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
        <div className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-20 py-2">
          <div className="container px-4 mx-auto flex flex-col space-y-3">
            <Link 
              to="/categories" 
              className="text-gray-700 py-2 hover:text-brand-green"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 py-2 hover:text-brand-green flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Blog
            </Link>
            <Link 
              to="/submit" 
              className="text-gray-700 py-2 hover:text-brand-green"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-gray-700 py-2 hover:text-brand-green"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Home version switcher for mobile */}
            {isHomePage ? (
              <Link 
                to="/alt" 
                className="text-gray-700 py-2 hover:text-brand-green flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                <span>Alt Home</span>
              </Link>
            ) : isAltHomePage ? (
              <Link 
                to="/" 
                className="text-gray-700 py-2 hover:text-brand-green flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                <span>Classic Home</span>
              </Link>
            ) : null}

            <hr className="border-gray-200" />

            {user ? (
              <>
                <div className="flex items-center py-2">
                  <User className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{user.email?.split('@')[0]}</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="justify-start px-0 text-gray-700 hover:text-red-600" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="ghost" 
                  className="justify-start px-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login" className="text-gray-700">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="default"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Register</span>
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
