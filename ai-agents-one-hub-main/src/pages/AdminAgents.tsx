import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from '@/integrations/supabase/types';
import { AgentListView } from '@/components/admin/agents/AgentListView';
import { AgentFilters } from '@/components/admin/agents/AgentFilters';
import { BulkActionsBar } from '@/components/admin/agents/BulkActionsBar';
import { AgentEditModal } from '@/components/admin/agents/AgentEditModal';
import { RejectAgentModal } from '@/components/admin/agents/RejectAgentModal';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

type AgentStatus = 'pending' | 'approved' | 'rejected' | 'featured' | 'flagged';
const agentCategories = ['Productivity', 'Data Analysis', 'Content Creation'];
const pricingTypes = ['Free', 'Freemium', 'Paid', 'Subscription'];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

export default function AdminAgents() {
  const { isAdmin, logAdminAction, userRole } = useAdminAuth();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentToReject, setAgentToReject] = useState<Agent | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    category: agentCategories[0],
    pricing_type: pricingTypes[0],
    website_url: '',
    description: '',
    contact_email: '',
    affiliate_url: '',
    linkedin_url: '',
    twitter_url: '',
    repository_url: '',
    homepage_image_url: '',
    additional_resources_url: '',
    status: 'approved',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const { data: agents, isLoading, refetch } = useQuery<Agent[]>({
    queryKey: ['admin-agents', searchTerm, statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('ai_agents')
        .select(`
          *,
          profiles:submitted_by(username, full_name),
          reviews:agent_reviews(rating),
          upvotes:agent_upvotes(id)
        `);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`);
      }

      let agentData = [];
      if (statusFilter === 'flagged') {
        // Get all flagged agent IDs from content_flags
        const { data: flags, error: flagError } = await supabase
          .from('content_flags')
          .select('content_id, reason, status')
          .eq('content_type', 'agent')
          .in('status', ['pending', 'reviewed']);
        if (flagError) throw flagError;
        const flaggedIds = (flags || []).map(f => f.content_id);
        if (flaggedIds.length === 0) return [];
        query = query.in('id', flaggedIds);
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        const { data, error } = await query;
        if (error) throw error;
        // Attach flags to agents
        agentData = (data || []).map(agent => ({
          ...agent,
          content_flags: (flags || []).filter(f => f.content_id === agent.id)
        }));
      } else {
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        const { data, error } = await query;
        if (error) throw error;
        agentData = (data || []).map(agent => ({
          ...agent,
          content_flags: []
        }));
      }
      return agentData;
    }
  });

  useEffect(() => {
    const channel = supabase.channel('realtime-admin-agents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_agents' }, () => {
        refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleBulkStatusUpdate = async (status: AgentStatus, reason?: string) => {
    if (!isAdmin || selectedAgents.length === 0) return;

    try {
      // Update each agent individually using Promise.all for better performance
      const updates = selectedAgents.map(agentId => {
        const updateData: Partial<Agent> = {
          status,
          rejection_reason: status === 'rejected' ? reason : null,
          approved_at: status === 'approved' ? new Date().toISOString() : null
        };

        return supabase
          .from('ai_agents')
          .update(updateData)
          .eq('id', agentId);
      });

      const results = await Promise.all(updates);
      
      // Check if any updates failed
      const failedUpdates = results.filter(result => result.error);
      if (failedUpdates.length > 0) {
        throw new Error(`Failed to update ${failedUpdates.length} agents`);
      }

      await logAdminAction('bulk_status_update', 'ai_agents', null, null, { 
        agent_ids: selectedAgents, 
        status, 
        reason 
      });

      toast({
        title: "Bulk Update Successful",
        description: `Updated ${selectedAgents.length} agents to ${status}`
      });

      setSelectedAgents([]);
      refetch();
    } catch (error) {
      console.error('Error updating agents:', error);
      toast({
        title: "Error",
        description: "Failed to update agents",
        variant: "destructive"
      });
    }
  };

  const handleAgentUpdate = async (agentId: string, updates: Partial<Agent>) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('ai_agents')
        .update(updates)
        .eq('id', agentId);

      if (error) throw error;

      await logAdminAction('update_agent', 'ai_agents', agentId, null, updates);

      toast({
        title: "Agent Updated",
        description: "Agent information has been updated successfully"
      });

      refetch();
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive"
      });
    }
  };

  // Handler for per-agent actions
  const handleAgentAction = async (action: string, agent: Agent) => {
    if (!isAdmin) return;
    try {
      let updates: Partial<Agent> = {};
      let logAction = action;
      let description = '';
      if (action === 'approve') {
        updates = { status: 'approved', approved_at: new Date().toISOString(), rejection_reason: null };
        description = 'Agent approved.';
      } else if (action === 'reject') {
        setAgentToReject(agent);
        setRejectModalOpen(true);
        return;
      } else if (action === 'feature') {
        updates = { status: 'featured' };
        description = 'Agent featured.';
      } else if (action === 'unfeature') {
        updates = { status: 'approved' };
        description = 'Agent unfeatured.';
      } else if (action === 'edit') {
        setSelectedAgent(agent);
        return;
      } else if (action === 'delete') {
        if (!window.confirm('Are you sure you want to delete this agent?')) return;
        const { error } = await supabase.from('ai_agents').delete().eq('id', agent.id);
        if (error) throw error;
        await logAdminAction('delete_agent', 'ai_agents', agent.id, agent, null);
        toast({ title: 'Agent Deleted', description: 'Agent has been deleted.' });
        refetch();
        return;
      }
      // Update agent
      const { error } = await supabase.from('ai_agents').update(updates).eq('id', agent.id);
      if (error) throw error;
      await logAdminAction(logAction, 'ai_agents', agent.id, agent, updates);
      toast({ title: 'Success', description });
      refetch();
    } catch (error) {
      console.error('Error in agent action:', error);
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  // Bulk feature/unfeature handlers
  const handleBulkFeature = async () => {
    if (!isAdmin || selectedAgents.length === 0) return;
    try {
      const updates = selectedAgents.map(agentId =>
        supabase.from('ai_agents').update({ status: 'featured' }).eq('id', agentId)
      );
      const results = await Promise.all(updates);
      const failed = results.filter(r => r.error);
      if (failed.length > 0) throw new Error(`Failed to feature ${failed.length} agents`);
      await logAdminAction('bulk_feature', 'ai_agents', null, null, { agent_ids: selectedAgents });
      toast({ title: 'Bulk Feature Successful', description: `Featured ${selectedAgents.length} agents.` });
      setSelectedAgents([]);
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };
  const handleBulkUnfeature = async () => {
    if (!isAdmin || selectedAgents.length === 0) return;
    try {
      const updates = selectedAgents.map(agentId =>
        supabase.from('ai_agents').update({ status: 'approved' }).eq('id', agentId)
      );
      const results = await Promise.all(updates);
      const failed = results.filter(r => r.error);
      if (failed.length > 0) throw new Error(`Failed to unfeature ${failed.length} agents`);
      await logAdminAction('bulk_unfeature', 'ai_agents', null, null, { agent_ids: selectedAgents });
      toast({ title: 'Bulk Unfeature Successful', description: `Unfeatured ${selectedAgents.length} agents.` });
      setSelectedAgents([]);
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };
  const handleBulkDelete = async () => {
    if (!isAdmin || selectedAgents.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedAgents.length} agents?`)) return;
    try {
      const deletes = selectedAgents.map(agentId =>
        supabase.from('ai_agents').delete().eq('id', agentId)
      );
      const results = await Promise.all(deletes);
      const failed = results.filter(r => r.error);
      if (failed.length > 0) throw new Error(`Failed to delete ${failed.length} agents`);
      await logAdminAction('bulk_delete', 'ai_agents', null, null, { agent_ids: selectedAgents });
      toast({ title: 'Bulk Delete Successful', description: `Deleted ${selectedAgents.length} agents.` });
      setSelectedAgents([]);
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  const handleCreateInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateForm(f => ({ ...f, [name]: value }));
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Validation
    if (!createForm.name || !createForm.category || !createForm.pricing_type || !createForm.website_url) {
      toast({ title: 'Missing required fields', description: 'Name, category, pricing, and website are required.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    const slug = slugify(createForm.name);
    try {
      const insertData: Partial<Agent> = {
        name: createForm.name,
        category: createForm.category,
        pricing_type: createForm.pricing_type,
        website_url: createForm.website_url,
        contact_email: createForm.contact_email || null,
        affiliate_url: createForm.affiliate_url || null,
        linkedin_url: createForm.linkedin_url || null,
        twitter_url: createForm.twitter_url || null,
        repository_url: createForm.repository_url || null,
        homepage_image_url: createForm.homepage_image_url || null,
        additional_resources_url: createForm.additional_resources_url || null,
        slug,
        status: createForm.status as any,
        submitted_by: userRole?.user_id || null,
      };
      const { error } = await supabase.from('ai_agents').insert([insertData]);
      if (error) throw error;
      await logAdminAction('create', 'ai_agents', null, null, { name: createForm.name, slug });
      toast({ title: 'Agent created', description: `${createForm.name} was added successfully.` });
      setCreateModalOpen(false);
      setCreateForm({
        name: '',
        category: agentCategories[0],
        pricing_type: pricingTypes[0],
        website_url: '',
        description: '',
        contact_email: '',
        affiliate_url: '',
        linkedin_url: '',
        twitter_url: '',
        repository_url: '',
        homepage_image_url: '',
        additional_resources_url: '',
        status: 'approved',
      });
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!agentToReject) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from('ai_agents')
      .update({ status: 'rejected', moderation_notes: reason })
      .eq('id', agentToReject.id);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to reject agent.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `${agentToReject.name} has been rejected.` });
      await logAdminAction('reject_agent', JSON.stringify({ agent_id: agentToReject.id, agent_name: agentToReject.name, reason }));
      refetch();
    }
    
    setAgentToReject(null);
    setRejectModalOpen(false);
    setIsSubmitting(false);
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Management</h1>
      </div>

      <AgentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {selectedAgents.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedAgents.length}
          onBulkApprove={() => handleBulkStatusUpdate('approved')}
          onBulkReject={(reason) => handleBulkStatusUpdate('rejected', reason)}
          onBulkDelete={handleBulkDelete}
          onBulkFeature={handleBulkFeature}
          onBulkUnfeature={handleBulkUnfeature}
          onClearSelection={() => setSelectedAgents([])}
        />
      )}

      <AgentListView
        agents={agents || []}
        isLoading={isLoading}
        selectedAgents={selectedAgents}
        onSelectionChange={setSelectedAgents}
        onAgentClick={(agent) => {
          setSelectedAgent(agent);
        }}
        onAgentAction={handleAgentAction}
      />

      {selectedAgent && (
        <AgentEditModal
          key={selectedAgent.id}
          agent={selectedAgent}
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onUpdate={refetch}
        />
      )}

      {agentToReject && (
        <RejectAgentModal
          isOpen={isRejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onSubmit={handleRejectSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Agent</h2>
            <form onSubmit={handleCreateAgent} className="space-y-3">
              <div>
                <label className="block font-medium">Name *</label>
                <input name="name" value={createForm.name} onChange={handleCreateInput} className="input w-full" required />
              </div>
              <div>
                <label className="block font-medium">Category *</label>
                <select name="category" value={createForm.category} onChange={handleCreateInput} className="input w-full" required>
                  {agentCategories.map(cat => <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium">Pricing Type *</label>
                <select name="pricing_type" value={createForm.pricing_type} onChange={handleCreateInput} className="input w-full" required>
                  {pricingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium">Website URL *</label>
                <input name="website_url" value={createForm.website_url} onChange={handleCreateInput} className="input w-full" required />
              </div>
              <div>
                <label className="block font-medium">Description</label>
                <textarea name="description" value={createForm.description} onChange={handleCreateInput} className="input w-full" rows={2} />
              </div>
              <div>
                <label className="block font-medium">Contact Email</label>
                <input name="contact_email" value={createForm.contact_email} onChange={handleCreateInput} className="input w-full" type="email" />
              </div>
              <div>
                <label className="block font-medium">Affiliate URL</label>
                <input name="affiliate_url" value={createForm.affiliate_url} onChange={handleCreateInput} className="input w-full" />
              </div>
              <div>
                <label className="block font-medium">LinkedIn URL</label>
                <input name="linkedin_url" value={createForm.linkedin_url} onChange={handleCreateInput} className="input w-full" />
              </div>
              <div>
                <label className="block font-medium">Twitter URL</label>
                <input name="twitter_url" value={createForm.twitter_url} onChange={handleCreateInput} className="input w-full" />
              </div>
              <div>
                <label className="block font-medium">Repository URL</label>
                <input name="repository_url" value={createForm.repository_url} onChange={handleCreateInput} className="input w-full" />
              </div>
              <div>
                <label className="block font-medium">Homepage Image URL</label>
                <input name="homepage_image_url" value={createForm.homepage_image_url} onChange={handleCreateInput} className="input w-full" />
              </div>
              <div>
                <label className="block font-medium">Additional Resources URL</label>
                <input name="additional_resources_url" value={createForm.additional_resources_url} onChange={handleCreateInput} className="input w-full" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" onClick={() => setCreateModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Agent'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
