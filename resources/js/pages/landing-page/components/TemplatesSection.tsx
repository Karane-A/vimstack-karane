import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
// Simple template data for Storego
const getBusinessTemplate = (name: string) => {
  return {
    defaultData: {
      header: { name: name.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
    }
  };
};

const StorePreview = ({ businessType, data }: any) => (
  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center p-4">
      <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
        <span className="text-2xl font-bold text-indigo-600">{data.name?.charAt(0) || 'T'}</span>
      </div>
      <h3 className="font-semibold text-gray-800">{data.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{businessType.replace(/-/g, ' ')}</p>
    </div>
  </div>
);


interface Template {
  name: string;
  category: string;
}

interface TemplatesSectionProps {
  settings: any;
  sectionData: {
    title: string;
    subtitle: string;
    background_color: string;
    layout: string;
    columns: number;
    templates_list: Template[];
    cta_text: string;
    cta_link: string;
  };
  brandColor: string;
}

export default function TemplatesSection({ settings, sectionData, brandColor }: TemplatesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const {
    title = 'Explore Our Templates',
    subtitle = 'Choose from our professionally designed templates to create your perfect digital business card.',
    background_color = '#f8fafc',
    layout = 'carousel', // Default to carousel
    columns = 3,
    templates_list = [],
    cta_text = 'View All Templates',
    cta_link = '#'
  } = sectionData || {};
  
  // Number of templates to show per slide
  const templatesPerSlide = 3;
  const totalSlides = Math.ceil(templates_list.length / templatesPerSlide);
  
  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  
  // Update slider position when currentSlide changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);
  
  // Open preview in new tab
  const openPreview = (templateName: string) => {
    // Store the template data in localStorage for the preview page to use
    const templateData = getBusinessTemplate(templateName);
    localStorage.setItem('store_preview_data', JSON.stringify({
      business_type: templateName,
      name: templateData?.defaultData?.header?.name || 'Business Name',
      slug: 'preview',
      config_sections: templateData?.defaultData || {}
    }));
    
    // Open the preview in a new tab
    alert(`Preview: ${templateData?.defaultData?.header?.name || templateName}`);
  };

  // Template card component with StorePreview
  const TemplateCard = ({ template, inSlider = false }: { template: Template, inSlider?: boolean }) => {
    // Get template data for preview
    const templateData = getBusinessTemplate(template.name);
    
    // Create mock business data for preview
    const mockBusiness = {
      name: template.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      business_type: template.name,
      config_sections: templateData?.defaultData || {},
      template_config: {
        sections: templateData?.defaultData || {},
        sectionSettings: templateData?.defaultData || {}
      }
    };
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg border border-gray-200 group">
        <div className="h-80 overflow-hidden relative">
          {/* Template Preview using StorePreview */}
          <div className="w-full h-full overflow-hidden bg-gray-50 border-b border-gray-200">
            <div 
              className="w-full h-full" 
              style={{ 
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div 
                className="w-[140%] transform scale-[0.85] origin-top group-hover:animate-scroll-y" 
                style={{ 
                  marginTop: '-10px', 
                  marginLeft: '-20%',
                  transition: 'none'
                }}
              >
                <StorePreview
                  businessType={template.name}
                  data={mockBusiness}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 mr-2">
              <h3 className="text-lg font-semibold capitalize truncate">{template.name.replace(/-/g, ' ')}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-1 rounded-full text-xs capitalize" 
                    style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                {template.category}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview(template.name);
                }}
                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
                aria-label="Preview template"
              >
                <Eye className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {template.category === 'business' ? 'Professional business card template' : 
             template.category === 'creative' ? 'Creative and unique design' : 
             template.category === 'technology' ? 'Modern tech-focused template' : 
             template.category === 'professional' ? 'Clean professional layout' : 
             template.category === 'medical' ? 'Healthcare professional template' :
             template.category === 'food' ? 'Restaurant and food service template' :
             template.category === 'health' ? 'Health and wellness template' :
             template.category === 'beauty' ? 'Beauty and cosmetics template' :
             template.category === 'services' ? 'Service provider template' :
             template.category === 'leisure' ? 'Travel and leisure template' :
             template.category === 'entertainment' ? 'Entertainment industry template' :
             'Professionally designed template'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="templates" 
      className="py-16 md:py-24"
      style={{ backgroundColor: background_color }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {/* Templates container based on layout */}
        {(layout === 'carousel' || layout === 'slider') && (
          // Carousel/Slider layout
          <div className="relative mb-12">
            {/* Slider navigation */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6 z-10">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-6 z-10">
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Slider wrapper */}
            <div className="overflow-hidden">
              <div 
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ width: `${totalSlides * 100}%` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div 
                    key={slideIndex} 
                    className="flex-shrink-0"
                    style={{ width: `${100 / totalSlides}%` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                      {templates_list
                        .slice(slideIndex * templatesPerSlide, (slideIndex + 1) * templatesPerSlide)
                        .filter(template => template && template.name)
                        .map((template, index) => (
                          <TemplateCard key={index} template={template} inSlider={true} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Slider pagination */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? 'bg-gray-800 w-6' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {layout === 'grid' && (
          // Grid layout
          <div className="mb-12">
            <div className={`grid grid-cols-1 ${
              columns === 1 ? '' : 
              columns === 2 ? 'md:grid-cols-2' : 
              columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 
              'md:grid-cols-2 lg:grid-cols-4'} gap-6`}
            >
              {templates_list
                .filter(template => template && template.name)
                .map((template, index) => (
                  <TemplateCard key={index} template={template} />
                ))}
            </div>
          </div>
        )}

        {layout === 'list' && (
          // List layout
          <div className="mb-12">
            <div className="space-y-6">
              {templates_list
                .filter(template => template && template.name)
                .map((template, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-col md:flex-row group"
                >
                  <div className="md:w-2/5 h-48 md:h-72 overflow-hidden relative">
                    {/* Template Preview using StorePreview */}
                    <div className="w-full h-full overflow-hidden bg-gray-50 border-r border-gray-200">
                      {(() => {
                        const templateData = getBusinessTemplate(template.name);
                        
                        // Create mock business data for preview
                        const mockBusiness = {
                          name: template.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                          business_type: template.name,
                          config_sections: templateData?.defaultData || {},
                          template_config: {
                            sections: templateData?.defaultData || {},
                            sectionSettings: templateData?.defaultData || {}
                          }
                        };
                        
                        return (
                          <div 
                            className="w-full h-full" 
                            style={{ 
                              overflow: 'hidden',
                              position: 'relative'
                            }}
                          >
                            <div 
                              className="w-[140%] transform scale-[0.85] origin-top group-hover:animate-scroll-y" 
                              style={{ 
                                marginTop: '-10px', 
                                marginLeft: '-20%',
                                transition: 'none'
                              }}
                            >
                              <StorePreview
                                businessType={template.name}
                                data={mockBusiness}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Preview button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <button 
                        onClick={() => openPreview(template.name)}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                        aria-label="Preview template"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold capitalize">{template.name.replace(/-/g, ' ')}</h3>
                      <span className="inline-block px-2 py-1 rounded-full text-xs capitalize" 
                            style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {template.category === 'business' ? 'Professional business card template' : 
                       template.category === 'creative' ? 'Creative and unique design' : 
                       template.category === 'technology' ? 'Modern tech-focused template' : 
                       template.category === 'professional' ? 'Clean professional layout' : 
                       template.category === 'medical' ? 'Healthcare professional template' :
                       template.category === 'food' ? 'Restaurant and food service template' :
                       template.category === 'health' ? 'Health and wellness template' :
                       template.category === 'beauty' ? 'Beauty and cosmetics template' :
                       template.category === 'services' ? 'Service provider template' :
                       template.category === 'leisure' ? 'Travel and leisure template' :
                       template.category === 'entertainment' ? 'Entertainment industry template' :
                       'Professionally designed template'}
                    </p>
                    <button 
                      onClick={() => openPreview(template.name)}
                      className="inline-flex items-center text-sm font-medium transition-colors"
                      style={{ color: brandColor }}
                    >
                      Preview Template
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cta_text && (
          <div className="text-center">
            <Link
              href={cta_link}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandColor }}
            >
              {cta_text}
            </Link>
          </div>
        )}
      </div>

    </section>
  );
}