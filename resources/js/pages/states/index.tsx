import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Filter, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { CrudFormModal } from '@/components/CrudFormModal';

interface State {
  id: number;
  name: string;
  code: string;
  status: boolean;
  cities_count: number;
  country: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface Props {
  states: {
    data: State[];
    links: any[];
    meta: any;
    from: number;
    to: number;
    total: number;
  };
  filters: any;
  countries?: any[];
}

export default function States() {
  const { t } = useTranslation();
  const { states, filters: pageFilters = {}, countries: pageCountries = [] } = usePage().props as Props;
  
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = { page: 1 };
    if (searchTerm) params.search = searchTerm;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('states.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    const params: any = { page: 1 };
    if (searchTerm) params.search = searchTerm;
    if (value !== 'all') params.status = value;
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('states.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleDeleteClick = (state: any) => {
    setStateToDelete(state);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (stateToDelete) {
      router.delete(route('states.destroy', stateToDelete.id), {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setStateToDelete(null);
        }
      });
    }
  };

  const hasActiveFilters = () => {
    return selectedStatus !== 'all' || searchTerm !== '';
  };

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSearchTerm('');
    setShowFilters(false);
    router.get(route('states.index'), { page: 1, per_page: pageFilters.per_page }, { preserveState: true, preserveScroll: true });
  };

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentState, setCurrentState] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [countries, setCountries] = useState<any[]>([]);

  const handleAddNew = () => {
    setCountries(pageCountries);
    setCurrentState(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setCountries(pageCountries);
    setCurrentState(state);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {
      router.post(route('states.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        }
      });
    } else if (formMode === 'edit') {
      router.put(route('states.update', currentState.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        }
      });
    }
  };

  const pageActions = [
    {
      label: t('Add State'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default' as const,
      onClick: () => handleAddNew()
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Location Management') },
    { title: t('States') }
  ];

  return (
    <PageTemplate 
      title={t('States')} 
      url="/states"
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
                    placeholder={t("Search states...")}
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
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">{t("Per Page:")}</Label>
              <Select 
                value={pageFilters.per_page?.toString() || "10"} 
                onValueChange={(value) => {
                  const params: any = { page: 1, per_page: parseInt(value) };
                  if (searchTerm) params.search = searchTerm;
                  if (selectedStatus !== 'all') params.status = selectedStatus;
                  router.get(route('states.index'), params, { preserveState: true, preserveScroll: true });
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
                  <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("All Status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Status")}</SelectItem>
                      <SelectItem value="1">{t("Active")}</SelectItem>
                      <SelectItem value="0">{t("Inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="h-9" onClick={applyFilters}>
                    {t("Apply Filters")}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9" onClick={handleResetFilters} disabled={!hasActiveFilters()}>
                    {t("Reset Filters")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Name')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Code')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Country')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Cities')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Status')}</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {states?.data?.map((state) => (
                <tr key={state.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{state.name}</td>
                  <td className="px-4 py-3">{state.code}</td>
                  <td className="px-4 py-3">{state.country.name}</td>
                  <td className="px-4 py-3">{state.cities_count}</td>
                  <td className="px-4 py-3">
                    <Badge variant={state.status ? 'default' : 'secondary'}>
                      {state.status ? t('Active') : t('Inactive')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(state)}
                            className="text-amber-500 hover:text-amber-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('Edit')}</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(state)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('Delete')}</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              
              {(!states?.data || states.data.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {t("No states found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("Showing")} <span className="font-medium">{states?.from || 0}</span> {t("to")} <span className="font-medium">{states?.to || 0}</span> {t("of")} <span className="font-medium">{states?.total || 0}</span> {t("states")}
          </div>
          
          <div className="flex gap-1">
            {states?.links?.map((link: any, i: number) => {
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

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: [
            { 
              name: 'country_id', 
              label: t('Country'), 
              type: 'select', 
              required: true,
              options: countries?.filter(c => c.status)?.map((country: any) => ({ value: country.id, label: country.name })) || []
            },
            { name: 'name', label: t('State Name'), type: 'text', required: true },
            { name: 'code', label: t('State Code'), type: 'text', required: false },
            { name: 'status', label: t('Status'), type: 'switch', defaultValue: true }
          ],
          modalSize: 'lg'
        }}
        initialData={currentState}
        title={
          formMode === 'create' 
            ? t('Add New State') 
            : formMode === 'edit' 
              ? t('Edit State') 
              : t('View State')
        }
        mode={formMode}
      />

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={stateToDelete?.name || ''}
        entityName={t('State')}
      />
    </PageTemplate>
  );
}