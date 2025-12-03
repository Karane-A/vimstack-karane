import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';

// Function to display flash messages as toasts
let lastFlashMessage = '';
let lastFlashTime = 0;
let isSetup = false;

export function setupFlashMessages() {
  if (isSetup) return;
  isSetup = true;
  
  // Display initial flash messages
  const page = (window as any).page;
  if (page?.props?.flash) {
    displayFlashMessages(page.props.flash);
  }

  // Listen for navigation events to display new flash messages
  router.on('success', (event) => {
    const flash = event.detail.page.props.flash;
    if (flash) {
      // Add a small delay to ensure the page has updated
      setTimeout(() => {
        displayFlashMessages(flash);
      }, 150);
    }
  });
  
  // Also listen for finish events (for form submissions)
  router.on('finish', (event) => {
    const page = (window as any).page;
    if (page?.props?.flash) {
      setTimeout(() => {
        displayFlashMessages(page.props.flash);
      }, 150);
    }
  });
  
  // Also listen for finish events (for form submissions)
  router.on('finish', (event) => {
    const page = (window as any).page;
    if (page?.props?.flash) {
      setTimeout(() => {
        displayFlashMessages(page.props.flash);
      }, 150);
    }
  });
}

function displayFlashMessages(flash: any) {
  if (!flash) return;
  
  const now = Date.now();
  
  if (flash.success) {
    const message = flash.success;
    if (message !== lastFlashMessage || now - lastFlashTime > 2000) {
      toast.success(message, { duration: 4000 });
      lastFlashMessage = message;
      lastFlashTime = now;
    }
  }
  
  if (flash.error) {
    const message = flash.error;
    if (message !== lastFlashMessage || now - lastFlashTime > 2000) {
      toast.error(message, { duration: 5000 });
      lastFlashMessage = message;
      lastFlashTime = now;
    }
  }
  
  if (flash.warning) {
    const message = flash.warning;
    if (message !== lastFlashMessage || now - lastFlashTime > 2000) {
      toast.error(message, { duration: 5000 });
      lastFlashMessage = message;
      lastFlashTime = now;
    }
  }
  
  if (flash.info) {
    const message = flash.info;
    if (message !== lastFlashMessage || now - lastFlashTime > 2000) {
      toast.success(message, { duration: 4000 });
      lastFlashMessage = message;
      lastFlashTime = now;
    }
  }
}