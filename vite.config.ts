import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildCanonicalUrl, getPublicPageByInputPath, getSiteUrl, publicPages } from './scripts/seo-config.mjs';

function toPosixPath(value: string) {
  return value.split(path.sep).join('/');
}

export default defineConfig(() => {
  const prodWaitlistTarget =
    'https://rhaupemsfddxqigxjoil.supabase.co';
  const env =
    typeof process !== 'undefined' && process.env
      ? process.env
      : {};
  const waitlistProxyTarget =
    env.VITE_WAITLIST_PROXY_TARGET || prodWaitlistTarget;
  const siteUrl = getSiteUrl(env);
  const projectRoot = path.dirname(fileURLToPath(import.meta.url));

  return {
    base: './',
    plugins: [
      react(),
      {
        name: 'snapfresh-canonical-tags',
        transformIndexHtml(html, context) {
          if (!context.filename) {
            return html;
          }

          const relativeInputPath = toPosixPath(path.relative(projectRoot, context.filename));
          const page = getPublicPageByInputPath(relativeInputPath);

          if (!page) {
            return html;
          }

          return {
            html,
            tags: [
              {
                tag: 'link',
                attrs: {
                  rel: 'canonical',
                  href: buildCanonicalUrl(siteUrl, page.pathname)
                },
                injectTo: 'head'
              }
            ]
          };
        }
      }
    ],
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
        input: Object.fromEntries(
          publicPages.map((page) => [
            page.key,
            path.resolve(projectRoot, page.inputPath)
          ])
        )
      }
    }
  };
});
