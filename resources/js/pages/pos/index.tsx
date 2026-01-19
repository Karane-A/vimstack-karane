import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Printer, Receipt, Package, Tag, User, Settings } from 'lucide-react';
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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Products */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2 md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search products...')}
                  className="pl-9 h-11 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCustomer} onValueChange={handleCustomerChange}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl">
                  <SelectValue placeholder={t('Select customer')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id} className="rounded-lg">
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Dialog open={showInventory} onOpenChange={setShowInventory}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-xl flex-1 sm:flex-none">
                    <Package className="h-4 w-4 mr-2" />
                    {t('Inventory')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col rounded-2xl">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>{t('Inventory Management')}</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    <div className="max-h-[60vh] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-background border-b">
                          <tr>
                            <th className="text-left py-2 px-2">{t('Product')}</th>
                            <th className="text-center py-2 px-2">{t('In Stock')}</th>
                            <th className="text-right py-2 px-2">{t('Status')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-2">{product.name}</td>
                              <td className="text-center py-2 px-2">{product.stock}</td>
                              <td className="text-right py-2 px-2">
                                <Badge variant="outline" className={cn("rounded-lg", product.stock > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200")}>
                                  {product.stock > 0 ? t('In Stock') : t('Out of Stock')}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {savedCarts.length > 0 && (
                <Dialog open={showSavedCarts} onOpenChange={setShowSavedCarts}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-10 rounded-xl flex-1 sm:flex-none">
                      <Receipt className="h-4 w-4 mr-2" />
                      {t('Saved')} ({savedCarts.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle>{t('Saved Carts')}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {savedCarts.map((savedCart) => (
                          <div key={savedCart.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold truncate">{savedCart.customer?.name || t('Walk-in Customer')}</p>
                              <p className="text-xs text-muted-foreground">{savedCart.timestamp}</p>
                              <p className="text-sm font-bold text-indigo-600">{formatCurrency(savedCart.total)}</p>
                            </div>
                            <Button size="sm" className="rounded-lg bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                              loadSavedCart(savedCart);
                              setShowSavedCarts(false);
                            }}>
                              {t('Load')}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Permission permission="manage-settings-pos">
                <Button variant="outline" className="h-10 rounded-xl flex-1 sm:flex-none" onClick={() => router.visit(route('pos.settings'))}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t('Settings')}
                </Button>
              </Permission>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide -mx-1 px-1">
            <Button
              variant={activeCategory === 'all' ? "default" : "outline"}
              size="sm"
              className="rounded-xl px-4 py-2 h-auto text-xs font-bold whitespace-nowrap data-[state=active]:bg-indigo-600 shadow-sm"
              onClick={() => setActiveCategory('all')}
            >
              {t('All Items')}
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                className="rounded-xl px-4 py-2 h-auto text-xs font-bold whitespace-nowrap data-[state=active]:bg-indigo-600 shadow-sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className={`${product.stock > 0 ? 'cursor-pointer hover:border-primary' : 'opacity-60'} transition-colors`}
                onClick={() => product.stock > 0 && addToCart(product)}
              >
                <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product';
                    }}
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-bold">{formatCurrency(product.price)}</p>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground">
                      Stock: <span className={product.stock <= 5 ? "text-red-500 font-medium" : ""}>{product.stock}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="lg:w-1/3">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t('Current Sale')}
              </CardTitle>
              {selectedCustomerData && selectedCustomerData.id !== 'walk-in' && (
                <div className="flex items-center mt-2 text-sm">
                  <User className="h-3 w-3 mr-1" />
                  <span className="font-medium">{selectedCustomerData.name}</span>
                  {selectedCustomerData.phone && (
                    <span className="text-muted-foreground ml-2">{selectedCustomerData.phone}</span>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[calc(100vh-400px)] overflow-auto space-y-2">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                      <p>{t('Cart is empty')}</p>
                      <p className="text-sm">{t('Add products to begin')}</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between border rounded-lg p-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden border">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Product';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Subtotal')}</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Tax ({{rate}}%)', { rate: settings?.tax_rate || 10 })}</span>
                    <span>{formatCurrency(calculateTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>{t('Total')}</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Permission permission="process-transactions-pos">
                    <Button
                      className="w-full"
                      disabled={cart.length === 0}
                      onClick={() => router.visit(route('pos.checkout'))}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('Checkout ({{amount}})', { amount: formatCurrency(calculateTotal()) })}
                    </Button>
                  </Permission>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      disabled={cart.length === 0}
                      onClick={saveCart}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      {t('Save')}
                    </Button>
                    <Permission permission="view-transactions-pos">
                      <Button
                        variant="outline"
                        onClick={() => router.visit(route('pos.transactions'))}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        {t('Transactions')}
                      </Button>
                    </Permission>
                    <Button
                      variant="outline"
                      disabled={cart.length === 0}
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('Empty')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Variant Selector Dialog */}
      <VariantSelector
        product={selectedProduct}
        open={showVariantDialog}
        onClose={() => setShowVariantDialog(false)}
        onSelectVariant={(product, variant) => {
          addToCart(product, variant);
          setShowVariantDialog(false);
        }}
      />
    </PageTemplate>
  );
}