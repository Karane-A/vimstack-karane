import React from 'react';
import { Settings, Star, Gift, Users, Truck, RefreshCw, CreditCard, HeadphonesIcon, Shield, Clock, Award, Gem } from 'lucide-react';

interface WatchesCTASectionProps {
  content?: any;
  ctaBoxes?: any;
  bottomSection?: any;
}

const getIcon = (iconName: string) => {
  const icons = {
    settings: <Settings className="w-8 h-8 text-slate-900" />,
    star: <Star className="w-8 h-8 text-slate-900" />,
    gift: <Gift className="w-8 h-8 text-slate-900" />,
    users: <Users className="w-8 h-8 text-slate-900" />,
    truck: <Truck className="w-8 h-8 text-slate-900" />,
    'refresh-cw': <RefreshCw className="w-8 h-8 text-slate-900" />,
    'credit-card': <CreditCard className="w-8 h-8 text-slate-900" />,
    headphones: <HeadphonesIcon className="w-8 h-8 text-slate-900" />,
    shield: <Shield className="w-8 h-8 text-slate-900" />,
    clock: <Clock className="w-8 h-8 text-slate-900" />,
    award: <Award className="w-8 h-8 text-slate-900" />,
    gem: <Gem className="w-8 h-8 text-slate-900" />
  };
  return icons[iconName] || <Settings className="w-8 h-8 text-slate-900" />;
};

export default function WatchesCTASection({ content, ctaBoxes, bottomSection }: WatchesCTASectionProps) {
  const boxes = ctaBoxes?.value || ctaBoxes || content?.value || content || [
    { icon: 'settings', title: 'Watch Services', subtitle: 'Professional maintenance & repair' },
    { icon: 'star', title: 'Collector\'s Club', subtitle: 'Exclusive access to rare pieces' },
    { icon: 'gift', title: 'Gift Certificates', subtitle: 'Perfect for watch enthusiasts' },
    { icon: 'users', title: 'VIP Concierge', subtitle: 'Personal shopping assistance' }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        {/* CTA Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {boxes.map((box, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-500 flex items-center justify-center group-hover:bg-amber-400 transition-colors duration-300">
                {getIcon(box.icon)}
              </div>
              <h3 className="text-xl font-light text-white mb-2">{box.title}</h3>
              <p className="text-slate-400 font-light">{box.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-light text-white mb-4">
            {bottomSection?.title?.value || bottomSection?.title || 'Join the Elite Circle'}
          </h3>
          <p className="text-slate-400 font-light mb-8 max-w-2xl mx-auto">
            {bottomSection?.description?.value || bottomSection?.description || bottomSection?.subtitle?.value || bottomSection?.subtitle || 'Experience personalized service and exclusive access to the world\'s finest timepieces.'}
          </p>
          <a
            href={bottomSection?.button_link?.value || bottomSection?.button_link || '/contact'}
            className="inline-flex items-center px-8 py-3 bg-amber-500 text-slate-900 font-medium tracking-wider uppercase text-sm hover:bg-amber-400 transition-colors duration-300"
          >
            {bottomSection?.button_text?.value || bottomSection?.button_text || 'Get Started'}
          </a>
        </div>
      </div>
    </section>
  );
}