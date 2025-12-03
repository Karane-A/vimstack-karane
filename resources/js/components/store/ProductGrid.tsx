import React, { useState } from 'react';
import ProductCard from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5;
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  columns = 4,
  showViewAll = false,
  viewAllLink = '/shop',
  viewAllText = 'View All Products',
  className = ''
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  
  const handleAddToCart = (product: Product, quantity: number) => {
    // In a real app, this would add to cart via API or context
    console.log('Adding to cart:', product, quantity);
    
    // Show success message
    setCartMessage(`${product.name} added to cart`);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setCartMessage(null);
    }, 3000);
  };
  
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };
  
  const handleAddToWishlist = (product: Product) => {
    // In a real app, this would add to wishlist via API or context
    console.log('Adding to wishlist:', product);
  };
  
  // Determine grid columns class
  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  }[columns];

  return (
    <div className={className}>
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
          {title && <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>}
        </div>
      )}
      
      {/* Product Grid */}
      <div className={`grid ${gridColsClass} gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </div>
      
      {/* View All Button */}
      {showViewAll && products.length > 0 && (
        <div className="text-center mt-10">
          <a 
            href={viewAllLink} 
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {viewAllText}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      )}
      
      {/* Cart Success Message */}
      {cartMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
          {cartMessage}
        </div>
      )}
      
      {/* Quick View Modal - In a real app, this would be a proper modal component */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{quickViewProduct.name}</h3>
              <button onClick={() => setQuickViewProduct(null)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={quickViewProduct.cover_image} 
                  alt={quickViewProduct.name}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(quickViewProduct.name)}`;
                  }}
                />
              </div>
              <div>
                <p className="text-gray-500 mb-2">
                  {quickViewProduct.category?.name || 'Uncategorized'}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                </div>
                
                <div className="mb-4">
                  {quickViewProduct.sale_price ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-primary">${quickViewProduct.sale_price.toFixed(2)}</span>
                      <span className="text-gray-500 text-lg line-through ml-2">${quickViewProduct.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold">${quickViewProduct.price.toFixed(2)}</span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  {quickViewProduct.stock > 0 ? (
                    <span className="text-green-600">In Stock ({quickViewProduct.stock} available)</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
                
                {/* Variants */}
                {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                  <div className="mb-4">
                    {quickViewProduct.variants.map((variant, index) => (
                      <div key={index} className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {variant.name}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {variant.values.map((value, i) => (
                            <button
                              key={i}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:border-primary hover:text-primary transition-colors"
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex border border-gray-300 rounded-md">
                    <button className="px-3 py-1 border-r border-gray-300">-</button>
                    <input
                      type="number"
                      min="1"
                      max={quickViewProduct.stock}
                      defaultValue="1"
                      className="w-12 text-center focus:outline-none"
                    />
                    <button className="px-3 py-1 border-l border-gray-300">+</button>
                  </div>
                  
                  <button 
                    className="flex-grow bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    disabled={quickViewProduct.stock <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
                
                <button 
                  className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  onClick={() => {
                    handleAddToWishlist(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}