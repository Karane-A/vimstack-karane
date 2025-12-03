import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface CarsBlogPostProps {
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

export default function CarsBlogPost({
  post,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsBlogPostProps) {
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
        {/* Automotive Header */}
        <div className="bg-black text-white py-12 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link
                href={route('store.blog', store.slug)}
                className="inline-flex items-center text-red-600 hover:text-red-400 font-bold tracking-wider uppercase transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                Back to Auto Journal
              </Link>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image with Full Overlay */}
        <div className="relative h-96 bg-gray-900 overflow-hidden">
          <img
            src={getImageUrl(post.featured_image) || `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center">
            <div className="container mx-auto px-4">
              {post.category && (
                <div className="mb-6">
                  <div className="inline-block bg-red-600 text-white px-6 py-3 font-bold tracking-widest uppercase text-sm">
                    {post.category.name}
                  </div>
                </div>
              )}
              <h1 className="text-4xl lg:text-6xl font-black text-red-600 tracking-tight leading-tight max-w-4xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <div className="bg-white p-12 border-l-8 border-red-600 mb-12">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-8 text-gray-600 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase text-red-600">Author</div>
                      <div className="font-bold text-black">{post.author.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase text-red-600">Published</div>
                      <div className="font-bold text-black">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-widest uppercase text-red-600">Read Time</div>
                      <div className="font-bold text-black">5 min read</div>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="bg-gray-50 p-6 border-l-4 border-red-600">
                  <p className="text-lg text-gray-700 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Article Body */}
              <div className="bg-white p-12 border border-gray-200">
                <div 
                  className="prose prose-lg max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    fontWeight: '400'
                  }}
                />
              </div>


            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}