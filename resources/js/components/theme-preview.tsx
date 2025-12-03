import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { useThemePreview } from '@/hooks/use-theme-preview';
import { useLogos } from '@/contexts/LogoContext';

export function ThemePreview() {
  const { appearance, themeColor, position, variant, collapsible, style } = useThemePreview();
  const { logoLight, logoDark } = useLogos();
  const [logoError, setLogoError] = React.useState(false);
  
  // Reset logo error when logo sources change
  React.useEffect(() => {
    setLogoError(false);
  }, [logoLight, logoDark, appearance]);
  
  // Determine sidebar style class
  const getSidebarStyleClass = () => {
    if (style === 'colored') return 'bg-primary text-white';
    if (style === 'gradient') return 'bg-gradient-to-b from-primary to-primary/80 text-white';
    return 'bg-sidebar text-sidebar-foreground';
  };
  
  // Logo preview based on appearance
  const getLogoSrc = () => {
    if (logoError) return '';
    
    if (appearance === 'dark') {
      return logoLight || '/images/logos/logo-light.png';
    } else {
      return logoDark || '/images/logos/logo-dark.png';
    }
  };
  
  // Get title text
  const getTitleText = () => {
    return 'StoreGo';
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-neutral-100 dark:bg-neutral-800 p-2 text-xs font-medium flex justify-between items-center">
        <div>Theme Preview</div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">{appearance}</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">{themeColor}</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">{position}</span>
        </div>
      </div>
      
      <div className={`flex ${position === 'right' ? 'flex-row-reverse' : 'flex-row'} h-64`}>
        {/* Sidebar */}
        <div 
          className={`
            w-1/4 flex flex-col
            ${getSidebarStyleClass()}
            ${variant === 'floating' ? 'rounded-lg m-2 border shadow-sm' : ''}
            ${variant === 'inset' ? '' : ''}
            ${collapsible === 'icon' ? 'max-w-[3rem]' : ''}
          `}
        >
          {/* Sidebar Header with Logo - using the same style as the sidebar */}
          <div className={`p-1 border-b border-sidebar-border flex items-center justify-center overflow-hidden ${getSidebarStyleClass()}`}>
            {!logoError && getLogoSrc() ? (
              <img 
                key={`preview-${appearance}-${getLogoSrc()}`} 
                src={getLogoSrc()} 
                alt={getTitleText()} 
                className="h-5 max-w-[60px] object-contain" 
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-5 text-inherit font-semibold flex items-center text-xs tracking-tight">
                {getTitleText()}
              </div>
            )}
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 p-2 space-y-1 overflow-hidden">
            <SidebarMenuSkeleton showIcon={true} active={true} />
            <SidebarMenuSkeleton showIcon={true} />
            <SidebarMenuSkeleton showIcon={true} />
            <SidebarMenuSkeleton showIcon={true} />
            
            {/* Nested menu */}
            {collapsible !== 'icon' && (
              <div className="ml-4 pl-2 border-l border-sidebar-border mt-2 space-y-1">
                <SidebarMenuSkeleton showIcon={true} />
                <SidebarMenuSkeleton showIcon={true} />
              </div>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className={`flex-1 bg-background text-foreground p-4 ${variant === 'inset' ? 'rounded-lg m-2' : ''}`}>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20 rounded-md bg-primary" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-20 rounded-md" />
              <Skeleton className="h-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}