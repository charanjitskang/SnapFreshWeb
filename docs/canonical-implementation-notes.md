# Canonical URL implementation notes

## What is implemented

- Canonical URL generation now uses a single shared source of truth in `scripts/seo-config.mjs`.
- Every public page gets one absolute canonical URL injected into the HTML head during the Vite build.
- Canonical URLs use the production origin `https://snapfresh.app`.
- Canonical path patterns match the sitemap entries exactly.

## Current canonical URLs

- `/` -> `https://snapfresh.app/`
- `/privacy/` -> `https://snapfresh.app/privacy/`
- `/terms/` -> `https://snapfresh.app/terms/`
- `/support/` -> `https://snapfresh.app/support/`
- `/data-deletion/` -> `https://snapfresh.app/data-deletion/`

## Duplicate variants

- The preferred canonical format always uses the trailing-slash page URL.
- Non-canonical variants such as `index.html` paths should not be linked internally.
- If hosting redirects are added later, `index.html` variants should redirect to the trailing-slash canonical URLs above.

## How to add canonicals for a new page

- Add the page entry to `publicPages` in `scripts/seo-config.mjs`.
- Use the trailing-slash public pathname for the new route.
- Keep the page in that shared config so the canonical tag injection and sitemap generation stay aligned.
