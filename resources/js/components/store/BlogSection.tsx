import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
  content?: any;
}

export default function BlogSection({
  title = "Latest from Our Blog",
  subtitle = "Read our latest articles and get inspired",
  posts = [],
  content
}: BlogSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content?.title || title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {content?.description || subtitle}
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Featured Image */}
                <Link 
                  href={route('store.blog.show', { storeSlug, slug: post.slug })} 
                  className="block aspect-video overflow-hidden"
                >
                  <img 
                    src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/800x450?text=${encodeURIComponent(post.title)}`}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x450?text=${encodeURIComponent(post.title)}`;
                    }}
                  />
                </Link>
              
              {/* Content */}
              <div className="p-6">
                {/* Category */}
                {post.category && (
                  <span className="inline-block text-xs font-medium text-primary mb-2">
                    {post.category.name}
                  </span>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  <Link 
                    href={route('store.blog.show', { storeSlug, slug: post.slug })}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                {/* Meta */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  
                  {post.author && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author.name}</span>
                    </div>
                  )}
                </div>
                
                {/* Read More Link */}
                <Link 
                  href={route('store.blog.show', { storeSlug, slug: post.slug })}
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        )}
        
        {/* View All Link */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              href={route('store.blog', { storeSlug })}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Articles
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}