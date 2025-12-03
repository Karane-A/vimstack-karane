import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Star, Package, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';

export default function ShowProduct() {
  const { t } = useTranslation();
  const { product, stats } = usePage().props as any;


  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('products.index'))
    },
    {
      label: t('Edit Product'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('products.edit', product.id))
    }
  ];

  // Parse product images
  const productImages = product.images ? product.images.split(',').filter(Boolean) : [];

  return (
    <PageTemplate 
      title={t('Product Details')}
      url="/products/show"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Products', href: route('products.index') },
        { title: 'Product Details' }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('Product Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden border">
                  {product.cover_image ? (
                    <img
                      src={getImageUrl(product.cover_image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-10 w-10 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? t('Active') : t('Inactive')}
                    </Badge>
                    {product.stock <= 0 && (
                      <Badge variant="destructive">{t('Out of Stock')}</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{t('SKU: {{sku}}', { sku: product.sku || '-' })}</p>
                  <div className="flex items-center space-x-4 mb-2">
                    {product.sale_price ? (
                      <>
                        <span className="text-sm line-through text-muted-foreground">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-lg font-semibold text-primary">{formatCurrency(product.sale_price)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-primary">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Quick Stats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t('Stock')}</span>
                </div>
                <span className="font-semibold">{t('{{stock}} units', { stock: product.stock })}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t('Revenue')}</span>
                </div>
                <span className="font-semibold">{formatCurrency(stats.revenue || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t('Total Sold')}</span>
                </div>
                <span className="font-semibold">{stats.total_sold || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t('Orders')}</span>
                </div>
                <span className="font-semibold">{stats.total_orders || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Category')}</span>
                <span>{product.category?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Product Tax')}</span>
                <span>{product.tax?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Product Display')}</span>
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? t('Active') : t('Inactive')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Downloadable')}</span>
                <span>{product.is_downloadable ? t('Yes') : t('No')}</span>
              </div>
              {product.downloadable_file && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{t('Download File')}</span>
                  <span className="text-sm text-blue-600 truncate max-w-32">{product.downloadable_file}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Created')}</span>
                <span className="text-sm">{new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Updated')}</span>
                <span className="text-sm">{new Date(product.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Pricing & Inventory')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Price')}</span>
                <span className="font-semibold">{formatCurrency(product.price)}</span>
              </div>
              {product.sale_price && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{t('Sale Price')}</span>
                  <span className="font-semibold text-green-600">{formatCurrency(product.sale_price)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Stock Quantity')}</span>
                <span>{t('{{stock}} units', { stock: product.stock })}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {product.description && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
            </CardContent>
          </Card>
        )}

        {product.specifications && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Specifications')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.specifications }} />
            </CardContent>
          </Card>
        )}

        {product.details && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.details }} />
            </CardContent>
          </Card>
        )}

        {product.variants && product.variants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Variants')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.variants.map((variant: any, index: number) => (
                  <div key={index}>
                    <h4 className="font-medium mb-2">{variant.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {variant.values.map((value: string, valueIndex: number) => (
                        <Badge key={valueIndex} variant="outline">{value}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {product.custom_fields && product.custom_fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Custom Fields')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.custom_fields.map((field: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{field.name}</span>
                    <span>{field.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {productImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Product Images')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={getImageUrl(image)}
                      alt={t('Product image {{number}}', { number: index + 1 })}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
}
