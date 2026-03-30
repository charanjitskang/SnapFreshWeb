export interface ResolvedAdminConfig {
  clerkPublishableKey: string;
  supabaseAnonKey: string;
  supabaseUrl: string;
}

interface ResolvedConfigValue {
  sourceEnv: string;
  value: string | null;
}

function readValue(candidates: string[]): ResolvedConfigValue {
  for (const candidate of candidates) {
    const value = import.meta.env[candidate as keyof ImportMetaEnv];
    const trimmed = typeof value === "string" ? value.trim() : "";

    if (trimmed) {
      return {
        sourceEnv: candidate,
        value: trimmed,
      };
    }
  }

  return {
    sourceEnv: candidates[0] ?? "unknown",
    value: null,
  };
}

const resolvedClerkPublishableKey = readValue([
  "VITE_CLERK_PUBLISHABLE_KEY",
  "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
]);
const resolvedSupabaseUrl = readValue([
  "VITE_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_URL",
]);
const resolvedSupabaseAnonKey = readValue([
  "VITE_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
]);

export const ADMIN_CONFIG_STATUS = Object.freeze({
  missing: [
    !resolvedClerkPublishableKey.value ? resolvedClerkPublishableKey.sourceEnv : null,
    !resolvedSupabaseUrl.value ? resolvedSupabaseUrl.sourceEnv : null,
    !resolvedSupabaseAnonKey.value ? resolvedSupabaseAnonKey.sourceEnv : null,
  ].filter((value): value is string => Boolean(value)),
});

export function isAdminConfigReady(): boolean {
  return ADMIN_CONFIG_STATUS.missing.length === 0;
}

export function getAdminConfig(): ResolvedAdminConfig | null {
  if (!isAdminConfigReady()) {
    return null;
  }

  return {
    clerkPublishableKey: resolvedClerkPublishableKey.value!,
    supabaseUrl: resolvedSupabaseUrl.value!,
    supabaseAnonKey: resolvedSupabaseAnonKey.value!,
  };
}

export function requireAdminConfig(): ResolvedAdminConfig {
  const config = getAdminConfig();
  if (!config) {
    throw new Error(
      `[admin] Missing required environment variable ${ADMIN_CONFIG_STATUS.missing[0]}.`,
    );
  }

  return config;
}
