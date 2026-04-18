import { requireAdminConfig } from "./adminConfig";

export type IncidentSource = "edge_function" | "diagnostic";
export type IncidentSourceFilter = "all" | IncidentSource;
export type IncidentStatus =
  | "new"
  | "acknowledged"
  | "investigating"
  | "resolved"
  | "ignored";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export interface AdminDashboardErrorShape {
  error?: string;
  message?: string;
}

export class AdminDashboardError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminDashboardError";
    this.status = status;
  }
}

export interface DashboardFailureRecord {
  requestId: string;
  correlationId: string | null;
  functionName: string;
  outcome: string;
  statusCode: number;
  errorCode: string | null;
  errorMessage: string | null;
  latencyMs: number;
  provider: string | null;
  model: string | null;
  metadataSummary: string | null;
  occurredAt: string;
}

export interface DashboardDiagnosticEvent {
  id: string;
  batchId: string;
  eventId: string | null;
  occurredAt: string | null;
  ingestedAt: string;
  level: "info" | "warning" | "error";
  scope: string;
  message: string;
  errorName: string | null;
  stack: string | null;
  isFatal: boolean;
  platform: string | null;
  appVersion: string | null;
  batchReceivedAt: string | null;
  contextSummary: string | null;
  environmentSummary: string | null;
  area: string;
  headline: string;
  signalType: string;
  semanticSeverity: IncidentSeverity;
  functionName: string | null;
  statusCode: number | null;
  errorCode: string | null;
  operationallyRelevant: boolean;
}

export interface DashboardIncidentState {
  incidentKey: string;
  source: IncidentSource;
  title: string;
  status: IncidentStatus;
  severityOverride: IncidentSeverity | null;
  notes: string | null;
  updatedAt: string;
  updatedByClerkUserId: string | null;
}

export interface DashboardIncident {
  incidentKey: string;
  source: IncidentSource;
  title: string;
  summary: string;
  severity: IncidentSeverity;
  baseSeverity: IncidentSeverity;
  severityReason: string;
  status: IncidentStatus;
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  hasFreshActivity: boolean;
  tags: string[];
  state: DashboardIncidentState | null;
  latestFailure: DashboardFailureRecord | null;
  latestDiagnostic: DashboardDiagnosticEvent | null;
}

export interface RecentFailuresResult {
  failures: DashboardFailureRecord[];
  filters: {
    functionName: string | null;
    hours: number;
    limit: number;
  };
}

export interface DiagnosticsEventsResult {
  events: DashboardDiagnosticEvent[];
  filters: {
    fatalOnly: boolean;
    level: "info" | "warning" | "error" | null;
    limit: number;
    platform: string | null;
  };
}

export interface RequestLookupResult {
  query: string;
  matches: DashboardFailureRecord[];
}

export interface IncidentCandidatesResult {
  incidents: DashboardIncident[];
  filters: {
    hours: number;
    includeResolved: boolean;
    limit: number;
    source: IncidentSourceFilter;
  };
}

async function extractErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await response.json()) as AdminDashboardErrorShape;
    return body.message || body.error || "Admin dashboard request failed.";
  }

  const body = await response.text();
  return body || "Admin dashboard request failed.";
}

async function postAdminDashboardAction<T>(
  accessToken: string,
  body: Record<string, unknown>,
): Promise<T> {
  const adminConfig = requireAdminConfig();

  const response = await fetch(
    `${adminConfig.supabaseUrl}/functions/v1/admin-dashboard`,
    {
      method: "POST",
      headers: {
        apikey: adminConfig.supabaseAnonKey,
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new AdminDashboardError(
      await extractErrorMessage(response),
      response.status,
    );
  }

  const payload = (await response.json()) as {
    data: T;
  };

  return payload.data;
}

export async function loadRecentFailures(
  accessToken: string,
  options: { functionName?: string | null; hours?: number; limit?: number } = {},
): Promise<RecentFailuresResult> {
  return postAdminDashboardAction<RecentFailuresResult>(accessToken, {
    action: "recent_failures",
    functionName: options.functionName ?? null,
    hours: options.hours ?? 24,
    limit: options.limit ?? 12,
  });
}

export async function loadDiagnosticsEvents(
  accessToken: string,
  options: {
    fatalOnly?: boolean;
    level?: "info" | "warning" | "error" | null;
    limit?: number;
    platform?: string | null;
  } = {},
): Promise<DiagnosticsEventsResult> {
  return postAdminDashboardAction<DiagnosticsEventsResult>(accessToken, {
    action: "diagnostics_events",
    fatalOnly: options.fatalOnly ?? false,
    level: options.level ?? null,
    limit: options.limit ?? 12,
    platform: options.platform ?? null,
  });
}

export async function lookupRequest(
  accessToken: string,
  query: string,
  limit = 8,
): Promise<RequestLookupResult> {
  return postAdminDashboardAction<RequestLookupResult>(accessToken, {
    action: "request_lookup",
    query,
    limit,
  });
}

export async function loadIncidentCandidates(
  accessToken: string,
  options: {
    hours?: number;
    includeResolved?: boolean;
    limit?: number;
    source?: IncidentSourceFilter;
  } = {},
): Promise<IncidentCandidatesResult> {
  return postAdminDashboardAction<IncidentCandidatesResult>(accessToken, {
    action: "incident_candidates",
    hours: options.hours ?? 72,
    includeResolved: options.includeResolved ?? false,
    limit: options.limit ?? 14,
    source: options.source ?? "all",
  });
}

export async function saveIncidentState(
  accessToken: string,
  input: {
    incidentKey: string;
    source: IncidentSource;
    title: string;
    status: IncidentStatus;
    severityOverride?: IncidentSeverity | null;
    notes?: string | null;
  },
): Promise<DashboardIncidentState> {
  return postAdminDashboardAction<DashboardIncidentState>(accessToken, {
    action: "update_incident_state",
    incidentKey: input.incidentKey,
    source: input.source,
    title: input.title,
    status: input.status,
    severityOverride: input.severityOverride ?? null,
    notes: input.notes ?? null,
  });
}
