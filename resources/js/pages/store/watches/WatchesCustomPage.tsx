import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

interface WatchesCustomPageProps {
  page: {
    id: number;
    title: string;
    content: string;
    slug: string;
  };
  store: any;
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

export default function WatchesCustomPage({
  page,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesCustomPageProps) {
  return (
    <>
      <Head title={`${page.title} - ${store.name}`} />
      
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
        {/* Hero Header */}
        <section className="relative h-96 flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="mb-6">
                  <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                    Information
                  </span>
                </div>
                <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                  {page.title}
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Essential information crafted with precision for our valued clientele
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        {/* Content Section */}
        <div className="bg-white">
          <section className="py-16 pb-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="prose prose-slate max-w-none font-light leading-relaxed text-slate-600 mb-8"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}