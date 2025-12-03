import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { Calendar, User, ArrowLeft, Gem } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface JewelryBlogPostProps {
  post: {
    id: number;
    title: string;
    content: string;
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
  };
  store: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function JewelryBlogPost({
  post,
  store = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: JewelryBlogPostProps) {
  return (
    <>
      <Head title={`${post.title} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        customFooter={<JewelryFooter storeName={store.name} logo={store.logo} />}
      >
        {/* Luxury Header with Featured Image */}
        <div className="relative bg-yellow-50">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-8 relative z-10">
            {/* Back Navigation */}
            <Link
              href={route('store.blog', store.slug)}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition-colors mb-8"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Journal
            </Link>
            
            {/* Category Badge */}
            {post.category && (
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  <Gem className="w-4 h-4 mr-2" />
                  {post.category.name}
                </span>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-light text-gray-800 mb-6 tracking-wide leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-light">{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-light">
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Elegant Divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-yellow-300"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-4"></div>
              <div className="w-16 h-px bg-yellow-300"></div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="container mx-auto px-4 -mt-8 relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-200/50 p-4">
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/1200x600/f5f5f5/d97706?text=${encodeURIComponent(post.title)}`;
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-yellow-200/50 p-12">
                {/* Excerpt */}
                {post.excerpt && (
                  <div className="text-xl font-light text-gray-700 mb-8 leading-relaxed border-l-4 border-yellow-500 pl-6 italic">
                    {post.excerpt}
                  </div>
                )}
                
                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    fontWeight: '300'
                  }}
                />

                {/* Author Section */}
                <div className="mt-12 pt-8 border-t border-yellow-200">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mr-6">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-1">
                        {post.author.name}
                      </h4>
                      <p className="text-gray-600 font-light">
                        Jewelry Expert & Style Curator
                      </p>
                    </div>
                  </div>
                </div>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-yellow-200">
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-800 mb-6">
                      Share this article
                    </h4>
                    <div className="flex justify-center space-x-4">
                      <button className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </button>
                      <button className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </StoreLayout>
    </>
  );
}