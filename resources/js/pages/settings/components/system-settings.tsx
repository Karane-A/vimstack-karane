import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import languageData from '@/../../resources/lang/language.json';
import ReactCountryFlag from 'react-country-flag';
interface SystemSettingsProps {
  settings?: Record<string, string>;
  timezones?: Record<string, string>;
  dateFormats?: Record<string, string>;
  timeFormats?: Record<string, string>;
}

export default function SystemSettings({ 
  settings = {}, 
  timezones = {}, 
  dateFormats = {}, 
  timeFormats = {} 
}: SystemSettingsProps) {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;
  
  // Default settings
  const defaultSettings = {
    defaultLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    calendarStartDay: 'sunday',
    defaultTimezone: 'UTC',
    emailVerification: false,
    landingPageEnabled: true
  };
  
  // Get settings data from page props - prioritize systemSettings
  const settingsData = pageProps.systemSettings || settings || pageProps.globalSettings || {};
  
  // Initialize state with merged settings
  const [systemSettings, setSystemSettings] = useState(() => ({
    defaultLanguage: settingsData.defaultLanguage || defaultSettings.defaultLanguage,
    dateFormat: settingsData.dateFormat || defaultSettings.dateFormat,
    timeFormat: settingsData.timeFormat || defaultSettings.timeFormat,
    calendarStartDay: settingsData.calendarStartDay || defaultSettings.calendarStartDay,
    defaultTimezone: settingsData.defaultTimezone || defaultSettings.defaultTimezone,
    emailVerification: settingsData.emailVerification === 'true' || settingsData.emailVerification === true || defaultSettings.emailVerification,
    landingPageEnabled: settingsData.landingPageEnabled === 'true' || settingsData.landingPageEnabled === true || settingsData.landingPageEnabled === '1' || (settingsData.landingPageEnabled === undefined ? defaultSettings.landingPageEnabled : false)
  }));
  
  // Update state when settings change
  useEffect(() => {
    if (Object.keys(settingsData).length > 0) {
      // Create merged settings object
      const mergedSettings = Object.keys(defaultSettings).reduce((acc, key) => {
        acc[key] = settingsData[key] || defaultSettings[key];
        return acc;
      }, {} as Record<string, string>);
      
      setSystemSettings(prevSettings => ({
        ...prevSettings,
        ...mergedSettings,
        emailVerification: mergedSettings.emailVerification === 'true' || mergedSettings.emailVerification === true || mergedSettings.emailVerification === '1',
        landingPageEnabled: mergedSettings.landingPageEnabled === 'true' || mergedSettings.landingPageEnabled === true || mergedSettings.landingPageEnabled === '1' || (mergedSettings.landingPageEnabled === undefined ? defaultSettings.landingPageEnabled : false)
      }));
    }
  }, [settingsData]);


  // Handle system settings form changes
  const handleSystemSettingsChange = (field: string, value: string | boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle system settings form submission
  const submitSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create clean settings object
    const cleanSettings = {
      defaultLanguage: systemSettings.defaultLanguage,
      dateFormat: systemSettings.dateFormat,
      timeFormat: systemSettings.timeFormat,
      calendarStartDay: systemSettings.calendarStartDay,
      defaultTimezone: systemSettings.defaultTimezone,
      emailVerification: Boolean(systemSettings.emailVerification),
      landingPageEnabled: Boolean(systemSettings.landingPageEnabled)
    };
    
    // Submit to backend using Inertia
    router.post(route('settings.system.update'), cleanSettings, {
      preserveScroll: true,
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update system settings');
        toast.error(errorMessage);
      }
    });
  };

  return (
    <SettingsSection
      title={t("System Settings")}
      description={t("Configure system-wide settings for your application")}
      action={
        <Button type="submit" form="system-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t("Save Changes")}
        </Button>
      }
    >
      <form id="system-settings-form" onSubmit={submitSystemSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="defaultLanguage">{t("Default Language")}</Label>
            <Select 
              value={systemSettings.defaultLanguage} 
              onValueChange={(value) => handleSystemSettingsChange('defaultLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select language")}>
                  {systemSettings.defaultLanguage && (() => {
                    const selectedLang = languageData.find(lang => lang.code === systemSettings.defaultLanguage);
                    return selectedLang ? <div className="flex items-center space-x-2">
                                        <ReactCountryFlag
                                            countryCode={selectedLang.countryCode}
                                            svg
                                            style={{
                                                width: '1.2em',
                                                height: '1.2em',
                                            }}
                                        /> <span>
                                            {selectedLang.name}
                                        </span> </div> : t("Select language");
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languageData.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center space-x-2">
                       <ReactCountryFlag
                                            countryCode={language.countryCode}
                                            svg
                                            style={{
                                                width: '1.2em',
                                                height: '1.2em',
                                            }}
                                        /> <span>
                                            {language.name}
                                        </span> 
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateFormat">{t("Date Format")}</Label>
            <Select 
              value={systemSettings.dateFormat} 
              onValueChange={(value) => handleSystemSettingsChange('dateFormat', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select date format")} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(dateFormats).length > 0 ? 
                  Object.entries(dateFormats).map(([format, example]) => (
                    <SelectItem key={format} value={format}>
                      <div className="flex items-center justify-between w-full">
                        <span>{format}</span>
                        <span className="text-muted-foreground text-sm ml-4">({example})</span>
                      </div>
                    </SelectItem>
                  )) : (
                    <>
                      <SelectItem value="M j, Y">Jan 1, 2025</SelectItem>
                      <SelectItem value="d-m-Y">01-01-2025</SelectItem>
                      <SelectItem value="Y-m-d">2025-01-01</SelectItem>
                      <SelectItem value="F j, Y">January 1, 2025</SelectItem>
                    </>
                  )
                }
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeFormat">{t("Time Format")}</Label>
            <Select 
              value={systemSettings.timeFormat} 
              onValueChange={(value) => handleSystemSettingsChange('timeFormat', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select time format")} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(timeFormats).length > 0 ? 
                  Object.entries(timeFormats).map(([format, example]) => (
                    <SelectItem key={format} value={format}>
                      <div className="flex items-center justify-between w-full">
                        <span>{format}</span>
                        <span className="text-muted-foreground text-sm ml-4">({example})</span>
                      </div>
                    </SelectItem>
                  )) : (
                    <>
                      <SelectItem value="g:i A">1:30 PM</SelectItem>
                      <SelectItem value="H:i">13:30</SelectItem>
                      <SelectItem value="g:i a">1:30 pm</SelectItem>
                    </>
                  )
                }
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="calendarStartDay">{t("Calendar Start Day")}</Label>
            <Select 
              value={systemSettings.calendarStartDay} 
              onValueChange={(value) => handleSystemSettingsChange('calendarStartDay', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select start day")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">{t("Sunday")}</SelectItem>
                <SelectItem value="monday">{t("Monday")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="defaultTimezone">{t("Default Timezone")}</Label>
            <Select 
              value={systemSettings.defaultTimezone} 
              onValueChange={(value) => handleSystemSettingsChange('defaultTimezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select timezone")} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(timezones).length > 0 ? 
                  Object.entries(timezones).map(([timezone, description]) => (
                    <SelectItem key={timezone} value={timezone}>
                      {description}
                    </SelectItem>
                  )) : (
                    <>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </>
                  )
                }
              </SelectContent>
            </Select>
          </div>

          {pageProps.auth?.user?.type === 'superadmin' && (
            <>
              <div className="grid gap-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailVerification">{t("Email Verification")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("Require users to verify their email addresses")}
                    </p>
                  </div>
                  <Switch
                    id="emailVerification"
                    checked={systemSettings.emailVerification}
                    onCheckedChange={(checked) => handleSystemSettingsChange('emailVerification', checked)}
                  />
                </div>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="landingPageEnabled">{t("Landing Page")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("Enable or disable the public landing page")}
                    </p>
                  </div>
                  <Switch
                    id="landingPageEnabled"
                    checked={systemSettings.landingPageEnabled}
                    onCheckedChange={(checked) => handleSystemSettingsChange('landingPageEnabled', checked)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </SettingsSection>
  );
}