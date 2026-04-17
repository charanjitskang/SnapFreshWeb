import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { DataDeletionPage } from '../pages/DataDeletionPage';
import { DisclaimerPage } from '../pages/DisclaimerPage';
import { HomePage } from '../pages/HomePage';
import { NutritionMethodologyPage } from '../pages/NutritionMethodologyPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { SupportPage } from '../pages/SupportPage';
import { TermsPage } from '../pages/TermsPage';
import '../styles.css';

const pageRegistry = {
  '/': <HomePage />,
  '/privacy/': <PrivacyPage />,
  '/terms/': <TermsPage />,
  '/support/': <SupportPage />,
  '/data-deletion/': <DataDeletionPage />,
  '/nutrition-methodology/': <NutritionMethodologyPage />,
  '/disclaimer/': <DisclaimerPage />
};

export function renderPage(pathname: keyof typeof pageRegistry) {
  const page = pageRegistry[pathname];

  if (!page) {
    throw new Error(`No pre-renderable page registered for ${pathname}`);
  }

  return renderToString(<StrictMode>{page}</StrictMode>);
}
