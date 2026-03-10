import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SupportPage } from '../pages/SupportPage';
import '../styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupportPage />
  </StrictMode>
);
