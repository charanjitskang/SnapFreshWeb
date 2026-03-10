import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        privacy: new URL('./privacy/index.html', import.meta.url).pathname,
        terms: new URL('./terms/index.html', import.meta.url).pathname,
        support: new URL('./support/index.html', import.meta.url).pathname,
        dataDeletion: new URL('./data-deletion/index.html', import.meta.url).pathname
      }
    }
  }
});
