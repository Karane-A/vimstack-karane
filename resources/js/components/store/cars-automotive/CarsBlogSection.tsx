import React from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, User, ArrowRight, ChevronRight, Wrench, Zap, Settings } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  created_at: string;
  author?: {
    name: string;
  };
}

interface BlogContent {
  title?: { value: string };
  description?: { value: string };
}

interface CarsBlogSectionProps {
  posts: BlogPost[];
  content?: BlogContent;
  storeSlug?: string;
}

export default function CarsBlogSection({ posts, content, storeSlug }: CarsBlogSectionProps) {
  const blogContent = content || {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const iconMap = {
    wrench: Wrench,
    zap: Zap,
    settings: Settings,
  };

  const categories = blogContent.categories || [
    { icon: 'wrench', title: 'Installation Guides', description: 'Step-by-step tutorials for DIY enthusiasts' },
    { icon: 'zap', title: 'Performance Tips', description: 'Expert advice on maximizing your vehicle\'s potential' },
    { icon: 'settings', title: 'Industry News', description: 'Latest trends and innovations in automotive' }
  ];

  return (
    <section className="py-20 bg-gray-50 text-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">

          <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
            {blogContent.title || 'Auto Journal'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {blogContent.description || 'Expert insights, installation guides, and the latest automotive trends.'}
          </p>
        </div>

        {/* Blog Posts - Magazine Style */}
        {posts.length > 0 ? (
          <div className="mb-16">
            {/* Featured Post */}
            {posts[0] && (
              <div className="mb-12">
                <Link href={route('store.blog.show', { storeSlug, slug: posts[0].slug })}>
                  <article className="group relative bg-white border-2 border-gray-200 hover:border-red-600 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                      <img
                        src={getImageUrl(posts[0].featured_image) || `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                        alt={posts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 font-bold text-sm">
                        FEATURED
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-12 flex flex-col justify-center">
                      <div className="flex items-center text-red-600 text-sm font-bold mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(posts[0].created_at)}
                        {posts[0].author && (
                          <>
                            <span className="mx-3">•</span>
                            <User className="h-4 w-4 mr-2" />
                            {posts[0].author.name}
                          </>
                        )}
                      </div>
                      
                      <h3 className="text-3xl font-black text-black mb-6 leading-tight group-hover:text-red-600 transition-colors">
                        {posts[0].title}
                      </h3>
                      
                      {posts[0].excerpt && (
                        <p className="text-gray-600 mb-8 leading-relaxed">
                          {posts[0].excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center text-red-600 font-bold tracking-wider uppercase group-hover:translate-x-2 transition-transform">
                        Read Full Story
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </div>
                    </div>
                  </div>
                  </article>
                </Link>
              </div>
            )}

            {/* Other Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.slice(1, 5).map((post) => (
                <Link key={post.id} href={route('store.blog.show', { storeSlug, slug: post.slug })}>
                  <article className="group bg-white border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-32">
                  <div className="flex h-full">
                    {/* Image */}
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(post.featured_image) || `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="text-red-600 text-xs font-bold mb-2">
                        {formatDate(post.created_at)}
                      </div>
                      
                      <h4 className="text-lg font-black text-black mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {post.title}
                      </h4>
                      
                      <div className="flex items-center text-red-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </div>
                    </div>
                  </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 mb-16">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">No Blog Posts</h3>
              <p className="text-gray-400">Blog posts will appear here once they are published.</p>
            </div>
          </div>
        )}

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Wrench;
            return (
              <div key={index} className="text-center p-8 bg-white border-2 border-gray-200 hover:border-red-600 hover:bg-red-600 transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 bg-red-600 group-hover:bg-black rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-black text-black group-hover:text-white mb-2 transition-colors">{category.title}</h3>
                <p className="text-gray-600 group-hover:text-white text-sm transition-colors">{category.description}</p>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {posts.length > 0 && (
          <div className="text-center">
            <Link
              href={route('store.blog', storeSlug)}
              className="inline-flex items-center px-8 py-4 bg-black hover:bg-red-600 text-white font-bold tracking-wider uppercase transition-colors transform hover:scale-105"
            >
              View All Articles
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}