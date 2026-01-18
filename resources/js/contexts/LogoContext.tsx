import { useBrand } from '@/contexts/BrandContext';

interface LogoContextType {
  logoLight: string;
  favicon: string;
  updateLogos: (logos: { logoLight?: string; favicon?: string }) => void;
}

export function useLogos(): LogoContextType {
  const { logoLight, favicon, updateBrandSettings } = useBrand();
  
  const updateLogos = (newLogos: { logoLight?: string; favicon?: string }) => {
    updateBrandSettings(newLogos);
  };
  
  return {
    logoLight,
    favicon,
    updateLogos
  };
}