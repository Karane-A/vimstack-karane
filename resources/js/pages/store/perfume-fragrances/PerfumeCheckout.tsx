import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, ShoppingCart, Package, CreditCard, Sparkles, Star, Heart } from 'lucide-react';
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

interface PerfumeCheckoutProps {
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

function PerfumeCheckout({
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
}: PerfumeCheckoutProps) {
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
    { id: 'shipping', name: 'Delivery', icon: Package },
    { id: 'review', name: 'Review', icon: ShoppingCart },
    { id: 'payment', name: 'Payment', icon: CreditCard },
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
  
  // Initialize country/state/city names on component load
  React.useEffect(() => {
    if (shippingCountry && countries?.length > 0) {
      const selectedCountry = countries.find((c: any) => c.id.toString() === shippingCountry.toString());
      setSelectedCountryName(selectedCountry?.name || '');
    }
  }, [shippingCountry, countries]);
  
  // Load city name when cities array is populated and we have a selected city
  React.useEffect(() => {
    if (shippingCity && cities.length > 0) {
      const selectedCity = cities.find((c: any) => c.id.toString() === shippingCity.toString());
      if (selectedCity) {
        setSelectedCityName(selectedCity.name);
      }
    }
  }, [shippingCity, cities]);
  
  // Load state name when states array is populated and we have a selected state
  React.useEffect(() => {
    if (shippingState && states.length > 0) {
      const selectedState = states.find((s: any) => s.id.toString() === shippingState.toString());
      if (selectedState) {
        setSelectedStateName(selectedState.name);
      }
    }
  }, [shippingState, states]);
  
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
  
  // Handle WhatsApp number validation
  const handleWhatsAppNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWhatsappNumber(value);
    
    if (paymentErrors.whatsappNumber) {
      setPaymentErrors(prev => ({ ...prev, whatsappNumber: '' }));
    }
    
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
        theme="perfume-fragrances"
      >
        {/* Elegant Header */}
        <div className="bg-gradient-to-r from-purple-50 to-stone-50 py-20 border-b border-purple-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-px bg-amber-400"></div>
                <div className="mx-6">
                  <svg className="w-8 h-8 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="w-16 h-px bg-amber-400"></div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                Secure Checkout
              </h1>
              
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                Complete your fragrance journey with confidence
              </p>
            </div>
          </div>
        </div>
        
        {/* Checkout Steps */}
        <div className="bg-white py-12 border-b border-purple-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                {steps.map((step, stepIdx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`
                            w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300
                            ${isCompleted ? 'bg-purple-800 border-purple-800' : isActive ? 'border-purple-800 bg-purple-50' : 'border-gray-300 bg-gray-50'}
                          `}
                        >
                          {isCompleted ? (
                            <Check className="h-6 w-6 text-white" />
                          ) : (
                            <Icon className={`h-6 w-6 ${isActive ? 'text-purple-800' : 'text-gray-400'}`} />
                          )}
                        </div>
                        <span 
                          className={`
                            mt-3 text-sm font-medium
                            ${isActive ? 'text-purple-800' : isCompleted ? 'text-purple-800' : 'text-gray-500'}
                          `}
                        >
                          {step.name}
                        </span>
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div className={`flex-1 h-px mx-6 ${isCompleted ? 'bg-purple-800' : 'bg-gray-300'} transition-colors duration-300`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-stone-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
                    <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 -mx-8 -mt-8 mb-8 rounded-t-3xl">
                      <div className="flex items-center">
                        <Package className="h-6 w-6 text-amber-400 mr-3" />
                        <h2 className="text-2xl font-light">Delivery Information</h2>
                      </div>
                    </div>
                    
                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="shipping-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            id="shipping-first-name"
                            type="text"
                            value={shippingFirstName}
                            onChange={(e) => setShippingFirstName(e.target.value)}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingFirstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {shippingErrors.shippingFirstName && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                          )}
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label htmlFor="shipping-last-name" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            id="shipping-last-name"
                            type="text"
                            value={shippingLastName}
                            onChange={(e) => setShippingLastName(e.target.value)}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingLastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {shippingErrors.shippingLastName && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="shipping-email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            id="shipping-email"
                            type="email"
                            value={shippingEmail}
                            onChange={(e) => setShippingEmail(e.target.value)}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingEmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {shippingErrors.shippingEmail && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                          )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            id="shipping-phone"
                            type="tel"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingPhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {shippingErrors.shippingPhone && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                          )}
                        </div>
                        
                        {/* Street Address */}
                        <div className="md:col-span-2">
                          <label htmlFor="shipping-street" className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            id="shipping-street"
                            type="text"
                            value={shippingStreet}
                            onChange={(e) => setShippingStreet(e.target.value)}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingStreet ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {shippingErrors.shippingStreet && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                          )}
                        </div>
                        
                        {/* Country */}
                        <div>
                          <label htmlFor="shipping-country" className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <select
                            id="shipping-country"
                            value={shippingCountry}
                            onChange={(e) => handleShippingCountryChange(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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
                          <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-700 mb-2">
                            State / Province *
                          </label>
                          <select
                            id="shipping-state"
                            value={shippingState}
                            onChange={(e) => handleShippingStateChange(e.target.value)}
                            disabled={!shippingCountry || loadingStates}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingState ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                          <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-700 mb-2">
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
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingCity ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                          <label htmlFor="shipping-zip" className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP / Postal Code *
                          </label>
                          <input
                            id="shipping-zip"
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                              shippingErrors.shippingZip ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {shippingErrors.shippingZip && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Shipping Methods */}
                      <div className="mt-8">
                        <h3 className="text-xl font-medium text-purple-800 mb-4">Delivery Method</h3>
                        
                        <div className="space-y-3">
                          {shippingMethods.length > 0 ? (
                            shippingMethods.map((method) => {
                              const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                ? 0 
                                : method.cost + (method.handling_fee || 0);
                              
                              return (
                                <div key={method.id} className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                                  selectedShippingId === method.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                                }`}>
                                  <div className="flex items-center">
                                    <input
                                      id={`shipping-${method.id}`}
                                      name="shipping-method"
                                      type="radio"
                                      checked={selectedShippingId === method.id}
                                      onChange={() => setSelectedShippingId(method.id)}
                                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                                    />
                                    <label htmlFor={`shipping-${method.id}`} className="ml-4 flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <span className="block text-sm font-medium text-gray-900">{method.name}</span>
                                          <span className="block text-sm text-gray-600">
                                            {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                          </span>
                                        </div>
                                        <span className="text-lg font-medium text-purple-800">
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
                      <div className="mt-8">
                        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          id="order-notes"
                          rows={4}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Any special delivery instructions or fragrance preferences..."
                          className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-6">
                        <button
                          type="submit"
                          className="bg-purple-800 text-white px-8 py-4 rounded-full font-medium hover:bg-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          Review Order
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
                    <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 -mx-8 -mt-8 mb-8 rounded-t-3xl">
                      <div className="flex items-center">
                        <ShoppingCart className="h-6 w-6 text-amber-400 mr-3" />
                        <h2 className="text-2xl font-light">Review Your Order</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-xl font-medium text-purple-800 mb-4">Fragrance Collection</h3>
                        
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const itemPrice = item.sale_price || item.price;
                            const itemTotal = itemPrice * item.quantity;
                            
                            return (
                              <div key={item.id} className="flex items-center space-x-4 p-4 bg-stone-50 rounded-xl border border-purple-100">
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-purple-200">
                                  <img 
                                    className="h-full w-full object-cover" 
                                    src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/400x400/f5f5f5/7c3aed?text=${encodeURIComponent(item.name)}`}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-lg font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                  <div className="text-sm text-gray-600">Category: {item.category.name}</div>
                                </div>
                                <div className="text-lg font-medium text-purple-800">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Delivery Information */}
                      <div>
                        <h3 className="text-xl font-medium text-purple-800 mb-4">Delivery Information</h3>
                        
                        <div className="bg-stone-50 p-6 rounded-xl border border-purple-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-medium text-purple-800 mb-2">Contact Details</p>
                              <p className="text-gray-900">{shippingFirstName} {shippingLastName}</p>
                              <p className="text-gray-900">{shippingEmail}</p>
                              <p className="text-gray-900">{shippingPhone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-purple-800 mb-2">Delivery Address</p>
                              <p className="text-gray-900">{shippingStreet}</p>
                              <p className="text-gray-900">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                              <p className="text-gray-900">{selectedCountryName}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-purple-200">
                            <p className="text-sm font-medium text-purple-800 mb-2">Delivery Method</p>
                            <p className="text-gray-900">
                              {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      {orderNotes && (
                        <div>
                          <h3 className="text-xl font-medium text-purple-800 mb-4">Special Instructions</h3>
                          
                          <div className="bg-stone-50 p-6 rounded-xl border border-purple-100">
                            <p className="text-gray-900">{orderNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-6">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('shipping')}
                          className="border-2 border-purple-800 text-purple-800 px-6 py-3 rounded-full font-medium hover:bg-purple-800 hover:text-white transition-all duration-300"
                        >
                          Back to Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('payment')}
                          className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-4 rounded-full font-medium transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
                    <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 -mx-8 -mt-8 mb-8 rounded-t-3xl">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-amber-400 mr-3" />
                        <h2 className="text-2xl font-light">Payment Details</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Billing Address */}
                      <div>
                        <h3 className="text-xl font-medium text-purple-800 mb-4">Billing Address</h3>
                        
                        <div className="flex items-center mb-6">
                          <input
                            id="same-as-shipping"
                            type="checkbox"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                          />
                          <label htmlFor="same-as-shipping" className="ml-3 block text-sm text-gray-900 font-medium">
                            Same as delivery address
                          </label>
                        </div>
                        
                        {!sameAsShipping && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-stone-50 rounded-xl border border-purple-100">
                            {/* Billing form fields would go here - similar to shipping */}
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-xl font-medium text-purple-800 mb-4">Payment Method</h3>
                        
                        <div className="space-y-3">
                          {/* Cash on Delivery */}
                          <div className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                            paymentMethod === 'cod' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                          }`}>
                            <div className="flex items-center">
                              <input
                                id="payment-cod"
                                name="payment-method"
                                type="radio"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                              />
                              <label htmlFor="payment-cod" className="ml-4 flex-1 cursor-pointer">
                                <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                                <span className="block text-sm text-gray-600">Pay when your fragrances are delivered</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* WhatsApp Payment */}
                          {enabledPaymentMethods.whatsapp && (
                            <div className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                              paymentMethod === 'whatsapp' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-whatsapp"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'whatsapp'}
                                  onChange={() => setPaymentMethod('whatsapp')}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                                />
                                <label htmlFor="payment-whatsapp" className="ml-4 flex-1 cursor-pointer">
                                  <span className="block text-sm font-medium text-gray-900">WhatsApp</span>
                                  <span className="block text-sm text-gray-600">Complete your fragrance order via WhatsApp</span>
                                </label>
                              </div>
                            </div>
                          )}
                          
