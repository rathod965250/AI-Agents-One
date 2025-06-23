import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

export default function AdminAnalytics() {
  // Date range state (from react-day-picker)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const stats = useAdminStats(dateRange);

  if (stats.loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card><CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card><CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card><CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card><CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-6">Error loading analytics data.</div>;
  }

  // Prepare trends data for chart
  const chartData = (stats.trends.agents || []).map((a, i) => ({
    date: a.date,
    agents: a.count,
    users: stats.trends.users[i]?.count || 0,
    reviews: stats.trends.reviews[i]?.count || 0
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      {/* Date Range Picker */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <span className="font-medium mr-2">Date Range:</span>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="shadow border rounded-lg"
          />
        </div>
        {dateRange && dateRange.from && dateRange.to && (
          <div className="ml-4">
            <span className="text-sm text-gray-600">{dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingAgents}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Trends (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="agents" stroke="#6366f1" name="Agents" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="users" stroke="#10b981" name="Users" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="reviews" stroke="#f59e42" name="Reviews" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="h-64 overflow-auto divide-y">
              {stats.topAgents.length === 0 ? (
                <li className="text-gray-400 text-center py-8">No data</li>
              ) : (
                stats.topAgents.map(agent => (
                  <li key={agent.id} className="py-2 flex justify-between items-center">
                    <span>{agent.name}</span>
                    <span className="font-mono text-sm text-gray-600">{agent.review_count} reviews</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="h-64 overflow-auto divide-y">
              {stats.topUsers.length === 0 ? (
                <li className="text-gray-400 text-center py-8">No data</li>
              ) : (
                stats.topUsers.map(user => (
                  <li key={user.id} className="py-2 flex justify-between items-center">
                    <span>{user.username}</span>
                    <span className="font-mono text-sm text-gray-600">{user.submission_count} submissions</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="h-64 overflow-auto divide-y">
              {stats.topReviews.length === 0 ? (
                <li className="text-gray-400 text-center py-8">No data</li>
              ) : (
                stats.topReviews.map(review => (
                  <li key={review.id} className="py-2 flex flex-col gap-1">
                    <span className="font-semibold">{review.title}</span>
                    <span className="text-xs text-gray-500">Rating: {review.rating} | Helpful: {review.helpful_count}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 