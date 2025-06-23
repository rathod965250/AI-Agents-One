
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const setRedirectUrl = (url: string) => {
    sessionStorage.setItem('redirectAfterAuth', url);
  };

  const getRedirectUrl = () => {
    return sessionStorage.getItem('redirectAfterAuth');
  };

  const clearRedirectUrl = () => {
    sessionStorage.removeItem('redirectAfterAuth');
  };

  const redirectToOriginalPage = () => {
    const redirectUrl = getRedirectUrl();
    clearRedirectUrl();
    
    if (redirectUrl && redirectUrl !== '/auth') {
      navigate(redirectUrl, { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return {
    setRedirectUrl,
    getRedirectUrl,
    clearRedirectUrl,
    redirectToOriginalPage,
    currentPath: location.pathname + location.search
  };
};
