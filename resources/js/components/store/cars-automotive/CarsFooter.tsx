import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterContent {
  description?: { value: string };
  menu1?: {
    title: { value: string };
    links: { value: FooterLink[] };
  };
  menu2?: {
    title: { value: string };
    links: { value: FooterLink[] };
  };
  contact?: {
    address: { value: string };
    phone: { value: string };
    email: { value: string };
  };
  social_links?: {
    value: SocialLink[];
  };
  copyright_text?: { value: string };
}

interface CarsFooterProps {
  storeName: string;
  logo?: string;
  content?: FooterContent;
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

export default function CarsFooter({ storeName, logo, content }: CarsFooterProps) {
  const footerContent = content || {};
  const currentYear = new Date().getFullYear();
  

  


  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-red-600 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-red-600 rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-red-600 rotate-45"></div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              {logo ? (
                <img src={getImageUrl(logo)} alt={storeName} className="h-14 w-auto" />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rotate-45"></div>
                  <h3 className="text-3xl font-black tracking-tight">{storeName}</h3>
                  <div className="w-3 h-3 bg-red-600 rotate-45"></div>
                </div>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              {footerContent.description || 'Your trusted source for premium automotive parts and performance upgrades.'}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {(footerContent.social_links || [
                {platform: 'facebook', url: 'https://facebook.com'},
                {platform: 'twitter', url: 'https://twitter.com'},
                {platform: 'instagram', url: 'https://instagram.com'},
                {platform: 'youtube', url: 'https://youtube.com'}
              ]).map((social, index) => {
                const IconComponent = socialIcons[social.platform as keyof typeof socialIcons];
                if (!IconComponent || !social.url) return null;
                
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="group w-12 h-12 bg-gray-900 hover:bg-red-600 border-2 border-gray-700 hover:border-red-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="h-5 w-5 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Menu 1 */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-red-600 mr-4"></div>
              <h4 className="text-xl font-bold tracking-wider uppercase text-white">
                {footerContent.menu1?.title || 'Customer Support'}
              </h4>
            </div>
            <ul className="space-y-4">
              {(footerContent.menu1?.links || [
                {name: 'Installation Guide', href: '/installation-guide'},
                {name: 'Shipping & Returns', href: '/shipping'},
                {name: 'Contact Support', href: '/contact'},
                {name: 'Technical Help', href: '/technical-help'}
              ]).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-red-600 transition-colors font-medium text-lg group flex items-center"
                  >
                    <span className="w-2 h-2 bg-gray-600 group-hover:bg-red-600 mr-3 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu 2 */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-red-600 mr-4"></div>
              <h4 className="text-xl font-bold tracking-wider uppercase text-white">
                {footerContent.menu2?.title || 'Company'}
              </h4>
            </div>
            <ul className="space-y-4">
              {(footerContent.menu2?.links || [
                {name: 'About Us', href: '/about'},
                {name: 'Careers', href: '/careers'},
                {name: 'Press', href: '/press'},
                {name: 'Privacy Policy', href: '/privacy'}
              ]).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-red-600 transition-colors font-medium text-lg group flex items-center"
                  >
                    <span className="w-2 h-2 bg-gray-600 group-hover:bg-red-600 mr-3 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-red-600 mr-4"></div>
              <h4 className="text-xl font-bold tracking-wider uppercase text-white">{footerContent.contact?.title || 'Get In Touch'}</h4>
            </div>
            
            <div className="space-y-4">
              {footerContent.contact?.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-red-600 mr-3 mt-1" />
                  <span className="text-gray-300 text-sm">{footerContent.contact.address}</span>
                </div>
              )}
              {footerContent.contact?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-red-600 mr-3" />
                  <a href={`tel:${footerContent.contact.phone}`} className="text-gray-300 hover:text-red-400 text-sm">
                    {footerContent.contact.phone}
                  </a>
                </div>
              )}
              {footerContent.contact?.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-red-600 mr-3" />
                  <a href={`mailto:${footerContent.contact.email}`} className="text-gray-300 hover:text-red-400 text-sm">
                    {footerContent.contact.email}
                  </a>
                </div>
              )}
            </div>

            {/* Business Hours */}
            <div className="mt-6 p-4 bg-gray-900 border-l-4 border-red-600">
              <h5 className="font-bold text-white mb-3 text-sm uppercase">
                {footerContent.business_hours?.title || 'Service Hours'}
              </h5>
              <div className="space-y-1">
                {(footerContent.business_hours?.hours || [
                  { days: 'Mon - Fri', time: '8:00 AM - 6:00 PM', status: 'open' },
                  { days: 'Saturday', time: '9:00 AM - 4:00 PM', status: 'open' },
                  { days: 'Sunday', time: 'Closed', status: 'closed' }
                ]).map((schedule, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-300">{schedule.days}</span>
                    <span className={schedule.status === 'closed' ? 'text-gray-500' : 'text-red-400'}>
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center items-center">
            <p className="text-gray-300 text-lg font-medium">
              {footerContent.copyright_text
                ?.replace('{year}', currentYear.toString())
                ?.replace('{store_name}', storeName) ||
                `© ${currentYear} ${storeName}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>

      {/* Red accent line */}
      <div className="h-2 bg-red-600"></div>
    </footer>
  );
}