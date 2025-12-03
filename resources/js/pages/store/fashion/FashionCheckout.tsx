import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, Minus, Plus } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';
import { handleOrderPlacement as handleCashfreeOrderPlacement } from '@/utils/cashfree-payment';
import { handleOrderPlacement as handleRazorpayOrderPlacement } from '@/utils/razorpay-payment';

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

interface FashionCheckoutProps {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  shippingMethods: ShippingMethod[];
  enabledPaymentMethods?: any;
  user?: User;
  store: any;
  storeContent?: any;
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

export default function FashionCheckout({
  cartItems = [],
  cartSummary,
  shippingMethods = [],
  enabledPaymentMethods = {},
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  countries = [],
  customPages = [],
}: FashionCheckoutProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const storeSlug = store.slug || 'demo';
  
  // Use user data if available, otherwise use defaults
  const userData = user || {
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
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  
  // Order notes and coupon code
  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
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
        return;
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
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
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
  const shippingCost = getShippingCost();
  const discount = couponApplied ? couponDiscount : cartSummary.discount;
  const updatedCartSummary = {
    ...cartSummary,
    shipping: shippingCost,
    discount,
    total: cartSummary.subtotal - discount + shippingCost + cartSummary.tax,
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
        storeId={store.id}
        storeContent={storeContent}
        theme="fashion"
      >
        {/* Hero Section */}
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-thin tracking-wide mb-6">Checkout</h1>
              <p className="text-white/70 font-light text-lg">
                Complete your order with confidence
              </p>
            </div>
          </div>
        </div>
        
        
        {/* Checkout Steps - Fashion Style */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center space-x-16">
                {steps.map((step, stepIdx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                  
                  return (
                    <div key={step.id} className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`
                            w-12 h-12 flex items-center justify-center border transition-all duration-300
                            ${isCompleted ? 'bg-black border-black' : isActive ? 'border-black bg-white' : 'border-gray-300 bg-white'}
                          `}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5 text-white" />
                          ) : (
                            <span className={`text-sm font-light ${isActive ? 'text-black' : 'text-gray-400'}`}>
                              {stepIdx + 1}
                            </span>
                          )}
                        </div>
                        <span 
                          className={`
                            mt-3 text-xs font-light tracking-widest uppercase
                            ${isActive ? 'text-black' : isCompleted ? 'text-black' : 'text-gray-400'}
                          `}
                        >
                          {step.name}
                        </span>
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div className={`w-16 h-px ${isCompleted ? 'bg-black' : 'bg-gray-300'} transition-colors duration-300`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="bg-white">
                    <div className="mb-8">
                      <h2 className="text-2xl font-thin tracking-wide mb-2">Shipping Information</h2>
                      <p className="text-gray-600 font-light">
                        Enter your shipping details and choose a shipping method.
                      </p>
                    </div>
                    
                    <form onSubmit={handleShippingSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="shipping-first-name" className="block text-sm font-light tracking-wide uppercase mb-3">
                            First Name *
                          </label>
                          <input
                            id="shipping-first-name"
                            type="text"
                            value={shippingFirstName}
                            onChange={(e) => setShippingFirstName(e.target.value)}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingFirstName ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          />
                          {shippingErrors.shippingFirstName && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingFirstName}</p>
                          )}
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label htmlFor="shipping-last-name" className="block text-sm font-light tracking-wide uppercase mb-3">
                            Last Name *
                          </label>
                          <input
                            id="shipping-last-name"
                            type="text"
                            value={shippingLastName}
                            onChange={(e) => setShippingLastName(e.target.value)}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingLastName ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          />
                          {shippingErrors.shippingLastName && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingLastName}</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="shipping-email" className="block text-sm font-light tracking-wide uppercase mb-3">
                            Email Address *
                          </label>
                          <input
                            id="shipping-email"
                            type="email"
                            value={shippingEmail}
                            onChange={(e) => setShippingEmail(e.target.value)}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingEmail ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          />
                          {shippingErrors.shippingEmail && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingEmail}</p>
                          )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label htmlFor="shipping-phone" className="block text-sm font-light tracking-wide uppercase mb-3">
                            Phone Number *
                          </label>
                          <input
                            id="shipping-phone"
                            type="tel"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingPhone ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          />
                          {shippingErrors.shippingPhone && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingPhone}</p>
                          )}
                        </div>
                        
                        {/* Street Address */}
                        <div className="md:col-span-2">
                          <label htmlFor="shipping-street" className="block text-sm font-light tracking-wide uppercase mb-3">
                            Street Address *
                          </label>
                          <input
                            id="shipping-street"
                            type="text"
                            value={shippingStreet}
                            onChange={(e) => setShippingStreet(e.target.value)}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingStreet ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          />
                          {shippingErrors.shippingStreet && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingStreet}</p>
                          )}
                        </div>
                        
