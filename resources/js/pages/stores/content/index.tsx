import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { Settings, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

interface Store {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface Props {
  stores: Store[];
}

export default function StoreContentIndex({ stores }: Props) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const pageActions = [];

  return (
    <PageTemplate 
      title={t('Store Content Management')}
      url="/stores/content"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Store Management', href: route('stores.index') },
        { title: 'Store Content' }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('Manage Store Content')}</CardTitle>
          <CardDescription>{t('Customize dynamic content for your stores')}</CardDescription>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-8">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('No stores found')}</h3>
              <p className="text-muted-foreground mb-4">{t('Create a store first to manage its content.')}</p>
              <Permission permission="create-stores">
                <Button onClick={() => router.visit(route('stores.create'))}>
                  {t('Create Store')}
                </Button>
              </Permission>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{store.name}</h3>
                        <Badge variant={store.is_active ? 'default' : 'secondary'}>
                          {store.is_active ? t('Active') : t('Inactive')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {store.description || t('No description available')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Permission permission="edit-store-content">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => router.visit(route('stores.content.show', store.id))}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('Manage Content')}
                      </Button>
                    </Permission>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageTemplate>
  );
}