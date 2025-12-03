import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Permission component for conditional rendering based on user permissions
 * 
 * @param permission - Single permission to check
 * @param permissions - Array of permissions to check
 * @param role - Single role to check
 * @param roles - Array of roles to check
 * @param requireAll - If true, user must have ALL permissions/roles. If false, user needs ANY (default: false)
 * @param fallback - Component to render when permission check fails
 * @param children - Content to render when permission check passes
 */
export function Permission({
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  fallback = null,
  children
}: PermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = usePermissions();
  
  let hasAccess = false;
  
  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }
  
  // Check multiple permissions
  if (permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  }
  
  // Check single role
  if (role) {
    hasAccess = hasAccess || hasRole(role);
  }
  
  // Check multiple roles
  if (roles.length > 0) {
    hasAccess = hasAccess || (requireAll ? roles.every(r => hasRole(r)) : hasAnyRole(roles));
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: string | string[],
  fallback?: React.ReactNode
) {
  return function PermissionWrappedComponent(props: P) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    
    return (
      <Permission permissions={permissions} fallback={fallback}>
        <Component {...props} />
      </Permission>
    );
  };
}

/**
 * Hook for permission-based conditional logic
 */
export function usePermissionCheck(permission: string | string[], requireAll = false) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  if (permissions.length === 1) {
    return hasPermission(permissions[0]);
  }
  
  return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
}