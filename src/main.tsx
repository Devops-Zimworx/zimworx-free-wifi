import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App';

if (typeof window !== 'undefined') {
  // I'm logging the path to confirm whether the SPA bootstrap runs on deep links.
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  console.info('[PhishGuard] SPA bootstrap', { currentPath, timestamp: new Date().toISOString() });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
