import React from 'react';
import { getImageUrl } from '@/utils/image-helper';
import { usePage } from '@inertiajs/react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  author: {
    name: string;
  };
}

interface FashionBlogSectionProps {
  posts?: BlogPost[];
  content?: any;
}

export default function FashionBlogSection({ posts = [], content }: FashionBlogSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-demo';
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-thin mb-6 tracking-wide text-black">
            {content?.title || 'Style Journal'}
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg leading-relaxed">
            {content?.description || 'Fashion insights, styling tips, and trend forecasts from industry experts and influencers.'}
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <article key={post.id} className="group">
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-100">
                  <img
                    src={getImageUrl(post.featured_image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x450/f5f5f5/666666?text=${encodeURIComponent(post.title)}`;
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-light">
                    {new Date(post.published_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <h3 className="text-xl font-light leading-tight group-hover:text-gray-600 transition-colors duration-300">
                    <a href={route('store.blog.show', { storeSlug, slug: post.slug })}>
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 font-light text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-2">
                    <a 
                      href={route('store.blog.show', { storeSlug, slug: post.slug })}
                      className="text-xs uppercase tracking-wider text-black hover:text-gray-600 transition-colors duration-300 font-medium"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 font-light">No blog posts available.</p>
          </div>
        )}
      </div>
    </section>
  );
}