// NOTE: If you see a type error for Fuse, run: npm install fuse.js @types/fuse.js
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, ArrowRight, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import AdvancedSEO from '@/components/seo/AdvancedSEO';

interface Category {
  id: string;
  name: string;
  slug: string;
  display_name: string;
  description: string;
  icon_name?: string;
  color?: string;
  agent_count?: number;
  is_active?: boolean;
}

// Icon mapping for dynamic category icons
import {
  Bot, Code, Wrench, User, DollarSign, Settings, Search as SearchIcon, BarChart3, TrendingUp, PenTool, Users as UsersIcon, Palette, Headphones, Mic, Briefcase, GraduationCap, Heart, Gamepad2, Languages, MessageCircle, Zap, MoreHorizontal, Camera, Music, Globe, Shield, BookOpen, Star, Target, Brain
} from 'lucide-react';
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot, Code, Wrench, User, DollarSign, Settings, Search: SearchIcon, BarChart3, TrendingUp, PenTool, Users: UsersIcon, Palette, Headphones, Mic, Briefcase, GraduationCap, Heart, Gamepad2, Languages, MessageCircle, Zap, MoreHorizontal, Camera, Music, Globe, Shield, BookOpen, Star, Target, Brain
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [suggestions, setSuggestions] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  // Fuzzy search setup
  const fuse = useMemo(() => new Fuse(categories, {
    keys: ['display_name', 'name', 'slug', 'description'],
    threshold: 0.4,
    includeScore: true,
  }), [categories]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const results = fuse.search(searchQuery.trim());
    // If exact match or close, show those; if typo, show suggestions
    if (results.length > 0) {
      setSuggestions([]);
      return results.map(r => r.item);
    } else {
      // Show top 3 closest matches as suggestions
      const suggestionResults = fuse.search(searchQuery.trim(), { limit: 3 });
      setSuggestions(suggestionResults.map(r => r.item));
      return [];
    }
  }, [searchQuery, categories, fuse]);

  // Popular categories: top 4 by agent_count
  const popularCategories = useMemo(() => {
    return [...categories]
      .filter(cat => cat.agent_count && cat.agent_count > 0)
      .sort((a, b) => (b.agent_count || 0) - (a.agent_count || 0))
      .slice(0, 4);
  }, [categories]);

  // SEO structured data for categories page
  const categoriesStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI Agent Categories - Browse by Type | AI Hub",
    "description": "Explore AI agents organized by category. Find productivity tools, creative assistants, development helpers, and more specialized AI solutions.",
    "url": "https://ai-agents-hub.com/categories",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": categories.map((cat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": cat.display_name,
          "description": cat.description
        }
      }))
    }
  };

  if (loading) {
    return (
      <>
        <EnhancedMetaTags
          title="Loading Categories - AI Hub"
          description="Loading AI agent categories..."
          keywords="AI agent categories, loading"
          canonicalUrl="https://ai-agents-hub.com/categories"
          ogType="website"
          noIndex={true}
        />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <EnhancedMetaTags
        title="AI Agent Categories - Browse by Type | AI Hub"
        description="Explore AI agents organized by category. Find productivity tools, creative assistants, development helpers, and more specialized AI solutions."
        keywords="AI agent categories, productivity AI, creative AI, development AI, business AI, education AI, healthcare AI, finance AI, marketing AI, research AI, specialized AI"
        canonicalUrl="https://ai-agents-hub.com/categories"
        ogType="website"
      />
      <AdvancedSEO
        type="categories"
        data={categories}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              AI Agent Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover AI agents organized by their purpose and functionality. 
              Find the perfect tool for your specific needs.
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 py-4 text-lg rounded-full shadow-md border border-gray-200 bg-white"
                autoFocus
              />
            </div>
          </div>

          {/* Suggestions for typos */}
          {suggestions.length > 0 && (
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">Did you mean:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <Button key={s.id} variant="outline" onClick={() => setSearchQuery(s.display_name)}>
                    {s.display_name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Categories Section */}
          {popularCategories.length > 0 && !searchQuery && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
              </div>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularCategories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Categories Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories ({filteredCategories.length})</h2>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

interface CategoryCardProps {
  category: Category;
  viewMode: 'grid' | 'list';
}

const CategoryCard = ({ category, viewMode }: CategoryCardProps) => {
  const IconComponent = iconMap[category.icon_name || 'MoreHorizontal'] || MoreHorizontal;
  const cardLink = `/categories/${category.slug}`;
  if (viewMode === 'list') {
    return (
      <Link to={cardLink} className="block group">
        <Card className="hover:shadow-lg transition-shadow duration-200 group-hover:ring-2 group-hover:ring-blue-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${category.color || 'bg-slate-500'} text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.display_name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {category.agent_count || 0} agents
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={cardLink} className="block group">
      <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group-hover:ring-2 group-hover:ring-blue-400">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-3 rounded-lg ${category.color || 'bg-slate-500'} text-white`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-lg">{category.display_name}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {category.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {category.agent_count || 0} agents
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Categories; 