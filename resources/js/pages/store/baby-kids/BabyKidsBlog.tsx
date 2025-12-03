import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

interface BabyKidsBlogProps {
  posts: BlogPost[];
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

export default function BabyKidsBlog({
  posts = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsBlogProps) {
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
        theme={store.theme}
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-20 relative overflow-hidden">
          {/* Playful Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Parenting Articles</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Helpful tips, advice, and inspiration for raising happy, healthy children
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="group relative">
                    {/* Card with Shadow */}
                    <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                    <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Featured Image */}
                      <a href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/400x300/fef7f7/ec4899?text=${encodeURIComponent(post.title)}`}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fef7f7/ec4899?text=${encodeURIComponent(post.title)}`;
                            }}
                          />
                        </div>
                      </a>

                      {/* Content */}
                      <div className="p-6">
                        {/* Category */}
                        {post.category && (
                          <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                            {post.category.name}
                          </span>
                        )}

                        {/* Title */}
                        <a href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                        </a>

                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                          {post.author && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <span>{post.author.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Read More */}
                        <a
                          href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                          className="inline-flex items-center text-pink-500 font-bold hover:text-pink-600 transition-colors duration-300"
                        >
                          Read More
                          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 p-12">
                    <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No Articles Yet</h3>
                    <p className="text-gray-600">
                      We're working on creating helpful parenting content for you. Check back soon!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


      </StoreLayout>
    </>
  );
}