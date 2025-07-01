import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Zap, 
  BarChart3, 
  Code, 
  Palette, 
  Shield, 
  TrendingUp, 
  Wrench,
  Bot,
  User,
  DollarSign,
  Search,
  PenTool,
  Users,
  Headphones,
  Briefcase,
  GraduationCap,
  Heart,
  Gamepad2,
  Languages,
  Mic,
  Settings,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Code,
  Wrench,
  User,
  DollarSign,
  Settings,
  Search,
  BarChart3,
  TrendingUp,
  PenTool,
  Users,
  Palette,
  Headphones,
  Mic,
  Briefcase,
  GraduationCap,
  Heart,
  Gamepad2,
  Languages,
  MessageCircle,
  Zap,
  MoreHorizontal
};

const CategoriesSection = () => {
  const navigate = useNavigate();

  // Define popular categories with icons and counts (these will be fetched from the Categories page)
  const popularCategories = [
    { name: 'productivity', displayName: 'Productivity', icon: Zap, count: 150 },
    { name: 'creative', displayName: 'Creative', icon: Palette, count: 120 },
    { name: 'development', displayName: 'Development', icon: Code, count: 95 },
    { name: 'business', displayName: 'Business', icon: BarChart3, count: 85 },
    { name: 'education', displayName: 'Education', icon: GraduationCap, count: 65 },
    { name: 'healthcare', displayName: 'Healthcare', icon: Heart, count: 45 }
  ];

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to browse page with category filter
    navigate(`/browse?category=${encodeURIComponent(categoryName)}`);
  };

  const handleExploreClick = () => {
    navigate('/browse');
  };

  const handleSubmitClick = () => {
    navigate('/submit');
  };

  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Explore AI agents organised by their primary use cases and capabilities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {popularCategories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Button
                key={category.name}
                variant="outline"
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.displayName}</span>
                <span className="text-xs opacity-70">({category.count})</span>
              </Button>
            );
          })}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center mb-16">
          <Link 
            to="/categories"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">
              Ready to join the AI revolution?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover, evaluate, and integrate the best AI agents into your workflow. 
              Start exploring our comprehensive directory today and find the perfect AI solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleExploreClick}
                className="gradient-bg text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Explore AI Agents
              </button>
              <button 
                onClick={handleSubmitClick}
                className="border border-primary/30 px-8 py-3 rounded-lg font-medium hover:border-primary hover:bg-primary/10 transition-colors"
              >
                Submit Your Agent
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Join thousands of developers and businesses already using our platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
