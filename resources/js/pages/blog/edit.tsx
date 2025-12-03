import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import MediaPicker from '@/components/MediaPicker';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export default function EditBlog() {
  const { t } = useTranslation();
  const { blog } = usePage().props as any;
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: blog.title || '',
    slug: blog.slug || '',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    featured_image: blog.featured_image || '',
    category_id: blog.category_id ? blog.category_id.toString() : '',
    status: blog.status || 'draft',
    published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : '',
    is_featured: blog.is_featured || false,
    allow_comments: blog.allow_comments !== undefined ? blog.allow_comments : true,
    tags: blog.tags_string || '',
    meta_title: blog.meta_title || '',
    meta_description: blog.meta_description || '',
    focus_keyword: blog.focus_keyword || '',
    index_in_search: blog.index_in_search !== undefined ? blog.index_in_search : true
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetch(route('api.blog-categories'))
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories || []);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

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
  };

  const handleFeaturedImageChange = (value) => {
    setFormData(prev => ({
      ...prev,
      featured_image: value
    }));
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
    router.put(route('blog.update', blog.id), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('blog.index'))
    },
    {
      label: t('Update Post'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('Edit Blog Post')}
      url="/blog/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Blog System'), href: route('blog.index') },
        { title: t('Edit Blog Post') }
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
                <CardTitle>{t('Post Content')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('Post Title *')}</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={generateSlug}
                    placeholder={t('Enter post title')} 
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">{t('Excerpt')}</Label>
                  <Input 
                    id="excerpt" 
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder={t('Brief description of the post')} 
                  />
                </div>
                <div>
                  <MediaPicker
                    label={t('Featured Image')}
                    value={formData.featured_image}
                    onChange={handleFeaturedImageChange}
                    placeholder={t('Select featured image...')}
                  />
                </div>
                <div>
                  <Label>{t('Post Content')}</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder={t('Write your blog post content here...')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Post Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category_id">{t('Category')}</Label>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-xs" 
                        onClick={() => router.visit(route('blog.categories.index'))}
                      >
                        {t('Manage Categories')}
                      </Button>
                    </div>
                    <Select 
                      value={formData.category_id} 
                      onValueChange={(value) => handleSelectChange('category_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="">{t('No categories found')}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="slug">{t('URL Slug')}</Label>
                    <Input 
                      id="slug" 
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder={t('post-url-slug')} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">{t('Post Status')}</Label>
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
                        <SelectItem value="scheduled">{t('Scheduled')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="published_at">{t('Publish Date')}</Label>
                    <Input 
                      id="published_at" 
                      name="published_at"
                      type="datetime-local" 
                      value={formData.published_at}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">{t('Tags')}</Label>
                  <Input 
                    id="tags" 
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder={t('Enter tags separated by commas')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Featured Post')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Mark as featured post')}</p>
                  </div>
                  <Switch 
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Allow Comments')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable comments for this post')}</p>
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
                <CardTitle>{t('SEO Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">{t('Meta Title')}</Label>
                  <Input 
                    id="meta_title" 
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder={t('SEO title for search engines')} 
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">{t('Meta Description')}</Label>
                  <Input 
                    id="meta_description" 
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder={t('SEO description for search engines')} 
                  />
                </div>
                <div>
                  <Label htmlFor="focus_keyword">{t('Focus Keyword')}</Label>
                  <Input 
                    id="focus_keyword" 
                    name="focus_keyword"
                    value={formData.focus_keyword}
                    onChange={handleInputChange}
                    placeholder={t('Main keyword for this post')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Index in Search Engines')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow search engines to index this post')}</p>
                  </div>
                  <Switch 
                    checked={formData.index_in_search}
                    onCheckedChange={(checked) => handleSwitchChange('index_in_search', checked)}
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