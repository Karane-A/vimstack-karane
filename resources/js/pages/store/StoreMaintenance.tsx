import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Home, Settings, Clock } from 'lucide-react';

interface StoreMaintenanceProps {
    store: {
        name: string;
    };
}

export default function StoreMaintenance({ store }: StoreMaintenanceProps) {
    return (
        <>
            <Head title={`Maintenance Mode - ${store.name}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-8">
                            <div className="relative">
                                <Settings className="w-16 h-16 text-orange-600 animate-spin" style={{animationDuration: '3s'}} />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            We'll Be Right Back!
                        </h1>
                        
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                            <p className="text-lg text-gray-700">
                                <span className="font-semibold text-orange-700">{store.name}</span> is currently under maintenance.
                            </p>
                        </div>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We're working hard to improve your shopping experience. Our team is making some exciting updates and we'll be back online shortly. Thank you for your patience!
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