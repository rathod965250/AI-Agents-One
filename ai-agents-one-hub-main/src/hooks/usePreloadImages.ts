
import { useEffect } from 'react';

export const usePreloadImages = (images: string[]) => {
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];
    
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
    });

    return () => {
      preloadedImages.forEach(img => {
        img.src = '';
      });
    };
  }, [images]);
};

export const preloadCriticalImages = () => {
  const criticalImages = [
    '/logo.png',
    '/hero-bg.jpg',
    '/placeholder.svg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};
