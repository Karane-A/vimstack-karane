import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export default function CreateCustomPage() {
  const { t } = useTranslation();
  const { parentPages } = usePage().props as any;
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    template: 'default',
    status: 'draft',
    parent_id: 'null',
    order: 0,
    show_in_navigation: false,
    allow_comments: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    index_in_search: true,
    follow_links: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
    setContent(value);
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSubmit = () => {
    router.post(route('custom-pages.store'), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('custom-pages.index'))
    },
    {
      label: t('Save Page'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('Create Custom Page')}
      url="/custom-pages/create"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Custom Pages'), href: route('custom-pages.index') },
        { title: t('Create Custom Page') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">{t('Content')}</TabsTrigger>
            <TabsTrigger value="settings">{t('Settings')}</TabsTrigger>
            <TabsTrigger value="seo">{t('SEO')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Page Content')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('Page Title *')}</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={generateSlug}
                    placeholder={t('Enter page title')} 
                  />
                </div>
                <div>
                  <Label htmlFor="slug">{t('URL Slug *')}</Label>
                  <Input 
                    id="slug" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder={t('page-url-slug')} 
                  />
                </div>
                <div>
                  <Label>{t('Page Content')}</Label>
                  <RichTextEditor
                    value={content}
                    onChange={handleContentChange}
                    placeholder={t('Write your page content here...')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Page Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template">{t('Page Template')}</Label>
                    <Select
                      value={formData.template}
                      onValueChange={(value) => handleSelectChange('template', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select template')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">{t('Default')}</SelectItem>
                        <SelectItem value="legal">{t('Legal')}</SelectItem>
                        <SelectItem value="contact">{t('Contact')}</SelectItem>
                        <SelectItem value="faq">{t('FAQ')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">{t('Page Status')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t('Draft')}</SelectItem>
                        <SelectItem value="published">{t('Published')}</SelectItem>
                        <SelectItem value="private">{t('Private')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="parent">{t('Parent Page')}</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => handleSelectChange('parent_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select parent page (optional)')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">{t('None')}</SelectItem>
                      {parentPages && parentPages.map((page) => (
                        <SelectItem key={page.id} value={page.id.toString()}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order">{t('Page Order')}</Label>
                  <Input 
                    id="order" 
                    name="order"
                    type="number" 
                    value={formData.order.toString()}
                    onChange={handleInputChange}
                    placeholder="0" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Show in Navigation')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Display in site navigation menu')}</p>
                  </div>
                  <Switch 
                    checked={formData.show_in_navigation}
                    onCheckedChange={(checked) => handleSwitchChange('show_in_navigation', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Enable Comments')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow comments on this page')}</p>
                  </div>
                  <Switch 
                    checked={formData.allow_comments}
                    onCheckedChange={(checked) => handleSwitchChange('allow_comments', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">{t('Meta Title')}</Label>
                  <Input 
                    id="meta_title" 
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title for search engines" 
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">{t('Meta Description')}</Label>
                  <Input 
                    id="meta_description" 
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="SEO description for search engines" 
                  />
                </div>
                <div>
                  <Label htmlFor="meta_keywords">{t('Meta Keywords')}</Label>
                  <Input 
                    id="meta_keywords" 
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleInputChange}
                    placeholder={t('keyword1, keyword2, keyword3')} 
                  />
                </div>
                <div>
                  <Label htmlFor="canonical_url">{t('Canonical URL')}</Label>
                  <Input 
                    id="canonical_url" 
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleInputChange}
                    placeholder={t('https://example.com/page')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Index in Search Engines</Label>
                    <p className="text-sm text-muted-foreground">Allow search engines to index this page</p>
                  </div>
                  <Switch 
                    checked={formData.index_in_search}
                    onCheckedChange={(checked) => handleSwitchChange('index_in_search', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Follow Links')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow search engines to follow links on this page')}</p>
                  </div>
                  <Switch 
                    checked={formData.follow_links}
                    onCheckedChange={(checked) => handleSwitchChange('follow_links', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
}