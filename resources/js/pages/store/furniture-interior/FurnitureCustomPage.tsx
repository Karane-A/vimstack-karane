import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

interface FurnitureCustomPageProps {
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

export default function FurnitureCustomPage({
  page,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureCustomPageProps) {
  return (
    <>
      <Head title={`${page.title} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages.length > 0 ? customPages : undefined}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme || 'furniture-interior'}
      >
        <div className="bg-yellow-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
              <div className="w-16 h-0.5 bg-amber-200 mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-amber-100">
                <div 
                  className="prose prose-lg max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}