import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  variants?: { [key: string]: string };
  image: string;
  total: number;
}

interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  summary: CartSummary;
  loading: boolean;
  addToCart: (product: any, variants?: any) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  syncCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode; storeId: number; isLoggedIn: boolean }> = ({ 
  children, 
  storeId, 
  isLoggedIn 
}) => {
  console.log('🛒 CartProvider initialized with:', { storeId, isLoggedIn });
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  const getLocalCart = (): CartItem[] => {
    try {
      const cart = localStorage.getItem(`cart_${storeId}`);
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  };

  const setLocalCart = (cartItems: CartItem[]) => {
    localStorage.setItem(`cart_${storeId}`, JSON.stringify(cartItems));
  };

  const refreshCart = async () => {
    console.log('Refreshing cart for store:', storeId);
    try {
      const response = await axios.get(route('api.cart.index'), { params: { store_id: storeId } });
      console.log('Cart refresh response:', response.data);
      const cartItems = response.data.items || [];
      const cartCount = response.data.count || cartItems.length || 0;
      
      setItems(cartItems);
      setCount(cartCount);
      setTotal(response.data.total || 0);
      setSummary({
        subtotal: response.data.subtotal || 0,
        discount: response.data.discount || 0,
        shipping: response.data.shipping || 0,
        tax: response.data.tax || 0,
        total: response.data.total || 0
      });
      
      
      // Force re-render by updating count in next tick
      setTimeout(() => {
        setCount(cartCount);
      }, 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setItems([]);
      setCount(0);
      setTotal(0);
    }
  };

  const addToCart = async (product: any, variants?: any) => {
    setLoading(true);
    try {
      // Always use API for now (handles both logged in and guest users)
      await axios.post(route('api.cart.add'), {
        store_id: storeId,
        product_id: product.id,
        quantity: 1,
        variants
      });
      await refreshCart();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    setLoading(true);
    try {
      console.log('🚀 API Call: PUT', route('api.cart.update', { id }), { quantity, store_id: storeId });
      const response = await axios.put(route('api.cart.update', { id }), { quantity, store_id: storeId });
      console.log('✅ API Success:', response.data);
      await refreshCart();
    } catch (error) {
      console.error('❌ API Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    console.log('🗑️ Removing item from cart:', id);
    setLoading(true);
    try {
      await axios.delete(route('api.cart.remove', { id }), { params: { store_id: storeId } });
      console.log('🗑️ Item removed, refreshing cart...');
      await refreshCart();
      console.log('🗑️ Cart refreshed after removal, new count:', count);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async () => {
    if (!isLoggedIn) return;
    
    const localItems = getLocalCart();
    if (localItems.length === 0) return;

    try {
      await axios.post(route('api.cart.sync'), {
        store_id: storeId,
        items: localItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variants: item.variants
        }))
      });
      localStorage.removeItem(`cart_${storeId}`);
      await refreshCart();
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  };

  useEffect(() => {
    refreshCart();
    if (isLoggedIn) {
      syncCart();
    }
  }, [storeId, isLoggedIn]);

  console.log('🛒 CartProvider providing context with', items.length, 'items, count:', count);
  
  return (
    <CartContext.Provider value={{
      items,
      count,
      total,
      summary,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      syncCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    console.error('❌ CartProvider not found - using default functions');
    return {
      items: [],
      count: 0,
      total: 0,
      summary: { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 },
      loading: false,
      addToCart: async () => { console.log('Default addToCart called'); },
      updateQuantity: async () => { console.log('Default updateQuantity called'); },
      removeItem: async () => { console.log('Default removeItem called'); },
      syncCart: async () => { console.log('Default syncCart called'); },
      refreshCart: async () => { console.log('Default refreshCart called'); }
    };
  }
  console.log('✅ CartProvider found - using real functions');
  return context;
}