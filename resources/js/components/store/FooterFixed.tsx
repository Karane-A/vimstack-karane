import React, { useState } from 'react';
import storeTheme from '@/config/store-theme';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface FooterProps {
  storeName?: string;
  logo?: string;
  content?: any;
}

export default function Footer({
  storeName = storeTheme.store.name,
  logo = storeTheme.store.logo,
  content = {}
}: FooterProps) {
  const footerContent = content || {};
  const description = footerContent.description || storeTheme.store.description;
  const address = footerContent.contact?.address || storeTheme.store.address;
  const email = footerContent.contact?.email || storeTheme.store.contactEmail;
  const phone = footerContent.contact?.phone || storeTheme.store.contactPhone;
  const socialLinks = footerContent.social_links || storeTheme.store.socialLinks || {};
  const copyrightText = footerContent.copyright_text || storeTheme.footer.copyrightText;
  const currentYear = new Date().getFullYear().toString();

  const [newsLetterEmail, setNewsLetterEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'home-accessories';
  
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(route('api.newsletter.subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          email: newsLetterEmail,
          store_slug: storeSlug
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setNewsLetterEmail('');

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Info */}
            <div>
              <div className="mb-6">
                <img 
                  src={getImageUrl(logo)} 
                  alt={storeName} 
                  className="h-10 mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/200x80?text=${encodeURIComponent(storeName)}`;
                  }}
                />
                <p className="text-gray-400 text-sm">
                  {description}
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {Array.isArray(socialLinks) ? socialLinks.map((social, index) => {
                  console.log('Social link:', social);
                  // Temporarily show all social links for debugging
                  // if (!social.url || social.url === null || social.url === '') return null;
                  const IconComponent = {
                    facebook: Facebook,
                    twitter: Twitter,
                    instagram: Instagram,
                    linkedin: Linkedin,
                    youtube: Youtube,
                    whatsapp: MessageCircle,
                    pinterest: Instagram
                  }[social.platform] || Facebook;
                  
                  return (
                    <a 
                      key={index}
                      href={social.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gray-800 hover:bg-primary w-8 h-8 rounded-full transition-all duration-300"
                      style={{ color: 'white' }}
                      aria-label={social.platform}
                    >
                      <IconComponent className="h-4 w-4" style={{ fill: 'none' }} />
                    </a>
                  );
                }) : (
                  // Fallback for old format
                  <>
                    {socialLinks.facebook && (
                      <a 
                        href={socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-gray-800 hover:bg-primary w-8 h-8 rounded-full transition-all duration-300"
                        style={{ color: 'white' }}
                        aria-label="Facebook"
                      >
                        <Facebook className="h-4 w-4" style={{ fill: 'none' }} />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a 
                        href={socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-gray-800 hover:bg-primary w-8 h-8 rounded-full transition-all duration-300"
                        style={{ color: 'white' }}
                        aria-label="Twitter"
                      >
                        <Twitter className="h-4 w-4" style={{ fill: 'none' }} />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a 
                        href={socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-gray-800 hover:bg-primary w-8 h-8 rounded-full transition-all duration-300"
                        style={{ color: 'white' }}
                        aria-label="Instagram"
                      >
                        <Instagram className="h-4 w-4" style={{ fill: 'none' }} />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Dynamic Menu */}
            <div>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                {footerContent.menu?.title || 'Quick Links'}
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary"></span>
              </h3>
              <ul className="space-y-3">
                {footerContent.menu?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="mr-2 text-primary">›</span>
                      {link.name}
                    </a>
                  </li>
                )) || [
                  <li key="about">
                    <a href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="mr-2 text-primary">›</span>
                      About Us
                    </a>
                  </li>,
                  <li key="contact">
                    <a href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="mr-2 text-primary">›</span>
                      Contact Us
                    </a>
                  </li>
                ]}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary"></span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{address}</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="text-gray-400 hover:text-white transition-colors">
                    {phone}
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-gray-400 hover:text-white transition-colors">
                    {email}
                  </a>
                </li>
              </ul>
              
              {/* Newsletter Mini Form */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={newsLetterEmail}
                    onChange={(e) => setNewsLetterEmail(e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {isSubmitted && (
                  <div className="mt-2 text-xs text-green-400">
                    Successfully subscribed!
                  </div>
                )}
                {error && (
                  <div className="mt-2 text-xs text-red-400">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="bg-gray-950 text-gray-400 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              {copyrightText.replace('{year}', currentYear).replace('{store_name}', storeName)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}