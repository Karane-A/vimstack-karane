import React, { useState, useEffect } from 'react';
import storeTheme from '@/config/store-theme';
import { getImageUrl } from '@/utils/image-helper';

interface HeroSectionProps {
  content?: any;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  baseUrl?: string;
}

export default function HeroSection({
  content,
  title,
  subtitle,
  buttonText,
  buttonLink,
  image,
  secondaryButtonText = "View Collections",
  secondaryButtonLink = "/collections",
  baseUrl
}: HeroSectionProps) {
  // Use dynamic content if available, otherwise fallback to props or static config
  const heroTitle = content?.title || title || storeTheme.homepage.heroSection.title;
  const heroSubtitle = content?.subtitle || subtitle || storeTheme.homepage.heroSection.subtitle;
  const heroButtonText = content?.button_text || buttonText || storeTheme.homepage.heroSection.buttonText;
  const rawButtonLink = content?.button_link || buttonLink || storeTheme.homepage.heroSection.buttonLink;
  const heroButtonLink = baseUrl ? `${baseUrl}${rawButtonLink}` : rawButtonLink;
  const heroImage = content?.image || image || storeTheme.homepage.heroSection.image;
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Animated classes
  const fadeIn = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
  const fadeInDelay1 = isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8';
  const fadeInDelay2 = isVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-8';
  const scaleIn = isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Content */}
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <div 
              className={`inline-block mb-4 transition-all duration-700 ease-out ${fadeIn}`}
            >
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                {content?.badge_text || 'New Collection'}
              </span>
            </div>
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-700 ease-out ${fadeInDelay1}`}
            >
              {heroTitle}
            </h1>
            <p 
              className={`text-lg text-gray-600 mb-8 max-w-lg transition-all duration-700 ease-out ${fadeInDelay2}`}
            >
              {heroSubtitle}
            </p>
            <div 
              className={`flex flex-wrap gap-4 transition-all duration-700 ease-out ${fadeInDelay2}`}
            >
              {/* Fixed primary button */}
              <a 
                href={heroButtonLink} 
                className="group bg-primary hover:bg-blue-700 px-8 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center text-white"
              >
                <span style={{ color: 'white' }}>{heroButtonText}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                  viewBox="0 0 20 20" 
                  fill="white"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </a>
              <a 
                href={baseUrl ? `${baseUrl}${content?.secondary_button_link || secondaryButtonLink}` : (content?.secondary_button_link || secondaryButtonLink)} 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {content?.secondary_button_text || secondaryButtonText}
              </a>
            </div>
            
            {/* Trust badges */}
            <div 
              className={`mt-12 flex flex-wrap gap-6 transition-all duration-700 delay-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {(content?.info_boxes || [
                { icon: 'truck', title: 'Free Shipping', description: 'On orders over $50' },
                { icon: 'refresh-cw', title: '30-Day Returns', description: 'Hassle-free returns' },
                { icon: 'shield-check', title: 'Secure Checkout', description: '100% protected' }
              ]).map((box, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    {box.icon === 'truck' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                      </svg>
                    )}
                    {box.icon === 'refresh-cw' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    )}
                    {box.icon === 'shield-check' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium block">{box.title}</span>
                    <span className="text-xs text-gray-500">{box.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div className="md:w-1/2 relative">
            <div 
              className={`relative z-10 transition-all duration-1000 ease-out ${scaleIn}`}
            >
              <img 
                src={getImageUrl(heroImage)} 
                alt="Home Accessories Collection" 
                className="rounded-2xl shadow-xl object-cover w-full h-full"
                style={{ maxHeight: '600px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Home+Accessories';
                }}
              />
              
              {/* Image overlay gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full"></div>
            <div className="absolute -bottom-10 right-20 w-16 h-16 bg-primary/20 rounded-full"></div>
            
            {/* Animated dots */}
            <div className={`absolute top-1/4 -left-8 w-4 h-4 bg-primary rounded-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-70' : 'opacity-0'}`}></div>
            <div className={`absolute bottom-1/3 -right-6 w-3 h-3 bg-secondary rounded-full transition-all duration-1000 delay-500 ${isVisible ? 'opacity-70' : 'opacity-0'}`}></div>
            <div className={`absolute top-1/2 left-1/4 w-2 h-2 bg-accent rounded-full transition-all duration-1000 delay-700 ${isVisible ? 'opacity-70' : 'opacity-0'}`}></div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  );
}