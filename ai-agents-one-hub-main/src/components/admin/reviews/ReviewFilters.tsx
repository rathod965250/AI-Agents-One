
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ReviewFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'pending' | 'approved' | 'rejected' | 'flagged';
  onStatusFilterChange: (value: 'all' | 'pending' | 'approved' | 'rejected' | 'flagged') => void;
  ratingFilter: 'all' | '1' | '2' | '3' | '4' | '5';
  onRatingFilterChange: (value: 'all' | '1' | '2' | '3' | '4' | '5') => void;
}

export function ReviewFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ratingFilter,
  onRatingFilterChange
}: ReviewFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search reviews by title or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
        </SelectContent>
      </Select>

      <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="1">1 Star</SelectItem>
          <SelectItem value="2">2 Stars</SelectItem>
          <SelectItem value="3">3 Stars</SelectItem>
          <SelectItem value="4">4 Stars</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
