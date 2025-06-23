import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Shield, Ban, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  twitter_handle: string | null;
  github_handle: string | null;
  created_at: string | null;
  is_verified: boolean | null;
  user_roles?: { role: string }[];
  agent_submissions?: { id: string }[];
  agent_reviews?: { id: string }[];
  support_tickets?: { id: string; status: string }[];
  status: string;
}

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, updates: Partial<User>) => void;
  onSendNotification: (userIds: string[], title: string, message: string, type?: string) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onUpdate,
  onSendNotification,
  onRoleChange,
  onDeleteUser,
  onStatusChange
}: UserDetailModalProps & {
  onRoleChange: (userId: string, role: 'admin' | 'moderator' | 'user', assign: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onStatusChange: (userId: string, status: 'active' | 'suspended' | 'banned') => void;
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    onUpdate(user.id, editedUser);
    setIsEditing(false);
  };

  const handleSendNotification = () => {
    if (notificationTitle && notificationMessage) {
      onSendNotification([user.id], notificationTitle, notificationMessage, notificationType);
      setNotificationTitle('');
      setNotificationMessage('');
      setNotificationType('info');
    }
  };

  const getUserRole = () => user.user_roles?.[0]?.role || 'user';
  const isSuspended = user.status === 'suspended';
  const isBanned = user.status === 'banned';
  const isAdmin = getUserRole() === 'admin';
  const isModerator = getUserRole() === 'moderator';

  const handleSuspend = () => {
    onStatusChange(user.id, isSuspended ? 'active' : 'suspended');
    toast({ title: isSuspended ? 'User Unsuspended' : 'User Suspended' });
  };
  const handleBan = () => {
    onStatusChange(user.id, isBanned ? 'active' : 'banned');
    toast({ title: isBanned ? 'User Unbanned' : 'User Banned' });
  };
  const handleRole = (role: 'admin' | 'moderator', assign: boolean) => {
    onRoleChange(user.id, role, assign);
    toast({ title: assign ? `Role ${role} assigned` : `Role ${role} removed` });
  };
  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setIsDeleting(true);
    onDeleteUser(user.id);
    setIsDeleting(false);
    toast({ title: 'User Deleted' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback>
                {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                {user.full_name || user.username || 'Unnamed User'}
                {user.is_verified && (
                  <Badge variant="secondary">Verified</Badge>
                )}
                <Badge variant={getUserRole() === 'admin' ? 'default' : 'secondary'}>
                  {getUserRole()}
                </Badge>
              </div>
              {user.username && (
                <div className="text-sm text-gray-500">@{user.username}</div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={isEditing ? editedUser.full_name || '' : user.full_name || ''}
                      onChange={(e) => setEditedUser({...editedUser, full_name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={isEditing ? editedUser.username || '' : user.username || ''}
                      onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={isEditing ? editedUser.bio || '' : user.bio || ''}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={isEditing ? editedUser.website || '' : user.website || ''}
                      onChange={(e) => setEditedUser({...editedUser, website: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_handle">Twitter Handle</Label>
                    <Input
                      id="twitter_handle"
                      value={isEditing ? editedUser.twitter_handle || '' : user.twitter_handle || ''}
                      onChange={(e) => setEditedUser({...editedUser, twitter_handle: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{user.agent_submissions?.length || 0}</div>
                  <p className="text-sm text-gray-500">Agent submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{user.agent_reviews?.length || 0}</div>
                  <p className="text-sm text-gray-500">Reviews written</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{user.support_tickets?.length || 0}</div>
                  <p className="text-sm text-gray-500">Support tickets</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notification_title">Title</Label>
                  <Input
                    id="notification_title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="notification_message">Message</Label>
                  <Textarea
                    id="notification_message"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Notification message"
                  />
                </div>
                <div>
                  <Label htmlFor="notification_type">Type</Label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSendNotification} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    Moderation Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleSuspend}>
                    <Shield className="h-4 w-4 mr-2" />
                    {isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleBan}>
                    <Ban className="h-4 w-4 mr-2" />
                    {isBanned ? 'Unban User' : 'Ban User'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleRole('admin', !isAdmin)}>
                    <Shield className="h-4 w-4 mr-2" />
                    {isAdmin ? 'Remove Admin Role' : 'Assign Admin Role'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleRole('moderator', !isModerator)}>
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    {isModerator ? 'Remove Moderator Role' : 'Assign Moderator Role'}
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={handleDelete} disabled={isDeleting}>
                    Delete User
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
