import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface BabyKidsBrandLogoSliderProps {
  content?: any;
}

export default function BabyKidsBrandLogoSlider({ content }: BabyKidsBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/53/brand-logo-baby-kids-1.png' },
    { image: '/storage/media/54/brand-logo-baby-kids-2.png' },
    { image: '/storage/media/55/brand-logo-baby-kids-3.png' },
    { image: '/storage/media/56/brand-logo-baby-kids-4.png' },
    { image: '/storage/media/57/brand-logo-baby-kids-5.png' },
    { image: '/storage/media/58/brand-logo-baby-kids-6.png' }
  ];

  const stats = content?.stats || [
    { number: '50K+', label: 'Happy Families' },
    { number: '100K+', label: 'Products Sold' },
    { number: '99%', label: 'Parent Satisfaction' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <section className="py-20 bg-pink-100 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-blue-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Cute Icons */}
        <div className="absolute top-20 right-1/4 text-pink-300 opacity-60 animate-bounce">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-1/4 text-blue-300 opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {content?.title || 'Trusted by Parents Everywhere'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            {content?.description || 'Join our growing community of parents who choose quality and comfort for their little ones.'}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  index % 4 === 0 ? 'bg-gradient-to-br from-pink-400 to-pink-500' :
                  index % 4 === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                  index % 4 === 2 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                  'bg-gradient-to-br from-green-400 to-green-500'
                }`}>
                  {index === 0 && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Logos Section */}
        <div className="text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
            {content?.brands_title || 'Featured Brands'}
          </h3>
          
          {/* Logos Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-12 lg:space-x-16">
              {/* First set of logos */}
              {logos.concat(logos).map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-32 h-20 lg:w-40 lg:h-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  <img
                    src={logo.image ? getImageUrl(logo.image) : `https://placehold.co/160x96/f8fafc/64748b?text=Brand+${(index % logos.length) + 1}`}
                    alt={`Brand ${index + 1}`}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/160x96/f8fafc/64748b?text=Brand+${(index % logos.length) + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}