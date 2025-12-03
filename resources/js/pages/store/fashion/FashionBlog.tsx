import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Calendar, User } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface FashionBlogProps {
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

export default function FashionBlog({
  posts = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionBlogProps) {


  return (
    <>
      <Head title={`Style Journal - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages.length > 0 ? customPages : undefined}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-thin tracking-wide mb-6">Style Journal</h1>
              <p className="text-white/70 font-light text-lg">
                Fashion insights, trends, and inspiration
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {posts.map((post) => (
                  <article key={post.id} className="group">
                    <Link href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                      <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-100">
                        <img
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/f5f5f5/666666?text=${encodeURIComponent(post.title)}`;
                          }}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        {post.category && (
                          <div className="text-xs uppercase tracking-wider text-gray-500 font-light">
                            {post.category.name}
                          </div>
                        )}
                        
                        <h2 className="text-2xl font-light leading-tight group-hover:text-gray-600 transition-colors duration-300">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 font-light leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="font-light">{post.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-light">
                              {new Date(post.published_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <span className="text-xs uppercase tracking-wider text-black hover:text-gray-600 transition-colors duration-300 font-medium">
                            Read More
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-thin text-gray-900 mb-4">No articles yet</h2>
                <p className="text-gray-600 font-light">
                  Check back soon for the latest fashion insights and trends
                </p>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}