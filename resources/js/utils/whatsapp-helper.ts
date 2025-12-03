/**
 * WhatsApp Helper Utilities
 */

export interface WhatsAppRedirectOptions {
  number: string;
  message: string;
  autoRedirect?: boolean;
  delay?: number;
}

/**
 * Clean and format WhatsApp number
 */
export function cleanWhatsAppNumber(number: string): string {
  // Remove all non-numeric characters except +
  let cleaned = number.replace(/[^0-9+]/g, '');
  
  // Remove + if present and add it back
  cleaned = cleaned.replace(/^\+/, '');
  
  return cleaned;
}

/**
 * Create WhatsApp URL
 */
export function createWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = cleanWhatsAppNumber(number);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Redirect to WhatsApp
 */
export function redirectToWhatsApp(options: WhatsAppRedirectOptions): void {
  const { number, message, autoRedirect = true, delay = 1000 } = options;
  const whatsappUrl = createWhatsAppUrl(number, message);
  
  if (autoRedirect) {
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, delay);
  } else {
    window.open(whatsappUrl, '_blank');
  }
}

/**
 * Check if device supports WhatsApp
 */
export function isWhatsAppSupported(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // WhatsApp is supported on all devices, but works better on mobile
  return true;
}

/**
 * Get WhatsApp redirect data from session storage
 */
export function getWhatsAppRedirectData(): { url: string; orderId: string } | null {
  try {
    const url = sessionStorage.getItem('whatsapp_redirect_url');
    const orderId = sessionStorage.getItem('whatsapp_order_id');
    
    if (url && orderId) {
      return { url, orderId };
    }
  } catch (error) {
    console.error('Error reading WhatsApp redirect data:', error);
  }
  
  return null;
}

/**
 * Clear WhatsApp redirect data from session storage
 */
export function clearWhatsAppRedirectData(): void {
  try {
    sessionStorage.removeItem('whatsapp_redirect_url');
    sessionStorage.removeItem('whatsapp_order_id');
    sessionStorage.removeItem('whatsapp_message_sent');
  } catch (error) {
    console.error('Error clearing WhatsApp redirect data:', error);
  }
}

/**
 * Handle WhatsApp redirect with user confirmation
 */
export function handleWhatsAppRedirect(url: string, orderId: string): void {
  const confirmed = window.confirm(
    'Your order has been placed successfully! Would you like to open WhatsApp to send the order details?'
  );
  
  if (confirmed) {
    window.open(url, '_blank');
    clearWhatsAppRedirectData();
  }
}