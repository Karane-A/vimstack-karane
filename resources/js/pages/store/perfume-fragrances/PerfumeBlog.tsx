import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { PerfumeFooter } from '@/components/store/perfume-fragrances';
import { getImageUrl } from '@/utils/image-helper';

interface PerfumeBlogProps {
  store: any;
  posts?: any[];
  categories?: any[];
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function PerfumeBlog({
  store = {},
  posts = [],
  categories = [],
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeBlogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head title={`Blog - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme="perfume-fragrances"
        customFooter={<PerfumeFooter storeName={store.name} logo={store.logo} content={storeContent?.footer} />}
      >
        {/* Hero Section */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                Fragrance Journal
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Dive into the art of perfumery with expert insights and fragrance stories.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      
                      {/* Image */}
                      <div className="relative overflow-hidden h-64">
                        <img
                          src={getImageUrl(post.featured_image) || `https://placehold.co/400x256/fafaf9/7c3aed?text=${encodeURIComponent(post.title)}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/400x256/fafaf9/7c3aed?text=${encodeURIComponent(post.title)}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                        {post.category && (
                          <div className="absolute top-4 left-4 bg-purple-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {post.category.name}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <time>{formatDate(post.created_at)}</time>
                          {post.read_time && (
                            <>
                              <span>•</span>
                              <span>{post.read_time} min read</span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-purple-800 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {post.excerpt || post.content?.substring(0, 120) + '...'}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-purple-800 font-medium text-sm group-hover:text-purple-900 transition-colors duration-300">
                            Read Article
                          </span>
                          <svg className="w-4 h-4 text-purple-800 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-4">Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our fragrance journal is being crafted with expert insights. Stay tuned for captivating stories.
                </p>
              </div>
            )}
          </div>
        </section>
      </StoreLayout>
    </>
  );
}