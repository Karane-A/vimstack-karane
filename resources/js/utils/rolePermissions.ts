// utils/rolePermissions.ts
export const getModulesFromNavigation = (userRole: string): string[] => {
  const superAdminModules = [
    'dashboard',
    'companies',
    'plans',
    'plan_requests',
    'plan_orders',

    'currencies',
    'referral',
    'settings'
  ];

  const companyModules = [
    'dashboard',
    'users',
    'roles',
    'contacts',
    'appointments',
    'plans',
    'referral',
    'settings'
  ];

  return (userRole === 'superadmin' || userRole === 'super admin') 
    ? superAdminModules 
    : companyModules;
};

export const filterPermissionsByRole = (permissions: Record<string, any[]>, userRole: string): Record<string, any[]> => {
  const allowedModules = getModulesFromNavigation(userRole);
  const filteredPermissions: Record<string, any[]> = {};

  Object.keys(permissions).forEach(module => {
    if (allowedModules.includes(module)) {
      filteredPermissions[module] = permissions[module];
    }
  });

  return filteredPermissions;
};