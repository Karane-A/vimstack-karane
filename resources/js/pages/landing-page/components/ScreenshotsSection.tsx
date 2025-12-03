import React from 'react';
import { Monitor } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../../utils/image-helper';

interface ScreenshotsSectionProps {
  brandColor?: string;
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    screenshots_list?: Array<{
      src: string;
      alt: string;
      title: string;
      description: string;
    }>;
  };
}

export default function ScreenshotsSection({ brandColor = '#3b82f6', settings, sectionData }: ScreenshotsSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  
  const screenshots = sectionData?.screenshots_list && sectionData.screenshots_list.length > 0 
    ? sectionData.screenshots_list
    : [];

  return (
    <section id="screenshots" className="py-12 sm:py-16 lg:py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || t('See Store SaaS in Action')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData?.subtitle || t('Explore our intuitive interface and powerful features designed to streamline your digital networking experience.')}
          </p>
        </div>

        {screenshots.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {screenshot.src ? (
                    <img
                      src={getImageUrl(screenshot.src)}
                      alt={screenshot.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: screenshot.src ? 'none' : 'flex' }}>
                    <Monitor className="w-12 h-12" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {screenshot.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {screenshot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-gray-400 mb-4">
              <Monitor className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500">{t('No screenshots configured yet. Add some in the admin settings.')}</p>
          </div>
        )}

        <div className={`text-center mt-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium border-2" style={{ borderColor: brandColor, color: brandColor }}>
            ✨ {t('And many more features to discover')}
          </div>
        </div>
      </div>
    </section>
  );
}