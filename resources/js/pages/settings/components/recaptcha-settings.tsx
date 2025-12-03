import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

interface RecaptchaSettingsProps {
  settings?: Record<string, string>;
}

export default function RecaptchaSettings({ settings = {} }: RecaptchaSettingsProps) {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;
  
  // Default settings
  const defaultSettings = {
    recaptchaEnabled: false,
    recaptchaVersion: 'v2',
    recaptchaSiteKey: '',
    recaptchaSecretKey: ''
  };
  
  // Combine settings from props and page props
  const settingsData = Object.keys(settings).length > 0 
    ? settings 
    : (pageProps.systemSettings || {});
  
  // Initialize state with merged settings
  const [recaptchaSettings, setRecaptchaSettings] = useState(() => ({
    recaptchaEnabled: settingsData.recaptchaEnabled === 'true' || settingsData.recaptchaEnabled === true || settingsData.recaptchaEnabled === 1 || settingsData.recaptchaEnabled === '1',
    recaptchaVersion: settingsData.recaptchaVersion || defaultSettings.recaptchaVersion,
    recaptchaSiteKey: settingsData.recaptchaSiteKey || defaultSettings.recaptchaSiteKey,
    recaptchaSecretKey: settingsData.recaptchaSecretKey || defaultSettings.recaptchaSecretKey
  }));

  // Handle form changes
  const handleSettingsChange = (field: string, value: string | boolean) => {
    setRecaptchaSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const submitRecaptchaSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to backend using Inertia
    router.post(route('settings.recaptcha.update'), recaptchaSettings, {
      preserveScroll: true,
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update ReCaptcha settings');
        toast.error(errorMessage);
      }
    });
  };

  return (
    <SettingsSection
      title={t("ReCaptcha Settings")}
      description={t("Configure Google ReCaptcha settings for form protection")}
      action={
        <Button type="submit" form="recaptcha-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t("Save Changes")}
        </Button>
      }
    >
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
        <strong>{t("Note")}:</strong> <a href="https://phppot.com/php/how-to-get-google-recaptcha-site-and-secret-key/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">{t("How to Get Google reCaptcha Site and Secret key")}</a>
      </div>
      
      <form id="recaptcha-settings-form" onSubmit={submitRecaptchaSettings} className="space-y-6">
        <div className="grid gap-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="recaptchaEnabled">{t("Enable ReCaptcha")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Show ReCaptcha on authentication pages")}
              </p>
            </div>
            <Switch
              id="recaptchaEnabled"
              checked={recaptchaSettings.recaptchaEnabled}
              onCheckedChange={(checked) => handleSettingsChange('recaptchaEnabled', checked)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="recaptchaVersion">{t("Google Recaptcha Version")}</Label>
            <Select 
              value={recaptchaSettings.recaptchaVersion} 
              onValueChange={(value) => handleSettingsChange('recaptchaVersion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select version")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v2">v2</SelectItem>
                <SelectItem value="v3">v3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recaptchaSiteKey">{t("Site Key")}</Label>
            <Input
              id="recaptchaSiteKey"
              name="recaptchaSiteKey"
              type="text"
              value={recaptchaSettings.recaptchaSiteKey}
              onChange={(e) => handleSettingsChange('recaptchaSiteKey', e.target.value)}
              placeholder={t("Enter your Google ReCaptcha site key")}
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="recaptchaSecretKey">{t("Secret Key")}</Label>
            <Input
              id="recaptchaSecretKey"
              name="recaptchaSecretKey"
              type="password"
              value={recaptchaSettings.recaptchaSecretKey}
              onChange={(e) => handleSettingsChange('recaptchaSecretKey', e.target.value)}
              placeholder={t("Enter your Google ReCaptcha secret key")}
            />
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}