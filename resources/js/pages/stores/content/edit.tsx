import React from 'react';
import { useForm } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import MediaLibraryButton from '@/components/MediaLibraryButton';
import { getImageUrl } from '@/utils/image-helper';

interface Store {
  id: number;
  name: string;
}

interface Props {
  store: Store;
  settings: any;
  theme?: string;
}

export default function StoreContentEdit({ store, settings, theme = 'default' }: Props) {
  const { t } = useTranslation();
  const { data, setData, put, processing } = useForm({
    content: settings,
    theme: theme
  });

  const updateNestedField = (path: string[], value: any) => {
    const newContent = { ...data.content };
    let current = newContent;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setData('content', newContent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('stores.content.update', store.id));
  };

  const renderField = (key: string, value: any, path: string[] = []) => {
    const currentPath = [...path, key];
    const fieldId = currentPath.join('_');

    if (value === undefined) return null;
    if (value === null) value = '';

    // Boolean fields
    if (typeof value === 'boolean') {
      return (
        <div key={fieldId} className="flex items-center space-x-2">
          <Switch
            checked={value}
            onCheckedChange={(checked) => updateNestedField(currentPath, checked)}
          />
          <Label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
        </div>
      );
    }

    // String fields
    if (typeof value === 'string') {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      // Check if this is an image field based on key name, value content, or if it's from theme config with type 'image'
      const isImage = key.includes('image') || key.includes('logo') || 
                     (typeof value === 'string' && value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)) ||
                     (typeof value === 'string' && value.includes('unsplash.com'));
      const isLongText = !isImage && (value.length > 100 || key.includes('description') || key.includes('subtitle'));

      return (
        <div key={fieldId}>
          <Label htmlFor={fieldId}>{label}</Label>
          {isLongText ? (
            <Textarea
              id={fieldId}
              value={value}
              onChange={(e) => updateNestedField(currentPath, e.target.value)}
              placeholder={t('Enter {{field}}', { field: label.toLowerCase() })}
            />
          ) : (
            <div className={isImage ? "space-y-2" : ""}>
              <div className={isImage ? "flex gap-2" : ""}>
                <Input
                  id={fieldId}
                  value={value}
                  onChange={(e) => updateNestedField(currentPath, e.target.value)}
                  placeholder={t('Enter {{field}}', { field: label.toLowerCase() })}
                />
                {isImage && (
                  <MediaLibraryButton 
                    onSelect={(url) => updateNestedField(currentPath, url)}
                    selectedUrl={value}
                  />
                )}
              </div>
              {isImage && value && (
                <div>
                  <img 
                    key={value}
                    src={getImageUrl(value)} 
                    alt={label} 
                    className="w-20 h-12 object-contain rounded border bg-white"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Array fields
    if (Array.isArray(value)) {
      return (
        <div key={fieldId} className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Label>
            {(key !== 'info_boxes' || value.length < 3) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                let newItem = {};
                if (value.length > 0) {
                  newItem = { ...value[0] };
                  Object.keys(newItem).forEach(k => {
                    if (typeof newItem[k] === 'string') newItem[k] = '';
                    if (typeof newItem[k] === 'boolean') newItem[k] = false;
                  });
                } else {
                  if (key === 'info_boxes') {
                    newItem = { icon: 'truck', title: 'New Feature', description: 'Description here' };
                  } else if (key === 'logos') {
                    newItem = { name: 'Brand Name', image: '/storage/brands/logo.png' };
                  } else if (key === 'links') {
                    newItem = { name: 'Link Name', href: '/page-url' };
                  } else if (key === 'social_links') {
                    newItem = { platform: 'facebook', url: 'https://facebook.com/yourpage' };
                  } else {
                    newItem = { title: 'New Item', description: 'Description' };
                  }
                }
                  updateNestedField(currentPath, [...value, newItem]);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('Add Item')}
              </Button>
            )}
          </div>
          {value.map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{t('Item {{number}}', { number: index + 1 })}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newArray = value.filter((_: any, i: number) => i !== index);
                    updateNestedField(currentPath, newArray);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {key === 'social_links' ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(item).filter(([itemKey]) => itemKey !== 'type' && itemKey !== 'max_items').map(([itemKey, itemValue]) => 
                    renderField(itemKey, itemValue, [...currentPath, index.toString()])
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {Object.entries(item).filter(([itemKey]) => itemKey !== 'type' && itemKey !== 'max_items').map(([itemKey, itemValue]) => 
                    renderField(itemKey, itemValue, [...currentPath, index.toString()])
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Object fields
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={fieldId} className="space-y-4">
          <Label className="text-base font-medium">
            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Label>
          <div className="grid gap-4 pl-4 border-l-2 border-gray-200">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderField(subKey, subValue, currentPath)
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSection = (sectionKey: string, sectionData: any) => {
    const sectionTitle = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <Card key={sectionKey}>
        <CardHeader>
          <CardTitle>{sectionTitle}</CardTitle>
          <CardDescription>{t('Configure {{section}} content', { section: sectionTitle.toLowerCase() })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(sectionData).map(([key, value]) => 
            renderField(key, value, [sectionKey])
          )}
        </CardContent>
      </Card>
    );
  };

  const getSectionTabs = () => {
    const sections = Object.keys(data.content || {});
    
    return sections.map(sectionKey => ({
      key: sectionKey,
      label: sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      sections: [sectionKey]
    }));
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('stores.content.index'))
    },
    {
      label: processing ? t('Saving...') : t('Save Changes'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit,
      disabled: processing
    }
  ];

  const tabs = getSectionTabs();

  return (
    <PageTemplate 
      title={t('Manage Content - {{storeName}}', { storeName: store.name })}
      url={`/stores/content/${store.id}`}
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Store Management', href: route('stores.index') },
        { title: 'Store Content', href: route('stores.content.index') },
        { title: store.name }
      ]}
    >
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue={tabs[0]?.key} className="w-full">
          <TabsList className="flex w-full flex-wrap">
            {tabs.map(tab => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.key} value={tab.key} className="space-y-6">
              {tab.sections.map(sectionKey => 
                data.content[sectionKey] ? renderSection(sectionKey, data.content[sectionKey]) : null
              )}
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </PageTemplate>
  );
}