// pages/users/index.tsx
import { useState, useEffect } from 'react';
import { usersConfig } from '@/config/crud/users';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Plus, Eye, Edit, Trash2, KeyRound, Lock, Unlock, LayoutGrid, List, MoreHorizontal } from 'lucide-react';
import { hasPermission } from '@/utils/authorization';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/components/Permission';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useInitials } from '@/hooks/use-initials';
import { useTranslation } from 'react-i18next';

export default function Users() {
  const { t } = useTranslation();
  const { auth, users, roles, planLimits, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const { hasPermission: checkPermission, canPerformCrudOperation } = usePermissions();
  const getInitials = useInitials();
  
  // State
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedRole, setSelectedRole] = useState(pageFilters.role || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedRole !== 'all' || searchTerm !== '';
  };
  
  // Count active filters
  const activeFilterCount = () => {
    return (selectedRole !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = () => {
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedRole !== 'all') {
      params.role = selectedRole;
    }
    
    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleRoleFilter = (value: string) => {
    setSelectedRole(value);
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (value !== 'all') {
      params.role = value;
    }
    
    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';
    
    const params: any = { 
      sort_field: field, 
      sort_direction: direction, 
      page: 1 
    };
    
    // Add search and filters
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedRole !== 'all') {
      params.role = selectedRole;
    }
    
    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);
    
    switch (action) {
      case 'view':
        setFormMode('view');
        setIsFormModalOpen(true);
        break;
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      case 'reset-password':
        setIsResetPasswordModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(item);
        break;
      default:
        break;
    }
  };
  
  const handleAddNew = () => {
    setCurrentItem(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };
  
  const handleFormSubmit = (formData: any) => {
    // Keep roles as single string value, not array
    if (formData.roles && Array.isArray(formData.roles)) {
      formData.roles = formData.roles[0];
    }
    
    if (formMode === 'create') {
      toast.loading(t('Creating user...'));
      
      router.post(route('users.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('User created successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create user: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating user...'));
      
      router.put(route("users.update", currentItem.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('User updated successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update user: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };
  
  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting user...'));
    
    router.delete(route("users.destroy", currentItem.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('User deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete user: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleResetPasswordConfirm = (data: { password: string, password_confirmation: string }) => {
    toast.loading(t('Resetting password...'));
    
    router.put(route('users.reset-password', currentItem.id), data, {
      onSuccess: () => {
        setIsResetPasswordModalOpen(false);
        toast.dismiss();
        toast.success(t('Password reset successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to reset password: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    toast.loading(`${newStatus === 'active' ? t('Activating') : t('Deactivating')} user...`);
    
    router.put(route('users.toggle-status', user.id), {}, {
      onSuccess: () => {
        toast.dismiss();
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to update user status: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleResetFilters = () => {
    setSelectedRole('all');
    setSearchTerm('');
    setShowFilters(false);
    
    router.get(route('users.index'), { 
      page: 1, 
      per_page: pageFilters.per_page 
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions = [];
  
  // Add the "Add New User" button if user has permission and within limits
  if (checkPermission('create-users')) {
    const canCreate = !planLimits || planLimits.can_create;
    pageActions.push({
      label: planLimits && !canCreate ? t('User Limit Reached ({{current}}/{{max}})', { current: planLimits.current_users, max: planLimits.max_users }) : t('Add User'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: canCreate ? 'default' : 'outline',
      onClick: canCreate ? () => handleAddNew() : () => toast.error(t('User limit exceeded. Your plan allows maximum {{max}} users. Please upgrade your plan.', { max: planLimits.max_users })),
      disabled: !canCreate
    });
  }

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('User Management'), href: route('users.index') },
    { title: t('Users') }
  ];

  // Define table columns
  const columns = [
    { 
      key: 'name', 
      label: t('Name'), 
      sortable: true,
      render: (value: any, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              {getInitials(row.name)}
            </div>
            <div>
              <div className="font-medium">{row.name}</div>
              <div className="text-sm text-muted-foreground">{row.email}</div>
            </div>
          </div>
        );
      }
    },
    { 
      key: 'roles', 
      label: t('Roles'),
      render: (value: any) => {
        if (!value || !value.length) return <span className="text-muted-foreground">No roles assigned</span>;
        
        return value.map((role: any) => {
          return <span key={role.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-1">{role.label || role.name}</span>;
        });
      }
    },
    { 
      key: 'created_at', 
      label: t('Joined'), 
      sortable: true,
      render: (value: string) => window.appSettings?.formatDateTime(value, false) || new Date(value).toLocaleDateString()
    }
  ];

  // Define table actions
  const actions = [
    { 
      label: t('View'), 
      icon: 'Eye', 
      action: 'view', 
      className: 'text-blue-500',
      requiredPermission: 'view-users'
    },
    { 
      label: t('Edit'), 
      icon: 'Edit', 
      action: 'edit', 
      className: 'text-amber-500',
      requiredPermission: 'edit-users'
    },
    { 
      label: t('Reset Password'), 
      icon: 'KeyRound', 
      action: 'reset-password', 
      className: 'text-blue-500',
      requiredPermission: 'reset-password-users'
    },
    { 
      label: t('Toggle Status'), 
      icon: 'Lock', 
      action: 'toggle-status', 
      className: 'text-amber-500',
      requiredPermission: 'toggle-status-users'
    },
    { 
      label: t('Delete'), 
      icon: 'Trash2', 
      action: 'delete', 
      className: 'text-red-500',
      requiredPermission: 'delete-users'
    }
  ];

  return (
    <PageTemplate 
      title={t("Users Management")} 
      url="/users"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {/* Search and filters section */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Search users...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4 mr-1.5" />
                  {t("Search")}
                </Button>
              </form>
              
              <div className="ml-2">
                <Button 
                  variant={hasActiveFilters() ? "default" : "outline"}
                  size="sm" 
                  className="h-8 px-2 py-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                  {hasActiveFilters() && (
                    <span className="ml-1 bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeFilterCount()}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="border rounded-md p-0.5 mr-2">
                <Button 
                  size="sm" 
                  variant={activeView === 'list' ? "default" : "ghost"}
                  className="h-7 px-2"
                  onClick={() => setActiveView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={activeView === 'grid' ? "default" : "ghost"}
                  className="h-7 px-2"
                  onClick={() => setActiveView('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              
              <Label className="text-xs text-muted-foreground">{t("Per Page:")}</Label>
              <Select 
                value={pageFilters.per_page?.toString() || "10"} 
                onValueChange={(value) => {
                  const params: any = { page: 1, per_page: parseInt(value) };
                  
                  if (searchTerm) {
                    params.search = searchTerm;
                  }
                  
                  if (selectedRole !== 'all') {
                    params.role = selectedRole;
                  }
                  
                  router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {showFilters && (
            <div className="w-full mt-3 p-4 bg-gray-50 border rounded-md">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <Label>{t("Role")}</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={handleRoleFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("All Roles")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Roles")}</SelectItem>
                      {roles && roles.map((role: any) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.label || role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9"
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters()}
                >
                  {t("Reset Filters")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      {activeView === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <CrudTable
            columns={columns}
            actions={actions}
            data={users?.data || []}
            from={users?.from || 1}
            onAction={handleAction}
            sortField={pageFilters.sort_field}
            sortDirection={pageFilters.sort_direction}
            onSort={handleSort}
            permissions={permissions}
            entityPermissions={{
              view: 'view-users',
              create: 'create-users',
              edit: 'edit-users',
              delete: 'delete-users'
            }}
          />

          {/* Pagination section */}
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("Showing")} <span className="font-medium">{users?.from || 0}</span> {t("to")} <span className="font-medium">{users?.to || 0}</span> {t("of")} <span className="font-medium">{users?.total || 0}</span> {t("users")}
            </div>
            
            <div className="flex gap-1">
              {users?.links?.map((link: any, i: number) => {
                // Check if the link is "Next" or "Previous" to use text instead of icon
                const isTextLink = link.label === "&laquo; Previous" || link.label === "Next &raquo;";
                const label = link.label.replace("&laquo; ", "").replace(" &raquo;", "");
                
                return (
                  <Button
                    key={i}
                    variant={link.active ? 'default' : 'outline'}
                    size={isTextLink ? "sm" : "icon"}
                    className={isTextLink ? "px-3" : "h-8 w-8"}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                  >
                    {isTextLink ? label : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users?.data?.map((user: any) => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role: any) => (
                          <span key={role.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {role.label || role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">{t("No role")}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("Joined:")} {window.appSettings?.formatDateTime(user.created_at, false) || new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-1 pt-0 pb-2">
                  <Permission permission="view-users">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAction('view', user)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("View")}</TooltipContent>
                    </Tooltip>
                  </Permission>
                  <Permission permission="edit-users">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAction('edit', user)}
                          className="text-amber-500 hover:text-amber-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Edit")}</TooltipContent>
                    </Tooltip>
                  </Permission>
                  <Permission permission="reset-password-users">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAction('reset-password', user)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Reset Password")}</TooltipContent>
                    </Tooltip>
                  </Permission>
                  <Permission permission="toggle-status-users">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAction('toggle-status', user)}
                          className="text-amber-500 hover:text-amber-700"
                        >
                          {user.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{user.status === 'active' ? "Disable User" : "Enable User"}</TooltipContent>
                    </Tooltip>
                  </Permission>
                  <Permission permission="delete-users">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleAction('delete', user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Delete")}</TooltipContent>
                    </Tooltip>
                  </Permission>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination for grid view */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("Showing")} <span className="font-medium">{users?.from || 0}</span> {t("to")} <span className="font-medium">{users?.to || 0}</span> {t("of")} <span className="font-medium">{users?.total || 0}</span> {t("users")}
            </div>
            
            <div className="flex gap-1">
              {users?.links?.map((link: any, i: number) => {
                const isTextLink = link.label === "&laquo; Previous" || link.label === "Next &raquo;";
                const label = link.label.replace("&laquo; ", "").replace(" &raquo;", "");
                
                return (
                  <Button
                    key={i}
                    variant={link.active ? 'default' : 'outline'}
                    size={isTextLink ? "sm" : "icon"}
                    className={isTextLink ? "px-3" : "h-8 w-8"}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                  >
                    {isTextLink ? label : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: [
            { name: 'name', label: t('Name'), type: 'text', required: true },
            { name: 'email', label: t('Email'), type: 'email', required: true },
            { 
              name: 'password', 
              label: t('Password'), 
              type: 'password',
              required: true,
              conditional: (mode) => mode === 'create'
            },
            { 
              name: 'password_confirmation', 
              label: t('Confirm Password'), 
              type: 'password',
              required: true,
              conditional: (mode) => mode === 'create'
            },
            { 
              name: 'roles', 
              label: t('Role'), 
              type: 'select', 
              options: roles ? roles.map((role: any) => ({
                value: role.id.toString(),
                label: role.label || role.name
              })) : [],
              required: true
            }
          ],
          modalSize: 'lg'
        }}
        initialData={currentItem ? {
          ...currentItem,
          roles: currentItem.roles && currentItem.roles.length > 0 ? currentItem.roles[0].id.toString() : ''
        } : null}
        title={
          formMode === 'create' 
            ? t('Add New User') 
            : formMode === 'edit' 
              ? t('Edit User') 
              : t('View User')
        }
        mode={formMode}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="user"
      />

      {/* Reset Password Modal */}
      <CrudFormModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSubmit={handleResetPasswordConfirm}
        formConfig={{
          fields: [
            { name: 'password', label: t('New Password'), type: 'password', required: true },
            { name: 'password_confirmation', label: t('Confirm Password'), type: 'password', required: true }
          ],
          modalSize: 'sm'
        }}
        initialData={{}}
        title={`Reset Password for ${currentItem?.name || 'User'}`}
        mode="edit"
      />
    </PageTemplate>
  );
}