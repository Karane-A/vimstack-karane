import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  published_at: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: {
    name: string;
  };
  reading_time?: number;
}

interface BeautyBlogSectionProps {
  posts?: BlogPost[];
  content?: any;
}

export default function BeautyBlogSection({ posts = [], content }: BeautyBlogSectionProps) {
  const { props } = usePage();
  const store = props.store || {};
  const displayPosts = posts.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            {content?.title || 'Beauty Journal'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Expert tips, tutorials, and insights to help you discover your perfect beauty routine.'}
          </p>
        </div>

        {displayPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <article 
                  key={post.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Featured Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/400x300/fdf2f8/ec4899?text=${encodeURIComponent(post.title)}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fdf2f8/ec4899?text=${encodeURIComponent(post.title)}`;
                      }}
                    />
                    
                    {/* Category Badge */}
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-rose-600">
                        {post.category.name}
                      </div>
                    )}

                    {/* Reading Time */}
                    {post.reading_time && (
                      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                        {post.reading_time} min read
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Meta */}
                    <div className="flex items-center space-x-4 mb-4">
                      {post.author && (
                        <div className="flex items-center space-x-2">
                          {post.author.avatar ? (
                            <img
                              src={getImageUrl(post.author.avatar)}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-rose-600">
                                {post.author.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-600">{post.author.name}</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{formatDate(post.published_at)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                      <Link href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read More Link */}
                    <Link 
                      href={route('store.blog.show', { storeSlug: store.slug, slug: post.slug })}
                      className="inline-flex items-center text-rose-600 font-medium hover:text-rose-700 transition-colors duration-300"
                    >
                      <span>Read Article</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link 
                href={route('store.blog', store.slug)} 
                className="inline-flex items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>View All Articles</span>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No blog posts available</p>
          </div>
        )}
      </div>
    </section>
  );
}