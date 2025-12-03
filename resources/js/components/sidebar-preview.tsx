import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { Sidebar as SidebarIcon, Home, Users, Settings, FileText, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarPreviewProps {
  variant: string;
  style: string;
  themeColor: string;
  customColor: string;
}

export function SidebarPreview({ variant, style, themeColor, customColor }: SidebarPreviewProps) {
  const { t } = useTranslation();
  // Get the color based on theme color - use CSS variable for primary color
  const getColor = () => {
    // Use the CSS variable for primary color to ensure it matches the theme
    if (typeof window !== 'undefined') {
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      if (primaryColor) return primaryColor;
    }
    
    // Fallback colors if CSS variable isn't available
    switch (themeColor) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'purple': return '#8b5cf6';
      case 'orange': return '#f97316';
      case 'red': return '#ef4444';
      case 'custom': return customColor;
      default: return '#3b82f6';
    }
  };

  // Get background style based on style type
  const getBackgroundStyle = () => {
    switch (style) {
      case 'colored':
        return { backgroundColor: 'var(--primary)' };
      case 'gradient':
        return { 
          background: 'linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary), transparent 20%))' 
        };
      default:
        return {};
    }
  };

  const isColoredStyle = style === 'colored' || style === 'gradient';
  
  // Get variant class
  const getVariantClass = () => {
    switch (variant) {
      case 'inset': return 'border';
      case 'floating': return 'shadow-md';
      case 'minimal': return 'border-r';
      default: return 'border';
    }
  };

  return (
    <div 
      className={`rounded-md overflow-hidden p-3 ${getVariantClass()}`}
      style={getBackgroundStyle()}
    >
      <div className="flex items-center gap-2 mb-4">
        <SidebarIcon className={`h-4 w-4 ${isColoredStyle ? 'text-white' : 'text-primary'}`} />
        <span className={`font-medium ${isColoredStyle ? 'text-white' : 'text-foreground'}`}>
          {t("Sidebar")}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded ${
          isColoredStyle ? 'bg-white/20' : 'bg-primary/10'
        }`}>
          <Home className={`h-4 w-4 ${isColoredStyle ? 'text-white' : 'text-primary'}`} />
          <span className={`text-sm ${isColoredStyle ? 'text-white' : 'text-foreground'}`}>
            {t("Dashboard")}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1.5 rounded">
          <Users className={`h-4 w-4 ${isColoredStyle ? 'text-white' : 'text-primary'}`} />
          <span className={`text-sm ${isColoredStyle ? 'text-white' : 'text-foreground'}`}>
            {t("Users")}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1.5 rounded">
          <FileText className={`h-4 w-4 ${isColoredStyle ? 'text-white' : 'text-primary'}`} />
          <span className={`text-sm ${isColoredStyle ? 'text-white' : 'text-foreground'}`}>
            {t("Reports")}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1.5 rounded">
          <ShoppingCart className={`h-4 w-4 ${isColoredStyle ? 'text-white' : 'text-primary'}`} />
          <span className={`text-sm ${isColoredStyle ? 'text-white' : 'text-foreground'}`}>
            {t("Products")}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1.5 rounded">
          <Settings className={`h-4 w-4 ${isColoredStyle ? 'text-white' : 'text-primary'}`} />
          <span className={`text-sm ${isColoredStyle ? 'text-white' : 'text-foreground'}`}>
            {t("Settings")}
          </span>
        </div>
      </div>
    </div>
  );
}