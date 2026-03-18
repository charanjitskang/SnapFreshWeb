import { StrictMode, type ReactElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initAnalytics } from '../lib/analytics';

export function mountApp(page: ReactElement) {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Missing root element for SnapFresh app mount.');
  }

  initAnalytics();

  const app = <StrictMode>{page}</StrictMode>;

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, app);
    return;
  }

  createRoot(rootElement).render(app);
}
