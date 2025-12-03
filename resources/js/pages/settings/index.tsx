import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, Building, DollarSign, Users, RefreshCw, Palette, BookOpen, Award, FileText, Mail, Bell, Link2, CreditCard, Calendar, HardDrive, Shield, Bot, Cookie, Search, Webhook, Wallet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SystemSettings from './components/system-settings';
import { usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

import CurrencySettings from './components/currency-settings';

import BrandSettings from './components/brand-settings';
import EmailSettings from './components/email-settings';
import PaymentSettings from './components/payment-settings';
import StorageSettings from './components/storage-settings';
import RecaptchaSettings from './components/recaptcha-settings';
import ChatGptSettings from './components/chatgpt-settings';
import CookieSettings from './components/cookie-settings';
import SeoSettings from './components/seo-settings';
import CacheSettings from './components/cache-settings';
import EmailNotificationSettings from './components/email-notification-settings';
// import WebhookSettings from './components/webhook-settings';


import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/permissions';

export default function Settings() {
  const { t } = useTranslation();
  const { systemSettings = {}, cacheSize = '0.00', timezones = {}, dateFormats = {}, timeFormats = {}, paymentSettings = {}, whatsappVariables = {}, telegramVariables = {}, webhooks = [], auth = {}, flash } = usePage().props as any;
  const [activeSection, setActiveSection] = useState('system-settings');
  
  // Flash messages are handled globally by the flash-messages.ts system
  // Removed manual handling to prevent duplicate messages
  
  // Define all possible sidebar navigation items
  const allSidebarNavItems: (NavItem & { permission?: string })[] = [
    {
      title: t('System Settings'),
      href: '#system-settings',
      icon: <SettingsIcon className="h-4 w-4 mr-2" />,
      permission: 'manage-system-settings'
    },
    {
      title: t('Brand Settings'),
      href: '#brand-settings',
      icon: <Palette className="h-4 w-4 mr-2" />,
      permission: 'manage-brand-settings'
    },
    {
      title: t('Currency Settings'),
      href: '#currency-settings',
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      permission: 'manage-currency-settings'
    },
    {
      title: t('Email Settings'),
      href: '#email-settings',
      icon: <Mail className="h-4 w-4 mr-2" />,
      permission: 'manage-email-settings'
    },
    {
      title: t('Email Notification Settings'),
      href: '#email-notification-settings',
      icon: <Bell className="h-4 w-4 mr-2" />,
      permission: 'manage-email-notification-settings'
    },
    {
      title: t('Payment Settings'),
      href: '#payment-settings',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      permission: 'manage-payment-settings'
    },
    {
      title: t('Storage Settings'),
      href: '#storage-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-storage-settings'
    },
    {
      title: t('ReCaptcha Settings'),
      href: '#recaptcha-settings',
      icon: <Shield className="h-4 w-4 mr-2" />,
      permission: 'manage-recaptcha-settings'
    },
    {
      title: t('Chat GPT Settings'),
      href: '#chatgpt-settings',
      icon: <Bot className="h-4 w-4 mr-2" />,
      permission: 'manage-chatgpt-settings'
    },
    {
      title: t('Cookie Settings'),
      href: '#cookie-settings',
      icon: <Cookie className="h-4 w-4 mr-2" />,
      permission: 'manage-cookie-settings'
    },
    {
      title: t('SEO Settings'),
      href: '#seo-settings',
      icon: <Search className="h-4 w-4 mr-2" />,
      permission: 'manage-seo-settings'
    },
    {
      title: t('Cache Settings'),
      href: '#cache-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-cache-settings'
    },

    // {
    //   title: t('Webhook Settings'),
    //   href: '#webhook-settings',
    //   icon: <Webhook className="h-4 w-4 mr-2" />,
    //   permission: 'manage-webhook-settings'
    // },

  ];
  
  // Filter sidebar items based on user permissions
  const sidebarNavItems = allSidebarNavItems.filter(item => {
    // If no permission is required or user has the permission
    if (!item.permission || (auth.permissions && auth.permissions.includes(item.permission))) {
      return true;
    }
    // For company users, only show specific settings
    if (auth.user && auth.user.type === 'company') {
      // Only allow system settings, email settings, brand settings, currency settings, payment settings, webhook settings, and settings
      return ['manage-system-settings', 'manage-email-settings', 'manage-brand-settings', 'manage-currency-settings', 'manage-payment-settings', 'manage-webhook-settings', 'manage-email-notification-settings', 'settings'].includes(item.permission);
    }
    return false;
  });
  
  // Refs for each section
  const systemSettingsRef = useRef<HTMLDivElement>(null);
  const brandSettingsRef = useRef<HTMLDivElement>(null);

  const currencySettingsRef = useRef<HTMLDivElement>(null);
  const emailSettingsRef = useRef<HTMLDivElement>(null);
  const paymentSettingsRef = useRef<HTMLDivElement>(null);
  const storageSettingsRef = useRef<HTMLDivElement>(null);
  const recaptchaSettingsRef = useRef<HTMLDivElement>(null);
  const chatgptSettingsRef = useRef<HTMLDivElement>(null);
  const cookieSettingsRef = useRef<HTMLDivElement>(null);
  const seoSettingsRef = useRef<HTMLDivElement>(null);
  const cacheSettingsRef = useRef<HTMLDivElement>(null);
  const emailNotificationSettingsRef = useRef<HTMLDivElement>(null);
  // const webhookSettingsRef = useRef<HTMLDivElement>(null);


  
  // Smart scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add offset for better UX
      
      // Get positions of each section
      const systemSettingsPosition = systemSettingsRef.current?.offsetTop || 0;
      const brandSettingsPosition = brandSettingsRef.current?.offsetTop || 0;

      const currencySettingsPosition = currencySettingsRef.current?.offsetTop || 0;
      const emailSettingsPosition = emailSettingsRef.current?.offsetTop || 0;
      const emailNotificationSettingsPosition = emailNotificationSettingsRef.current?.offsetTop || 0;
      const paymentSettingsPosition = paymentSettingsRef.current?.offsetTop || 0;
      const storageSettingsPosition = storageSettingsRef.current?.offsetTop || 0;
      const recaptchaSettingsPosition = recaptchaSettingsRef.current?.offsetTop || 0;
      const chatgptSettingsPosition = chatgptSettingsRef.current?.offsetTop || 0;
      const cookieSettingsPosition = cookieSettingsRef.current?.offsetTop || 0;
      const seoSettingsPosition = seoSettingsRef.current?.offsetTop || 0;
      const cacheSettingsPosition = cacheSettingsRef.current?.offsetTop || 0;
      // const webhookSettingsPosition = webhookSettingsRef.current?.offsetTop || 0;

      
      // Determine active section based on scroll position
      // if (scrollPosition >= webhookSettingsPosition) {
      //   setActiveSection('webhook-settings');
      // } else 
      if (scrollPosition >= emailNotificationSettingsPosition) {
        setActiveSection('email-notification-settings');
      } else if (scrollPosition >= cacheSettingsPosition) {
        setActiveSection('cache-settings');
      } else if (scrollPosition >= seoSettingsPosition) {
        setActiveSection('seo-settings');
      } else if (scrollPosition >= cookieSettingsPosition) {
        setActiveSection('cookie-settings');
      } else if (scrollPosition >= chatgptSettingsPosition) {
        setActiveSection('chatgpt-settings');
      } else if (scrollPosition >= recaptchaSettingsPosition) {
        setActiveSection('recaptcha-settings');
      } else if (scrollPosition >= storageSettingsPosition) {
        setActiveSection('storage-settings');
      } else if (scrollPosition >= paymentSettingsPosition) {
        setActiveSection('payment-settings');
      } else if (scrollPosition >= emailNotificationSettingsPosition) {
        setActiveSection('email-notification-settings');
      } else if (scrollPosition >= emailSettingsPosition) {
        setActiveSection('email-settings');
      } else if (scrollPosition >= currencySettingsPosition) {
        setActiveSection('currency-settings');

      } else if (scrollPosition >= brandSettingsPosition) {
        setActiveSection('brand-settings');
      } else {
        setActiveSection('system-settings');
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for hash in URL
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

  // Handle navigation click
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
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
                      'bg-muted font-medium': activeSection === item.href.replace('#', ''),
                    })}
                    onClick={() => handleNavClick(item.href)}
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
          {(auth.permissions?.includes('manage-brand-settings') || auth.user?.type === 'superadmin') && (
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
          {(auth.permissions?.includes('manage-email-settings') || auth.user?.type === 'superadmin') && (
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

          {/* Chat GPT Settings Section */}
          {(auth.permissions?.includes('manage-chatgpt-settings') || auth.user?.type === 'superadmin') && (
            <section id="chatgpt-settings" ref={chatgptSettingsRef} className="mb-8">
              <ChatGptSettings settings={systemSettings} />
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



          {/* Webhook Settings Section */}
          {/* {auth.permissions?.includes('manage-webhook-settings') && (
            <section id="webhook-settings" ref={webhookSettingsRef} className="mb-8">
              <WebhookSettings webhooks={webhooks} />
            </section>
          )} */}





        </div>
      </div>
    </PageTemplate>
  );
}