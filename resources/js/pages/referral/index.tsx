import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { BarChart3, DollarSign, Users, Gift, Settings as SettingsIcon, Copy, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import ReferralDashboard from './components/referral-dashboard';
import PayoutRequests from './components/payout-requests';
import ReferralSettings from './components/referral-settings';

export default function Referral() {
  const { t } = useTranslation();
  const { props } = usePage();
  const { userType, settings, stats, payoutRequests, referralLink, flash } = props as any;
  const [activeSection, setActiveSection] = useState('dashboard');
  

  
  const sidebarNavItems: NavItem[] = [
    {
      title: t('Dashboard'),
      href: '#dashboard',
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
    },
    {
      title: t('Payout Requests'),
      href: '#payout-requests',
      icon: <DollarSign className="h-4 w-4 mr-2" />,
    },
    ...(userType === 'superadmin' ? [{
      title: t('Settings'),
      href: '#settings',
      icon: <SettingsIcon className="h-4 w-4 mr-2" />,
    }] : [])
  ];
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const payoutRequestsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const dashboardPosition = dashboardRef.current?.offsetTop || 0;
      const payoutRequestsPosition = payoutRequestsRef.current?.offsetTop || 0;
      const settingsPosition = settingsRef.current?.offsetTop || 0;
      
      if (userType === 'superadmin' && scrollPosition >= settingsPosition) {
        setActiveSection('settings');
      } else if (scrollPosition >= payoutRequestsPosition) {
        setActiveSection('payout-requests');
      } else {
        setActiveSection('dashboard');
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
  }, [userType]);

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
      title={t('Referral Program')} 
      url="/referral"
    >
      <div className="flex flex-col md:flex-row gap-8">
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

        <div className="flex-1">
          <section id="dashboard" ref={dashboardRef} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('Dashboard')}</h2>
            <ReferralDashboard 
              userType={userType}
              stats={stats}
              referralLink={referralLink}
            />
          </section>

          <section id="payout-requests" ref={payoutRequestsRef} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('Payout Requests')}</h2>
            <PayoutRequests 
              userType={userType}
              payoutRequests={payoutRequests}
              settings={settings}
              stats={stats}
            />
          </section>

          {userType === 'superadmin' && (
            <section id="settings" ref={settingsRef} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('Settings')}</h2>
              <ReferralSettings settings={settings} />
            </section>
          )}
        </div>
      </div>
      <Toaster />
    </PageTemplate>
  );
}