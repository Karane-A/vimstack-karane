import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Zap, CreditCard, Settings, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';

export default function ShowExpressCheckout() {
  const { t } = useTranslation();
  const { checkout, recentTransactions } = usePage().props as any;


  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('express-checkout.index'))
    },
    {
      label: t('Edit Checkout'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('express-checkout.edit', checkout.id))
    }
  ];

  return (
    <PageTemplate 
      title={t('Express Checkout Details')}
      url="/express-checkout/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Express Checkout'), href: route('express-checkout.index') },
        { title: t('Checkout Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{checkout.name}</CardTitle>
                <Badge variant={checkout.is_active ? 'default' : 'secondary'}>
                  {checkout.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-4">
                  {checkout.description || t('No description provided.')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Checkout Type')}</p>
                    <p className="font-semibold">{checkout.type_display}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Button Text')}</p>
                    <p className="font-semibold">{checkout.button_text}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Created Date')}</p>
                    <p>{new Date(checkout.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Last Modified')}</p>
                    <p>{new Date(checkout.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Performance Stats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{checkout.conversions}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Conversions')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(checkout.revenue)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Revenue Generated')}</p>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Payment Methods</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkout.payment_methods && checkout.payment_methods.length > 0 ? (
                <>
                  {checkout.payment_methods.includes('credit_card') && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{t('Credit/Debit Cards')}</span>
                      <Badge variant="default">{t('Enabled')}</Badge>
                    </div>
                  )}
                  {checkout.payment_methods.includes('paypal') && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{t('PayPal')}</span>
                      <Badge variant="default">{t('Enabled')}</Badge>
                    </div>
                  )}
                  {checkout.payment_methods.includes('apple_pay') && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{t('Apple Pay')}</span>
                      <Badge variant="default">{t('Enabled')}</Badge>
                    </div>
                  )}
                  {checkout.payment_methods.includes('google_pay') && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{t('Google Pay')}</span>
                      <Badge variant="default">{t('Enabled')}</Badge>
                    </div>
                  )}
                  {checkout.payment_methods.includes('samsung_pay') && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{t('Samsung Pay')}</span>
                      <Badge variant="default">{t('Enabled')}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{t('Default Method')}</span>
                    <span>
                      {checkout.default_payment_method === 'credit_card' ? t('Credit Cards') :
                       checkout.default_payment_method === 'paypal' ? t('PayPal') :
                       checkout.default_payment_method === 'apple_pay' ? t('Apple Pay') :
                       checkout.default_payment_method === 'google_pay' ? t('Google Pay') :
                       checkout.default_payment_method === 'samsung_pay' ? t('Samsung Pay') :
                       checkout.default_payment_method}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">{t('No payment methods configured')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <CardTitle>Checkout Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Skip Cart Page')}</span>
                <Badge variant={checkout.skip_cart ? 'default' : 'secondary'}>
                  {checkout.skip_cart ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Auto-fill Customer Data')}</span>
                <Badge variant={checkout.auto_fill_customer_data ? 'default' : 'secondary'}>
                  {checkout.auto_fill_customer_data ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Guest Checkout')}</span>
                <Badge variant={checkout.guest_checkout_allowed ? 'default' : 'secondary'}>
                  {checkout.guest_checkout_allowed ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Mobile Optimized')}</span>
                <Badge variant={checkout.mobile_optimized ? 'default' : 'secondary'}>
                  {checkout.mobile_optimized ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Save Payment Methods')}</span>
                <Badge variant={checkout.save_payment_methods ? 'default' : 'secondary'}>
                  {checkout.save_payment_methods ? t('Yes') : t('No')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Recent Transactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{transaction.id} • {transaction.customer}</p>
                        <p className="text-sm text-muted-foreground">{transaction.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">{t('No recent transactions')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}