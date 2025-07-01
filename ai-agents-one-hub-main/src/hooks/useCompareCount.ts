import { useState, useEffect } from 'react';

export const useCompareCount = () => {
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const compare = JSON.parse(localStorage.getItem('compare_agents') || '[]');
        setCompareCount(compare.length);
      } catch {
        setCompareCount(0);
      }
    };

    // Initial count
    updateCount();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'compare_agents') {
        updateCount();
      }
    };

    // Listen for custom events
    const handleCustomEvent = () => {
      updateCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('compareAgentsChanged', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('compareAgentsChanged', handleCustomEvent);
    };
  }, []);

  return compareCount;
}; 