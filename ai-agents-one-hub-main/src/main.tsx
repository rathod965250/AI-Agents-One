import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// @ts-ignore
import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
mixpanel.init('d1e3199bc45557a173de1478de49654f', {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
});

// Example: Track app load event
mixpanel.track('App Loaded');

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
