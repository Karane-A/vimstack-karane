import { PageCrudWrapper } from '@/components/PageCrudWrapper';
import { permissionsConfig } from '@/config/crud/permissions';
import { useTranslation } from 'react-i18next';

export default function PermissionsPage() {
  const { t } = useTranslation();
  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('User Management'), href: route('roles.index') },
    { title: t('Permissions') }
  ];

  return (
    <PageCrudWrapper 
      config={permissionsConfig} 
      url="/permissions" 
      breadcrumbs={breadcrumbs}
    />
  );
}