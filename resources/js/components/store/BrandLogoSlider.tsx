import React, { useRef, useEffect } from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface Brand {
  id: number;
  name: string;
  logo: string;
  url?: string;
}

interface BrandLogoSliderProps {
  brands?: Brand[];
  content?: any;
}

export default function BrandLogoSlider({
  brands,
  content
}: BrandLogoSliderProps) {
  const defaultBrands = [
    { id: 1, name: "Brand One", logo: "/storage/media/brands/brand1.png", url: "#" },
    { id: 2, name: "Brand Two", logo: "/storage/media/brands/brand2.png", url: "#" },
    { id: 3, name: "Brand Three", logo: "/storage/media/brands/brand3.png", url: "#" },
    { id: 4, name: "Brand Four", logo: "/storage/media/brands/brand4.png", url: "#" },
    { id: 5, name: "Brand Five", logo: "/storage/media/brands/brand5.png", url: "#" },
    { id: 6, name: "Brand Six", logo: "/storage/media/brands/brand6.png", url: "#" },
    { id: 7, name: "Brand Seven", logo: "/storage/media/brands/brand7.png", url: "#" },
    { id: 8, name: "Brand Eight", logo: "/storage/media/brands/brand8.png", url: "#" }
  ];
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // For demo, use placeholder images if no real logos
  const placeholderBrands = [
    { id: 1, name: "Nike", logo: "https://placehold.co/200x80?text=Nike" },
    { id: 2, name: "Adidas", logo: "https://placehold.co/200x80?text=Adidas" },
    { id: 3, name: "Puma", logo: "https://placehold.co/200x80?text=Puma" },
    { id: 4, name: "Reebok", logo: "https://placehold.co/200x80?text=Reebok" },
    { id: 5, name: "Under Armour", logo: "https://placehold.co/200x80?text=Under+Armour" },
    { id: 6, name: "New Balance", logo: "https://placehold.co/200x80?text=New+Balance" },
    { id: 7, name: "Asics", logo: "https://placehold.co/200x80?text=Asics" },
    { id: 8, name: "Fila", logo: "https://placehold.co/200x80?text=Fila" }
  ];
  
  // Use dynamic content if available, otherwise fallback to brands prop or placeholders
  const dynamicBrands = content?.logos ? content.logos.map((logo, index) => ({
    id: index + 1,
    name: `Brand ${index + 1}`,
    logo: logo.image,
    url: logo.url || "#"
  })) : null;
  
  const displayBrands = dynamicBrands || brands || defaultBrands;
  
  // Simple auto-scroll with CSS animation
  useEffect(() => {
    // Make sure we have enough brands to scroll
    if (displayBrands.length < 5) return;
    
    // Add the animation class after component mounts
    if (sliderRef.current) {
      sliderRef.current.classList.add('animate-scroll');
    }
    
    return () => {
      if (sliderRef.current) {
        sliderRef.current.classList.remove('animate-scroll');
      }
    };
  }, [displayBrands.length]);
  
  // Double the brands for continuous scrolling
  const allBrands = [...displayBrands, ...displayBrands];

  return (
    <section className="py-8 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div 
            ref={sliderRef}
            className="flex gap-8 brand-slider"
          >
            {allBrands.map((brand, index) => (
              <div 
                key={`${brand.id}-${index}`} 
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center"
              >
                <a 
                  href={brand.url || "#"} 
                  className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                  title={brand.name}
                >
                  <img 
                    src={getImageUrl(brand.logo)} 
                    alt={brand.name} 
                    className="max-h-16 max-w-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/200x80?text=${encodeURIComponent(brand.name)}`;
                    }}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .brand-slider {
          width: fit-content;
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .brand-slider:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}