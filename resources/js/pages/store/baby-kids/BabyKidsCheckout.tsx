import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, User, Mail, Phone, MapPin, Check, Lock, ShoppingCart, Package, CreditCard, Heart, Star } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';
import { handleOrderPlacement as handleCashfreeOrderPlacement } from '@/utils/cashfree-payment';
import { handleOrderPlacement as handleRazorpayOrderPlacement } from '@/utils/razorpay-payment';

interface BabyKidsCheckoutProps {
  cartItems: any[];
  cartSummary: any;
  shippingMethods: any[];
  enabledPaymentMethods?: any;
  user?: any;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  countries?: any[];
  customPages?: any[];
}

export default function BabyKidsCheckout({
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
}: BabyKidsCheckoutProps) {
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
    { id: 'shipping', name: 'Shipping', icon: Package },
    { id: 'review', name: 'Review', icon: ShoppingCart },
    { id: 'payment', name: 'Payment', icon: CreditCard },
  ];
  
  const [currentStep, setCurrentStep] = useState('shipping');
  
  // Form states
  const [shippingFirstName, setShippingFirstName] = useState(userData.name.split(' ')[0] || '');
  const [shippingLastName, setShippingLastName] = useState(userData.name.split(' ')[1] || '');
  const [shippingEmail, setShippingEmail] = useState(userData.email);
  const [shippingPhone, setShippingPhone] = useState(userData.phone);
  const [shippingStreet, setShippingStreet] = useState(userData.address.street);
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState(userData.address.zip);
  const [shippingCountry, setShippingCountry] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  
  // Debug logging
  React.useEffect(() => {
    console.log('Countries:', countries);
    console.log('Countries length:', countries?.length);
  }, [countries]);
  
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
  
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentErrors] = useState<Record<string, string>>({});
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
        theme="baby-kids"
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Checkout</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600">
                Complete your order for your little ones
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex justify-center space-x-8 mb-16">
              {steps.map((step, stepIdx) => {
                const isActive = currentStep === step.id;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted ? 'bg-pink-500 text-white' : 
                        isActive ? 'bg-pink-100 border-4 border-pink-500' : 
                        'bg-gray-100 border-4 border-gray-300'
                      }`}>
                        {isCompleted ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <Icon className={`h-6 w-6 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <span className={`mt-3 text-sm font-bold ${
                        isActive ? 'text-pink-600' : isCompleted ? 'text-pink-500' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {stepIdx < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 rounded-full ${
                        isCompleted ? 'bg-pink-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {currentStep === 'shipping' && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                    <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 p-8">
                      <div className="flex items-center mb-6">
                        <Package className="h-6 w-6 text-pink-500 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Shipping Information</h2>
                      </div>
                      
                      <form onSubmit={handleShippingSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                            <input
                              type="text"
                              value={shippingFirstName}
                              onChange={(e) => setShippingFirstName(e.target.value)}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingFirstName ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
                              }`}
                            />
                            {shippingErrors.shippingFirstName && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingFirstName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                            <input
                              type="text"
                              value={shippingLastName}
                              onChange={(e) => setShippingLastName(e.target.value)}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingLastName ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
                              }`}
                            />
                            {shippingErrors.shippingLastName && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingLastName}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                            <input
                              type="email"
                              value={shippingEmail}
                              onChange={(e) => setShippingEmail(e.target.value)}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingEmail ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
                              }`}
                            />
                            {shippingErrors.shippingEmail && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingEmail}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                            <input
                              type="tel"
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value)}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingPhone ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
                              }`}
                            />
                            {shippingErrors.shippingPhone && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingPhone}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                          <input
                            type="text"
                            value={shippingStreet}
                            onChange={(e) => setShippingStreet(e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                              shippingErrors.shippingStreet ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
                            }`}
                          />
                          {shippingErrors.shippingStreet && (
                            <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingStreet}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                            <select
                              value={shippingCountry}
                              onChange={(e) => handleShippingCountryChange(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500"
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                            <select
                              value={shippingState}
                              onChange={(e) => handleShippingStateChange(e.target.value)}
                              disabled={!shippingCountry || loadingStates}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingState ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                            <select
                              value={shippingCity}
                              onChange={(e) => {
                                const selectedCity = cities.find((c: any) => c.id.toString() === e.target.value);
                                setSelectedCityName(selectedCity?.name || '');
                                setShippingCity(e.target.value);
                              }}
                              disabled={!shippingState || loadingCities}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingCity ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
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
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              value={shippingZip}
                              onChange={(e) => setShippingZip(e.target.value)}
                              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                                shippingErrors.shippingZip ? 'border-red-500' : 'border-pink-300 focus:border-pink-500'
                              }`}
                            />
                            {shippingErrors.shippingZip && (
                              <p className="mt-2 text-sm text-red-600">{shippingErrors.shippingZip}</p>
                            )}
                          </div>
                        </div>

                        {/* Shipping Methods */}
                        <div className="mt-8">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Method</h3>
                          
                          <div className="space-y-3">
                            {shippingMethods.length > 0 ? (
                              shippingMethods.map((method) => {
                                const shippingCost = method.type === 'free_shipping' && cartSummary.subtotal >= (method.min_order_amount || 0) 
                                  ? 0 
                                  : method.cost + (method.handling_fee || 0);
                                
                                return (
                                  <div key={method.id} className={`relative border-2 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                                    selectedShippingId === method.id ? 'border-pink-500 bg-pink-50' : 'border-pink-300 hover:border-pink-400'
                                  }`}>
                                    <div className="flex items-center">
                                      <input
                                        id={`shipping-${method.id}`}
                                        name="shipping-method"
                                        type="radio"
                                        checked={selectedShippingId === method.id}
                                        onChange={() => setSelectedShippingId(method.id)}
                                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-pink-300"
                                      />
                                      <label htmlFor={`shipping-${method.id}`} className="ml-4 flex-1 cursor-pointer">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <span className="block text-sm font-bold text-gray-800">{method.name}</span>
                                            <span className="block text-sm text-gray-600">
                                              {method.description || (method.delivery_time ? `Delivery in ${method.delivery_time}` : 'Standard delivery')}
                                            </span>
                                          </div>
                                          <span className="text-lg font-bold text-pink-500">
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
                          <label className="block text-sm font-bold text-gray-700 mb-2">Order Notes (Optional)</label>
                          <textarea
                            rows={4}
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="Special instructions for your order"
                            className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors"
                          >
                            Continue to Review
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {currentStep === 'review' && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 w-full h-full bg-blue-200 rounded-3xl opacity-30"></div>
                    <div className="relative bg-white rounded-3xl shadow-xl border-4 border-blue-400 p-8">
                      <div className="flex items-center mb-6">
                        <ShoppingCart className="h-6 w-6 text-blue-500 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                          
                          <div className="space-y-4">
                            {cartItems.map((item) => {
                              const itemPrice = item.sale_price || item.price;
                              const itemTotal = itemPrice * item.quantity;
                              
                              return (
                                <div key={item.id} className="flex items-center space-x-4 p-4 bg-pink-50 rounded-2xl border-2 border-pink-200">
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-pink-300">
                                    <img
                                      src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/80x80/fef7f7/ec4899?text=${encodeURIComponent(item.name)}`}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Category: {item.category.name}</p>
                                  </div>
                                  <div className="text-lg font-bold text-pink-500">
                                    {formatCurrency(itemTotal, storeSettings, currencies)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Shipping Information */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Information</h3>
                          
                          <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-sm font-bold text-pink-600 mb-2">Contact Details</p>
                                <p className="text-gray-800">{shippingFirstName} {shippingLastName}</p>
                                <p className="text-gray-800">{shippingEmail}</p>
                                <p className="text-gray-800">{shippingPhone}</p>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-pink-600 mb-2">Shipping Address</p>
                                <p className="text-gray-800">{shippingStreet}</p>
                                <p className="text-gray-800">{selectedCityName}, {selectedStateName} {shippingZip}</p>
                                <p className="text-gray-800">{selectedCountryName}</p>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t-2 border-pink-300">
                              <p className="text-sm font-bold text-pink-600 mb-2">Shipping Method</p>
                              <p className="text-gray-800">
                                {selectedShipping ? `${selectedShipping.name} (${selectedShipping.delivery_time || 'Standard delivery'})` : 'No shipping method selected'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Notes */}
                        {orderNotes && (
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Notes</h3>
                            
                            <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200">
                              <p className="text-gray-800">{orderNotes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between mt-8">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('shipping')}
                          className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-colors"
                        >
                          Back to Shipping
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('payment')}
                          className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div className="relative">
                    <div className="absolute top-4 left-4 w-full h-full bg-yellow-200 rounded-3xl opacity-30"></div>
                    <div className="relative bg-white rounded-3xl shadow-xl border-4 border-yellow-400 p-8">
                      <div className="flex items-center mb-6">
                        <CreditCard className="h-6 w-6 text-yellow-500 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Billing Address */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Billing Address</h3>
                          
                          <div className="flex items-center mb-6">
                            <input
                              id="same-as-shipping"
                              type="checkbox"
                              checked={sameAsShipping}
                              onChange={(e) => setSameAsShipping(e.target.checked)}
                              className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-pink-300 rounded"
                            />
                            <label htmlFor="same-as-shipping" className="ml-3 block text-sm text-gray-800 font-medium">
                              Same as shipping address
                            </label>
                          </div>
                          
                          {!sameAsShipping && (
                            <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200">
                              <p className="text-sm text-gray-600">Billing address form would go here</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Payment Methods */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
                          
                          <div className="space-y-3">
                            {/* Cash on Delivery */}
                            <div className={`relative border-2 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                              paymentMethod === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-pink-300 hover:border-pink-400'
                            }`}>
                              <div className="flex items-center">
                                <input
                                  id="payment-cod"
                                  name="payment-method"
                                  type="radio"
                                  checked={paymentMethod === 'cod'}
                                  onChange={() => setPaymentMethod('cod')}
                                  className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-pink-300"
                                />
                                <label htmlFor="payment-cod" className="ml-4 flex-1 cursor-pointer">
                                  <span className="block text-sm font-bold text-gray-800">Cash on Delivery</span>
                                  <span className="block text-sm text-gray-600">Pay when your order is delivered to your little ones</span>
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
                                <div key={method} className={`relative border-2 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                                  paymentMethod === method ? 'border-pink-500 bg-pink-50' : 'border-pink-300 hover:border-pink-400'
                                }`}>
                                  <div className="flex items-center">
                                    <input
                                      id={`payment-${method}`}
                                      name="payment-method"
                                      type="radio"
                                      checked={paymentMethod === method}
                                      onChange={() => setPaymentMethod(method)}
                                      className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-pink-300"
                                    />
                                    <label htmlFor={`payment-${method}`} className="ml-4 flex-1 cursor-pointer">
                                      <span className="block text-sm font-bold text-gray-800">
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
                      </div>

                      <div className="flex justify-between mt-8">
                        <button
                          type="button"
                          onClick={() => setCurrentStep('review')}
                          className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-colors"
                        >
                          Back to Review
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors flex items-center gap-3"
                        >
                          <Lock className="w-5 h-5" />
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="relative">
                <div className="relative bg-white rounded-3xl shadow-xl border-4 border-blue-400 p-8 sticky top-8">
                  <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-blue-200 rounded-3xl opacity-30 -z-10"></div>
                  <div className="flex items-center mb-6">
                    <Heart className="h-6 w-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-2xl">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border-2 border-blue-200">
                            <img
                              src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/80x80/fef7f7/ec4899?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-blue-500">
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
                  <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                    <div className="flex flex-col space-y-3">
                      <label htmlFor="coupon" className="text-sm font-bold text-gray-700">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          name="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-grow px-3 py-2 border-2 border-yellow-300 rounded-l-2xl focus:outline-none focus:border-yellow-500"
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
                          className={`px-4 py-2 rounded-r-2xl font-bold text-sm transition-colors ${
                            couponApplied 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-yellow-500 text-white hover:bg-yellow-600'
                          }`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-600 font-bold">Coupon applied successfully!</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 border-b border-blue-200 pb-2">
                      <p className="font-bold">Subtotal</p>
                      <p className="font-bold">{formatCurrency(updatedCartSummary.subtotal, storeSettings, currencies)}</p>
                    </div>
                    
                    {updatedCartSummary.discount > 0 && (
                      <div className="flex justify-between text-green-600 border-b border-blue-200 pb-2">
                        <p className="font-bold">Discount</p>
                        <p className="font-bold">-{formatCurrency(updatedCartSummary.discount, storeSettings, currencies)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600 border-b border-blue-200 pb-2">
                      <p className="font-bold">Shipping</p>
                      <p className="font-bold">{selectedShippingId ? (updatedCartSummary.shipping === 0 ? 'FREE' : formatCurrency(updatedCartSummary.shipping, storeSettings, currencies)) : 'Select method'}</p>
                    </div>
                    
                    <div className="flex justify-between text-gray-600 border-b border-blue-200 pb-2">
                      <p className="font-bold">Tax</p>
                      <p className="font-bold">{formatCurrency(updatedCartSummary.tax, storeSettings, currencies)}</p>
                    </div>
                    
                    <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t-2 border-blue-400">
                      <p>Total</p>
                      <p className="text-blue-500">{formatCurrency(updatedCartSummary.total, storeSettings, currencies)}</p>
                    </div>
                  </div>
                  
                  {/* Secure Checkout */}
                  <div className="flex items-center justify-center mb-4">
                    <Lock className="h-4 w-4 text-blue-500 mr-2" />
                    <p className="text-xs text-gray-600 font-bold">Secure & Safe Checkout</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </StoreLayout>
      </>
    );
  }