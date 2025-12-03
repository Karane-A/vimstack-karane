import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface FurnitureBlogSectionProps {
  posts?: any[];
  content?: any;
}

function FurnitureBlogSection({ posts = [], content }: FurnitureBlogSectionProps) {
  const { props } = usePage();
  const store = props.store || {};
  
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 bg-amber-100 border-2 border-amber-300 px-6 py-3 rounded-full mb-6 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-bold text-amber-800 tracking-wider uppercase">Design Insights</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
            {content?.title || 'Design Journal'}
          </h2>
          <p className="text-lg lg:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            {content?.description || 'Wooden furniture inspiration, interior design trends, and expert tips for creating beautiful, functional living spaces.'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.slice(0, 3).map((post) => (
              <article key={post.id} className="group relative bg-white rounded-3xl shadow-lg shadow-amber-200/30 hover:shadow-2xl hover:shadow-amber-300/40 transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-3">
                {/* Image with wooden frame effect */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getImageUrl(post.featured_image) || `/storage/blog/furniture-${post.id || 'default'}.jpg`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Wooden frame overlay */}
                  <div className="absolute inset-0 border-4 border-amber-800/20 rounded-lg m-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category badge on image */}
                  {post.category && (
                    <div className="absolute top-4 right-4 bg-amber-800 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-md">
                      {post.category.name}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-white to-amber-50/30">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-amber-700 text-sm font-medium">
                      {new Date(post.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                    className="block group-hover:text-amber-800 transition-colors duration-300"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-slate-700 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt || post.description || 'Discover the latest wooden furniture trends and expert tips for creating beautiful interior spaces that reflect your personal style.'}
                  </p>

                  {/* Read More Button */}
                  <Link
                    href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                    className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm px-4 py-2 rounded-xl transition-all duration-300 group/link shadow-md hover:shadow-lg"
                  >
                    <span>Read More</span>
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          // Placeholder blog posts when no data
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Modern Living Room Design Trends 2024',
                category: 'Living Room',
                excerpt: 'Discover the latest trends in modern living room design, from minimalist furniture to bold accent pieces that make a statement.'
              },
              {
                title: 'Creating a Cozy Bedroom Sanctuary',
                category: 'Bedroom',
                excerpt: 'Transform your bedroom into a peaceful retreat with our expert tips on color schemes, lighting, and furniture selection.'
              },
              {
                title: 'Sustainable Furniture: Style Meets Responsibility',
                category: 'Sustainability',
                excerpt: 'Learn how to choose eco-friendly furniture options that don\'t compromise on style or quality for your home.'
              }
            ].map((post, index) => (
              <article key={index} className="group relative bg-white rounded-3xl shadow-lg shadow-amber-200/30 hover:shadow-2xl hover:shadow-amber-300/40 transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-3">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-amber-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-amber-700 text-sm font-semibold">Design Article</p>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-amber-800 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-md">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-b from-white to-amber-50/30">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-amber-700 text-sm font-medium">
                      {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm px-4 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                    <span>Read More</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Blog Button */}
        <div className="text-center">
          <Link
            href={route('store.blog', store.slug)}
            className="inline-flex items-center gap-3 bg-yellow-800 text-white px-12 py-5 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 group shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 text-lg"
          >
            <span>View All Articles</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FurnitureBlogSection;