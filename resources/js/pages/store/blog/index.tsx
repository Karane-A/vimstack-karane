import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Calendar, User, ChevronRight, Search } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { getThemeComponents } from '@/config/theme-registry';

// Newsletter Subscribe Component
function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'home-accessories';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(route('api.newsletter.subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          email: email,
          store_slug: storeSlug
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary rounded-xl shadow-md overflow-hidden">
      <div className="p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-white/80 text-sm mb-4">Get the latest posts delivered right to your inbox.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-white/30 bg-white/20 rounded-lg py-3 px-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white backdrop-blur-sm"
            required
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 active:bg-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>
        {isSubmitted && (
          <div className="mt-2 text-xs text-green-200">
            Successfully subscribed!
          </div>
        )}
        {error && (
          <div className="mt-2 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

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

interface BlogIndexProps {
  posts: BlogPost[];
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

export default function BlogIndex({
  posts = [],
  categories = [],
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BlogIndexProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific blog pages to avoid circular dependencies
  const [ThemeBlogPage, setThemeBlogPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeBlogPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeBlogPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let blogPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            blogPageModule = await import('@/pages/store/beauty-cosmetics/BeautyBlog');
            break;
          case 'fashion':
            blogPageModule = await import('@/pages/store/fashion/FashionBlog');
            break;
          case 'electronics':
            blogPageModule = await import('@/pages/store/electronics/ElectronicsBlog');
            break;
          case 'jewelry':
            blogPageModule = await import('@/pages/store/jewelry/JewelryBlog');
            break;
          case 'watches':
            blogPageModule = await import('@/pages/store/watches/WatchesBlog');
            break;
          case 'furniture-interior':
            blogPageModule = await import('@/pages/store/furniture-interior/FurnitureBlog');
            break;
          case 'cars-automotive':
            blogPageModule = await import('@/pages/store/cars-automotive/CarsBlog');
            break;
          case 'baby-kids':
            blogPageModule = await import('@/pages/store/baby-kids/BabyKidsBlog');
            break;
          case 'perfume-fragrances':
            blogPageModule = await import('@/pages/store/perfume-fragrances/PerfumeBlog');
            break;
          default:
            setThemeBlogPage(null);
            setIsLoading(false);
            return;
        }
        setThemeBlogPage(() => blogPageModule.default);
      } catch (error) {
        console.error('Failed to load theme blog page:', error);
        setThemeBlogPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeBlogPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific blog page, use it
  if (ThemeBlogPage) {
    return (
      <ThemeBlogPage
        posts={posts}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }
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
    <>
      <Head title={`Blog - ${store.name}`} />
      
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
        <div className="relative bg-primary text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog</h1>
              <p className="text-lg text-white/80">
                Latest news, tips, and insights from our team
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Blog</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <article 
                      key={post.id} 
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Featured Image */}
                      <Link href={route('store.blog.show', { slug: post.slug, storeSlug })} className="block aspect-video overflow-hidden">
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
                            href={route('store.blog.show', { slug: post.slug, storeSlug })}
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
                          href={route('store.blog.show', { slug: post.slug, storeSlug })}
                          className="inline-flex items-center text-primary font-medium hover:underline"
                        >
                          Read More
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
                
                {/* Empty State */}
                {posts.length === 0 && (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
                    <p className="text-gray-500">Check back later for new content.</p>
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
                            href={route('store.blog', { storeSlug: theme })}
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
                
                {/* Subscribe */}
                <NewsletterSubscribe />
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}