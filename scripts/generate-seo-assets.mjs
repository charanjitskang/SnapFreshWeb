import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SITE_URL = 'https://snapfresh.app';
const PUBLIC_PATHS = ['/', '/privacy/', '/terms/', '/support/', '/data-deletion/'];

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const publicDir = path.join(projectRoot, 'public');

function normalizeSiteUrl(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

function buildRobotsTxt(siteUrl) {
  const lines = [];

  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);

  return `${lines.join('\n')}\n`;
}

function buildSitemapXml(siteUrl) {
  const urlEntries = PUBLIC_PATHS.map((route) => {
    const canonicalUrl = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`;

    return [
      '  <url>',
      `    <loc>${canonicalUrl}</loc>`,
      '  </url>'
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    ''
  ].join('\n');
}

async function main() {
  const siteUrl = normalizeSiteUrl(
    process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? DEFAULT_SITE_URL
  );

  await mkdir(publicDir, { recursive: true });

  await Promise.all([
    writeFile(path.join(publicDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8'),
    writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml(siteUrl), 'utf8')
  ]);

  console.log(`[seo] Generated robots.txt and sitemap.xml for ${siteUrl}`);
}

main().catch((error) => {
  console.error('[seo] Failed to generate SEO assets.');
  console.error(error);
  process.exitCode = 1;
});
