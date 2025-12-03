import React from 'react';

interface FashionCTASectionProps {
  content?: any;
  ctaBoxes?: any;
  bottomSection?: any;
}

export default function FashionCTASection({ content, ctaBoxes, bottomSection }: FashionCTASectionProps) {
  const boxes = ctaBoxes?.value || ctaBoxes || content?.value || content || [
    { icon: 'sparkles', title: 'Personal Styling', subtitle: 'Free styling consultation' },
    { icon: 'heart', title: 'Wishlist Alerts', subtitle: 'Get notified when items go on sale' },
    { icon: 'gift', title: 'Gift Cards', subtitle: 'Perfect for fashion lovers' },
    { icon: 'users', title: 'VIP Membership', subtitle: 'Exclusive access & rewards' }
  ];

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boxes.map((box, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-6 border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors duration-300">
                {box.icon === 'sparkles' && (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3l14 9-14 9V3z" />
                  </svg>
                )}
                {box.icon === 'heart' && (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                {box.icon === 'gift' && (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                )}
                {box.icon === 'users' && (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-light mb-2 tracking-wide">{box.title}</h3>
              <p className="text-white/70 font-light text-sm">{box.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}