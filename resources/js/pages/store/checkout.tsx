import React, { useState, useEffect } from 'react';

// Extend Window interface for Stripe and Cashfree
declare global {
  interface Window {
    Stripe: any;
    Cashfree: any;
  }
}
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, CreditCard, Truck, MapPin, User, Mail, Phone, Check, Lock } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';
import { handleOrderPlacement as handleCashfreeOrderPlacement, CashfreePaymentData } from '@/utils/cashfree-payment';
import { handleOrderPlacement as handleRazorpayOrderPlacement } from '@/utils/razorpay-payment';
import '../../../css/cashfree-modal-fix.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image: string;
  quantity: number;
  stock: number;
  is_active: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  cost: number;
  delivery_time: string;
  type: string;
  zone_type: string;
  countries: string;
  min_order_amount: number;
  handling_fee: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  shippingMethods: ShippingMethod[];
  enabledPaymentMethods?: any;
  user?: User;
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  countries?: any[];
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function Checkout({
  cartItems = [],
  cartSummary,
  shippingMethods = [],
  enabledPaymentMethods = {},
  user,
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  countries = [],
  customPages = [],
}: CheckoutProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific checkout pages to avoid circular dependencies
  const [ThemeCheckoutPage, setThemeCheckoutPage] = React.useState<React.ComponentType<any> | null>(null);
  
  React.useEffect(() => {
    const loadThemeCheckoutPage = async () => {
      try {
        let checkoutPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            checkoutPageModule = await import('@/pages/store/beauty-cosmetics/BeautyCheckout');
            break;
          case 'fashion':
            checkoutPageModule = await import('@/pages/store/fashion/FashionCheckout');
            break;
          case 'electronics':
            checkoutPageModule = await import('@/pages/store/electronics/ElectronicsCheckout');
            break;
          case 'jewelry':
            checkoutPageModule = await import('@/pages/store/jewelry/JewelryCheckout');
            break;
          case 'watches':
            checkoutPageModule = await import('@/pages/store/watches/WatchesCheckout');
            break;
          case 'furniture-interior':
            checkoutPageModule = await import('@/pages/store/furniture-interior/FurnitureCheckout');
            break;
          case 'cars-automotive':
            checkoutPageModule = await import('@/pages/store/cars-automotive/CarsCheckout');
            break;
          case 'baby-kids':
            checkoutPageModule = await import('@/pages/store/baby-kids/BabyKidsCheckout');
            break;
          case 'perfume-fragrances':
            checkoutPageModule = await import('@/pages/store/perfume-fragrances/PerfumeCheckout');
            break;
          default:
            setThemeCheckoutPage(null);
            return;
        }
        setThemeCheckoutPage(() => checkoutPageModule.default);
      } catch (error) {
        console.error('Failed to load theme checkout page:', error);
        setThemeCheckoutPage(null);
      }
    };
    
    if (actualTheme !== 'default' && actualTheme !== 'home-accessories') {
      loadThemeCheckoutPage();
    }
  }, [actualTheme]);
  
  // If theme has a specific checkout page, use it
  if (ThemeCheckoutPage) {
    return (
      <ThemeCheckoutPage
        cartItems={cartItems}
        cartSummary={cartSummary}
        shippingMethods={shippingMethods}
        enabledPaymentMethods={enabledPaymentMethods}
        user={user}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        countries={countries}
        customPages={customPages}
      />
    );
  }
  
  const storeSlug = store.slug || 'demo';
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  // Default user data if user is undefined
  const defaultUser = {
    id: 0,
    name: userName || '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    }
  };
  
  // Use user data if available, otherwise use default
  const userData = user || defaultUser;
  // Checkout steps
  const steps = [
    { id: 'shipping', name: 'Shipping' },
    { id: 'review', name: 'Review' },
    { id: 'payment', name: 'Payment' },
  ];
  
  const [currentStep, setCurrentStep] = useState('shipping');
  
  // Shipping form state
  const [shippingFirstName, setShippingFirstName] = useState(userData.name.split(' ')[0] || '');
  const [shippingLastName, setShippingLastName] = useState(userData.name.split(' ')[1] || '');
  const [shippingEmail, setShippingEmail] = useState(userData.email);
  const [shippingPhone, setShippingPhone] = useState(userData.phone);
  const [shippingStreet, setShippingStreet] = useState(userData.address.street);
  const [shippingCity, setShippingCity] = useState(userData.address.city);
  const [shippingState, setShippingState] = useState(userData.address.state);
  const [shippingZip, setShippingZip] = useState(userData.address.zip);
  const [shippingCountry, setShippingCountry] = useState(userData.address.country);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  
  // Billing form state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState(userData.name.split(' ')[0] || '');
  const [billingLastName, setBillingLastName] = useState(userData.name.split(' ')[1] || '');
  const [billingEmail, setBillingEmail] = useState(userData.email);
  const [billingPhone, setBillingPhone] = useState(userData.phone);
  const [billingStreet, setBillingStreet] = useState(userData.address.street);
  const [billingCity, setBillingCity] = useState(userData.address.city);
  const [billingState, setBillingState] = useState(userData.address.state);
  const [billingZip, setBillingZip] = useState(userData.address.zip);
  const [billingCountry, setBillingCountry] = useState(userData.address.country);
  const [billingStates, setBillingStates] = useState([]);
  const [billingCities, setBillingCities] = useState([]);
  const [loadingBillingStates, setLoadingBillingStates] = useState(false);
  const [loadingBillingCities, setLoadingBillingCities] = useState(false);
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  
  // Order notes and coupon code
  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [apiTotal, setApiTotal] = useState(null);
  
  // Handle country change for shipping
  const handleShippingCountryChange = async (countryId: string) => {
    const selectedCountry = countries?.find((c: any) => c.id.toString() === countryId);
    setSelectedCountryName(selectedCountry?.name || '');
    setShippingCountry(countryId);
    setShippingState('');
    setShippingCity('');
    setSelectedStateName('');
    setSelectedCityName('');
    setStates([]);
    setCities([]);
    
    if (countryId) {
      setLoadingStates(true);
      try {
        const response = await fetch(route('api.locations.states', countryId));
        const data = await response.json();
        setStates(data.states || []);
      } catch (error) {
        console.error('Failed to load states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    }
  };
  
  // Handle state change for shipping
  const handleShippingStateChange = async (stateId: string) => {
    const selectedState = states.find((s: any) => s.id.toString() === stateId);
    setSelectedStateName(selectedState?.name || '');
    setShippingState(stateId);
    setShippingCity('');
    setSelectedCityName('');
    setCities([]);
    
    if (stateId) {
      setLoadingCities(true);
      try {
        const response = await fetch(route('api.locations.cities', stateId));
        const data = await response.json();
        setCities(data.cities || []);
      } catch (error) {
        console.error('Failed to load cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    }
  };
  
  // Handle country change for billing
  const handleBillingCountryChange = async (countryId: string) => {
    setBillingCountry(countryId);
    setBillingState('');
    setBillingCity('');
    setBillingStates([]);
    setBillingCities([]);
    
    if (countryId) {
      setLoadingBillingStates(true);
      try {
        const response = await fetch(route('api.locations.states', countryId));
        const data = await response.json();
        setBillingStates(data.states || []);
      } catch (error) {
        console.error('Failed to load states:', error);
        setBillingStates([]);
      } finally {
        setLoadingBillingStates(false);
      }
    }
  };
  
  // Handle state change for billing
  const handleBillingStateChange = async (stateId: string) => {
    setBillingState(stateId);
    setBillingCity('');
    setBillingCities([]);
    
    if (stateId) {
      setLoadingBillingCities(true);
      try {
        const response = await fetch(route('api.locations.cities', stateId));
        const data = await response.json();
        setBillingCities(data.cities || []);
      } catch (error) {
        console.error('Failed to load cities:', error);
        setBillingCities([]);
      } finally {
        setLoadingBillingCities(false);
      }
    }
  };

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setShippingErrors({});
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    
    if (!shippingFirstName) {
      newErrors.shippingFirstName = 'First name is required';
    }
    
    if (!shippingLastName) {
      newErrors.shippingLastName = 'Last name is required';
    }
    
    if (!shippingEmail) {
      newErrors.shippingEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingEmail)) {
      newErrors.shippingEmail = 'Email is invalid';
    }
    
    if (!shippingPhone) {
      newErrors.shippingPhone = 'Phone number is required';
    }
    
    if (!shippingStreet) {
      newErrors.shippingStreet = 'Street address is required';
    }
    
    if (!shippingCity) {
      newErrors.shippingCity = 'City is required';
    }
    
    if (!shippingState) {
      newErrors.shippingState = 'State is required';
    }
    
    if (!shippingZip) {
      newErrors.shippingZip = 'ZIP code is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setShippingErrors(newErrors);
      return;
    }
    
    // Proceed to review step
    setCurrentStep('review');
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setPaymentErrors({});
    
    // Validate WhatsApp number if WhatsApp payment is selected
    if (paymentMethod === 'whatsapp') {
      const newErrors: Record<string, string> = {};
      
      if (!whatsappNumber) {
        newErrors.whatsappNumber = 'WhatsApp number is required';
      } else {
        // Basic phone number validation (digits only, 10-15 characters)
        const phoneRegex = /^[+]?[0-9]{10,15}$/;
        if (!phoneRegex.test(whatsappNumber.replace(/\s+/g, ''))) {
          newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setPaymentErrors(newErrors);
        return;
      }
    }
    
    // Proceed to review step
    setCurrentStep('review');
  };
  
  // Handle WhatsApp number validation on input change
  const handleWhatsAppNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWhatsappNumber(value);
    
    // Clear previous errors
    if (paymentErrors.whatsappNumber) {
      setPaymentErrors(prev => ({ ...prev, whatsappNumber: '' }));
    }
    
    // Real-time validation
    if (value && paymentMethod === 'whatsapp') {
      const phoneRegex = /^[+]?[0-9]{10,15}$/;
      if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
        setPaymentErrors(prev => ({ ...prev, whatsappNumber: 'Please enter a valid WhatsApp number' }));
      }
    }
  };
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    // Validate WhatsApp number if WhatsApp payment is selected
    if (paymentMethod === 'whatsapp') {
      const newErrors: Record<string, string> = {};
      
      if (!whatsappNumber) {
        newErrors.whatsappNumber = 'WhatsApp number is required';
      } else {
        const phoneRegex = /^[+]?[0-9]{10,15}$/;
        if (!phoneRegex.test(whatsappNumber.replace(/\s+/g, ''))) {
          newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setPaymentErrors(newErrors);
        return; // Stop execution if validation fails
      }
    }

    const orderData = {
      store_id: store.id,
      customer_first_name: shippingFirstName,
      customer_last_name: shippingLastName,
      customer_email: shippingEmail,
      customer_phone: shippingPhone,
      shipping_address: shippingStreet,
      shipping_city: shippingCity,
      shipping_state: shippingState,
      shipping_postal_code: shippingZip,
      shipping_country: shippingCountry,
      billing_address: sameAsShipping ? shippingStreet : billingStreet,
      billing_city: sameAsShipping ? shippingCity : billingCity,
      billing_state: sameAsShipping ? shippingState : billingState,
      billing_postal_code: sameAsShipping ? shippingZip : billingZip,
      billing_country: sameAsShipping ? shippingCountry : billingCountry,
      payment_method: paymentMethod,
      shipping_method_id: selectedShippingId,
      notes: orderNotes,
      coupon_code: couponApplied ? couponCode : null,
      whatsapp_number: paymentMethod === 'whatsapp' ? whatsappNumber : null,
    };

    // Use appropriate utility based on payment method
    if (paymentMethod === 'cashfree') {
      await handleCashfreeOrderPlacement(orderData, storeSlug, (error: string) => {
        setPaymentErrors({ general: error });
      });
    } else if (paymentMethod === 'razorpay') {
      await handleRazorpayOrderPlacement(
        orderData,
        storeSlug,
        (orderNumber: string) => {
          // Redirect to success page
          window.location.href = route('store.order-confirmation', {
            storeSlug,
            orderNumber
          });
        },
        (error: string) => {
          setPaymentErrors({ general: error });
        }
      );
    } else {
      // Handle other payment methods with form submission
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = route('store.order.place', { storeSlug });
      
      // Add CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      // Add form data
      Object.entries(orderData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });
      
      document.body.appendChild(form);
      form.submit();
    }
  };
  

  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format card expiry date
  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  // Get selected shipping method
  const selectedShipping = shippingMethods.find(method => method.id === selectedShippingId);
  
  // Calculate shipping cost
  const getShippingCost = () => {
    if (!selectedShipping) return 0;
    
    // For free shipping type, return 0 if minimum is met
    if (selectedShipping.type === 'free_shipping' && cartSummary.subtotal >= (selectedShipping.min_order_amount || 0)) {
      return 0;
    }
    
    return parseFloat(selectedShipping.cost) + parseFloat(selectedShipping.handling_fee || 0);
  };
  
  // Calculate updated cart summary
  const updatedCartSummary = {
    ...cartSummary,
    shipping: getShippingCost(),
    discount: couponApplied ? couponDiscount : cartSummary.discount,
    total: couponApplied ? cartSummary.subtotal - couponDiscount + getShippingCost() + cartSummary.tax : cartSummary.subtotal - cartSummary.discount + getShippingCost() + cartSummary.tax,
  };

  return (
    <>
      <Head title={`Checkout - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        storeContent={storeContent}
        theme={actualTheme}
      >
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Checkout</h1>
              <p className="text-white/80">
                Complete your purchase securely
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <Link href={route('store.cart', { storeSlug })} className="text-gray-500 hover:text-primary">Cart</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Checkout</span>
            </div>
          </div>
        </div>
        
        {/* Checkout Steps */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Progress bar background */}
                <div className="absolute inset-0 flex items-center mt-4" aria-hidden="true">
                  <div className="h-1 w-full bg-gray-200 rounded-full shadow-inner"></div>
                </div>
                
                {/* Progress bar filled */}
                <div className="absolute inset-0 flex items-center mt-4" aria-hidden="true">
                  <div 
                    className="h-1.5 bg-gradient-to-r from-primary to-primary-600 rounded-full shadow-sm transition-all duration-500 ease-in-out" 
                    style={{
                      width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%`
                    }}
                  ></div>
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, stepIdx) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className="flex items-center justify-center mb-2">
                          <div 
                            className={`
                              h-8 w-8 rounded-full flex items-center justify-center shadow-sm
                              ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary' : 'bg-white border border-gray-100'}
                              transition-all duration-300 ease-in-out
                            `}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4 text-white" />
                            ) : (
                              <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                {stepIdx + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <span 
                            className={`
                              text-sm font-medium
                              ${isActive ? 'text-primary font-semibold' : isCompleted ? 'text-primary' : 'text-gray-500'}
                            `}
                          >
                            {step.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Enter your shipping details and choose a shipping method.
                      </p>
                    </div>
                    
                    <form onSubmit={handleShippingSubmit} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="shipping-first-name" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="shipping-first-name"
                              type="text"
                              value={shippingFirstName}
                              onChange={(e) => setShippingFirstName(e.target.value)}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                shippingErrors.shippingFirstName ? 'border-red-500' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                            />
                          </div>
                          {shippingErrors.shippingFirstName && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                          )}
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label htmlFor="shipping-last-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            id="shipping-last-name"
                            type="text"
                            value={shippingLastName}
                            onChange={(e) => setShippingLastName(e.target.value)}
                            className={`block w-full px-3 py-2 border ${
                              shippingErrors.shippingLastName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                          />
                          {shippingErrors.shippingLastName && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="shipping-email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="shipping-email"
                              type="email"
                              value={shippingEmail}
                              onChange={(e) => setShippingEmail(e.target.value)}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                shippingErrors.shippingEmail ? 'border-red-500' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                            />
                          </div>
                          {shippingErrors.shippingEmail && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                          )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="shipping-phone"
                              type="tel"
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value)}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                shippingErrors.shippingPhone ? 'border-red-500' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                            />
                          </div>
                          {shippingErrors.shippingPhone && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                          )}
                        </div>
                        
                        {/* Street Address */}
                        <div className="md:col-span-2">
                          <label htmlFor="shipping-street" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="shipping-street"
                              type="text"
                              value={shippingStreet}
                              onChange={(e) => setShippingStreet(e.target.value)}
                              className={`block w-full pl-10 pr-3 py-2 border ${
                                shippingErrors.shippingStreet ? 'border-red-500' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                            />
                          </div>
                          {shippingErrors.shippingStreet && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                          )}
                        </div>
                        
                        {/* Country */}
                        <div>
                          <label htmlFor="shipping-country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            id="shipping-country"
                            value={shippingCountry}
                            onChange={(e) => handleShippingCountryChange(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select Country</option>
                            {countries?.map((country: any) => (
                              <option key={country.id} value={country.id}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* State/Province */}
                        <div>
                          <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-700 mb-1">
                            State / Province *
                          </label>
                          <select
                            id="shipping-state"
                            value={shippingState}
                            onChange={(e) => handleShippingStateChange(e.target.value)}
                            disabled={!shippingCountry || loadingStates}
                            className={`block w-full px-3 py-2 border ${
                              shippingErrors.shippingState ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                          >
                            <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                            {states.map((state: any) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          {shippingErrors.shippingState && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingState}</p>
                          )}
                        </div>
                        
                        {/* City */}
                        <div>
                          <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <select
                            id="shipping-city"
                            value={shippingCity}
                            onChange={(e) => {
                              const selectedCity = cities.find((c: any) => c.id.toString() === e.target.value);
                              setSelectedCityName(selectedCity?.name || '');
                              setShippingCity(e.target.value);
                            }}
                            disabled={!shippingState || loadingCities}
                            className={`block w-full px-3 py-2 border ${
                              shippingErrors.shippingCity ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                          >
                            <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                            {cities.map((city: any) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          {shippingErrors.shippingCity && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingCity}</p>
                          )}
                        </div>
                        
                        {/* ZIP/Postal Code */}
                        <div>
                          <label htmlFor="shipping-zip" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP / Postal Code *
                          </label>
                          <input
                            id="shipping-zip"
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            className={`block w-full px-3 py-2 border ${
                              shippingErrors.shippingZip ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                          />
                          {shippingErrors.shippingZip && (
                            <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Shipping Methods */}
                      <div className="mt-8">
                        <h3 className="text-base font-medium text-gray-900 mb-4">Shipping Method</h3>
                        
                        <div className="space-y-4">
                          {shippingMethods.length > 0 ? (
                            shippingMethods.map((method) => {
                              const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                ? 0 
                                : method.cost + (method.handling_fee || 0);
                              
                              return (
                                <div key={method.id} className="relative bg-white border rounded-md shadow-sm p-4 flex">
                                  <div className="flex items-center h-5">
                                    <input
                                      id={`shipping-${method.id}`}
                                      name="shipping-method"
                                      type="radio"
                                      checked={selectedShippingId === method.id}
                                      onChange={() => setSelectedShippingId(method.id)}
                                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    />
                                  </div>
                                  <label htmlFor={`shipping-${method.id}`} className="ml-3 flex flex-col cursor-pointer">
                                    <span className="block text-sm font-medium text-gray-900">{method.name}</span>
                                    <span className="block text-sm text-gray-500">
                                      {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                    </span>
                                    {method.min_order_amount > 0 && (
                                      <span className="block text-xs text-gray-400">
                                        {method.type === 'free_shipping' 
                                          ? `Free shipping on orders over $${method.min_order_amount}` 
                                          : `Minimum order: $${method.min_order_amount}`}
                                      </span>
                                    )}
                                  </label>
                                  <span className="ml-auto text-sm font-medium text-gray-900">
                                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost, storeSettings, currencies)}
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No shipping methods available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      <div className="mt-8">
                        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-1">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          id="order-notes"
                          rows={3}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Special instructions for delivery or any other notes"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Review Order
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose your payment method and enter your billing details.
                      </p>
                    </div>
                    
                    <form onSubmit={handlePaymentSubmit} className="p-6">
                      {/* Billing Address */}
                      <div className="mb-8">
                        <h3 className="text-base font-medium text-gray-900 mb-4">Billing Address</h3>
                        
                        <div className="flex items-center mb-4">
                          <input
                            id="same-as-shipping"
                            type="checkbox"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="same-as-shipping" className="ml-2 block text-sm text-gray-700">
                            Same as shipping address
                          </label>
                        </div>
                        
                        {!sameAsShipping && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                              <label htmlFor="billing-first-name" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="billing-first-name"
                                  type="text"
                                  value={billingFirstName}
                                  onChange={(e) => setBillingFirstName(e.target.value)}
                                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                              </div>
                            </div>
                            
                            {/* Last Name */}
                            <div>
                              <label htmlFor="billing-last-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                              </label>
                              <input
                                id="billing-last-name"
                                type="text"
                                value={billingLastName}
                                onChange={(e) => setBillingLastName(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>
                            
                            {/* Email */}
                            <div>
                              <label htmlFor="billing-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="billing-email"
                                  type="email"
                                  value={billingEmail}
                                  onChange={(e) => setBillingEmail(e.target.value)}
                                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                              </div>
                            </div>
                            
                            {/* Phone */}
                            <div>
                              <label htmlFor="billing-phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="billing-phone"
                                  type="tel"
                                  value={billingPhone}
                                  onChange={(e) => setBillingPhone(e.target.value)}
                                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                              </div>
                            </div>
                            
                            {/* Street Address */}
                            <div className="md:col-span-2">
                              <label htmlFor="billing-street" className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="billing-street"
                                  type="text"
                                  value={billingStreet}
                                  onChange={(e) => setBillingStreet(e.target.value)}
                                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                              </div>
                            </div>
                            
                            {/* Country */}
                            <div>
                              <label htmlFor="billing-country" className="block text-sm font-medium text-gray-700 mb-1">
                                Country *
                              </label>
                              <select
                                id="billing-country"
                                value={billingCountry}
                                onChange={(e) => handleBillingCountryChange(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              >
                                <option value="">Select Country</option>
                                {countries?.map((country: any) => (
                                  <option key={country.id} value={country.id}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* State/Province */}
                            <div>
                              <label htmlFor="billing-state" className="block text-sm font-medium text-gray-700 mb-1">
                                State / Province *
                              </label>
                              <select
                                id="billing-state"
                                value={billingState}
                                onChange={(e) => handleBillingStateChange(e.target.value)}
                                disabled={!billingCountry || loadingBillingStates}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              >
                                <option value="">{loadingBillingStates ? 'Loading...' : 'Select State'}</option>
                                {billingStates.map((state: any) => (
                                  <option key={state.id} value={state.id}>
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* City */}
                            <div>
                              <label htmlFor="billing-city" className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                              </label>
                              <select
                                id="billing-city"
                                value={billingCity}
                                onChange={(e) => setBillingCity(e.target.value)}
                                disabled={!billingState || loadingBillingCities}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              >
                                <option value="">{loadingBillingCities ? 'Loading...' : 'Select City'}</option>
                                {billingCities.map((city: any) => (
                                  <option key={city.id} value={city.id}>
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* ZIP/Postal Code */}
                            <div>
                              <label htmlFor="billing-zip" className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP / Postal Code *
                              </label>
                              <input
                                id="billing-zip"
                                type="text"
                                value={billingZip}
                                onChange={(e) => setBillingZip(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Methods */}
                      <div className="mb-8">
                        <h3 className="text-base font-medium text-gray-900 mb-4">Payment Method</h3>
                        
                        <div className="space-y-4">
                          {/* Always show Cash on Delivery */}
                          <div className="relative bg-white border rounded-md shadow-sm p-4 flex">
                            <div className="flex items-center h-5">
                              <input
                                id="payment-cod"
                                name="payment-method"
                                type="radio"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                              />
                            </div>
                            <label htmlFor="payment-cod" className="ml-3 flex flex-col cursor-pointer">
                              <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                              <span className="block text-sm text-gray-500">Pay when your order is delivered</span>
                            </label>
                          </div>
                          
                          {/* WhatsApp Payment Option - Only show if enabled */}
                          {enabledPaymentMethods.whatsapp && (
                            <div className="relative bg-white border rounded-md shadow-sm p-4 flex">
                              <div className="flex items-center h-5">
                                <input
                                  id="payment-whatsapp"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'whatsapp'}
                                  onChange={() => setPaymentMethod('whatsapp')}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                              </div>
                              <label htmlFor="payment-whatsapp" className="ml-3 flex flex-col cursor-pointer">
                                <span className="block text-sm font-medium text-gray-900">WhatsApp</span>
                                <span className="block text-sm text-gray-500">Complete payment via WhatsApp</span>
                              </label>
                            </div>
                          )}
                          
                          {/* Telegram Payment Option - Only show if enabled */}
                          {enabledPaymentMethods.telegram && (
                            <div className="relative bg-white border rounded-md shadow-sm p-4 flex">
                              <div className="flex items-center h-5">
                                <input
                                  id="payment-telegram"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'telegram'}
                                  onChange={() => setPaymentMethod('telegram')}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                              </div>
                              <label htmlFor="payment-telegram" className="ml-3 flex flex-col cursor-pointer">
                                <span className="block text-sm font-medium text-gray-900">Telegram</span>
                                <span className="block text-sm text-gray-500">Complete payment via Telegram</span>
                              </label>
                            </div>
                          )}
                          
                          {/* Dynamic Payment Methods */}
                          {Object.entries(enabledPaymentMethods).filter(([method]) => !['whatsapp', 'telegram'].includes(method)).map(([method, config]: [string, any]) => {
                            const methodNames: Record<string, string> = {
                              stripe: 'Credit Card (Stripe)',
                              paypal: 'PayPal',
                              razorpay: 'Razorpay',
                              paystack: 'Paystack',
                              flutterwave: 'Flutterwave',
                              bank: 'Bank Transfer',
                              mercadopago: 'MercadoPago',
                              paytabs: 'PayTabs',
                              skrill: 'Skrill',
                              coingate: 'CoinGate',
                              payfast: 'PayFast',
                              tap: 'Tap',
                              xendit: 'Xendit',
                              paytr: 'PayTR',
                              mollie: 'Mollie',
                              toyyibpay: 'toyyibPay',
                              cashfree: 'Cashfree',
                              iyzipay: 'Iyzipay',
                              benefit: 'Benefit',
                              ozow: 'Ozow',
                              easebuzz: 'Easebuzz',
                              khalti: 'Khalti',
                              authorizenet: 'Authorize.Net',
                              fedapay: 'FedaPay',
                              payhere: 'PayHere',
                              cinetpay: 'CinetPay',
                              paymentwall: 'PaymentWall'
                            };
                            
                            return (
                              <div key={method} className="relative bg-white border rounded-md shadow-sm p-4 flex">
                                <div className="flex items-center h-5">
                                  <input
                                    id={`payment-${method}`}
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                  />
                                </div>
                                <label htmlFor={`payment-${method}`} className="ml-3 flex flex-col cursor-pointer">
                                  <span className="block text-sm font-medium text-gray-900">
                                    {methodNames[method] || method.charAt(0).toUpperCase() + method.slice(1)}
                                  </span>
                                  <span className="block text-sm text-gray-500">
                                    Pay securely with {methodNames[method] || method}
                                  </span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* WhatsApp Number Input */}
                      {paymentMethod === 'whatsapp' && (
                        <div className="mb-8">
                          <h3 className="text-base font-medium text-gray-900 mb-4">WhatsApp Details</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-700 mb-1">
                                WhatsApp Number *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="whatsapp-number"
                                  type="tel"
                                  value={whatsappNumber}
                                  onChange={handleWhatsAppNumberChange}
                                  placeholder="+1234567890"
                                  className={`block w-full pl-10 pr-3 py-2 border ${
                                    paymentErrors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                                />
                              </div>
                              {paymentErrors.whatsappNumber && (
                                <p className="mt-1 text-sm text-red-600">{paymentErrors.whatsappNumber}</p>
                              )}
                              <p className="mt-1 text-sm text-gray-500">
                                Enter your WhatsApp number with country code (e.g., +1234567890)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* General Payment Errors */}
                      {paymentErrors.general && (
                        <div className="mb-8">
                          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {paymentErrors.general}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('review')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Back to Review
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePlaceOrder();
                          }}
                          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Place Order
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Review Your Order</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Please review your order details before placing your order.
                      </p>
                    </div>
                    
                    <div className="p-6">
                      {/* Order Items */}
                      <div className="mb-8">
                        <h3 className="text-base font-medium text-gray-900 mb-4">Order Items</h3>
                        
                        <div className="overflow-hidden border border-gray-200 rounded-md">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {cartItems.map((item) => {
                                const itemPrice = item.sale_price || item.price;
                                const itemTotal = itemPrice * item.quantity;
                                
                                return (
                                  <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                          <img 
                                            className="h-10 w-10 rounded-md object-cover" 
                                            src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                            alt={item.name}
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                            }}
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                      {formatCurrency(itemPrice, storeSettings, currencies)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                      {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      {formatCurrency(itemTotal, storeSettings, currencies)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Shipping Information */}
                      <div className="mb-8">
                        <h3 className="text-base font-medium text-gray-900 mb-4">Shipping Information</h3>
                        
                        <div className="bg-gray-50 rounded-md p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Contact Information</p>
                              <p className="text-sm text-gray-900 mt-1">{shippingFirstName} {shippingLastName}</p>
                              <p className="text-sm text-gray-900">{shippingEmail}</p>
                              <p className="text-sm text-gray-900">{shippingPhone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                              <p className="text-sm text-gray-900 mt-1">{shippingStreet}</p>
                              <p className="text-sm text-gray-900">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                              <p className="text-sm text-gray-900">{selectedCountryName}</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-500">Shipping Method</p>
                            <p className="text-sm text-gray-900 mt-1">
                              {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Information */}
                      <div className="mb-8">
                        <h3 className="text-base font-medium text-gray-900 mb-4">Payment Information</h3>
                        
                        <div className="bg-gray-50 rounded-md p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Payment Method</p>
                              <p className="text-sm text-gray-900 mt-1">
                                {paymentMethod === 'cod' && 'Cash on Delivery'}
                                {paymentMethod === 'whatsapp' && `WhatsApp Payment (${whatsappNumber})`}
                                {paymentMethod === 'telegram' && 'Telegram Payment'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Billing Address</p>
                              <p className="text-sm text-gray-900 mt-1">
                                {sameAsShipping ? (
                                  <>
                                    {shippingFirstName} {shippingLastName}<br />
                                    {shippingStreet}<br />
                                    {selectedCityName}, {selectedStateName} {shippingZip}<br />
                                    {selectedCountryName}
                                  </>
                                ) : (
                                  <>
                                    {billingFirstName} {billingLastName}<br />
                                    {billingStreet}<br />
                                    {billingCity}, {billingState} {billingZip}<br />
                                    {billingCountry}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      {orderNotes && (
                        <div className="mb-8">
                          <h3 className="text-base font-medium text-gray-900 mb-4">Order Notes</h3>
                          
                          <div className="bg-gray-50 rounded-md p-4">
                            <p className="text-sm text-gray-900">{orderNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('shipping')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Back to Shipping
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('payment')}
                          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Continue to Payment
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-gray-50 rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                  
                  {/* Order Items */}
                  <div className="flow-root">
                    <ul className="-my-4 divide-y divide-gray-200">
                      {cartItems.map((item) => {
                        const itemPrice = item.sale_price || item.price;
                        
                        return (
                          <li key={item.id} className="py-4 flex">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                }}
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-sm font-medium text-gray-900">
                                  <h3 className="line-clamp-1">{item.name}</h3>
                                  <p className="ml-4">{formatCurrency(parseFloat(itemPrice) * item.quantity, storeSettings, currencies)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  {/* Coupon Code */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="coupon" className="text-sm font-medium text-gray-700">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          disabled={couponApplied}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (couponApplied) {
                              setCouponApplied(false);
                              setCouponCode('');
                              setCouponDiscount(0);
                              setApiTotal(null);
                            } else if (couponCode) {
                              try {
                                const response = await fetch(route('api.coupon.validate'), {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                  },
                                  body: JSON.stringify({
                                    store_id: store.id,
                                    coupon_code: couponCode,
                                    shipping_method_id: selectedShippingId || null,
                                  }),
                                });
                                
                                const data = await response.json();
                                
                                if (data.valid) {
                                  setCouponApplied(true);
                                  setCouponDiscount(data.discount);
                                  setApiTotal(data.new_total);
                                  alert(data.message);
                                } else {
                                  alert(data.message);
                                }
                              } catch (error) {
                                alert('Error validating coupon. Please try again.');
                              }
                            } else {
                              alert('Please enter a coupon code');
                            }
                          }}
                          className={`px-4 py-2 ${couponApplied ? 'bg-red-600' : 'bg-primary'} text-white rounded-r-md hover:${couponApplied ? 'bg-red-700' : 'bg-primary-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-600">Coupon applied successfully!</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Subtotal</p>
                      <p>{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</p>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <p>Discount</p>
                        <p>-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Shipping</p>
                      <p>{selectedShippingId ? formatCurrency(updatedCartSummary.shipping, storeSettings, currencies) : 'Select method'}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Tax</p>
                      <p>{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</p>
                    </div>
                    
                    <div className="flex justify-between text-base font-medium text-gray-900 pt-4 border-gray-200">
                      <p>Total</p>
                      <p>{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</p>
                    </div>
                  </div>
                  
                  {/* Secure Checkout */}
                  <div className="mt-6 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">Secure Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}