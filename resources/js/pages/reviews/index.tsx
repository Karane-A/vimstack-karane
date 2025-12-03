import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { RefreshCw, Download, Star, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

interface Review {
  id: number;
  customer_name: string;
  customer_email: string;
  product_name: string;
  product_image: string;
  rating: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  store_response?: string;
}

interface Stats {
  total_reviews: number;
  average_rating: number;
  pending_reviews: number;
  response_rate: number;
}

export default function Reviews() {
  const { t } = useTranslation();
  const { props } = usePage();
  const { reviews, stats } = props as { reviews: Review[]; stats: Stats };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const { hasPermission } = usePermissions();

  const pageActions = [];
  
  if (hasPermission('view-reviews')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('reviews.export'), '_blank')
    });
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <PageTemplate 
      title={t('Rating & Reviews')}
      url="/reviews"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Rating & Reviews') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Reviews')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_reviews}</div>
              <p className="text-xs text-muted-foreground">{t('All time reviews')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Average Rating')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">{t('Out of 5 stars')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Pending Reviews')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_reviews}</div>
              <p className="text-xs text-muted-foreground">{t('Need moderation')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Response Rate')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.response_rate}%</div>
              <p className="text-xs text-muted-foreground">{t('Reviews responded')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Customer Reviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{review.customer_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{review.customer_name}</h3>
                          <Badge variant={getStatusVariant(review.status)}>
                            {review.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.customer_email} • {review.product_name}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                          <span className="text-sm text-muted-foreground">• {review.created_at}</span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                        <p className="text-sm">{review.content}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Permission permission="view-reviews">
                          <Button variant="ghost" size="sm" onClick={() => router.visit(route('reviews.show', review.id))}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Permission>
                        <Permission permission="edit-reviews">
                          <Button variant="ghost" size="sm" onClick={() => router.visit(route('reviews.edit', review.id))}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Permission>
                        <Permission permission="delete-reviews">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setReviewToDelete(review);
                            setDeleteDialogOpen(true);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Permission>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('No reviews found.')}</p>
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
            <DialogTitle>{t('Delete Review')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete this review from {{name}}? This action cannot be undone.', { name: reviewToDelete?.customer_name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (reviewToDelete) {
                  router.delete(route('reviews.destroy', reviewToDelete.id));
                  setDeleteDialogOpen(false);
                  setReviewToDelete(null);
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