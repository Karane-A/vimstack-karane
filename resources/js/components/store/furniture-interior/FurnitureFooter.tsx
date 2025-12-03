import React from 'react';
import { getImageUrl } from '@/utils/image-helper';
import { Link } from '@inertiajs/react';

interface FurnitureFooterProps {
  storeName?: string;
  logo?: string;
  content?: any;
}

function FurnitureFooter({ storeName, logo, content }: FurnitureFooterProps) {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.864 3.708 13.713 3.708 12.416s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.404c-.315 0-.595-.122-.807-.315-.212-.193-.315-.473-.315-.807 0-.315.122-.595.315-.807.212-.212.492-.315.807-.315.315 0 .595.122.807.315.212.212.315.492.315.807 0 .315-.122.595-.315.807-.212.212-.492.315-.807.315z"/>
      </svg>
    ),
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
      </svg>
    ),
    houzz: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.432c0 .36-.288.648-.648.648H7.08c-.36 0-.648-.288-.648-.648V9.568c0-.36.288-.648.648-.648h9.84c.36 0 .648.288.648.648v4.864z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  };

  return (
    <footer className="text-white" style={{ backgroundColor: 'oklch(0.3 0.06 63.96)' }}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                {logo ? (
                  <img src={getImageUrl(logo)} alt={storeName} className="h-12 w-auto" />
                ) : (
                  <h3 className="text-2xl font-light text-white">{storeName}</h3>
                )}
              </div>
              <p className="text-yellow-100 leading-relaxed mb-6">
                {content?.description || 'Your destination for premium furniture and interior design. Creating beautiful, functional spaces with carefully curated pieces and expert design services.'}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {(content?.social_links || [
                  { platform: 'instagram', url: '' },
                  { platform: 'pinterest', url: '' },
                  { platform: 'houzz', url: '' },
                  { platform: 'youtube', url: '' }
                ]).map((social, index) => (
                  <a
                    key={index}
                    href={social.url || '#'}
                    className="w-10 h-10 bg-yellow-700 rounded-full flex items-center justify-center text-yellow-200 hover:text-white hover:bg-amber-600 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {socialIcons[social.platform] || socialIcons.instagram}
                  </a>
                ))}
              </div>
            </div>

            {/* Customer Service Menu */}
            <div>
              <h4 className="text-lg font-semibold mb-6">
                {content?.menu1?.title || 'Customer Service'}
              </h4>
              <ul className="space-y-3">
                {(content?.menu1?.links || [
                  { name: 'Design Consultation', href: '/design-consultation' },
                  { name: 'Delivery & Setup', href: '/delivery' },
                  { name: 'Care Instructions', href: '/care' },
                  { name: 'Contact Support', href: '/contact' }
                ]).map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Menu */}
            <div>
              <h4 className="text-lg font-semibold mb-6">
                {content?.menu2?.title || 'Company'}
              </h4>
              <ul className="space-y-3">
                {(content?.menu2?.links || [
                  { name: 'About Us', href: '/about' },
                  { name: 'Design Team', href: '/designers' },
                  { name: 'Showrooms', href: '/showrooms' },
                  { name: 'Privacy Policy', href: '/privacy' }
                ]).map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-yellow-100 text-sm leading-relaxed">
                    {content?.contact?.address || '456 Design District, Furniture Row, NY 10019'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href={`tel:${content?.contact?.phone || '+1 (555) 463-8764'}`} className="text-yellow-100 hover:text-white transition-colors duration-300">
                    {content?.contact?.phone || '+1 (555) 463-8764'}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href={`mailto:${content?.contact?.email || 'hello@furniturestore.com'}`} className="text-yellow-100 hover:text-white transition-colors duration-300">
                    {content?.contact?.email || 'hello@furniturestore.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-700 py-6">
          <div className="text-center">
            <p className="text-yellow-200 text-sm">
              {(content?.copyright_text || '© {year} {store_name}. All rights reserved.')
                .replace('{year}', currentYear.toString())
                .replace('{store_name}', storeName || 'Furniture Store')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FurnitureFooter;