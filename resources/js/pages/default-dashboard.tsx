import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { ArrowRight, Shield, Info } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';

interface Props {
  message: string;
  availableActions: Array<{
    title: string;
    route: string;
    description: string;
  }>;
}

export default function DefaultDashboard({ message, availableActions }: Props) {
  const { t } = useTranslation();
  const { themeColor, customColor } = useBrand();
  
  // Get dynamic theme color value
  const getThemeColorValue = () => {
    const THEME_COLORS = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      orange: '#f97316',
      red: '#ef4444',
    };
    return themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
  };

  return (
    <PageTemplate 
      title={t('Welcome')} 
      description={t('System Access')} 
      url="/dashboard"
    >
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: getThemeColorValue() }} />
              {t('System Access')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: getThemeColorValue() }} />
              <div>
                <p className="text-gray-700 mb-2">{message}</p>
                <p className="text-sm text-gray-500">
                  {t('Contact your administrator if you need additional permissions.')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Actions */}
        {availableActions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Available Actions')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('Here are the features you have access to:')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableActions.map((action, index) => (
                  <div key={index} className="group">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {action.description}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between hover:bg-primary/10"
                          asChild
                        >
                          <Link href={route(action.route)}>
                            {t('Access')} 
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Actions Available */}
        {availableActions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('No Actions Available')}
              </h3>
              <p className="text-gray-500 mb-4">
                {t('You currently do not have access to any system features.')}
              </p>
              <p className="text-sm text-gray-400">
                {t('Please contact your system administrator to request access permissions.')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
}