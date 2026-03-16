# Rendering implementation notes

## What is implemented

- Public pages are now pre-rendered after the normal Vite client build.
- The build flow stays Vite-based:
  - `vite build` creates the client assets
  - `vite build --ssr ./src/entries/ssr.tsx` creates a temporary SSR bundle for markup generation
  - `scripts/prerender-dist.mjs` injects the rendered HTML into `dist/*.html`
- Client entry points now hydrate existing HTML when pre-rendered markup is present, and still fall back to client rendering when the root is empty in development.

## Current coverage

- `/`
- `/privacy/`
- `/terms/`
- `/support/`
- `/data-deletion/`

## Why this approach

- It improves crawlability without replacing the existing static Vite deployment model.
- Titles, metadata, and main page content are present in the built HTML before JavaScript executes.
- The approach keeps interactive behavior such as the waitlist form working after hydration.

## How to extend it

- Add new public pages to the build input and SEO route config as usual.
- Register the page in `src/entries/ssr.tsx` so it can be rendered during the pre-render step.
- Keep the client entry using `mountApp(...)` so hydration continues to work.

## Remaining considerations

- If hosting-level caching or redirects are added later, verify they continue to serve the pre-rendered HTML output unchanged.
- If a future page uses browser-only APIs during render, it will need an SSR-safe guard before it can join the pre-rendered set.
