import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, Clock } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface WatchesBlogProps {
  posts: Array<{
    id: number;
    title: string;
    slug: string;
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
  }>;
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

export default function WatchesBlog({
  posts = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesBlogProps) {
  return (
    <>
      <Head title={`Horological Journal - ${store.name}`} />
      
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
                <div className="mb-6">
                  <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                    Journal
                  </span>
                </div>
                <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                  Horological Journal
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Expert insights into watchmaking, collecting tips, and the latest developments in luxury timepieces
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        {/* Blog Posts */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="group bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Featured Image */}
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={getImageUrl(post.featured_image)}
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
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>

                      {/* Title */}
                      <h3 className="text-xl font-medium text-slate-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors">
                        <Link href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-slate-600 font-light mb-4 leading-relaxed line-clamp-3">
                          {post.excerpt.length > 100 ? `${post.excerpt.substring(0, 100)}...` : post.excerpt}
                        </p>
                      )}

                      {/* Read More */}
                      <Link
                        href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                        className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-amber-500 mx-auto mb-6 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-slate-900" />
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-4">No Articles Yet</h2>
                <p className="text-slate-600 font-light max-w-md mx-auto">
                  Our horological experts are crafting insightful articles about luxury timepieces. Check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}