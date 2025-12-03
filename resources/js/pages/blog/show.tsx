import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Eye, Calendar, User, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

export default function ShowBlog() {
  const { t } = useTranslation();
  const { blog, stats, relatedPosts } = usePage().props as any;

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('blog.index'))
    },
    {
      label: t('Edit Post'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('blog.edit', blog.id))
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <PageTemplate 
      title={t('Blog Post Details')}
      url="/blog/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Blog System'), href: route('blog.index') },
        { title: t('Blog Post Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{blog.title}</CardTitle>
                <Badge variant="default">
                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {blog.featured_image && (
                <div className="w-full h-64 rounded-lg overflow-hidden border">
                  <img
                    src={getImageUrl(blog.featured_image)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author?.name || t('Unknown')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.published_at || blog.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{t('{{count}} views', { count: blog.views })}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground mb-4">
                  {blog.excerpt}
                </p>
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Post Statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{blog.views}</div>
                <p className="text-sm text-muted-foreground">{t('Total Views')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats?.approved_comments || 0}</div>
                <p className="text-sm text-muted-foreground">{t('Comments')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats?.reading_time || 0}</div>
                <p className="text-sm text-muted-foreground">{t('Min Read')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats?.engagement_rate || 0}%</div>
                <p className="text-sm text-muted-foreground">{t('Engagement')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Post Details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Category')}</span>
                {blog.category ? (
                  <Badge variant="outline">{blog.category.name}</Badge>
                ) : (
                  <span>{t('Uncategorized')}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Author')}</span>
                <span>{blog.author?.name || t('Unknown')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Published Date')}</span>
                <span>{formatDate(blog.published_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Last Modified')}</span>
                <span>{formatDate(blog.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Status')}</span>
                <span>{blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('SEO Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Meta Title')}</p>
                <p className="text-sm">{blog.meta_title || blog.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Meta Description')}</p>
                <p className="text-sm">{blog.meta_description || blog.excerpt}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('Focus Keyword')}</p>
                <p className="text-sm">{blog.focus_keyword || t('None')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('URL Slug')}</p>
                <p className="text-sm font-mono">{blog.slug}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <CardTitle>{t('Tags')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {blog.comments && blog.comments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Recent Comments')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blog.comments.map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {comment.user ? comment.user.name : comment.author_name || t('Anonymous')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {relatedPosts && relatedPosts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Related Posts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((post: any) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    {post.featured_image && (
                      <div className="w-full h-32 rounded-lg overflow-hidden border mb-3">
                        <img
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-medium mb-2">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.published_at)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('Content Analytics')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Word Count')}</span>
              <span className="font-semibold">{stats?.word_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Total Comments')}</span>
              <span className="font-semibold">{stats?.total_comments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Engagement Rate')}</span>
              <span className="font-semibold">{stats?.engagement_rate || 0}%</span>
            </div>
            {stats?.pending_comments > 0 && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Pending Comments')}</span>
                <Badge variant="outline">{stats.pending_comments}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}