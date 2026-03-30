/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  readonly EXPO_PUBLIC_POSTHOG_API_KEY?: string;
  readonly EXPO_PUBLIC_POSTHOG_HOST?: string;
  readonly EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly EXPO_PUBLIC_SUPABASE_URL?: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
  readonly VITE_POSTHOG_API_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_WAITLIST_ENDPOINT_URL?: string;
  readonly VITE_WAITLIST_DISABLE_BACKEND?: string;
  readonly VITE_WAITLIST_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
