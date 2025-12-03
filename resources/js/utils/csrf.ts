/**
 * Get the current CSRF token from various sources
 */
export function getCsrfToken(): string | null {
  // Try to get from Inertia's page data first (most reliable after login)
  if (typeof window !== 'undefined' && (window as any).page?.props?.csrf_token) {
    return (window as any).page.props.csrf_token;
  }
  
  // Fallback to meta tag
  const token = document.head.querySelector('meta[name="csrf-token"]');
  if (token) {
    return (token as HTMLMetaElement).content;
  }
  
  return null;
}

/**
 * Update the global CSRF token in axios defaults
 */
export function updateAxiosCsrfToken(): void {
  const token = getCsrfToken();
  if (token) {
    // Update axios default headers if axios is available
    if (typeof window !== 'undefined' && (window as any).axios) {
      (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
  }
}