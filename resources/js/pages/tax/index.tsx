import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Calculator, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

export default function Tax() {
  const { t } = useTranslation();
  const { taxes, stats } = usePage().props as any;
  const [taxToDelete, setTaxToDelete] = useState<number | null>(null);

  const { hasPermission } = usePermissions();
  
  const handleDelete = () => {
    if (taxToDelete) {
      router.delete(route('tax.destroy', taxToDelete));
      setTaxToDelete(null);
    }
  };

  const pageActions = [];
  
  if (hasPermission('export-tax')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('tax.export'), '_blank')
    });
  }
  
  if (hasPermission('create-tax')) {
    pageActions.push({
      label: t('Create Tax'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('tax.create'))
    });
  }

  return (
    <PageTemplate 
      title={t('Tax Management')}
      url="/tax"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Tax Management' }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Tax Rules')}</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('All tax rules')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Rules')}</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">{t('Average Tax Rate')}</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRate}%</div>
              <p className="text-xs text-muted-foreground">{t('Across all rules')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Tax Collected')}</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.collected)}</div>
              <p className="text-xs text-muted-foreground">{t('This month')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tax Rules List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Tax Rules')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxes.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">{t('No tax rules found')}</p>
                  <Permission permission="create-tax">
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => router.visit(route('tax.create'))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Create your first tax rule')}
                    </Button>
                  </Permission>
                </div>
              ) : (
                taxes.map((tax: any) => (
                  <div key={tax.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calculator className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{tax.name}</h3>
                          <Badge variant={tax.is_active ? 'default' : 'secondary'}>
                            {tax.is_active ? t('Active') : t('Inactive')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tax.rate}% - {tax.type === 'percentage' ? t('Percentage') : t('Fixed Amount')}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {tax.region ? t('Region: {{region}}', { region: tax.region }) : t('Global')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Permission permission="view-tax">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.visit(route('tax.show', tax.id))}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Permission>
                      <Permission permission="edit-tax">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.visit(route('tax.edit', tax.id))}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Permission>
                      <Permission permission="delete-tax">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setTaxToDelete(tax.id)}
                        >
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
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={!!taxToDelete} onOpenChange={(open) => !open && setTaxToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('Delete Tax Rule')}</DialogTitle>
              <DialogDescription>
                {t('Are you sure you want to delete this tax rule? This action cannot be undone.')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTaxToDelete(null)}>
                {t('Cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {t('Delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
}