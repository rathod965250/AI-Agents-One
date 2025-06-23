import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, X, Send, Ban, Shield } from 'lucide-react';

interface BulkUserActionsProps {
  selectedCount: number;
  onSendNotification: (userIds: string[], title: string, message: string, type?: string) => void;
  onClearSelection: () => void;
  selectedUsers: string[];
  onBulkSuspend: () => void;
  onBulkUnsuspend: () => void;
  onBulkBan: () => void;
  onBulkUnban: () => void;
  onBulkAssignAdmin: () => void;
  onBulkRemoveAdmin: () => void;
  onBulkAssignModerator: () => void;
  onBulkRemoveModerator: () => void;
  onBulkDelete: () => void;
}

export function BulkUserActions({
  selectedCount,
  onSendNotification,
  onClearSelection,
  selectedUsers,
  onBulkSuspend,
  onBulkUnsuspend,
  onBulkBan,
  onBulkUnban,
  onBulkAssignAdmin,
  onBulkRemoveAdmin,
  onBulkAssignModerator,
  onBulkRemoveModerator,
  onBulkDelete
}: BulkUserActionsProps) {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  const handleSendNotification = () => {
    if (notificationTitle && notificationMessage) {
      onSendNotification(selectedUsers, notificationTitle, notificationMessage, notificationType);
      setNotificationTitle('');
      setNotificationMessage('');
      setNotificationType('info');
      setIsNotificationDialogOpen(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium text-blue-900">
              {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Notification to {selectedCount} Users</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bulk_notification_title">Title</Label>
                      <Input
                        id="bulk_notification_title"
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        placeholder="Notification title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulk_notification_message">Message</Label>
                      <Textarea
                        id="bulk_notification_message"
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Notification message"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulk_notification_type">Type</Label>
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
                      Send to {selectedCount} Users
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={onBulkSuspend} disabled={selectedCount === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Suspend
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkUnsuspend} disabled={selectedCount === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Unsuspend
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkBan} disabled={selectedCount === 0}>
                <Ban className="h-4 w-4 mr-2" />
                Ban
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkUnban} disabled={selectedCount === 0}>
                <Ban className="h-4 w-4 mr-2" />
                Unban
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkAssignAdmin} disabled={selectedCount === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Assign Admin
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkRemoveAdmin} disabled={selectedCount === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Remove Admin
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkAssignModerator} disabled={selectedCount === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Assign Moderator
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkRemoveModerator} disabled={selectedCount === 0}>
                <Shield className="h-4 w-4 mr-2" />
                Remove Moderator
              </Button>
              <Button variant="destructive" size="sm" onClick={() => { if(window.confirm('Delete selected users?')) onBulkDelete(); }} disabled={selectedCount === 0}>
                Delete
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