                        {/* Country */}
                        <div>
                          <label htmlFor="shipping-country" className="block text-sm font-light tracking-wide uppercase mb-3">
                            Country *
                          </label>
                          <select
                            id="shipping-country"
                            value={shippingCountry}
                            onChange={(e) => handleShippingCountryChange(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
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
                          <label htmlFor="shipping-state" className="block text-sm font-light tracking-wide uppercase mb-3">
                            State / Province *
                          </label>
                          <select
                            id="shipping-state"
                            value={shippingState}
                            onChange={(e) => handleShippingStateChange(e.target.value)}
                            disabled={!shippingCountry || loadingStates}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingState ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          >
                            <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                            {states.map((state: any) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          {shippingErrors.shippingState && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingState}</p>
                          )}
                        </div>
                        
                        {/* City */}
                        <div>
                          <label htmlFor="shipping-city" className="block text-sm font-light tracking-wide uppercase mb-3">
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
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingCity ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          >
                            <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                            {cities.map((city: any) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          {shippingErrors.shippingCity && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingCity}</p>
                          )}
                        </div>
                        
                        {/* ZIP/Postal Code */}
                        <div>
                          <label htmlFor="shipping-zip" className="block text-sm font-light tracking-wide uppercase mb-3">
                            ZIP / Postal Code *
                          </label>
                          <input
                            id="shipping-zip"
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            className={`block w-full px-4 py-3 border ${
                              shippingErrors.shippingZip ? 'border-red-500' : 'border-gray-300'
                            } font-light focus:outline-none focus:border-black transition-colors`}
                          />
                          {shippingErrors.shippingZip && (
                            <p className="mt-2 text-sm text-red-600 font-light">{shippingErrors.shippingZip}</p>
                          )}
                        </div>

                      </div>
                      
                      {/* Shipping Methods */}
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-6">Shipping Method</h3>
                        
                        <div className="space-y-4">
                          {shippingMethods.length > 0 ? (
                            shippingMethods.map((method) => {
                              const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                ? 0 
                                : method.cost + (method.handling_fee || 0);
                              
                              return (
                                <div key={method.id} className="relative border border-gray-300 p-6 flex">
                                  <div className="flex items-center h-5">
                                    <input
                                      id={`shipping-${method.id}`}
                                      name="shipping-method"
                                      type="radio"
                                      checked={selectedShippingId === method.id}
                                      onChange={() => setSelectedShippingId(method.id)}
                                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                                    />
                                  </div>
                                  <label htmlFor={`shipping-${method.id}`} className="ml-4 flex flex-col cursor-pointer">
                                    <span className="block text-sm font-light text-black">{method.name}</span>
                                    <span className="block text-sm text-gray-500 font-light">
                                      {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                    </span>
                                    {method.min_order_amount > 0 && (
                                      <span className="block text-xs text-gray-400 font-light">
                                        {method.type === 'free_shipping' 
                                          ? `Free shipping on orders over $${method.min_order_amount}` 
                                          : `Minimum order: $${method.min_order_amount}`}
                                      </span>
                                    )}
                                  </label>
                                  <span className="ml-auto text-sm font-light text-black">
                                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost, storeSettings, currencies)}
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-gray-500 font-light">
                              No shipping methods available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      <div>
                        <label htmlFor="order-notes" className="block text-sm font-light tracking-wide uppercase mb-3">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          id="order-notes"
                          rows={4}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Special instructions for delivery or any other notes"
                          className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-black text-white px-8 py-3 font-light tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors"
                        >
                          Review Order
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="bg-white">
                    <div className="mb-8">
                      <h2 className="text-2xl font-thin tracking-wide mb-2">Review Your Order</h2>
                      <p className="text-gray-600 font-light">
                        Please review your order details before placing your order.
                      </p>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-6">Order Items</h3>
                        
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const itemPrice = item.sale_price || item.price;
                            const itemTotal = itemPrice * item.quantity;
                            
                            return (
                              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-gray-200">
                                  <img 
                                    className="h-full w-full object-cover" 
                                    src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                    alt={item.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-light text-black">{item.name}</div>
                                  <div className="text-sm text-gray-500 font-light">Qty: {item.quantity}</div>
                                </div>
                                <div className="text-sm font-light text-black">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Shipping Information */}
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-6">Shipping Information</h3>
                        
                        <div className="bg-gray-50 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-light tracking-wide uppercase text-gray-500 mb-2">Contact Information</p>
                              <p className="text-sm text-black font-light">{shippingFirstName} {shippingLastName}</p>
                              <p className="text-sm text-black font-light">{shippingEmail}</p>
                              <p className="text-sm text-black font-light">{shippingPhone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-light tracking-wide uppercase text-gray-500 mb-2">Shipping Address</p>
                              <p className="text-sm text-black font-light">{shippingStreet}</p>
                              <p className="text-sm text-black font-light">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                              <p className="text-sm text-black font-light">{selectedCountryName}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm font-light tracking-wide uppercase text-gray-500 mb-2">Shipping Method</p>
                            <p className="text-sm text-black font-light">
                              {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      {orderNotes && (
                        <div>
                          <h3 className="text-lg font-light tracking-wide mb-6">Order Notes</h3>
                          
                          <div className="bg-gray-50 p-6">
                            <p className="text-sm text-black font-light">{orderNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('shipping')}
                          className="border border-gray-300 text-black px-6 py-3 font-light tracking-widest uppercase text-sm hover:border-black transition-colors"
                        >
                          Back to Shipping
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('payment')}
                          className="bg-black text-white px-8 py-3 font-light tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="bg-white">
                    <div className="mb-8">
                      <h2 className="text-2xl font-thin tracking-wide mb-2">Payment Information</h2>
                      <p className="text-gray-600 font-light">
                        Choose your payment method and enter your billing details.
                      </p>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Billing Address */}
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-6">Billing Address</h3>
                        
                        <div className="flex items-center mb-6">
                          <input
                            id="same-as-shipping"
                            type="checkbox"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <label htmlFor="same-as-shipping" className="ml-3 block text-sm text-black font-light">
                            Same as shipping address
                          </label>
                        </div>
                        
                        {!sameAsShipping && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                              <label htmlFor="billing-first-name" className="block text-sm font-light tracking-wide uppercase mb-3">
                                First Name *
                              </label>
                              <input
                                id="billing-first-name"
                                type="text"
                                value={billingFirstName}
                                onChange={(e) => setBillingFirstName(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                            
                            {/* Last Name */}
                            <div>
                              <label htmlFor="billing-last-name" className="block text-sm font-light tracking-wide uppercase mb-3">
                                Last Name *
                              </label>
                              <input
                                id="billing-last-name"
                                type="text"
                                value={billingLastName}
                                onChange={(e) => setBillingLastName(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                            
                            {/* Email */}
                            <div>
                              <label htmlFor="billing-email" className="block text-sm font-light tracking-wide uppercase mb-3">
                                Email Address *
                              </label>
                              <input
                                id="billing-email"
                                type="email"
                                value={billingEmail}
                                onChange={(e) => setBillingEmail(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                            
                            {/* Phone */}
                            <div>
                              <label htmlFor="billing-phone" className="block text-sm font-light tracking-wide uppercase mb-3">
                                Phone Number *
                              </label>
                              <input
                                id="billing-phone"
                                type="tel"
                                value={billingPhone}
                                onChange={(e) => setBillingPhone(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                            
                            {/* Street Address */}
                            <div className="md:col-span-2">
                              <label htmlFor="billing-street" className="block text-sm font-light tracking-wide uppercase mb-3">
                                Street Address *
                              </label>
                              <input
                                id="billing-street"
                                type="text"
                                value={billingStreet}
                                onChange={(e) => setBillingStreet(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                            
                            {/* Country */}
                            <div>
                              <label htmlFor="billing-country" className="block text-sm font-light tracking-wide uppercase mb-3">
                                Country *
                              </label>
                              <select
                                id="billing-country"
                                value={billingCountry}
                                onChange={(e) => handleBillingCountryChange(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
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
                              <label htmlFor="billing-state" className="block text-sm font-light tracking-wide uppercase mb-3">
                                State / Province *
                              </label>
                              <select
                                id="billing-state"
                                value={billingState}
                                onChange={(e) => handleBillingStateChange(e.target.value)}
                                disabled={!billingCountry || loadingBillingStates}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
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
                              <label htmlFor="billing-city" className="block text-sm font-light tracking-wide uppercase mb-3">
                                City *
                              </label>
                              <select
                                id="billing-city"
                                value={billingCity}
                                onChange={(e) => setBillingCity(e.target.value)}
                                disabled={!billingState || loadingBillingCities}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
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
                              <label htmlFor="billing-zip" className="block text-sm font-light tracking-wide uppercase mb-3">
                                ZIP / Postal Code *
                              </label>
                              <input
                                id="billing-zip"
                                type="text"
                                value={billingZip}
                                onChange={(e) => setBillingZip(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 font-light focus:outline-none focus:border-black transition-colors"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-6">Payment Method</h3>
                        
                        <div className="space-y-4">
                          {/* Always show Cash on Delivery */}
                          <div className="relative border border-gray-300 p-6 flex">
                            <div className="flex items-center h-5">
                              <input
                                id="payment-cod"
                                name="payment-method"
                                type="radio"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300"
                              />
                            </div>
                            <label htmlFor="payment-cod" className="ml-4 flex flex-col cursor-pointer">
                              <span className="block text-sm font-light text-black">Cash on Delivery</span>
                              <span className="block text-sm text-gray-500 font-light">Pay when your order is delivered</span>
                            </label>
                          </div>
                          
                          {/* WhatsApp Payment Option - Only show if enabled */}
                          {enabledPaymentMethods.whatsapp && (
                            <div className="relative border border-gray-300 p-6 flex">
                              <div className="flex items-center h-5">
                                <input
                                  id="payment-whatsapp"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'whatsapp'}
                                  onChange={() => setPaymentMethod('whatsapp')}
                                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                                />
                              </div>
                              <label htmlFor="payment-whatsapp" className="ml-4 flex flex-col cursor-pointer">
                                <span className="block text-sm font-light text-black">WhatsApp</span>
                                <span className="block text-sm text-gray-500 font-light">Complete payment via WhatsApp</span>
                              </label>
                            </div>
                          )}
                          
                          {/* Telegram Payment Option - Only show if enabled */}
                          {enabledPaymentMethods.telegram && (
                            <div className="relative border border-gray-300 p-6 flex">
                              <div className="flex items-center h-5">
                                <input
                                  id="payment-telegram"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'telegram'}
                                  onChange={() => setPaymentMethod('telegram')}
                                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                                />
                              </div>
                              <label htmlFor="payment-telegram" className="ml-4 flex flex-col cursor-pointer">
                                <span className="block text-sm font-light text-black">Telegram</span>
                                <span className="block text-sm text-gray-500 font-light">Complete payment via Telegram</span>
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
                              <div key={method} className="relative border border-gray-300 p-6 flex">
                                <div className="flex items-center h-5">
                                  <input
                                    id={`payment-${method}`}
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                                  />
                                </div>
                                <label htmlFor={`payment-${method}`} className="ml-4 flex flex-col cursor-pointer">
                                  <span className="block text-sm font-light text-black">
                                    {methodNames[method] || method.charAt(0).toUpperCase() + method.slice(1)}
                                  </span>
                                  <span className="block text-sm text-gray-500 font-light">
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
                        <div>
                          <h3 className="text-lg font-light tracking-wide mb-6">WhatsApp Details</h3>
                          
                          <div>
                            <label htmlFor="whatsapp-number" className="block text-sm font-light tracking-wide uppercase mb-3">
                              WhatsApp Number *
                            </label>
                            <input
                              id="whatsapp-number"
                              type="tel"
                              value={whatsappNumber}
                              onChange={handleWhatsAppNumberChange}
                              placeholder="+1234567890"
                              className={`block w-full px-4 py-3 border ${
                                paymentErrors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                              } font-light focus:outline-none focus:border-black transition-colors`}
                            />
                            {paymentErrors.whatsappNumber && (
                              <p className="mt-2 text-sm text-red-600 font-light">{paymentErrors.whatsappNumber}</p>
                            )}
                            <p className="mt-2 text-sm text-gray-600 font-light">
                              Enter your WhatsApp number with country code (e.g., +1234567890). You will receive order confirmation via WhatsApp.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('review')}
                          className="border border-gray-300 text-black px-6 py-3 font-light tracking-widest uppercase text-sm hover:border-black transition-colors"
                        >
                          Back to Review
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          className="bg-black text-white px-8 py-3 font-light tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors"
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-black text-white p-8 sticky top-6">
                  <h2 className="text-2xl font-thin tracking-widest uppercase mb-8 text-center">Order Summary</h2>
                  <div className="w-16 h-px bg-white mx-auto mb-8"></div>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-8">
                    {cartItems.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      
                      return (
                        <div key={item.id} className="flex">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-gray-200">
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
                              <div className="flex justify-between text-sm font-light text-white">
                                <h3 className="line-clamp-1">{item.name}</h3>
                                <p className="ml-4">{formatCurrency(parseFloat(itemPrice) * item.quantity, storeSettings, currencies)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-400 font-light">Qty {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* General Payment Errors */}
                  {paymentErrors.general && (
                    <div className="mb-8">
                      <div className="p-4 text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-xl">
                        {paymentErrors.general}
                      </div>
                    </div>
                  )}
                  
                  {/* Coupon Code */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <div className="flex flex-col space-y-3">
                      <label htmlFor="coupon" className="text-sm font-light tracking-widest uppercase text-white">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-grow px-3 py-2 bg-white text-black font-light focus:outline-none text-sm"
                          disabled={couponApplied}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (couponApplied) {
                              setCouponApplied(false);
                              setCouponCode('');
                              setCouponDiscount(0);
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
                          className={`px-4 py-2 ${couponApplied ? 'bg-red-600' : 'bg-white'} ${couponApplied ? 'text-white' : 'text-black'} hover:${couponApplied ? 'bg-red-700' : 'bg-gray-100'} text-sm font-light tracking-wide uppercase transition-colors`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-400 font-light">Coupon applied successfully!</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-300 font-light">
                      <p>Subtotal</p>
                      <p>{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</p>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-400 font-light">
                        <p>Discount</p>
                        <p>-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-300 font-light">
                      <p>Shipping</p>
                      <p>{selectedShippingId ? formatCurrency(updatedCartSummary.shipping, storeSettings, currencies) : 'Select method'}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-300 font-light">
                      <p>Tax</p>
                      <p>{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</p>
                    </div>
                    
                    <div className="flex justify-between text-lg font-light text-white pt-4 border-t border-gray-600">
                      <p>Total</p>
                      <p>{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</p>
                    </div>
                  </div>
                  
                  {/* Secure Checkout */}
                  <div className="mt-8 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-xs text-gray-400 font-light tracking-widest uppercase">Secure Checkout</p>
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