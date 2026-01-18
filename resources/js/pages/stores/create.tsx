import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { getStoreThemes } from '@/data/storeThemes';
import MediaPicker from '@/components/MediaPicker';

export default function CreateStore({ availableThemes, planPermissions }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    theme: 'home-accessories',
    enable_custom_domain: false,
    enable_custom_subdomain: false,
    custom_domain: '',
    custom_subdomain: '',
    // PWA Settings
    enable_pwa: false,
    pwa_name: '',
    pwa_short_name: '',
    pwa_description: '',
    pwa_theme_color: '#3B82F6',
    pwa_background_color: '#ffffff',
    pwa_icon: '',
    pwa_display: 'standalone',
    pwa_orientation: 'portrait',
  });
  
  // Auto-generate slug from name if slug is empty
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-generate slug if it's empty
      slug: prev.slug === '' ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : prev.slug,
      // Auto-populate PWA fields if they're empty
      pwa_name: prev.pwa_name === '' ? name : prev.pwa_name,
      pwa_short_name: prev.pwa_short_name === '' ? name.substring(0, 12) : prev.pwa_short_name,
    }));
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked,
      // If enabling one, disable the other
      ...(field === 'enable_custom_domain' && checked ? { enable_custom_subdomain: false } : {}),
      ...(field === 'enable_custom_subdomain' && checked ? { enable_custom_domain: false } : {}),
    }));
  };
  
  const handleSubmit = () => {
    router.post(route('stores.store'), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('stores.index'))
    },
    {
      label: t('Save Store'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('Create Store')}
      url="/stores/create"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Store Management', href: route('stores.index') },
        { title: 'Create Store' }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className={`grid w-full ${planPermissions?.pwa_business ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="info">{t('Store Information')}</TabsTrigger>
            <TabsTrigger value="theme">{t('Store Theme')}</TabsTrigger>
            {planPermissions?.pwa_business && (
              <TabsTrigger value="pwa">{t('PWA Settings')}</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Store Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('Store Name')}</Label>
                    <Input id="name" placeholder={t('Enter store name')} value={formData.name} onChange={handleNameChange} />
                  </div>
                  <div>
                    <Label htmlFor="slug">{t('Store Slug')}</Label>
                    <Input id="slug" placeholder={t('store-slug')} value={formData.slug} onChange={handleChange} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('URL slug for your store. Leave empty to auto-generate from store name.')}
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{t('Description')}</Label>
                  <Textarea id="description" placeholder={t('Store description')} value={formData.description} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="email">{t('Store Email')}</Label>
                  <Input id="email" type="email" placeholder={t('store@example.com')} value={formData.email} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>
            
            {/* Domain Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>{t('Domain Configuration')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Custom Domain */}
                {planPermissions?.enable_custdomain && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable_custom_domain">{t('Enable Custom Domain')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('Use your own domain (e.g., example.com)')}
                        </p>
                      </div>
                      <Switch
                        id="enable_custom_domain"
                        checked={formData.enable_custom_domain}
                        onCheckedChange={(checked) => handleSwitchChange('enable_custom_domain', checked)}
                      />
                    </div>
                    {formData.enable_custom_domain && (
                      <div>
                        <Label htmlFor="custom_domain">{t('Custom Domain')}</Label>
                        <Input
                          id="custom_domain"
                          placeholder={t('example.com')}
                          value={formData.custom_domain}
                          onChange={handleChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Point your domain A record to your server IP')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Custom Subdomain */}
                {planPermissions?.enable_custsubdomain && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable_custom_subdomain">{t('Enable Custom Subdomain')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('Use a subdomain (e.g., mystore.yourdomain.com)')}
                        </p>
                      </div>
                      <Switch
                        id="enable_custom_subdomain"
                        checked={formData.enable_custom_subdomain}
                        onCheckedChange={(checked) => handleSwitchChange('enable_custom_subdomain', checked)}
                      />
                    </div>
                    {formData.enable_custom_subdomain && (
                      <div>
                        <Label htmlFor="custom_subdomain">{t('Subdomain')}</Label>
                        <Input
                          id="custom_subdomain"
                          placeholder={t('mystore')}
                          value={formData.custom_subdomain}
                          onChange={handleChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Will create: {{subdomain}}.yourdomain.com', { subdomain: formData.custom_subdomain || 'mystore' })}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {!planPermissions?.enable_custdomain && !planPermissions?.enable_custsubdomain && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t('Domain features are not available in your current plan. Your store will be accessible via slug-based URL.')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Store Theme')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('Choose a theme that best fits your store type and brand.')}
                </p>
                
                {availableThemes !== null && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>{t('Plan Limitation')}:</strong> {t('Your current plan allows access to {{count}} theme(s).', { count: availableThemes.length })}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getStoreThemes().filter(theme => 
                    availableThemes === null || availableThemes.includes(theme.id)
                  ).map((theme) => (
                    <div 
                      key={theme.id}
                      className={`cursor-pointer rounded-lg border-2 p-1 transition-all duration-200 ${
                        formData.theme === theme.id ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-md theme-preview-container">
                        <img
                          src={theme.thumbnail}
                          alt={theme.name}
                          className="h-full w-full object-cover theme-preview-image"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/300x180?text=${encodeURIComponent(theme.name)}`;
                          }}
                        />
                        {formData.theme === theme.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                            <div className="rounded-full bg-primary p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm">{theme.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {planPermissions?.pwa_business && (
            <TabsContent value="pwa" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('PWA Configuration')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable_pwa">{t('Enable PWA')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Allow customers to install your store as a mobile app')}
                      </p>
                    </div>
                    <Switch
                      id="enable_pwa"
                      checked={formData.enable_pwa}
                      onCheckedChange={(checked) => handleSwitchChange('enable_pwa', checked)}
                    />
                  </div>

                {formData.enable_pwa && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pwa_name">{t('App Name')}</Label>
                        <Input 
                          id="pwa_name" 
                          value={formData.pwa_name} 
                          onChange={handleChange}
                          placeholder={t('My Store App')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pwa_short_name">{t('Short Name')}</Label>
                        <Input 
                          id="pwa_short_name" 
                          value={formData.pwa_short_name} 
                          onChange={handleChange}
                          placeholder={t('MyStore')}
                          maxLength={12}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Max 12 characters for home screen')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pwa_description">{t('App Description')}</Label>
                      <Textarea 
                        id="pwa_description" 
                        value={formData.pwa_description} 
                        onChange={handleChange}
                        placeholder={t('Shop amazing products from our store')}
                      />
                    </div>

                    <div>
                      <MediaPicker
                        label={t('PWA Icon')}
                        value={formData.pwa_icon}
                        onChange={(value) => setFormData(prev => ({ ...prev, pwa_icon: value }))}
                        placeholder={t('Select PWA icon (512x512 recommended)...')}
                        showPreview={true}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('Recommended: 512x512px PNG with transparent background')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pwa_theme_color">{t('Theme Color')}</Label>
                        <Input 
                          id="pwa_theme_color" 
                          type="color"
                          value={formData.pwa_theme_color} 
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pwa_background_color">{t('Background Color')}</Label>
                        <Input 
                          id="pwa_background_color" 
                          type="color"
                          value={formData.pwa_background_color} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pwa_display">{t('Display Mode')}</Label>
                        <select 
                          id="pwa_display"
                          value={formData.pwa_display}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="standalone">{t('Standalone')}</option>
                          <option value="fullscreen">{t('Fullscreen')}</option>
                          <option value="minimal-ui">{t('Minimal UI')}</option>
                          <option value="browser">{t('Browser')}</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="pwa_orientation">{t('Orientation')}</Label>
                        <select 
                          id="pwa_orientation"
                          value={formData.pwa_orientation}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="portrait">{t('Portrait')}</option>
                          <option value="landscape">{t('Landscape')}</option>
                          <option value="any">{t('Any')}</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageTemplate>
  );
}