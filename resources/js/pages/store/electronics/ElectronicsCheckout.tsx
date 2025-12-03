import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, usePage } from '@inertiajs/react';
import { ChevronRight, CreditCard, Truck, MapPin, User, Mail, Phone, Check, Lock, Shield, Zap } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';
import { handleOrderPlacement as handleCashfreeOrderPlacement } from '@/utils/cashfree-payment';
import { handleOrderPlacement as handleRazorpayOrderPlacement } from '@/utils/razorpay-payment';

interface ElectronicsCheckoutProps {
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
  countries?: any[];
  customPages?: any[];
}

function ElectronicsCheckoutContent({
  cartItems = [],
  cartSummary,
  shippingMethods = [],
  enabledPaymentMethods = {},
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  countries = [],
  customPages = [],
}: ElectronicsCheckoutProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  const storeSlug = store.slug || 'demo';
  
  const steps = [
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'review', name: 'Review', icon: Check },
  ];
  
  const [currentStep, setCurrentStep] = useState('shipping');
  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Handle country change
  const handleCountryChange = async (countryId: string) => {
    const selectedCountry = countries?.find((c: any) => c.id.toString() === countryId);
    setSelectedCountryName(selectedCountry?.name || '');
    setShippingData({...shippingData, country: countryId, state: '', city: ''});
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
    setShippingData({...shippingData, state: stateId, city: ''});
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
        return;
      }
    }

    const orderData = {
      store_id: store.id,
      customer_first_name: shippingData.firstName,
      customer_last_name: shippingData.lastName,
      customer_email: shippingData.email,
      customer_phone: shippingData.phone,
      shipping_address: shippingData.street,
      shipping_city: shippingData.city,
      shipping_state: shippingData.state,
      shipping_postal_code: shippingData.zip,
      shipping_country: shippingData.country,
      billing_address: shippingData.street,
      billing_city: shippingData.city,
      billing_state: shippingData.state,
      billing_postal_code: shippingData.zip,
      billing_country: shippingData.country,
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
  const shippingCost = selectedShipping ? parseFloat(selectedShipping.cost) + parseFloat(selectedShipping.handling_fee || 0) : 0;
  const discount = couponApplied ? couponDiscount : cartSummary.discount;
  const total = cartSummary.subtotal + shippingCost + cartSummary.tax - discount;

  return (
    <>
      <Head title={`Checkout - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeId={store.id}
        storeContent={storeContent}
        theme="electronics"
      >
        <div className="bg-gray-50 min-h-screen">
          {/* Header */}
          <section className="bg-slate-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Secure Checkout</h1>
              <p className="text-xl text-blue-100">Complete your electronics purchase</p>
            </div>
          </section>

          {/* Progress Steps */}
          <section className="bg-white border-b border-gray-200 py-8">
            <div className="container mx-auto px-4">
              <div className="flex justify-center">
                <div className="flex items-center space-x-8">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          isCompleted ? 'bg-blue-600 border-blue-600' : 
                          isActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-gray-50'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isCompleted ? 'text-white' : 
                            isActive ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <span className={`ml-3 font-semibold ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </span>
                        {index < steps.length - 1 && (
                          <ChevronRight className="w-5 h-5 text-gray-400 ml-8" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                  {currentStep === 'shipping' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        setShippingErrors({});
                        
                        const newErrors: Record<string, string> = {};
                        
                        if (!shippingData.firstName) newErrors.firstName = 'First name is required';
                        if (!shippingData.lastName) newErrors.lastName = 'Last name is required';
                        if (!shippingData.email) {
                          newErrors.email = 'Email is required';
                        } else if (!/\S+@\S+\.\S+/.test(shippingData.email)) {
                          newErrors.email = 'Email is invalid';
                        }
                        if (!shippingData.phone) newErrors.phone = 'Phone number is required';
                        if (!shippingData.street) newErrors.street = 'Street address is required';
                        if (!shippingData.city) newErrors.city = 'City is required';
                        if (!shippingData.state) newErrors.state = 'State is required';
                        if (!shippingData.zip) newErrors.zip = 'ZIP code is required';
                        if (!selectedShippingId) newErrors.shipping = 'Please select a shipping method';
                        
                        if (Object.keys(newErrors).length > 0) {
                          setShippingErrors(newErrors);
                          return;
                        }
                        
                        setCurrentStep('payment');
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                            <input
                              type="text"
                              value={shippingData.firstName}
                              onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.firstName ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {shippingErrors.firstName && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                            <input
                              type="text"
                              value={shippingData.lastName}
                              onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.lastName ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {shippingErrors.lastName && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.lastName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input
                              type="email"
                              value={shippingData.email}
                              onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {shippingErrors.email && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.email}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                            <input
                              type="tel"
                              value={shippingData.phone}
                              onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {shippingErrors.phone && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.phone}</p>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                            <input
                              type="text"
                              value={shippingData.street}
                              onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.street ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {shippingErrors.street && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.street}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                            <select
                              value={shippingData.country}
                              onChange={(e) => handleCountryChange(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                            <select
                              value={shippingData.state}
                              onChange={(e) => handleStateChange(e.target.value)}
                              disabled={!shippingData.country || loadingStates}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.state ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                              {states.map((state: any) => (
                                <option key={state.id} value={state.id}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                            {shippingErrors.state && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.state}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                            <select
                              value={shippingData.city}
                              onChange={(e) => {
                                const selectedCity = cities.find((c: any) => c.id.toString() === e.target.value);
                                setSelectedCityName(selectedCity?.name || '');
                                setShippingData({...shippingData, city: e.target.value});
                              }}
                              disabled={!shippingData.state || loadingCities}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.city ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                              {cities.map((city: any) => (
                                <option key={city.id} value={city.id}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            {shippingErrors.city && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.city}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP / Postal Code *</label>
                            <input
                              type="text"
                              value={shippingData.zip}
                              onChange={(e) => setShippingData({...shippingData, zip: e.target.value})}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                shippingErrors.zip ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {shippingErrors.zip && (
                              <p className="mt-1 text-sm text-red-600">{shippingErrors.zip}</p>
                            )}
                          </div>

                        </div>

                        {/* Shipping Methods */}
                        <div className="mt-8">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Method</h3>
                          {shippingErrors.shipping && (
                            <p className="mb-4 text-sm text-red-600">{shippingErrors.shipping}</p>
                          )}
                          <div className="space-y-3">
                            {shippingMethods.map((method) => (
                              <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                                <input
                                  type="radio"
                                  name="shipping"
                                  checked={selectedShippingId === method.id}
                                  onChange={() => setSelectedShippingId(method.id)}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="ml-3 flex-1">
                                  <div className="font-semibold text-gray-900">{method.name}</div>
                                  <div className="text-sm text-gray-500">{method.description}</div>
                                </div>
                                <div className="font-bold text-blue-600">{formatCurrency(method.cost, storeSettings, currencies)}</div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Order Notes */}
                        <div className="mt-8">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Order Notes (Optional)</label>
                          <textarea
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Special instructions for delivery"
                          />
                        </div>

                        <div className="mt-8 flex justify-end">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {currentStep === 'payment' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                      
                      <div className="space-y-4">
                        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900">Cash on Delivery</div>
                            <div className="text-sm text-gray-500">Pay when your order is delivered</div>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'whatsapp'}
                            onChange={() => setPaymentMethod('whatsapp')}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900">WhatsApp</div>
                            <div className="text-sm text-gray-500">Complete payment via WhatsApp</div>
                          </div>
                        </label>

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
                        
                        {Object.entries(enabledPaymentMethods).filter(([method]) => !['whatsapp', 'telegram'].includes(method)).map(([method, config]: [string, any]) => (
                          <label key={method} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === method}
                              onChange={() => setPaymentMethod(method)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <div className="font-semibold text-gray-900 capitalize">{method}</div>
                              <div className="text-sm text-gray-500">Pay securely with {method}</div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* WhatsApp Number Input */}
                      {paymentMethod === 'whatsapp' && (
                        <div className="mt-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">WhatsApp Details</h3>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number *</label>
                            <input
                              type="tel"
                              value={whatsappNumber}
                              onChange={handleWhatsAppNumberChange}
                              placeholder="+1234567890"
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                paymentErrors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {paymentErrors.whatsappNumber && (
                              <p className="mt-1 text-sm text-red-600">{paymentErrors.whatsappNumber}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                              Enter your WhatsApp number with country code (e.g., +1234567890)
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="mt-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Order Notes (Optional)</label>
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Special instructions for delivery"
                        />
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={() => setCurrentStep('shipping')}
                          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Back to Shipping
                        </button>
                        <button
                          onClick={() => setCurrentStep('review')}
                          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Review Order
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'review' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                      
                      <div className="space-y-6">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                            <img
                              src={getImageUrl(item.cover_image) || 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=80&h=80&fit=crop&crop=center'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="font-bold text-blue-600">
                              {formatCurrency((item.sale_price || item.price) * item.quantity, storeSettings, currencies)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          onClick={() => setCurrentStep('payment')}
                          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Back to Payment
                        </button>
                        <button
                          onClick={handlePlaceOrder}
                          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Lock className="w-5 h-5" />
                          Place Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                    
                    {/* Coupon Code */}
                    <div className="mb-6 border-b border-gray-200 pb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code</label>
                      <div className="flex">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className={`px-6 py-3 ${couponApplied ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-r-lg font-semibold transition-colors`}
                        >
                          {couponApplied ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="text-sm text-green-600 mt-2">Coupon applied successfully!</p>
                      )}
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">{formatCurrency(cartSummary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="text-gray-600">Discount</span>
                          <span className="font-semibold">-{formatCurrency(discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold">{formatCurrency(shippingCost, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">{formatCurrency(cartSummary.tax, storeSettings, currencies)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-lg font-bold text-blue-600">{formatCurrency(total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>

                    {/* General Payment Errors */}
                    {paymentErrors.general && (
                      <div className="mb-6">
                        <div className="p-4 text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-xl">
                          {paymentErrors.general}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>Secure SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Fast & reliable delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span>Premium electronics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}

export default function ElectronicsCheckout(props: ElectronicsCheckoutProps) {
  return (
    <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
      <ElectronicsCheckoutContent {...props} />
    </CartProvider>
  );
}