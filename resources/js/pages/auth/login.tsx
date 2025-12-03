import { useForm, router, usePage } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import AuthButton from '@/components/auth/auth-button';
import Recaptcha, { executeRecaptcha } from '@/components/recaptcha';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { getStoreThemes } from '@/data/storeThemes';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    recaptcha_token?: string;
};

interface DemoStore {
    id: number;
    name: string;
    slug: string;
    theme: string;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    demoStores?: DemoStore[];
}

export default function Login({ status, canResetPassword, demoStores = [] }: LoginProps) {
    const { t } = useTranslation();
    const [recaptchaToken, setRecaptchaToken] = useState<string>('');
    const { themeColor, customColor } = useBrand();
    const { settings = {} } = usePage().props as any;
    const recaptchaEnabled = settings.recaptchaEnabled === 'true' || settings.recaptchaEnabled === true || settings.recaptchaEnabled === 1 || settings.recaptchaEnabled === '1';
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    const [isDemo, setIsDemo] = useState<boolean>(false);
    const [hoveredStore, setHoveredStore] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });
    
    useEffect(() => {
        // Check if demo mode is enabled
        const isDemoMode = (window as any).isDemo === true;
        setIsDemo(isDemoMode);
        
        // Set default credentials if in demo mode
        if (isDemoMode) {
            setData({
                email: 'company@example.com',
                password: 'password',
                remember: false
            });
        }
    }, []);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (recaptchaEnabled) {
            try {
                const token = await executeRecaptcha();
                if (!token) {
                    alert(t('Please complete the reCAPTCHA verification'));
                    return;
                }
                const formData = { ...data, recaptcha_token: token };
                post(route('login'), formData, {
                    onFinish: () => reset('password'),
                });
                return;
            } catch {
                alert(t('reCAPTCHA verification failed. Please try again.'));
                return;
            }
        }
        
        const formData = { ...data, recaptcha_token: recaptchaToken };
        post(route('login'), formData, {
            onFinish: () => reset('password'),
        });
    };
    
    const openStoreInNewTab = (storeSlug: string, e: React.MouseEvent) => {
        // Prevent the default form submission
        e.preventDefault();
        e.stopPropagation();
        
        // Open store in new tab
        const url = route('store.home', storeSlug);
        window.open(url, '_blank');
    };
    
    const getThemeThumbnail = (themeId: string) => {
        const theme = getStoreThemes().find(t => t.id === themeId);
        return theme?.thumbnail || '';
    };

    return (
        <AuthLayout
            title={t("Log in to your account")}
            description={t("Enter your credentials to access your account")}
            status={status}
        >
            <form className="space-y-5" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="relative">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium mb-1 block">{t("Email address")}</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="pl-10 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg transition-all duration-200"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">{t("Password")}</Label>
                            {canResetPassword && (
                                <TextLink 
                                    href={route('password.request')} 
                                    className="text-sm transition-colors duration-200" 
                                    style={{ color: primaryColor }}
                                    tabIndex={5}
                                >
                                    {t("Forgot password?")}
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="pl-10 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg transition-all duration-200"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-gray-300 rounded"
                            style={{ '--tw-ring-color': primaryColor, color: primaryColor } as React.CSSProperties}
                        />
                        <Label htmlFor="remember" className="ml-2 text-gray-600 dark:text-gray-400">{t("Remember me")}</Label>
                    </div>
                </div>

                {recaptchaEnabled && (
                    <Recaptcha 
                        onVerify={setRecaptchaToken}
                        onExpired={() => setRecaptchaToken('')}
                        onError={() => setRecaptchaToken('')}
                    />
                )}

                <AuthButton 
                    tabIndex={4} 
                    processing={processing}
                >
                    {t("Log in")}
                </AuthButton>
                
                {isDemo && (
                    <div className="mt-6">
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">{t('Demo Quick Access')}</h3>
                            
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button 
                                        type="button" 
                                        onClick={async () => {
                                            if (recaptchaEnabled) {
                                                try {
                                                    const token = await executeRecaptcha();
                                                    if (!token) {
                                                        alert(t('Please complete the reCAPTCHA verification'));
                                                        return;
                                                    }
                                                    router.post(route('login'), {
                                                        email: 'superadmin@example.com',
                                                        password: 'password',
                                                        remember: false,
                                                        recaptcha_token: token
                                                    });
                                                } catch {
                                                    alert(t('reCAPTCHA verification failed. Please try again.'));
                                                }
                                            } else {
                                                router.post(route('login'), {
                                                    email: 'superadmin@example.com',
                                                    password: 'password',
                                                    remember: false,
                                                    recaptcha_token: recaptchaToken
                                                });
                                            }
                                        }}
                                        className="shadow-sm text-white px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 w-full sm:w-auto cursor-pointer hover:opacity-90 hover:shadow-md"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                       {t('Login as Super Admin')}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        onClick={async () => {
                                            if (recaptchaEnabled) {
                                                try {
                                                    const token = await executeRecaptcha();
                                                    if (!token) {
                                                        alert(t('Please complete the reCAPTCHA verification'));
                                                        return;
                                                    }
                                                    router.post(route('login'), {
                                                        email: 'company@example.com',
                                                        password: 'password',
                                                        remember: false,
                                                        recaptcha_token: token
                                                    });
                                                } catch {
                                                    alert(t('reCAPTCHA verification failed. Please try again.'));
                                                }
                                            } else {
                                                router.post(route('login'), {
                                                    email: 'company@example.com',
                                                    password: 'password',
                                                    remember: false,
                                                    recaptcha_token: recaptchaToken
                                                });
                                            }
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md text-white px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 w-full sm:w-auto cursor-pointer"
                                    >
                                        {t('Login as Company')}
                                    </Button>
                                </div>
                                
                                {demoStores && demoStores.length > 0 && (
                                    <div className="mt-3">
                                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">{t('Store Themes')}</h4>
                                        <div className="relative">
                                            <div className="grid grid-cols-2 gap-2">
                                                {demoStores.map((store) => (
                                                    <div key={store.id} className="relative demo-store-container">
                                                        <Button 
                                                            onClick={(e) => openStoreInNewTab(store.slug, e)}
                                                            className="text-xs sm:text-sm py-1 px-1 transition-all duration-200 truncate cursor-pointer hover:opacity-80 hover:shadow-sm w-full"
                                                            style={{ 
                                                                backgroundColor: primaryColor + '15', 
                                                                color: primaryColor,
                                                                border: `1px solid ${primaryColor}20`
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = primaryColor + '25';
                                                                setHoveredStore(store.theme);
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = primaryColor + '15';
                                                                setHoveredStore(null);
                                                            }}
                                                        >
                                                            {store.theme
                                                                .split('-')
                                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                .join(' ')}
                                                        </Button>
                                                        
                                                        {hoveredStore === store.theme && (
                                                            <div className="demo-store-preview">
                                                                <div className="demo-store-preview-container">
                                                                    <img
                                                                        src={getThemeThumbnail(store.theme)}
                                                                        alt={store.theme}
                                                                        className="demo-store-preview-image"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = `https://placehold.co/300x600?text=${encodeURIComponent(store.theme)}`;
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {(settings.registrationEnabled === 'true' || settings.registrationEnabled === true || settings.registrationEnabled === '1' || settings.registrationEnabled === 1) && (
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        {t("Don't have an account?")}{' '}
                        <TextLink 
                            href={route('register')} 
                            className="font-medium transition-colors duration-200" 
                            style={{ color: primaryColor }}
                            tabIndex={6}
                        >
                            {t("Sign up")}
                        </TextLink>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}