
import { useEffect } from 'react';
import { addResourceHints, optimizeCoreWebVitals, registerServiceWorker, loadCriticalCSS } from '@/utils/performance';
import { preloadCriticalImages } from '@/hooks/usePreloadImages';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Run performance optimizations after component mount
    const runOptimizations = async () => {
      // Add resource hints for faster DNS resolution
      addResourceHints();
      
      // Load critical CSS
      loadCriticalCSS();
      
      // Preload critical images
      preloadCriticalImages();
      
      // Register service worker for caching
      await registerServiceWorker();
      
      // Optimize Core Web Vitals
      setTimeout(optimizeCoreWebVitals, 100);
      
      // Enable font display swap for faster text rendering
      const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      fontLinks.forEach(link => {
        if (link instanceof HTMLLinkElement) {
          link.href += '&display=swap';
        }
      });
    };

    runOptimizations();
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
