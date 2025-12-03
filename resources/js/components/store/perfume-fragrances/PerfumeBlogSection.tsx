import React from 'react';
import { Link } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface PerfumeBlogSectionProps {
  posts?: any[];
  content?: any;
  storeSlug?: string;
}

export default function PerfumeBlogSection({ posts = [], content, storeSlug }: PerfumeBlogSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-purple-50 rounded-full mb-6">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            <span className="text-purple-800 text-sm font-medium">Latest Stories</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
            {content?.title || 'Fragrance Journal'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {content?.description || 'Dive into the art of perfumery with expert insights and fragrance stories.'}
          </p>
        </div>

        {/* Blog Categories */}
        {content?.categories && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {content.categories.map((category, index) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case 'sparkles':
                    return (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                    );
                  case 'heart':
                    return (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    );
                  case 'star':
                    return (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    );
                  default:
                    return (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    );
                }
              };
              
              return (
                <div key={index} className="text-center p-6 bg-stone-50 rounded-2xl hover:bg-purple-50 transition-colors duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 text-purple-800">
                      {getIcon(category.icon)}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            {/* Featured Post */}
            {posts[0] && (
              <div className="mb-16">
                <Link
                  href={route('store.blog.show', { storeSlug, slug: posts[0].slug })}
                  className="group block"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative overflow-hidden rounded-3xl">
                      <img
                        src={getImageUrl(posts[0].featured_image) || `https://placehold.co/600x400/fafaf9/7c3aed?text=${encodeURIComponent(posts[0].title)}`}
                        alt={posts[0].title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {posts[0].category && (
                        <div className="absolute top-4 left-4 bg-amber-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {posts[0].category.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <time>{formatDate(posts[0].created_at)}</time>
                        <span>•</span>
                        <span>{posts[0].read_time || '5'} min read</span>
                      </div>
                      
                      <h3 className="text-3xl font-light text-gray-900 group-hover:text-purple-800 transition-colors duration-300">
                        {posts[0].title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {posts[0].excerpt || posts[0].content?.substring(0, 200) + '...'}
                      </p>
                      
                      <div className="inline-flex items-center text-purple-800 font-medium group-hover:text-purple-900 transition-colors duration-300">
                        <span>Read Article</span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Other Posts - Horizontal Cards */}
            {posts.slice(1, 4).length > 0 && (
              <div className="space-y-8">
                {posts.slice(1, 4).map((post) => (
                  <Link
                    key={post.id}
                    href={route('store.blog.show', { storeSlug, slug: post.slug })}
                    className="group block"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6 bg-stone-50 rounded-2xl hover:bg-purple-50 transition-colors duration-300">
                      
                      {/* Image */}
                      <div className="md:w-48 flex-shrink-0">
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={getImageUrl(post.featured_image) || `https://placehold.co/300x200/fafaf9/7c3aed?text=${encodeURIComponent(post.title)}`}
                            alt={post.title}
                            className="w-full h-32 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <time>{formatDate(post.created_at)}</time>
                          <span>•</span>
                          <span>{post.read_time || '3'} min read</span>
                          {post.category && (
                            <>
                              <span>•</span>
                              <span className="text-purple-600">{post.category.name}</span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-purple-800 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {post.excerpt || post.content?.substring(0, 120) + '...'}
                        </p>
                        
                        <div className="inline-flex items-center text-purple-800 text-sm font-medium group-hover:text-purple-900 transition-colors duration-300">
                          <span>Continue Reading</span>
                          <svg className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link
            href={route('store.blog', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
          >
            <span>View All Articles</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}