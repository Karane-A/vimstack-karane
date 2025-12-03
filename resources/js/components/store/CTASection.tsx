import React from 'react';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export default function CTASection({
  title = "Special Discount This Week",
  subtitle = "Get up to 50% off on selected items. Limited time offer.",
  buttonText = "Shop Now",
  buttonLink = "/shop",
  backgroundImage = "/storage/media/cta-background.jpg"
}: CTASectionProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Background" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/1920x600?text=Special+Offer';
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{title}</h2>
          <p className="text-lg text-white/90 mb-8">{subtitle}</p>
          <a 
            href={buttonLink} 
            className="inline-block bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}