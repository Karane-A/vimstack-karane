import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, Building, DollarSign, Users, RefreshCw, Palette, BookOpen, Award, FileText, Mail, Bell, Link2, CreditCard, Calendar, HardDrive, Shield, Bot, Cookie, Search, Webhook, Wallet, Code } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SystemSettings from './components/system-settings';
import { usePage, router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

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

import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/permissions';

import { ResponsiveWrapper } from '@/components/mobile/responsive-wrapper';
import { 
  List as MobileList, 
  Switch as MobileSwitch,
  Popup,
  NavBar
} from 'antd-mobile';

export default function Settings() {
  const { t } = useTranslation();
  const { systemSettings = {}, cacheSize = '0.00', timezones = {}, dateFormats = {}, timeFormats = {}, paymentSettings = {}, whatsappVariables = {}, telegramVariables = {}, webhooks = [], auth = {}, flash } = usePage().props as any;
  const [activeSection, setActiveSection] = useState('system-settings');
  const [mobilePopupVisible, setMobilePopupVisible] = useState(false);
  const [mobileActiveSection, setMobileActiveSection] = useState<string | null>(null);
  
  // Define all possible sidebar navigation items
  const allSidebarNavItems: (NavItem & { permission?: string })[] = [
    {
      title: t('System Settings'),
      href: '#system-settings',
      id: 'system-settings',
      icon: <SettingsIcon className="h-4 w-4 mr-2" />,
      permission: 'manage-system-settings'
    },
    {
      title: t('Currency Settings'),
      href: '#currency-settings',
      id: 'currency-settings',
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      permission: 'manage-currency-settings'
    },
    {
      title: t('Email Notification Settings'),
      href: '#email-notification-settings',
      id: 'email-notification-settings',
      icon: <Bell className="h-4 w-4 mr-2" />,
      permission: 'manage-email-notification-settings'
    },
    {
      title: t('Payment Settings'),
      href: '#payment-settings',
      id: 'payment-settings',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      permission: 'manage-payment-settings'
    },
    {
      title: t('Payout Settings'),
      href: '#payout-settings',
      id: 'payout-settings',
      icon: <Wallet className="h-4 w-4 mr-2" />,
      permission: 'manage-payment-settings'
    },
    {
      title: t('Custom Code'),
      href: '#custom-code-settings',
      id: 'custom-code-settings',
      icon: <Code className="h-4 w-4 mr-2" />,
      permission: 'manage-system-settings'
    },
    {
      title: t('Brand Settings'),
      href: '#brand-settings',
      id: 'brand-settings',
      icon: <Palette className="h-4 w-4 mr-2" />,
      permission: 'manage-brand-settings'
    },
    {
      title: t('Email Settings'),
      href: '#email-settings',
      id: 'email-settings',
      icon: <Mail className="h-4 w-4 mr-2" />,
      permission: 'manage-email-settings'
    },
    {
      title: t('Storage Settings'),
      href: '#storage-settings',
      id: 'storage-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-storage-settings'
    },
    {
      title: t('ReCaptcha Settings'),
      href: '#recaptcha-settings',
      id: 'recaptcha-settings',
      icon: <Shield className="h-4 w-4 mr-2" />,
      permission: 'manage-recaptcha-settings'
    },
    {
      title: t('Cookie Settings'),
      href: '#cookie-settings',
      id: 'cookie-settings',
      icon: <Cookie className="h-4 w-4 mr-2" />,
      permission: 'manage-cookie-settings'
    },
    {
      title: t('SEO Settings'),
      href: '#seo-settings',
      id: 'seo-settings',
      icon: <Search className="h-4 w-4 mr-2" />,
      permission: 'manage-seo-settings'
    },
    {
      title: t('Cache Settings'),
      href: '#cache-settings',
      id: 'cache-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-cache-settings'
    },
  ];
  
  // Filter sidebar items based on user permissions
  const sidebarNavItems = allSidebarNavItems.filter(item => {
    if (auth.user && auth.user.type === 'company') {
      if (item.permission === 'manage-brand-settings' || item.permission === 'manage-email-settings') {
        return false;
      }
      const vendorAllowedPermissions = [
        'manage-system-settings', 
        'manage-currency-settings', 
        'manage-payment-settings', 
        'manage-email-notification-settings',
        'settings'
      ];
      if (!item.permission || vendorAllowedPermissions.includes(item.permission)) {
        return true;
      }
      return false;
    }
    
    if (!item.permission || (auth.permissions && auth.permissions.includes(item.permission))) {
      return true;
    }
    return false;
  });
  
  const systemSettingsRef = useRef<HTMLDivElement>(null);
  const brandSettingsRef = useRef<HTMLDivElement>(null);
  const currencySettingsRef = useRef<HTMLDivElement>(null);
  const emailSettingsRef = useRef<HTMLDivElement>(null);
  const paymentSettingsRef = useRef<HTMLDivElement>(null);
  const storageSettingsRef = useRef<HTMLDivElement>(null);
  const recaptchaSettingsRef = useRef<HTMLDivElement>(null);
  const cookieSettingsRef = useRef<HTMLDivElement>(null);
  const seoSettingsRef = useRef<HTMLDivElement>(null);
  const cacheSettingsRef = useRef<HTMLDivElement>(null);
  const emailNotificationSettingsRef = useRef<HTMLDivElement>(null);
  const payoutSettingsRef = useRef<HTMLDivElement>(null);
  const customCodeSettingsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const systemSettingsPosition = systemSettingsRef.current?.offsetTop || 0;
      const currencySettingsPosition = currencySettingsRef.current?.offsetTop || 0;
      const emailSettingsPosition = emailSettingsRef.current?.offsetTop || 0;
      const emailNotificationSettingsPosition = emailNotificationSettingsRef.current?.offsetTop || 0;
      const paymentSettingsPosition = paymentSettingsRef.current?.offsetTop || 0;
      const storageSettingsPosition = storageSettingsRef.current?.offsetTop || 0;
      const recaptchaSettingsPosition = recaptchaSettingsRef.current?.offsetTop || 0;
      const cookieSettingsPosition = cookieSettingsRef.current?.offsetTop || 0;
      const seoSettingsPosition = seoSettingsRef.current?.offsetTop || 0;
      const cacheSettingsPosition = cacheSettingsRef.current?.offsetTop || 0;
      const payoutSettingsPosition = payoutSettingsRef.current?.offsetTop || 0;
      const customCodeSettingsPosition = customCodeSettingsRef.current?.offsetTop || 0;

      if (scrollPosition >= customCodeSettingsPosition) {
        setActiveSection('custom-code-settings');
      } else if (scrollPosition >= payoutSettingsPosition) {
        setActiveSection('payout-settings');
      } else if (scrollPosition >= emailNotificationSettingsPosition) {
        setActiveSection('email-notification-settings');
      } else if (scrollPosition >= cacheSettingsPosition) {
        setActiveSection('cache-settings');
      } else if (scrollPosition >= seoSettingsPosition) {
        setActiveSection('seo-settings');
      } else if (scrollPosition >= cookieSettingsPosition) {
        setActiveSection('cookie-settings');
      } else if (scrollPosition >= recaptchaSettingsPosition) {
        setActiveSection('recaptcha-settings');
      } else if (scrollPosition >= storageSettingsPosition) {
        setActiveSection('storage-settings');
      } else if (scrollPosition >= paymentSettingsPosition) {
        setActiveSection('payment-settings');
      } else if (scrollPosition >= emailSettingsPosition) {
        setActiveSection('email-settings');
      } else if (scrollPosition >= currencySettingsPosition) {
        setActiveSection('currency-settings');
      } else {
        setActiveSection('system-settings');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(hash);
      }
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e?.preventDefault();
      const id = href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    } else {
      router.visit(href);
    }
  };

  const openMobileSection = (id: string) => {
    setMobileActiveSection(id);
    setMobilePopupVisible(true);
  };

  const renderMobileSettings = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <MobileList header={t('Store Settings')}>
        {sidebarNavItems.map((item) => (
          <MobileList.Item 
            key={item.id} 
            prefix={item.icon} 
            arrow 
            onClick={() => openMobileSection(item.id || '')}
          >
            {item.title}
          </MobileList.Item>
        ))}
      </MobileList>

      <Popup
        visible={mobilePopupVisible}
        onMaskClick={() => setMobilePopupVisible(false)}
        position="right"
        bodyStyle={{ width: '100vw' }}
      >
        <div className="flex flex-col h-screen bg-white overflow-y-auto pb-10">
          <NavBar onBack={() => setMobilePopupVisible(false)}>
            {sidebarNavItems.find(i => i.id === mobileActiveSection)?.title}
          </NavBar>
          <div className="p-4">
            {mobileActiveSection === 'system-settings' && (
              <SystemSettings 
                settings={systemSettings} 
                timezones={timezones}
                dateFormats={dateFormats}
                timeFormats={timeFormats}
              />
            )}
            {mobileActiveSection === 'currency-settings' && <CurrencySettings />}
            {mobileActiveSection === 'email-notification-settings' && <EmailNotificationSettings />}
            {mobileActiveSection === 'payment-settings' && (
              <PaymentSettings 
                settings={paymentSettings} 
                whatsappVariables={whatsappVariables} 
                telegramVariables={telegramVariables} 
              />
            )}
            {mobileActiveSection === 'payout-settings' && <PayoutSettings settings={paymentSettings} />}
            {mobileActiveSection === 'custom-code-settings' && <CustomCodeSettings settings={systemSettings} />}
            {mobileActiveSection === 'brand-settings' && <BrandSettings />}
            {mobileActiveSection === 'email-settings' && <EmailSettings />}
            {mobileActiveSection === 'storage-settings' && <StorageSettings settings={systemSettings} />}
            {mobileActiveSection === 'recaptcha-settings' && <RecaptchaSettings settings={systemSettings} />}
            {mobileActiveSection === 'cookie-settings' && <CookieSettings settings={systemSettings} />}
            {mobileActiveSection === 'seo-settings' && <SeoSettings settings={systemSettings} />}
            {mobileActiveSection === 'cache-settings' && <CacheSettings cacheSize={cacheSize} />}
          </div>
        </div>
      </Popup>
    </div>
  );

  const renderDesktopSettings = () => (
    <PageTemplate 
      title={t('Settings')} 
      url="/settings"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="pr-4 space-y-1">
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn('w-full justify-start', {
                      'bg-muted font-medium': activeSection === item.href.replace('#', '') && item.href.startsWith('#'),
                    })}
                    onClick={(e) => handleNavClick(item.href, e)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* System Settings Section */}
          {(auth.permissions?.includes('manage-system-settings') || auth.user?.type === 'superadmin') && (
            <section id="system-settings" ref={systemSettingsRef} className="mb-8">
              <SystemSettings 
                settings={systemSettings} 
                timezones={timezones}
                dateFormats={dateFormats}
                timeFormats={timeFormats}
              />
            </section>
          )}

          {/* Brand Settings Section */}
          {auth.user?.type === 'superadmin' && (
            <section id="brand-settings" ref={brandSettingsRef} className="mb-8">
              <BrandSettings />
            </section>
          )}

          {/* Currency Settings Section */}
          {(auth.permissions?.includes('manage-currency-settings') || auth.user?.type === 'superadmin' || auth.user?.type === 'company') && (
            <section id="currency-settings" ref={currencySettingsRef} className="mb-8">
              <CurrencySettings />
            </section>
          )}

          {/* Email Settings Section */}
          {auth.user?.type === 'superadmin' && (
            <section id="email-settings" ref={emailSettingsRef} className="mb-8">
              <EmailSettings />
            </section>
          )}

          {/* Email Notification Settings Section */}
          {auth.user?.type === 'company' && (
            <section id="email-notification-settings" ref={emailNotificationSettingsRef} className="mb-8">
              <EmailNotificationSettings />
            </section>
          )}

          {/* Payment Settings Section */}
          {(auth.permissions?.includes('manage-payment-settings') || auth.user?.type === 'superadmin' || auth.user?.type === 'company') && (
            <section id="payment-settings" ref={paymentSettingsRef} className="mb-8">
              <PaymentSettings settings={paymentSettings} whatsappVariables={whatsappVariables} telegramVariables={telegramVariables} />
            </section>
          )}

          {/* Storage Settings Section */}
          {auth.user?.type === 'superadmin' && (
            <section id="storage-settings" ref={storageSettingsRef} className="mb-8">
              <StorageSettings settings={systemSettings} />
            </section>
          )}

          {/* ReCaptcha Settings Section */}
          {(auth.permissions?.includes('manage-recaptcha-settings') || auth.user?.type === 'superadmin') && (
            <section id="recaptcha-settings" ref={recaptchaSettingsRef} className="mb-8">
              <RecaptchaSettings settings={systemSettings} />
            </section>
          )}

          {/* Cookie Settings Section */}
          {(auth.permissions?.includes('manage-cookie-settings') || auth.user?.type === 'superadmin') && (
            <section id="cookie-settings" ref={cookieSettingsRef} className="mb-8">
              <CookieSettings settings={systemSettings} />
            </section>
          )}

          {/* SEO Settings Section */}
          {(auth.permissions?.includes('manage-seo-settings') || auth.user?.type === 'superadmin') && (
            <section id="seo-settings" ref={seoSettingsRef} className="mb-8">
              <SeoSettings settings={systemSettings} />
            </section>
          )}

          {/* Cache Settings Section */}
          {(auth.permissions?.includes('manage-cache-settings') || auth.user?.type === 'superadmin') && (
            <section id="cache-settings" ref={cacheSettingsRef} className="mb-8">
              <CacheSettings cacheSize={cacheSize} />
            </section>
          )}

          {/* Payout Settings Section */}
          {auth.user?.type === 'company' && (
            <section id="payout-settings" ref={payoutSettingsRef} className="mb-8">
              <PayoutSettings settings={paymentSettings} />
            </section>
          )}

          {/* Custom Code Settings Section */}
          {(auth.permissions?.includes('manage-system-settings') || auth.user?.type === 'superadmin') && (
            <section id="custom-code-settings" ref={customCodeSettingsRef} className="mb-8">
              <CustomCodeSettings settings={systemSettings} />
            </section>
          )}
        </div>
      </div>
    </PageTemplate>
  );

  return (
    <ResponsiveWrapper
      mobileComponent={renderMobileSettings()}
      desktopComponent={renderDesktopSettings()}
    />
  );
}