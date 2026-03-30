import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildCanonicalUrl, buildPages, getPublicPageByInputPath, getSiteUrl } from './scripts/seo-config.mjs';

function toPosixPath(value: string) {
  return value.split(path.sep).join('/');
}

function createInternalPathRedirectPlugin() {
  const redirectMap = new Map([
    ['/admin', '/admin/']
  ]);

  const applyRedirect = (
    req: { url?: string | null },
    res: {
      statusCode?: number;
      setHeader(name: string, value: string): void;
      end(chunk?: string): void;
    },
    next: () => void
  ) => {
    const requestUrl = req.url ?? '';
    const matchedRedirect = redirectMap.get(requestUrl);

    if (!matchedRedirect) {
      next();
      return;
    }

    res.statusCode = 302;
    res.setHeader('Location', matchedRedirect);
    res.end();
  };

  return {
    name: 'snapfresh-internal-path-redirects',
    configureServer(server: {
      middlewares: {
        use(
          handler: (
            req: { url?: string | null },
            res: {
              statusCode?: number;
              setHeader(name: string, value: string): void;
              end(chunk?: string): void;
            },
            next: () => void
          ) => void
        ): void;
      };
    }) {
      server.middlewares.use(applyRedirect);
    },
    configurePreviewServer(server: {
      middlewares: {
        use(
          handler: (
            req: { url?: string | null },
            res: {
              statusCode?: number;
              setHeader(name: string, value: string): void;
              end(chunk?: string): void;
            },
            next: () => void
          ) => void
        ): void;
      };
    }) {
      server.middlewares.use(applyRedirect);
    }
  };
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
    envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
    plugins: [
      react(),
      createInternalPathRedirectPlugin(),
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
        },
        '/api/report-issue': {
          target: waitlistProxyTarget,
          changeOrigin: true,
          rewrite: () => '/functions/v1/website-report-issue'
        }
      }
    },
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          buildPages.map((page) => [
            page.key,
            path.resolve(projectRoot, page.inputPath)
          ])
        )
      }
    }
  };
});
