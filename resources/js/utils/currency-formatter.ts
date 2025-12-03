interface CurrencySettings {
  defaultCurrency?: string;
  decimalFormat?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  currencySymbolPosition?: string;
  currencySymbolSpace?: boolean | string;
  floatNumber?: boolean | string;
}

interface Currency {
  code: string;
  symbol: string;
}

interface StoreCurrency {
  code: string;
  symbol: string;
  name: string;
  position: string;
  decimals: number;
  decimal_separator: string;
  thousands_separator: string;
}

/**
 * Format currency using dynamic store currency settings
 */
export function formatStoreCurrency(
  amount: number | string,
  storeCurrency?: StoreCurrency
): string {
  // Get store currency from window.page.props if not provided
  if (!storeCurrency && typeof window !== 'undefined' && (window as any).page?.props?.storeCurrency) {
    storeCurrency = (window as any).page.props.storeCurrency;
  }
  
  // Default fallback
  const currency = storeCurrency || {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before',
    decimals: 2,
    decimal_separator: '.',
    thousands_separator: ','
  };

  // Convert amount to number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `${currency.symbol}0${currency.decimal_separator}${'0'.repeat(currency.decimals)}`;

  // Format with specified decimal places
  const formattedNumber = numAmount.toFixed(currency.decimals);
  
  // Split into integer and decimal parts
  const parts = formattedNumber.split('.');
  
  // Add thousands separator
  if (currency.thousands_separator) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousands_separator);
  }

  // Join with decimal separator
  const finalNumber = parts.join(currency.decimal_separator);

  // Return with currency symbol in correct position
  return currency.position === 'after' 
    ? `${finalNumber} ${currency.symbol}`
    : `${currency.symbol} ${finalNumber}`;
}

/**
 * Format currency based on store settings (legacy function - kept for backward compatibility)
 */
export function formatCurrency(
  amount: number | string, 
  storeSettings: CurrencySettings = {}, 
  currencies: Currency[] = []
): string {
  const {
    defaultCurrency = 'USD',
    decimalFormat = '2',
    decimalSeparator = '.',
    thousandsSeparator = ',',
    currencySymbolPosition = 'before',
    currencySymbolSpace = false,
    floatNumber = true
  } = storeSettings;

  // Convert amount to number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '$0.00';

  // Get currency symbol
  const currency = currencies.find(c => c.code === defaultCurrency);
  const symbol = currency?.symbol || '$';

  // Handle float number setting
  const finalAmount = (floatNumber === false || floatNumber === '0') 
    ? Math.floor(numAmount) 
    : numAmount;

  // Format decimal places
  const decimalPlaces = parseInt(decimalFormat) || 2;
  const formattedNumber = finalAmount.toFixed(decimalPlaces);

  // Split into integer and decimal parts
  const parts = formattedNumber.split('.');
  
  // Add thousands separator
  if (thousandsSeparator && thousandsSeparator !== 'none') {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  }

  // Join with decimal separator
  const finalNumber = parts.join(decimalSeparator);

  // Add currency symbol with proper positioning and spacing
  const space = (currencySymbolSpace === true || currencySymbolSpace === '1') ? ' ' : '';
  
  return currencySymbolPosition === 'after' 
    ? `${finalNumber}${space}${symbol}`
    : `${symbol}${space}${finalNumber}`;
}