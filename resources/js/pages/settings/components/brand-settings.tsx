import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemePreview } from '@/components/theme-preview';
import { useAppearance, type Appearance, type ThemeColor } from '@/hooks/use-appearance';
import { useLayout, type LayoutPosition } from '@/contexts/LayoutContext';
import { useSidebarSettings } from '@/contexts/SidebarContext';
import { useBrand } from '@/contexts/BrandContext';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/custom-toast';
import { Palette, Save, Upload, Check, Layout, Moon, FileText, Sidebar as SidebarIcon } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { SidebarPreview } from '@/components/sidebar-preview';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';

// Define the brand settings interface
export interface BrandSettings {
  logoLight: string;
  favicon: string;
  titleText: string;
  footerText: string;
  themeColor: ThemeColor;
  customColor: string;
  sidebarVariant: string;
  sidebarStyle: string;
  layoutDirection: LayoutPosition;
  themeMode: Appearance;
}

// Default brand settings
export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoLight: '/images/logos/logo-light.png',
  favicon: '/images/logos/vimstack-favicon.png',
  titleText: 'Vimstack',
  footerText: '© 2025 Vimstack. All rights reserved.',
  themeColor: 'green',
  customColor: '#10b981',
  sidebarVariant: 'inset',
  sidebarStyle: 'plain',
  layoutDirection: 'left',
  themeMode: 'light',
};

