# SnapFresh Web

Marketing and hosted support pages for the SnapFresh mobile app.

## Included pages

- `/` overview and product positioning
- `/privacy/` privacy policy
- `/terms/` terms of use
- `/support/` support page
- `/data-deletion/` account and data deletion instructions

## Development

```bash
npm install
npm run dev
```

Build for deployment:

```bash
npm run build
```

Generate SEO assets without running a full build:

```bash
SITE_URL=https://snapfresh.app npm run generate:seo
```

## Before publishing

- Replace the placeholder support contact in `src/siteContent.ts`.
- Review the legal copy with whoever owns SnapFresh operations and compliance.
- If the iOS app will allow account creation, add an in-app account deletion flow as well. Apple usually expects that in the app, not only on a website.

## Waitlist configuration

The homepage waitlist form posts to the `register-waitlist` Supabase Edge Function.

- Production default:
  `https://rhaupemsfddxqigxjoil.supabase.co/functions/v1/register-waitlist`
- Development default:
  the frontend posts to `/api/register-waitlist`, which Vite proxies to the backend
- Optional override:
  `VITE_WAITLIST_ENDPOINT_URL`
- Optional development proxy target:
  `VITE_WAITLIST_PROXY_TARGET`
- Optional development-only local preview fallback:
  `VITE_WAITLIST_DISABLE_BACKEND=true`

If you want the Vite proxy to hit a local Supabase stack, set:
`VITE_WAITLIST_PROXY_TARGET=http://127.0.0.1:54321`

Requests are sent as JSON with `Content-Type: application/json`. The current payload includes
`email`, `name`, `first_name`, `source`, and `created_at`.

## SEO assets

`robots.txt` and `sitemap.xml` are generated into `public/` by `npm run generate:seo`.
The canonical production domain is `https://snapfresh.app`.
Set `SITE_URL=https://snapfresh.app` in the build environment so the generated files stay aligned with production.

Current sitemap coverage:

- `/`
- `/privacy/`
- `/terms/`
- `/support/`
- `/data-deletion/`

Implementation notes for the rest of the rollout are in `docs/seo-implementation-notes.md`.
