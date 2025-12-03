import React from 'react';
import ProductSlider from './ProductSlider';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface TrendingProductsSectionProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  products?: any[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function TrendingProductsSection({
  title = "Trending Products",
  subtitle = "Our most popular products this week",
  viewAllLink = "/shop",
  products = [],
  content,
  storeSettings = {},
  currencies = []
}: TrendingProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  // Enhance products with proper image URLs
  const trendingProducts = products.map(product => ({
    ...product,
    cover_image: product.cover_image ? getImageUrl(product.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`
  }));

  return (
    <ProductSlider
      title={content?.title || title}
      subtitle={content?.description || subtitle}
      products={trendingProducts}
      viewAllLink={route('store.products', { storeSlug })}
      viewAllText="View All Products"
      storeSettings={storeSettings}
      currencies={currencies}
    />
  );
}