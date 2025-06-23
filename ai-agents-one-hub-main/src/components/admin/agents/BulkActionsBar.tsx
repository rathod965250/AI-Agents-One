import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Trash2, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: (reason: string) => void;
  onBulkDelete: () => void;
  onBulkFeature: () => void;
  onBulkUnfeature: () => void;
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
  onBulkFeature,
  onBulkUnfeature,
  onClearSelection
}: BulkActionsBarProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleBulkReject = () => {
    onBulkReject(rejectReason);
    setRejectReason('');
    setIsRejectDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-3">
        <Badge variant="secondary">
          {selectedCount} selected
        </Badge>
        <span className="text-sm text-gray-600">
          Bulk actions available
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onBulkApprove}
          className="text-green-600 hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve All
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onBulkFeature}
          className="text-purple-600 hover:bg-purple-50"
        >
          Feature All
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onBulkUnfeature}
          className="text-gray-600 hover:bg-gray-50"
        >
          Unfeature All
        </Button>

        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject All
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Selected Agents</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please provide a reason for rejecting these {selectedCount} agents:
              </p>
              <Textarea
                placeholder="Rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkReject}
                  disabled={!rejectReason.trim()}
                >
                  Reject All
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          variant="outline"
          onClick={onBulkDelete}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete All
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
}
