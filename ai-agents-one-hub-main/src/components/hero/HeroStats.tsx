
interface HeroStatsProps {
  agentCount: string;
  categoryCount: string;
}

const HeroStats = ({ agentCount, categoryCount }: HeroStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in delay-600 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{agentCount}+</div>
        <div className="text-gray-700 font-medium">AI Tools</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{categoryCount}+</div>
        <div className="text-gray-700 font-medium">Categories</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">24/7</div>
        <div className="text-gray-700 font-medium">Updated</div>
      </div>
    </div>
  );
};

export default HeroStats;
