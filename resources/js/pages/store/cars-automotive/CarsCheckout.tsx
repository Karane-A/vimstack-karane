import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, ShoppingCart, Package, CreditCard, Wrench, Settings, Zap } from 'lucide-react';
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

interface CarsCheckoutProps {
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

function CarsCheckout({
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
}: CarsCheckoutProps) {
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
  
  // Initialize country/state/city names on component load
  React.useEffect(() => {
    if (shippingCountry && countries?.length > 0) {
      const selectedCountry = countries.find((c: any) => c.id.toString() === shippingCountry.toString());
      setSelectedCountryName(selectedCountry?.name || '');
      
      // Load states for the selected country
      if (selectedCountry) {
        handleShippingCountryChange(shippingCountry.toString());
      }
    }
  }, [countries]);
  
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
  
  // Load states when states array is populated and we have a selected state
  React.useEffect(() => {
    if (shippingState && states.length > 0) {
      const selectedState = states.find((s: any) => s.id.toString() === shippingState.toString());
      if (selectedState) {
        setSelectedStateName(selectedState.name);
        // Load cities for the selected state
        handleShippingStateChange(shippingState.toString());
      }
    }
  }, [states]);
  
  // Load city name when cities array is populated and we have a selected city
  React.useEffect(() => {
    if (shippingCity && cities.length > 0) {
      const selectedCity = cities.find((c: any) => c.id.toString() === shippingCity.toString());
      if (selectedCity) {
        setSelectedCityName(selectedCity.name);
      }
    }
  }, [cities]);
  
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

  // Handle order placement
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
        theme="cars-automotive"
      >
        {/* Industrial Header */}
        <div className="bg-black text-white py-20 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <div className="w-6 h-6 bg-white transform -rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-wider">SECURE CHECKOUT</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Professional Parts Installation</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Complete your order with confidence - professional grade automotive parts
            </p>
          </div>
        </div>
        
        {/* Checkout Steps */}
        <div className="bg-gray-900 py-12">
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
                            w-16 h-16 flex items-center justify-center border-4 transition-all duration-300 transform
                            ${isCompleted ? 'bg-red-600 border-red-600 rotate-45' : isActive ? 'border-red-600 bg-black rotate-45' : 'border-gray-600 bg-gray-800'}
                          `}
                        >
                          <div className={`transform ${isCompleted || isActive ? '-rotate-45' : ''}`}>
                            {isCompleted ? (
                              <Check className="h-6 w-6 text-white" />
                            ) : (
                              <Icon className={`h-6 w-6 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                            )}
                          </div>
                        </div>
                        <span 
                          className={`
                            mt-3 text-sm font-black tracking-wider uppercase
                            ${isActive ? 'text-red-600' : isCompleted ? 'text-red-600' : 'text-gray-500'}
                          `}
                        >
                          {step.name}
                        </span>
                      </div>
                      {stepIdx < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-6 ${isCompleted ? 'bg-red-600' : 'bg-gray-600'} transition-colors duration-300`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="bg-white border-l-8 border-red-600 shadow-lg p-8">
                    <div className="bg-black text-white px-6 py-4 -mx-8 -mt-8 mb-8">
                      <div className="flex items-center">
                        <Package className="h-6 w-6 text-red-600 mr-3" />
                        <h2 className="text-2xl font-black tracking-wider uppercase">Delivery Information</h2>
                      </div>
                    </div>
                    
                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="shipping-first-name" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            First Name *
                          </label>
                          <input
                            id="shipping-first-name"
                            type="text"
                            value={shippingFirstName}
                            onChange={(e) => setShippingFirstName(e.target.value)}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingFirstName ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
                          />
                          {shippingErrors.shippingFirstName && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                          )}
                        </div>
                        
                        {/* Last Name */}
                        <div>
                          <label htmlFor="shipping-last-name" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            Last Name *
                          </label>
                          <input
                            id="shipping-last-name"
                            type="text"
                            value={shippingLastName}
                            onChange={(e) => setShippingLastName(e.target.value)}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingLastName ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
                          />
                          {shippingErrors.shippingLastName && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="shipping-email" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            Email Address *
                          </label>
                          <input
                            id="shipping-email"
                            type="email"
                            value={shippingEmail}
                            onChange={(e) => setShippingEmail(e.target.value)}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingEmail ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
                          />
                          {shippingErrors.shippingEmail && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                          )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label htmlFor="shipping-phone" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            Phone Number *
                          </label>
                          <input
                            id="shipping-phone"
                            type="tel"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingPhone ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
                          />
                          {shippingErrors.shippingPhone && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                          )}
                        </div>
                        
                        {/* Street Address */}
                        <div className="md:col-span-2">
                          <label htmlFor="shipping-street" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            Street Address *
                          </label>
                          <input
                            id="shipping-street"
                            type="text"
                            value={shippingStreet}
                            onChange={(e) => setShippingStreet(e.target.value)}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingStreet ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
                          />
                          {shippingErrors.shippingStreet && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                          )}
                        </div>
                        
                        {/* Country */}
                        <div>
                          <label htmlFor="shipping-country" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            Country *
                          </label>
                          <select
                            id="shipping-country"
                            value={shippingCountry}
                            onChange={(e) => handleShippingCountryChange(e.target.value)}
                            className="block w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
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
                          <label htmlFor="shipping-state" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            State / Province *
                          </label>
                          <select
                            id="shipping-state"
                            value={shippingState}
                            onChange={(e) => handleShippingStateChange(e.target.value)}
                            disabled={!shippingCountry || loadingStates}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingState ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
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
                          <label htmlFor="shipping-city" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
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
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingCity ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
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
                          <label htmlFor="shipping-zip" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                            ZIP / Postal Code *
                          </label>
                          <input
                            id="shipping-zip"
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            className={`block w-full px-4 py-3 border-2 ${
                              shippingErrors.shippingZip ? 'border-red-500' : 'border-gray-300 focus:border-red-600'
                            } focus:outline-none transition-colors`}
                          />
                          {shippingErrors.shippingZip && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Shipping Methods */}
                      <div className="mt-8">
                        <h3 className="text-xl font-black tracking-wider uppercase text-gray-900 mb-4">Delivery Method</h3>
                        
                        <div className="space-y-3">
                          {shippingMethods.length > 0 ? (
                            shippingMethods.map((method) => {
                              const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                ? 0 
                                : method.cost + (method.handling_fee || 0);
                              
                              return (
                                <div key={method.id} className={`relative border-2 p-4 cursor-pointer transition-all duration-300 ${
                                  selectedShippingId === method.id ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-red-400'
                                }`}>
                                  <div className="flex items-center">
                                    <input
                                      id={`shipping-${method.id}`}
                                      name="shipping-method"
                                      type="radio"
                                      checked={selectedShippingId === method.id}
                                      onChange={() => setSelectedShippingId(method.id)}
                                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300"
                                    />
                                    <label htmlFor={`shipping-${method.id}`} className="ml-4 flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <span className="block text-sm font-bold text-gray-900">{method.name}</span>
                                          <span className="block text-sm text-gray-600">
                                            {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                          </span>
                                        </div>
                                        <span className="text-lg font-bold text-red-600">
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
                        <label htmlFor="order-notes" className="block text-sm font-black tracking-wider uppercase text-gray-900 mb-2">
                          Installation Notes (Optional)
                        </label>
                        <textarea
                          id="order-notes"
                          rows={4}
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Any special installation instructions or requirements"
                          className="block w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-6">
                        <button
                          type="submit"
                          className="bg-red-600 text-white px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          Review Order
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="bg-white border-l-8 border-red-600 shadow-lg p-8">
                    <div className="bg-black text-white px-6 py-4 -mx-8 -mt-8 mb-8">
                      <div className="flex items-center">
                        <ShoppingCart className="h-6 w-6 text-red-600 mr-3" />
                        <h2 className="text-2xl font-black tracking-wider uppercase">Review Your Order</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-xl font-black tracking-wider uppercase text-gray-900 mb-4">Performance Parts</h3>
                        
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const itemPrice = item.sale_price || item.price;
                            const itemTotal = itemPrice * item.quantity;
                            
                            return (
                              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 border-2 border-gray-200">
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden border-2 border-gray-300">
                                  <img 
                                    className="h-full w-full object-cover" 
                                    src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(item.name)}`}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="text-lg font-bold text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                  <div className="text-sm text-gray-600">Category: {item.category.name}</div>
                                </div>
                                <div className="text-lg font-bold text-red-600">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Delivery Information */}
                      <div>
                        <h3 className="text-xl font-black tracking-wider uppercase text-gray-900 mb-4">Delivery Information</h3>
                        
                        <div className="bg-gray-50 p-6 border-2 border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-black tracking-wider uppercase text-red-600 mb-2">Contact Details</p>
                              <p className="text-gray-900">{shippingFirstName} {shippingLastName}</p>
                              <p className="text-gray-900">{shippingEmail}</p>
                              <p className="text-gray-900">{shippingPhone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-black tracking-wider uppercase text-red-600 mb-2">Delivery Address</p>
                              <p className="text-gray-900">{shippingStreet}</p>
                              <p className="text-gray-900">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                              <p className="text-gray-900">{selectedCountryName}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t-2 border-gray-300">
                            <p className="text-sm font-black tracking-wider uppercase text-red-600 mb-2">Delivery Method</p>
                            <p className="text-gray-900">
                              {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      {orderNotes && (
                        <div>
                          <h3 className="text-xl font-black tracking-wider uppercase text-gray-900 mb-4">Installation Notes</h3>
                          
                          <div className="bg-gray-50 p-6 border-2 border-gray-200">
                            <p className="text-gray-900">{orderNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-6">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('shipping')}
                          className="border-2 border-red-600 text-red-600 px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          Back to Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('payment')}
                          className="bg-red-600 hover:bg-black text-white px-8 py-4 font-bold tracking-wider uppercase transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="bg-white border-l-8 border-red-600 shadow-lg p-8">
                    <div className="bg-black text-white px-6 py-4 -mx-8 -mt-8 mb-8">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-red-600 mr-3" />
                        <h2 className="text-2xl font-black tracking-wider uppercase">Payment Details</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Billing Address */}
                      <div>
                        <h3 className="text-xl font-black tracking-wider uppercase text-gray-900 mb-4">Billing Address</h3>
                        
                        <div className="flex items-center mb-6">
                          <input
                            id="same-as-shipping"
                            type="checkbox"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300"
                          />
                          <label htmlFor="same-as-shipping" className="ml-3 block text-sm text-gray-900 font-medium">
                            Same as delivery address
                          </label>
                        </div>
                        
                        {!sameAsShipping && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 border-2 border-gray-200">
                            {/* Billing form fields would go here - similar to shipping */}
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Methods */}
                      <div>
                        <h3 className="text-xl font-black tracking-wider uppercase text-gray-900 mb-4">Payment Method</h3>
                        
                        <div className="space-y-3">
                          {/* Cash on Delivery */}
                          <div className={`relative border-2 p-4 cursor-pointer transition-all duration-300 ${
                            paymentMethod === 'cod' ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-red-400'
                          }`}>
                            <div className="flex items-center">
                              <input
                                id="payment-cod"
                                name="payment-method"
                                type="radio"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300"
                              />
                              <label htmlFor="payment-cod" className="ml-4 flex-1 cursor-pointer">
                                <span className="block text-sm font-bold text-gray-900">Cash on Delivery</span>
                                <span className="block text-sm text-gray-600">Pay when your parts are delivered</span>
                              </label>
                            </div>
                          </div>

                          {/* Dynamic Payment Methods */}
                          {Object.entries(enabledPaymentMethods).filter(([method]) => !['whatsapp', 'telegram'].includes(method)).map(([method, config]: [string, any]) => {
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
                              <div key={method} className={`relative border-2 p-4 cursor-pointer transition-all duration-300 ${
                                paymentMethod === method ? 'border-red-600 bg-red-50' : 'border-gray-300 hover:border-red-400'
                              }`}>
                                <div className="flex items-center">
                                  <input
                                    id={`payment-${method}`}
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300"
                                  />
                                  <label htmlFor={`payment-${method}`} className="ml-4 flex-1 cursor-pointer">
                                    <span className="block text-sm font-bold text-gray-900">
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
                      
                      <div className="flex justify-between pt-6">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('review')}
                          className="border-2 border-red-600 text-red-600 px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          Back to Review
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          className="bg-red-600 hover:bg-black text-white px-8 py-4 font-bold tracking-wider uppercase transition-colors flex items-center gap-3"
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
                <div className="bg-black text-white p-8 border-l-4 border-red-600 sticky top-8">
                  <div className="flex items-center mb-6">
                    <Settings className="h-6 w-6 text-red-600 mr-3" />
                    <h2 className="text-2xl font-black tracking-wider uppercase">Order Summary</h2>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden border border-gray-600">
                            <img
                              src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.name}</p>
                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-red-400">
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
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <div className="flex flex-col space-y-3">
                      <label htmlFor="coupon" className="text-sm font-black tracking-wider uppercase text-red-400">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-grow px-3 py-2 border border-gray-600 bg-gray-800 text-white focus:outline-none focus:border-red-600"
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
                          className={`px-4 py-2 text-sm font-bold transition-colors ${
                            couponApplied 
                              ? 'bg-gray-600 text-white hover:bg-gray-700' 
                              : 'bg-red-600 text-white hover:bg-red-700'
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
                    <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                      <p className="font-bold tracking-wider uppercase">Subtotal</p>
                      <p className="font-black text-white">{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</p>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-green-400 border-b border-gray-700 pb-2">
                        <p className="font-bold tracking-wider uppercase">Discount</p>
                        <p className="font-black">-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                      <p className="font-bold tracking-wider uppercase">Shipping</p>
                      <p className="font-black text-white">{selectedShippingId ? (updatedCartSummary.shipping === 0 ? 'FREE' : formatCurrency(updatedCartSummary.shipping, storeSettings, currencies)) : 'Select method'}</p>
                    </div>
                    
                    <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                      <p className="font-bold tracking-wider uppercase">Tax</p>
                      <p className="font-black text-white">{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</p>
                    </div>
                    
                    <div className="flex justify-between text-xl font-black text-white pt-3 border-t-2 border-red-600">
                      <p className="tracking-wider uppercase">Total</p>
                      <p className="text-red-400">{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</p>
                    </div>
                  </div>
                  

                  
                  {/* Secure Checkout */}
                  <div className="mt-6 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-red-400 mr-2" />
                    <p className="text-xs text-gray-300 font-medium tracking-wider uppercase">Secure & Protected Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StoreLayout>
      </>
    );
  }

export default CarsCheckout;