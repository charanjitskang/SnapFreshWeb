/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POSTHOG_API_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_WAITLIST_ENDPOINT_URL?: string;
  readonly VITE_WAITLIST_DISABLE_BACKEND?: string;
  readonly VITE_WAITLIST_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
