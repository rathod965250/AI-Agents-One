import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Star, TrendingUp, CheckCircle, XCircle, Edit2, Trash2, ArrowUpRight, Flag } from 'lucide-react';
import { format } from 'date-fns';
import type { Agent } from '@/integrations/supabase/types';

interface AgentListViewProps {
  agents: Agent[];
  isLoading: boolean;
  selectedAgents: string[];
  onSelectionChange: (selected: string[]) => void;
  onAgentClick: (agent: Agent) => void;
  onAgentAction: (action: string, agent: Agent) => void;
}

export function AgentListView({
  agents,
  isLoading,
  selectedAgents,
  onSelectionChange,
  onAgentClick,
  onAgentAction
}: AgentListViewProps) {
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(agents.map(agent => agent.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectAgent = (agentId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedAgents, agentId]);
    } else {
      onSelectionChange(selectedAgents.filter(id => id !== agentId));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive',
      featured: 'default'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      featured: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedAgents.length === agents.length && agents.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Metrics</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <>
              <TableRow key={agent.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedAgents.includes(agent.id)}
                    onCheckedChange={(checked) => handleSelectAgent(agent.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {agent.name}
                        {agent.content_flags && agent.content_flags.length > 0 && (
                          <span title="Flagged">
                            <Flag className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">AI Agent</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(agent.status || 'pending')}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{agent.profiles?.full_name || 'Unknown'}</p>
                    <p className="text-gray-500">@{agent.profiles?.username || 'unknown'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {agent.created_at ? format(new Date(agent.created_at), 'MMM dd, yyyy') : 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{agent.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span>{agent.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{agent.total_upvotes || 0}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setExpandedAgentId(expandedAgentId === agent.id ? null : agent.id)}>
                    {expandedAgentId === agent.id ? 'Hide' : 'View'}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      title="Review"
                      onClick={() => onAgentClick(agent)}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title="Approve"
                      onClick={() => onAgentAction('approve', agent)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title="Reject"
                      onClick={() => onAgentAction('reject', agent)}
                    >
                      <XCircle className="h-4 w-4 mr-1 text-red-600" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title={agent.status === 'featured' ? 'Unfeature' : 'Feature'}
                      onClick={() => onAgentAction(agent.status === 'featured' ? 'unfeature' : 'feature', agent)}
                    >
                      <Star className={`h-4 w-4 mr-1 ${agent.status === 'featured' ? 'text-purple-600' : 'text-gray-400'}`} />
                      {agent.status === 'featured' ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title="Edit"
                      onClick={() => onAgentAction('edit', agent)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      title="Delete"
                      onClick={() => onAgentAction('delete', agent)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedAgentId === agent.id && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Features:</strong> {agent.features?.join(', ') || '—'}<br />
                        <strong>Integrations:</strong> {agent.integrations?.join(', ') || '—'}<br />
                        <strong>Gallery:</strong> {agent.gallery?.join(', ') || '—'}<br />
                        <strong>Case Studies:</strong> {agent.case_studies?.join(', ') || '—'}<br />
                        <strong>Technical Specs:</strong> {agent.technical_specs?.join(', ') || '—'}<br />
                      </div>
                      <div>
                        <strong>Docs:</strong> {agent.documentation_url || '—'}<br />
                        <strong>LinkedIn:</strong> {agent.linkedin_url || '—'}<br />
                        <strong>Twitter:</strong> {agent.twitter_url || '—'}<br />
                        <strong>Additional Resources:</strong> {agent.additional_resources_url || '—'}<br />
                        <strong>Developer:</strong> {agent.developer || '—'}<br />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      {agents.length === 0 && (
        <div className="text-center p-8">
          <p className="text-gray-500">No agents found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
