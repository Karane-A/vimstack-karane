import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

interface CarsCustomPageProps {
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

export default function CarsCustomPage({
  page,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsCustomPageProps) {
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
        {/* Unique Automotive Header */}
        <div className="bg-gray-900 text-white py-8 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <div className="w-6 h-6 bg-white transform -rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-wider">{page.title}</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Information Center</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Unique Split Layout Content */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              {/* Main Content Area */}
              <div>
                <div className="bg-gray-50 border-l-8 border-red-600 p-12">
                  {/* Content Header */}
                  <div className="mb-8 pb-6 border-b-2 border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-2 h-2 bg-red-600 rotate-45"></div>
                      <div className="text-red-600 font-bold tracking-widest uppercase text-sm">Content</div>
                      <div className="flex-1 h-px bg-red-600"></div>
                    </div>
                  </div>

                  {/* Dynamic Content */}
                  <div className="bg-white p-8 border border-gray-200">
                    <div 
                      className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: page.content }}
                      style={{
                        fontSize: '1.125rem',
                        lineHeight: '1.8',
                        fontWeight: '400'
                      }}
                    />
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