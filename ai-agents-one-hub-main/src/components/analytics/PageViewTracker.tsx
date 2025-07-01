import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

const PageViewTracker = () => {
  const location = useLocation();
  useEffect(() => {
    mixpanel.track('Page View', {
      'Page Name': document.title || location.pathname,
      'Referrer URL Path': document.referrer || '',
    });
  }, [location]);
  return null;
};

export default PageViewTracker; 