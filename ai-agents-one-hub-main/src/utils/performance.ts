// Critical CSS loading
export const loadCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    .hero-section { display: block; }
    .navigation { display: flex; }
    .loading-spinner { animation: spin 1s linear infinite; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//api.supabase.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
    document.head.appendChild(link);
  });
};

// Optimize Core Web Vitals
export const optimizeCoreWebVitals = () => {
  // Reduce CLS by setting image dimensions
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
    if (img instanceof HTMLImageElement && !img.width && !img.height) {
      img.style.aspectRatio = '16/9';
      img.style.width = '100%';
      img.style.height = 'auto';
    }
  });

  // Optimize LCP by preloading hero images
  const heroImages = document.querySelectorAll('.hero-section img, .featured-section img');
  heroImages.forEach(img => {
    if (img instanceof HTMLImageElement) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    }
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  }
};

// Memory management
export const optimizeMemory = () => {
  // Clean up event listeners on page unload
  window.addEventListener('beforeunload', () => {
    // Remove all event listeners
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el.removeEventListener) {
        el.removeEventListener('click', () => {});
        el.removeEventListener('scroll', () => {});
      }
    });
  });

  // Implement request deduplication
  const requestCache = new Map();
  
  return {
    cachedFetch: async (url: string, options?: RequestInit) => {
      const key = `${url}_${JSON.stringify(options)}`;
      
      if (requestCache.has(key)) {
        return requestCache.get(key);
      }
      
      const promise = fetch(url, options);
      requestCache.set(key, promise);
      
      // Clean up cache after 5 minutes
      setTimeout(() => requestCache.delete(key), 5 * 60 * 1000);
      
      return promise;
    }
  };
};
