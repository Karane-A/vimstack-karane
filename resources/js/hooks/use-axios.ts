import axios, { AxiosInstance } from 'axios';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useAxios(): AxiosInstance {
  const { props } = usePage();
  
  return useMemo(() => {
    const instance = axios.create();
    
    // Set default headers
    instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    
    // Add request interceptor to include fresh CSRF token
    instance.interceptors.request.use((config) => {
      const csrfToken = (props as any).csrf_token;
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      }
      return config;
    });
    
    return instance;
  }, [(props as any).csrf_token]);
}