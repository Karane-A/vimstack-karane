import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface JewelryFooterProps {
  storeName?: string;
  logo?: string;
  content?: any;
}

export default function JewelryFooter({ storeName = 'Luxury Jewelry', logo, content = {} }: JewelryFooterProps) {
  const footerContent = content || {};
  const description = footerContent.description || 'Fine jewelry and luxury goods since our founding.';
  const socialLinks = footerContent.social_links || [
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'pinterest', url: '#' }
  ];

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 py-16">
        {/* Single Row Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          {/* Brand */}
          <div className="text-center lg:text-left">
            {logo ? (
              <img 
                src={getImageUrl(logo)} 
                alt={storeName} 
                className="h-12 mb-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/200x80?text=${encodeURIComponent(storeName)}`;
                }}
              />
            ) : (
              <h2 className="text-2xl font-serif text-neutral-900 mb-2">
                {storeName}
              </h2>
            )}
            <p className="text-neutral-600 text-sm max-w-xs">
              {description}
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-8">
            {(footerContent.menu?.links || [
              { name: 'Jewelry Care', href: '/jewelry-care' },
              { name: 'Sizing Guide', href: '/sizing' },
              { name: 'Heritage', href: '/heritage' },
              { name: 'Contact', href: '/contact' }
            ]).map((link, index) => (
              <a key={index} href={link.href} className="text-neutral-600 hover:text-yellow-700 transition-colors text-sm font-medium">
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {Array.isArray(socialLinks) ? socialLinks.map((social, index) => {
              if (!social.url || social.url === null || social.url === '') return null;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-100 hover:bg-yellow-700 hover:text-white flex items-center justify-center transition-colors duration-300"
                >
                  {social.platform === 'instagram' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {social.platform === 'pinterest' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.372 0 12.017 0 16.4 2.331 20.027 5.686 21.6c-.076-.664-.145-1.685.03-2.409.157-.652 1.005-4.238 1.005-4.238s-.257-.513-.257-1.27c0-1.191.692-2.078 1.553-2.078.732 0 1.085.549 1.085 1.207 0 .735-.468 1.834-.708 2.853-.202.855.428 1.552 1.27 1.552 1.524 0 2.693-1.608 2.693-3.929 0-2.055-1.476-3.489-3.585-3.489-2.442 0-3.875 1.833-3.875 3.726 0 .738.284 1.529.639 1.96a.203.203 0 0 1 .047.196c-.051.214-.165.67-.187.764-.029.122-.094.148-.218.089-1.22-.568-1.983-2.353-1.983-3.788 0-2.708 1.967-5.196 5.668-5.196 2.976 0 5.29 2.122 5.29 4.95 0 2.953-1.86 5.33-4.441 5.33-.867 0-1.683-.45-1.963-.99l-.535 2.04c-.193.75-.715 1.69-1.066 2.26A11.95 11.95 0 0 0 12 24c6.624 0 12-5.372 12-11.983C24 5.372 18.626.001 12.001.001z"/>
                    </svg>
                  )}
                  {social.platform === 'youtube' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                  {social.platform === 'facebook' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24,12.073c0,-5.8 -4.701,-10.5 -10.5,-10.5c-5.799,0 -10.5,4.7 -10.5,10.5c0,5.24 3.84,9.58 8.86,10.37v-7.34h-2.67v-3.03h2.67v-2.31c0,-2.63 1.57,-4.09 3.97,-4.09c1.15,0 2.35,0.21 2.35,0.21v2.59h-1.32c-1.31,0 -1.72,0.81 -1.72,1.64v1.97h2.92l-0.47,3.03h-2.45v7.34c5.02,-0.79 8.86,-5.13 8.86,-10.37z"/>
                    </svg>
                  )}
                  {social.platform === 'twitter' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )}
                  {social.platform === 'linkedin' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                </a>
              );
            }) : null}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-neutral-200 mt-12 pt-8 text-center">
          <p className="text-neutral-500 text-sm">
            {footerContent?.copyright_text?.replace('{year}', new Date().getFullYear().toString()).replace('{store_name}', storeName) || 
             `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}