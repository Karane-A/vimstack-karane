import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function EmailNotificationSettings() {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;
  
  // Get settings data from page props
  const settingsData = pageProps.systemSettings || pageProps.settings || pageProps.globalSettings || {};
  
  const emailTemplates = [
    { key: 'Order Created', label: 'Order Created' },
    { key: 'Order Created For Owner', label: 'Order Created For Owner' },
    { key: 'Owner And Store Created', label: 'Owner And Store Created' },
    { key: 'Status Change', label: 'Status Change' },
  ];
  
  const [notifications, setNotifications] = useState(() => {
    const initial: Record<string, boolean> = {};
    emailTemplates.forEach(template => {
      initial[template.key] = settingsData[template.key] === 'on';
    });
    return initial;
  });
  
  // Update state when settings change
  useEffect(() => {
    if (Object.keys(settingsData).length > 0) {
      const updatedNotifications: Record<string, boolean> = {};
      emailTemplates.forEach(template => {
        updatedNotifications[template.key] = settingsData[template.key] === 'on';
      });
      setNotifications(updatedNotifications);
    }
  }, [settingsData]);

  const handleToggle = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mailNoti = Object.entries(notifications).reduce((acc, [key, value]) => {
      acc[key] = value ? 'on' : 'off';
      return acc;
    }, {} as Record<string, string>);

    router.post(route('email.notification.setting.store'), {
      mail_noti: mailNoti
    }, {
      preserveScroll: true
    });
  };

  return (
    <SettingsSection
      title={t('Email Notification Settings')}
      description={t('Configure email notification preferences for your store')}
      action={
        <Button type="submit" form="email-notification-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t('Save Changes')}
        </Button>
      }
    >
      <form id="email-notification-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emailTemplates.map((template) => (
            <div key={template.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label htmlFor={template.key} className="font-medium text-gray-900">
                {t(template.label)}
              </Label>
              <Switch
                id={template.key}
                checked={notifications[template.key] || false}
                onCheckedChange={(checked) => handleToggle(template.key, checked)}
              />
            </div>
          ))}
        </div>
      </form>
    </SettingsSection>
  );
}