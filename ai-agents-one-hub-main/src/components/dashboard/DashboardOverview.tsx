import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Star, Heart, Eye, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SubmissionActivity {
  type: 'submission';
  title: string;
  status?: string;
  date: string;
}

interface ReviewActivity {
  type: 'review';
  title: string;
  rating?: number;
  date: string;
}

type Activity = SubmissionActivity | ReviewActivity;

const DashboardOverview = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [submissionsResult, reviewsResult, favoritesResult] = await Promise.all([
        supabase
          .from('ai_agents')
          .select('id, status, view_count, click_count')
          .eq('submitted_by', user.id),
        supabase
          .from('agent_reviews')
          .select('id, rating, helpful_count')
          .eq('user_id', user.id),
        supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', user.id)
      ]);

      const submissions = submissionsResult.data || [];
      const reviews = reviewsResult.data || [];
      const favorites = favoritesResult.data || [];

      const totalViews = submissions.reduce((sum, agent) => sum + (agent.view_count || 0), 0);
      const totalClicks = submissions.reduce((sum, agent) => sum + (agent.click_count || 0), 0);
      const totalHelpfulVotes = reviews.reduce((sum, review) => sum + (review.helpful_count || 0), 0);

      return {
        submissions: {
          total: submissions.length,
          pending: submissions.filter(a => a.status === 'pending').length,
          approved: submissions.filter(a => a.status === 'approved').length,
          featured: submissions.filter(a => a.status === 'featured').length,
          rejected: submissions.filter(a => a.status === 'rejected').length,
          totalViews,
          totalClicks
        },
        reviews: {
          total: reviews.length,
          averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
          totalHelpfulVotes
        },
        favorites: favorites.length
      };
    },
    enabled: !!user
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const [recentSubmissions, recentReviews] = await Promise.all([
        supabase
          .from('ai_agents')
          .select('id, name, status, created_at')
          .eq('submitted_by', user.id)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('agent_reviews')
          .select('id, title, rating, created_at, agent_id, ai_agents(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      const activities: Activity[] = [
        ...(recentSubmissions.data || []).map(item => ({
          type: 'submission' as const,
          title: `Submitted "${item.name}"`,
          status: item.status,
          date: item.created_at
        })),
        ...(recentReviews.data || []).map(item => ({
          type: 'review' as const,
          title: `Reviewed "${(item as { ai_agents?: { name: string } }).ai_agents?.name || 'Unknown Agent'}"`,
          rating: item.rating,
          date: item.created_at
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      return activities;
    },
    enabled: !!user
  });

  if (!stats) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'featured': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                {stats.submissions.approved} approved
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                {stats.submissions.pending} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Written</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews.total}</div>
            <p className="text-xs text-muted-foreground">
              Avg rating: {stats.reviews.averageRating.toFixed(1)} stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favorites}</div>
            <p className="text-xs text-muted-foreground">
              Bookmarked agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.submissions.totalClicks} clicks
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest submissions and reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.type === 'submission' ? (
                      <FileText className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Star className="h-4 w-4 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    {activity.type === 'submission' && activity.status && (
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    )}
                    {activity.type === 'review' && activity.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{activity.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
