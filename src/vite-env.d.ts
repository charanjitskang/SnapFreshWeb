/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WAITLIST_ENDPOINT_URL?: string;
  readonly VITE_WAITLIST_SUPABASE_URL?: string;
  readonly VITE_WAITLIST_SUPABASE_ANON_KEY?: string;
  readonly VITE_WAITLIST_TABLE?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
