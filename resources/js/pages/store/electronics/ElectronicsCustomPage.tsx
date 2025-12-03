import React from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { FileText } from 'lucide-react';

interface CustomPage {
  id: number;
  name: string;
  content: string;
  slug: string;
}

interface ElectronicsCustomPageProps {
  store: any;
  page: CustomPage;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function ElectronicsCustomPage({ 
  store, 
  page, 
  storeContent,
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsCustomPageProps) {
  return (
    <>
      <Head title={`${page.name} - ${store.name}`} />
      
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
        <div className="bg-gray-50 min-h-screen">
          {/* Page Header */}
          <section className="bg-slate-900 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold mb-6">{page.name}</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Important information and policies for our valued customers
              </p>
            </div>
          </section>

          {/* Page Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                  </div>

                  {/* Contact Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Need More Information?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        If you have any questions about this page or need additional clarification, 
                        our customer support team is here to help.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                          Contact Support
                        </a>
                        <a
                          href={route('store.home', store.slug)}
                          className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300"
                        >
                          Back to Store
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}