import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
  featured_image?: string;
  created_at: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
  };
  tags?: string[];
}

interface ElectronicsBlogProps {
  store: any;
  storeContent?: any;
  posts: BlogPost[];
  categories?: any[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function ElectronicsBlog({ 
  store, 
  storeContent,
  posts, 
  categories = [], 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsBlogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head title={`Tech Blog - ${store.name}`} />
      
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
          {/* Hero Section */}
          <section className="bg-slate-900 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Tag className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold mb-6">Tech Blog</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Stay updated with the latest technology trends, product reviews, and industry insights
              </p>
            </div>
          </section>

          {/* Search & Filter Section */}
          <section className="py-12 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-semibold">Filter by:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      {/* Post Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featured_image ? getImageUrl(post.featured_image) : 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f1f5f9/475569?text=${encodeURIComponent(post.title)}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {post.category.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="p-6">
                        {/* Meta Info */}
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="w-4 h-4 mr-2" />
                          <time>{new Date(post.created_at).toLocaleDateString()}</time>
                          {post.author && (
                            <>
                              <span className="mx-2">•</span>
                              <User className="w-4 h-4 mr-1" />
                              <span>{post.author.name}</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          <a href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                            {post.title}
                          </a>
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Read More Link */}
                        <a
                          href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 group"
                        >
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h3>
                  <p className="text-gray-600 mb-8">
                    {searchTerm || selectedCategory 
                      ? "Try adjusting your search or filter criteria" 
                      : "No blog posts are available at the moment"}
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}