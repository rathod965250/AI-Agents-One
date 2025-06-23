import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PricingFilterProps {
  pricingFilter: string[];
  setPricingFilter: (value: string[]) => void;
}

const formatEnum = (value: string) => {
  return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const PricingFilter = ({ pricingFilter, setPricingFilter }: PricingFilterProps) => {
  const { data: pricingCounts, isLoading: pricingCountsLoading } = useQuery({
    queryKey: ['pricingCounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('pricing_type')
        .in('status', ['approved', 'featured']);

      if (error) {
        console.error('Error fetching pricing counts:', error);
        throw error;
      }

      if (!data) return {};

      return data.reduce((acc, agent) => {
        if (agent.pricing_type) {
          acc[agent.pricing_type] = (acc[agent.pricing_type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
    },
  });

  const pricingTypes = ["free", "freemium", "paid", "subscription"];

  const handlePricingChange = (pricingValue: string) => {
    const newFilter = pricingFilter.includes(pricingValue)
      ? pricingFilter.filter((p) => p !== pricingValue)
      : [...pricingFilter, pricingValue];
    setPricingFilter(newFilter);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-pricing"
            checked={pricingFilter.length === 0}
            onCheckedChange={() => setPricingFilter([])}
          />
          <label htmlFor="all-pricing" className="text-sm font-medium cursor-pointer">
            All Pricing
          </label>
        </div>
        {pricingTypes.map((pricing) => (
          <div key={pricing} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={pricing}
                checked={pricingFilter.includes(pricing)}
                onCheckedChange={() => handlePricingChange(pricing)}
              />
              <label htmlFor={pricing} className="text-sm cursor-pointer">
                {formatEnum(pricing)}
              </label>
            </div>
            <Badge variant="outline" className="text-xs">
              {pricingCountsLoading ? (
                <Skeleton className="h-4 w-8" />
              ) : (
                pricingCounts?.[pricing] || 0
              )}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PricingFilter;
