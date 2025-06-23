
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminStats } from '@/hooks/useAdminStats';
import { 
  Users, 
  Database, 
  Star, 
  TrendingUp, 
  Clock, 
  Plus,
  Eye,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function DashboardOverview() {
  const stats = useAdminStats();

  const metricCards = [
    {
      title: 'Total Agents',
      value: stats.totalAgents,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All registered agents'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingAgents,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Awaiting approval'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Registered users'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: `Avg: ${stats.averageRating}/5`
    }
  ];

  const quickActions = [
    {
      title: 'Approve Agents',
      description: 'Review pending submissions',
      icon: CheckCircle,
      href: '/admin/agents?status=pending',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Add Category',
      description: 'Create new category',
      icon: Plus,
      href: '/admin/categories',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Analytics',
      description: 'Detailed platform stats',
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Audit Logs',
      description: 'Review admin activity',
      icon: Eye,
      href: '/admin/audit',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <Link to={action.href}>
                  <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p>
              ) : (
                stats.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">
                        {activity.action.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.resource_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
            {stats.recentActivity.length > 5 && (
              <div className="mt-4 pt-4 border-t">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/admin/audit">View All Activity</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
