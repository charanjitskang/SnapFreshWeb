import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { publicPages } from './seo-config.mjs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const distDir = path.join(projectRoot, 'dist');
const ssrDir = path.join(projectRoot, '.ssr');

async function loadSsrRenderer() {
  const candidateFiles = ['ssr.mjs', 'ssr.js'];

  for (const fileName of candidateFiles) {
    const modulePath = path.join(ssrDir, fileName);

    try {
      await readFile(modulePath, 'utf8');
      return import(pathToFileURL(modulePath).href);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        continue;
      }

      throw error;
    }
  }

  throw new Error('Could not find the generated SSR entry bundle in .ssr/.');
}

function getDistHtmlPath(page) {
  if (page.pathname === '/') {
    return path.join(distDir, 'index.html');
  }

  return path.join(distDir, page.pathname.slice(1), 'index.html');
}

function injectRenderedApp(html, renderedApp) {
  const rootMarkup = `<div id="root">${renderedApp}</div>`;

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Expected an empty root container in built HTML.');
  }

  return html.replace('<div id="root"></div>', rootMarkup);
}

async function main() {
  const { renderPage } = await loadSsrRenderer();

  await Promise.all(
    publicPages.map(async (page) => {
      const htmlPath = getDistHtmlPath(page);
      const html = await readFile(htmlPath, 'utf8');
      const renderedApp = renderPage(page.pathname);
      const prerenderedHtml = injectRenderedApp(html, renderedApp);

      await writeFile(htmlPath, prerenderedHtml, 'utf8');
    })
  );

  await rm(ssrDir, { recursive: true, force: true });
  console.log('[prerender] Injected rendered HTML into public pages.');
}

main().catch(async (error) => {
  console.error('[prerender] Failed to pre-render public pages.');
  console.error(error);
  await rm(ssrDir, { recursive: true, force: true });
  process.exitCode = 1;
});
