import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { PageTemplate } from '@/components/page-template';
import { CrudTable } from '@/components/CrudTable';
import { toast } from '@/components/custom-toast';
import { Toaster } from '@/components/ui/toaster';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';

interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  sort_order: number;
}

interface PageProps {
  pages: CustomPage[];
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function CustomPagesIndex() {
  const { pages, flash, filters: pageFilters = {} } = usePage<PageProps>().props;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [slugValidation, setSlugValidation] = useState<{loading: boolean, available: boolean | null, message: string}>({ loading: false, available: null, message: '' });
  const [slugCheckTimeout, setSlugCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    sort_order: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if slug is available before submitting
    if (slugValidation.available === false) {
      toast.error('Please choose a different slug as the current one is already taken.');
      return;
    }
    
    if (editingPage) {
      put(route('landing-page.custom-pages.update', editingPage.id), {
        onSuccess: () => {
          setEditingPage(null);
          reset();
          setSlugValidation({ loading: false, available: null, message: '' });
        }
      });
    } else {
      post(route('landing-page.custom-pages.store'), {
        onSuccess: () => {
          setIsCreateOpen(false);
          reset();
          setSlugValidation({ loading: false, available: null, message: '' });
        }
      });
    }
  };

  const handleEdit = (page: CustomPage) => {
    setData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      is_active: page.is_active,
      sort_order: page.sort_order || 0
    });
    setEditingPage(page);
  };

  const handleDeleteClick = (page: CustomPage) => {
    setPageToDelete(page);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      router.delete(route('landing-page.custom-pages.destroy', pageToDelete.id), {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setPageToDelete(null);
        }
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingPage(null);
    setIsCreateOpen(false);
    setSlugValidation({ loading: false, available: null, message: '' });
  };

  const checkSlugAvailability = async (slug: string, excludeId?: number) => {
    if (!slug.trim()) {
      setSlugValidation({ loading: false, available: null, message: '' });
      return;
    }
    
    // Clear existing timeout
    if (slugCheckTimeout) {
      clearTimeout(slugCheckTimeout);
    }
    
    setSlugValidation({ loading: true, available: null, message: '' });
    
    // Debounce the API call
    const timeout = setTimeout(async () => {
      try {
        const response = await axios.post(route('api.custom-pages.check-slug'), {
          slug: slug.trim(),
          exclude_id: excludeId
        });
        
        setSlugValidation({
          loading: false,
          available: response.data.available,
          message: response.data.available ? 'Slug is available' : 'Slug is already taken'
        });
      } catch (error) {
        setSlugValidation({ loading: false, available: null, message: 'Error checking slug' });
      }
    }, 500);
    
    setSlugCheckTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (slugCheckTimeout) {
        clearTimeout(slugCheckTimeout);
      }
    };
  }, [slugCheckTimeout]);

  const generateSlugFromTitle = async (excludeId?: number) => {
    if (!data.title.trim()) return;
    
    try {
      const response = await axios.post(route('api.custom-pages.generate-slug'), {
        title: data.title.trim(),
        exclude_id: excludeId
      });
      
      setData('slug', response.data.slug);
      setSlugValidation({ loading: false, available: true, message: 'Generated unique slug' });
    } catch (error) {
      console.error('Error generating slug:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = { page: 1 };
    if (searchTerm) {
      params.search = searchTerm;
    }
    router.get(route('landing-page.custom-pages.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, item: CustomPage) => {
    if (action === 'edit') {
      handleEdit(item);
    } else if (action === 'delete') {
      handleDeleteClick(item);
    }
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
    router.get(route('landing-page.custom-pages.index'), params, { preserveState: true, preserveScroll: true });
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      sortable: true,
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      )
    },
    { 
      key: 'slug', 
      label: 'Slug',
      render: (value: string) => (
        <div className="font-mono text-sm text-blue-600">
          /page/{value}
        </div>
      )
    },
    { 
      key: 'content', 
      label: 'Content',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value.replace(/<[^>]*>/g, '')}>
          {value.replace(/<[^>]*>/g, '').substring(0, 80)}...
        </div>
      )
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <div className="flex items-center space-x-1">
          {value ? (
            <><Eye className="w-4 h-4 text-green-600" /><span className="text-green-600">Active</span></>
          ) : (
            <><EyeOff className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactive</span></>
          )}
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    { 
      label: 'Edit', 
      icon: 'Edit', 
      action: 'edit', 
      className: 'text-amber-500'
    },
    { 
      label: 'Delete', 
      icon: 'Trash2', 
      action: 'delete', 
      className: 'text-red-500'
    }
  ];

  return (
    <PageTemplate 
      title="Custom Pages" 
      url="/landing-page/custom-pages"
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Landing Page' },
        { title: 'Custom Pages' }
      ]}
      actions={[
        {
          label: 'Add Page',
          icon: <Plus className="w-4 h-4 mr-2" />,
          variant: 'default',
          onClick: () => setIsCreateOpen(true)
        }
      ]}
      noPadding
    >
      {/* Search section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {/* Table section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={pages?.data || pages || []}
          from={pages?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
        />

        {/* Pagination section */}
        {pages?.links && (
          <Pagination
            from={pages?.from || 0}
            to={pages?.to || 0}
            total={pages?.total || 0}
            links={pages?.links}
            entityName="pages"
            onPageChange={(url) => router.get(url)}
          />
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto space-y-4">
            <div>
              <Label htmlFor="edit_title">Page Title</Label>
              <Input
                id="edit_title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="About Us"
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="edit_slug">Page Slug (URL)</Label>
              <div className="flex space-x-2">
                <Input
                  id="edit_slug"
                  value={data.slug}
                  onChange={(e) => {
                    setData('slug', e.target.value);
                    if (e.target.value && e.target.value !== editingPage?.slug) {
                      checkSlugAvailability(e.target.value, editingPage?.id);
                    } else {
                      setSlugValidation({ loading: false, available: null, message: '' });
                    }
                  }}
                  placeholder="about-us"
                  className={slugValidation.available === false ? 'border-red-500' : slugValidation.available === true ? 'border-green-500' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateSlugFromTitle(editingPage?.id)}
                  disabled={!data.title}
                >
                  Generate
                </Button>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-500">
                  URL: {window.location.origin}/page/{data.slug || 'your-slug'}
                </p>
                {slugValidation.loading && <p className="text-sm text-blue-600">Checking availability...</p>}
                {slugValidation.available === true && <p className="text-sm text-green-600">✓ Slug is available</p>}
                {slugValidation.available === false && <p className="text-sm text-red-600">✗ Slug is already taken</p>}
              </div>
              {errors.slug && <p className="text-red-600 text-sm">{errors.slug}</p>}
            </div>

            <div>
              <Label htmlFor="edit_content">Content</Label>
              <RichTextEditor
                content={data.content}
                onChange={(content) => setData('content', content)}
                placeholder="Page content..."
                className="min-h-[200px]"
              />
              {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
            </div>

            <div>
              <Label htmlFor="edit_meta_title">Meta Title (SEO)</Label>
              <Input
                id="edit_meta_title"
                value={data.meta_title}
                onChange={(e) => setData('meta_title', e.target.value)}
                placeholder="SEO title"
              />
            </div>

            <div>
              <Label htmlFor="edit_meta_description">Meta Description (SEO)</Label>
              <Textarea
                id="edit_meta_description"
                value={data.meta_description}
                onChange={(e) => setData('meta_description', e.target.value)}
                placeholder="SEO description"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={data.is_active}
                onCheckedChange={(checked) => setData('is_active', checked)}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update Page'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Page</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="About Us"
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="slug">Page Slug (URL)</Label>
              <div className="flex space-x-2">
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => {
                    setData('slug', e.target.value);
                    if (e.target.value) {
                      checkSlugAvailability(e.target.value);
                    } else {
                      setSlugValidation({ loading: false, available: null, message: '' });
                    }
                  }}
                  placeholder="about-us (leave empty to auto-generate)"
                  className={slugValidation.available === false ? 'border-red-500' : slugValidation.available === true ? 'border-green-500' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateSlugFromTitle()}
                  disabled={!data.title}
                >
                  Generate
                </Button>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-500">
                  URL: {window.location.origin}/page/{data.slug || 'auto-generated-from-title'}
                </p>
                {slugValidation.loading && <p className="text-sm text-blue-600">Checking availability...</p>}
                {slugValidation.available === true && <p className="text-sm text-green-600">✓ Slug is available</p>}
                {slugValidation.available === false && <p className="text-sm text-red-600">✗ Slug is already taken</p>}
              </div>
              {errors.slug && <p className="text-red-600 text-sm">{errors.slug}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={data.content}
                onChange={(content) => setData('content', content)}
                placeholder="Page content..."
                className="min-h-[200px]"
              />
              {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
            </div>

            <div>
              <Label htmlFor="meta_title">Meta Title (SEO)</Label>
              <Input
                id="meta_title"
                value={data.meta_title}
                onChange={(e) => setData('meta_title', e.target.value)}
                placeholder="SEO title"
              />
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description (SEO)</Label>
              <Textarea
                id="meta_description"
                value={data.meta_description}
                onChange={(e) => setData('meta_description', e.target.value)}
                placeholder="SEO description"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={data.is_active}
                onCheckedChange={(checked) => setData('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Page'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={pageToDelete?.title || ''}
        entityName="Custom Page"
      />

      <Toaster />
    </PageTemplate>
  );
}