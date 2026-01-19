import React, { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, DollarSign, Palette, Mail, Bell, CreditCard, HardDrive, Shield, Search, Wallet, Code, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePage, router, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

import SystemSettings from './components/system-settings';
import CurrencySettings from './components/currency-settings';
import BrandSettings from './components/brand-settings';
import EmailSettings from './components/email-settings';
import PaymentSettings from './components/payment-settings';
import StorageSettings from './components/storage-settings';
import RecaptchaSettings from './components/recaptcha-settings';
import CookieSettings from './components/cookie-settings';
import SeoSettings from './components/seo-settings';
import CacheSettings from './components/cache-settings';
import EmailNotificationSettings from './components/email-notification-settings';
import PayoutSettings from './components/payout-settings';
import CustomCodeSettings from './components/custom-code-settings';

export default function Settings() {
  const { t } = useTranslation();
  const {
    systemSettings = {},
    cacheSize = '0.00',
    timezones = {},
    dateFormats = {},
    timeFormats = {},
    paymentSettings = {},
    whatsappVariables = {},
    telegramVariables = {},
    auth = {}
  } = usePage().props as any;

  const [activeSection, setActiveSection] = useState('system-settings');

  const allSidebarNavItems = [
    { id: 'system-settings', title: t('System Settings'), icon: SettingsIcon, permission: 'manage-system-settings' },
    { id: 'currency-settings', title: t('Currency'), icon: DollarSign, permission: 'manage-currency-settings' },
    { id: 'email-notification-settings', title: t('Notifications'), icon: Bell, permission: 'manage-email-notification-settings' },
    { id: 'payment-settings', title: t('Payments'), icon: CreditCard, permission: 'manage-payment-settings' },
    { id: 'payout-settings', title: t('Payouts'), icon: Wallet, permission: 'manage-payment-settings' },
    { id: 'custom-code-settings', title: t('Custom Code'), icon: Code, permission: 'manage-system-settings' },
    { id: 'brand-settings', title: t('Branding'), icon: Palette, permission: 'manage-brand-settings' },
    { id: 'email-settings', title: t('SMTP Settings'), icon: Mail, permission: 'manage-email-settings' },
    { id: 'storage-settings', title: t('Storage'), icon: HardDrive, permission: 'manage-storage-settings' },
    { id: 'recaptcha-settings', title: t('ReCaptcha'), icon: Shield, permission: 'manage-recaptcha-settings' },
    { id: 'cookie-settings', title: t('Cookies'), icon: SettingsIcon, permission: 'manage-cookie-settings' }, // Using SettingsIcon as fallback
    { id: 'seo-settings', title: t('SEO'), icon: Search, permission: 'manage-seo-settings' },
    { id: 'cache-settings', title: t('Optimization'), icon: RefreshCw, permission: 'manage-cache-settings' },
  ];

  const sidebarNavItems = allSidebarNavItems.filter(item => {
    if (auth.user && auth.user.type === 'company') {
      if (item.id === 'brand-settings' || item.id === 'email-settings') return false;
      const vendorAllowed = ['system-settings', 'currency-settings', 'payment-settings', 'email-notification-settings', 'payout-settings'];
      return vendorAllowed.includes(item.id);
    }
    return !item.permission || (auth.permissions && auth.permissions.includes(item.permission)) || auth.user?.type === 'superadmin';
  });

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    'system-settings': useRef<HTMLDivElement>(null),
    'brand-settings': useRef<HTMLDivElement>(null),
    'currency-settings': useRef<HTMLDivElement>(null),
    'email-settings': useRef<HTMLDivElement>(null),
    'email-notification-settings': useRef<HTMLDivElement>(null),
    'payment-settings': useRef<HTMLDivElement>(null),
    'storage-settings': useRef<HTMLDivElement>(null),
    'recaptcha-settings': useRef<HTMLDivElement>(null),
    'cookie-settings': useRef<HTMLDivElement>(null),
    'seo-settings': useRef<HTMLDivElement>(null),
    'cache-settings': useRef<HTMLDivElement>(null),
    'payout-settings': useRef<HTMLDivElement>(null),
    'custom-code-settings': useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = activeSection;
      for (const [id, ref] of Object.entries(sectionRefs)) {
        if (ref.current && ref.current.offsetTop <= window.scrollY + 120) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <Head title={t('Settings')} />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="lg:w-80 w-full lg:sticky lg:top-24 space-y-3">
          <div className="mb-4 md:mb-6 px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t('Settings')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('Configuration & Preferences')}</p>
          </div>

          {/* Mobile: Grid-based Navigation */}
          <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              {sidebarNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-xs font-medium transition-all min-h-[80px]",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon size={20} strokeWidth={2} />
                  <span className="text-center leading-tight">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Vertical Navigation */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
            {sidebarNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group mb-1",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={activeSection === item.id ? "" : "text-muted-foreground group-hover:text-foreground"} />
                  {item.title}
                </div>
                <ChevronRight size={16} className={cn("transition-all", activeSection === item.id ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50")} />
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-8 md:space-y-12 w-full min-w-0">
          {sidebarNavItems.map((item) => (
            <section key={item.id} id={item.id} ref={sectionRefs[item.id]} className="scroll-mt-24">
              <div className="mb-3 md:mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">{item.title}</h2>
              </div>
              <div className="bg-white rounded-2xl md:rounded-[28px] border border-slate-200 p-5 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                {item.id === 'system-settings' && (
                  <SystemSettings settings={systemSettings} timezones={timezones} dateFormats={dateFormats} timeFormats={timeFormats} />
                )}
                {item.id === 'brand-settings' && <BrandSettings />}
                {item.id === 'currency-settings' && <CurrencySettings />}
                {item.id === 'email-settings' && <EmailSettings />}
                {item.id === 'email-notification-settings' && <EmailNotificationSettings />}
                {item.id === 'payment-settings' && (
                  <PaymentSettings settings={paymentSettings} />
                )}
                {item.id === 'storage-settings' && <StorageSettings settings={systemSettings} />}
                {item.id === 'recaptcha-settings' && <RecaptchaSettings settings={systemSettings} />}
                {item.id === 'cookie-settings' && <CookieSettings settings={systemSettings} />}
                {item.id === 'seo-settings' && <SeoSettings settings={systemSettings} />}
                {item.id === 'cache-settings' && <CacheSettings cacheSize={cacheSize} />}
                {item.id === 'payout-settings' && <PayoutSettings settings={paymentSettings} />}
                {item.id === 'custom-code-settings' && <CustomCodeSettings settings={systemSettings} />}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

Settings.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;