import React from 'react';
import { Truck, RefreshCw, CreditCard, HeadphonesIcon, Shield, Star } from 'lucide-react';

interface InfoBox {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface InfoBoxesSectionProps {
  boxes?: InfoBox[];
  content?: any[];
}

const getIcon = (iconName: string) => {
  const icons = {
    truck: <Truck className="h-8 w-8" />,
    'refresh-cw': <RefreshCw className="h-8 w-8" />,
    'credit-card': <CreditCard className="h-8 w-8" />,
    headphones: <HeadphonesIcon className="h-8 w-8" />,
    'shield-check': <Shield className="h-8 w-8" />,
    star: <Star className="h-8 w-8" />
  };
  return icons[iconName] || <Truck className="h-8 w-8" />;
};

export default function InfoBoxesSection({
  boxes,
  content
}: InfoBoxesSectionProps) {
  const defaultBoxes = [
    {
      id: 1,
      icon: <Truck className="h-8 w-8" />,
      title: "Free Shipping",
      description: "On all orders over $50"
    },
    {
      id: 2,
      icon: <RefreshCw className="h-8 w-8" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      id: 3,
      icon: <CreditCard className="h-8 w-8" />,
      title: "Secure Payment",
      description: "100% secure checkout"
    },
    {
      id: 4,
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Dedicated customer service"
    }
  ];
  
  // Handle both extracted values and original structure
  const contentArray = Array.isArray(content) ? content : (content?.value || content);
  const displayBoxes = contentArray ? contentArray.map((box, index) => ({
    id: index + 1,
    icon: getIcon(box.icon),
    title: box.title,
    description: box.subtitle || box.description
  })) : (boxes || defaultBoxes);
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayBoxes.map((box) => (
            <div 
              key={box.id} 
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="text-primary mb-4">
                {box.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{box.title}</h3>
              <p className="text-gray-600 text-sm">{box.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}