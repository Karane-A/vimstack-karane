import React, { useState, FormEvent, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import MediaPicker from '@/components/MediaPicker';

export default function EditCategory() {
  const { t } = useTranslation();
  const { category, parentCategories } = usePage().props as any;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parent_id: '',
    sort_order: 0,
    is_active: true
  });

  // Initialize form data from category prop
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        parent_id: category.parent_id ? String(category.parent_id) : 'none',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== undefined ? category.is_active : true
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert 'none' to empty string for parent_id
    const finalValue = name === 'parent_id' && value === 'none' ? '' : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({ ...prev, image: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.put(route('categories.update', category.id), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('categories.index'))
    },
    {
      label: t('Update Category'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('Edit Category')}
      url="/categories/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Categories', href: route('categories.index') },
        { title: 'Edit Category' }
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Category Information')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('Category Name')}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder={t('Enter category name')} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="description">{t('Description')}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder={t('Category description')} 
                />
              </div>
            </div>
            <div>
              <MediaPicker
                label={t('Category Image')}
                value={formData.image}
                onChange={handleImageChange}
                placeholder={t('Select category image...')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_id">{t('Parent Category')}</Label>
                <Select 
                  value={formData.parent_id} 
                  onValueChange={(value) => handleSelectChange('parent_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select parent category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('None (Root Category)')}</SelectItem>
                    {parentCategories && parentCategories.map((parentCategory: any) => (
                      // Skip the current category to prevent self-reference
                      parentCategory.id !== category.id && (
                        <SelectItem key={parentCategory.id} value={String(parentCategory.id)}>
                          {parentCategory.name}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">{t('Sort Order')}</Label>
                <Input 
                  id="sort_order" 
                  name="sort_order" 
                  type="number" 
                  value={formData.sort_order} 
                  onChange={handleChange} 
                  placeholder="0" 
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('Category Status')}</Label>
                <p className="text-sm text-muted-foreground">{t('Enable or disable category')}</p>
              </div>
              <Switch 
                checked={formData.is_active} 
                onCheckedChange={handleSwitchChange} 
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </PageTemplate>
  );
}