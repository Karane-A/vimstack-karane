/**
 * Beauty & Cosmetics Theme Configuration
 * Clean and elegant design for beauty and cosmetics brands
 */

export interface BeautyThemeConfig {
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
      youtube?: string;
      tiktok?: string;
      pinterest?: string;
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

const beautyTheme: BeautyThemeConfig = {
  colors: {
    primary: '#e11d48',
    secondary: '#fdf2f8',
    accent: '#f43f5e',
    background: '#ffffff',
    text: '#1f2937',
  },
  
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingWeight: '300',
    bodyWeight: '400',
  },
  
  store: {
    name: 'Beauty Store',
    logo: '/storage/media/beauty-logo.png',
    favicon: '/storage/media/beauty-favicon.ico',
    description: 'Premium beauty and cosmetics for your natural radiance',
    contactEmail: 'hello@beautystore.com',
    contactPhone: '+1 555 BEAUTY',
    address: '456 Beauty Boulevard, Wellness District, CA 90210',
    socialLinks: {
      instagram: 'https://instagram.com/beautystore',
      youtube: 'https://youtube.com/beautystore',
      tiktok: 'https://tiktok.com/@beautystore',
      pinterest: 'https://pinterest.com/beautystore',
    },
  },
  
  header: {
    showTopBar: true,
    showLanguageSwitcher: true,
    showCurrencySwitcher: true,
    menuItems: [
      { name: 'New Arrivals', href: '/new-arrivals' },
      { 
        name: 'Skincare', 
        href: '/skincare',
        children: [
          { name: 'Cleansers', href: '/skincare/cleansers' },
          { name: 'Moisturizers', href: '/skincare/moisturizers' },
          { name: 'Serums', href: '/skincare/serums' },
          { name: 'Sunscreen', href: '/skincare/sunscreen' },
          { name: 'Treatments', href: '/skincare/treatments' },
        ]
      },
      { 
        name: 'Makeup', 
        href: '/makeup',
        children: [
          { name: 'Face', href: '/makeup/face' },
          { name: 'Eyes', href: '/makeup/eyes' },
          { name: 'Lips', href: '/makeup/lips' },
          { name: 'Tools', href: '/makeup/tools' },
        ]
      },
      { name: 'Wellness', href: '/wellness' },
      { name: 'Sale', href: '/sale' },
    ],
  },
  
  footer: {
    showNewsletter: true,
    columns: [
      {
        title: 'Customer Care',
        links: [
          { name: 'Beauty Consultation', href: '/consultation' },
          { name: 'Shipping & Returns', href: '/shipping' },
          { name: 'Contact Us', href: '/contact' },
          { name: 'Ingredient Guide', href: '/ingredients' },
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
          { name: 'YouTube', href: '/youtube' },
          { name: 'TikTok', href: '/tiktok' },
          { name: 'Pinterest', href: '/pinterest' },
        ],
      },
    ],
    copyrightText: '© {year} {store_name}. All rights reserved.',
  },
  
  homepage: {
    heroSection: {
      title: 'Enhance Your Natural Beauty',
      subtitle: 'Discover premium skincare, makeup, and wellness products that celebrate your unique beauty.',
      buttonText: 'Shop Collection',
      buttonLink: '/shop',
      image: '/storage/media/beauty-hero.jpg',
    },
    featuredCategories: true,
    featuredProducts: true,
    testimonials: true,
    newsletter: true,
  },
};

export default beautyTheme;