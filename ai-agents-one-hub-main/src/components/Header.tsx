
import { useState } from 'react';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                AI Agents Directory
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
            >
              Browse
            </Link>
            <a 
              href="#categories" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
            >
              Categories
            </a>
            <a 
              href="#" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
            >
              Submit Agent
            </a>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  Welcome back!
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-blue-600"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <AuthModal>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </AuthModal>
                <AuthModal>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </AuthModal>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-blue-200 bg-white/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <a
              href="#categories"
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </a>
            <a
              href="#"
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit Agent
            </a>
            
            {/* Mobile Auth */}
            <div className="px-3 py-2 space-y-3 border-t border-blue-200 mt-3 pt-3">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    Welcome back!
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-blue-600" 
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <AuthModal>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </AuthModal>
                  <AuthModal>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </AuthModal>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
