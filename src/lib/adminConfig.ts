export interface ResolvedAdminConfig {
  clerkPublishableKey: string;
  supabaseAnonKey: string;
  supabaseUrl: string;
}

interface ResolvedConfigValue {
  sourceEnv: string;
  value: string | null;
}

interface InvalidConfigValue {
  env: string;
  reason: string;
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

function getInvalidClerkPublishableKey(
  resolved: ResolvedConfigValue,
): InvalidConfigValue | null {
  const value = resolved.value;
  if (!value) {
    return null;
  }

  if (value.endsWith("$")) {
    return {
      env: resolved.sourceEnv,
      reason: "looks truncated and ends at the '$' separator",
    };
  }

  return null;
}

function getRuntimeInvalidClerkPublishableKey(
  value: string | null,
): InvalidConfigValue | null {
  if (!value || typeof window === "undefined") {
    return null;
  }

  const hostname = window.location.hostname.toLowerCase();
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  if (isLocalHost && value.startsWith("pk_live_")) {
    return {
      env: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
      reason: "uses a production Clerk key on localhost; Clerk only allows live keys on configured production domains",
    };
  }

  return null;
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
const invalidClerkPublishableKey = getInvalidClerkPublishableKey(
  resolvedClerkPublishableKey,
);
const runtimeInvalidClerkPublishableKey = getRuntimeInvalidClerkPublishableKey(
  resolvedClerkPublishableKey.value,
);

export const ADMIN_CONFIG_STATUS = Object.freeze({
  missing: [
    !resolvedClerkPublishableKey.value ? resolvedClerkPublishableKey.sourceEnv : null,
    !resolvedSupabaseUrl.value ? resolvedSupabaseUrl.sourceEnv : null,
    !resolvedSupabaseAnonKey.value ? resolvedSupabaseAnonKey.sourceEnv : null,
  ].filter((value): value is string => Boolean(value)),
  invalid: [
    invalidClerkPublishableKey,
    runtimeInvalidClerkPublishableKey,
  ].filter((value): value is InvalidConfigValue => Boolean(value)),
});

export function isAdminConfigReady(): boolean {
  return ADMIN_CONFIG_STATUS.missing.length === 0 &&
    ADMIN_CONFIG_STATUS.invalid.length === 0;
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
    const invalidConfig = ADMIN_CONFIG_STATUS.invalid[0];
    if (invalidConfig) {
      throw new Error(
        `[admin] Invalid environment variable ${invalidConfig.env}: ${invalidConfig.reason}.`,
      );
    }

    throw new Error(
      `[admin] Missing required environment variable ${ADMIN_CONFIG_STATUS.missing[0]}.`,
    );
  }

  return config;
}
