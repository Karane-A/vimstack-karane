import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu as MenuIcon, 
  X 
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/utils/image-helper';

interface FashionHeaderProps {
  storeName?: string;
  logo?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function FashionHeader({
  storeName = 'Fashion Store',
  logo,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  userName = "",
  customPages = [],
}: FashionHeaderProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-demo';
  const { count } = useCart();
  const { count: wishlistCountFromContext } = useWishlist();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 relative z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href={route('store.home', { storeSlug })}>
                {logo ? (
                  <img src={getImageUrl(logo)} alt={storeName} className="h-8" />
                ) : (
                  <span className="text-2xl font-thin tracking-widest uppercase">{storeName}</span>
                )}
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-12">
              {customPages.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-gray-900 hover:text-gray-600 font-light tracking-wide transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-6">

              {/* User Account */}
              <div className="relative">
                <button 
                  className="p-2 text-gray-900 hover:text-gray-600 focus:outline-none transition-colors"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <User className="h-5 w-5" />
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 overflow-hidden z-50">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-light text-gray-900">Hello, {userName}</p>
                        </div>
                        <Link 
                          href={route('store.my-profile', { storeSlug })}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                        >
                          My Profile
                        </Link>
                        <Link 
                          href={route('store.my-orders', { storeSlug })}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                        >
                          My Orders
                        </Link>
                        <Link 
                          href={route('store.logout', { storeSlug })} 
                          method="post" 
                          as="button" 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                        >
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link 
                          href={route('store.login', { storeSlug })}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                        >
                          Login
                        </Link>
                        <Link 
                          href={route('store.register', { storeSlug })}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-light"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Wishlist */}
              <Link 
                href={route('store.wishlist', { storeSlug })}
                className="p-2 text-gray-900 hover:text-gray-600 focus:outline-none relative transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlistCountFromContext > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCountFromContext}
                  </span>
                )}
              </Link>
              
              {/* Cart */}
              <Link 
                href={route('store.cart', { storeSlug })}
                className="p-2 text-gray-900 hover:text-gray-600 focus:outline-none relative transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-4">
              {customPages.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="block text-gray-900 hover:text-gray-600 font-light tracking-wide transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>


    </>
  );
}