import React from 'react';

// Default components
import HeroSection from '@/components/store/HeroSectionFixed';
import CategorySection from '@/components/store/CategorySection';
import FeaturedProductsSection from '@/components/store/FeaturedProductsSection';
import NewsletterSection from '@/components/store/NewsletterSection';
import TrendingProductsSection from '@/components/store/TrendingProductsSection';
import BrandLogoSlider from '@/components/store/BrandLogoSlider';
import InfoBoxesSection from '@/components/store/InfoBoxesSection';
import BlogSection from '@/components/store/BlogSection';
import Footer from '@/components/store/FooterFixed';

// Default pages
import ProductDetailPage from '@/pages/store/product';
import ProductListingPage from '@/pages/store/products';

// Home Accessories components
import HomeAccessoriesCTASection from '@/components/store/HomeAccessoriesCTASection';

// Fashion components
import { 
  FashionHeroSection, 
  FashionCategorySection, 
  FashionNewsletterSection,
  FashionFeaturedProductsSection,
  FashionTrendingProductsSection,
  FashionCTASection,
  FashionBrandLogoSlider,
  FashionBlogSection,
  FashionFooter
} from '@/components/store/fashion';

// Electronics components
import { 
  ElectronicsHeroSection, 
  ElectronicsCategorySection, 
  ElectronicsNewsletterSection,
  ElectronicsFeaturedProductsSection,
  ElectronicsTrendingProductsSection,
  ElectronicsCTASection,
  ElectronicsBrandLogoSlider,
  ElectronicsBlogSection,
  ElectronicsFooter
} from '@/components/store/electronics';

// Beauty & Cosmetics components
import { 
  BeautyHeroSection, 
  BeautyCategorySection, 
  BeautyNewsletterSection,
  BeautyFeaturedProductsSection,
  BeautyTrendingProductsSection,
  BeautyCTASection,
  BeautyBrandLogoSlider,
  BeautyBlogSection,
  BeautyFooter
} from '@/components/store/beauty-cosmetics';

// Jewelry components
import { 
  JewelryHeroSection, 
  JewelryCategorySection, 
  JewelryNewsletterSection,
  JewelryFeaturedProductsSection,
  JewelryTrendingProductsSection,
  JewelryCTASection,
  JewelryBrandLogoSlider,
  JewelryBlogSection,
  JewelryFooter
} from '@/components/store/jewelry';

// Watches components
import { 
  WatchesHeroSection, 
  WatchesCategorySection, 
  WatchesNewsletterSection,
  WatchesFeaturedProductsSection,
  WatchesTrendingProductsSection,
  WatchesCTASection,
  WatchesBrandLogoSlider,
  WatchesBlogSection,
  WatchesFooter
} from '@/components/store/watches';

// Furniture & Interior components
import { 
  FurnitureHeroSection, 
  FurnitureCategorySection, 
  FurnitureNewsletterSection,
  FurnitureFeaturedProductsSection,
  FurnitureTrendingProductsSection,
  FurnitureCTASection,
  FurnitureBrandLogoSlider,
  FurnitureBlogSection,
  FurnitureFooter
} from '@/components/store/furniture-interior';

// Cars & Automotive components
import { 
  CarsHeroSection, 
  CarsCategorySection, 
  CarsNewsletterSection,
  CarsFeaturedProductsSection,
  CarsTrendingProductsSection,
  CarsCTASection,
  CarsBrandLogoSlider,
  CarsBlogSection,
  CarsFooter
} from '@/components/store/cars-automotive';

// Baby & Kids components
import { 
  BabyKidsHeroSection, 
  BabyKidsCategorySection, 
  BabyKidsNewsletterSection,
  BabyKidsFeaturedProductsSection,
  BabyKidsTrendingProductsSection,
  BabyKidsCTASection,
  BabyKidsBrandLogoSlider,
  BabyKidsBlogSection,
  BabyKidsFooter,
  BabyKidsLoginPage,
  BabyKidsRegisterPage,
  BabyKidsForgotPasswordPage
} from '@/components/store/baby-kids';

