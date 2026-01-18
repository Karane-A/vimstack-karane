import React, { useState, useRef } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Package, Eye, Edit, Trash2, Star, Upload, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';
import { formatCurrency } from '@/utils/helpers';

import { ResponsiveWrapper } from '@/components/mobile/responsive-wrapper';
import { 
  PullToRefresh, 
  List as MobileList, 
  SwipeAction, 
  Image as MobileImage,
  Tag as MobileTag,
  Space as MobileSpace,
  SearchBar,
  Dialog as MobileDialog,
  Toast,
  ActionSheet
} from 'antd-mobile';
import { EditSOutline, DeleteOutline, EyeOutline } from 'antd-mobile-icons';

export default function Products() {
  const { t } = useTranslation();
  const { products, stats } = usePage().props as any;
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { hasPermission } = usePermissions();
  
  const handleDelete = () => {
    if (productToDelete) {
      router.delete(route('products.destroy', productToDelete), {
        onSuccess: () => {
          setProductToDelete(null);
          Toast.show({
            icon: 'success',
            content: t('Product deleted successfully'),
          });
        }
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('csv_file', selectedFile);
    
    router.post(route('products.import'), formData, {
      onSuccess: () => {
        setShowImportDialog(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: () => {
        // Error will be shown via flash message
      }
    });
  };

  const pageActions = [];
  
  if (hasPermission('create-products')) {
    pageActions.push({
      label: t('Download Template'),
      icon: <FileText className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('products.import-template'), '_blank')
    });
    
    pageActions.push({
      label: t('Import CSV'),
      icon: <Upload className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => setShowImportDialog(true)
    });
  }
  
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

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMobileProducts = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-3 bg-white border-bottom sticky top-0 z-10">
        <SearchBar 
          placeholder={t('Search products...')} 
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
      </div>

      <PullToRefresh onRefresh={async () => {
        await router.reload({ only: ['products', 'stats'] });
      }}>
        <MobileList header={t('Product Catalog')}>
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
              {t('No products found')}
            </div>
          ) : (
            filteredProducts.map((product: any) => (
              <SwipeAction
                key={product.id}
                rightActions={[
                  {
                    key: 'edit',
                    text: t('Edit'),
                    color: 'primary',
                    onClick: () => router.visit(route('products.edit', product.id))
                  },
                  {
                    key: 'delete',
                    text: t('Delete'),
                    color: 'danger',
                    onClick: () => {
                      MobileDialog.confirm({
                        content: t('Are you sure you want to delete this product?'),
                        onConfirm: () => {
                          setProductToDelete(product.id);
                          handleDelete();
                        }
                      });
                    }
                  }
                ]}
              >
                <MobileList.Item
                  onClick={() => router.visit(route('products.show', product.id))}
                  prefix={
                    <MobileImage
                      src={product.cover_image ? getImageUrl(product.cover_image) : ''}
                      width={64}
                      height={64}
                      fit="cover"
                      lazy
                      style={{ borderRadius: 8 }}
                      fallback={
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      }
                    />
                  }
                  description={
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{t('SKU: {{sku}}', { sku: product.sku || '-' })}</div>
                      <MobileSpace gap={8} wrap>
                        <MobileTag color={product.is_active ? 'success' : 'default'} fill="outline">
                          {product.is_active ? t('Active') : t('Inactive')}
                        </MobileTag>
                        {product.stock <= 0 && (
                          <MobileTag color="danger" fill="outline">{t('Out of Stock')}</MobileTag>
                        )}
                        <MobileTag color="primary" fill="outline">{product.category?.name || '-'}</MobileTag>
                      </MobileSpace>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-bold text-primary">{formatCurrency(product.price)}</span>
                        <span className="text-xs text-gray-400">{t('Stock: {{stock}}', { stock: product.stock })}</span>
                      </div>
                    </div>
                  }
                >
                  <span className="font-semibold text-gray-900">{product.name}</span>
                </MobileList.Item>
              </SwipeAction>
            ))
          )}
        </MobileList>
      </PullToRefresh>
    </div>
  );

  const renderDesktopProducts = () => (
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
                  <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border flex-shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base truncate">{product.name}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={product.is_active ? 'default' : 'secondary'} className="text-xs">
                              {product.is_active ? t('Active') : t('Inactive')}
                            </Badge>
                            {product.stock <= 0 && (
                              <Badge variant="destructive" className="text-xs">{t('Out of Stock')}</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{t('SKU: {{sku}}', { sku: product.sku || '-' })}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-sm sm:text-base font-semibold text-primary">{formatCurrency(product.price)}</span>
                          <span className="text-xs text-muted-foreground">{t('Stock: {{stock}}', { stock: product.stock })}</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">{product.category?.name || '-'}</span>
                        </div>
                        <div className="sm:hidden text-xs text-muted-foreground mt-1">{product.category?.name || '-'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0">
                      <Permission permission="view-products">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.visit(route('products.show', product.id))}
                          className="h-9 px-3 touch-manipulation"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">{t('View')}</span>
                        </Button>
                      </Permission>
                      <Permission permission="edit-products">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.visit(route('products.edit', product.id))}
                          className="h-9 px-3 touch-manipulation"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">{t('Edit')}</span>
                        </Button>
                      </Permission>
                      <Permission permission="delete-products">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setProductToDelete(product.id)}
                          className="h-9 px-3 touch-manipulation text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">{t('Delete')}</span>
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

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Import Products from CSV')}</DialogTitle>
            <DialogDescription>
              {t('Upload a CSV file to bulk import products. Download the template first if you haven\'t already.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">{t('CSV File')}</Label>
              <Input
                id="csv-file"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  {t('Selected')}: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold">{t('Instructions:')}</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>{t('Download the CSV template first')}</li>
                <li>{t('Fill in product details (name, sku, price, stock, etc.)')}</li>
                <li>{t('Images are optional - you can add them later')}</li>
                <li>{t('Category names must match existing categories')}</li>
                <li>{t('Upload your completed CSV file')}</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowImportDialog(false);
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleImport} disabled={!selectedFile}>
              <Upload className="h-4 w-4 mr-2" />
              {t('Import')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );

  return (
    <ResponsiveWrapper
      mobileComponent={renderMobileProducts()}
      desktopComponent={renderDesktopProducts()}
    />
  );
}