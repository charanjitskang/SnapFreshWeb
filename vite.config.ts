import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const prodWaitlistTarget =
    'https://rhaupemsfddxqigxjoil.supabase.co';
  const env =
    typeof process !== 'undefined' && process.env
      ? process.env
      : {};
  const waitlistProxyTarget =
    env.VITE_WAITLIST_PROXY_TARGET || prodWaitlistTarget;

  return {
    base: './',
    plugins: [react()],
    server: {
      proxy: {
        '/api/register-waitlist': {
          target: waitlistProxyTarget,
          changeOrigin: true,
          rewrite: () => '/functions/v1/register-waitlist'
        }
      }
    },
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
  };
});
