import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft, Store } from 'lucide-react';

interface StoreNotFoundProps {
    requestedSlug?: string;
}

export default function StoreNotFound({ requestedSlug }: StoreNotFoundProps) {
    return (
        <>
            <Head title="Store Not Found" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center">
                    {/* Icon */}
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                        <Store className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Store Not Found
                    </h1>
                    
                    {/* Message */}
                    <p className="text-lg text-gray-600 mb-8">
                        {requestedSlug 
                            ? `We couldn't find a store with the address "${requestedSlug}".`
                            : "We couldn't find a store with this address."
                        } It may have been moved or is temporarily unavailable.
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                        
                        <Link
                            href={route('home')}
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}