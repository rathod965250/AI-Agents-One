import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserListView } from '@/components/admin/users/UserListView';
import { UserDetailModal } from '@/components/admin/users/UserDetailModal';
import { UserFilters } from '@/components/admin/users/UserFilters';
import { BulkUserActions } from '@/components/admin/users/BulkUserActions';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/integrations/supabase/types';

export default function AdminUsers() {
  const { isAdmin, logAdminAction } = useAdminAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned' | 'flagged'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'moderator'>('all');

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm, statusFilter, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          agent_submissions(id),
          agent_reviews(id),
          support_tickets(id, status)
        `);

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%, full_name.ilike.%${searchTerm}%`);
      }

      let userData = [];
      if (statusFilter === 'flagged') {
        // Get all flagged user IDs from content_flags
        const { data: flags, error: flagError } = await supabase
          .from('content_flags')
          .select('content_id, reason, status')
          .eq('content_type', 'user')
          .in('status', ['pending', 'reviewed']);
        if (flagError) throw flagError;
        const flaggedIds = (flags || []).map(f => f.content_id);
        if (flaggedIds.length === 0) return [];
        query = query.in('id', flaggedIds);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        // Attach flags to users
        userData = (data || []).map(user => ({
          ...user,
          content_flags: (flags || []).filter(f => f.content_id === user.id)
        }));
      } else {
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        userData = (data || []).map(user => ({
          ...user,
          content_flags: []
        }));
      }
      // Transform data to match User interface
      return (userData || []).map(user => ({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        website: user.website,
        twitter_handle: user.twitter_handle,
        github_handle: user.github_handle,
        created_at: user.created_at,
        is_verified: user.is_verified,
        status: user.status,
        user_roles: Array.isArray(user.user_roles) ? user.user_roles : [],
        agent_submissions: Array.isArray(user.agent_submissions) ? user.agent_submissions : [],
        agent_reviews: Array.isArray(user.agent_reviews) ? user.agent_reviews : [],
        support_tickets: Array.isArray(user.support_tickets) ? user.support_tickets : [],
        content_flags: user.content_flags || []
      })) as User[];
    }
  });

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      await logAdminAction('update_user', 'profiles', userId, null, updates);

      toast({
        title: "User Updated",
        description: "User information has been updated successfully"
      });

      refetch();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleSendNotification = async (userIds: string[], title: string, message: string, type: string = 'info') => {
    if (!isAdmin) return;

    try {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title,
        message,
        type,
        created_by: user?.id
      }));

      const { error } = await supabase
        .from('user_notifications')
        .insert(notifications);

      if (error) throw error;

      await logAdminAction('send_notification', 'user_notifications', null, null, { userIds, title, message, type });

      toast({
        title: "Notifications Sent",
        description: `Sent notifications to ${userIds.length} users`
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive"
      });
    }
  };

  const handleSelectUser = (user: { id: string }) => {
    const fullUser = users?.find(u => u.id === user.id);
    setSelectedUser(fullUser || null);
  };

  // Handler to assign/remove admin/moderator roles
  const handleRoleChange = async (userId: string, role: 'admin' | 'moderator' | 'user', assign: boolean) => {
    if (!isAdmin) return;
    try {
      if (assign) {
        const { error } = await supabase.from('user_roles').upsert({ user_id: userId, role });
        if (error) throw error;
        await logAdminAction('assign_role', 'user_roles', userId, null, { role });
      } else {
        const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
        if (error) throw error;
        await logAdminAction('remove_role', 'user_roles', userId, null, { role });
      }
      toast({ title: 'Role updated', description: `Role ${role} ${assign ? 'assigned' : 'removed'}` });
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  // Handler to delete user
  const handleDeleteUser = async (userId: string) => {
    if (!isAdmin) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      await logAdminAction('delete_user', 'profiles', userId, null, null);
      toast({ title: 'User deleted' });
      refetch();
      setSelectedUser(null);
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  // Handler to change user status (suspend/ban/activate)
  const handleStatusChange = async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    if (!isAdmin) return;
    try {
      const { error } = await supabase.from('profiles').update({ status }).eq('id', userId);
      if (error) throw error;
      await logAdminAction('update_status', 'profiles', userId, null, { status });
      toast({ title: 'User status updated', description: `Status set to ${status}` });
      refetch();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {selectedUsers.length > 0 && (
        <BulkUserActions
          selectedCount={selectedUsers.length}
          onSendNotification={handleSendNotification}
          onClearSelection={() => setSelectedUsers([])}
          selectedUsers={selectedUsers}
          onBulkSuspend={async () => {
            await Promise.all(selectedUsers.map(id => handleStatusChange(id, 'suspended')));
            toast({ title: 'Users suspended' });
            setSelectedUsers([]); refetch();
          }}
          onBulkUnsuspend={async () => {
            await Promise.all(selectedUsers.map(id => handleStatusChange(id, 'active')));
            toast({ title: 'Users unsuspended' });
            setSelectedUsers([]); refetch();
          }}
          onBulkBan={async () => {
            await Promise.all(selectedUsers.map(id => handleStatusChange(id, 'banned')));
            toast({ title: 'Users banned' });
            setSelectedUsers([]); refetch();
          }}
          onBulkUnban={async () => {
            await Promise.all(selectedUsers.map(id => handleStatusChange(id, 'active')));
            toast({ title: 'Users unbanned' });
            setSelectedUsers([]); refetch();
          }}
          onBulkAssignAdmin={async () => {
            await Promise.all(selectedUsers.map(id => handleRoleChange(id, 'admin', true)));
            toast({ title: 'Admin role assigned' });
            setSelectedUsers([]); refetch();
          }}
          onBulkRemoveAdmin={async () => {
            await Promise.all(selectedUsers.map(id => handleRoleChange(id, 'admin', false)));
            toast({ title: 'Admin role removed' });
            setSelectedUsers([]); refetch();
          }}
          onBulkAssignModerator={async () => {
            await Promise.all(selectedUsers.map(id => handleRoleChange(id, 'moderator', true)));
            toast({ title: 'Moderator role assigned' });
            setSelectedUsers([]); refetch();
          }}
          onBulkRemoveModerator={async () => {
            await Promise.all(selectedUsers.map(id => handleRoleChange(id, 'moderator', false)));
            toast({ title: 'Moderator role removed' });
            setSelectedUsers([]); refetch();
          }}
          onBulkDelete={async () => {
            await Promise.all(selectedUsers.map(id => handleDeleteUser(id)));
            toast({ title: 'Users deleted' });
            setSelectedUsers([]); refetch();
          }}
        />
      )}

      <UserListView
        users={users || []}
        isLoading={isLoading}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        onUserClick={handleSelectUser}
      />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUserUpdate}
          onSendNotification={handleSendNotification}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
