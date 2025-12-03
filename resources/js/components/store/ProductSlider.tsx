import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number | null;
  cover_image: string;
  category?: { id: number; name: string };
  stock: number;
  is_active: boolean;
  variants?: Array<{
    name: string;
    values: string[];
  }>;
}

interface ProductSliderProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  viewAllText?: string;
  storeSettings?: any;
  currencies?: any[];
}

export default function ProductSlider({
  title,
  subtitle,
  products = [],
  viewAllLink = '/shop',
  viewAllText = 'View All',
  storeSettings = {},
  currencies = []
}: ProductSliderProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };
  
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [products]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of the visible width
      
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      
      // Update button states after scrolling
      setTimeout(checkScrollButtons, 500);
    }
  };
  
  const handleAddToCart = (product: Product, quantity: number) => {
    console.log('Adding to cart:', product, quantity);
  };
  
  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
  };
  
  const handleAddToWishlist = (product: Product) => {
    console.log('Adding to wishlist:', product);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${
                canScrollLeft 
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${
                canScrollRight 
                  ? 'border-gray-300 hover:bg-gray-100 text-gray-700' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {viewAllLink && (
              <Link 
                href={viewAllLink}
                className="ml-2 text-primary hover:underline font-medium flex items-center"
              >
                {viewAllText}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        </div>
        
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
          onScroll={checkScrollButtons}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[280px] sm:min-w-[calc(50%-12px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] max-w-[280px] sm:max-w-[calc(50%-12px)] md:max-w-[calc(33.333%-16px)] lg:max-w-[calc(25%-18px)] snap-start"
            >
              <ProductCard 
                {...product}
                cover_image={product.cover_image ? getImageUrl(product.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onAddToWishlist={handleAddToWishlist}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}