import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ScreenshotsSection from './components/ScreenshotsSection';
import WhyChooseUs from './components/WhyChooseUs';
import TemplatesSection from './components/TemplatesSection';
import AboutUs from './components/AboutUs';
import TeamSection from './components/TeamSection';
import TestimonialsSection from './components/TestimonialsSection';
import PlansSection from './components/PlansSection';
import FaqSection from './components/FaqSection';
import NewsletterSection from './components/NewsletterSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ActiveCampaignsSection from './components/ActiveCampaignsSection';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { useFavicon } from '@/hooks/use-favicon';
import { useTranslation } from 'react-i18next';
import ThemeColorProvider from '@/components/ThemeColorProvider';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  yearly_price?: number;
  duration: string;
  features?: string[];
  is_popular?: boolean;
  is_plan_enable: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface LandingSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    sections: Array<{
      key: string;
      [key: string]: any;
    }>;
    theme?: {
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
      logo_light?: string;
      logo_dark?: string;
      favicon?: string;
    };
    seo?: {
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string;
    };
    custom_css?: string;
    custom_js?: string;
    section_order?: string[];
    section_visibility?: {
      [key: string]: boolean;
    };
  };
}

interface CustomPage {
  id: number;
  title: string;
  slug: string;
}

interface FeaturedStore {
  id: number;
  name: string;
  description: string;
  slug: string;
  logo?: string;
}

interface PageProps {
  plans: Plan[];
  testimonials: Testimonial[];
  faqs: Faq[];
  customPages: CustomPage[];
  settings: LandingSettings;
  featuredStores: FeaturedStore[];
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function LandingPage() {
  const { plans, testimonials, faqs, customPages = [], settings, featuredStores = [], flash } = usePage<PageProps>().props;
  const { i18n } = useTranslation();

  useFavicon();
  // Get brand colors - prioritize superadmin landing page colors over brand context
  const { themeColor, customColor } = useBrand();
  const configColors = settings.config_sections?.colors;
  // Use landing page colors first, then fall back to brand context
  const primaryColor = configColors?.primary || (themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS]) || '#10b981';
  const secondaryColor = configColors?.secondary || '#059669';
  const accentColor = configColors?.accent || '#065f46';
  const page = usePage<SharedData>();
  const { auth } = page.props;
  
  // Initialize language from user preference
  React.useEffect(() => {
    if (auth.lang && auth.lang !== i18n.language) {
      i18n.changeLanguage(auth.lang);
    }
  }, [auth.lang, i18n]);
  
  // Get title from brand context (superadmin settings) first, then SEO, then fallback
  const { titleText } = useBrand();
  const seo = settings.config_sections?.seo;
  const pageTitle = titleText || seo?.meta_title || 'StoreGo - Build Your Online Store';
  const metaDescription = seo?.meta_description || 'Create beautiful, professional online stores with StoreGo. Everything you need to start selling online.';

  // Custom CSS
  React.useEffect(() => {
    const customCss = settings.config_sections?.custom_css;
    if (customCss) {
      const styleId = 'landing-custom-css';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = customCss;
    }
  }, [settings.config_sections?.custom_css]);

