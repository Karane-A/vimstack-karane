// pages/companies/index.tsx
import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, Search, Plus, Eye, Edit, Trash2, KeyRound, Lock, Unlock, LayoutGrid, List, ExternalLink, Info, ArrowUpRight, CreditCard } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useInitials } from '@/hooks/use-initials';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/ui/date-picker';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { UpgradePlanModal } from '@/components/UpgradePlanModal';

export default function Companies() {
  const { t } = useTranslation();
  const { auth, companies, plans, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const getInitials = useInitials();
  
  // State
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [startDate, setStartDate] = useState<Date | undefined>(pageFilters.start_date ? new Date(pageFilters.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(pageFilters.end_date ? new Date(pageFilters.end_date) : undefined);
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedStatus !== 'all' || searchTerm !== '' || startDate !== undefined || endDate !== undefined;
  };
  
  // Count active filters
  const activeFilterCount = () => {
    return (selectedStatus !== 'all' ? 1 : 0) + 
           (searchTerm ? 1 : 0) + 
           (startDate ? 1 : 0) + 
           (endDate ? 1 : 0);
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
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (startDate) {
      params.start_date = startDate.toISOString().split('T')[0];
    }
    
    if (endDate) {
      params.end_date = endDate.toISOString().split('T')[0];
    }
    
    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (value !== 'all') {
      params.status = value;
    }
    
    if (startDate) {
      params.start_date = startDate.toISOString().split('T')[0];
    }
    
    if (endDate) {
      params.end_date = endDate.toISOString().split('T')[0];
    }
    
    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
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
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (startDate) {
      params.start_date = startDate.toISOString().split('T')[0];
    }
    
    if (endDate) {
      params.end_date = endDate.toISOString().split('T')[0];
    }
    
    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleAction = (action: string, company: any) => {
    setCurrentCompany(company);
    
    switch (action) {
      case 'login-as':
        router.get(route("impersonate.start", company.id));
        break;
      case 'company-info':
        setFormMode('view');
        setIsFormModalOpen(true);
        break;
      case 'upgrade-plan':
        handleUpgradePlan(company);
        break;

      case 'reset-password':
        setIsResetPasswordModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(company);
        break;
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };
  
  const handleAddNew = () => {
    setCurrentCompany(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };
  
  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {
      toast.loading(t('Creating company...'));
      
      router.post(route('companies.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          // Success message will be handled by flash message system
        },
        onError: (errors) => {
          toast.dismiss();
          const errorMessage = Object.values(errors).join(', ') || t('Failed to create company');
          toast.error(errorMessage);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating company...'));
      
      router.put(route('companies.update', currentCompany.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          // Success message will be handled by flash message system
        },
        onError: (errors) => {
          toast.dismiss();
          const errorMessage = Object.values(errors).join(', ') || t('Failed to update company');
          toast.error(errorMessage);
        }
      });
    }
  };
  
  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting company...'));
    
    router.delete(route("companies.destroy", currentCompany.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        // Success message will be handled by flash message system
      },
      onError: (errors) => {
        toast.dismiss();
        const errorMessage = Object.values(errors).join(', ') || t('Failed to delete company');
        toast.error(errorMessage);
      }
    });
  };
  
  const handleResetPasswordConfirm = (data: { password: string }) => {
    toast.loading(t('Resetting password...'));
    
    router.put(route('companies.reset-password', currentCompany.id), data, {
      onSuccess: () => {
        setIsResetPasswordModalOpen(false);
        toast.dismiss();
        // Success message will be handled by flash message system
      },
      onError: (errors) => {
        toast.dismiss();
        const errorMessage = Object.values(errors).join(', ') || t('Failed to reset password');
        toast.error(errorMessage);
      }
    });
  };
  
  const handleToggleStatus = (company: any) => {
    toast.loading(t('Updating status...'));
    
    router.put(route('companies.toggle-status', company.id), {}, {
      onSuccess: () => {
        toast.dismiss();
        // Success message will be handled by flash message system
      },
      onError: (errors) => {
        toast.dismiss();
        const errorMessage = Object.values(errors).join(', ') || t('Failed to update status');
        toast.error(errorMessage);
      }
    });
  };
  
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);
    
    router.get(route('companies.index'), { 
      page: 1, 
      per_page: pageFilters.per_page 
    }, { preserveState: true, preserveScroll: true });
  };
  
  const handleUpgradePlan = (company: any) => {
    setCurrentCompany(company);
    
    // Fetch available plans
    toast.loading(t('Loading plans...'));
    
    fetch(route('companies.plans', company.id))
      .then(res => res.json())
      .then(data => {
        setAvailablePlans(data.plans);
        setIsUpgradePlanModalOpen(true);
        toast.dismiss();
      })
      .catch(err => {
        toast.dismiss();
        toast.error(t('Failed to load plans'));
      });
  };
  
  const handleUpgradePlanConfirm = (planId: number) => {
    toast.loading(t('Upgrading plan...'));
    
    // Use Inertia router to handle the request
    router.put(route('companies.upgrade-plan', currentCompany.id), { 
      plan_id: planId 
    }, {
      onSuccess: (page) => {
        setIsUpgradePlanModalOpen(false);
        toast.dismiss();
        // Success message will be handled by flash message system
        // Force a page reload to ensure fresh data
        setTimeout(() => {
          router.reload({ only: ['companies'] });
        }, 100);
      },
      onError: (errors) => {
        toast.dismiss();
        const errorMessage = Object.values(errors).join(', ') || t('Failed to upgrade plan');
        toast.error(errorMessage);
      }
    });
  };

  // Define page actions
  const pageActions = [
    {
      label: 'Add Company',
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => handleAddNew()
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Companies') }
  ];

  // Define table columns for list view
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
      key: 'plan_name', 
      label: t('Plan'),
      render: (value: string) => <span className="capitalize">{value}</span>
    },
    { 
      key: 'created_at', 
      label: t('Created At'), 
      sortable: true,
      render: (value: string) => window.appSettings?.formatDateTime(value, false) || new Date(value).toLocaleDateString()
    }
  ];

  return (
    <PageTemplate 
      title={t("Companies Management")} 
      url="/companies"
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
                    placeholder={t("Search companies...")}
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
                  
                  if (selectedStatus !== 'all') {
                    params.status = selectedStatus;
                  }
                  
                  if (startDate) {
                    params.start_date = startDate.toISOString().split('T')[0];
                  }
                  
                  if (endDate) {
                    params.end_date = endDate.toISOString().split('T')[0];
                  }
                  
                  router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
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
                  <Label>{t("Status")}</Label>
                  <Select 
                    value={selectedStatus} 
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("All Status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Status")}</SelectItem>
                      <SelectItem value="active">{t("Active")}</SelectItem>
                      <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t("Start Date")}</Label>
                  <DatePicker
                    selected={startDate}
                    onSelect={setStartDate}
                    onChange={(date) => {
                      setStartDate(date);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t("End Date")}</Label>
                  <DatePicker
                    selected={endDate}
                    onSelect={setEndDate}
                    onChange={(date) => {
                      setEndDate(date);
                    }}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="h-9"
                    onClick={applyFilters}
                  >
                    {t("Apply Filters")}
                  </Button>
                  
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
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      {activeView === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columns.map((column) => (
                    <th 
                      key={column.key} 
                      className="px-4 py-3 text-left font-medium text-gray-500"
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center">
                        {column.label}
                        {column.sortable && (
                          <span className="ml-1">
                            {pageFilters.sort_field === column.key ? (
                              pageFilters.sort_direction === 'asc' ? '↑' : '↓'
                            ) : ''}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies?.data?.map((company: any) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${company.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(company[column.key], company) : company[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('login-as', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Login as Company")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('company-info', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Company Info")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('upgrade-plan', company)}
                              className="text-amber-500 hover:text-amber-700"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Upgrade Plan")}</TooltipContent>
                        </Tooltip>
                        

                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('reset-password', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Reset Password")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('toggle-status', company)}
                              className="text-amber-500 hover:text-amber-700"
                            >
                              {company.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{company.status === 'active' ? t("Disable Login") : t("Enable Login")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('edit', company)}
                              className="text-amber-500 hover:text-amber-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Edit")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleAction('delete', company)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Delete")}</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {(!companies?.data || companies.data.length === 0) && (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                      {t("No companies found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination section */}
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("Showing")} <span className="font-medium">{companies?.from || 0}</span> {t("to")} <span className="font-medium">{companies?.to || 0}</span> {t("of")} <span className="font-medium">{companies?.total || 0}</span> {t("companies")}
            </div>
            
            <div className="flex gap-1">
              {companies?.links?.map((link: any, i: number) => {
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
            {companies?.data?.map((company: any) => (
              <Card key={company.id} className="bg-white border border-gray-300 rounded-lg shadow">
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
                        {getInitials(company.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{company.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{company.email}</p>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            company.status === 'active' ? 'bg-gray-800' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">
                            {company.status === 'active' ? t('Active') : t('Inactive')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 z-50" sideOffset={5}>
                        <DropdownMenuItem onClick={() => handleAction('login-as', company)}>
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          <span>{t("Login as Company")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('company-info', company)}>
                          <Info className="h-4 w-4 mr-2" />
                          <span>{t("Company Info")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('upgrade-plan', company)}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>{t("Upgrade Plan")}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleAction('reset-password', company)}>
                          <KeyRound className="h-4 w-4 mr-2" />
                          <span>{t("Reset Password")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('toggle-status', company)}>
                          {company.status === 'active' ? 
                            <Lock className="h-4 w-4 mr-2" /> : 
                            <Unlock className="h-4 w-4 mr-2" />
                          }
                          <span>{company.status === 'active' ? t("Disable Login") : t("Enable Login")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction('edit', company)} className="text-amber-600">
                          <Edit className="h-4 w-4 mr-2" />
                          <span>{t("Edit")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('delete', company)} className="text-rose-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>{t("Delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Plan info */}
                  <div className="border border-gray-200 rounded-md p-3 mb-4">
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-semibold text-gray-800">{company.plan_name}</span>
                    </div>
                    {company.plan_expiry_date && (
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {t("Expires")}: {window.appSettings?.formatDateTime(company.plan_expiry_date, false) || new Date(company.plan_expiry_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                

                
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction('edit', company)}
                      className="flex-1 h-9 text-sm border-gray-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t("Edit")}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction('company-info', company)}
                      className="flex-1 h-9 text-sm border-gray-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("View")}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction('delete', company)}
                      className="flex-1 h-9 text-sm text-gray-700 border-gray-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("Delete")}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {(!companies?.data || companies.data.length === 0) && (
              <div className="col-span-full p-8 text-center text-gray-500">
                {t("No companies found")}
              </div>
            )}
          </div>
          
          {/* Pagination for grid view */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("Showing")} <span className="font-medium">{companies?.from || 0}</span> {t("to")} <span className="font-medium">{companies?.to || 0}</span> {t("of")} <span className="font-medium">{companies?.total || 0}</span> {t("companies")}
            </div>
            
            <div className="flex gap-1">
              {companies?.links?.map((link: any, i: number) => {
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
        onSubmit={(data) => {
          // If login_enabled is false, remove password field
          if (data.login_enabled === false) {
            delete data.password;
          }
          // Set status based on login_enabled
          data.status = data.login_enabled ? 'active' : 'inactive';
          
          // Remove login_enabled field as it's not needed in the backend
          delete data.login_enabled;
          handleFormSubmit(data);
        }}
        formConfig={{
          fields: [
            { name: 'name', label: t('Company Name'), type: 'text', required: true },
            { name: 'email', label: t('Email'), type: 'email', required: true },
            { 
              name: 'login_enabled', 
              label: t('Enable Login'),
              type: 'switch',
              defaultValue: true
            },
            { 
              name: 'password', 
              label: t('Password'), 
              type: 'password',
              required: true,
              conditional: (mode, data) => {
                return data?.login_enabled === true;
              }
            }
          ],
          modalSize: 'lg'
        }}
        initialData={{
          ...currentCompany,
          login_enabled: currentCompany?.status === 'active' || false
        }}
        title={
          formMode === 'create' 
            ? t('Add New Company') 
            : formMode === 'edit' 
              ? t('Edit Company') 
              : t('View Company')
        }
        mode={formMode}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentCompany?.name || ''}
        entityName="company"
      />

      {/* Reset Password Modal */}
      <CrudFormModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSubmit={handleResetPasswordConfirm}
        formConfig={{
          fields: [
            { name: 'password', label: t('New Password'), type: 'password', required: true }
          ],
          modalSize: 'sm'
        }}
        initialData={{}}
        title={`Reset Password for ${currentCompany?.name || 'Company'}`}
        mode="edit"
      />
      
      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradePlanModalOpen}
        onClose={() => setIsUpgradePlanModalOpen(false)}
        onConfirm={handleUpgradePlanConfirm}
        plans={availablePlans}
        currentPlanId={currentCompany?.plan_id}
        companyName={currentCompany?.name || ''}
      />
    </PageTemplate>
  );
}