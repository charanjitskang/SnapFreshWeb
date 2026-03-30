import { requireAdminConfig } from "./adminConfig";

export interface AdminCapabilities {
  canCopyContext: boolean;
  canManageIncidentState: boolean;
  canManageAdmins: boolean;
  canViewDiagnostics: boolean;
  canViewOverview: boolean;
}

export interface AdminUser {
  clerkUserId: string;
  email: string | null;
  displayName: string | null;
  role: "owner" | "admin" | "support";
}

export interface ActiveAlert {
  functionName: string;
  highErrorRate: boolean;
  unusualVolume: boolean;
  highSpend: boolean;
  errorWindowRequests: number;
  errorWindowErrors: number;
  errorRate: number;
  spendWindowCostUsd: number;
}

export interface AdminSessionResponse {
  adminUser: AdminUser;
  capabilities: AdminCapabilities;
  snapshot: {
    activeAlertCount: number;
    activeAlerts: ActiveAlert[];
    recentFailureCount24h: number;
    latestFailure: {
      occurredAt: string;
      functionName: string;
      errorCode: string | null;
      errorMessage: string | null;
    } | null;
    diagnosticsBatchCount24h: number;
    latestDiagnosticsBatch: {
      receivedAt: string;
      platform: string | null;
      appVersion: string | null;
      eventCount: number;
    } | null;
  };
  requestedAt: string;
}

export class AdminSessionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminSessionError";
    this.status = status;
  }
}

async function extractErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await response.json()) as {
      error?: string;
      message?: string;
    };

    return body.message || body.error || "Admin session request failed.";
  }

  const body = await response.text();
  return body || "Admin session request failed.";
}

export async function loadAdminSession(
  accessToken: string,
): Promise<AdminSessionResponse> {
  const adminConfig = requireAdminConfig();

  const response = await fetch(
    `${adminConfig.supabaseUrl}/functions/v1/admin-session`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        apikey: adminConfig.supabaseAnonKey,
        authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new AdminSessionError(
      await extractErrorMessage(response),
      response.status,
    );
  }

  return (await response.json()) as AdminSessionResponse;
}
