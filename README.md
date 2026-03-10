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
