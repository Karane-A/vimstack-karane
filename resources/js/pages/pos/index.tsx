import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Printer, Receipt, Package, Tag, User, Settings, ChevronLeft, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import VariantSelector from './components/VariantSelector';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { Popup } from 'antd-mobile';

export default function POS() {
  const { t } = useTranslation();
  const { products, customers, categories, settings } = usePage().props as any;
  const [cart, setCart] = useState<any[]>([]);

  const { hasPermission } = usePermissions();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pos_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart data:', e);
        localStorage.removeItem('pos_cart');
      }
    }

    // Load selected customer
    const savedCustomer = localStorage.getItem('pos_customer');
    if (savedCustomer) {
      try {
        const customer = JSON.parse(savedCustomer);
        setSelectedCustomer(customer.id);
      } catch (e) {
        console.error('Error parsing customer data:', e);
        localStorage.removeItem('pos_customer');
      }
    }
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('walk-in');
  const [showInventory, setShowInventory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [savedCarts, setSavedCarts] = useState<any[]>([]);
  const [showSavedCarts, setShowSavedCarts] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load saved carts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pos_saved_carts');
    if (saved) {
      setSavedCarts(JSON.parse(saved));
    }
  }, []);

  const handleCustomerChange = (customerId: any) => {
    setSelectedCustomer(customerId);
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      localStorage.setItem('pos_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('pos_customer');
    }
  };

  const addToCart = (product: any, variant?: any) => {
    // Check if product is in stock
    if (product.stock <= 0) {
      alert(t('This product is out of stock'));
      return;
    }

    if (product.hasVariants && !variant) {
      setSelectedProduct(product);
      setShowVariantDialog(true);
      return;
    }

    const itemId = variant ? variant.id : product.id;
    const itemPrice = variant ? variant.price : product.price;
    const itemName = variant ? `${product.name} (${variant.name})` : product.name;

    const existingItem = cart.find(item => item.id === itemId);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      const newItem = {
        id: itemId,
        productId: product.id,
        name: itemName,
        price: itemPrice,
        image: product.image,
        variant: variant || null,
        quantity: 1
      };
      updatedCart = [...cart, newItem];
      setCart(updatedCart);
    }

    // Save to localStorage
    localStorage.setItem('pos_cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    // Find the item in cart
    const item = cart.find(item => item.id === id);
    if (!item) return;

    // Find the product to check stock
    const product = products.find(p => p.id === item.productId);
    if (product && quantity > product.stock) {
      alert(t('Only {{count}} items available in stock', { count: product.stock }));
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('pos_cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('pos_cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('pos_cart');
  };

  const saveCart = () => {
    if (cart.length === 0) return;

    const savedCart = {
      id: Date.now(),
      items: cart,
      customer: selectedCustomerData,
      timestamp: new Date().toLocaleString(),
      total: calculateTotal()
    };

    const updatedSavedCarts = [...savedCarts, savedCart];
    setSavedCarts(updatedSavedCarts);
    localStorage.setItem('pos_saved_carts', JSON.stringify(updatedSavedCarts));

    clearCart();
    alert(t('Cart saved successfully'));
  };

  const loadSavedCart = (savedCart: any) => {
    setCart(savedCart.items);
    setSelectedCustomer(savedCart.customer?.id || 'walk-in');
    localStorage.setItem('pos_cart', JSON.stringify(savedCart.items));
    if (savedCart.customer) {
      localStorage.setItem('pos_customer', JSON.stringify(savedCart.customer));
    }

    // Remove from saved carts
    const updatedSavedCarts = savedCarts.filter(c => c.id !== savedCart.id);
    setSavedCarts(updatedSavedCarts);
    localStorage.setItem('pos_saved_carts', JSON.stringify(updatedSavedCarts));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    const taxRate = settings?.tax_rate ? settings.tax_rate / 100 : 0.1; // Default to 10% if not set
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  const filteredProducts = products
    .filter(product => {
      // Filter by category
      const categoryMatch = activeCategory === 'all' || product.category === activeCategory;

      // Filter by search query
      const searchMatch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });

  console.log(formatCurrency(calculateSubtotal()));


  return (
    <PageTemplate
      title={t('Point of Sale (POS)')}
      description={t('Manage your store sales and transactions')}
      url="/pos"
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Point of Sale (POS)') }
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6 pb-24 lg:pb-0">
        {/* Left Side - Products */}
        <div className="lg:w-2/3 space-y-6">
          {/* Header Section - Sticky on Mobile */}
          <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md -mx-4 px-4 py-4 lg:relative lg:bg-transparent lg:p-0 lg:m-0 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t('Search products...')}
                  className="pl-11 h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-primary focus:border-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCustomer} onValueChange={handleCustomerChange}>
                  <SelectTrigger className="w-full sm:w-[220px] h-12 rounded-2xl border-slate-200 bg-white shadow-sm">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder={t('Select customer')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id} className="rounded-xl">
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Mobile Filter Trigger */}
                <Button
                  variant="outline"
                  className="lg:hidden h-12 px-4 rounded-2xl bg-white border-slate-200 shadow-sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:hidden">
              <Dialog open={showInventory} onOpenChange={setShowInventory}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-xl flex-1 bg-white border-slate-200 shadow-sm text-slate-600">
                    <Package className="h-4 w-4 mr-2" />
                    {t('Inventory')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col rounded-[32px]">
                  <DialogHeader>
                    <DialogTitle>{t('Inventory Management')}</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto mt-4 px-1">
                    <div className="space-y-3">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                          <div className="flex-1">
                            <p className="font-bold text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-500">{t('Stock')}: {product.stock}</p>
                          </div>
                          <Badge variant="outline" className={cn("rounded-full px-3 py-1", product.stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>
                            {product.stock > 0 ? t('In Stock') : t('Out of Stock')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {savedCarts.length > 0 && (
                <Button variant="outline" className="h-10 rounded-xl flex-1 bg-white border-slate-200 shadow-sm text-slate-600" onClick={() => setShowSavedCarts(true)}>
                  <Receipt className="h-4 w-4 mr-2" />
                  {t('Saved')} ({savedCarts.length})
                </Button>
              )}

              <Permission permission="manage-settings-pos">
                <Button variant="outline" className="h-10 rounded-xl flex-1 bg-white border-slate-200 shadow-sm text-slate-600" onClick={() => router.visit(route('pos.settings'))}>
                  <Settings className="h-4 w-4" />
                </Button>
              </Permission>
            </div>
          </div>

          {/* Desktop utility buttons - hidden on mobile */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <Dialog open={showInventory} onOpenChange={setShowInventory}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-10 rounded-xl shadow-sm border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Package className="h-4 w-4 mr-2" />
                  {t('Inventory')}
                </Button>
              </DialogTrigger>
              {/* ... same DialogContent as above ... */}
            </Dialog>
            {/* ... other desktop buttons ... */}
          </div>

          {/* Category Filter - Desktop: Pills, Mobile: Popup Triggered */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? "default" : "outline"}
              className={cn(
                "rounded-full px-5 py-2 h-auto text-sm font-bold transition-all",
                activeCategory === 'all' ? "bg-primary text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
              )}
              onClick={() => setActiveCategory('all')}
            >
              {t('All Items')}
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={cn(
                  "rounded-full px-5 py-2 h-auto text-sm font-bold transition-all",
                  activeCategory === category.id ? "bg-primary text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="lg:hidden flex items-center justify-between bg-white/50 p-2 rounded-2xl border border-slate-100">
            <span className="text-sm font-bold text-slate-600 ml-2">
              {t('Category')}: <span className="text-primary">{activeCategory === 'all' ? t('All Items') : categories.find(c => c.id === activeCategory)?.name}</span>
            </span>
            <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => setIsFilterOpen(true)}>
              {t('Change')}
            </Button>
          </div>

          {/* Product Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className={cn(
                  "group overflow-hidden rounded-[24px] border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95",
                  product.stock > 0 ? "cursor-pointer" : "opacity-60 saturate-50"
                )}
                onClick={() => product.stock > 0 && addToCart(product)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product';
                    }}
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-amber-500 hover:bg-amber-600 border-none px-2 py-0.5 text-[10px]">
                        {t('Low Stock')}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 bg-white">
                  <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1 mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-primary">{formatCurrency(product.price)}</p>
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                      <Plus className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">
                    {t('Stock')}: <span className={product.stock <= 5 ? "text-rose-500" : "text-slate-600"}>{product.stock}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop Cart Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-1/3">
          <Card className="sticky top-6 rounded-[32px] border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-slate-900">
                  <ShoppingCart className="mr-3 h-5 w-5 text-primary" />
                  {t('Current Order')}
                </CardTitle>
                <Badge className="bg-primary px-2.5 py-1 rounded-full">{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
              </div>
              {selectedCustomerData && selectedCustomerData.id !== 'walk-in' && (
                <div className="flex items-center mt-4 p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{selectedCustomerData.name}</p>
                    {selectedCustomerData.phone && (
                      <p className="text-[10px] text-slate-500 font-medium">{selectedCustomerData.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="min-h-[300px] max-h-[calc(100vh-500px)] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <ShoppingCart className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="font-bold text-slate-400">{t('Cart is empty')}</p>
                      <p className="text-xs text-slate-300 mt-1">{t('Start adding products to the sale')}</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 group">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Product';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-primary font-bold text-sm tracking-tight">{formatCurrency(item.price)}</p>
                            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                              <button
                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                              <button
                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{t('Subtotal')}</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{t('Tax ({{rate}}%)', { rate: settings?.tax_rate || 10 })}</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(calculateTax())}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <span className="text-slate-900 font-black text-lg">{t('Total')}</span>
                      <span className="text-primary font-black text-2xl">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-4">
                    <Permission permission="process-transactions-pos">
                      <Button
                        size="lg"
                        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 text-lg font-black"
                        disabled={cart.length === 0}
                        onClick={() => router.visit(route('pos.checkout'))}
                      >
                        <CreditCard className="mr-3 h-5 w-5" />
                        {t('Checkout')}
                      </Button>
                    </Permission>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 rounded-2xl border-slate-200 text-slate-600 font-bold"
                        disabled={cart.length === 0}
                        onClick={saveCart}
                      >
                        {t('Save Cart')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-12 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold"
                        disabled={cart.length === 0}
                        onClick={clearCart}
                      >
                        {t('Clear')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Mobile Cart Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <button
          className={cn(
            "w-full h-16 bg-slate-900 text-white rounded-[28px] shadow-2xl shadow-primary/20 flex items-center justify-between px-6 transition-all active:scale-95 touch-manipulation",
            cart.length === 0 ? "opacity-0 translate-y-20 pointer-events-none" : "opacity-100 translate-y-0"
          )}
          onClick={() => setIsCartOpen(true)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('Current Order')}</p>
              <p className="text-sm font-black">{formatCurrency(calculateTotal())}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-black text-sm">
            {t('View Cart')}
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </div>
        </button>
      </div>

      {/* Mobile Cart Drawer */}
      <Popup
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        position='bottom'
        bodyStyle={{
          height: '85vh',
          borderRadius: '32px 32px 0 0',
          overflow: 'hidden'
        }}
      >
        <div className="flex flex-col h-full bg-white">
          <div className="p-6 pb-2">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">{t('Your Cart')}</h2>
              <Button variant="ghost" size="sm" className="text-rose-500 font-bold" onClick={clearCart}>
                {t('Clear All')}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-50 bg-slate-50/30">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                  <img src={getImageUrl(item.image)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-base truncate">{item.name}</p>
                  <p className="text-primary font-black text-base mt-0.5">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center bg-white rounded-2xl p-1 border border-slate-100 shadow-sm">
                  <button className="w-10 h-10 flex items-center justify-center text-slate-400" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                  <button className="w-10 h-10 flex items-center justify-center text-primary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">{t('Subtotal')}</span>
                <span className="text-slate-900 font-bold">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">{t('Tax')}</span>
                <span className="text-slate-900 font-bold">{formatCurrency(calculateTax())}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-slate-900 font-black text-xl leading-none">{t('Total')}</span>
                <span className="text-primary font-black text-3xl leading-none">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <Button
              className="w-full h-16 rounded-[24px] bg-slate-900 text-white font-black text-lg shadow-xl"
              onClick={() => router.visit(route('pos.checkout'))}
            >
              <CreditCard className="mr-3 h-6 w-6" />
              {t('Proceed to Payment')}
            </Button>
          </div>
        </div>
      </Popup>

      <VariantSelector
        product={selectedProduct}
        open={showVariantDialog}
        onClose={() => setShowVariantDialog(false)}
        onSelectVariant={(product, variant) => {
          addToCart(product, variant);
          setShowVariantDialog(false);
        }}
      />

      {/* Mobile Category Selection Popup */}
      <Popup
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        position='bottom'
        bodyStyle={{
          height: '60vh',
          borderRadius: '32px 32px 0 0',
        }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
          <h2 className="text-xl font-black text-slate-900 mb-4">{t('Select Category')}</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            <button
              className={cn(
                "w-full p-4 rounded-2xl text-left font-bold transition-all",
                activeCategory === 'all' ? "bg-primary text-white" : "bg-slate-50 text-slate-600"
              )}
              onClick={() => {
                setActiveCategory('all');
                setIsFilterOpen(false);
              }}
            >
              {t('All Items')}
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={cn(
                  "w-full p-4 rounded-2xl text-left font-bold transition-all",
                  activeCategory === category.id ? "bg-primary text-white" : "bg-slate-50 text-slate-600"
                )}
                onClick={() => {
                  setActiveCategory(category.id);
                  setIsFilterOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </Popup>
    </PageTemplate>
  );
}