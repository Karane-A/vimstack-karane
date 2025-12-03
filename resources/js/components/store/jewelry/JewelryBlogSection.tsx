import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import JewelryBlogCard from './JewelryBlogCard';

interface JewelryBlogSectionProps {
  posts?: any[];
  content?: any;
}

export default function JewelryBlogSection({ posts = [], content }: JewelryBlogSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry';
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
            {content?.title || 'Latest Articles'}
          </h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {content?.description || 'Discover insights, trends, and stories from the world of luxury jewelry.'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <JewelryBlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Blog */}
        <div className="text-center mt-12">
          <Link
            href={route('store.blog', { storeSlug })}
            className="inline-flex items-center bg-yellow-600 text-white px-8 py-4 font-medium hover:bg-yellow-700 transition-colors"
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