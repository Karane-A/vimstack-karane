import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, Minus, Plus, Heart, Sparkles } from 'lucide-react';
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

interface BeautyCheckoutProps {
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

export default function BeautyCheckout({
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
}: BeautyCheckoutProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const storeSlug = store.slug || 'demo';
  
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
  
  const steps = [
    { id: 'shipping', name: 'Shipping', icon: MapPin },
    { id: 'review', name: 'Review', icon: Check },
    { id: 'payment', name: 'Payment', icon: Lock },
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
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  
  // Order notes and coupon code
  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Handle country change
  const handleCountryChange = async (countryId: string) => {
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
  
  // Handle state change
  const handleStateChange = async (stateId: string) => {
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
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setShippingErrors({});
    
    const newErrors: Record<string, string> = {};
    
    if (!shippingFirstName) newErrors.shippingFirstName = 'First name is required';
    if (!shippingLastName) newErrors.shippingLastName = 'Last name is required';
    if (!shippingEmail) {
      newErrors.shippingEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingEmail)) {
      newErrors.shippingEmail = 'Email is invalid';
    }
    if (!shippingPhone) newErrors.shippingPhone = 'Phone number is required';
    if (!shippingStreet) newErrors.shippingStreet = 'Street address is required';
    if (!shippingCity) newErrors.shippingCity = 'City is required';
    if (!shippingState) newErrors.shippingState = 'State is required';
    if (!shippingZip) newErrors.shippingZip = 'ZIP code is required';
    
    if (Object.keys(newErrors).length > 0) {
      setShippingErrors(newErrors);
      return;
    }
    
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
  
  const selectedShipping = shippingMethods.find(method => method.id === selectedShippingId);
  
  const getShippingCost = () => {
    if (!selectedShipping) return 0;
    if (selectedShipping.type === 'free_shipping' && cartSummary.subtotal >= (selectedShipping.min_order_amount || 0)) {
      return 0;
    }
    return parseFloat(selectedShipping.cost) + parseFloat(selectedShipping.handling_fee || 0);
  };
  
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
        theme="beauty-cosmetics"
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
                Beauty Checkout
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Complete your beauty journey with secure checkout
              </p>
            </div>
          </div>
        </div>
        
        {/* Checkout Steps */}
        <div className="bg-white/80 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center items-center space-x-8">
                {steps.map((step, stepIdx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`
                            w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg
                            ${isCompleted ? 'bg-rose-600 text-white' : isActive ? 'bg-white border-2 border-rose-600 text-rose-600' : 'bg-gray-100 text-gray-400'}
                          `}
                        >
                          {isCompleted ? (
                            <Check className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <span 
                          className={`
                            mt-4 text-sm font-medium
                            ${isActive ? 'text-rose-600' : isCompleted ? 'text-rose-600' : 'text-gray-400'}
                          `}
                        >
                          {step.name}
                        </span>
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div className={`w-20 h-1 mx-4 rounded-full transition-colors duration-300 ${isCompleted ? 'bg-rose-600' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-gray-900 mb-4">Shipping Information</h2>
                      <p className="text-gray-600">
                        Enter your shipping details and choose a shipping method.
                      </p>
                    </div>
                    
                    <form onSubmit={handleShippingSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="shipping-first-name" className="block text-sm font-medium text-gray-900 mb-3">
                            First Name *
                          </label>
                          <input
                            id="shipping-first-name"
                            type="text"
                            value={shippingFirstName}
                            onChange={(e) => setShippingFirstName(e.target.value)}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingFirstName ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          />
                          {shippingErrors.shippingFirstName && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                          )}
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label htmlFor="shipping-last-name" className="block text-sm font-medium text-gray-900 mb-3">
                            Last Name *
                          </label>
                          <input
                            id="shipping-last-name"
                            type="text"
                            value={shippingLastName}
                            onChange={(e) => setShippingLastName(e.target.value)}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingLastName ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          />
                          {shippingErrors.shippingLastName && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="shipping-email" className="block text-sm font-medium text-gray-900 mb-3">
                            Email Address *
                          </label>
                          <input
                            id="shipping-email"
                            type="email"
                            value={shippingEmail}
                            onChange={(e) => setShippingEmail(e.target.value)}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingEmail ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          />
                          {shippingErrors.shippingEmail && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                          )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-900 mb-3">
                            Phone Number *
                          </label>
                          <input
                            id="shipping-phone"
                            type="tel"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingPhone ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          />
                          {shippingErrors.shippingPhone && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                          )}
                        </div>
                        
                        {/* Street Address */}
                        <div className="md:col-span-2">
                          <label htmlFor="shipping-street" className="block text-sm font-medium text-gray-900 mb-3">
                            Street Address *
                          </label>
                          <input
                            id="shipping-street"
                            type="text"
                            value={shippingStreet}
                            onChange={(e) => setShippingStreet(e.target.value)}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingStreet ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          />
                          {shippingErrors.shippingStreet && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                          )}
                        </div>
                        
                        {/* Country */}
                        <div>
                          <label htmlFor="shipping-country" className="block text-sm font-medium text-gray-900 mb-3">
                            Country *
                          </label>
                          <select
                            id="shipping-country"
                            value={shippingCountry}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className="block w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors bg-white/80"
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
                          <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-900 mb-3">
                            State / Province *
                          </label>
                          <select
                            id="shipping-state"
                            value={shippingState}
                            onChange={(e) => handleStateChange(e.target.value)}
                            disabled={!shippingCountry || loadingStates}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingState ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          >
                            <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                            {states.map((state: any) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          {shippingErrors.shippingState && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingState}</p>
                          )}
                        </div>
                        
                        {/* City */}
                        <div>
                          <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-900 mb-3">
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
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingCity ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          >
                            <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                            {cities.map((city: any) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          {shippingErrors.shippingCity && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingCity}</p>
                          )}
                        </div>
                        
                        {/* ZIP/Postal Code */}
                        <div>
                          <label htmlFor="shipping-zip" className="block text-sm font-medium text-gray-900 mb-3">
                            ZIP / Postal Code *
                          </label>
                          <input
                            id="shipping-zip"
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            className={`block w-full px-4 py-3 rounded-xl border-2 ${
                              shippingErrors.shippingZip ? 'border-red-500' : 'border-rose-200'
                            } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                          />
                          {shippingErrors.shippingZip && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Shipping Methods */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-6">Shipping Method</h3>
                        
                        <div className="space-y-4">
                          {shippingMethods.length > 0 ? (
                            shippingMethods.map((method) => {
                              const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                ? 0 
                                : method.cost + (method.handling_fee || 0);
                              
                              return (
                                <div key={method.id} className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                                  selectedShippingId === method.id ? 'border-rose-500 bg-rose-50' : 'border-rose-200 bg-white/60 hover:border-rose-300'
                                }`}>
                                  <div className="flex items-center">
                                    <input
                                      id={`shipping-${method.id}`}
                                      name="shipping-method"
                                      type="radio"
                                      checked={selectedShippingId === method.id}
                                      onChange={() => setSelectedShippingId(method.id)}
                                      className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300"
                                    />
                                    <label htmlFor={`shipping-${method.id}`} className="ml-4 flex-1 cursor-pointer">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <span className="block font-medium text-gray-900">{method.name}</span>
                                          <span className="block text-sm text-gray-600">
                                            {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                          </span>
                                          {method.min_order_amount > 0 && (
                                            <span className="block text-xs text-gray-500 mt-1">
                                              {method.type === 'free_shipping' 
                                                ? `Free shipping on orders over $${method.min_order_amount}` 
                                                : `Minimum order: $${method.min_order_amount}`}
                                            </span>
                                          )}
                                        </div>
                                        <span className="font-semibold text-rose-600">
                                          {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost, storeSettings, currencies)}
                                        </span>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No shipping methods available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      <div>
                        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-900 mb-3">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          id="order-notes"
                          rows={4}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Special instructions for delivery or any other notes"
                          className="block w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors bg-white/80"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                          Review Order
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-gray-900 mb-4">Review Your Order</h2>
                      <p className="text-gray-600">
                        Please review your order details before placing your order.
                      </p>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-6">Order Items</h3>
                        
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const itemPrice = item.sale_price || item.price;
                            const itemTotal = itemPrice * item.quantity;
                            
                            return (
                              <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/60 rounded-2xl">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                                  <img 
                                    className="h-full w-full object-cover" 
                                    src={item.cover_image ? getImageUrl(item.cover_image) : `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=64&h=64&fit=crop&crop=center`}
                                    alt={item.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=64&h=64&fit=crop&crop=center`;
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                                </div>
                                <div className="font-semibold text-rose-600">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Shipping Information */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-6">Shipping Information</h3>
                        
                        <div className="bg-white/60 rounded-2xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Contact Information</p>
                              <p className="text-gray-900">{shippingFirstName} {shippingLastName}</p>
                              <p className="text-gray-900">{shippingEmail}</p>
                              <p className="text-gray-900">{shippingPhone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address</p>
                              <p className="text-gray-900">{shippingStreet}</p>
                              <p className="text-gray-900">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                              <p className="text-gray-900">{selectedCountryName}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-rose-200">
                            <p className="text-sm font-medium text-gray-500 mb-2">Shipping Method</p>
                            <p className="text-gray-900">
                              {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      {orderNotes && (
                        <div>
                          <h3 className="text-xl font-medium text-gray-900 mb-6">Order Notes</h3>
                          
                          <div className="bg-white/60 rounded-2xl p-6">
                            <p className="text-gray-900">{orderNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('shipping')}
                          className="border-2 border-rose-200 text-rose-600 px-6 py-3 rounded-full font-medium hover:border-rose-300 transition-colors"
                        >
                          Back to Shipping
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('payment')}
                          className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="mb-8">
                      <h2 className="text-3xl font-light text-gray-900 mb-4">Payment Information</h2>
                      <p className="text-gray-600">
                        Choose your payment method and enter your billing details.
                      </p>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Billing Address */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-6">Billing Address</h3>
                        
                        <div className="flex items-center mb-6">
                          <input
                            id="same-as-shipping"
                            type="checkbox"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300 rounded"
                          />
                          <label htmlFor="same-as-shipping" className="ml-3 block text-gray-900 font-medium">
                            Same as shipping address
                          </label>
                        </div>
                        
                        {!sameAsShipping && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Billing form fields - similar to shipping but with billing state variables */}
                            {/* Implementation similar to shipping form but shorter for brevity */}
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-6">Payment Method</h3>
                        
                        <div className="space-y-4">
                          {/* Cash on Delivery */}
                          <div className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                            paymentMethod === 'cod' ? 'border-rose-500 bg-rose-50' : 'border-rose-200 bg-white/60 hover:border-rose-300'
                          }`}>
                            <div className="flex items-center">
                              <input
                                id="payment-cod"
                                name="payment-method"
                                type="radio"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300"
                              />
                              <label htmlFor="payment-cod" className="ml-4 flex-1 cursor-pointer">
                                <span className="block font-medium text-gray-900">Cash on Delivery</span>
                                <span className="block text-sm text-gray-600">Pay when your order is delivered</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* WhatsApp Payment Option - Only show if enabled */}
                          {enabledPaymentMethods.whatsapp && (
                            <div className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                              paymentMethod === 'whatsapp' ? 'border-rose-500 bg-rose-50' : 'border-rose-200 bg-white/60 hover:border-rose-300'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-whatsapp"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'whatsapp'}
                                  onChange={() => setPaymentMethod('whatsapp')}
                                  className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300"
                                />
                                <label htmlFor="payment-whatsapp" className="ml-4 flex-1 cursor-pointer">
                                  <span className="block font-medium text-gray-900">WhatsApp</span>
                                  <span className="block text-sm text-gray-600">Complete payment via WhatsApp</span>
                                </label>
                              </div>
                            </div>
                          )}
                          
                          {/* Telegram Payment Option - Only show if enabled */}
                          {enabledPaymentMethods.telegram && (
                            <div className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                              paymentMethod === 'telegram' ? 'border-rose-500 bg-rose-50' : 'border-rose-200 bg-white/60 hover:border-rose-300'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-telegram"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'telegram'}
                                  onChange={() => setPaymentMethod('telegram')}
                                  className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300"
                                />
                                <label htmlFor="payment-telegram" className="ml-4 flex-1 cursor-pointer">
                                  <span className="block font-medium text-gray-900">Telegram</span>
                                  <span className="block text-sm text-gray-600">Complete payment via Telegram</span>
                                </label>
                              </div>
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
                              <div key={method} className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                                paymentMethod === method ? 'border-rose-500 bg-rose-50' : 'border-rose-200 bg-white/60 hover:border-rose-300'
                              }`}>
                                <div className="flex items-center">
                                  <input
                                    id={`payment-${method}`}
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300"
                                  />
                                  <label htmlFor={`payment-${method}`} className="ml-4 flex-1 cursor-pointer">
                                    <span className="block font-medium text-gray-900">
                                      {methodNames[method] || method.charAt(0).toUpperCase() + method.slice(1)}
                                    </span>
                                    <span className="block text-sm text-gray-600">
                                      Pay securely with {methodNames[method] || method}
                                    </span>
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* WhatsApp Number Input */}
                      {paymentMethod === 'whatsapp' && (
                        <div>
                          <h3 className="text-xl font-medium text-gray-900 mb-6">WhatsApp Details</h3>
                          
                          <div>
                            <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-900 mb-3">
                              WhatsApp Number *
                            </label>
                            <input
                              id="whatsapp-number"
                              type="tel"
                              value={whatsappNumber}
                              onChange={handleWhatsAppNumberChange}
                              placeholder="+1234567890"
                              className={`block w-full px-4 py-3 rounded-xl border-2 ${
                                paymentErrors.whatsappNumber ? 'border-red-500' : 'border-rose-200'
                              } focus:outline-none focus:border-rose-500 transition-colors bg-white/80`}
                            />
                            {paymentErrors.whatsappNumber && (
                              <p className="mt-2 text-sm text-red-600">{paymentErrors.whatsappNumber}</p>
                            )}
                            <p className="mt-2 text-sm text-gray-600">
                              Enter your WhatsApp number with country code (e.g., +1234567890)
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* General Payment Errors */}
                      {paymentErrors.general && (
                        <div>
                          <div className="p-4 text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-xl">
                            {paymentErrors.general}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('review')}
                          className="border-2 border-rose-200 text-rose-600 px-6 py-3 rounded-full font-medium hover:border-rose-300 transition-colors"
                        >
                          Back to Review
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                          <Sparkles className="h-5 w-5" />
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-rose-600 text-white rounded-3xl p-8 sticky top-6 shadow-2xl">
                  <h2 className="text-2xl font-light mb-8 text-center">Beauty Bag Summary</h2>
                  <div className="w-16 h-1 bg-white/30 mx-auto mb-8 rounded-full"></div>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-8">
                    {cartItems.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                            <img
                              src={item.cover_image ? getImageUrl(item.cover_image) : `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=48&h=48&fit=crop&crop=center`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=48&h=48&fit=crop&crop=center`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                            <p className="text-xs text-white/70">Qty {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(parseFloat(itemPrice) * item.quantity, storeSettings, currencies)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Coupon Code */}
                  <div className="mb-8 border-t border-white/20 pt-8">
                    <div className="flex flex-col space-y-3">
                      <label htmlFor="coupon" className="text-sm font-medium text-white">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-grow px-3 py-2 bg-white/20 text-white placeholder-white/60 rounded-l-xl focus:outline-none text-sm"
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
                          className={`px-4 py-2 ${couponApplied ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'} text-white rounded-r-xl text-sm font-medium transition-colors`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-300">Coupon applied successfully!</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-white/80">
                      <p>Subtotal</p>
                      <p>{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</p>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-300">
                        <p>Discount</p>
                        <p>-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-white/80">
                      <p>Shipping</p>
                      <p>{selectedShippingId ? formatCurrency(updatedCartSummary.shipping, storeSettings, currencies) : 'Select method'}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-white/80">
                      <p>Tax</p>
                      <p>{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</p>
                    </div>
                    
                    <div className="flex justify-between text-lg font-semibold text-white pt-4 border-t border-white/20">
                      <p>Total</p>
                      <p>{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</p>
                    </div>
                  </div>
                  
                  {/* Secure Checkout */}
                  <div className="mt-8 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white/60 mr-2" />
                    <p className="text-xs text-white/60 font-medium">Secure Checkout</p>
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