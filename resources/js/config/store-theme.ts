/**
 * Store Theme Configuration
 * This file contains all theme settings for the store frontend
 */

export interface StoreThemeConfig {
  // Theme colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Store information
  store: {
    name: string;
    logo: string;
    favicon: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      pinterest?: string;
    };
  };
  
  // Header settings
  header: {
    showTopBar: boolean;
    showLanguageSwitcher: boolean;
    showCurrencySwitcher: boolean;
    menuItems: Array<{
      name: string;
      href: string;
      children?: Array<{
        name: string;
        href: string;
      }>;
    }>;
  };
  
  // Footer settings
  footer: {
    showNewsletter: boolean;
    columns: Array<{
      title: string;
      links: Array<{
        name: string;
        href: string;
      }>;
    }>;
    copyrightText: string;
  };
  
  // Homepage settings
  homepage: {
    heroSection: {
      title: string;
      subtitle: string;
      buttonText: string;
      buttonLink: string;
      image: string;
    };
    featuredCategories: boolean;
    featuredProducts: boolean;
    testimonials: boolean;
    newsletter: boolean;
  };
}

// Default theme configuration
const storeTheme: StoreThemeConfig = {
  colors: {
    primary: '#4f46e5',
    secondary: '#f97316',
    accent: '#06b6d4',
  },
  
  store: {
    name: 'Home Accessories',
    logo: '/storage/media/logo.png',
    favicon: '/images/logos/vimstack-favicon.png',
    description: 'Quality home decor and accessories for every room',
    contactEmail: 'info@homeaccessories.com',
    contactPhone: '+1 234 567 8900',
    address: '123 Main Street, New York, NY 10001',
    socialLinks: {
      facebook: 'https://facebook.com/homeaccessories',
      twitter: 'https://twitter.com/homeaccessories',
      instagram: 'https://instagram.com/homeaccessories',
      pinterest: 'https://pinterest.com/homeaccessories',
    },
  },
  
  header: {
    showTopBar: true,
    showLanguageSwitcher: true,
    showCurrencySwitcher: false,
    menuItems: [
      { name: 'Home', href: '/' },
      { name: 'Shop', href: '/shop' },
      { 
        name: 'Categories', 
        href: '/categories',
        children: [
          { name: 'Living Room', href: '/category/living-room' },
          { name: 'Bedroom', href: '/category/bedroom' },
          { name: 'Kitchen', href: '/category/kitchen' },
          { name: 'Bathroom', href: '/category/bathroom' },
        ]
      },
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Sale', href: '/sale' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  
  footer: {
    showNewsletter: true,
    columns: [
      {
        title: 'About Us',
        links: [
          { name: 'Our Story', href: '/about' },
          { name: 'Blog', href: '/blog' },
          { name: 'Careers', href: '/careers' },
        ],
      },
      {
        title: 'Customer Service',
        links: [
          { name: 'Contact Us', href: '/contact' },
          { name: 'FAQs', href: '/faq' },
          { name: 'Shipping & Returns', href: '/shipping' },
        ],
      },
      {
        title: 'Quick Links',
        links: [
          { name: 'My Account', href: '/account' },
          { name: 'Track Order', href: '/track-order' },
          { name: 'Wishlist', href: '/wishlist' },
        ],
      },
    ],
    copyrightText: '© {year} Home Accessories. All rights reserved.',
  },
  
  homepage: {
    heroSection: {
      title: 'Transform Your Space',
      subtitle: 'Discover our collection of beautiful home accessories to elevate your living space.',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      image: '/storage/media/hero-image.jpg',
    },
    featuredCategories: true,
    featuredProducts: true,
    testimonials: true,
    newsletter: true,
  },
};

export default storeTheme;