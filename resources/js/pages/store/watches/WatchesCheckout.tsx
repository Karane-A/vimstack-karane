import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, Clock, Shield, CreditCard } from 'lucide-react';
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

interface WatchesCheckoutProps {
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

export default function WatchesCheckout({
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
}: WatchesCheckoutProps) {
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
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('cod');
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

  const handlePlaceOrder = async () => {
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
        theme="watches"
      >
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-slate-600">
              <Link href={route('store.home', { storeSlug })} className="hover:text-amber-600 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href={route('store.cart', { storeSlug })} className="hover:text-amber-600 transition-colors">Cart</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-slate-900 font-medium">Checkout</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-slate-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, stepIdx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted ? 'bg-amber-500 text-slate-900' : 
                        isActive ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : stepIdx + 1}
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 ${
                          isCompleted ? 'bg-amber-500' : 'bg-slate-300'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-600">
                {steps.map((step) => (
                  <span key={step.id} className={currentStep === step.id ? 'text-slate-900' : ''}>
                    {step.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  {/* Shipping Step */}
                  {currentStep === 'shipping' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-slate-900" />
                        </div>
                        <h2 className="text-2xl font-light text-slate-900 mb-2">Delivery Details</h2>
                        <p className="text-slate-600">Where should we deliver your luxury timepieces?</p>
                      </div>

                      <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div>
                            <label htmlFor="shipping-first-name" className="block text-sm font-medium text-slate-700 mb-2">
                              First Name *
                            </label>
                            <input
                              id="shipping-first-name"
                              type="text"
                              value={shippingFirstName}
                              onChange={(e) => setShippingFirstName(e.target.value)}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingFirstName ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
                            />
                            {shippingErrors.shippingFirstName && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                            )}
                          </div>
                          
                          {/* Last Name */}
                          <div>
                            <label htmlFor="shipping-last-name" className="block text-sm font-medium text-slate-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              id="shipping-last-name"
                              type="text"
                              value={shippingLastName}
                              onChange={(e) => setShippingLastName(e.target.value)}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingLastName ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
                            />
                            {shippingErrors.shippingLastName && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                            )}
                          </div>
                          
                          {/* Email */}
                          <div>
                            <label htmlFor="shipping-email" className="block text-sm font-medium text-slate-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              id="shipping-email"
                              type="email"
                              value={shippingEmail}
                              onChange={(e) => setShippingEmail(e.target.value)}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingEmail ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
                            />
                            {shippingErrors.shippingEmail && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                            )}
                          </div>
                          
                          {/* Phone */}
                          <div>
                            <label htmlFor="shipping-phone" className="block text-sm font-medium text-slate-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              id="shipping-phone"
                              type="tel"
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value)}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingPhone ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
                            />
                            {shippingErrors.shippingPhone && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                            )}
                          </div>
                          
                          {/* Street Address */}
                          <div className="md:col-span-2">
                            <label htmlFor="shipping-street" className="block text-sm font-medium text-slate-700 mb-2">
                              Street Address *
                            </label>
                            <input
                              id="shipping-street"
                              type="text"
                              value={shippingStreet}
                              onChange={(e) => setShippingStreet(e.target.value)}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingStreet ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
                            />
                            {shippingErrors.shippingStreet && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                            )}
                          </div>
                          
                          {/* Country */}
                          <div>
                            <label htmlFor="shipping-country" className="block text-sm font-medium text-slate-700 mb-2">
                              Country *
                            </label>
                            <select
                              id="shipping-country"
                              value={shippingCountry}
                              onChange={(e) => handleCountryChange(e.target.value)}
                              className="w-full px-3 py-3 border border-slate-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors"
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
                            <label htmlFor="shipping-state" className="block text-sm font-medium text-slate-700 mb-2">
                              State / Province *
                            </label>
                            <select
                              id="shipping-state"
                              value={shippingState}
                              onChange={(e) => handleStateChange(e.target.value)}
                              disabled={!shippingCountry || loadingStates}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingState ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
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
                            <label htmlFor="shipping-city" className="block text-sm font-medium text-slate-700 mb-2">
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
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingCity ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
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
                            <label htmlFor="shipping-zip" className="block text-sm font-medium text-slate-700 mb-2">
                              ZIP / Postal Code *
                            </label>
                            <input
                              id="shipping-zip"
                              type="text"
                              value={shippingZip}
                              onChange={(e) => setShippingZip(e.target.value)}
                              className={`w-full px-3 py-3 border rounded-md ${
                                shippingErrors.shippingZip ? 'border-red-500' : 'border-slate-300'
                              } focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors`}
                            />
                            {shippingErrors.shippingZip && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Shipping Methods */}
                        <div className="bg-slate-50 rounded-lg p-6">
                          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 text-amber-500 mr-2" />
                            Delivery Options
                          </h3>
                          
