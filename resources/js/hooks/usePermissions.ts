import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface AuthData {
  user?: {
    type: string;
    [key: string]: any;
  };
  permissions?: string[];
  roles?: string[];
}

export function usePermissions() {
  const { auth } = usePage().props as { auth: AuthData };
  
  const permissions = useMemo(() => auth?.permissions || [], [auth?.permissions]);
  const roles = useMemo(() => auth?.roles || [], [auth?.roles]);
  const user = useMemo(() => auth?.user, [auth?.user]);
  
  const isSuperAdmin = useMemo(() => {
    return user?.type === 'superadmin' || user?.type === 'super admin';
  }, [user?.type]);
  
  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };
  
  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissionList.some(permission => permissions.includes(permission));
  };
  
  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissionList.every(permission => permissions.includes(permission));
  };
  
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };
  
  const hasAnyRole = (roleList: string[]): boolean => {
    return roleList.some(role => roles.includes(role));
  };
  
  const canPerformCrudOperation = (entity: string, operation: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    const permissionName = `${operation}-${entity}`;
    return hasPermission(permissionName);
  };
  
  const canAccessModule = (module: string): boolean => {
    return hasPermission(`manage-${module}`) || hasPermission(`view-${module}`);
  };
  
  const filterActionsByPermissions = (actions: any[]): any[] => {
    return actions.filter(action => {
      if (!action.requiredPermission) {
        return true;
      }
      
      return hasPermission(action.requiredPermission);
    });
  };
  
  return {
    permissions,
    roles,
    user,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canPerformCrudOperation,
    canAccessModule,
    filterActionsByPermissions,
  };
}