import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { getImageUrl } from '@/utils/image-helper';

interface FurnitureBlogProps {
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

export default function FurnitureBlog({
  posts = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureBlogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Head title={`Design Journal - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages.length > 0 ? customPages : undefined}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme || 'furniture-interior'}
      >
        <div className="bg-yellow-800 text-white py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Design Journal</h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Interior design insights, furniture trends, and home styling tips
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="container mx-auto px-6 lg:px-12">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="group relative bg-white rounded-3xl shadow-lg shadow-amber-200/30 hover:shadow-2xl hover:shadow-amber-300/40 transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-3">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={post.featured_image ? getImageUrl(post.featured_image) : `/storage/blog/furniture-${post.id || 'default'}.jpg`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/400x250/f5f5dc/8b7355?text=Blog+Post`;
                        }}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      <div className="absolute inset-0 border-4 border-amber-800/20 rounded-lg m-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {post.category && (
                        <div className="absolute top-4 right-4 bg-amber-800 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-md">
                          {post.category.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 bg-gradient-to-b from-white to-amber-50/30">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-amber-700 text-sm font-medium">
                          {formatDate(post.published_at)}
                        </span>
                      </div>

                      <Link
                        href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                        className="block group-hover:text-amber-800 transition-colors duration-300"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-700 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

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
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No articles yet</h2>
                <p className="text-gray-600">
                  Check back soon for the latest design insights and furniture trends
                </p>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}