// Perfume & Fragrances components
import { 
  PerfumeHeroSection, 
  PerfumeCategorySection, 
  PerfumeNewsletterSection,
  PerfumeFeaturedProductsSection,
  PerfumeTrendingProductsSection,
  PerfumeCTASection,
  PerfumeBrandLogoSlider,
  PerfumeBlogSection,
  PerfumeFooter
} from '@/components/store/perfume-fragrances';

export interface ThemeComponents {
  HeroSection: React.ComponentType<any>;
  CategorySection: React.ComponentType<any>;
  FeaturedProductsSection: React.ComponentType<any>;
  NewsletterSection: React.ComponentType<any>;
  TrendingProductsSection: React.ComponentType<any>;
  BrandLogoSlider: React.ComponentType<any>;
  InfoBoxesSection?: React.ComponentType<any>;
  CTASection?: React.ComponentType<any>;
  BlogSection: React.ComponentType<any>;
  Footer: React.ComponentType<any>;
  ProductDetailPage: React.ComponentType<any>;
  ProductListingPage?: React.ComponentType<any>;
  LoginPage?: React.ComponentType<any>;
  RegisterPage?: React.ComponentType<any>;
  ForgotPasswordPage?: React.ComponentType<any>;
  WishlistPage?: React.ComponentType<any>;
  CartPage?: React.ComponentType<any>;
  CustomPage?: React.ComponentType<any>;
  ProfilePage?: React.ComponentType<any>;
  OrdersPage?: React.ComponentType<any>;
  BlogPostPage?: React.ComponentType<any>;
  BlogPage?: React.ComponentType<any>;
  CheckoutPage?: React.ComponentType<any>;
  OrderConfirmationPage?: React.ComponentType<any>;
  OrderDetailPage?: React.ComponentType<any>;
}

