import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, User } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface JewelryBlogCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    featured_image?: string;
    created_at?: string;
    published_at?: string;
    author?: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
    };
  };
}

function JewelryBlogCard({ post }: JewelryBlogCardProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry';
  
  return (
    <article className="group bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
      {/* Featured Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/400x300/f5f5f5/d4af37?text=${encodeURIComponent(post.title)}`}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f5f5f5/d4af37?text=${encodeURIComponent(post.title)}`;
          }}
          loading="lazy"
        />
        
        {post.category && (
          <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 text-xs font-medium uppercase rounded">
            {post.category.name}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-3">
          {post.author && (
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-xl text-neutral-900 mb-3 group-hover:text-yellow-700 transition-colors leading-tight">
          <Link href={route('store.blog.show', { storeSlug, slug: post.slug })}>
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt || post.content?.substring(0, 120) + '...'}
        </p>
        
        {/* Read More */}
        <Link
          href={route('store.blog.show', { storeSlug, slug: post.slug })}
          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors"
        >
          <span>Read More</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default JewelryBlogCard;