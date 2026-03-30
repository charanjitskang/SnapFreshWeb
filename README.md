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

## Analytics configuration

The marketing site can send analytics to the same PostHog project as the app.

- Required: `VITE_POSTHOG_API_KEY`
- Optional: `VITE_POSTHOG_HOST`

Recommended values if you want the website and Expo app in the same PostHog project:

- `VITE_POSTHOG_API_KEY` = the same value as `EXPO_PUBLIC_POSTHOG_API_KEY`
- `VITE_POSTHOG_HOST` = the same value as `EXPO_PUBLIC_POSTHOG_HOST`

If `VITE_POSTHOG_API_KEY` is not set, website analytics stay disabled.

The site currently tracks:

- `waitlist_cta_clicked`
- `waitlist_section_viewed`
- `waitlist_form_started`
- `waitlist_validation_failed`
- `waitlist_submitted`
- `waitlist_submission_failed`
- `support_contact_clicked`

## SEO assets

`robots.txt` and `sitemap.xml` are generated into `public/` by `npm run generate:seo`.
The canonical production domain is `https://snapfresh.app`.
Set `SITE_URL=https://snapfresh.app` in the build environment so the generated files stay aligned with production.
Canonical URLs for public pages are injected during the Vite build from the shared route config in `scripts/seo-config.mjs`.
Public pages are also pre-rendered into the built HTML so crawlers can see meaningful body content before client-side hydration.

Current sitemap coverage:

- `/`
- `/privacy/`
- `/terms/`
- `/support/`
- `/data-deletion/`

## Admin dashboard bootstrap

`/admin/` is an internal page. It is bundled with the site, but it is not added to
the public sitemap and the page itself sends `noindex`.

Phase 1 adds:

- Clerk sign-in for the admin page
- Supabase-backed allowlist enforcement through `public.admin_users`
- a protected `admin-session` edge function that returns the first operational snapshot
- a copyable bootstrap summary for fast debugging and AI handoff

Required website env vars:

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the same Clerk instance and Supabase project as the app environment you want
to observe.

To add the first admin after the migration is applied, insert a row similar to:

```sql
insert into public.admin_users (
  clerk_user_id,
  email,
  display_name,
  role
)
values (
  'user_...',
  'admin@example.com',
  'Your Name',
  'owner'
);
```

Implementation notes for the rest of the rollout are in `docs/seo-implementation-notes.md`.
Canonical-specific notes are in `docs/canonical-implementation-notes.md`.
Rendering-specific notes are in `docs/rendering-implementation-notes.md`.
