import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { Gem, ArrowLeft } from 'lucide-react';

interface JewelryCustomPageProps {
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

export default function JewelryCustomPage({
  page,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: JewelryCustomPageProps) {
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
        theme={store.theme}
      >
        {/* Luxury Header */}
        <div className="bg-yellow-50 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full shadow-lg mb-8">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">
                {page.title}
              </h1>
              <div className="w-24 h-px bg-yellow-500 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-yellow-200/50 p-12">
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                    fontWeight: '300'
                  }}
                />


              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}