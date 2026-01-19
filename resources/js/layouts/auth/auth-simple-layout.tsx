import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium mb-2">
                            <img
                                src="/storage/media/15/vimstack-logo.jpg"
                                alt="Vimstack"
                                className="w-full max-w-[150px] h-auto object-contain"
                            />
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                            <p className="text-gray-600 text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthSimpleLayout;