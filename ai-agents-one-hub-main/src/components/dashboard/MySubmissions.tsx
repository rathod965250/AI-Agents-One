import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, RefreshCw } from 'lucide-react';
import type { Submission, Agent } from '@/integrations/supabase/types';

type FilterType = 'all' | 'draft' | 'pending' | 'approved' | 'rejected';

const MySubmissions = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');
  const [agentAnalytics, setAgentAnalytics] = useState<Record<string, Partial<Agent>>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['user-submissions', user?.id, filter],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('agent_submissions')
        .select('id, name, tagline, is_draft, status')
        .eq('user_id', user.id);

      if (filter === 'draft') {
        query = query.eq('is_draft', true);
      } else if (filter !== 'all') {
        query = query.eq('status', filter).eq('is_draft', false);
      }
      
      const { data, error } = await query.order('submitted_at', { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
    enabled: !!user
  });

  const submissions = data ?? [];

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !submissions) return;
      const approvedIds = submissions.filter(s => s.status === 'approved' || s.status === 'featured').map(s => s.id);
      if (approvedIds.length === 0) return;
      const { data, error } = await supabase
        .from('ai_agents')
        .select('id, view_count, total_upvotes, total_reviews, average_rating')
        .in('id', approvedIds);
      if (!error && data) {
        const analyticsMap: Record<string, Partial<Agent>> = {};
        data.forEach((a: Partial<Agent>) => { analyticsMap[a.id!] = a; });
        setAgentAnalytics(analyticsMap);
      }
    };
    fetchAnalytics();
  }, [user, submissions]);

  const getStatusColor = (submission: Submission) => {
    if (submission.is_draft) return 'bg-gray-100 text-gray-800';
    switch (submission.status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'featured': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (submission: Submission) => {
    // TODO: Implement edit functionality
    console.log('Edit submission:', submission.id);
  };

  const handleResubmit = (submission: Submission) => {
    // TODO: Implement resubmit functionality
    console.log('Resubmit submission:', submission.id);
  };

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'draft', label: 'Drafts' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Submissions</h2>
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="grid gap-4">
          {submissions.map((submission) => {
            // Generate the public URL for the screenshot if present
            let screenshotUrl: string | null = null;
            if (submission.screenshot_filename) {
              const { data } = supabase.storage
                .from('agent-screenshots')
                .getPublicUrl(submission.screenshot_filename);
              screenshotUrl = data?.publicUrl || null;
            }
            // Use logo_url if present
            let logoUrl: string | null = null;
            if (submission.logo_url) {
              logoUrl = submission.logo_url;
            }
            return (
              <Card key={submission.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div>
                      {screenshotUrl && (
                        <img
                          src={screenshotUrl}
                          alt={submission.name + ' screenshot'}
                          className="h-20 w-20 object-cover rounded-lg border mb-2"
                        />
                      )}
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={submission.name + ' logo'}
                          className="h-12 w-12 object-cover rounded-full border"
                        />
                      ) : (
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{submission.name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{submission.name}</h3>
                          <p className="text-gray-600 mb-2">{submission.tagline}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(submission)}>
                            {submission.is_draft ? 'Draft' : submission.status || 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      {(submission.status === 'approved' || submission.status === 'featured') ? (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Views:</span><br />
                            {agentAnalytics[submission.id]?.view_count ?? '—'}
                          </div>
                          <div>
                            <span className="font-semibold">Upvotes:</span><br />
                            {agentAnalytics[submission.id]?.total_upvotes ?? '—'}
                          </div>
                          <div>
                            <span className="font-semibold">Reviews:</span><br />
                            {agentAnalytics[submission.id]?.total_reviews ?? '—'}
                          </div>
                          <div>
                            <span className="font-semibold">Avg. Rating:</span><br />
                            {agentAnalytics[submission.id]?.average_rating?.toFixed(1) ?? '—'}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 text-gray-500 text-sm">Analytics will be available after your agent is approved.</div>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(submission)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {submission.status === 'rejected' && !submission.is_draft && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResubmit(submission)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Resubmit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No submissions found</p>
            <Button className="mt-4">Submit Your First Agent</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MySubmissions;