                          {/* Telegram Payment */}
                          {enabledPaymentMethods.telegram && (
                            <div className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                              paymentMethod === 'telegram' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-telegram"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'telegram'}
                                  onChange={() => setPaymentMethod('telegram')}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                                />
                                <label htmlFor="payment-telegram" className="ml-4 flex-1 cursor-pointer">
                                  <span className="block text-sm font-medium text-gray-900">Telegram</span>
                                  <span className="block text-sm text-gray-600">Complete your fragrance order via Telegram</span>
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
                              <div key={method} className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                                paymentMethod === method ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                              }`}>
                                <div className="flex items-center">
                                  <input
                                    id={`payment-${method}`}
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                                  />
                                  <label htmlFor={`payment-${method}`} className="ml-4 flex-1 cursor-pointer">
                                    <span className="block text-sm font-medium text-gray-900">
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
                        
                        {/* WhatsApp Number Input */}
                        {paymentMethod === 'whatsapp' && (
                          <div className="mt-6">
                            <h3 className="text-xl font-medium text-purple-800 mb-4">WhatsApp Details</h3>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number *</label>
                              <input
                                type="tel"
                                value={whatsappNumber}
                                onChange={handleWhatsAppNumberChange}
                                placeholder="+1234567890"
                                className={`block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                                  paymentErrors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              <p className="mt-2 text-sm text-gray-600">
                                Enter your WhatsApp number with country code (e.g., +1234567890)
                              </p>
                              {paymentErrors.whatsappNumber && (
                                <p className="mt-2 text-sm text-red-600">{paymentErrors.whatsappNumber}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between pt-6">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('review')}
                          className="border-2 border-purple-800 text-purple-800 px-6 py-3 rounded-full font-medium hover:bg-purple-800 hover:text-white transition-all duration-300"
                        >
                          Back to Review
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-4 rounded-full font-medium transition-colors flex items-center gap-3"
                        >
                          <Lock className="w-5 h-5" />
                          Complete Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-800 to-purple-900 text-white p-8 rounded-3xl sticky top-8 border border-purple-700">
                  <div className="flex items-center mb-6">
                    <Sparkles className="h-6 w-6 text-amber-400 mr-3" />
                    <h2 className="text-2xl font-light">Order Summary</h2>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-purple-600">
                            <img
                              src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/400x400/f5f5f5/7c3aed?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.name}</p>
                            <p className="text-sm text-purple-200">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-amber-400">
                            {formatCurrency(parseFloat(itemPrice) * item.quantity, storeSettings, currencies)}
                          </p>
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
                  <div className="mb-6 pb-6 border-b border-purple-700">
                    <div className="flex flex-col space-y-3">
                      <label htmlFor="coupon" className="text-sm font-medium text-amber-400">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-grow px-3 py-2 border border-purple-600 bg-purple-800 text-white rounded-l-lg focus:outline-none focus:border-amber-400"
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
                          className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                            couponApplied 
                              ? 'bg-purple-600 text-white hover:bg-purple-700' 
                              : 'bg-amber-400 text-purple-900 hover:bg-amber-500'
                          }`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-400 font-medium">Coupon applied successfully!</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-purple-200 border-b border-purple-700 pb-2">
                      <p className="font-medium">Subtotal</p>
                      <p className="font-medium text-white">{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</p>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-green-400 border-b border-purple-700 pb-2">
                        <p className="font-medium">Discount</p>
                        <p className="font-medium">-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-purple-200 border-b border-purple-700 pb-2">
                      <p className="font-medium">Shipping</p>
                      <p className="font-medium text-white">{selectedShippingId ? (updatedCartSummary.shipping === 0 ? 'FREE' : formatCurrency(updatedCartSummary.shipping, storeSettings, currencies)) : 'Select method'}</p>
                    </div>
                    
                    <div className="flex justify-between text-purple-200 border-b border-purple-700 pb-2">
                      <p className="font-medium">Tax</p>
                      <p className="font-medium text-white">{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</p>
                    </div>
                    
                    <div className="flex justify-between text-xl font-medium text-white pt-3 border-t-2 border-amber-400">
                      <p>Total</p>
                      <p className="text-amber-400">{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</p>
                    </div>
                  </div>
                  
                  {/* Secure Checkout */}
                  <div className="mt-6 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-amber-400 mr-2" />
                    <p className="text-xs text-purple-200 font-medium">Secure & Protected Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StoreLayout>
      </>
    );
  }

export default PerfumeCheckout;