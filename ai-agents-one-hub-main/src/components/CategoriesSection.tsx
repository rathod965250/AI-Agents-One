import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
  MoreHorizontal
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

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

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

  if (isLoading) {
    return (
      <section id="categories" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Explore AI agents organised by their primary use cases and capabilities.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Explore AI agents organised by their primary use cases and capabilities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories?.map((category) => {
            const IconComponent = iconMap[category.icon_name || 'MoreHorizontal'] || MoreHorizontal;
            
            return (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.display_name}</span>
                <span className="text-xs opacity-70">({category.agent_count})</span>
              </Button>
            );
          })}
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
