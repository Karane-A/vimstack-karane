import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

interface CookieSettingsProps {
  settings?: Record<string, string>;
}

export default function CookieSettings({ settings = {} }: CookieSettingsProps) {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;
  
  // Default settings
  const defaultSettings = {
    enableLogging: false,
    strictlyNecessaryCookies: true,
    cookieTitle: 'Cookie Consent',
    strictlyCookieTitle: 'Strictly Necessary Cookies',
    cookieDescription: 'We use cookies to enhance your browsing experience and provide personalized content.',
    strictlyCookieDescription: 'These cookies are essential for the website to function properly.',
    contactUsDescription: 'If you have any questions about our cookie policy, please contact us.',
    contactUsUrl: 'https://example.com/contact'
  };
  
  // Combine settings from props and page props
  const settingsData = Object.keys(settings).length > 0 
    ? settings 
    : (pageProps.settings || pageProps.systemSettings || pageProps.globalSettings || {});
  
  // Initialize state with merged settings
  const [cookieSettings, setCookieSettings] = useState(() => ({
    enableLogging: settingsData.enableLogging === '1' || settingsData.enableLogging === true || defaultSettings.enableLogging,
    strictlyNecessaryCookies: settingsData.strictlyNecessaryCookies === '1' || settingsData.strictlyNecessaryCookies === true || defaultSettings.strictlyNecessaryCookies,
    cookieTitle: settingsData.cookieTitle || defaultSettings.cookieTitle,
    strictlyCookieTitle: settingsData.strictlyCookieTitle || defaultSettings.strictlyCookieTitle,
    cookieDescription: settingsData.cookieDescription || defaultSettings.cookieDescription,
    strictlyCookieDescription: settingsData.strictlyCookieDescription || defaultSettings.strictlyCookieDescription,
    contactUsDescription: settingsData.contactUsDescription || defaultSettings.contactUsDescription,
    contactUsUrl: settingsData.contactUsUrl || defaultSettings.contactUsUrl
  }));
  
  // Update state when settings change
  useEffect(() => {
    if (Object.keys(settingsData).length > 0) {
      setCookieSettings(prevSettings => ({
        ...prevSettings,
        enableLogging: settingsData.enableLogging === '1' || settingsData.enableLogging === true || defaultSettings.enableLogging,
        strictlyNecessaryCookies: settingsData.strictlyNecessaryCookies === '1' || settingsData.strictlyNecessaryCookies === true || defaultSettings.strictlyNecessaryCookies,
        cookieTitle: settingsData.cookieTitle || defaultSettings.cookieTitle,
        strictlyCookieTitle: settingsData.strictlyCookieTitle || defaultSettings.strictlyCookieTitle,
        cookieDescription: settingsData.cookieDescription || defaultSettings.cookieDescription,
        strictlyCookieDescription: settingsData.strictlyCookieDescription || defaultSettings.strictlyCookieDescription,
        contactUsDescription: settingsData.contactUsDescription || defaultSettings.contactUsDescription,
        contactUsUrl: settingsData.contactUsUrl || defaultSettings.contactUsUrl
      }));
    }
  }, [settingsData]);

  // Handle cookie settings form changes
  const handleCookieSettingsChange = (field: string, value: string | boolean) => {
    setCookieSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle cookie settings form submission
  const submitCookieSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to backend using Inertia
    router.post(route('settings.cookie.update'), cookieSettings, {
      preserveScroll: true,
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update cookie settings');
        toast.error(errorMessage);
      }
    });
  };

  // Handle CSV download
  const downloadCookieCSV = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
    
    const csvData = [
      ['IP', 'Date', 'Time', 'Accepted-cookies', 'Device type', 'Browser language', 'Browser name', 'OS Name', 'Country', 'Region', 'RegionName', 'City', 'Zipcode', 'Lat', 'Lon'],
      ['49.36.83.154', date, time, 'necessary', 'desktop', 'en', 'Chrome', 'Linux', 'India', 'GJ', 'Gujarat', 'Surat', '395007', '21.1888', '72.8293']
    ];
    
    const csvContent = csvData.map(row => row.join('\t')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'cookie_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(t('Cookie data CSV downloaded successfully'));
  };

  return (
    <SettingsSection
      title={t("Cookie Settings")}
      description={t("Configure cookie consent and privacy settings for your application")}
      action={
        <Button type="submit" form="cookie-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t("Save Changes")}
        </Button>
      }
    >
      <form id="cookie-settings-form" onSubmit={submitCookieSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enable Logging Switch */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="enableLogging">{t("Enable Logging")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Enable cookie activity logging")}
              </p>
            </div>
            <Switch
              id="enableLogging"
              checked={cookieSettings.enableLogging}
              onCheckedChange={(checked) => handleCookieSettingsChange('enableLogging', checked)}
            />
          </div>

          {/* Strictly Necessary Cookies Switch */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="strictlyNecessaryCookies">{t("Strictly Necessary Cookies")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Enable strictly necessary cookies")}
              </p>
            </div>
            <Switch
              id="strictlyNecessaryCookies"
              checked={cookieSettings.strictlyNecessaryCookies}
              onCheckedChange={(checked) => handleCookieSettingsChange('strictlyNecessaryCookies', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cookie Title */}
          <div className="grid gap-2">
            <Label htmlFor="cookieTitle">{t("Cookie Title")}</Label>
            <Input
              id="cookieTitle"
              type="text"
              value={cookieSettings.cookieTitle}
              onChange={(e) => handleCookieSettingsChange('cookieTitle', e.target.value)}
              placeholder={t("Enter the main cookie consent title")}
            />
          </div>

          {/* Strictly Cookie Title */}
          <div className="grid gap-2">
            <Label htmlFor="strictlyCookieTitle">{t("Strictly Cookie Title")}</Label>
            <Input
              id="strictlyCookieTitle"
              type="text"
              value={cookieSettings.strictlyCookieTitle}
              onChange={(e) => handleCookieSettingsChange('strictlyCookieTitle', e.target.value)}
              placeholder={t("Enter the strictly necessary cookies title")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cookie Description */}
          <div className="grid gap-2">
            <Label htmlFor="cookieDescription">{t("Cookie Description")}</Label>
            <Textarea
              id="cookieDescription"
              value={cookieSettings.cookieDescription}
              onChange={(e) => handleCookieSettingsChange('cookieDescription', e.target.value)}
              placeholder={t("Enter the cookie consent description")}
              rows={4}
            />
          </div>

          {/* Strictly Cookie Description */}
          <div className="grid gap-2">
            <Label htmlFor="strictlyCookieDescription">{t("Strictly Cookie Description")}</Label>
            <Textarea
              id="strictlyCookieDescription"
              value={cookieSettings.strictlyCookieDescription}
              onChange={(e) => handleCookieSettingsChange('strictlyCookieDescription', e.target.value)}
              placeholder={t("Enter the strictly necessary cookies description")}
              rows={4}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Us Description */}
          <div className="grid gap-2">
            <Label htmlFor="contactUsDescription">{t("Contact Us Description")}</Label>
            <Textarea
              id="contactUsDescription"
              value={cookieSettings.contactUsDescription}
              onChange={(e) => handleCookieSettingsChange('contactUsDescription', e.target.value)}
              placeholder={t("Enter the contact us description for cookie inquiries")}
              rows={3}
            />
          </div>

          {/* Contact Us URL */}
          <div className="grid gap-2">
            <Label htmlFor="contactUsUrl">{t("Contact Us URL")}</Label>
            <Input
              id="contactUsUrl"
              type="url"
              value={cookieSettings.contactUsUrl}
              onChange={(e) => handleCookieSettingsChange('contactUsUrl', e.target.value)}
              placeholder={t("Enter the contact us URL for cookie inquiries")}
            />
          </div>
        </div>

        {/* Download CSV Section */}
        {cookieSettings.enableLogging && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t("Download Accepted Cookies")}</h4>
                <p className="text-sm text-muted-foreground">
                 {t(" Download a CSV file of accepted cookie preferences")}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={downloadCookieCSV}>
                <Download className="h-4 w-4 mr-2" />
               {t(" Download CSV")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </SettingsSection>
  );
}