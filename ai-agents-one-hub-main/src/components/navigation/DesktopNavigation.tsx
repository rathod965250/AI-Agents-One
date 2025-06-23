
import { Link } from 'react-router-dom';

const DesktopNavigation = () => {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Home
        </Link>
        <Link to="/browse" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Browse
        </Link>
        <Link to="/guide" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Guide
        </Link>
        <Link to="/submit" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Submit Agent
        </Link>
      </div>
    </div>
  );
};

export default DesktopNavigation;
