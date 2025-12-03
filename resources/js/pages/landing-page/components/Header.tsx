import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBrand } from '@/contexts/BrandContext';

interface CustomPage {
  id: number;
  title: string;
  slug: string;
}

interface HeaderProps {
  brandColor?: string;
  settings: {
    company_name: string;
  };
  sectionData?: any;
  customPages?: CustomPage[];
  user?: any;
}

export default function Header({ settings, sectionData, customPages = [], brandColor = '#3b82f6', user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get colors from settings
  const colors = settings?.config_sections?.colors || { primary: brandColor, secondary: '#059669', accent: '#065f46' };
  const primaryColor = colors.primary || brandColor;
  const secondaryColor = colors.secondary || '#059669';
  const accentColor = colors.accent || '#065f46';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = customPages.map(page => ({
    name: page.title,
    href: route('custom-page.show', page.slug)
  }));
  const { t } = useTranslation();
  const isTransparent = sectionData?.transparent;
  const backgroundColor = sectionData?.background_color || '#ffffff';
  
  const getHeaderClasses = () => {
    if (isTransparent) {
      return isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
        : 'bg-transparent';
    }
    return isScrolled 
      ? 'shadow-lg border-b border-gray-200/50'
      : '';
  };

  const getHeaderStyle = () => {
    if (isTransparent) return {};
    return { backgroundColor };
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClasses()}`}
      style={getHeaderStyle()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href={route("home")} 
              className="flex items-center transition-colors"
            >
              {(() => {
                const { logoLight, logoDark } = useBrand();
                const isDark = document.documentElement.classList.contains('dark');
                const currentLogo = isDark ? logoLight : logoDark;
                const displayUrl = currentLogo ? (
                  currentLogo.startsWith('http') ? currentLogo : 
                  currentLogo.startsWith('/storage/') ? `${window.appSettings?.baseUrl || window.location.origin}${currentLogo}` :
                  currentLogo.startsWith('/') ? `${window.appSettings?.baseUrl || window.location.origin}${currentLogo}` : currentLogo
                ) : '';
                
                return displayUrl ? (
                  <img
                    src={displayUrl}
                    alt={settings.company_name}
                    className="h-8 w-auto xl:max-w-[180px] sm:max-w-[130px] max-w-[100px] object-scale-down  transition-all duration-200"
                  />
                ) : (
                  <span 
                    className="text-2xl font-bold text-gray-900 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {settings.company_name}
                  </span>
                );
              })()} 
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center xl:space-x-8 space-x-4" role="navigation" aria-label="Main navigation">

            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 text-sm font-medium transition-colors relative group"
                style={{ '--hover-color': primaryColor } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                {item.name}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" 
                  style={{ backgroundColor: primaryColor }}
                  aria-hidden="true"
                ></span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link
                href={route('dashboard')}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border"
                style={{ 
                  backgroundColor: primaryColor, 
                  color: 'white',
                  borderColor: primaryColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = secondaryColor;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = 'white';
                }}
              >
                {t("Dashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="text-gray-600 text-sm font-medium transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {t("Login")}
                </Link>
                <Link
                  href={route('register')}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border"
                  style={{ 
                    backgroundColor: primaryColor, 
                    color: 'white',
                    borderColor: primaryColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = secondaryColor;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  {t("Get Started")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200" id="mobile-menu">
            <div 
              className="px-4 py-6 space-y-4"
              style={isTransparent ? { backgroundColor: 'white' } : { backgroundColor }}
            >

              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-gray-900 text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                {user ? (
                  <Link
                    href={route('dashboard')}
                    className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors border"
                    style={{ 
                      backgroundColor: primaryColor, 
                      color: 'white',
                      borderColor: primaryColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = secondaryColor;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    {t("Dashboard")}
                  </Link>
                ) : (
                  <>
                    <Link
                      href={route('login')}
                      className="block w-full text-center text-gray-600 py-2.5 text-sm font-medium transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      {t("Login")}
                    </Link>
                    <Link
                      href={route('register')}
                      className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors border"
                      style={{ 
                        backgroundColor: primaryColor, 
                        color: 'white',
                        borderColor: primaryColor
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = secondaryColor;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor;
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      {t("Get Started")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}