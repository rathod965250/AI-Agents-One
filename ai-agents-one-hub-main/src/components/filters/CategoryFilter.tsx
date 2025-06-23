import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/integrations/supabase/types';

interface CategoryFilterProps {
  categoryFilter: string[];
  setCategoryFilter: (value: string[]) => void;
}

const CategoryFilter = ({ categoryFilter, setCategoryFilter }: CategoryFilterProps) => {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: categoryCounts, isLoading: categoryCountsLoading } = useQuery({
    queryKey: ['categoryCounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('category')
        .in('status', ['approved', 'featured']);

      if (error) {
        console.error('Error fetching category counts:', error);
        throw error;
      }

      if (!data) return {};

      return data.reduce((acc, agent) => {
        if (agent.category) {
          acc[agent.category] = (acc[agent.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
    },
  });

  const handleCategoryChange = (categoryName: string) => {
    const newFilter = categoryFilter.includes(categoryName)
      ? categoryFilter.filter((c) => c !== categoryName)
      : [...categoryFilter, categoryName];
    setCategoryFilter(newFilter);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-categories"
            checked={categoryFilter.length === 0}
            onCheckedChange={() => setCategoryFilter([])}
          />
          <label htmlFor="all-categories" className="text-sm font-medium cursor-pointer">
            All Categories
          </label>
        </div>
        
        {categoriesLoading || categoryCountsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-8" />
            </div>
          ))
        ) : (
          categories?.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.name}
                  checked={categoryFilter.includes(category.name)}
                  onCheckedChange={() => handleCategoryChange(category.name)}
                />
                <label htmlFor={category.name} className="text-sm cursor-pointer">
                  {category.display_name}
                </label>
              </div>
              <Badge variant="outline" className="text-xs">
                {categoryCounts?.[category.name] || 0}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryFilter;
