import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, Gem, Shield, Star, CreditCard, Truck, Award, Clock, ArrowLeft } from 'lucide-react';
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

interface JewelryCheckoutProps {
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

function JewelryCheckout({
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
}: JewelryCheckoutProps) {
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
    { id: 'shipping', name: 'Delivery', icon: MapPin },
    { id: 'review', name: 'Review', icon: Check },
    { id: 'payment', name: 'Payment', icon: Shield },
  ];
  
  const [currentStep, setCurrentStep] = useState('shipping');
  
  // Form states
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
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
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
    if (!shippingEmail) newErrors.shippingEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingEmail)) newErrors.shippingEmail = 'Email is invalid';
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
      <Head title={`Luxury Checkout - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        storeId={store.id}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        storeContent={storeContent}
        theme={store.theme}
      >
        {/* Luxury Header */}
        <div className="bg-yellow-50 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full shadow-lg mb-8">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">
                Luxury Checkout
              </h1>
              <div className="w-24 h-px bg-yellow-500 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                Complete your exquisite jewelry purchase with confidence
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress Steps */}
        <div className="bg-white py-12 border-b border-yellow-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-700 ease-out"
                    style={{ 
                      width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%` 
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center relative">
                  {steps.map((step, stepIdx) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                    const IconComponent = step.icon;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center bg-white px-4">
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg relative z-10
                          ${isCompleted ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-2 border-yellow-600 scale-110' : 
                            isActive ? 'bg-white border-3 border-yellow-600 shadow-yellow-200' : 
                            'bg-gray-50 border-2 border-gray-300'}
                        `}>
                          {isCompleted ? (
                            <Check className="h-7 w-7 text-white" />
                          ) : (
                            <IconComponent className={`h-7 w-7 ${isActive ? 'text-yellow-600' : 'text-gray-400'}`} />
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <span className={`
                            block text-sm font-medium tracking-wide
                            ${isActive ? 'text-yellow-600' : isCompleted ? 'text-yellow-600' : 'text-gray-400'}
                          `}>
                            {step.name}
                          </span>
                          <span className={`
                            block text-xs mt-1 font-light
                            ${isActive ? 'text-yellow-500' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                          `}>
                            {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
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
        
        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-50 to-yellow-50/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Main Form */}
              <div className="lg:col-span-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-200/50 overflow-hidden">
                  <div className="p-8 lg:p-10">
                  
                  {/* Shipping Step */}
                  {currentStep === 'shipping' && (
                    <div>
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                            <MapPin className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-light text-gray-800 tracking-wide">Delivery Information</h2>
                            <p className="text-gray-600 font-light text-sm mt-1">
                              Where shall we deliver your exquisite pieces?
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="flex items-center text-sm text-yellow-700">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Step 1 of 3 - This should take about 2 minutes</span>
                          </div>
                        </div>
                      </div>
                      
                      <form onSubmit={handleShippingSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={shippingFirstName}
                              onChange={(e) => setShippingFirstName(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingFirstName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
                              placeholder="Enter your first name"
                            />
                            {shippingErrors.shippingFirstName && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={shippingLastName}
                              onChange={(e) => setShippingLastName(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingLastName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
                              placeholder="Enter your last name"
                            />
                            {shippingErrors.shippingLastName && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={shippingEmail}
                              onChange={(e) => setShippingEmail(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingEmail ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
                              placeholder="your.email@example.com"
                            />
                            {shippingErrors.shippingEmail && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingPhone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
                              placeholder="(555) 123-4567"
                            />
                            {shippingErrors.shippingPhone && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              value={shippingStreet}
                              onChange={(e) => setShippingStreet(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingStreet ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
                              placeholder="123 Main Street, Apt 4B"
                            />
                            {shippingErrors.shippingStreet && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              Country *
                            </label>
                            <select
                              value={shippingCountry}
                              onChange={(e) => handleCountryChange(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300"
                            >
                              <option value="">Select Country</option>
                              {countries?.map((country: any) => (
                                <option key={country.id} value={country.id}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              State / Province *
                            </label>
                            <select
                              value={shippingState}
                              onChange={(e) => handleStateChange(e.target.value)}
                              disabled={!shippingCountry || loadingStates}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingState ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
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
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              City *
                            </label>
                            <select
                              value={shippingCity}
                              onChange={(e) => {
                                const selectedCity = cities.find((c: any) => c.id.toString() === e.target.value);
                                setSelectedCityName(selectedCity?.name || '');
                                setShippingCity(e.target.value);
                              }}
                              disabled={!shippingState || loadingCities}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingCity ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
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
                          
                          <div>
                            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                              ZIP / Postal Code *
                            </label>
                            <input
                              type="text"
                              value={shippingZip}
                              onChange={(e) => setShippingZip(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border-2 ${
                                shippingErrors.shippingZip ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                              } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
                              placeholder="10001"
                            />
                            {shippingErrors.shippingZip && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Shipping Methods */}
                        <div className="pt-8 border-t border-gray-200">
                          <div className="flex items-center mb-6">
                            <Truck className="w-5 h-5 text-yellow-600 mr-3" />
                            <h3 className="text-xl font-light text-gray-800 tracking-wide">Delivery Options</h3>
                          </div>
                          
                          <div className="space-y-4">
                            {shippingMethods.length > 0 ? (
                              shippingMethods.map((method) => {
                                const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                  ? 0 
                                  : method.cost + (method.handling_fee || 0);
                                
                                return (
                                  <div key={method.id} className={`relative border-2 rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                                    selectedShippingId === method.id 
                                      ? 'border-yellow-500 bg-yellow-50 shadow-md' 
                                      : 'border-gray-200 bg-white hover:border-yellow-300 hover:shadow-sm'
                                  }`}>
                                    <div className="flex items-start">
                                      <input
                                        id={`shipping-${method.id}`}
                                        name="shipping-method"
                                        type="radio"
                                        checked={selectedShippingId === method.id}
                                        onChange={() => setSelectedShippingId(method.id)}
                                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 mt-1"
                                      />
                                      <label htmlFor={`shipping-${method.id}`} className="ml-4 flex-1 cursor-pointer">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className="flex items-center">
                                              <span className="text-base font-medium text-gray-800">{method.name}</span>
                                              {shippingCost === 0 && (
                                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                  FREE
                                                </span>
                                              )}
                                            </div>
                                            <span className="block text-sm text-gray-600 mt-1">
                                              {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                            </span>
                                            {method.min_order_amount > 0 && (
                                              <span className="block text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded">
                                                {method.type === 'free_shipping' 
                                                  ? `Free shipping on orders over $${method.min_order_amount}` 
                                                  : `Minimum order: $${method.min_order_amount}`}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-right ml-4">
                                            <span className="text-lg font-semibold text-gray-800">
                                              {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost, storeSettings, currencies)}
                                            </span>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-12 text-gray-500">
                                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="font-light">No delivery options available</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Order Notes */}
                        <div className="pt-8 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Special Instructions (Optional)
                          </label>
                          <textarea
                            rows={3}
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="Gift message, special delivery instructions, or any other notes..."
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300 resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-2">This information will be shared with our delivery team</p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-8">
                          <Link 
                            href={route('store.cart', { storeSlug })}
                            className="text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Cart
                          </Link>
                          <button
                            type="submit"
                            disabled={!selectedShippingId}
                            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                              selectedShippingId 
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg hover:shadow-xl' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Review Order
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {/* Review Step */}
                  {currentStep === 'review' && (
                    <div>
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                            <Check className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-light text-gray-800 tracking-wide">Review Your Order</h2>
                            <p className="text-gray-600 font-light text-sm mt-1">
                              Please review your luxury selection before finalizing
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center text-sm text-green-700">
                            <Check className="w-4 h-4 mr-2" />
                            <span>Delivery information completed - Almost there!</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wide">Your Selection</h3>
                          
                          <div className="space-y-4">
                            {cartItems.map((item) => {
                              const itemPrice = item.sale_price || item.price;
                              const itemTotal = itemPrice * item.quantity;
                              
                              return (
                                <div key={item.id} className="flex items-center space-x-6 p-6 bg-white/70 rounded-xl border border-yellow-200">
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-yellow-300">
                                    <img 
                                      className="h-full w-full object-cover" 
                                      src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`}
                                      alt={item.name}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`;
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-lg font-light text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</div>
                                  </div>
                                  <div className="text-lg font-light text-gray-800">
                                    {formatCurrency(itemTotal, storeSettings, currencies)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Shipping Information */}
                        <div className="pt-8 border-t border-yellow-200">
                          <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wide">Delivery Details</h3>
                          
                          <div className="bg-yellow-50/50 rounded-xl p-6 border border-yellow-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-sm font-light text-gray-600 mb-2 tracking-wide uppercase">Contact</p>
                                <p className="text-gray-800 font-light">{shippingFirstName} {shippingLastName}</p>
                                <p className="text-gray-800 font-light">{shippingEmail}</p>
                                <p className="text-gray-800 font-light">{shippingPhone}</p>
                              </div>
                              <div>
                                <p className="text-sm font-light text-gray-600 mb-2 tracking-wide uppercase">Address</p>
                                <p className="text-gray-800 font-light">{shippingStreet}</p>
                                <p className="text-gray-800 font-light">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                                <p className="text-gray-800 font-light">{selectedCountryName}</p>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-yellow-300">
                              <p className="text-sm font-light text-gray-600 mb-2 tracking-wide uppercase">Delivery Method</p>
                              <p className="text-gray-800 font-light">
                                {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No delivery method selected'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {orderNotes && (
                          <div className="pt-8 border-t border-yellow-200">
                            <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wide">Special Instructions</h3>
                            <div className="bg-yellow-50/50 rounded-xl p-6 border border-yellow-200">
                              <p className="text-gray-800 font-light">{orderNotes}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-8">
                          <button
                            type="button"
                            onClick={() => setCurrentStep('shipping')}
                            className="border-2 border-yellow-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-yellow-500 transition-colors"
                          >
                            Back to Delivery
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentStep('payment')}
                            className="bg-yellow-600 text-white px-10 py-4 rounded-xl font-medium hover:bg-yellow-700 transition-colors shadow-lg"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Payment Step */}
                  {currentStep === 'payment' && (
                    <div>
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                            <CreditCard className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-light text-gray-800 tracking-wide">Secure Payment</h2>
                            <p className="text-gray-600 font-light text-sm mt-1">
                              Complete your purchase with confidence
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center text-sm text-blue-700">
                            <Shield className="w-4 h-4 mr-2" />
                            <span>Your payment information is protected with 256-bit SSL encryption</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Billing Address */}
                        <div>
                          <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wide">Billing Address</h3>
                          
                          <div className="flex items-center mb-6">
                            <input
                              id="same-as-shipping"
                              type="checkbox"
                              checked={sameAsShipping}
                              onChange={(e) => setSameAsShipping(e.target.checked)}
                              className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                            />
                            <label htmlFor="same-as-shipping" className="ml-3 text-gray-800 font-light">
                              Same as delivery address
                            </label>
                          </div>
                          
                          {!sameAsShipping && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Billing form fields similar to shipping */}
                            </div>
                          )}
                        </div>
                        
                        {/* Payment Methods */}
                        <div className="pt-8 border-t border-yellow-200">
                          <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wide">Payment Method</h3>
                          
                          <div className="space-y-4">
                            {/* Cash on Delivery */}
                            <div className={`bg-white/70 border-2 rounded-xl p-6 hover:border-yellow-400 transition-colors cursor-pointer ${
                              paymentMethod === 'cod' ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-200'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-cod"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'cod'}
                                  onChange={() => setPaymentMethod('cod')}
                                  className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300"
                                />
                                <label htmlFor="payment-cod" className="ml-4 flex-1 cursor-pointer">
                                  <span className="block text-lg font-light text-gray-800">Cash on Delivery</span>
                                  <span className="block text-sm text-gray-600 mt-1">Pay when your jewelry is delivered</span>
                                </label>
                              </div>
                            </div>

                            {/* WhatsApp Payment Option */}
                            {enabledPaymentMethods.whatsapp && (
                              <div className={`bg-white/70 border-2 rounded-xl p-6 hover:border-yellow-400 transition-colors cursor-pointer ${
                                paymentMethod === 'whatsapp' ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-200'
                              }`}>
                                <div className="flex items-center">
                                  <input
                                    id="payment-whatsapp"
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === 'whatsapp'}
                                    onChange={() => setPaymentMethod('whatsapp')}
                                    className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300"
                                  />
                                  <label htmlFor="payment-whatsapp" className="ml-4 flex-1 cursor-pointer">
                                    <span className="block text-lg font-light text-gray-800">WhatsApp</span>
                                    <span className="block text-sm text-gray-600 mt-1">Complete payment via WhatsApp</span>
                                  </label>
                                </div>
                              </div>
                            )}
                            
                            {/* Telegram Payment Option - Only show if enabled */}
                            {enabledPaymentMethods.telegram && (
                              <div className={`bg-white/70 border-2 rounded-xl p-6 hover:border-yellow-400 transition-colors cursor-pointer ${
                                paymentMethod === 'telegram' ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-200'
                              }`}>
                                <div className="flex items-center">
                                  <input
                                    id="payment-telegram"
                                    name="payment-method"
                                    type="radio"
                                    checked={paymentMethod === 'telegram'}
                                    onChange={() => setPaymentMethod('telegram')}
                                    className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300"
                                  />
                                  <label htmlFor="payment-telegram" className="ml-4 flex-1 cursor-pointer">
                                    <span className="block text-lg font-light text-gray-800">Telegram</span>
                                    <span className="block text-sm text-gray-600 mt-1">Complete payment via Telegram</span>
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
                                <div key={method} className={`bg-white/70 border-2 rounded-xl p-6 hover:border-yellow-400 transition-colors cursor-pointer ${
                                  paymentMethod === method ? 'border-yellow-500 bg-yellow-50' : 'border-yellow-200'
                                }`}>
                                  <div className="flex items-center">
                                    <input
                                      id={`payment-${method}`}
                                      name="payment-method"
                                      type="radio"
                                      checked={paymentMethod === method}
                                      onChange={() => setPaymentMethod(method)}
                                      className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300"
                                    />
                                    <label htmlFor={`payment-${method}`} className="ml-4 flex-1 cursor-pointer">
                                      <span className="block text-lg font-light text-gray-800">
                                        {methodNames[method] || method.charAt(0).toUpperCase() + method.slice(1)}
                                      </span>
                                      <span className="block text-sm text-gray-600 mt-1">
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
                          <div className="pt-8 border-t border-yellow-200">
                            <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wide">WhatsApp Details</h3>
                            
                            <div>
                              <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
                                WhatsApp Number *
                              </label>
                              <input
                                type="tel"
                                value={whatsappNumber}
                                onChange={handleWhatsAppNumberChange}
                                placeholder="+1234567890"
                                className={`w-full px-4 py-3 rounded-lg border-2 ${
                                  paymentErrors.whatsappNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-500'
                                } focus:outline-none transition-all duration-200 bg-white hover:border-yellow-300`}
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
                        
                        <div className="flex justify-between pt-8">
                          <button
                            type="button"
                            onClick={() => setCurrentStep('review')}
                            className="border-2 border-yellow-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-yellow-500 transition-colors"
                          >
                            Back to Review
                          </button>
                          <button
                            type="button"
                            onClick={handlePlaceOrder}
                            className="bg-yellow-600 text-white px-10 py-4 rounded-xl font-medium hover:bg-yellow-700 transition-colors shadow-lg flex items-center"
                          >
                            <Shield className="w-5 h-5 mr-2" />
                            Complete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white rounded-2xl shadow-2xl overflow-hidden sticky top-6">
                  <div className="p-6 lg:p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                      <Star className="w-6 h-6 text-yellow-200" />
                    </div>
                    <h2 className="text-xl font-medium tracking-wide">Order Summary</h2>
                    <p className="text-yellow-200 text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-yellow-300">
                            <img
                              src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{item.name}</div>
                            <div className="text-xs text-yellow-200">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-sm font-semibold text-white">
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
                  <div className="mb-6 border-t border-yellow-500 pt-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-yellow-100">Promo Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="flex-grow px-3 py-2 bg-white/20 text-white placeholder-yellow-200 border border-yellow-400 rounded-l-lg focus:outline-none focus:border-yellow-300 text-sm"
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
                            }
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                            couponApplied 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-white text-yellow-600 hover:bg-yellow-50'
                          }`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <div className="flex items-center text-sm text-green-200">
                          <Check className="w-4 h-4 mr-1" />
                          <span>Promo code applied successfully!</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="space-y-3 border-t border-yellow-500 pt-6">
                    <div className="flex justify-between text-sm text-yellow-100">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</span>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-200">
                        <span>Discount</span>
                        <span className="font-medium">-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-yellow-100">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {selectedShippingId ? (updatedCartSummary.shipping === 0 ? 'FREE' : formatCurrency(updatedCartSummary.shipping, storeSettings, currencies)) : 'Select method'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-yellow-100">
                      <span>Tax</span>
                      <span className="font-medium">{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-semibold text-white pt-3 border-t border-yellow-400">
                      <span>Total</span>
                      <span>{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</span>
                    </div>
                  </div>
                  
                  {/* Security Badges */}
                  <div className="mt-6 pt-6 border-t border-yellow-500">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <Lock className="h-5 w-5 text-yellow-200 mb-1" />
                        <p className="text-xs text-yellow-200">SSL Secured</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Shield className="h-5 w-5 text-yellow-200 mb-1" />
                        <p className="text-xs text-yellow-200">Safe Payment</p>
                      </div>
                    </div>
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

export default JewelryCheckout;