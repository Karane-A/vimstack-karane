import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface Campaign {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  business: {
    id: number;
    name: string;
    slug: string;
    url_prefix?: string;
    custom_domain?: string;
  };
}

interface ActiveCampaignsSectionProps {
  campaigns: Campaign[];
  settings: any;
  sectionData: any;
  brandColor: string;
}

export default function ActiveCampaignsSection({ 
  campaigns, 
  settings, 
  sectionData, 
  brandColor 
}: ActiveCampaignsSectionProps) {
  if (!campaigns || campaigns.length === 0) {
    return null;
  }
  
  const { t } = useTranslation();
  const layout = sectionData?.layout || 'grid';
  const columns = sectionData?.columns || 3;
  const maxDisplay = sectionData?.max_display || 6;
  const showViewAll = sectionData?.show_view_all || false;
  const backgroundColor = sectionData?.background_color || '#f8fafc';
  const backgroundImage = sectionData?.background_image ? 
    (sectionData.background_image.startsWith('http') ? 
      sectionData.background_image : 
      `${window.appSettings?.imageUrl || '/storage'}${sectionData.background_image}`
    ) : null;
  const overlay = sectionData?.overlay || false;
  const overlayColor = sectionData?.overlay_color || 'rgba(0,0,0,0.5)';
  
  const displayedCampaigns = campaigns.slice(0, maxDisplay);
  const hasMoreCampaigns = campaigns.length > maxDisplay;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getBusinessUrl = (business: Campaign['business']) => {
    return business.custom_domain 
      ? `https://${business.custom_domain}`
      : (business.url_prefix && business.url_prefix !== '' 
        ? route('public.store.show', { prefix: business.url_prefix, slug: business.slug }, true)
        : route('public.store.show.direct', business.slug, true));
  };

  const title = sectionData?.title || 'Featured Business Promotions';
  const subtitle = sectionData?.subtitle || 'Explore businesses we\'re currently promoting and discover amazing services';

  const getGridColumns = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <section 
      className="py-16 relative"
      style={{ backgroundColor }}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {overlay && (
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor }}
            />
          )}
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: brandColor }}
          >
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className={`grid ${getGridColumns()} gap-6`}>
          {displayedCampaigns.map((campaign) => {
            const daysRemaining = getDaysRemaining(campaign.end_date);
            const businessUrl = getBusinessUrl(campaign.business);

            return (
              <Card key={campaign.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {campaign.description}
                      </p>
                    </div>
                    {daysRemaining > 0 && (
                      <div 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        {daysRemaining} {t('days left')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="font-medium">{campaign.business.name}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
                    </div>
                    
                    {daysRemaining > 0 && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{t('Ends in')} {daysRemaining} {t('day', { count: daysRemaining })}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full group-hover:shadow-md transition-shadow"
                    style={{ backgroundColor: brandColor }}
                    onClick={() => window.open(businessUrl, '_blank', 'noopener,noreferrer')}
                  >
                    <span>{t('Visit Business')}</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {showViewAll && hasMoreCampaigns && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="hover:shadow-md transition-shadow"
              style={{ borderColor: brandColor, color: brandColor }}
            >
              {t('View All Campaigns')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}