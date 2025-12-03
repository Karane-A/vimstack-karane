import React from 'react';
import { QrCode, Smartphone, Share2, BarChart3, Globe, Shield, Star, Zap, Users, Lock, Wifi, Heart } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    description?: string;
    features_list?: Feature[];
  };
}

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<any>> = {
  'qr-code': QrCode,
  'smartphone': Smartphone,
  'share': Share2,
  'bar-chart': BarChart3,
  'globe': Globe,
  'shield': Shield,
  'star': Star,
  'zap': Zap,
  'users': Users,
  'lock': Lock,
  'wifi': Wifi,
  'heart': Heart
};

export default function FeaturesSection({ settings, sectionData, brandColor = '#3b82f6' }: FeaturesSectionProps) {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  
  // Get colors from settings
  const colors = settings?.config_sections?.colors || { primary: brandColor, secondary: '#059669', accent: '#065f46' };
  const primaryColor = colors.primary || brandColor;
  const secondaryColor = colors.secondary || '#059669';
  const accentColor = colors.accent || '#065f46';
  // Helper to get full URL for images
  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${window.appSettings.imageUrl}${path}`;
  };
  
  const sectionImage = getImageUrl(sectionData.image);
  const backgroundColor = sectionData.background_color || '#f9fafb';
  const columns = sectionData.columns || 3;
  // Default features if none provided
  const defaultFeatures = [
    {
      icon: 'bar-chart',
      title: 'Analytics & Insights',
      description: 'Track views, clicks, and engagement metrics. Understand how your network interacts with your card.'
    },
    {
      icon: 'globe',
      title: 'Custom Domains',
      description: 'Use your own domain for a professional branded experience. Build trust with custom URLs.'
    },
    {
      icon: 'shield',
      title: 'Secure & Private',
      description: 'Enterprise-grade security with privacy controls. Your data is protected and under your control.'
    }
  ];

  const features = sectionData.features_list && sectionData.features_list.length > 0 
    ? sectionData.features_list 
    : defaultFeatures;

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title || 'Powerful Features for Modern Networking'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData.description || 'Everything you need to create, share, and manage your digital business presence. Built for professionals who value efficiency and innovation.'}
          </p>
        </div>

        {sectionImage && (
          <div className="mb-8 sm:mb-12 text-center">
            <img src={sectionImage} alt="Features" className="max-w-full h-auto rounded-xl shadow-lg mx-auto" />
          </div>
        )}
        
        <div className={`grid grid-cols-1 ${columns >= 2 ? 'sm:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6 sm:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || QrCode;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
                role="article"
                aria-labelledby={`feature-${index}-title`}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" 
                  style={{ backgroundColor: `${index % 3 === 0 ? primaryColor : index % 3 === 1 ? secondaryColor : accentColor}15` }} 
                  role="img" 
                  aria-label={`${feature.title} icon`}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color: index % 3 === 0 ? primaryColor : index % 3 === 1 ? secondaryColor : accentColor }} 
                    aria-hidden="true" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4" id={`feature-${index}-title`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}