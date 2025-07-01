import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import { Card } from '@/components/ui/card';
import AgentCard from '@/components/AgentCard';
import { Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  display_name: string;
  description: string;
  icon_name?: string;
  color?: string;
}

export default function CategoryAgents() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndAgents(slug);
    }
  }, [slug]);

  async function fetchCategoryAndAgents(slug: string) {
    setLoading(true);
    // Fetch category info
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    setCategory(catData);
    // Fetch agents in this category
    const { data: agentData } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('category', catData?.name)
      .in('status', ['approved', 'featured'])
      .order('status', { ascending: false }) // featured first
      .order('created_at', { ascending: false });
    setAgents(agentData || []);
    setLoading(false);
  }

  return (
    <>
      <EnhancedMetaTags
        title={category ? `AI Agents in ${category.display_name}` : 'Category'}
        description={category?.description || ''}
        keywords={category ? `${category.display_name}, AI agents, ${category.name}` : 'AI agents, category'}
        canonicalUrl={`https://ai-agents-hub.com/categories/${slug}`}
        ogType="website"
      />
      <AdvancedSEO
        type="category"
        data={category}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <Link to="/categories" className="hover:underline">Categories</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">{category?.display_name || slug}</span>
          </nav>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Agents in {category?.display_name || slug}
            </h1>
            {category?.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            )}
          </div>
          {/* Agents Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found in this category yet.</h3>
              <p className="text-gray-600">Check back soon or explore other categories.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
} 