                          <div className="space-y-3">
                            {shippingMethods.length > 0 ? (
                              shippingMethods.map((method) => {
                                const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                  ? 0 
                                  : method.cost + (method.handling_fee || 0);
                                
                                return (
                                  <label key={method.id} className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    selectedShippingId === method.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <input
                                          id={`shipping-${method.id}`}
                                          name="shipping-method"
                                          type="radio"
                                          checked={selectedShippingId === method.id}
                                          onChange={() => setSelectedShippingId(method.id)}
                                          className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300"
                                        />
                                        <div className="ml-3">
                                          <div className="text-sm font-medium text-slate-900">{method.name}</div>
                                          <div className="text-sm text-slate-600">
                                            {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-sm font-medium text-slate-900">
                                        {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost, storeSettings, currencies)}
                                      </div>
                                    </div>
                                  </label>
                                );
                              })
                            ) : (
                              <div className="text-center py-8 text-slate-500">
                                No shipping methods available
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Order Notes */}
                        <div>
                          <label htmlFor="order-notes" className="block text-sm font-medium text-slate-700 mb-2">
                            Special Instructions (Optional)
                          </label>
                          <textarea
                            id="order-notes"
                            rows={3}
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="Any special delivery instructions"
                            className="w-full px-3 py-3 border border-slate-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors"
                          />
                        </div>
                        
                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            className="bg-amber-500 text-slate-900 px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors flex items-center"
                          >
                            Continue to Review
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {/* Review Step */}
                  {currentStep === 'review' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Check className="w-8 h-8 text-slate-900" />
                        </div>
                        <h2 className="text-2xl font-light text-slate-900 mb-2">Review Order</h2>
                        <p className="text-slate-600">Please verify your timepiece order details</p>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-6">Your Timepieces</h3>
                          
                          <div className="space-y-4">
                            {cartItems.map((item) => {
                              const itemPrice = item.sale_price || item.price;
                              const itemTotal = itemPrice * item.quantity;
                              
                              return (
                                <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-slate-100">
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-slate-200 rounded">
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
                                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                    <div className="text-sm text-slate-600">Quantity: {item.quantity}</div>
                                  </div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {formatCurrency(itemTotal, storeSettings, currencies)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Shipping Information */}
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-6">Delivery Information</h3>
                          
                          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-sm font-medium text-slate-700 mb-2">Contact Details</p>
                                <p className="text-sm text-slate-900">{shippingFirstName} {shippingLastName}</p>
                                <p className="text-sm text-slate-900">{shippingEmail}</p>
                                <p className="text-sm text-slate-900">{shippingPhone}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700 mb-2">Delivery Address</p>
                                <p className="text-sm text-slate-900">{shippingStreet}</p>
                                <p className="text-sm text-slate-900">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                                <p className="text-sm text-slate-900">{selectedCountryName}</p>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-200">
                              <p className="text-sm font-medium text-slate-700 mb-2">Delivery Method</p>
                              <p className="text-sm text-slate-900">
                                {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Notes */}
                        {orderNotes && (
                          <div>
                            <h3 className="text-lg font-medium text-slate-900 mb-6">Special Instructions</h3>
                            
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                              <p className="text-sm text-slate-900">{orderNotes}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={() => setCurrentStep('shipping')}
                            className="border border-slate-300 text-slate-700 px-6 py-3 rounded-md font-medium hover:border-slate-400 transition-colors"
                          >
                            Back to Shipping
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentStep('payment')}
                            className="bg-amber-500 text-slate-900 px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors flex items-center"
                          >
                            Continue to Payment
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Payment Step */}
                  {currentStep === 'payment' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-slate-900" />
                        </div>
                        <h2 className="text-2xl font-light text-slate-900 mb-2">Payment Details</h2>
                        <p className="text-slate-600">Secure payment for your luxury timepieces</p>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
                        {/* Billing Address */}
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-6">Billing Address</h3>
                          
                          <div className="flex items-center mb-6">
                            <input
                              id="same-as-shipping"
                              type="checkbox"
                              checked={sameAsShipping}
                              onChange={(e) => setSameAsShipping(e.target.checked)}
                              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
                            />
                            <label htmlFor="same-as-shipping" className="ml-3 text-sm text-slate-700">
                              Same as delivery address
                            </label>
                          </div>
                        </div>
                        
                        {/* Payment Methods */}
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-6">Payment Method</h3>
                          
                          <div className="space-y-3">
                            {/* Always show Cash on Delivery */}
                            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-cod"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'cod'}
                                  onChange={() => setPaymentMethod('cod')}
                                  className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300"
                                />
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-slate-900">Cash on Delivery</div>
                                  <div className="text-sm text-slate-600">Pay when your timepiece is delivered</div>
                                </div>
                              </div>
                            </label>

                            {/* Dynamic Payment Methods */}
                            {Object.entries(enabledPaymentMethods).map(([method, config]: [string, any]) => {
                              const methodNames: Record<string, string> = {
                                stripe: 'Credit Card (Stripe)',
                                paypal: 'PayPal',
                                paystack: 'Paystack',
                                flutterwave: 'Flutterwave',
                                bank: 'Bank Transfer',
                                skrill: 'Skrill',
                                coingate: 'CoinGate'
                              };
                              
                              return (
                                <label key={method} className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  paymentMethod === method ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}>
                                  <div className="flex items-center">
                                    <input
                                      id={`payment-${method}`}
                                      name="payment-method"
                                      type="radio"
                                      checked={paymentMethod === method}
                                      onChange={() => setPaymentMethod(method)}
                                      className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300"
                                    />
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-slate-900">
                                        {methodNames[method] || method.charAt(0).toUpperCase() + method.slice(1)}
                                      </div>
                                      <div className="text-sm text-slate-600">
                                        Secure payment with {methodNames[method] || method}
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={() => setCurrentStep('review')}
                            className="border border-slate-300 text-slate-700 px-6 py-3 rounded-md font-medium hover:border-slate-400 transition-colors"
                          >
                            Back to Review
                          </button>
                          <button
                            type="button"
                            onClick={handlePlaceOrder}
                            className="bg-amber-500 text-slate-900 px-8 py-3 rounded-md font-medium hover:bg-amber-600 transition-colors flex items-center"
                          >
                            <Shield className="mr-2 h-5 w-5" />
                            Complete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-6">
                    <h2 className="text-lg font-medium text-slate-900 mb-6 flex items-center">
                      <Clock className="w-5 h-5 text-amber-500 mr-2" />
                      Order Summary
                    </h2>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => {
                        const itemPrice = item.sale_price || item.price;
                        
                        return (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-slate-200">
                              <img
                                src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-slate-900 truncate">{item.name}</h3>
                              <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-medium text-slate-900">
                              {formatCurrency(parseFloat(itemPrice) * item.quantity, storeSettings, currencies)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* General Payment Errors */}
                    {paymentErrors.general && (
                      <div className="mb-6">
                        <div className="p-4 text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-xl">
                          {paymentErrors.general}
                        </div>
                      </div>
                    )}
                  </div>
                    
                    {/* Coupon Code */}
                    <div className="mb-6 border-t border-slate-200 pt-6">
                      <label htmlFor="coupon" className="block text-sm font-medium text-slate-700 mb-2">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm"
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
                          className={`px-4 py-2 rounded-r-md text-sm font-medium transition-colors ${
                            couponApplied ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-500 text-slate-900 hover:bg-amber-600'
                          }`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-600 mt-2">Coupon applied successfully!</p>
                      )}
                    </div>
                    
                    {/* Price Summary */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      
                      {updatedCartSummary.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Shipping</span>
                        <span>{selectedShippingId ? formatCurrency(updatedCartSummary.shipping, storeSettings, currencies) : 'Select method'}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Tax</span>
                        <span>{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</span>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between text-lg font-medium text-slate-900">
                          <span>Total</span>
                          <span>{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Security Badge */}
                    <div className="mt-6 p-3 bg-slate-50 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-xs text-slate-600">256-bit SSL Secure Checkout</span>
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