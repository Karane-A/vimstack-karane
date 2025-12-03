// components/PermissionBadges.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Permission {
  id: number | string;
  name: string;
  label: string;
}

interface PermissionBadgesProps {
  permissions: Permission[];
  maxDisplay?: number;
}

export function PermissionBadges({ permissions = [], maxDisplay = 3 }: PermissionBadgesProps) {
  const { t } = useTranslation();
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return <span className="text-sm text-gray-500">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {permissions.slice(0, maxDisplay).map((permission, index) => (
        <span 
          key={index} 
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
        >
          {permission.label || permission.name}
        </span>
      ))}
      {permissions.length > maxDisplay && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          +{permissions.length - maxDisplay} {t("more")}
        </span>
      )}
    </div>
  );
}