import { useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import AuthButton from '@/components/auth/auth-button';
import Recaptcha from '@/components/recaptcha';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();
    const [recaptchaToken, setRecaptchaToken] = useState<string>('');
    const { themeColor, customColor } = useBrand();
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    const { data, setData, post, processing, errors } = useForm<{ email: string; recaptcha_token?: string }>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            data: { ...data, recaptcha_token: recaptchaToken },
        });
    };

    return (
        <AuthLayout
            title={t("Forgot your password?")}
            description={t("Enter your email to receive a password reset link")}
            icon={<Mail className="h-7 w-7" style={{ color: primaryColor }} />}
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
                </div>

                <Recaptcha 
                    onVerify={setRecaptchaToken}
                    onExpired={() => setRecaptchaToken('')}
                    onError={() => setRecaptchaToken('')}
                />

                <AuthButton 
                    tabIndex={2} 
                    processing={processing}
                >
                    {t("Email password reset link")}
                </AuthButton>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    {t("Remember your password?")}{' '}
                    <TextLink 
                        href={route('login')} 
                        className="font-medium transition-colors duration-200" 
                        style={{ color: primaryColor }}
                        tabIndex={3}
                    >
                        {t("Back to login")}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}