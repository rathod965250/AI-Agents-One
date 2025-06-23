import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DateRange } from 'react-day-picker';

interface AdminStats {
  totalAgents: number;
  pendingAgents: number;
  totalUsers: number;
  totalReviews: number;
  averageRating: number;
  recentActivity: ActivityItem[];
  trends: TrendsData;
  topAgents: TopAgent[];
  topUsers: TopUser[];
  topReviews: TopReview[];
  loading: boolean;
}

interface ActivityItem {
  id: string;
  action: string;
  resource_type: string;
  created_at: string;
  admin_id: string;
}

interface TrendsData {
  agents: { date: string; count: number }[];
  users: { date: string; count: number }[];
  reviews: { date: string; count: number }[];
}

interface TopAgent {
  id: string;
  name: string;
  review_count: number;
}

interface TopUser {
  id: string;
  username: string;
  submission_count: number;
}

interface TopReview {
  id: string;
  title: string;
  rating: number;
  helpful_count: number;
}

export const useAdminStats = (dateRange?: DateRange) => {
  const [stats, setStats] = useState<AdminStats>({
    totalAgents: 0,
    pendingAgents: 0,
    totalUsers: 0,
    totalReviews: 0,
    averageRating: 0,
    recentActivity: [],
    trends: { agents: [], users: [], reviews: [] },
    topAgents: [],
    topUsers: [],
    topReviews: [],
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Date range logic
        let since: string | undefined = undefined;
        let until: string | undefined = undefined;
        if (dateRange && dateRange.from) {
          since = dateRange.from.toISOString().split('T')[0];
        }
        if (dateRange && dateRange.to) {
          until = dateRange.to.toISOString().split('T')[0];
        }
        if (!since) {
          // Default: last 30 days
          const d = new Date();
          d.setDate(d.getDate() - 29);
          since = d.toISOString().split('T')[0];
        }

        // Get total agents
        let agentsQuery = supabase.from('ai_agents').select('*', { count: 'exact', head: true });
        if (since) agentsQuery = agentsQuery.gte('created_at', since);
        if (until) agentsQuery = agentsQuery.lte('created_at', until);
        const { count: totalAgents } = await agentsQuery;

        // Get pending agents
        let pendingQuery = supabase.from('ai_agents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        if (since) pendingQuery = pendingQuery.gte('created_at', since);
        if (until) pendingQuery = pendingQuery.lte('created_at', until);
        const { count: pendingAgents } = await pendingQuery;

        // Get total users
        let usersQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (since) usersQuery = usersQuery.gte('created_at', since);
        if (until) usersQuery = usersQuery.lte('created_at', until);
        const { count: totalUsers } = await usersQuery;

        // Get total reviews
        let reviewsQuery = supabase.from('agent_reviews').select('*', { count: 'exact', head: true });
        if (since) reviewsQuery = reviewsQuery.gte('created_at', since);
        if (until) reviewsQuery = reviewsQuery.lte('created_at', until);
        const { count: totalReviews } = await reviewsQuery;

        // Get average rating
        let avgQuery = supabase.from('agent_reviews').select('rating');
        if (since) avgQuery = avgQuery.gte('created_at', since);
        if (until) avgQuery = avgQuery.lte('created_at', until);
        const { data: avgData } = await avgQuery;
        const averageRating = avgData && avgData.length > 0
          ? avgData.reduce((sum, review) => sum + review.rating, 0) / avgData.length
          : 0;

        // Get recent admin activity (not filtered by date range)
        const { data: recentActivity } = await supabase
          .from('admin_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Trends: new agents, users, reviews per day for range
        const [agentsTrend, usersTrend, reviewsTrend] = await Promise.all([
          supabase.rpc('daily_counts', { table_name: 'ai_agents', date_column: 'created_at', since, until }),
          supabase.rpc('daily_counts', { table_name: 'profiles', date_column: 'created_at', since, until }),
          supabase.rpc('daily_counts', { table_name: 'agent_reviews', date_column: 'created_at', since, until })
        ]);

        // Top agents by review count (in range)
        let topAgentsQuery = supabase.from('ai_agents').select('id, name, agent_reviews(count)');
        if (since) topAgentsQuery = topAgentsQuery.gte('created_at', since);
        if (until) topAgentsQuery = topAgentsQuery.lte('created_at', until);
        const { data: topAgents } = await topAgentsQuery.order('agent_reviews.count', { ascending: false }).limit(5);
        const topAgentsList = (topAgents || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          review_count: a.agent_reviews?.length || 0
        }));

        // Top users by submissions (in range)
        let topUsersQuery = supabase.from('profiles').select('id, username, ai_agents(count)');
        if (since) topUsersQuery = topUsersQuery.gte('created_at', since);
        if (until) topUsersQuery = topUsersQuery.lte('created_at', until);
        const { data: topUsers } = await topUsersQuery.order('ai_agents.count', { ascending: false }).limit(5);
        const topUsersList = (topUsers || []).map((u: any) => ({
          id: u.id,
          username: u.username,
          submission_count: u.ai_agents?.length || 0
        }));

        // Top reviews by rating/helpful (in range)
        let topReviewsQuery = supabase.from('agent_reviews').select('id, title, rating, helpful_count');
        if (since) topReviewsQuery = topReviewsQuery.gte('created_at', since);
        if (until) topReviewsQuery = topReviewsQuery.lte('created_at', until);
        const { data: topReviews } = await topReviewsQuery.order('helpful_count', { ascending: false }).limit(5);
        const topReviewsList = (topReviews || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          rating: r.rating,
          helpful_count: r.helpful_count
        }));

        setStats({
          totalAgents: totalAgents || 0,
          pendingAgents: pendingAgents || 0,
          totalUsers: totalUsers || 0,
          totalReviews: totalReviews || 0,
          averageRating: Math.round(averageRating * 10) / 10,
          recentActivity: recentActivity || [],
          trends: {
            agents: agentsTrend.data || [],
            users: usersTrend.data || [],
            reviews: reviewsTrend.data || []
          },
          topAgents: topAgentsList,
          topUsers: topUsersList,
          topReviews: topReviewsList,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [dateRange]);

  return stats;
};
