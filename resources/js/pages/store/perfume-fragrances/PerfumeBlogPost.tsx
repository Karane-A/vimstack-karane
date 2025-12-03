import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { PerfumeFooter } from '@/components/store/perfume-fragrances';
import { getImageUrl } from '@/utils/image-helper';

interface PerfumeBlogPostProps {
  store: any;
  post: any;
  relatedPosts?: any[];
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

export default function PerfumeBlogPost({
  store = {},
  post = {},
  relatedPosts = [],
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeBlogPostProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head title={`${post.title || 'Blog Post'} - ${store.name}`} />
      
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
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <Link
                  href={route('store.blog', store.slug)}
                  className="inline-flex items-center text-purple-800 hover:text-purple-900 font-medium transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Blog
                </Link>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                {post.title || 'Blog Post Title'}
              </h1>
              
              <div className="flex items-center justify-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(post.created_at)}
                </div>
                
                {post.read_time && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {post.read_time} min read
                  </div>
                )}
                
                {post.category && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-purple-800">{post.category.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_image && (
          <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={getImageUrl(post.featured_image)}
                    alt={post.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x400/fafaf9/7c3aed?text=${encodeURIComponent(post.title)}`;
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-3">
                  {post.content ? (
                    <div 
                      className="prose prose-lg max-w-none prose-purple prose-headings:text-purple-800 prose-links:text-purple-800 prose-strong:text-purple-800"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-light text-gray-900 mb-4">Content Coming Soon</h3>
                      <p className="text-gray-600">This article is being prepared with exclusive insights.</p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-8">
                    


                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                      <div className="bg-stone-50 rounded-2xl p-6">
                        <h3 className="text-lg font-medium text-purple-800 mb-4">Related Articles</h3>
                        <div className="space-y-4">
                          {relatedPosts.slice(0, 3).map((relatedPost) => (
                            <Link
                              key={relatedPost.id}
                              href={`/${store.slug}/blog/${relatedPost.slug}`}
                              className="block group"
                            >
                              <div className="flex space-x-3">
                                <img
                                  src={getImageUrl(relatedPost.featured_image)}
                                  alt={relatedPost.title}
                                  className="w-16 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/80x60/fafaf9/7c3aed?text=${encodeURIComponent(relatedPost.title)}`;
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-800 transition-colors duration-300 line-clamp-2">
                                    {relatedPost.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(relatedPost.created_at)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}