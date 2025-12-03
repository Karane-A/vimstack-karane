import { getImageUrl } from '@/utils/image-helper';

// Base theme data without thumbnails
const baseThemeData = [
  {
    id: 'home-accessories',
    name: 'Home Accessories',
    description: 'Clean and modern design for home accessories and decor products',
    imagePath: '/storage/placeholder/themes/home-accessories.png'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Elegant and trendy design perfect for fashion and apparel brands',
    imagePath: '/storage/placeholder/themes/fashion.png'
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    description: 'Modern tech-focused design for electronics and gadget stores',
    imagePath: '/storage/placeholder/themes/electronics.png'
  },
  {
    id: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics',
    description: 'Clean and elegant design perfect for beauty and cosmetics brands',
    imagePath: '/storage/placeholder/themes/beauty-cosmetics.png'
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Elegant and luxurious design perfect for jewelry and accessories',
    imagePath: '/storage/placeholder/themes/jewelry.png'
  },
  {
    id: 'watches',
    name: 'Watches',
    description: 'Premium luxury design perfect for timepieces and watch collections',
    imagePath: '/storage/placeholder/themes/watches.png'
  },
  {
    id: 'furniture-interior',
    name: 'Furniture & Interior Design',
    description: 'Premium design for furniture stores and interior design services',
    imagePath: '/storage/placeholder/themes/furniture-interior.png'
  },
  {
    id: 'cars-automotive',
    name: 'Cars & Automotive',
    description: 'Dynamic design perfect for automotive and car dealership stores',
    imagePath: '/storage/placeholder/themes/cars-automotive.png'
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    description: 'Playful and colorful design perfect for baby and children products',
    imagePath: '/storage/placeholder/themes/baby-kids.png'
  },
  {
    id: 'perfume-fragrances',
    name: 'Perfume & Fragrances',
    description: 'Elegant and luxurious design perfect for perfume and fragrance brands',
    imagePath: '/storage/placeholder/themes/perfume-fragrances.png'
  }
];

// Function to get store themes with proper thumbnail URLs
export function getStoreThemes() {
  return baseThemeData.map(theme => ({
    ...theme,
    thumbnail: getImageUrl(theme.imagePath)
  }));
}

// Export static version for backward compatibility
export const storeThemes = getStoreThemes();