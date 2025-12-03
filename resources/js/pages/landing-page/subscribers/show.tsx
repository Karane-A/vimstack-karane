import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NewsletterSubscriberShow() {
  const { t } = useTranslation();
  const { newsletter } = usePage().props as any;

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Landing Page') },
    { title: t('Newsletter Subscribers'), href: route('landing-page.subscribers.index') },
    { title: newsletter.email }
  ];

  const pageActions = [
    {
      label: 'Back to List',
      icon: <ArrowLeft className="h-4 w-4 mr-2" />,
      variant: 'outline',
      onClick: () => router.get(route('landing-page.subscribers.index'))
    }
  ];

  return (
    <PageTemplate 
      title={t("Newsletter Subscriber Details")} 
      url="/landing-page/subscribers"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Mail className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{newsletter.email}</h2>
            <div className="flex items-center gap-2 mt-1">
              {newsletter.status === 'active' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-700 font-medium">{t('Active Subscriber')}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-700 font-medium">{t('Unsubscribed')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Subscription Details')}</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('Email Address')}</dt>
                <dd className="text-sm text-gray-900">{newsletter.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('Status')}</dt>
                <dd className="text-sm text-gray-900">
                  {newsletter.status === 'active' ? t('Active') : t('Unsubscribed')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('Subscribed At')}</dt>
                <dd className="text-sm text-gray-900">
                  {window.appSettings?.formatDateTime(newsletter.subscribed_at, true) || new Date(newsletter.subscribed_at).toLocaleString()}
                </dd>
              </div>
              {newsletter.unsubscribed_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('Unsubscribed At')}</dt>
                  <dd className="text-sm text-gray-900">
                    {window.appSettings?.formatDateTime(newsletter.unsubscribed_at, true) || new Date(newsletter.unsubscribed_at).toLocaleString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('Created At')}</dt>
                <dd className="text-sm text-gray-900">
                  {window.appSettings?.formatDateTime(newsletter.created_at, true) || new Date(newsletter.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}