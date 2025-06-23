
import { TrendingUp } from 'lucide-react';

interface HeroBadgeProps {
  agentCount: string;
}

const HeroBadge = ({ agentCount }: HeroBadgeProps) => {
  return (
    <div className="mb-6 animate-fade-in">
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 shadow-sm">
        <TrendingUp className="h-4 w-4" />
        🚀 {agentCount}+ AI tools available
      </span>
    </div>
  );
};

export default HeroBadge;
