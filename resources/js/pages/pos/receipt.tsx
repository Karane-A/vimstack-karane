import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';

export default function POSReceipt() {
  const { t } = useTranslation();

  const { transaction, settings } = usePage().props as any;
  
  // Format transaction data for receipt
  const receipt = {
    id: transaction.transaction_number,
    date: new Date(transaction.created_at).toLocaleDateString(),
    time: new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    customer: transaction.customer ? `${transaction.customer.first_name} ${transaction.customer.last_name}` : 'Walk-in Customer',
    cashier: `${transaction.cashier.name}`,
    items: transaction.items.map((item: any) => ({
      id: item.id,
      name: item.variant_name ? `${item.product_name} (${item.variant_name})` : item.product_name,
      price: parseFloat(item.price),
      quantity: item.quantity
    })),
    subtotal: parseFloat(transaction.subtotal),
    tax: parseFloat(transaction.tax),
    total: parseFloat(transaction.total),
    paymentMethod: transaction.payments[0]?.payment_method || 'Unknown'
  };

  useEffect(() => {
    // Auto-print when component loads
    window.print();
  }, []);

  return (
    <div className="p-8 max-w-md mx-auto bg-white print:p-0">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">My Store</h1>
        <p className="text-sm">123 Main Street, City, State 12345</p>
        <p className="text-sm">Tel: (555) 123-4567</p>
      </div>

      <div className="border-t border-b py-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Receipt #:</span>
          <span>{receipt.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span>{receipt.date} {receipt.time}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Cashier:</span>
          <span>{receipt.cashier}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Customer:</span>
          <span>{receipt.customer}</span>
        </div>
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1 text-sm">Item</th>
            <th className="text-center py-1 text-sm">Qty</th>
            <th className="text-right py-1 text-sm">Price</th>
            <th className="text-right py-1 text-sm">Total</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-1 text-sm">{item.name}</td>
              <td className="text-center py-1 text-sm">{item.quantity}</td>
              <td className="text-right py-1 text-sm">{formatCurrency(item.price)}</td>
              <td className="text-right py-1 text-sm">{formatCurrency(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrency(receipt.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (10%):</span>
          <span>{formatCurrency(receipt.tax)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-1">
          <span>Total:</span>
          <span>{formatCurrency(receipt.total)}</span>
        </div>
      </div>

      <div className="border-t pt-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Payment Method:</span>
          <span>{receipt.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Amount Paid:</span>
          <span>{formatCurrency(receipt.total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Change:</span>
          <span>{formatCurrency(0)}</span>
        </div>
      </div>

      <div className="text-center text-sm mt-6">
        <p>{settings?.receipt_header || 'Thank you for shopping with us!'}</p>
        <p>{settings?.receipt_footer || 'All sales are final. Returns accepted within 30 days with receipt.'}</p>
      </div>
    </div>
  );
}