import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, Tag, ChevronRight, MessageSquare, Facebook, Twitter, Linkedin, Search } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';


interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  views: number;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface BlogDetailProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  recentPosts: BlogPost[];
  categories: Array<{
    id: number;
    name: string;
    posts_count: number;
  }>;
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function BlogDetail({
  post,
  relatedPosts = [],
  recentPosts = [],
  categories = [],
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BlogDetailProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific blog post pages to avoid circular dependencies
  const [ThemeBlogPostPage, setThemeBlogPostPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeBlogPostPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeBlogPostPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let blogPostPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            blogPostPageModule = await import('@/pages/store/beauty-cosmetics/BeautyBlogPost');
            break;
          case 'fashion':
            blogPostPageModule = await import('@/pages/store/fashion/FashionBlogPost');
            break;
          case 'electronics':
            blogPostPageModule = await import('@/pages/store/electronics/ElectronicsBlogPost');
            break;
          case 'jewelry':
            blogPostPageModule = await import('@/pages/store/jewelry/JewelryBlogPost');
            break;
          case 'watches':
            blogPostPageModule = await import('@/pages/store/watches/WatchesBlogPost');
            break;
          case 'furniture-interior':
            blogPostPageModule = await import('@/pages/store/furniture-interior/FurnitureBlogPost');
            break;
          case 'cars-automotive':
            blogPostPageModule = await import('@/pages/store/cars-automotive/CarsBlogPost');
            break;
          case 'baby-kids':
            blogPostPageModule = await import('@/pages/store/baby-kids/BabyKidsBlogPost');
            break;
          case 'perfume-fragrances':
            blogPostPageModule = await import('@/pages/store/perfume-fragrances/PerfumeBlogPost');
            break;
          default:
            setThemeBlogPostPage(null);
            setIsLoading(false);
            return;
        }
        setThemeBlogPostPage(() => blogPostPageModule.default);
      } catch (error) {
        console.error('Failed to load theme blog post page:', error);
        setThemeBlogPostPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeBlogPostPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific blog post page, use it
  if (ThemeBlogPostPage) {
    return (
      <ThemeBlogPostPage
        post={post}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }
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
        {/* Hero Section */}
        <div className="relative">
          <div className="h-64 md:h-96 w-full bg-primary overflow-hidden">
            <img 
              src={post.featured_image ? getImageUrl(post.featured_image) : `https://placehold.co/1200x600?text=${encodeURIComponent(post.title)}`}
              alt={post.title}
              className="w-full h-full object-cover opacity-50"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/1200x600?text=${encodeURIComponent(post.title)}`;
              }}
            />
            <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto">{post.title}</h1>
              
              <div className="flex flex-wrap justify-center items-center text-sm gap-4">
                {post.category && (
                  <span className="bg-white text-primary px-2 py-1 rounded-md text-xs font-medium">
                    {post.category.name}
                  </span>
                )}
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                
                {post.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author.name}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug: store.slug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <Link href={route('store.blog', { storeSlug: store.slug })} className="text-gray-500 hover:text-primary">Blog</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium truncate max-w-[200px]">{post.title}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <article className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 md:p-8">
                    {/* Content */}
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag className="h-5 w-5 text-gray-500" />
                          {post.tags.map(tag => (
                            <Link 
                              key={tag.id}
                              href={route('store.blog', { storeSlug: store.slug })}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
                              preserveScroll
                            >
                              {tag.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Share */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium mr-4">Share:</span>
                        <div className="flex gap-2">
                          <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                            aria-label="Share on Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                          <a 
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors"
                            aria-label="Share on Twitter"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                          <a 
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
                            aria-label="Share on LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
                
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {relatedPosts.map(relatedPost => (
                        <Link 
                          key={relatedPost.id}
                          href={route('store.blog.show', { storeSlug: store.slug, slug: relatedPost.slug })}
                          className="group"
                        >
                          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                            <div className="aspect-video overflow-hidden">
                              <img 
                                src={relatedPost.featured_image ? getImageUrl(relatedPost.featured_image) : `https://placehold.co/600x400?text=${encodeURIComponent(relatedPost.title)}`}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/600x400?text=${encodeURIComponent(relatedPost.title)}`;
                                }}
                              />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">{relatedPost.excerpt}</p>
                              <div className="text-xs text-gray-500 mt-auto">
                                {formatDate(relatedPost.published_at)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Search */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Search</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {categories.map(category => (
                        <li key={category.id}>
                          <Link 
                            href={route('store.blog', { storeSlug: store.slug })}
                            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                            preserveScroll
                          >
                            <span className="text-gray-700 hover:text-primary transition-colors">
                              {category.name}
                            </span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {category.posts_count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Recent Posts */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {recentPosts.map(recentPost => (
                        <Link 
                          key={recentPost.id}
                          href={route('store.blog.show', { storeSlug: store.slug, slug: recentPost.slug })}
                          className="flex gap-3 group"
                        >
                          <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                            <img 
                              src={recentPost.featured_image ? getImageUrl(recentPost.featured_image) : `https://placehold.co/100x100?text=${encodeURIComponent(recentPost.title.substring(0, 1))}`}
                              alt={recentPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/100x100?text=${encodeURIComponent(recentPost.title.substring(0, 1))}`;
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {recentPost.title}
                            </h4>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(recentPost.published_at)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Subscribe */}
                <div className="bg-primary rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
                    <p className="text-white/80 text-sm mb-4">Get the latest posts delivered right to your inbox.</p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full border border-white/20 bg-white/10 rounded-md py-2 px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                      <button className="w-full bg-white text-primary font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}