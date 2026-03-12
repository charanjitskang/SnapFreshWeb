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

## Before publishing

- Replace the placeholder support contact in `src/siteContent.ts`.
- Review the legal copy with whoever owns SnapFresh operations and compliance.
- If the iOS app will allow account creation, add an in-app account deletion flow as well. Apple usually expects that in the app, not only on a website.

## Waitlist configuration

The homepage waitlist form supports three modes:

- `VITE_WAITLIST_ENDPOINT_URL`: submit JSON to your own endpoint.
- `VITE_WAITLIST_SUPABASE_URL` and `VITE_WAITLIST_SUPABASE_ANON_KEY`: submit directly to Supabase REST.
- Local preview fallback in development when no waitlist env vars are set.

Use `.env.example` as the starting point. If you use Supabase, create a table such as `waitlist_submissions` and allow inserts for the fields `email`, `first_name`, `goal`, `platform`, `source`, and `created_at`.
