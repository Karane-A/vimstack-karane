import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Package, Eye, Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';
import { formatCurrency } from '@/utils/helpers';

export default function Products() {
  const { t } = useTranslation();
  const { products, stats } = usePage().props as any;
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const { hasPermission } = usePermissions();
  
  const handleDelete = () => {
    if (productToDelete) {
      router.delete(route('products.destroy', productToDelete));
      setProductToDelete(null);
    }
  };

  const pageActions = [];
  
  if (hasPermission('export-products')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('products.export'), '_blank')
    });
  }
  
  if (hasPermission('create-products')) {
    pageActions.push({
      label: t('Create Product'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('products.create'))
    });
  }

  return (
    <PageTemplate 
      title={t('Products')}
      url="/products"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Products' }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Products')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('All products')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Products')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {t('{{percent}}% active rate', { percent: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0 })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Low Stock')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground">{t('Need restocking')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Value')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t('Inventory value')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Product Catalog')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">{t('No products found')}</p>
                  <Permission permission="create-products">
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => router.visit(route('products.create'))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Create your first product')}
                    </Button>
                  </Permission>
                </div>
              ) : (
                products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border">
                        {product.cover_image ? (
                          <img
                            src={getImageUrl(product.cover_image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? t('Active') : t('Inactive')}
                          </Badge>
                          {product.stock <= 0 && (
                            <Badge variant="destructive">{t('Out of Stock')}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{t('SKU: {{sku}}', { sku: product.sku || '-' })}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                          <span className="text-xs text-muted-foreground">{t('Stock: {{stock}}', { stock: product.stock })}</span>
                          <span className="text-xs text-muted-foreground">{product.category?.name || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Permission permission="view-products">
                        <Button variant="ghost" size="sm" onClick={() => router.visit(route('products.show', product.id))}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Permission>
                      <Permission permission="edit-products">
                        <Button variant="ghost" size="sm" onClick={() => router.visit(route('products.edit', product.id))}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Permission>
                      <Permission permission="delete-products">
                        <Button variant="ghost" size="sm" onClick={() => setProductToDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Permission>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Product')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete this product? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
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