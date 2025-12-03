/**
 * Performance optimization utilities
 */

// Debounce function to limit how often a function is called
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to limit the rate at which a function is executed
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Memoize function to cache expensive function calls
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// Lazy load images that are in viewport
export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(img => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.dataset.src) {
        imgElement.src = imgElement.dataset.src;
        imgElement.removeAttribute('data-src');
      }
    });
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    try {
      // Core Web Vitals
      const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log performance metrics
          console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
        });
      });
      
      // Observe different performance metrics
      perfObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      perfObserver.observe({ type: 'first-input', buffered: true });
      perfObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Resource timing (disabled to reduce console logs)
      // const resourceObserver = new PerformanceObserver((list) => {
      //   list.getEntries().forEach((entry) => {
      //     if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
      //       console.log(`[API] ${entry.name}: ${entry.duration.toFixed(0)}ms`);
      //     }
      //   });
      // });
      
      // resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.warn('Performance monitoring not fully supported', e);
    }
  }
}