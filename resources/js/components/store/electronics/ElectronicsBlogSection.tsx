import React from 'react';
import { getImageUrl } from '@/utils/image-helper';
import { usePage } from '@inertiajs/react';

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
}

interface ElectronicsBlogSectionProps {
  posts: BlogPost[];
  content?: any;
}

export default function ElectronicsBlogSection({ posts, content }: ElectronicsBlogSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'electronics-demo';
  
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v3a2 2 0 01-2 2H5.828a2 2 0 01-1.414-.586l-1.828-1.828A2 2 0 012 9.172V6a2 2 0 012-2h2v3a2 2 0 002 2h5V7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {content?.title || 'Tech Blog'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content?.description || 'Latest tech reviews, buying guides, and industry insights from our electronics experts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(post.featured_image) || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f1f5f9/475569?text=${encodeURIComponent(post.title)}`;
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <time>{new Date(post.created_at).toLocaleDateString()}</time>
                  {post.author && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{post.author.name}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  <a href={route('store.blog.show', { storeSlug, slug: post.slug })}>{post.title}</a>
                </h3>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <a
                  href={route('store.blog.show', { storeSlug, slug: post.slug })}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                >
                  <span>Read More</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={route('store.blog', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>View All Articles</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}