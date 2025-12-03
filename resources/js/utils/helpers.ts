import { usePage } from '@inertiajs/react';

/**
 * Get superadmin setting value
 */
const getSuperadminSetting = (key: string, pageProps?: any) => {
  try {
    let superadminSettings;
    if (pageProps?.superadminSettings) {
      superadminSettings = pageProps.superadminSettings;
    } else {
      const { props } = usePage();
      superadminSettings = (props as any).superadminSettings || {};
    }
    return superadminSettings[key];
  } catch {
    return null;
  }
};

/**
 * Format currency - works for both superadmin and company pages
 */
const formatCurrency = (amount: number | string, pageProps?: any): string => {
  try {
    const { props } = usePage();
    const allProps = pageProps || props;
    
    const num = Number(amount) || 0;
    // Try all possible settings sources
    const settings = (allProps as any).settings || (allProps as any).globalSettings || (allProps as any).superadminSettings || {};
    
    const decimalPlaces = parseInt(settings.decimalFormat || '2');
    const decimalSeparator = settings.decimalSeparator || '.';
    const thousandsSeparator = settings.thousandsSeparator || ',';
    const currencySymbolSpace = settings.currencySymbolSpace === '1' || settings.currencySymbolSpace === 'true' || settings.currencySymbolSpace === true;
    const currencySymbolPosition = settings.currencySymbolPosition || 'before';
    
    const parts = Number(num).toFixed(decimalPlaces).split('.');

    if (thousandsSeparator !== 'none') {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    }

    const formattedNumber = parts.join(decimalSeparator);
    
    // Check all possible sources for currency symbol
    const symbol = (allProps as any).settings?.currencySymbol || 
                   (allProps as any).globalSettings?.currencySymbol || 
                   (allProps as any).superadminSettings?.currencySymbol || 
                   (allProps as any).storeCurrency?.symbol || 
                   '$';
    
    const space = currencySymbolSpace ? ' ' : '';

    return currencySymbolPosition === 'before'
      ? `${symbol}${space}${formattedNumber}`
      : `${formattedNumber}${space}${symbol}`;
  } catch (error) {
    return `$${Number(amount).toFixed(2)}`;
  }
};

// Format currency using superadmin settings specifically
const formatSuperadminCurrency = (amount: number | string, pageProps?: any): string => {
  try {
    let allProps = pageProps;
    if (!allProps) {
      try {
        const { props } = usePage();
        allProps = props;
      } catch {
        // Use window.appSettings as fallback for CRUD context
        allProps = (window as any).appSettings || {};
      }
    }
    
    const num = Number(amount) || 0;
    // Always use superadmin settings first for company-side pages
    const superadminSettings = (allProps as any)?.superadminSettings || {};
    const globalSettings = (allProps as any)?.globalSettings || {};
    const settings = { ...globalSettings, ...superadminSettings };
    
    const decimalPlaces = parseInt(settings.decimalFormat || '2');
    const decimalSeparator = settings.decimalSeparator || '.';
    const thousandsSeparator = settings.thousandsSeparator || ',';
    const currencySymbolSpace = settings.currencySymbolSpace === '1' || settings.currencySymbolSpace === 'true' || settings.currencySymbolSpace === true;
    const currencySymbolPosition = settings.currencySymbolPosition || 'before';
    
    const parts = Number(num).toFixed(decimalPlaces).split('.');

    if (thousandsSeparator !== 'none') {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    }

    const formattedNumber = parts.join(decimalSeparator);
    
    const symbol = superadminSettings?.currencySymbol || 
                   globalSettings?.currencySymbol || 
                   '$';
    
    const space = currencySymbolSpace ? ' ' : '';

    return currencySymbolPosition === 'before'
      ? `${symbol}${space}${formattedNumber}`
      : `${formattedNumber}${space}${symbol}`;
  } catch (error) {
    return `$${Number(amount).toFixed(2)}`;
  }
};

/**
 * Get currency symbol - works for both superadmin and company pages
 */
const getCurrencySymbol = (pageProps?: any): string => {
  try {
    const { props } = usePage();
    const allProps = pageProps || props;
    return (allProps as any).settings?.currencySymbol || 
           (allProps as any).globalSettings?.currencySymbol || 
           (allProps as any).superadminSettings?.currencySymbol || 
           (allProps as any).storeCurrency?.symbol || 
           '$';
  } catch {
    return '$';
  }
};

// Legacy aliases for backward compatibility
const formatCompanyCurrency = formatCurrency;
const getSuperadminCurrencySymbol = getCurrencySymbol;
const getCompanyCurrencySymbol = getCurrencySymbol;



export {
  formatCurrency,
  getCurrencySymbol,
  formatSuperadminCurrency,
  getSuperadminCurrencySymbol,
  getSuperadminSetting,
  formatCompanyCurrency,
  getCompanyCurrencySymbol
};