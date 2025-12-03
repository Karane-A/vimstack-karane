import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Download, Mail, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

interface Subscriber {
  id: number;
  email: string;
  status: string;
  subscribed_at: string;
}

interface Stats {
  total_subscribers: number;
  active_subscribers: number;
  inactive_subscribers: number;
}

export default function NewsletterSubscribers() {
  const { t } = useTranslation();
  const { props } = usePage();
  const { subscribers, stats } = props as { subscribers: Subscriber[]; stats: Stats };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const { hasPermission } = usePermissions();

  const pageActions = [];
  
  if (hasPermission('view-newsletter-subscribers')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('newsletter-subscribers.export'), '_blank')
    });
  }

  const getStatusVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  return (
    <PageTemplate 
      title={t('Newsletter Subscribers')}
      url="/newsletter-subscribers"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Newsletter Subscribers') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Subscribers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_subscribers}</div>
              <p className="text-xs text-muted-foreground">{t('All time subscribers')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Subscribers')}</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_subscribers}</div>
              <p className="text-xs text-muted-foreground">{t('Currently subscribed')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Inactive Subscribers')}</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive_subscribers}</div>
              <p className="text-xs text-muted-foreground">{t('Unsubscribed')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Newsletter Subscribers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscribers.length > 0 ? subscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{subscriber.email}</p>
                      <p className="text-sm text-muted-foreground">{t('Subscribed on {{date}}', { date: subscriber.subscribed_at })}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(subscriber.status)}>
                      {subscriber.status}
                    </Badge>
                    <Permission permission="delete-newsletter-subscribers">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSubscriberToDelete(subscriber);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Permission>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('No subscribers found.')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Subscriber')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete {{email}}? This action cannot be undone.', { email: subscriberToDelete?.email })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (subscriberToDelete) {
                  router.delete(route('newsletter-subscribers.destroy', subscriberToDelete.id));
                  setDeleteDialogOpen(false);
                  setSubscriberToDelete(null);
                }
              }}
            >
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}