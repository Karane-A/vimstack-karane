import React from 'react';
import { Home, Palette, Award, Users, ShoppingBag, Heart, Star, Truck, RefreshCw, Shield, CreditCard, HeadphonesIcon } from 'lucide-react';

interface CTABox {
  icon: string;
  title: string;
  subtitle: string;
}

interface HomeAccessoriesCTASectionProps {
  content?: {
    cta_boxes?: {
      value: CTABox[];
    };
  };
  ctaBoxes?: CTABox[] | { value: CTABox[] };
}

const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  palette: Palette,
  award: Award,
  users: Users,
  'shopping-bag': ShoppingBag,
  heart: Heart,
  star: Star,
  truck: Truck,
  'refresh-cw': RefreshCw,
  'shield-check': Shield,
  'credit-card': CreditCard,
  headphones: HeadphonesIcon
};

export default function HomeAccessoriesCTASection({
  content,
  ctaBoxes
}: HomeAccessoriesCTASectionProps) {
  // Get CTA boxes from props with fallback
  const boxes = ctaBoxes?.value || ctaBoxes || content?.cta_boxes?.value || [
    { icon: 'truck', title: 'Free Shipping', subtitle: 'On all orders over $50' },
    { icon: 'refresh-cw', title: 'Easy Returns', subtitle: '30-day return policy' },
    { icon: 'shield-check', title: 'Secure Payment', subtitle: '100% secure checkout' },
    { icon: 'users', title: '24/7 Support', subtitle: 'Dedicated customer service' }
  ];

  if (!boxes || boxes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxes.map((box, index) => {
            const IconComponent = iconMap[box.icon] || Home;
            
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-primary mb-4">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{box.title}</h3>
                <p className="text-gray-600 text-sm">{box.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}