import React from 'react';
import mixpanel from 'mixpanel-browser';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  componentName?: string;
}

const TrackedLink: React.FC<TrackedLinkProps> = ({
  href,
  children,
  componentName = 'TrackedLink',
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    mixpanel.track('Link Clicked', {
      'link url': href,
      'link text': typeof children === 'string' ? children : '',
      'component name': componentName,
      'page url': window.location.href,
      'timestamp': new Date().toISOString(),
      'Referrer': document.referrer,
    });
    if (onClick) onClick(e);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default TrackedLink; 