/**
 * Fashion Theme Configuration
 * Elegant and modern design for fashion and apparel brands
 */

export interface FashionThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  typography: {
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
  };
  
  store: {
    name: string;
    logo: string;
    favicon: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: {
      instagram?: string;
      tiktok?: string;
      pinterest?: string;
      youtube?: string;
    };
  };
  
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

const fashionTheme: FashionThemeConfig = {
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#f5f5f5',
    background: '#ffffff',
    text: '#1a1a1a',
  },
  
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingWeight: '300',
    bodyWeight: '400',
  },
  
  store: {
    name: 'Fashion Store',
    logo: '/storage/media/fashion-logo.png',
    favicon: '/storage/media/fashion-favicon.ico',
    description: 'Contemporary fashion and timeless style for the modern wardrobe',
    contactEmail: 'hello@fashionstore.com',
    contactPhone: '+1 555 FASHION',
    address: '789 Fashion Avenue, Style District, NY 10018',
    socialLinks: {
      instagram: 'https://instagram.com/fashionstore',
      tiktok: 'https://tiktok.com/@fashionstore',
      pinterest: 'https://pinterest.com/fashionstore',
      youtube: 'https://youtube.com/fashionstore',
    },
  },
  
  header: {
    showTopBar: true,
    showLanguageSwitcher: true,
    showCurrencySwitcher: true,
    menuItems: [
      { name: 'New In', href: '/new-arrivals' },
      { 
        name: 'Women', 
        href: '/women',
        children: [
          { name: 'Dresses', href: '/women/dresses' },
          { name: 'Tops', href: '/women/tops' },
          { name: 'Bottoms', href: '/women/bottoms' },
          { name: 'Outerwear', href: '/women/outerwear' },
          { name: 'Accessories', href: '/women/accessories' },
        ]
      },
      { 
        name: 'Men', 
        href: '/men',
        children: [
          { name: 'Shirts', href: '/men/shirts' },
          { name: 'Pants', href: '/men/pants' },
          { name: 'Jackets', href: '/men/jackets' },
          { name: 'Accessories', href: '/men/accessories' },
        ]
      },
      { name: 'Sale', href: '/sale' },
      { name: 'Lookbook', href: '/lookbook' },
    ],
  },
  
  footer: {
    showNewsletter: true,
    columns: [
      {
        title: 'Customer Care',
        links: [
          { name: 'Size Guide', href: '/size-guide' },
          { name: 'Shipping & Returns', href: '/shipping' },
          { name: 'Contact Us', href: '/contact' },
          { name: 'Style Advice', href: '/style-advice' },
        ],
      },
      {
        title: 'Company',
        links: [
          { name: 'About Us', href: '/about' },
          { name: 'Careers', href: '/careers' },
          { name: 'Press', href: '/press' },
          { name: 'Sustainability', href: '/sustainability' },
        ],
      },
      {
        title: 'Connect',
        links: [
          { name: 'Instagram', href: '/instagram' },
          { name: 'TikTok', href: '/tiktok' },
          { name: 'Pinterest', href: '/pinterest' },
          { name: 'YouTube', href: '/youtube' },
        ],
      },
    ],
    copyrightText: '© {year} {store_name}. All rights reserved.',
  },
  
  homepage: {
    heroSection: {
      title: 'Define Your Style',
      subtitle: 'Discover the latest trends and timeless pieces that express your unique personality.',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      image: '/storage/media/fashion-hero.jpg',
    },
    featuredCategories: true,
    featuredProducts: true,
    testimonials: true,
    newsletter: true,
  },
};

export default fashionTheme;