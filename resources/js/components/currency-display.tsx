import React from 'react';
import { formatCompanyCurrency, getCompanyCurrencySymbol } from '@/utils/helpers';
import { usePage } from '@inertiajs/react';

interface CurrencyDisplayProps {
  amount: number | string;
  className?: string;
}

/**
 * Component to display currency using company-specific formatting
 */
export function CurrencyDisplay({ amount, className }: CurrencyDisplayProps) {
  return (
    <span className={className}>
      {formatCompanyCurrency(amount)}
    </span>
  );
}

/**
 * Hook-based currency display for inline usage
 */
export function useCurrencyDisplay() {
  const { props } = usePage();
  const storeCurrency = (props as any).storeCurrency || {};
  
  return {
    formatCurrency: formatCompanyCurrency,
    currencyCode: storeCurrency.code || 'USD',
    currencySymbol: getCompanyCurrencySymbol(),
    currencyName: storeCurrency.name || 'US Dollar'
  };
}

/**
 * Example usage component
 */
export function CurrencyExample() {
  const { formatCurrency, currencyCode, currencySymbol } = useCurrencyDisplay();
  
  return (
    <div className="space-y-2">
      <p>Current Currency: {currencyCode} ({currencySymbol})</p>
      <p>Price: <CurrencyDisplay amount={1234.56} className="font-semibold" /></p>
      <p>Total: {formatCurrency(999.99)}</p>
    </div>
  );
}