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
import React, { useEffect, useState as useReactState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface City {
  id: number;
  name: string;
  status: boolean;
  state: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
  created_at: string;
}

interface Props {
  cities: {
    data: City[];
    links: any[];
    meta: any;
    from: number;
    to: number;
    total: number;
  };
  filters: any;
  countries?: any[];
}

export default function Cities() {
  const { t } = useTranslation();
  const { cities, filters: pageFilters = {}, countries: pageCountries = [] } = usePage().props as Props;
  
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = { page: 1 };
    if (searchTerm) params.search = searchTerm;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('cities.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    const params: any = { page: 1 };
    if (searchTerm) params.search = searchTerm;
    if (value !== 'all') params.status = value;
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('cities.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleDeleteClick = (city: any) => {
    setCityToDelete(city);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cityToDelete) {
      router.delete(route('cities.destroy', cityToDelete.id), {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setCityToDelete(null);
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
    router.get(route('cities.index'), { page: 1, per_page: pageFilters.per_page }, { preserveState: true, preserveScroll: true });
  };

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [formKey, setFormKey] = useState(0);

  const handleAddNew = () => {
    setCountries(pageCountries);
    setCurrentCity(null);
    setFormMode('create');
    setStates([]);
    setSelectedCountryId('');
    setFormKey(prev => prev + 1);
    setIsFormModalOpen(true);
  };

  const handleEdit = (city: any) => {
    setCountries(pageCountries);
    setCurrentCity(city);
    setFormMode('edit');
    const countryId = city.state?.country_id?.toString() || '';
    setSelectedCountryId(countryId);
    if (countryId) {
      loadStates(countryId);
    }
    setFormKey(prev => prev + 1);
    setIsFormModalOpen(true);
  };

  const loadStates = async (countryId: string) => {
    if (!countryId) {
      setStates([]);
      return;
    }
    
    try {
      const response = await fetch(route('states.by-country', countryId), {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStates(data.states || []);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Failed to load states:', error);
      setStates([]);
    }
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {
      router.post(route('cities.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          setStates([]);
          setSelectedCountryId('');
        }
      });
    } else if (formMode === 'edit') {
      router.put(route('cities.update', currentCity.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          setStates([]);
          setSelectedCountryId('');
        }
      });
    }
  };

  const pageActions = [
    {
      label: t('Add City'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default' as const,
      onClick: () => handleAddNew()
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Location Management') },
    { title: t('Cities') }
  ];

  return (
    <PageTemplate 
      title={t('Cities')} 
      url="/cities"
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
                    placeholder={t("Search cities...")}
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
                  router.get(route('cities.index'), params, { preserveState: true, preserveScroll: true });
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
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('State')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Country')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Status')}</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cities?.data?.map((city) => (
                <tr key={city.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{city.name}</td>
                  <td className="px-4 py-3">{city.state.name}</td>
                  <td className="px-4 py-3">{city.state.country.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={city.status ? 'default' : 'secondary'}>
                      {city.status ? t('Active') : t('Inactive')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(city)}
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
                            onClick={() => handleDeleteClick(city)}
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
              
              {(!cities?.data || cities.data.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {t("No cities found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("Showing")} <span className="font-medium">{cities?.from || 0}</span> {t("to")} <span className="font-medium">{cities?.to || 0}</span> {t("of")} <span className="font-medium">{cities?.total || 0}</span> {t("cities")}
          </div>
          
          <div className="flex gap-1">
            {cities?.links?.map((link: any, i: number) => {
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

      {/* Custom City Form Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={() => setIsFormModalOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? t('Add New City') : t('Edit City')}
            </DialogTitle>
          </DialogHeader>
          <CityForm
            countries={countries}
            states={states}
            initialData={{
              ...currentCity,
              country_id: currentCity?.state?.country_id,
              state_id: currentCity?.state_id
            }}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormModalOpen(false)}
            onCountryChange={loadStates}
            mode={formMode}
            key={`${formMode}-${currentCity?.id || 'new'}`}
          />
        </DialogContent>
      </Dialog>

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={cityToDelete?.name || ''}
        entityName={t('City')}
      />
    </PageTemplate>
  );
}

// Custom City Form Component
function CityForm({ countries, states, initialData, onSubmit, onClose, onCountryChange, mode }: any) {
  const { t } = useTranslation();
  const [formData, setFormData] = useReactState({
    country_id: initialData?.country_id?.toString() || '',
    state_id: initialData?.state_id?.toString() || '',
    name: initialData?.name || '',
    status: initialData?.status ?? true
  });

  const handleCountryChange = (value: string) => {
    // Update form data first
    setFormData(prev => ({ ...prev, country_id: value, state_id: '' }));
    // Then trigger state loading
    setTimeout(() => onCountryChange(value), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country_id">{t('Country')} *</Label>
        <Select value={formData.country_id} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('Select Country')} />
          </SelectTrigger>
          <SelectContent className="z-[60000]">
            {countries?.filter((c: any) => c.status)?.map((country: any) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state_id">{t('State')} *</Label>
        <Select 
          value={formData.state_id} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, state_id: value }))}
          disabled={!formData.country_id}
        >
          <SelectTrigger>
            <SelectValue placeholder={formData.country_id ? t('Select State') : t('Select Country First')} />
          </SelectTrigger>
          <SelectContent className="z-[60000]">
            {states?.map((state: any) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t('City Name')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
        />
        <Label htmlFor="status">{t('Status')}</Label>
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
          {t('Cancel')}
        </Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={!formData.country_id || !formData.state_id || !formData.name}>
          {mode === 'create' ? t('Create') : t('Update')}
        </Button>
      </DialogFooter>
    </form>
  );
}