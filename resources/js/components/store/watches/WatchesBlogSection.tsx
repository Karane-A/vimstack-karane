import React from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  created_at: string;
  category?: {
    name: string;
  };
}

interface WatchesBlogSectionProps {
  posts: BlogPost[];
  content?: any;
}

export default function WatchesBlogSection({ posts, content }: WatchesBlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const { props } = usePage();
  const storeSlug = props.store?.slug;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Horological Journal'}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Expert insights into watchmaking, collecting tips, and the latest developments in the world of luxury timepieces.'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article key={post.id} className="group bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Featured Image */}
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/400x250/1e293b/ffffff?text=${encodeURIComponent(post.title)}`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/400x250/1e293b/ffffff?text=${encodeURIComponent(post.title)}`;
                  }}
                />
                {post.category && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-wider">
                    {post.category.name}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Date */}
                <time className="text-sm text-slate-500 font-light mb-3 block">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>

                {/* Title */}
                <h3 className="text-xl font-medium text-slate-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors">
                  <a href={route('store.blog.show', { storeSlug, slug: post.slug })}>
                    {post.title}
                  </a>
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-slate-600 font-light mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt.length > 100 ? `${post.excerpt.substring(0, 100)}...` : post.excerpt}
                  </p>
                )}

                {/* Read More */}
                <a
                  href={route('store.blog.show', { storeSlug, slug: post.slug })}
                  className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        {posts.length > 3 && (
          <div className="text-center mt-16">
            <a
              href={route('store.blog', storeSlug)}
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white font-medium tracking-wider uppercase text-sm hover:bg-slate-800 transition-colors duration-300"
            >
              View All Articles
              <svg className="w-4 h-4 ml-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}