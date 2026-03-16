export const DEFAULT_SITE_URL = 'https://snapfresh.app';

export const publicPages = [
  {
    key: 'main',
    inputPath: 'index.html',
    pathname: '/'
  },
  {
    key: 'privacy',
    inputPath: 'privacy/index.html',
    pathname: '/privacy/'
  },
  {
    key: 'terms',
    inputPath: 'terms/index.html',
    pathname: '/terms/'
  },
  {
    key: 'support',
    inputPath: 'support/index.html',
    pathname: '/support/'
  },
  {
    key: 'dataDeletion',
    inputPath: 'data-deletion/index.html',
    pathname: '/data-deletion/'
  }
];

export function normalizeSiteUrl(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

export function getSiteUrl(env = process.env) {
  return normalizeSiteUrl(env.SITE_URL ?? env.VITE_SITE_URL ?? DEFAULT_SITE_URL);
}

export function buildCanonicalUrl(siteUrl, pathname) {
  return pathname === '/' ? `${siteUrl}/` : `${siteUrl}${pathname}`;
}

export function getPublicPageByInputPath(inputPath) {
  return publicPages.find((page) => page.inputPath === inputPath) ?? null;
}
