
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BrowsePageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const BrowsePageHeader = ({ searchTerm, setSearchTerm }: BrowsePageHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Browse AI Agents
      </h1>
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
        />
      </div>
    </div>
  );
};

export default BrowsePageHeader;
