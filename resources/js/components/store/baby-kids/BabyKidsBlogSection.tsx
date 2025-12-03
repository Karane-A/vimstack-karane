import React from 'react';
import { Link } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  featured_image?: string;
  created_at: string;
  author?: string;
}

interface BabyKidsBlogSectionProps {
  posts?: BlogPost[];
  content?: any;
  storeSlug?: string;
}

export default function BabyKidsBlogSection({ posts = [], content, storeSlug }: BabyKidsBlogSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {content?.title || 'Parenting Tips'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {content?.description || 'Helpful advice and inspiration for raising happy, healthy children.'}
          </p>
        </div>

        {/* Simple 2-Column Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Featured Post */}
            <div>
              {posts.length > 0 ? (
                <article className="group relative bg-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <a href={route('store.blog.show', { storeSlug, slug: posts[0].slug })}>
                    <img
                      src={getImageUrl(posts[0].featured_image || posts[0].image)}
                      alt={posts[0].title}
                      className="w-full h-48 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 mb-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fef7f7/ec4899?text=${encodeURIComponent(posts[0].title)}`;
                      }}
                    />
                  </a>
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-4">
                    Featured
                  </div>
                  <a href={route('store.blog.show', { storeSlug, slug: posts[0].slug })}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                      {posts[0].title}
                    </h3>
                  </a>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{formatDate(posts[0].created_at)}</span>
                    <a
                      href={route('store.blog.show', { storeSlug, slug: posts[0].slug })}
                      className="text-pink-500 font-semibold hover:text-pink-600 transition-colors duration-300"
                    >
                      {content?.read_more_text || 'Read More'} →
                    </a>
                  </div>
                </article>
              ) : (
                <article className="group relative bg-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src="https://placehold.co/400x300/fef7f7/ec4899?text=Featured+Post"
                    alt="Featured Post"
                    className="w-full h-48 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 mb-6"
                  />
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-4">
                    Featured
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                    Essential Baby Care Tips for New Parents
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover helpful tips and advice for caring for your little ones with comfort, safety, and style in mind.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mar 15</span>
                    <div className="text-pink-500 font-semibold">
                      Read More →
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* Right Small Posts */}
            <div className="space-y-6">
              {posts.length > 1 ? posts.slice(1, 3).map((post, index) => (
                <article key={post.id} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-pink-200">
                  <a href={route('store.blog.show', { storeSlug, slug: post.slug })}>
                    <img
                      src={getImageUrl(post.featured_image || post.image)}
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/300x200/fef7f7/ec4899?text=${encodeURIComponent(post.title)}`;
                      }}
                    />
                  </a>
                  <a href={route('store.blog.show', { storeSlug, slug: post.slug })}>
                    <h4 className="font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h4>
                  </a>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{formatDate(post.created_at)}</span>
                    <a
                      href={route('store.blog.show', { storeSlug, slug: post.slug })}
                      className="text-pink-500 font-semibold hover:text-pink-600 transition-colors duration-300"
                    >
                      {content?.read_text || 'Read'} →
                    </a>
                  </div>
                </article>
              )) : (
                [...Array(2)].map((_, index) => (
                  <article key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-pink-200">
                    <img
                      src={`https://placehold.co/300x200/fef7f7/ec4899?text=Article+${index + 2}`}
                      alt={`Parenting Article ${index + 2}`}
                      className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <h4 className="font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                      {index === 0 ? 'Choosing Safe Clothes for Toddlers' : 'Building Your Baby\'s Wardrobe'}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Mar {10 + index}</span>
                      <div className="text-pink-500 font-semibold">
                        Read →
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <a
            href={route('store.blog', { storeSlug })}
            className="inline-flex items-center px-8 py-4 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 shadow-lg"
          >
            <span>{content?.view_all_text || 'View All Articles'}</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}