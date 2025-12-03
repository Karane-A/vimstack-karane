import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function CookieConsent() {
  const { t } = useTranslation();
  
  // Safely get page props, fallback to window.page if usePage fails
  let settings = {};
  let auth = {};
  try {
    const { props } = usePage();
    settings = (props as any).globalSettings || (props as any).settings || {};
    auth = (props as any).auth || {};
  } catch {
    // Fallback to global page data if usePage is not available
    const globalPage = (window as any).page;
    if (globalPage?.props) {
      settings = globalPage.props.globalSettings || globalPage.props.settings || {};
      auth = globalPage.props.auth || {};
    }
  }
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show for superadmin users when cookie logging is enabled
    const enableLogging = settings.enableLogging === '1' || settings.enableLogging === true;
    const isSuperAdmin = auth.user?.type === 'superadmin';
    
    if (enableLogging && isSuperAdmin) {
      const hasAccepted = localStorage.getItem('cookie-consent-accepted');
      if (!hasAccepted) {
        setIsVisible(true);
      }
    }
  }, [settings, auth]);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent-accepted', 'true');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent-accepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 rtl:right-1/2 rtl:left-auto rtl:translate-x-1/2 rtl:-translate-x-0">
      <Card className="shadow-lg border-2 dark:bg-card dark:border-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie 
              className="h-5 w-5 mt-0.5 flex-shrink-0" 
              style={{ color: settings.customColor || 'hsl(var(--primary))' }}
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1 dark:text-foreground rtl:text-right ltr:text-left">
                {settings.cookieTitle || t('Cookie Consent')}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 dark:text-muted-foreground rtl:text-right ltr:text-left">
                {settings.cookieDescription || t('We use cookies to enhance your browsing experience and provide personalized content.')}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={acceptCookies} 
                  className="text-xs text-white dark:text-white"
                  style={{ backgroundColor: settings.customColor || 'hsl(var(--primary))' }}
                >
                  {t('Accept')}
                </Button>
                <Button size="sm" variant="outline" onClick={rejectCookies} className="text-xs dark:border-border dark:text-foreground dark:hover:bg-accent">
                  {t('Reject')}
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={rejectCookies}
              className="h-6 w-6 p-0 flex-shrink-0 dark:text-foreground dark:hover:bg-accent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}