// Get brand settings from props or localStorage as fallback
export const getBrandSettings = (userSettings?: Record<string, string>): BrandSettings => {
  // If we have settings from the backend, use those
  if (userSettings) {
    const baseUrl = (typeof window !== 'undefined' ? (window.appSettings?.baseUrl || window.location.origin) : '');

    const getFullUrl = (path: string, defaultPath: string) => {
      if (!path) return baseUrl + defaultPath;
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      return baseUrl + path;
    };

    return {
      logoLight: getFullUrl(userSettings.logoLight, DEFAULT_BRAND_SETTINGS.logoLight),
      favicon: getFullUrl(userSettings.favicon, DEFAULT_BRAND_SETTINGS.favicon),
      titleText: userSettings.titleText || DEFAULT_BRAND_SETTINGS.titleText,
      footerText: userSettings.footerText || DEFAULT_BRAND_SETTINGS.footerText,
      themeColor: (userSettings.themeColor as ThemeColor) || DEFAULT_BRAND_SETTINGS.themeColor,
      customColor: userSettings.customColor || DEFAULT_BRAND_SETTINGS.customColor,
      sidebarVariant: userSettings.sidebarVariant || DEFAULT_BRAND_SETTINGS.sidebarVariant,
      sidebarStyle: userSettings.sidebarStyle || DEFAULT_BRAND_SETTINGS.sidebarStyle,
      layoutDirection: (userSettings.layoutDirection as LayoutPosition) || DEFAULT_BRAND_SETTINGS.layoutDirection,
      themeMode: (userSettings.themeMode as Appearance) || DEFAULT_BRAND_SETTINGS.themeMode,
    };
  }

  // Fallback to localStorage if no backend settings
  if (typeof localStorage === 'undefined') {
    return DEFAULT_BRAND_SETTINGS;
  }

  try {
    const savedSettings = localStorage.getItem('brandSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_BRAND_SETTINGS;
  } catch (error) {
    return DEFAULT_BRAND_SETTINGS;
  }
};

interface BrandSettingsProps {
  userSettings?: Record<string, string>;
}

export default function BrandSettings({ userSettings }: BrandSettingsProps) {
  const { t } = useTranslation();
  const { props } = usePage();
  const currentGlobalSettings = (props as any).globalSettings;
  const [settings, setSettings] = useState<BrandSettings>(() => getBrandSettings(currentGlobalSettings || userSettings));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'logos' | 'text' | 'theme'>('logos');

  // Get theme hooks
  const {
    updateAppearance,
    updateThemeColor,
    updateCustomColor
  } = useAppearance();

  const { updatePosition } = useLayout();
  const { updateVariant, updateStyle } = useSidebarSettings();

  // Load settings when globalSettings change (but not while saving)
  useEffect(() => {
    if (isSaving) return; // Don't reset form while saving

    const brandSettings = getBrandSettings(currentGlobalSettings || userSettings);
    setSettings(brandSettings);

    // Also sync sidebar settings from localStorage
    try {
      const sidebarSettings = localStorage.getItem('sidebarSettings');
      if (sidebarSettings) {
        const parsedSettings = JSON.parse(sidebarSettings);
        setSettings(prev => ({
          ...prev,
          sidebarVariant: parsedSettings.variant || prev.sidebarVariant,
          sidebarStyle: parsedSettings.style || prev.sidebarStyle
        }));
      }
    } catch (error) {
      console.error('Error loading sidebar settings', error);
    }
  }, [currentGlobalSettings, userSettings, isSaving]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));

    // Update brand context if the input is for a logo
    if (['logoLight', 'favicon'].includes(name)) {
      updateBrandSettings({ [name]: value });
    }
  };

  // Convert full URL to relative path for storage
  const convertToRelativePath = (url: string): string => {
    if (!url) return url;

    // If it's already a relative path, return as is
    if (!url.startsWith('http')) return url;

    // Extract the path after /storage/
    const storageIndex = url.indexOf('/storage/');
    if (storageIndex !== -1) {
      return url.substring(storageIndex);
    }

    return url;
  };

  // Convert relative path to full URL for display
  const getDisplayUrl = (path: string): string => {
    if (!path) return '';

    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Get base URL
    const baseUrl = window.appSettings?.baseUrl || window.location.origin;

    // If it's a relative path, convert to full URL
    if (path.startsWith('/')) {
      return `${baseUrl}${path}`;
    }

    // Default fallback
    return `${baseUrl}/${path}`;
  };

  // Handle media picker selection
  const handleMediaSelect = (name: string, url: string) => {
    // Convert to relative path for storage
    const relativePath = convertToRelativePath(url);

    // Reset error state for this logo
    setLogoErrors(prev => ({ ...prev, [name]: false }));

    // Update settings state with relative path
    setSettings(prev => ({ ...prev, [name]: relativePath }));

    // Update brand context with full URL for immediate preview
    updateBrandSettings({ [name]: url });
  };

  // Import useBrand hook
  const { updateBrandSettings } = useBrand();

  // State to track logo errors
  const [logoErrors, setLogoErrors] = useState({
    logoLight: false,
    favicon: false
  });



  // Handle theme color change
  const handleThemeColorChange = (color: ThemeColor) => {
    setSettings(prev => ({ ...prev, themeColor: color }));
    updateThemeColor(color);
  };

  // Handle custom color change
  const handleCustomColorChange = (color: string) => {
    setSettings(prev => ({ ...prev, customColor: color }));
    // Set as active custom color when user is editing it
    updateCustomColor(color, true);
  };

  // Handle sidebar variant change
  const handleSidebarVariantChange = (variant: string) => {
    setSettings(prev => ({ ...prev, sidebarVariant: variant }));
    updateVariant(variant as any);
  };

  // Handle sidebar style change
  const handleSidebarStyleChange = (style: string) => {
    setSettings(prev => ({ ...prev, sidebarStyle: style }));
    updateStyle(style);
  };

  // Handle layout direction change
  const handleLayoutDirectionChange = (direction: LayoutPosition) => {
    setSettings(prev => ({ ...prev, layoutDirection: direction }));
    updatePosition(direction);
  };

  // Save settings
  const saveSettings = () => {
    setIsLoading(true);
    setIsSaving(true);



    // Update theme settings
    updateThemeColor(settings.themeColor);
    if (settings.themeColor === 'custom') {
      updateCustomColor(settings.customColor);
    }
    updateAppearance(settings.themeMode);
    updatePosition(settings.layoutDirection);

    // Update sidebar settings
    updateVariant(settings.sidebarVariant as any);
    updateStyle(settings.sidebarStyle);

    // Update brand context
    updateBrandSettings({
      logoLight: settings.logoLight,
      favicon: settings.favicon
    });




    // Save to database using Inertia
    router.post(route('settings.brand.update'), {
      settings: settings
    }, {
      preserveScroll: false,
      onSuccess: () => {
        toast.success(t('Brand settings updated successfully'));

        // Force update brand context with full URLs for immediate display
        updateBrandSettings({
          logoLight: getDisplayUrl(settings.logoLight),
          favicon: getDisplayUrl(settings.favicon)
        });

        // Reload the page after a short delay to ensure sidebar updates
        setTimeout(() => {
          window.location.reload();
        }, 800);
      },
      onFinish: () => {
        setIsLoading(false);
        // Reset saving state after request completes
        setTimeout(() => setIsSaving(false), 500);
      },
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to save brand settings');
        toast.error(errorMessage);
      }
    });
  };

  return (
    <SettingsSection
      title={t("Brand Settings")}
      description={t("Customize your application's branding and appearance")}
      action={
        <Button onClick={saveSettings} disabled={isLoading} size="sm">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? t('Saving...') : t('Save Changes')}
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeSection === 'logos' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection('logos')}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("Logos")}
            </Button>
            <Button
              variant={activeSection === 'text' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection('text')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("Text")}
            </Button>
            <Button
              variant={activeSection === 'theme' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection('theme')}
              className="flex-1"
            >
              <Palette className="h-4 w-4 mr-2" />
              {t("Theme")}
            </Button>
          </div>

          {/* Logos Section */}
          {activeSection === 'logos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>{t("Logo")}</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center gap-4">
                      {/* Logo Preview */}
                      <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-md">
                        {settings.logoLight && !logoErrors.logoLight ? (
                          <img
                            key={`preview-light-${Date.now()}`}
                            src={getDisplayUrl(settings.logoLight)}
                            alt="Logo Preview"
                            className="max-h-28 max-w-full object-contain"
                            onError={() => setLogoErrors(prev => ({ ...prev, logoLight: true }))}
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">
                              {logoErrors.logoLight ? "Click browse to select an image" : "No logo uploaded"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Browse Button */}
                      <MediaPicker
                        label=""
                        value={settings.logoLight}
                        onChange={(url) => handleMediaSelect('logoLight', url)}
                        placeholder=""
                        showPreview={false}
                      />

                      {settings.logoLight && (
                        <p className="text-xs text-muted-foreground text-center">
                          {t("Logo uploaded successfully")}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("Recommended size: 200x50px (PNG or SVG)")}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>{t("Favicon")}</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center gap-4">
                      {/* Favicon Preview */}
                      <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-md">
                        {settings.favicon && !logoErrors.favicon ? (
                          <img
                            key={`preview-favicon-${Date.now()}`}
                            src={getDisplayUrl(settings.favicon)}
                            alt="Favicon Preview"
                            className="h-20 w-20 object-contain"
                            onError={() => setLogoErrors(prev => ({ ...prev, favicon: true }))}
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">
                              {logoErrors.favicon ? "Click browse to select an icon" : "No favicon uploaded"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Browse Button */}
                      <MediaPicker
                        label=""
                        value={settings.favicon}
                        onChange={(url) => handleMediaSelect('favicon', url)}
                        placeholder=""
                        showPreview={false}
                      />

                      {settings.favicon && (
                        <p className="text-xs text-muted-foreground text-center">
                          {t("Favicon uploaded successfully")}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("Recommended size: 32x32px or 64x64px (ICO, PNG)")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Text Section */}
          {activeSection === 'text' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="titleText">{t("Title Text")}</Label>
                  <Input
                    id="titleText"
                    name="titleText"
                    value={settings.titleText}
                    onChange={handleInputChange}
                    placeholder="Vimstack"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Application title displayed in the browser tab")}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="footerText">{t("Footer Text")}</Label>
                  <Input
                    id="footerText"
                    name="footerText"
                    value={settings.footerText}
                    onChange={handleInputChange}
                    placeholder="© 2025 Vimstack. All rights reserved."
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Text displayed in the footer")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Theme Section */}
          {activeSection === 'theme' && (
            <div className="space-y-6">
              <div className="flex flex-col space-y-8">
                {/* Theme Color Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Theme Color")}</h3>
                  </div>
                  <Separator className="my-2" />

                  <div className="grid grid-cols-6 gap-2">
                    {Object.entries({ blue: '#0e7490', green: '#10b981', purple: '#8b5cf6', orange: '#f97316', red: '#ef4444' }).map(([color, hex]) => (
                      <Button
                        key={color}
                        type="button"
                        variant={settings.themeColor === color ? "default" : "outline"}
                        className="h-8 w-full p-0 relative"
                        style={{ backgroundColor: settings.themeColor === color ? hex : 'transparent' }}
                        onClick={() => handleThemeColorChange(color as ThemeColor)}
                      >
                        <span
                          className="absolute inset-1 rounded-sm"
                          style={{ backgroundColor: hex }}
                        />
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant={settings.themeColor === 'custom' ? "default" : "outline"}
                      className="h-8 w-full p-0 relative"
                      style={{ backgroundColor: settings.themeColor === 'custom' ? settings.customColor : 'transparent' }}
                      onClick={() => handleThemeColorChange('custom')}
                    >
                      <span
                        className="absolute inset-1 rounded-sm"
                        style={{ backgroundColor: settings.customColor }}
                      />
                    </Button>
                  </div>

                  {settings.themeColor === 'custom' && (
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="customColor">{t("Custom Color")}</Label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Input
                            id="colorPicker"
                            type="color"
                            value={settings.customColor}
                            onChange={(e) => handleCustomColorChange(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div
                            className="w-10 h-10 rounded border cursor-pointer"
                            style={{ backgroundColor: settings.customColor }}
                          />
                        </div>
                        <Input
                          id="customColor"
                          name="customColor"
                          type="text"
                          value={settings.customColor}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <SidebarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Sidebar")}</h3>
                  </div>
                  <Separator className="my-2" />

                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">{t("Sidebar Variant")}</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {['inset', 'floating', 'minimal'].map((variant) => (
                          <Button
                            key={variant}
                            type="button"
                            variant={settings.sidebarVariant === variant ? "default" : "outline"}
                            className="h-10 justify-start"
                            style={{
                              backgroundColor: settings.sidebarVariant === variant ?
                                (settings.themeColor === 'custom' ? settings.customColor : null) :
                                'transparent'
                            }}
                            onClick={() => handleSidebarVariantChange(variant)}
                          >
                            {variant.charAt(0).toUpperCase() + variant.slice(1)}
                            {settings.sidebarVariant === variant && (
                              <Check className="h-4 w-4 ml-2" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">{t("Sidebar Style")}</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'plain', name: 'Plain' },
                          { id: 'colored', name: 'Colored' },
                          { id: 'gradient', name: 'Gradient' }
                        ].map((style) => (
                          <Button
                            key={style.id}
                            type="button"
                            variant={settings.sidebarStyle === style.id ? "default" : "outline"}
                            className="h-10 justify-start"
                            style={{
                              backgroundColor: settings.sidebarStyle === style.id ?
                                (settings.themeColor === 'custom' ? settings.customColor : null) :
                                'transparent'
                            }}
                            onClick={() => handleSidebarStyleChange(style.id)}
                          >
                            {style.name}
                            {settings.sidebarStyle === style.id && (
                              <Check className="h-4 w-4 ml-2" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Layout className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Layout")}</h3>
                  </div>
                  <Separator className="my-2" />

                  <div className="space-y-2">
                    <Label className="mb-2 block">{t("Layout Direction")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={settings.layoutDirection === "left" ? "default" : "outline"}
                        className="h-10 justify-start"
                        style={{
                          backgroundColor: settings.layoutDirection === "left" ?
                            (settings.themeColor === 'custom' ? settings.customColor : null) :
                            'transparent'
                        }}
                        onClick={() => handleLayoutDirectionChange("left")}
                      >
                        {t("Left-to-Right")}
                        {settings.layoutDirection === "left" && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant={settings.layoutDirection === "right" ? "default" : "outline"}
                        className="h-10 justify-start"
                        style={{
                          backgroundColor: settings.layoutDirection === "right" ?
                            (settings.themeColor === 'custom' ? settings.customColor : null) :
                            'transparent'
                        }}
                        onClick={() => handleLayoutDirectionChange("right")}
                      >
                        {t("Right-to-Left")}
                        {settings.layoutDirection === "right" && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4" />
                <h3 className="font-medium">{t("Live Preview")}</h3>
              </div>

              {/* Comprehensive Theme Preview */}
              <ThemePreview />

              {/* Text Preview */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs mb-2 text-muted-foreground">{t("Title:")} <span className="font-medium text-foreground">{settings.titleText}</span></div>
                <div className="text-xs text-muted-foreground">{t("Footer:")} <span className="font-medium text-foreground">{settings.footerText}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
