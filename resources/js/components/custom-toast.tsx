import { Toaster } from '@/components/ui/sonner';
import { toast as sonnerToast } from 'sonner';
import { router } from '@inertiajs/react';

const isDemoMode = (): boolean => {
  // Check both window.isDemo and page props for demo mode
  return (window as any).isDemo || (window as any).page?.props?.is_demo || false;
};

const demoModeMessage = 'This action is disabled in demo mode. You can only create new data, not modify existing demo data.';

// Override router methods
const originalPut = router.put;
const originalDelete = router.delete;
const originalPatch = router.patch;

router.put = function(url: string, data?: any, options?: any) {
  if (isDemoMode()) {
    sonnerToast.error(demoModeMessage, { duration: 5000 });
    return;
  }
  return originalPut.call(this, url, data, options);
};

router.delete = function(url: string, options?: any) {
  if (isDemoMode()) {
    sonnerToast.error(demoModeMessage, { duration: 5000 });
    return;
  }
  return originalDelete.call(this, url, options);
};

router.patch = function(url: string, data?: any, options?: any) {
  if (isDemoMode()) {
    sonnerToast.error(demoModeMessage, { duration: 5000 });
    return;
  }
  return originalPatch.call(this, url, data, options);
};

export const toast = {
  ...sonnerToast,
  success: (message: string, options?: any) => {
    return sonnerToast.success(message, { duration: 5000, ...options });
  },
  error: (message: string, options?: any) => {
    return sonnerToast.error(message, { duration: 6000, ...options });
  },
  loading: (message: string, options?: any) => {
    if (isDemoMode() && (message.includes('Delet') || message.includes('Updat') || message.includes('Reset') || message.includes('Modif') || message.includes('Activ') || message.includes('Deactiv'))) {
      return;
    }
    return sonnerToast.loading(message, options);
  },
};

export const CustomToast = () => {
    return <Toaster position="top-right" duration={5000} richColors closeButton />;
};
