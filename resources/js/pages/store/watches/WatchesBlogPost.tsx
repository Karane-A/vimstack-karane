import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface WatchesBlogPostProps {
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

export default function WatchesBlogPost({
  post,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesBlogPostProps) {
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
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        {/* Hero Header */}
        <section className="relative h-96 flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                {/* Back Navigation */}
                <div className="mb-8">
                  <Link
                    href={route('store.blog', store.slug)}
                    className="inline-flex items-center text-amber-500 hover:text-amber-400 font-medium tracking-wide transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Horological Journal
                  </Link>
                </div>
                
                {/* Category Badge */}
                {post.category && (
                  <div className="mb-6">
                    <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                      {post.category.name}
                    </span>
                  </div>
                )}
                
                <h1 className="text-5xl font-light text-white mb-6 leading-none tracking-tight">
                  {post.title}
                </h1>
                
                {/* Meta Information */}
                <div className="flex items-center space-x-8 text-slate-300 font-light">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="bg-slate-50 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg border border-slate-200 p-6">
                  <img
                    src={getImageUrl(post.featured_image)}
                    alt={post.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/1200x600/f8fafc/64748b?text=${encodeURIComponent(post.title)}`;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white">
          <section className="py-16 pb-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Excerpt */}
                {post.excerpt && (
                  <div className="text-xl font-light text-slate-600 mb-12 leading-relaxed border-l-4 border-amber-500 pl-8 italic">
                    {post.excerpt}
                  </div>
                )}
                
                {/* Content */}
                <div 
                  className="prose prose-slate max-w-none font-light leading-relaxed text-slate-600"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Author & Share Section */}
                <div className="mt-16 pt-8 border-t border-slate-200 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-amber-500 flex items-center justify-center mr-6">
                        <User className="w-8 h-8 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-slate-900 mb-1">
                          {post.author.name}
                        </h4>
                        <p className="text-slate-600 font-light">
                          Horological Expert & Timepiece Curator
                        </p>
                      </div>
                    </div>
                    
                    {/* Share Buttons */}
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-light text-sm">Share:</span>
                      <div className="flex gap-2">
                        <button className="w-10 h-10 bg-slate-100 hover:bg-amber-500 hover:text-slate-900 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </button>
                        <button className="w-10 h-10 bg-slate-100 hover:bg-amber-500 hover:text-slate-900 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </button>
                        <button className="w-10 h-10 bg-slate-100 hover:bg-amber-500 hover:text-slate-900 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>


      </StoreLayout>
    </>
  );
}