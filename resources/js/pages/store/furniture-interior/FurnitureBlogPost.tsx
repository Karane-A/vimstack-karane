import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface FurnitureBlogPostProps {
  post: {
    id: number;
    title: string;
    content: string;
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
  };
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

export default function FurnitureBlogPost({
  post,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureBlogPostProps) {
  return (
    <>
      <Head title={`${post.title} - ${store.name}`} />
      
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
        <div className="bg-yellow-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link
                href={route('store.blog', { storeSlug: store.slug })}
                className="inline-flex items-center text-amber-200 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Blog
              </Link>
              
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center justify-center space-x-6 text-amber-200">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
                {post.featured_image && (
                  <div className="aspect-video">
                    <img
                      src={post.featured_image ? getImageUrl(post.featured_image) : `/storage/blog/furniture-${post.id || 'default'}.jpg`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/800x400/f5f5dc/8b7355?text=Blog+Post`;
                      }}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8 lg:p-12">
                  {post.category && (
                    <div className="mb-6">
                      <span className="inline-block bg-yellow-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category.name}
                      </span>
                    </div>
                  )}
                  
                  {post.excerpt && (
                    <div className="text-lg text-slate-600 mb-8 leading-relaxed">
                      {post.excerpt}
                    </div>
                  )}
                  
                  <div 
                    className="prose prose-lg max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}