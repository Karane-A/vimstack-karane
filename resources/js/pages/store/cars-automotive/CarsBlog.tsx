import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, ArrowRight, Wrench, Zap, Settings } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface CarsBlogProps {
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string;
    published_at: string;
    author: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
    };
  }>;
  store: any;
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

export default function CarsBlog({
  posts = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsBlogProps) {
  const categories = [
    { icon: Wrench, title: 'Installation Guides', count: 12 },
    { icon: Zap, title: 'Performance Tips', count: 8 },
    { icon: Settings, title: 'Industry News', count: 15 }
  ];

  return (
    <>
      <Head title={`Auto Journal - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        {/* Industrial Header */}
        <div className="bg-black text-white py-20 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <div className="w-6 h-6 bg-white transform -rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-wider">AUTO JOURNAL</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Technical Knowledge Base</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Expert insights, installation guides, and the latest automotive industry developments
            </p>
          </div>
        </div>



        {/* Blog Posts Grid */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <article key={post.id} className={`group bg-white border-2 border-gray-200 hover:border-red-600 hover:shadow-xl transition-all duration-300 overflow-hidden ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <Link href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image */}
                        <div className="relative h-80 overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(post.featured_image) || `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {post.category && (
                            <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 font-bold text-sm tracking-widest uppercase">
                              {post.category.name}
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-12 flex flex-col justify-center">
                          <div className="flex items-center text-red-600 text-sm font-bold mb-4">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            <span className="mx-3">•</span>
                            <User className="h-4 w-4 mr-2" />
                            {post.author.name}
                          </div>
                          
                          <h2 className="text-3xl font-black text-black mb-6 leading-tight group-hover:text-red-600 transition-colors">
                            {post.title}
                          </h2>
                          
                          <p className="text-gray-600 mb-8 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center text-red-600 font-bold tracking-wider uppercase group-hover:translate-x-2 transition-transform">
                            Read Technical Guide
                            <ArrowRight className="h-5 w-5 ml-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white border-2 border-dashed border-gray-300 p-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-gray-500 mb-4">No Technical Articles</h2>
                  <p className="text-gray-400">Automotive guides and technical articles will appear here once published.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}