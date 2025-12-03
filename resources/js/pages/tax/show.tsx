import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';

export default function ShowTax() {
  const { t } = useTranslation();
  const { tax, stats, products } = usePage().props as any;


  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('tax.index'))
    },
    {
      label: t('Edit Tax'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('tax.edit', tax.id))
    }
  ];

  return (
    <PageTemplate 
      title={t('Tax Rule Details')}
      url="/tax/show"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Tax Management', href: route('tax.index') },
        { title: 'Tax Rule Details' }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Tax Rule Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Tax Name')}</p>
                <p className="text-lg font-semibold">{tax.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Tax Rate')}</p>
                <p className="text-lg font-semibold">{tax.rate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Tax Type')}</p>
                <p>{tax.type === 'percentage' ? t('Percentage') : t('Fixed Amount')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Region')}</p>
                <p>{tax.region || t('Global')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Status')}</p>
                <Badge variant={tax.is_active ? "default" : "secondary"}>
                  {tax.is_active ? t('Active') : t('Inactive')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Tax Configuration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Priority')}</span>
                <span className="font-semibold">{tax.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Compound Tax')}</span>
                <span className="font-semibold">{tax.compound ? t('Yes') : t('No')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Created Date')}</span>
                <span className="font-semibold">{new Date(tax.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Products Using Tax')}</span>
                <span className="font-semibold">{stats.products_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Last Updated')}</span>
                <span className="font-semibold">{new Date(tax.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Tax Statistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats.collected || 0)}</p>
                <p className="text-sm text-muted-foreground">{t('Tax Collected This Month')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.orders || 0}</p>
                <p className="text-sm text-muted-foreground">{t('Orders Applied')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats.total || 0)}</p>
                <p className="text-sm text-muted-foreground">{t('Total Tax Collected')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.products_count || 0}</p>
                <p className="text-sm text-muted-foreground">{t('Products Using This Tax')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {products && products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Products Using This Tax')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? t('Active') : t('Inactive')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
}