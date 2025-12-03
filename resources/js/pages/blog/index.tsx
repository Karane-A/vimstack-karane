import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, BookOpen, Eye, Edit, Trash2, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

export default function Blog() {
  const { t } = useTranslation();
  const { blogs, stats } = usePage().props as any;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { hasPermission } = usePermissions();

  const pageActions = [];
  
  if (hasPermission('view-blog')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('blog.export'), '_blank')
    });
  }
  
  if (hasPermission('create-blog')) {
    pageActions.push({
      label: t('Create Post'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('blog.create'))
    });
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'secondary';
    }
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    router.delete(route('blog.destroy', selectedPost.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <PageTemplate 
      title={t('Blog System')}
      url="/blog"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Blog System') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Posts')}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">{t('All blog posts')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Published')}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedPosts}</div>
              <p className="text-xs text-muted-foreground">
                {t('{{percent}}% published', { percent: stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0 })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Views')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{t('All time views')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Avg. Views')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgViews}</div>
              <p className="text-xs text-muted-foreground">Per post</p>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Blog Posts')}</CardTitle>
          </CardHeader>
          <CardContent>
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">{t('No blog posts found')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('Get started by creating your first blog post.')}
                </p>
                <Permission permission="create-blog">
                  <Button 
                    onClick={() => router.visit(route('blog.create'))} 
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Create Post')}
                  </Button>
                </Permission>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((post) => (
                  <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-24 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                      <img
                        src={post.featured_image ? getImageUrl(post.featured_image) : '/images/placeholder-image.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                            <Badge variant={getStatusVariant(post.status)}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{post.author?.name || t('Unknown')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{t('{{count}} views', { count: post.views })}</span>
                            </div>
                            {post.category && (
                              <Badge variant="outline" className="text-xs">
                                {post.category.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Permission permission="view-blog">
                            <Button variant="ghost" size="sm" onClick={() => router.visit(route('blog.show', post.id))}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Permission>
                          <Permission permission="edit-blog">
                            <Button variant="ghost" size="sm" onClick={() => router.visit(route('blog.edit', post.id))}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Permission>
                          <Permission permission="delete-blog">
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(post)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Permission>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Blog Post')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('Are you sure you want to delete the blog post "{{title}}"?', { title: selectedPost?.title })}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('This action cannot be undone.')}
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