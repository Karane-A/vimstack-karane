/**
 * Get the full URL for an image path
 * 
 * @param path The relative path (e.g., /storage/media/29/avatar.png)
 * @returns The full URL
 */
export function getImageUrl(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a data URI, return as-is
  if (path.startsWith('data:')) {
    return path;
  }
  
  // Normalize path - remove double slashes and ensure it starts with /
  let normalizedPath = path.replace(/\/+/g, '/');
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  
  // If path already starts with /storage/, use it directly with base URL
  if (normalizedPath.startsWith('/storage/')) {
    let baseUrl = '';
    
    // Try app settings first
    const appSettings = (window as any).appSettings;
    if (appSettings?.baseUrl) {
      baseUrl = appSettings.baseUrl;
    }
    
    // Try global settings from Inertia
    if (!baseUrl) {
      const page = (window as any).page;
      const globalSettings = page?.props?.globalSettings;
      if (globalSettings?.base_url) {
        baseUrl = globalSettings.base_url;
      }
    }
    
    // Fallback to current origin
    if (!baseUrl) {
      baseUrl = window.location.origin;
    }
    
    // Clean up base URL and ensure path is correct
    baseUrl = baseUrl.replace(/\/$/, '');
    return `${baseUrl}${normalizedPath}`;
  }
  
  let baseUrl = '';
  
  // Try app settings first
  const appSettings = (window as any).appSettings;
  if (appSettings?.baseUrl) {
    baseUrl = appSettings.baseUrl;
  }
  
  // Try global settings from Inertia
  if (!baseUrl) {
    const page = (window as any).page;
    const globalSettings = page?.props?.globalSettings;
    if (globalSettings?.base_url) {
      baseUrl = globalSettings.base_url;
    }
  }
  
  // Fallback: construct from current URL
  if (!baseUrl) {
    const { origin, pathname } = window.location;
    
    // For paths like /product/vimstack/vimstack-saas-react-demo/...
    if (pathname.includes('/product/')) {
      const pathParts = pathname.split('/');
      const productIndex = pathParts.indexOf('product');
      if (productIndex >= 0 && pathParts.length > productIndex + 2) {
        // Reconstruct base path: /product/vimstack/vimstack-saas-react-demo
        const basePath = pathParts.slice(0, productIndex + 3).join('/');
        baseUrl = origin + basePath;
      }
    }
    
    // Handle any subdirectory by detecting if we're not at root
    if (!baseUrl && pathname !== '/' && !pathname.startsWith('/storage/')) {
      const pathParts = pathname.split('/').filter(part => part);
      // If we have path segments and the first one isn't a known route, it's likely a base path
      if (pathParts.length > 0) {
        // Take the first path segment as potential base path
        const potentialBasePath = '/' + pathParts[0];
        baseUrl = origin + potentialBasePath;
      }
    }
    
    // Final fallback
    if (!baseUrl) {
      baseUrl = origin;
    }
  }
  
  // Clean up URL construction
  baseUrl = baseUrl.replace(/\/$/, '');
  
  // Normalize path - remove double slashes
  let cleanPath = normalizedPath || path;
  cleanPath = cleanPath.replace(/\/+/g, '/');
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  return `${baseUrl}${cleanPath}`;
}