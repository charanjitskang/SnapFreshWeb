import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalUrl, getSiteUrl, publicPages } from './seo-config.mjs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const publicDir = path.join(projectRoot, 'public');

function buildRobotsTxt(siteUrl) {
  const lines = [];

  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);

  return `${lines.join('\n')}\n`;
}

function buildSitemapXml(siteUrl) {
  const urlEntries = publicPages.map((page) => {
    return [
      '  <url>',
      `    <loc>${buildCanonicalUrl(siteUrl, page.pathname)}</loc>`,
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
  const siteUrl = getSiteUrl();

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
