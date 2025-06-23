import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, Shield, ShieldAlert, Flag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/integrations/supabase/types';

interface UserListViewProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: string[];
  onSelectionChange: (users: string[]) => void;
  onUserClick: (user: User) => void;
}

export function UserListView({
  users,
  isLoading,
  selectedUsers,
  onSelectionChange,
  onUserClick
}: UserListViewProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map(user => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUsers, userId]);
    } else {
      onSelectionChange(selectedUsers.filter(id => id !== userId));
    }
  };

  const getUserRole = (user: User) => {
    return user.user_roles?.[0]?.role || 'user';
  };

  const getUserStatus = (user: User) => {
    return user.status || 'active';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'moderator':
        return <ShieldAlert className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
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
                checked={selectedUsers.length === users.length && users.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Tickets</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.full_name || user.username || 'Unnamed User'}
                        {user.content_flags && user.content_flags.length > 0 && (
                          <Flag className="h-4 w-4 text-red-500 ml-1" />
                        )}
                      </span>
                      {user.is_verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    {user.username && (
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRoleIcon(getUserRole(user))}
                  <Badge variant={getUserRole(user) === 'admin' ? 'default' : 'secondary'}>
                    {getUserRole(user)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={getUserStatus(user) === 'active' ? 'default' : 'destructive'}
                  className={getUserStatus(user) === 'suspended' ? 'bg-yellow-500 text-white' : ''}
                >
                  {getUserStatus(user)}
                </Badge>
              </TableCell>
              <TableCell>{user.agent_submissions?.length || 0}</TableCell>
              <TableCell>{user.agent_reviews?.length || 0}</TableCell>
              <TableCell>
                {user.support_tickets?.length || 0}
                {user.support_tickets?.some(t => t.status === 'open') && (
                  <Badge variant="outline" className="ml-2 text-xs">Open</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.created_at && new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUserClick(user)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
