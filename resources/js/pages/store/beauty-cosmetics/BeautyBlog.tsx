import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BeautyFooter } from '@/components/store/beauty-cosmetics';
import { getImageUrl } from '@/utils/image-helper';

interface BeautyBlogProps {
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
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function BeautyBlog({
  posts = [],
  store = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BeautyBlogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head title={`Beauty Journal - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages.length > 0 ? customPages : undefined}
        customFooter={<BeautyFooter storeName={store.name} logo={store.logo} />}
      >
        {/* Hero Section */}
        <div className="bg-rose-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-light text-gray-900 mb-6">Beauty Journal</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Expert tips, tutorials, and insights to help you discover your perfect beauty routine
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <Link href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                      {/* Featured Image */}
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/400x300/fdf2f8/ec4899?text=${encodeURIComponent(post.title)}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fdf2f8/ec4899?text=${encodeURIComponent(post.title)}`;
                          }}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        {/* Category */}
                        {post.category && (
                          <div className="mb-3">
                            <span className="inline-block bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-medium">
                              {post.category.name}
                            </span>
                          </div>
                        )}
                        
                        {/* Title */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                          {post.title}
                        </h2>
                        
                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{post.author.name}</span>
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-4">No articles yet</h2>
                <p className="text-gray-600">
                  Check back soon for the latest beauty tips and insights
                </p>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}

export default BeautyBlog;