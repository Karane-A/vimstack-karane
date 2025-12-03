import axios from 'axios';
import { toast } from '@/components/custom-toast';

// Set CSRF token for all requests
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Intercept requests to add fresh CSRF token
axios.interceptors.request.use((config) => {
  let csrfToken = null;
  
  // Try to get CSRF token from meta tag first (most reliable)
  const metaToken = document.head.querySelector('meta[name="csrf-token"]');
  if (metaToken) {
    csrfToken = (metaToken as HTMLMetaElement).content;
  }
  
  // Override with Inertia token if available (fresher after login)
  try {
    if (typeof window !== 'undefined' && (window as any).page?.props?.csrf_token) {
      csrfToken = (window as any).page.props.csrf_token;
    }
  } catch (e) {
    // Ignore errors accessing window.page
  }
  
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  
  return config;
});

// Intercept responses to handle demo mode errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.demo_mode) {
      toast.error(error.response.data.message || 'This action is disabled in demo mode.');
    }
    return Promise.reject(error);
  }
);

export default axios;