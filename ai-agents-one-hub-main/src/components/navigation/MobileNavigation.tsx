import { Link } from 'react-router-dom';
import AuthButtons from './AuthButtons';
import { useCompareCount } from '@/hooks/useCompareCount';

interface MobileNavigationProps {
  isMenuOpen: boolean;
}

const MobileNavigation = ({ isMenuOpen }: MobileNavigationProps) => {
  const compareCount = useCompareCount();

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-blue-200">
        <Link to="/" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">
          Home
        </Link>
        <Link to="/browse" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">
          Browse
        </Link>
        <Link to="/categories" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">
          Categories
        </Link>
        <Link to="/guide" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">
          Guide
        </Link>
        <Link to="/submit" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">
          Submit Agent
        </Link>
        <Link to="/compare" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-1">
          Compare
          {compareCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              {compareCount}
            </span>
          )}
        </Link>
        
        <AuthButtons />
      </div>
    </div>
  );
};

export default MobileNavigation;
