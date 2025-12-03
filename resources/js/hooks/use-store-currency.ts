import { usePage } from '@inertiajs/react';

interface StoreCurrency {
  code: string;
  symbol: string;
  name: string;
  position: string;
  decimals: number;
  decimal_separator: string;
  thousands_separator: string;
}

interface PageProps {
  storeCurrency: StoreCurrency;
}

/**
 * Hook to access store-specific currency settings
 */
export function useStoreCurrency(): StoreCurrency {
  const { props } = usePage<PageProps>();
  
  return props.storeCurrency || {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before',
    decimals: 2,
    decimal_separator: '.',
    thousands_separator: ','
  };
}

/**
 * Hook to format currency using store settings
 */
export function useCurrencyFormatter() {
  const storeCurrency = useStoreCurrency();
  
  return (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return `${storeCurrency.symbol}0${storeCurrency.decimal_separator}${'0'.repeat(storeCurrency.decimals)}`;

    // Format with specified decimal places
    const formattedNumber = numAmount.toFixed(storeCurrency.decimals);
    
    // Split into integer and decimal parts
    const parts = formattedNumber.split('.');
    
    // Add thousands separator
    if (storeCurrency.thousands_separator) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, storeCurrency.thousands_separator);
    }

    // Join with decimal separator
    const finalNumber = parts.join(storeCurrency.decimal_separator);

    // Return with currency symbol in correct position
    return storeCurrency.position === 'after' 
      ? `${finalNumber} ${storeCurrency.symbol}`
      : `${storeCurrency.symbol} ${finalNumber}`;
  };
}