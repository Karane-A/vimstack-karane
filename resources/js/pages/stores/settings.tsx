import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import MediaPicker from '@/components/MediaPicker';

interface Props {
  store: any;
  settings: any;
}

export default function StoreSettings({ store, settings }: Props) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(settings || {});

  const handleSave = () => {
    router.put(route('stores.settings.update', store.id), {
      settings: formData
    });
  };

  const updateSetting = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('stores.index'))
    },
    {
      label: t('Save Settings'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSave
    }
  ];

  return (
    <PageTemplate 
      title={t('Store Settings')}
      url="/stores/settings"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Store Management', href: route('stores.index') },
        { title: 'Store Settings' }
      ]}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('General Settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('Store Status')}</Label>
                <p className="text-sm text-muted-foreground">{t('Enable or disable store')}</p>
              </div>
              <Switch 
                checked={formData.store_status || false}
                onCheckedChange={(checked) => updateSetting('store_status', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('Maintenance Mode')}</Label>
                <p className="text-sm text-muted-foreground">{t('Put store in maintenance mode')}</p>
              </div>
              <Switch 
                checked={formData.maintenance_mode || false}
                onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Store Configuration')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <MediaPicker
                label={t('Store Logo')}
                value={formData.logo || ''}
                onChange={(value) => updateSetting('logo', value)}
                placeholder={t('Select store logo...')}
                showPreview={true}
              />
            </div>
            <div>
              <MediaPicker
                label={t('Store Favicon')}
                value={formData.favicon || ''}
                onChange={(value) => updateSetting('favicon', value)}
                placeholder={t('Select store favicon...')}
                showPreview={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}