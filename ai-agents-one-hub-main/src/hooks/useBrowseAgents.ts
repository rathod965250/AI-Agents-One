import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Agent } from "@/integrations/supabase/types";

export const useBrowseAgents = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [pricingFilter, setPricingFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategoryFilter([categoryParam]);
    }
  }, [searchParams]);

  const { data: agents, isLoading, error } = useQuery<Agent[]>({
    queryKey: ['browse-agents', searchTerm, categoryFilter, pricingFilter, ratingFilter],
    queryFn: async () => {
      let query = supabase
        .from('ai_agents')
        .select('*')
        .in('status', ['approved', 'featured']);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (categoryFilter.length > 0) {
        query = query.in('category', categoryFilter);
      }
      if (pricingFilter.length > 0) {
        query = query.in('pricing_type', pricingFilter);
      }
      if (ratingFilter > 0) {
        query = query.gte('average_rating', ratingFilter);
      }

      query = query.order('total_upvotes', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return (data as Agent[]) || [];
    }
  });

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    pricingFilter,
    setPricingFilter,
    ratingFilter,
    setRatingFilter,
    agents: agents || [],
    isLoading,
    error,
  };
};
