import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
}

export function AdminAuditLog() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs', search, actionFilter, resourceFilter, page],
    queryFn: async () => {
      let query = supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      if (actionFilter !== 'all') query = query.eq('action', actionFilter);
      if (resourceFilter !== 'all') query = query.eq('resource_type', resourceFilter);
      if (search) query = query.or(`admin_id.ilike.%${search}%, resource_id.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLog[];
    }
  });

  return (
    <Card className="mt-6">
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <input
            className="input"
            placeholder="Search admin or resource ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="input" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
            <option value="feature">Feature</option>
            <option value="unfeature">Unfeature</option>
            <option value="assign_role">Assign Role</option>
            <option value="remove_role">Remove Role</option>
            <option value="send_notification">Send Notification</option>
            <option value="bulk_update_reviews">Bulk Update Reviews</option>
            <option value="update_status">Update Status</option>
            {/* Add more as needed */}
          </select>
          <select className="input" value={resourceFilter} onChange={e => setResourceFilter(e.target.value)}>
            <option value="all">All Resources</option>
            <option value="ai_agents">AI Agents</option>
            <option value="agent_reviews">Agent Reviews</option>
            <option value="profiles">Users</option>
            <option value="user_roles">User Roles</option>
            <option value="user_notifications">User Notifications</option>
            {/* Add more as needed */}
          </select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Resource ID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : logs && logs.length > 0 ? (
              logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</TableCell>
                  <TableCell>{log.admin_id}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.resource_type}</TableCell>
                  <TableCell>{log.resource_id}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelectedLog(log)}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6}>No logs found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage(p => p + 1)} disabled={logs && logs.length < pageSize}>Next</Button>
        </div>
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-2">
                <div><strong>Admin:</strong> {selectedLog.admin_id}</div>
                <div><strong>Action:</strong> {selectedLog.action}</div>
                <div><strong>Resource:</strong> {selectedLog.resource_type}</div>
                <div><strong>Resource ID:</strong> {selectedLog.resource_id}</div>
                <div><strong>Time:</strong> {selectedLog.created_at ? new Date(selectedLog.created_at).toLocaleString() : ''}</div>
                <div><strong>IP Address:</strong> {selectedLog.ip_address || 'N/A'}</div>
                <div><strong>User Agent:</strong> {selectedLog.user_agent || 'N/A'}</div>
                <div><strong>Old Values:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(selectedLog.old_values, null, 2)}</pre>
                </div>
                <div><strong>New Values:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(selectedLog.new_values, null, 2)}</pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 