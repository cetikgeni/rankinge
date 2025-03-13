
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  AlignJustify, 
  BarChart, 
  LogIn, 
  LogOut, 
  Plus, 
  UserPlus, 
  User,
  X
} from 'lucide-react';
import { currentUser, logout } from '@/lib/data';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    // Force a page refresh to update auth state
    window.location.reload();
  };

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-10">
      <div className="container px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <BarChart className="h-6 w-6 text-brand-purple" />
          <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-teal bg-clip-text text-transparent">
            Categlorium
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link to="/categories" className="text-gray-700 hover:text-brand-purple transition-colors">
            Categories
          </Link>
          <Link to="/submit" className="text-gray-700 hover:text-brand-purple transition-colors">
            Submit
          </Link>
          
          {currentUser?.isAdmin && (
            <Link to="/admin" className="text-gray-700 hover:text-brand-purple transition-colors">
              Admin
            </Link>
          )}

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{currentUser.username}</span>
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
              <Button asChild variant="default" size="sm">
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
              className="text-gray-700 py-2 hover:text-brand-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/submit" 
              className="text-gray-700 py-2 hover:text-brand-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit
            </Link>
            
            {currentUser?.isAdmin && (
              <Link 
                to="/admin" 
                className="text-gray-700 py-2 hover:text-brand-purple"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            <hr className="border-gray-200" />

            {currentUser ? (
              <>
                <div className="flex items-center py-2">
                  <User className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{currentUser.username}</span>
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
