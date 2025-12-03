import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import JewelryBlogCard from '@/components/store/jewelry/JewelryBlogCard';
import { Gem, Search } from 'lucide-react';

interface JewelryBlogProps {
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

export default function JewelryBlog({
  posts = [],
  store = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: JewelryBlogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head title={`Jewelry Journal - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        customFooter={<JewelryFooter storeName={store.name} logo={store.logo} />}
      >
        {/* Hero Section */}
        <div className="bg-yellow-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full shadow-xl mb-6">
                <Gem className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-3 tracking-wide">
                Jewelry Journal
              </h1>
              <p className="text-gray-600 font-light text-lg max-w-xl mx-auto leading-relaxed mb-6">
                Discover insights, trends, and stories from the world of luxury jewelry
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-yellow-600 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <JewelryBlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                  <Search className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-serif text-neutral-900 mb-4">
                  {searchTerm ? 'No articles found' : 'No articles yet'}
                </h2>
                <p className="text-neutral-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Check back soon for the latest jewelry insights and stories'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-yellow-600 text-white px-6 py-3 font-medium hover:bg-yellow-700 transition-colors rounded-lg"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-yellow-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl font-serif text-neutral-900 mb-4">
                Stay Updated
              </h3>
              <div className="w-16 h-1 bg-yellow-600 mx-auto mb-6"></div>
              <p className="text-neutral-600 mb-8">
                Subscribe to our newsletter for the latest jewelry trends, care tips, and exclusive insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-yellow-600 transition-colors"
                />
                <button className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}