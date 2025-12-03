import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Package, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';

export default function ShowCategory() {
  const { t } = useTranslation();
  const { category, subcategories, productCount, stats } = usePage().props as any;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const handleDelete = () => {
    router.delete(route('categories.destroy', category.id));
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('categories.index'))
    },
    {
      label: t('Edit Category'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('categories.edit', category.id))
    },
    {
      label: t('Delete'),
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: () => setDeleteDialogOpen(true)
    }
  ];

  return (
    <PageTemplate 
      title={t('Category Details')}
      url="/categories/show"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Categories', href: route('categories.index') },
        { title: 'Category Details' }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Category Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Category Name')}</p>
                <p className="text-lg font-semibold">{category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Slug')}</p>
                <p>/{category.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Status')}</p>
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? t('Active') : t('Inactive')}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Description')}</p>
                <p>{category.description || t('No description provided')}</p>
              </div>
              {category.image && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Category Image')}</p>
                  <div className="mt-2">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Parent Category')}</p>
                <p>{category.parent ? category.parent.name : t('None (Root Category)')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Category Statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Total Products')}</span>
                <span className="font-semibold">{stats?.total_products || productCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Active Products')}</span>
                <span className="font-semibold">{stats?.active_products || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Sub Categories')}</span>
                <span className="font-semibold">{stats?.subcategories_count || subcategories?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Total Revenue')}</span>
                <span className="font-semibold">{formatCurrency(stats?.total_revenue || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Sort Order')}</span>
                <span className="font-semibold">{category.sort_order}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Created')}</span>
                <span className="text-sm">{new Date(category.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Updated')}</span>
                <span className="text-sm">{new Date(category.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {subcategories && subcategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Sub Categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subcategories.map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t('{{count}} products', { count: sub.products_count || 0 })}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.visit(route('categories.show', sub.id))}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Category')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete this category? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}