  // Custom JS
  React.useEffect(() => {
    const customJs = settings.config_sections?.custom_js;
    if (customJs) {
      const scriptId = 'landing-custom-js';
      let scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        scriptElement.remove();
      }
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.textContent = customJs;
      document.body.appendChild(scriptElement);
    }
  }, [settings.config_sections?.custom_js]);

  // Get section data helper
  const getSectionData = (key: string) => {
    return settings.config_sections?.sections?.find(section => section.key === key) || {};
  };

  // Get section visibility
  const isSectionVisible = (key: string) => {
    return settings.config_sections?.section_visibility?.[key] !== false;
  };

  // Get section order or use default
  const sectionOrder = settings.config_sections?.section_order || [
    'header', 'hero', 'features', 'screenshots', 'why_choose_us', 'templates', 'about', 
    'team', 'testimonials', 'featured_stores', 'plans', 'faq', 'newsletter', 'contact', 'footer'
  ];

  // Component mapping
  const sectionComponents = {
    header: () => isSectionVisible('header') && (
      <Header 
        settings={settings} 
        sectionData={getSectionData('header')}
        customPages={customPages} 
        brandColor={primaryColor} 
        user={auth.user}
      />
    ),
    hero: () => isSectionVisible('hero') && (
      <HeroSection 
        settings={settings} 
        sectionData={getSectionData('hero')}
        brandColor={primaryColor} 
      />
    ),
    features: () => isSectionVisible('features') && (
      <FeaturesSection 
        settings={settings} 
        sectionData={getSectionData('features')}
        brandColor={primaryColor} 
      />
    ),
    screenshots: () => isSectionVisible('screenshots') && (
      <ScreenshotsSection 
        settings={settings} 
        sectionData={getSectionData('screenshots')}
        brandColor={primaryColor} 
      />
    ),
    why_choose_us: () => isSectionVisible('why_choose_us') && (
      <WhyChooseUs 
        settings={settings} 
        sectionData={getSectionData('why_choose_us')}
        brandColor={primaryColor} 
      />
    ),
    templates: () => isSectionVisible('templates') && (
      <TemplatesSection 
        settings={settings} 
        sectionData={getSectionData('templates')}
        brandColor={primaryColor} 
      />
    ),
    about: () => isSectionVisible('about') && (
      <AboutUs 
        settings={settings} 
        sectionData={getSectionData('about')}
        brandColor={primaryColor} 
      />
    ),
    team: () => isSectionVisible('team') && (
      <TeamSection 
        settings={settings} 
        sectionData={getSectionData('team')}
        brandColor={primaryColor} 
      />
    ),
    testimonials: () => isSectionVisible('testimonials') && (
      <TestimonialsSection 
        testimonials={testimonials} 
        settings={settings} 
        sectionData={getSectionData('testimonials')}
        brandColor={primaryColor} 
      />
    ),
    featured_stores: () => isSectionVisible('featured_stores') && featuredStores.length > 0 && (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: primaryColor }}>
            Featured Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                {store.logo && (
                  <img src={store.logo} alt={store.name} className="w-16 h-16 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                <p className="text-gray-600 mb-4">{store.description}</p>
                <a 
                  href={`/store/${store.slug}`}
                  className="inline-block px-4 py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  Visit Store
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    plans: () => isSectionVisible('plans') && (
      <PlansSection 
        plans={plans} 
        settings={settings} 
        sectionData={getSectionData('plans')}
        brandColor={primaryColor} 
      />
    ),
    faq: () => isSectionVisible('faq') && (
      <FaqSection 
        faqs={faqs} 
        settings={settings} 
        sectionData={getSectionData('faq')}
        brandColor={primaryColor} 
      />
    ),
    newsletter: () => isSectionVisible('newsletter') && (
      <NewsletterSection 
        flash={flash} 
        settings={settings} 
        sectionData={getSectionData('newsletter')}
        brandColor={primaryColor} 
      />
    ),
    contact: () => isSectionVisible('contact') && (
      <ContactSection 
        flash={flash} 
        settings={settings} 
        sectionData={getSectionData('contact')}
        brandColor={primaryColor} 
      />
    ),
    footer: () => isSectionVisible('footer') && (
      <Footer 
        settings={settings} 
        sectionData={getSectionData('footer')}
        brandColor={primaryColor} 
      />
    )
  };

  return (
    <ThemeColorProvider colors={configColors}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {seo?.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}
      </Head>
      <div 
        className="min-h-screen bg-white" 
        data-landing-page="true"
        style={{ 
          scrollBehavior: 'smooth', 
          '--brand-color': primaryColor,
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
          '--accent-color': accentColor
        } as React.CSSProperties}
      >
        {sectionOrder.map((sectionKey) => {
          const Component = sectionComponents[sectionKey as keyof typeof sectionComponents];
          return Component ? <React.Fragment key={sectionKey}>{Component()}</React.Fragment> : null;
        })}
      </div>
    </ThemeColorProvider>
  );
}