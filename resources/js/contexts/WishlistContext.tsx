import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image: string;
  stock: number;
  is_active: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { props } = usePage();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const storeId = props.store?.id;

  const fetchWishlist = async () => {
    if (!storeId) return;
    
    try {
      const response = await fetch(route('api.wishlist.index') + `?store_id=${storeId}`);
      const data = await response.json();
      setItems(data.items || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [storeId]);

  const isInWishlist = (productId: number): boolean => {
    return items.some(item => item.product_id === productId);
  };

  const addToWishlist = async (productId: number): Promise<void> => {
    if (!storeId) return;
    
    setLoading(true);
    try {
      const response = await fetch(route('api.wishlist.add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          store_id: storeId,
          product_id: productId,
        }),
      });

      if (response.ok) {
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number): Promise<void> => {
    if (!storeId) return;
    
    const item = items.find(item => item.product_id === productId);
    if (!item) return;

    setLoading(true);
    try {
      const response = await fetch(route('api.wishlist.remove', { id: item.id }) + `?store_id=${storeId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: number): Promise<void> => {
    if (!storeId) return;
    
    setLoading(true);
    try {
      const response = await fetch(route('api.wishlist.toggle'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          store_id: storeId,
          product_id: productId,
        }),
      });

      if (response.ok) {
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: WishlistContextType = {
    items,
    count,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};