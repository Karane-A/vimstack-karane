import React from 'react';

interface CTABox {
  id: number;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

interface CTABoxesSectionProps {
  boxes?: CTABox[];
}

export default function CTABoxesSection({
  boxes = [
    {
      id: 1,
      title: "New Arrivals",
      subtitle: "Check out our latest collection",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals",
      backgroundImage: "/storage/media/cta-new-arrivals.jpg"
    },
    {
      id: 2,
      title: "Summer Sale",
      subtitle: "Up to 50% off",
      buttonText: "View Offers",
      buttonLink: "/sale",
      backgroundImage: "/storage/media/cta-summer-sale.jpg"
    },
    {
      id: 3,
      title: "Gift Cards",
      subtitle: "The perfect present",
      buttonText: "Buy Now",
      buttonLink: "/gift-cards",
      backgroundImage: "/storage/media/cta-gift-cards.jpg"
    }
  ]
}: CTABoxesSectionProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boxes.map((box) => (
            <div 
              key={box.id} 
              className="relative h-64 rounded-xl overflow-hidden group"
            >
              {/* Background Image */}
              <img 
                src={box.backgroundImage} 
                alt={box.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x400?text=${encodeURIComponent(box.title)}`;
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-1">{box.title}</h3>
                {box.subtitle && (
                  <p className="text-white/90 mb-4 text-sm">{box.subtitle}</p>
                )}
                <a 
                  href={box.buttonLink} 
                  className="inline-block bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm w-fit"
                >
                  {box.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}