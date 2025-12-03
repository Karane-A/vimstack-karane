import React, { useState, FormEvent } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

export default function CreateTax() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    type: 'percentage',
    region: '',
    priority: '1',
    compound: false,
    is_active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };
  
  const handleCompoundChange = (value: string) => {
    setFormData(prev => ({ ...prev, compound: value === 'yes' }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.post(route('tax.store'), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('tax.index'))
    },
    {
      label: t('Save Tax'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('Create Tax Rule')}
      url="/tax/create"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Tax Management', href: route('tax.index') },
        { title: 'Create Tax Rule' }
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Tax Rule Information')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('Tax Name')}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder={t('Enter tax name')} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="rate">{t('Tax Rate (%)')}</Label>
                <Input 
                  id="rate" 
                  name="rate" 
                  type="number" 
                  step="0.01" 
                  value={formData.rate} 
                  onChange={handleChange} 
                  placeholder="0.00" 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">{t('Tax Type')}</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select tax type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{t('Percentage')}</SelectItem>
                    <SelectItem value="fixed">{t('Fixed Amount')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">{t('Region')}</Label>
                <Input 
                  id="region" 
                  name="region" 
                  value={formData.region} 
                  onChange={handleChange} 
                  placeholder={t('Enter region/country')} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">{t('Priority')}</Label>
                <Input 
                  id="priority" 
                  name="priority" 
                  type="number" 
                  value={formData.priority} 
                  onChange={handleChange} 
                  placeholder="1" 
                />
              </div>
              <div>
                <Label htmlFor="compound">{t('Compound Tax')}</Label>
                <Select 
                  value={formData.compound ? 'yes' : 'no'} 
                  onValueChange={(value) => handleCompoundChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select compound option')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">{t('No')}</SelectItem>
                    <SelectItem value="yes">{t('Yes')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('Tax Status')}</Label>
                <p className="text-sm text-muted-foreground">{t('Enable or disable tax rule')}</p>
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