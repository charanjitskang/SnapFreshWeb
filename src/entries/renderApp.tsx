import { StrictMode, type ReactElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

export function mountApp(page: ReactElement) {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Missing root element for SnapFresh app mount.');
  }

  const app = <StrictMode>{page}</StrictMode>;

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, app);
    return;
  }

  createRoot(rootElement).render(app);
}
