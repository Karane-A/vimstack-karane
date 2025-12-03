import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  views: number;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface BabyKidsBlogPostProps {
  post: BlogPost;
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

export default function BabyKidsBlogPost({
  post,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsBlogPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
        {/* Hero Section */}
        <div className="bg-pink-50 py-16 relative overflow-hidden">
          {/* Playful Background */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-12 h-12 bg-pink-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-8 h-8 bg-blue-200 rounded-full opacity-40 animate-bounce"></div>
            <div className="absolute bottom-16 left-32 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 right-16 w-6 h-6 bg-green-200 rounded-full opacity-35 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">{post.title}</h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                {post.category && (
                  <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {post.category.name}
                  </span>
                )}
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{formatDate(post.published_at)}</span>
                </div>
                
                {post.author && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{post.author.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative">
            <div className="absolute top-4 left-4 w-full h-full bg-pink-300 rounded-3xl opacity-30"></div>
            <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 mx-6 lg:mx-12 -mt-8 overflow-hidden">
              <img 
                src={getImageUrl(post.featured_image)}
                alt={post.title}
                className="w-full h-64 lg:h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/1200x600/fef7f7/ec4899?text=${encodeURIComponent(post.title)}`;
                }}
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {/* Content Card */}
              <div className="relative mb-12">
                <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 p-8 lg:p-12">
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.8',
                      color: '#374151'
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="relative mb-12">
                  <div className="absolute top-2 left-2 w-full h-full bg-blue-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-blue-300 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map(tag => (
                        <span 
                          key={tag.id}
                          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>


      </StoreLayout>
    </>
  );
}