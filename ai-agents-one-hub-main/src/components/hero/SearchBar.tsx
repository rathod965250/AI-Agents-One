
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  agentCount: string;
}

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onKeyDown, 
  isSearching, 
  agentCount 
}: SearchBarProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-6 animate-fade-in delay-400">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
        <div className="relative bg-white rounded-2xl shadow-xl border border-blue-200 p-2">
          <div className="flex items-center">
            <div className="flex items-center flex-1">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                type="text"
                placeholder={`Search ${agentCount}+ AI tools...`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-14 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent placeholder:text-gray-400"
                onKeyDown={onKeyDown}
              />
            </div>
            <Button
              onClick={onSearch}
              disabled={isSearching}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Search
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <SearchSuggestions onSuggestionClick={onSearchChange} />
    </div>
  );
};

export default SearchBar;
