import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Receipt, Printer, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';

export default function POSCheckout() {
  const { t } = useTranslation();
  const { settings } = usePage().props as any;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get cart data from localStorage
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    const cartData = localStorage.getItem('pos_cart');
    const customerData = localStorage.getItem('pos_customer');
    
    if (cartData) {
      const cart = JSON.parse(cartData);
      const customer = customerData ? JSON.parse(customerData) : { id: 'walk-in', name: 'Walk-in Customer' };
      
      // Calculate totals
      const items = cart;
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const taxRate = settings?.tax_rate ? settings.tax_rate / 100 : 0.1;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      
      setOrder({
        id: 'POS-' + new Date().getTime(),
        items,
        customer,
        subtotal,
        tax,
        total
      });
      setIsLoading(false);
    } else {
      // Redirect back to POS if no cart data
      router.visit(route('pos.index'));
    }
  }, []);

  const pageActions = [
    {
      label: t('Back to POS'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('pos.index'))
    }
  ];

  // Order data is now loaded from localStorage in useEffect

  const handlePayment = () => {
    if (!order) return;
    
    setIsProcessing(true);
    
    const paymentData = {
      items: order.items,
      customer_id: order.customer.id,
      payment_method: 'pos',
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      amount_received: order.total,
      reference_number: 'POS-' + new Date().getTime()
    };
    
    // Send payment data to the server
    fetch(route('pos.process-transaction'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(paymentData)
    })
    .then(async response => {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    })
    .then(data => {
      if (data.success) {
        setTransactionId(data.transaction_id);
        setIsProcessing(false);
        setIsComplete(true);
        
        // Clear cart data
        localStorage.removeItem('pos_cart');
        localStorage.removeItem('pos_customer');
      } else {
        setIsProcessing(false);
        if (data.outOfStockItems && data.outOfStockItems.length > 0) {
          const itemNames = data.outOfStockItems.map(item => 
            `${item.name} (requested: ${item.requested}, available: ${item.available})`
          ).join('\n');
          alert(`Some items are out of stock:\n${itemNames}`);
        } else {
          alert(data.message || 'Payment failed. Please try again.');
        }
      }
    })
    .catch(error => {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
      alert(error.message || 'Payment failed. Please try again.');
    });
  };



  return (
    <PageTemplate 
      title={t('POS Checkout')}
      url="/pos/checkout"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Point of Sale (POS)'), href: route('pos.index') },
        { title: t('Checkout') }
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Order Summary */}
        <div className="lg:w-2/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('Order Summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">{t('Product')}</th>
                        <th className="text-center p-3">{t('Quantity')}</th>
                        <th className="text-right p-3">{t('Price')}</th>
                        <th className="text-right p-3">{t('Total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.items?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{item.name}</td>
                          <td className="text-center p-3">{item.quantity}</td>
                          <td className="text-right p-3">{formatCurrency(item.price)}</td>
                          <td className="text-right p-3">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Subtotal')}</span>
                    <span>{formatCurrency(order?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Tax ({{rate}}%)', { rate: settings?.tax_rate || 10 })}</span>
                    <span>{formatCurrency(order?.tax || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>{t('Total')}</span>
                    <span>{formatCurrency(order?.total || 0)}</span>
                  </div>
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {isComplete && (
            <Card className="border-green-500">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold">{t('Payment Complete')}</h2>
                  <p className="text-muted-foreground">{t('Order #{{id}} has been processed successfully', { id: order?.id || t('Unknown') })}</p>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" onClick={() => router.visit(route('pos.index'))}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('New Sale')}
                    </Button>
                    <Button onClick={() => router.visit(route('pos.receipt', transactionId))}>
                      <Printer className="mr-2 h-4 w-4" />
                      {t('Print Receipt')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Complete Order */}
        <div className="lg:w-1/3">
          {!isComplete && (
            <Card>
              <CardHeader>
                <CardTitle>{t('Complete Order')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      {t('Processing...')}
                    </div>
                  ) : (
                    <>
                      <Receipt className="mr-2 h-4 w-4" />
                      {t('Complete Order - {{amount}}', { amount: formatCurrency(order?.total || 0) })}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}