import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Trash2, CheckCircle, XCircle, Download } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';

export default function NewsletterSubscribers() {
  const { t } = useTranslation();
  const { newsletters, filters: pageFilters = {} } = usePage().props as any;
  
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState<any>(null);
  
  const hasActiveFilters = () => {
    return selectedStatus !== 'all' || searchTerm !== '';
  };
  
  const activeFilterCount = () => {
    return (selectedStatus !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
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
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('landing-page.subscribers.index'), params, { preserveState: true, preserveScroll: true });
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
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('landing-page.subscribers.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';
    
    const params: any = { 
      sort_field: field, 
      sort_direction: direction, 
      page: 1 
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('landing-page.subscribers.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleAction = (action: string, subscriber: any) => {
    setCurrentSubscriber(subscriber);
    
    switch (action) {
      case 'toggle-status':
        handleToggleStatus(subscriber);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
    }
  };
  
  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting subscriber...'));
    
    router.delete(route("landing-page.subscribers.destroy", currentSubscriber.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
      },
      onError: (errors) => {
        toast.dismiss();
        const errorMessage = Object.values(errors).join(', ') || t('Failed to delete subscriber');
        toast.error(errorMessage);
      }
    });
  };
  
  const handleToggleStatus = (subscriber: any) => {
    toast.loading(t('Updating status...'));
    
    router.put(route('landing-page.subscribers.update', subscriber.id), {
      status: subscriber.status === 'active' ? 'unsubscribed' : 'active'
    }, {
      onSuccess: () => {
        toast.dismiss();
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
    setShowFilters(false);
    
    router.get(route('landing-page.subscribers.index'), { 
      page: 1, 
      per_page: pageFilters.per_page 
    }, { preserveState: true, preserveScroll: true });
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedStatus !== 'all') params.append('status', selectedStatus);
    window.location.href = route('landing-page.subscribers.export') + '?' + params.toString();
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Landing Page') },
    { title: t('Subscribers') }
  ];

  const pageActions = [
    {
      label: 'Export',
      icon: <Download className="h-4 w-4 mr-2" />,
      variant: 'outline',
      onClick: () => handleExport()
    }
  ];

  const columns = [
    { 
      key: '#', 
      label: t('#'),
      render: (value: any, row: any, index: number) => (
        <span className="font-medium text-gray-500">
          {((newsletters?.current_page || 1) - 1) * (newsletters?.per_page || 10) + index + 1}
        </span>
      )
    },
    { 
      key: 'email', 
      label: t('Email'), 
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {t('Subscribed')}: {window.appSettings?.formatDateTime(row.subscribed_at, false) || new Date(row.subscribed_at).toLocaleDateString()}
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: t('Status'),
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'destructive'}>
          {value === 'active' ? t('Active') : t('Unsubscribed')}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: t('Subscribed At'), 
      sortable: true,
      render: (value: string) => window.appSettings?.formatDateTime(value, false) || new Date(value).toLocaleDateString()
    }
  ];

  return (
    <PageTemplate 
      title={t("Subscribers")} 
      url="/landing-page/subscribers"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Search by email...")}
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
            
            <div className="flex items-center gap-2">
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
                  
                  router.get(route('landing-page.subscribers.index'), params, { preserveState: true, preserveScroll: true });
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
                      <SelectItem value="unsubscribed">{t("Unsubscribed")}</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
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
              {newsletters?.data?.map((subscriber: any) => (
                <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                  {columns.map((column, columnIndex) => (
                    <td key={`${subscriber.id}-${column.key}`} className="px-4 py-3">
                      {column.render ? column.render(subscriber[column.key], subscriber, newsletters?.data?.indexOf(subscriber)) : subscriber[column.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleAction('toggle-status', subscriber)}
                            className={subscriber.status === 'active' ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                          >
                            {subscriber.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {subscriber.status === 'active' ? t("Unsubscribe") : t("Reactivate")}
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleAction('delete', subscriber)}
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
              
              {(!newsletters?.data || newsletters.data.length === 0) && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                    {t("No subscribers found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("Showing")} <span className="font-medium">{newsletters?.from || 0}</span> {t("to")} <span className="font-medium">{newsletters?.to || 0}</span> {t("of")} <span className="font-medium">{newsletters?.total || 0}</span> {t("subscribers")}
          </div>
          
          <div className="flex gap-1">
            {newsletters?.links?.map((link: any, i: number) => {
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

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentSubscriber?.email || ''}
        entityName="subscriber"
      />
    </PageTemplate>
  );
}