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
import storeTheme from '@/config/store-theme';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/utils/image-helper';


interface HeaderProps {
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
  content?: any;
  theme?: string;
}

function Header({
  storeName = storeTheme.store.name,
  logo = storeTheme.store.logo,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  userName = "",
  customPages = [],
  content,
  theme = 'default'
}: HeaderProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  // Get custom pages from store data if not provided via props
  const storeCustomPages = props.store?.custom_pages || [];
  const { count } = useCart();
  const { count: wishlistCountFromContext } = useWishlist();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // Use custom pages from props or store data
  const menuItems = (customPages && customPages.length > 0) ? customPages : 
                   (storeCustomPages && storeCustomPages.length > 0) ? storeCustomPages : [];
  
  // Get theme-specific hover color
  const getHoverColor = () => {
    switch (theme) {
      case 'jewelry':
        return 'hover:text-yellow-600';
      case 'fashion':
        return 'hover:text-pink-600';
      case 'electronics':
        return 'hover:text-blue-600';
      case 'beauty-cosmetics':
        return 'hover:text-rose-600';
      case 'watches':
        return 'hover:text-slate-600';
      case 'furniture-interior':
        return 'hover:text-amber-600';
      case 'cars-automotive':
        return 'hover:text-red-600';
      case 'baby-kids':
        return 'hover:text-purple-600';
      case 'perfume-fragrances':
        return 'hover:text-violet-600';
      default:
        return 'hover:text-primary';
    }
  };


  return (
    <header className="bg-white shadow-sm">
      {/* Top bar with language and account */}
      {(content?.show_welcome || content?.show_phone) && (
        <div className="bg-gray-100 py-2 px-4 text-sm hidden md:block">
          <div className="container mx-auto flex justify-between items-center">
            {content?.show_welcome && (
              <div>
                <span className="text-gray-600">{content?.welcome_text || 'Welcome to our store'}</span>
              </div>
            )}
            {content?.show_phone && (
              <div className="flex items-center space-x-4">
                {/* Contact Info */}
                <div className="text-gray-600">
                  <span>{content?.phone_text || 'Call us: +1 234 567 8900'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
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
              <img 
                src={getImageUrl(logo || '/storage/media/logo.png')} 
                alt={storeName} 
                className="h-10" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/200x80?text=${encodeURIComponent(storeName || 'Store')}`;
                }}
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`text-gray-700 ${getHoverColor()} font-medium`}
              >
                {item.name}
              </Link>
            ))}

          </nav>
          
          {/* PWA Install, Search, User, Cart */}
          <div className="flex items-center space-x-4">


            {/* User Account */}
            <div className="relative">
              <button 
                className={`p-2 text-gray-700 ${getHoverColor()} focus:outline-none`}
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <User className="h-5 w-5" />
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Hello, {userName}</p>
                      </div>
                      <Link 
                        href={route('store.my-profile', { storeSlug })}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link 
                        href={route('store.my-orders', { storeSlug })}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <Link 
                        href={route('store.logout', { storeSlug })} 
                        method="post" 
                        as="button" 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        href={route('store.login', { storeSlug })}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link 
                        href={route('store.register', { storeSlug })}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className={`p-2 text-gray-700 ${getHoverColor()} focus:outline-none relative`}
            >
              <Heart className="h-5 w-5" />
              {wishlistCountFromContext > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCountFromContext}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link 
              href={route('store.cart', { storeSlug })}
              className={`p-2 text-gray-700 ${getHoverColor()} focus:outline-none relative`}
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium text-gray-700 ${getHoverColor()} hover:bg-gray-50 rounded-md`}
              >
                {item.name}
              </Link>
            ))}
            


          </div>
        </div>
      )}
    </header>
  );
}

export default Header;