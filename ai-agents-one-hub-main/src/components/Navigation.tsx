
import { useState } from 'react';
import Logo from './navigation/Logo';
import DesktopNavigation from './navigation/DesktopNavigation';
import AuthButtons from './navigation/AuthButtons';
import MobileMenuButton from './navigation/MobileMenuButton';
import MobileNavigation from './navigation/MobileNavigation';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Desktop Auth Buttons */}
          <AuthButtons />

          {/* Mobile menu button */}
          <MobileMenuButton 
            isMenuOpen={isMenuOpen} 
            onToggle={() => setIsMenuOpen(!isMenuOpen)} 
          />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileNavigation isMenuOpen={isMenuOpen} />
    </nav>
  );
};

export default Navigation;
