import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Star, User, Package, Calendar, CheckCircle, XCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { router, usePage, useForm } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';

interface Review {
  id: number;
  customer_name: string;
  customer_email: string;
  product_name: string;
  product_image: string;
  product_sku: string;
  product_price: number;
  rating: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  store_response?: string;
}

export default function ShowReview() {
  const { t } = useTranslation();
  const { props } = usePage();
  const { review } = props as { review: Review };
  const [showResponseForm, setShowResponseForm] = useState(false);

  
  const { data, setData, post, processing, reset } = useForm({
    store_response: '',
  });

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('reviews.index'))
    },
    ...(review.status !== 'Approved' ? [{
      label: t('Approve'),
      icon: <CheckCircle className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.post(route('reviews.approve', review.id))
    }] : []),
    {
      label: t('Edit Review'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('reviews.edit', review.id))
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <PageTemplate 
      title={t('Review Details')}
      url="/reviews/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Rating & Reviews'), href: route('reviews.index') },
        { title: t('Review Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('Customer Review')}</CardTitle>
                <Badge variant={review.status === 'Approved' ? 'default' : 'secondary'}>{review.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{review.customer_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{review.customer_name}</h3>
                  <p className="text-muted-foreground">{review.customer_email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-lg font-medium">({review.rating}/5)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 leading-relaxed">
                  {review.content}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Review Actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {review.status !== 'Approved' && (
                <Button className="w-full" onClick={() => router.post(route('reviews.approve', review.id))}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('Approve Review')}
                </Button>
              )}
              {review.status === 'Approved' && (
                <Button variant="destructive" className="w-full" onClick={() => router.post(route('reviews.reject', review.id))}>
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('Reject Review')}
                </Button>
              )}
              <Button variant="outline" className="w-full" onClick={() => router.visit(route('reviews.edit', review.id))}>
                {t('Edit Review')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <CardTitle>{t('Product Information')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden border">
                  <img
                    src={getImageUrl(review.product_image)}
                    alt={review.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{review.product_name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {review.product_sku}</p>
                  <p className="text-sm font-medium">{formatCurrency(review.product_price)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>{t('Review Details')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Review Date')}</span>
                <span>{review.created_at}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Status')}</span>
                <Badge variant={review.status === 'Approved' ? 'default' : 'secondary'}>{review.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Rating')}</span>
                <span>{t('{{rating}}/5 Stars', { rating: review.rating })}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Store Response')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {review.store_response ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{review.store_response}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setShowResponseForm(!showResponseForm)}
                  >
                    {t('Update Response')}
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">{t('No response yet')}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowResponseForm(!showResponseForm)}
                  >
                    {t('Add Response')}
                  </Button>
                </div>
              )}
              
              {showResponseForm && (
                <div className="space-y-3">
                  <Textarea
                    placeholder={t('Write your response to this review...')}
                    value={data.store_response}
                    onChange={(e) => setData('store_response', e.target.value)}
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        post(route('reviews.add-response', review.id), {
                          onSuccess: () => {
                            reset();
                            setShowResponseForm(false);
                          }
                        });
                      }}
                      disabled={processing || !data.store_response.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {processing ? t('Sending...') : t('Send Response')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setShowResponseForm(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}