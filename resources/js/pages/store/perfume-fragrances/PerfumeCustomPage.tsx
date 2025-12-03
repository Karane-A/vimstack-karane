import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { PerfumeFooter } from '@/components/store/perfume-fragrances';

interface PerfumeCustomPageProps {
  store: any;
  page: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function PerfumeCustomPage({
  store = {},
  page = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeCustomPageProps) {
  return (
    <>
      <Head title={`${page.title || 'Page'} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeId={store.id}
        customFooter={<PerfumeFooter storeName={store.name} logo={store.logo} content={storeContent?.footer} />}
      >
        {/* Hero Section */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                {page.title || 'Page Title'}
              </h1>
              
              {page.excerpt && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                  {page.excerpt}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {page.content ? (
                <div 
                  className="prose prose-lg max-w-none prose-purple prose-headings:text-purple-800 prose-links:text-purple-800 prose-strong:text-purple-800"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 mb-4">Content Coming Soon</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This page is being prepared with exclusive content. Please check back soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}