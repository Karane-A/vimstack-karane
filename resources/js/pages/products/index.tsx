import React, { useState, useRef } from 'react';
import { Plus, RefreshCw, Download, Package, Eye, Edit, Trash2, Search, Upload, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { router, usePage, Link, Head } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { usePermissions } from '@/hooks/usePermissions';
import { formatCurrency } from '@/utils/helpers';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

export default function Products() {
  const { t } = useTranslation();
  const { products, stats } = usePage().props as any;
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { hasPermission } = usePermissions();

  const handleDelete = () => {
    if (productToDelete) {
      router.delete(route('products.destroy', productToDelete));
      setProductToDelete(null);
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
      }
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <Head title={t('Products')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{t('Products')}</h1>
          <p className="text-sm text-slate-500 mt-1 hidden md:block">{t('Manage your product catalog and inventory')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {hasPermission('create-products') && (
            <Button variant="outline" className="rounded-lg h-9 text-xs sm:text-sm px-2 sm:px-4" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> {t('Import')}
            </Button>
          )}
          {hasPermission('export-products') && (
            <Button variant="outline" className="rounded-lg h-9 text-xs sm:text-sm px-2 sm:px-4" onClick={() => window.open(route('products.export'), '_blank')}>
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> {t('Export')}
            </Button>
          )}
          {hasPermission('create-products') && (
            <Button variant="default" className="rounded-lg h-9 text-xs sm:text-sm px-2 sm:px-4 bg-indigo-600 hover:bg-indigo-700 font-bold ml-auto sm:ml-0" onClick={() => router.visit(route('products.create'))}>
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> {t('Add')}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Products')}
          value={stats?.total || 0}
          icon={Package}
          trend={{ value: '12%', isUp: true }}
        />
        <MetricCard
          title={t('Active Products')}
          value={stats?.active || 0}
          icon={Package}
          trend={{ value: `${stats?.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%`, isUp: true, label: 'active rate' }}
        />
        <MetricCard
          title={t('Low Stock')}
          value={stats?.lowStock || 0}
          icon={Package}
          trend={{ value: '5', isUp: false, label: 'items' }}
        />
        <MetricCard
          title={t('Total Value')}
          value={formatCurrency(stats?.totalValue || 0)}
          icon={Package}
          trend={{ value: '3.2%', isUp: true }}
        />
      </div>

      {/* Products Table Section */}
      <div className="bg-white rounded-[14px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('Search products by name or SKU...')}
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 gap-2 border border-slate-100">
              <Filter size={14} /> {t('Filter')}
            </Button>
          </div>
        </div>

        <DataTable
          columns={[
            {
              key: 'image',
              header: t('Image'),
              render: (product: any) => (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  {product.cover_image ? (
                    <img src={getImageUrl(product.cover_image)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-slate-300" />
                    </div>
                  )}
                </div>
              )
            },
            {
              key: 'name',
              header: t('Product Name'),
              render: (product: any) => (
                <div>
                  <Link href={route('products.show', product.id)} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500">SKU: {product.sku || '-'}</p>
                </div>
              )
            },
            {
              key: 'price',
              header: t('Price'),
              render: (product: any) => (
                <span className="font-bold text-slate-900">{formatCurrency(product.price)}</span>
              )
            },
            {
              key: 'stock',
              header: t('Stock'),
              render: (product: any) => (
                <div className="flex items-center gap-2">
                  <span className={product.stock <= 5 ? 'text-red-600 font-bold' : 'text-slate-700 font-medium'}>
                    {product.stock}
                  </span>
                  {product.stock <= 5 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </div>
              )
            },
            {
              key: 'category',
              header: t('Category'),
              render: (product: any) => (
                <span className="text-slate-600 text-sm">{product.category?.name || '-'}</span>
              )
            },
            {
              key: 'status',
              header: t('Status'),
              render: (product: any) => (
                <StatusBadge status={product.is_active ? 'Active' : 'Inactive'} />
              )
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (product: any) => (
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => router.visit(route('products.show', product.id))} className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-slate-500" />
                  </Button>
                  {hasPermission('edit-products') && (
                    <Button variant="ghost" size="sm" onClick={() => router.visit(route('products.edit', product.id))} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                  )}
                  {hasPermission('delete-products') && (
                    <Button variant="ghost" size="sm" onClick={() => setProductToDelete(product.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            }
          ]}
          data={products}
          keyExtractor={(item: any, _index: number) => item.id}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">{t('Delete Product')}</DialogTitle>
            <DialogDescription className="text-slate-600 mt-2 leading-relaxed">
              {t('Are you sure you want to delete this product? This action cannot be undone and the product will be permanently removed from your inventory.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-3">
            <Button variant="ghost" className="rounded-xl px-6" onClick={() => setProductToDelete(null)}>
              {t('Cancel')}
            </Button>
            <Button variant="destructive" className="rounded-xl px-6 font-bold" onClick={handleDelete}>
              {t('Delete Product')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-lg rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">{t('Import Products')}</DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              {t('Upload a CSV file to bulk import products. Ensure your file follows our standard catalog format.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="csv-file" className="font-bold text-slate-700">{t('CSV File')}</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <Input
                  id="csv-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  {selectedFile ? (
                    <p className="font-bold text-indigo-600">{selectedFile.name}</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{t('Click to upload or drag & drop')}</p>
                      <p className="text-xs text-slate-500">{t('Only CSV files are supported')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-indigo-600">
                <FileText size={16} />
                <span className="text-sm font-bold">{t('Helpful Tips')}</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                  {t('Download the standard template for proper column mapping')}
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                  {t('Category names must match exactly what exists in your store')}
                </li>
              </ul>
              <Button
                variant="link"
                className="text-indigo-600 h-auto p-0 mt-4 text-xs font-bold"
                onClick={() => window.open(route('products.import-template'), '_blank')}
              >
                {t('Download Template CSV')}
              </Button>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" className="rounded-xl px-6" onClick={() => setShowImportDialog(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleImport} disabled={!selectedFile} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 font-bold text-white">
              {t('Start Import')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Products.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;