export const themeRegistry: Record<string, ThemeComponents> = {
  'default': {
    HeroSection,
    CategorySection,
    FeaturedProductsSection,
    NewsletterSection,
    TrendingProductsSection,
    BrandLogoSlider,
    InfoBoxesSection,
    BlogSection,
    Footer,
    ProductDetailPage,
    ProductListingPage
  },
  'home-accessories': {
    HeroSection,
    CategorySection,
    FeaturedProductsSection,
    NewsletterSection,
    TrendingProductsSection,
    BrandLogoSlider,
    CTASection: HomeAccessoriesCTASection,
    BlogSection,
    Footer,
    ProductDetailPage,
    ProductListingPage
  },
  'fashion': {
    HeroSection: FashionHeroSection,
    CategorySection: FashionCategorySection,
    FeaturedProductsSection: FashionFeaturedProductsSection,
    NewsletterSection: FashionNewsletterSection,
    TrendingProductsSection: FashionTrendingProductsSection,
    BrandLogoSlider: FashionBrandLogoSlider,
    CTASection: FashionCTASection,
    BlogSection: FashionBlogSection,
    Footer: FashionFooter,
    ProductDetailPage
  },
  'electronics': {
    HeroSection: ElectronicsHeroSection,
    CategorySection: ElectronicsCategorySection,
    FeaturedProductsSection: ElectronicsFeaturedProductsSection,
    NewsletterSection: ElectronicsNewsletterSection,
    TrendingProductsSection: ElectronicsTrendingProductsSection,
    BrandLogoSlider: ElectronicsBrandLogoSlider,
    InfoBoxesSection: InfoBoxesSection,
    CTASection: ElectronicsCTASection,
    BlogSection: ElectronicsBlogSection,
    Footer: ElectronicsFooter,
    ProductDetailPage
  },
  'beauty-cosmetics': {
    HeroSection: BeautyHeroSection,
    CategorySection: BeautyCategorySection,
    FeaturedProductsSection: BeautyFeaturedProductsSection,
    NewsletterSection: BeautyNewsletterSection,
    TrendingProductsSection: BeautyTrendingProductsSection,
    BrandLogoSlider: BeautyBrandLogoSlider,
    CTASection: BeautyCTASection,
    BlogSection: BeautyBlogSection,
    Footer: BeautyFooter,
    ProductDetailPage
  },
  'jewelry': {
    HeroSection: JewelryHeroSection,
    CategorySection: JewelryCategorySection,
    FeaturedProductsSection: JewelryFeaturedProductsSection,
    NewsletterSection: JewelryNewsletterSection,
    TrendingProductsSection: JewelryTrendingProductsSection,
    BrandLogoSlider: JewelryBrandLogoSlider,
    CTASection: JewelryCTASection,
    BlogSection: JewelryBlogSection,
    Footer: JewelryFooter,
    ProductDetailPage
  },
  'watches': {
    HeroSection: WatchesHeroSection,
    CategorySection: WatchesCategorySection,
    FeaturedProductsSection: WatchesFeaturedProductsSection,
    NewsletterSection: WatchesNewsletterSection,
    TrendingProductsSection: WatchesTrendingProductsSection,
    BrandLogoSlider: WatchesBrandLogoSlider,
    CTASection: WatchesCTASection,
    BlogSection: WatchesBlogSection,
    Footer: WatchesFooter,
    ProductDetailPage
  },
  'furniture-interior': {
    HeroSection: FurnitureHeroSection,
    CategorySection: FurnitureCategorySection,
    FeaturedProductsSection: FurnitureFeaturedProductsSection,
    NewsletterSection: FurnitureNewsletterSection,
    TrendingProductsSection: FurnitureTrendingProductsSection,
    BrandLogoSlider: FurnitureBrandLogoSlider,
    CTASection: FurnitureCTASection,
    BlogSection: FurnitureBlogSection,
    Footer: FurnitureFooter,
    ProductDetailPage
  },
  'cars-automotive': {
    HeroSection: CarsHeroSection,
    CategorySection: CarsCategorySection,
    FeaturedProductsSection: CarsFeaturedProductsSection,
    NewsletterSection: CarsNewsletterSection,
    TrendingProductsSection: CarsTrendingProductsSection,
    BrandLogoSlider: CarsBrandLogoSlider,
    CTASection: CarsCTASection,
    BlogSection: CarsBlogSection,
    Footer: CarsFooter,
    ProductDetailPage
  },
  'baby-kids': {
    HeroSection: BabyKidsHeroSection,
    CategorySection: BabyKidsCategorySection,
    FeaturedProductsSection: BabyKidsFeaturedProductsSection,
    NewsletterSection: BabyKidsNewsletterSection,
    TrendingProductsSection: BabyKidsTrendingProductsSection,
    BrandLogoSlider: BabyKidsBrandLogoSlider,
    CTASection: BabyKidsCTASection,
    BlogSection: BabyKidsBlogSection,
    Footer: BabyKidsFooter,
    ProductDetailPage,
    LoginPage: BabyKidsLoginPage,
    RegisterPage: BabyKidsRegisterPage,
    ForgotPasswordPage: BabyKidsForgotPasswordPage
  },
  'perfume-fragrances': {
    HeroSection: PerfumeHeroSection,
    CategorySection: PerfumeCategorySection,
    FeaturedProductsSection: PerfumeFeaturedProductsSection,
    NewsletterSection: PerfumeNewsletterSection,
    TrendingProductsSection: PerfumeTrendingProductsSection,
    BrandLogoSlider: PerfumeBrandLogoSlider,
    CTASection: PerfumeCTASection,
    BlogSection: PerfumeBlogSection,
    Footer: PerfumeFooter,
    ProductDetailPage,
    ProductListingPage
  }
};

export const getThemeComponents = (theme: string): ThemeComponents => {
  return themeRegistry[theme] || themeRegistry['default'];
};