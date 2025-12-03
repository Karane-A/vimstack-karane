import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { Calendar, User, ArrowLeft, Share2, Heart, Tag } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  featured_image?: string;
  created_at: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: {
    name: string;
  };
  tags?: string[];
}

interface ElectronicsBlogPostProps {
  store: any;
  storeContent?: any;
  post: BlogPost;
  relatedPosts?: BlogPost[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function ElectronicsBlogPost({ 
  store, 
  storeContent,
  post, 
  relatedPosts = [], 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsBlogPostProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <>
      <Head title={`${post.title} - ${store.name}`} />
      
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
        <div className="bg-gray-50 min-h-screen">
          {/* Back Navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <a
                href={route('store.blog', store.slug)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </a>
            </div>
          </div>

          {/* Article Header */}
          <article className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Category & Meta */}
                <div className="flex items-center gap-4 mb-6">
                  {post.category && (
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {post.category.name}
                    </span>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time>{new Date(post.created_at).toLocaleDateString()}</time>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Author & Actions */}
                <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      {post.author?.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {post.author?.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500">Tech Writer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                        isLiked 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-semibold">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Share</span>
                    </button>
                  </div>
                </div>

                {/* Featured Image */}
                {post.featured_image && (
                  <div className="mb-12">
                    <img
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      className="w-full h-96 object-cover rounded-2xl shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center';
                      }}
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none mb-12">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedPosts.slice(0, 3).map((relatedPost) => (
                      <article
                        key={relatedPost.id}
                        className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={relatedPost.featured_image ? getImageUrl(relatedPost.featured_image) : 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f1f5f9/475569?text=${encodeURIComponent(relatedPost.title)}`;
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4 mr-2" />
                            <time>{new Date(relatedPost.created_at).toLocaleDateString()}</time>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            <a href={route('store.blog.show', { storeSlug: store.slug, slug: relatedPost.slug })}>
                              {relatedPost.title}
                            </a>
                          </h3>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </StoreLayout>
    </>
  );
}