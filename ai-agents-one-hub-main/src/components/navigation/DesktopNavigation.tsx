import { Link } from 'react-router-dom';
import { useCompareCount } from '@/hooks/useCompareCount';

const DesktopNavigation = () => {
  const compareCount = useCompareCount();

  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Home
        </Link>
        <Link to="/browse" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Browse
        </Link>
        <Link to="/categories" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Categories
        </Link>
        <Link to="/guide" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Guide
        </Link>
        <Link to="/submit" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Submit Agent
        </Link>
        <Link to="/compare" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
          Compare
          {compareCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              {compareCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default DesktopNavigation;
