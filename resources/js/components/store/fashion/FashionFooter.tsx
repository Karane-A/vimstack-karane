import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface FashionFooterProps {
  storeName?: string;
  logo?: string;
  content?: any;
}

export default function FashionFooter({ storeName = 'Fashion Store', logo, content = {} }: FashionFooterProps) {


  const socialLinks = content?.social_links || [
    { platform: 'instagram', url: '' },
    { platform: 'tiktok', url: '' },
    { platform: 'pinterest', url: '' },
    { platform: 'youtube', url: '' }
  ];

  return (
    <footer className="bg-white text-gray-900">
      {/* Main Footer */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Brand */}
            <div className="space-y-8">
              <div>
                {logo ? (
                  <img 
                    src={getImageUrl(logo)} 
                    alt={storeName} 
                    className="h-12 mb-6" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/200x80?text=${encodeURIComponent(storeName)}`;
                    }}
                  />
                ) : (
                  <h2 className="text-4xl font-thin tracking-widest uppercase mb-6">
                    {storeName}
                  </h2>
                )}
                <p className="text-gray-600 font-light text-lg leading-relaxed max-w-md">
                  {content?.description || 'Your destination for contemporary fashion and timeless style. Curating the world\'s best designers and emerging brands.'}
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url || '#'}
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors duration-300 group"
                  >
                    {social.platform === 'instagram' && (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {social.platform === 'tiktok' && (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    )}
                    {social.platform === 'pinterest' && (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.372 0 12.017 0 16.4 2.331 20.027 5.686 21.6c-.076-.664-.145-1.685.03-2.409.157-.652 1.005-4.238 1.005-4.238s-.257-.513-.257-1.27c0-1.191.692-2.078 1.553-2.078.732 0 1.085.549 1.085 1.207 0 .735-.468 1.834-.708 2.853-.202.855.428 1.552 1.27 1.552 1.524 0 2.693-1.608 2.693-3.929 0-2.055-1.476-3.489-3.585-3.489-2.442 0-3.875 1.833-3.875 3.726 0 .738.284 1.529.639 1.96a.203.203 0 0 1 .047.196c-.051.214-.165.67-.187.764-.029.122-.094.148-.218.089-1.22-.568-1.983-2.353-1.983-3.788 0-2.708 1.967-5.196 5.668-5.196 2.976 0 5.29 2.122 5.29 4.95 0 2.953-1.86 5.33-4.441 5.33-.867 0-1.683-.45-1.963-.99l-.535 2.04c-.193.75-.715 1.69-1.066 2.26A11.95 11.95 0 0 0 12 24c6.624 0 12-5.372 12-11.983C24 5.372 18.626.001 12.001.001z"/>
                      </svg>
                    )}
                    {social.platform === 'youtube' && (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Right Side - Contact & Links */}
            <div className="space-y-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-thin tracking-wide mb-6 uppercase">
                  Contact Us
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 font-light text-sm uppercase tracking-wide mb-2">Address</p>
                    <p className="text-gray-900 font-light leading-relaxed">
                      {content?.contact?.address || '789 Fashion Avenue, Style District, NY 10018'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-light text-sm uppercase tracking-wide mb-2">Phone</p>
                    <p className="text-gray-900 font-light">
                      {content?.contact?.phone || '+1 (555) 328-4466'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-light text-sm uppercase tracking-wide mb-2">Email</p>
                    <p className="text-gray-900 font-light">
                      {content?.contact?.email || 'hello@fashionstore.com'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-light tracking-widest uppercase mb-4 text-gray-700">
                    {content?.menu1?.title || 'Customer Care'}
                  </h4>
                  <ul className="space-y-3">
                    {(content?.menu1?.links || [
                      { name: 'Size Guide', href: '/size-guide' },
                      { name: 'Shipping & Returns', href: '/shipping' },
                      { name: 'Contact Us', href: '/contact' }
                    ]).map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-light tracking-widest uppercase mb-4 text-gray-700">
                    {content?.menu2?.title || 'Company'}
                  </h4>
                  <ul className="space-y-3">
                    {(content?.menu2?.links || [
                      { name: 'About Us', href: '/about' },
                      { name: 'Careers', href: '/careers' },
                      { name: 'Press', href: '/press' }
                    ]).map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors font-light text-sm">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-light">
              {content?.copyright_text?.replace('{year}', new Date().getFullYear().toString()).replace('{store_name}', storeName) || 
               `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}