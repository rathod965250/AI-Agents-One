import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Check, X, Trash2 } from 'lucide-react';

interface BulkReviewActionsProps {
  selectedCount: number;
  onBulkAction: (action: 'approve' | 'reject' | 'delete', reason?: string) => void;
  onBulkFeature: () => void;
  onBulkUnfeature: () => void;
  onClearSelection: () => void;
}

export function BulkReviewActions({
  selectedCount,
  onBulkAction,
  onBulkFeature,
  onBulkUnfeature,
  onClearSelection
}: BulkReviewActionsProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleReject = () => {
    onBulkAction('reject', rejectReason);
    setRejectReason('');
    setIsRejectDialogOpen(false);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium text-blue-900">
              {selectedCount} review{selectedCount > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onBulkAction('approve')}
                disabled={selectedCount === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBulkFeature}
                disabled={selectedCount === 0}
              >
                Feature
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBulkUnfeature}
                disabled={selectedCount === 0}
              >
                Unfeature
              </Button>
              
              <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject {selectedCount} Reviews</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reject_reason">Rejection Reason</Label>
                      <Textarea
                        id="reject_reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why these reviews are being rejected..."
                      />
                    </div>
                    <Button onClick={handleReject} variant="destructive" className="w-full">
                      Reject {selectedCount} Reviews
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => { if(window.confirm('Delete selected reviews?')) onBulkAction('delete'); }}
                disabled={selectedCount === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
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
