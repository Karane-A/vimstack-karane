import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { formatSuperadminCurrency } from '@/utils/helpers';


interface PayoutRequestsProps {
  userType: string;
  payoutRequests: any;
  settings: any;
  stats: any;
}

export default function PayoutRequests({ userType, payoutRequests, settings, stats }: PayoutRequestsProps) {
  const { t } = useTranslation();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    amount: '',
  });

  const { data: rejectData, setData: setRejectData, post: postReject, processing: rejectProcessing } = useForm({
    notes: '',
  });

  const handleCreatePayout = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('referral.payout-request.create'), {
      onSuccess: () => {
        setShowCreateDialog(false);
        reset();
        toast.success(t('Payout request submitted successfully'));
      },
    });
  };

  const handleApprove = (request: any) => {
    post(route('referral.payout-request.approve', request.id));
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      postReject(route('referral.payout-request.reject', selectedRequest.id), {
        onSuccess: () => {
          setShowRejectDialog(false);
          setSelectedRequest(null);
          setRejectData('notes', '');
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'success',
      rejected: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {t(status.charAt(0).toUpperCase() + status.slice(1))}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {userType === 'company' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('Create Payout Request')}</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button disabled={stats.availableBalance < settings.threshold_amount}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('Request Payout')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('Create Payout Request')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePayout} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">{t('Amount')}</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min={settings.threshold_amount}
                      max={stats.availableBalance}
                      value={data.amount}
                      onChange={(e) => setData('amount', e.target.value)}
                      placeholder={`Min: $${settings.threshold_amount}`}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{t('Available Balance')}: {formatSuperadminCurrency(stats.availableBalance)}</p>
                    <p>{t('Minimum Amount')}: {formatSuperadminCurrency(settings.threshold_amount)}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      {t('Cancel')}
                    </Button>
                    <Button type="submit" disabled={processing}>
                      {t('Submit Request')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.availableBalance < settings.threshold_amount
                ? t('You need at least {{amount}} to request a payout', { amount: formatSuperadminCurrency(settings.threshold_amount) })
                : t('You can request up to {{amount}} for payout', { amount: formatSuperadminCurrency(stats.availableBalance) })}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {userType === 'superadmin' ? t('All Payout Requests') : t('Your Payout Requests')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {userType === 'superadmin' && <TableHead>{t('Company')}</TableHead>}
                <TableHead>{t('Amount')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead>{t('Date')}</TableHead>
                {userType === 'superadmin' && <TableHead>{t('Actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutRequests.data?.map((request: any) => (
                <TableRow key={request.id}>
                  {userType === 'superadmin' && (
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.company?.name}</p>
                        <p className="text-sm text-muted-foreground">{request.company?.email}</p>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{formatSuperadminCurrency(request.amount)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{window.appSettings?.formatDateTime(request.created_at, false) || new Date(request.created_at).toLocaleDateString()}</TableCell>
                  {userType === 'superadmin' && request.status === 'pending' && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(request)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('Approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectDialog(true);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t('Reject')}
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Reject Payout Request')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4">
            <div>
              <Label htmlFor="notes">{t('Rejection Reason')}</Label>
              <Textarea
                id="notes"
                value={rejectData.notes}
                onChange={(e) => setRejectData('notes', e.target.value)}
                placeholder={t('Enter reason for rejection...')}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowRejectDialog(false)}>
                {t('Cancel')}
              </Button>
              <Button type="submit" variant="destructive" disabled={rejectProcessing}>
                {t('Reject Request')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}