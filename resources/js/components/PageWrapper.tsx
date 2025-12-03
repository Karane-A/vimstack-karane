// components/PageWrapper.tsx
import { ReactNode } from 'react';
import { PageTemplate, PageAction } from '@/components/page-template';
import { usePage } from '@inertiajs/react';
import { hasPermission } from '@/utils/authorization';
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

export interface PageButton {
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
  permission?: string;
  className?: string;
}

interface PageWrapperProps {
  title: string;
  url: string;
  buttons?: PageButton[];
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageWrapper({ 
  title, 
  url,
  buttons = [],
  children,
  breadcrumbs
}: PageWrapperProps) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const permissions = auth?.permissions || [];

  // Generate default breadcrumbs if not provided
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title }
  ];

  const pageBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  // Filter buttons based on permissions
  const filteredActions: PageAction[] = buttons
    .filter(button => !button.permission || hasPermission(permissions, button.permission))
    .map(button => ({
      label: button.label,
      icon: button.icon,
      variant: button.variant,
      onClick: button.onClick
    }));

  return (
    <PageTemplate 
      title={title} 
      url={url}
      actions={filteredActions}
      breadcrumbs={pageBreadcrumbs}
    >
      <div className="space-y-4">
        {children}
      </div>
    </PageTemplate>
  );
}