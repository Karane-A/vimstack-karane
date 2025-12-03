import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Globe, Eye, Calendar, FileType } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';

export default function ShowCustomPage() {
  const { t } = useTranslation();
  const { page } = usePage().props as any;

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('custom-pages.index'))
    },
    {
      label: t('Edit Page'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('custom-pages.edit', page.id))
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'private': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <PageTemplate 
      title={t('Page Details')}
      url="/custom-pages/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Custom Pages'), href: route('custom-pages.index') },
        { title: t('Page Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{page.title}</CardTitle>
                <Badge variant={getStatusBadgeVariant(page.status)}>
                  {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>/{page.slug}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{t('Modified: {{date}}', { date: formatDate(page.updated_at) })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{t('{{count}} views', { count: page.views })}</span>
                </div>
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Page Statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{page.views}</div>
                <p className="text-sm text-muted-foreground">{t('Total Views')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Page Settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Template')}</span>
                <span>{page.template.charAt(0).toUpperCase() + page.template.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge variant={getStatusBadgeVariant(page.status)}>
                  {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Created Date')}</span>
                <span>{formatDate(page.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Last Modified</span>
                <span>{formatDate(page.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Show in Navigation')}</span>
                <Badge variant={page.show_in_navigation ? "default" : "secondary"}>
                  {page.show_in_navigation ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Comments Enabled')}</span>
                <Badge variant={page.allow_comments ? "default" : "secondary"}>
                  {page.allow_comments ? t('Yes') : t('No')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta Title</p>
                <p className="text-sm">{page.meta_title || page.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Meta Description')}</p>
                <p className="text-sm">{page.meta_description || t('No description provided')}</p>
              </div>
              {page.meta_keywords && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Meta Keywords')}</p>
                  <p className="text-sm">{page.meta_keywords}</p>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Search Index')}</span>
                <Badge variant={page.index_in_search ? "default" : "secondary"}>
                  {page.index_in_search ? t('Enabled') : t('Disabled')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Follow Links')}</span>
                <Badge variant={page.follow_links ? "default" : "secondary"}>
                  {page.follow_links ? t('Enabled') : t('Disabled')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
}