import React from 'react';
import { getImageUrl } from '@/utils/image-helper';
import { Link } from '@inertiajs/react';

interface PerfumeFooterProps {
  storeName?: string;
  logo?: string;
  content?: any;
}

export default function PerfumeFooter({ storeName, logo, content }: PerfumeFooterProps) {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.315 0-.595-.122-.807-.315-.21-.21-.315-.49-.315-.807s.105-.595.315-.807c.21-.21.49-.315.807-.315s.595.105.807.315c.21.21.315.49.315.807s-.105.595-.315.807c-.21.193-.49.315-.807.315z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  };

  return (
    <footer className="bg-purple-800 text-white">
      <div className="container mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Brand Section - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-4">
                {logo ? (
                  <img src={getImageUrl(logo)} alt={storeName} className="h-12 w-auto" />
                ) : (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-2xl font-light text-white">{storeName}</span>
                  </div>
                )}
              </div>
              
              <p className="text-purple-100 leading-relaxed max-w-md">
                {content?.description || 'Your premier destination for luxury fragrances and perfumes. Curating the world\'s finest scents from prestigious houses and emerging artisan perfumers.'}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {(content?.social_links || [
                  {platform: 'instagram', url: '#'},
                  {platform: 'youtube', url: '#'},
                  {platform: 'pinterest', url: '#'},
                  {platform: 'tiktok', url: '#'}
                ]).map((social, index) => (
                  <a
                    key={index}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-200 hover:text-white hover:bg-amber-400 transition-all duration-300"
                  >
                    {socialIcons[social.platform as keyof typeof socialIcons]}
                  </a>
                ))}
              </div>
            </div>

            {/* Menu 1 */}
            <div>
              <h3 className="text-lg font-medium mb-6 text-white">
                {content?.menu1?.title || 'Fragrance Services'}
              </h3>
              <ul className="space-y-4">
                {(content?.menu1?.links || [
                  {name: 'Scent Consultation', href: '/consultation'},
                  {name: 'Fragrance Samples', href: '/samples'},
                  {name: 'Gift Services', href: '/gifts'},
                  {name: 'Fragrance Care', href: '/care-guide'}
                ]).map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-amber-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu 2 */}
            <div>
              <h3 className="text-lg font-medium mb-6 text-white">
                {content?.menu2?.title || 'Company'}
              </h3>
              <ul className="space-y-4">
                {(content?.menu2?.links || [
                  {name: 'Our Story', href: '/about'},
                  {name: 'Perfumers', href: '/perfumers'},
                  {name: 'Sustainability', href: '/sustainability'},
                  {name: 'Privacy Policy', href: '/privacy'}
                ]).map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-amber-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-medium mb-6 text-white">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-purple-200 leading-relaxed">
                    {content?.contact?.address?.value || content?.contact?.address || '456 Perfume Boulevard, Scent District, NY 10019'}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a
                    href={`tel:${content?.contact?.phone?.value || content?.contact?.phone || '+1 (555) 372-3687'}`}
                    className="text-purple-200 hover:text-amber-400 transition-colors duration-300"
                  >
                    {content?.contact?.phone?.value || content?.contact?.phone || '+1 (555) 372-3687'}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a
                    href={`mailto:${content?.contact?.email?.value || content?.contact?.email || 'hello@fragrancehouse.com'}`}
                    className="text-purple-200 hover:text-amber-400 transition-colors duration-300"
                  >
                    {content?.contact?.email?.value || content?.contact?.email || 'hello@fragrancehouse.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-700 py-8">
          <div className="text-center">
            <p className="text-purple-200">
              {content?.copyright_text?.replace('{year}', currentYear.toString()).replace('{store_name}', storeName || 'Store') || 
               `© ${currentYear} ${storeName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}