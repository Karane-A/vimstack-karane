import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface FashionBlogPostProps {
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

export default function FashionBlogPost({
  post,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionBlogPostProps) {


  return (
    <>
      <Head title={`${post.title} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages.length > 0 ? customPages : undefined}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        {/* Hero Image */}
        <div className="relative h-96 bg-black overflow-hidden">
          <img
            src={getImageUrl(post.featured_image)}
            alt={post.title}
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/1200x600/f5f5f5/666666?text=${encodeURIComponent(post.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Back Button */}
          <div className="absolute top-8 left-8">
            <Link
              href={route('store.blog', store.slug)}
              className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-light tracking-wide">Back to Journal</span>
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="mb-12 text-center">
                {post.category && (
                  <div className="mb-4">
                    <span className="text-sm font-light tracking-widest uppercase text-gray-500">
                      {post.category.name}
                    </span>
                  </div>
                )}
                
                <h1 className="text-5xl font-thin tracking-wide mb-8 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
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
                
                <div className="w-24 h-px bg-gray-300 mx-auto mt-8"></div>
              </header>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <div className="text-xl font-light text-gray-700 mb-8 leading-relaxed">
                  {post.excerpt}
                </div>
                
                <div 
                  className="font-light leading-relaxed text-gray-800"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75',
                    fontWeight: '300'
                  }}
                />
              </div>

              {/* Article Footer */}
              <footer className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-light">Published by </span>
                    <span className="font-medium">{post.author.name}</span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}