import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { router, usePage, useForm } from '@inertiajs/react';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

interface Review {
  id: number;
  customer_name: string;
  customer_email: string;
  product_name: string;
  rating: number;
  title: string;
  content: string;
  is_approved: boolean;
  store_response?: string;
}

export default function EditReview() {
  const { t } = useTranslation();
  const { props } = usePage();
  const { review } = props as { review: Review };
  const { hasPermission } = usePermissions();
  
  const { data, setData, put, processing, errors } = useForm({
    rating: review.rating,
    title: review.title,
    content: review.content,
    is_approved: review.is_approved,
    store_response: review.store_response || '',
  });

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('reviews.index'))
    }
  ];
  
  if (hasPermission('edit-reviews')) {
    pageActions.push({
      label: t('Update Review'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => put(route('reviews.update', review.id))
    });
  }

  return (
    <PageTemplate 
      title={t('Edit Review')}
      url="/reviews/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Rating & Reviews'), href: route('reviews.index') },
        { title: t('Edit Review') }
      ]}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Review Information')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">{t('Customer Name')}</Label>
                <Input id="customer_name" value={review.customer_name} disabled />
              </div>
              <div>
                <Label htmlFor="customer_email">{t('Customer Email')}</Label>
                <Input id="customer_email" value={review.customer_email} disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="product">{t('Product')}</Label>
              <Input value={review.product_name} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">{t('Rating')}</Label>
                <Select value={data.rating.toString()} onValueChange={(value) => setData('rating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('1 Star')}</SelectItem>
                    <SelectItem value="2">{t('2 Stars')}</SelectItem>
                    <SelectItem value="3">{t('3 Stars')}</SelectItem>
                    <SelectItem value="4">{t('4 Stars')}</SelectItem>
                    <SelectItem value="5">{t('5 Stars')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rating && <p className="text-sm text-red-600 mt-1">{errors.rating}</p>}
              </div>
              <Permission permission="approve-reviews">
                <div>
                  <Label htmlFor="status">{t('Review Status')}</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch 
                      checked={data.is_approved} 
                      onCheckedChange={(checked) => setData('is_approved', checked)}
                    />
                    <span className="text-sm">{data.is_approved ? t('Approved') : t('Pending')}</span>
                  </div>
                </div>
              </Permission>
            </div>
            <div>
              <Label htmlFor="title">{t('Review Title')}</Label>
              <Input 
                id="title" 
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>
            <div>
              <Label htmlFor="review_content">{t('Review Content')}</Label>
              <Textarea 
                id="review_content" 
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                rows={4} 
              />
              {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
            </div>
            <div>
              <Label htmlFor="store_response">{t('Store Response')}</Label>
              <Textarea 
                id="store_response" 
                value={data.store_response}
                onChange={(e) => setData('store_response', e.target.value)}
                placeholder={t('Add your response to this review...')}
                rows={3} 
              />
              {errors.store_response && <p className="text-sm text-red-600 mt-1">{errors.store_response}</p>}
            </div>

          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}