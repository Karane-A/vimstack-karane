import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Home, Store, AlertCircle } from 'lucide-react';

interface StoreDisabledProps {
    store: {
        name: string;
    };
}

export default function StoreDisabled({ store }: StoreDisabledProps) {
    return (
        <>
            <Head title={`Store Disabled - ${store.name}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-8">
                            <div className="relative">
                                <Store className="w-16 h-16 text-red-600" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Store Temporarily Unavailable
                        </h1>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-lg text-gray-700">
                                <span className="font-semibold text-red-700">{store.name}</span> is currently disabled by the store owner.
                            </p>
                        </div>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            This store is temporarily not accepting visitors. Please check back later or contact the store owner for more information about when it will be available again.
                        </p>
                        
                        <Link
                            href={route('home')}
                            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}