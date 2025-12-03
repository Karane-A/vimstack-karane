import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, FileType, Eye, Edit, Trash2, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/components/Permission';

export default function CustomPages() {
  const { t } = useTranslation();
  const { pages, stats } = usePage().props as any;
  const { hasPermission } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const pageActions = [];
  
  if (hasPermission('create-custom-pages')) {
    pageActions.push({
      label: t('Create Page'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('custom-pages.create'))
    });
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Published': return 'default';
      case 'Draft': return 'secondary';
      case 'Private': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <>
      <PageTemplate 
        title={t('Custom Pages')}
        url="/custom-pages"
        actions={pageActions}
        breadcrumbs={[
          { title: t('Dashboard'), href: route('dashboard') },
          { title: t('Custom Pages') }
        ]}
      >
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Pages')}</CardTitle>
                <FileType className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPages}</div>
                <p className="text-xs text-muted-foreground">{t('All pages')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedPages}</div>
                <p className="text-xs text-muted-foreground">
                  {t('{{percent}}% published', { percent: stats.totalPages > 0 ? Math.round((stats.publishedPages / stats.totalPages) * 100) : 0 })}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('Draft Pages')}</CardTitle>
                <FileType className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draftPages}</div>
                <p className="text-xs text-muted-foreground">{t('Work in progress')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('Page Views')}</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{t('Total views')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Custom Pages List */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Custom Pages')}</CardTitle>
            </CardHeader>
            <CardContent>
              {pages.length === 0 ? (
                <div className="text-center py-12">
                  <FileType className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">{t('No pages found')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('Get started by creating your first custom page.')}
                  </p>
                  <Permission permission="create-custom-pages">
                    <Button 
                      onClick={() => router.visit(route('custom-pages.create'))} 
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Create Page')}
                    </Button>
                  </Permission>
                </div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileType className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{page.title}</h3>
                            <Badge variant={getStatusVariant(page.status.charAt(0).toUpperCase() + page.status.slice(1))}>
                              {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">/{page.slug}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">{t('{{count}} views', { count: page.views })}</span>
                            <span className="text-xs text-muted-foreground">{t('Modified: {{date}}', { date: new Date(page.updated_at).toLocaleDateString() })}</span>
                            <span className="text-xs text-muted-foreground">{t('Template: {{template}}', { template: page.template })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Permission permission="view-custom-pages">
                          <Button variant="ghost" size="sm" onClick={() => router.visit(route('custom-pages.show', page.id))}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Permission>
                        <Permission permission="edit-custom-pages">
                          <Button variant="ghost" size="sm" onClick={() => router.visit(route('custom-pages.edit', page.id))}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Permission>
                        <Permission permission="delete-custom-pages">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedPage(page);
                            setIsDeleteDialogOpen(true);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Permission>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageTemplate>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Page')}</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>{t('Are you sure you want to delete this page? This action cannot be undone.')}</p>
            <p className="font-semibold mt-2">{selectedPage?.title}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('Cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedPage) {
                  router.delete(route('custom-pages.destroy', selectedPage.id));
                }
                setIsDeleteDialogOpen(false);
              }}
            >
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}