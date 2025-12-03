import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, Edit, Trash2, FolderTree, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';

export default function BlogCategories() {
  const { t } = useTranslation();
  const { categories: backendCategories, stats } = usePage().props as any;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    parent_id: null
  });

  // Use categories from backend
  const allCategories = backendCategories || [];
  
  // Filter categories based on search term
  const categories = searchTerm
    ? allCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allCategories;

  const pageActions = [
    {
      label: t('Create Category'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => {
        setFormData({
          name: '',
          slug: '',
          description: '',
          is_active: true,
          parent_id: null
        });
        setIsCreateDialogOpen(true);
      }
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.is_active,
      parent_id: category.parent_id || null
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = () => {
    router.post(route('blog.categories.store'), formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      }
    });
  };

  const handleEditSubmit = () => {
    router.put(route('blog.categories.update', selectedCategory.id), formData, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };

  const handleDeleteConfirm = () => {
    router.delete(route('blog.categories.destroy', selectedCategory.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  // Generate slug from name
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  return (
    <PageTemplate 
      title={t('Blog Categories')}
      url="/blog/categories"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Blog System'), href: route('blog.index') },
        { title: t('Categories') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Categories')}</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">{t('All categories')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Categories')}</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.active || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('{{percent}}% active', { percent: stats?.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0 })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Most Popular')}</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.mostPopular || 0}
              </div>
              <p className="text-xs text-muted-foreground">{t('Posts in top category')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Avg. Posts')}</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.avgPosts || 0}
              </div>
              <p className="text-xs text-muted-foreground">{t('Per category')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Categories')}</CardTitle>
          </CardHeader>
          <div className="px-6 py-2 border-b">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Input 
                  placeholder={t('Search categories...')} 
                  className="pr-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderTree className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">{t('No categories found')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('Get started by creating your first blog category.')}
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('Create Category')}
                </Button>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3">{t('Name')}</th>
                      <th scope="col" className="px-6 py-3">{t('Slug')}</th>
                      <th scope="col" className="px-6 py-3">{t('Description')}</th>
                      <th scope="col" className="px-6 py-3">{t('Posts')}</th>
                      <th scope="col" className="px-6 py-3">{t('Status')}</th>
                      <th scope="col" className="px-6 py-3 text-right">{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">{category.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">{category.slug}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{category.description}</td>
                      <td className="px-6 py-4">{category.post_count}</td>
                      <td className="px-6 py-4">
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? t('Active') : t('Inactive')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Create Category')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('Category Name')}</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                onBlur={generateSlug}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">{t('Slug')}</Label>
              <Input 
                id="slug" 
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('Description')}</Label>
              <Input 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">{t('Active')}</Label>
              <Switch 
                id="is_active" 
                checked={formData.is_active} 
                onCheckedChange={handleSwitchChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleCreateSubmit}>{t('Create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Edit Category')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('Category Name')}</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">{t('Slug')}</Label>
              <Input 
                id="edit-slug" 
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t('Description')}</Label>
              <Input 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-is_active">{t('Active')}</Label>
              <Switch 
                id="edit-is_active" 
                checked={formData.is_active} 
                onCheckedChange={handleSwitchChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleEditSubmit}>{t('Update')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Category')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('Are you sure you want to delete the category "{{name}}"?', { name: selectedCategory?.name })}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('This category has {{count}} posts. Deleting it may affect these posts.', { count: selectedCategory?.post_count })}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('Cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>{t('Delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}