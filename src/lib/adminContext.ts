import type { AdminSessionResponse } from "./adminSession";
import type {
  DashboardDiagnosticEvent,
  DashboardFailureRecord,
  DashboardIncident,
  RequestLookupResult,
} from "./adminDashboard";

const FUNCTION_FILE_HINTS: Record<string, string[]> = {
  "admin-dashboard": [
    "SnapFresh/supabase/functions/admin-dashboard/index.ts",
    "SnapFreshWeb/src/pages/AdminPage.tsx",
  ],
  "admin-session": [
    "SnapFresh/supabase/functions/admin-session/index.ts",
    "SnapFreshWeb/src/pages/AdminPage.tsx",
  ],
  "analyze-meal": [
    "SnapFresh/supabase/functions/analyze-meal/index.ts",
    "SnapFresh/app/src/services/api/MealService.ts",
    "SnapFresh/app/src/store/analysisStore.tsx",
  ],
  "ingest-app-diagnostics": [
    "SnapFresh/supabase/functions/ingest-app-diagnostics/index.ts",
    "SnapFresh/app/src/services/monitoring/diagnosticsUpload.ts",
    "SnapFresh/app/src/services/monitoring/appMonitoring.ts",
  ],
  "register-waitlist": [
    "SnapFresh/supabase/functions/register-waitlist/index.ts",
    "SnapFreshWeb/src/lib/waitlist.ts",
  ],
  "resolve-nutrition": [
    "SnapFresh/supabase/functions/resolve-nutrition/index.ts",
    "SnapFresh/app/src/services/api/authenticatedEdgeFunction.ts",
  ],
};

const SCOPE_HINTS: Array<{ prefix: string; files: string[] }> = [
  {
    prefix: "diagnostics.auth.",
    files: [
      "SnapFresh/app/app/_layout.tsx",
      "SnapFresh/app/lib/profile.ts",
      "SnapFresh/app/src/services/monitoring/runtimeDiagnostics.ts",
    ],
  },
  {
    prefix: "diagnostics.edge.",
    files: [
      "SnapFresh/app/src/services/api/authenticatedEdgeFunction.ts",
      "SnapFresh/app/src/services/api/MealService.ts",
      "SnapFresh/app/src/services/api/edgeFunctionErrors.ts",
    ],
  },
  {
    prefix: "diagnostics.upload.",
    files: [
      "SnapFresh/app/src/services/monitoring/diagnosticsUpload.ts",
      "SnapFresh/supabase/functions/ingest-app-diagnostics/index.ts",
    ],
  },
  {
    prefix: "diagnostics.",
    files: [
      "SnapFresh/app/src/services/monitoring/appMonitoring.ts",
      "SnapFresh/app/src/services/monitoring/runtimeDiagnostics.ts",
    ],
  },
];

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

function formatRatio(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function getRelevantFileHints(input: {
  functionName?: string | null;
  scope?: string | null;
}): string[] {
  const files: string[] = [];

  if (input.functionName) {
    files.push(...(FUNCTION_FILE_HINTS[input.functionName] ?? []));
  }

  if (input.scope) {
    for (const hint of SCOPE_HINTS) {
      if (input.scope.startsWith(hint.prefix)) {
        files.push(...hint.files);
      }
    }
  }

  return dedupe(files);
}

export function buildSnapshotMarkdown(
  session: AdminSessionResponse,
  signedInEmail: string | null,
): string {
  const lines = [
    "# SnapFresh Admin Snapshot",
    "",
    `Generated at: ${formatDateTime(session.requestedAt)}`,
    `Signed-in email: ${signedInEmail ?? "Unavailable"}`,
    `Clerk user id: ${session.adminUser.clerkUserId}`,
    `Admin role: ${session.adminUser.role}`,
    "",
    "## Current signal",
    `- Active alerts: ${session.snapshot.activeAlertCount}`,
    `- Recent edge-function failures (24h): ${session.snapshot.recentFailureCount24h}`,
    `- Diagnostics uploads (24h): ${session.snapshot.diagnosticsBatchCount24h}`,
    `- Latest failure: ${
      session.snapshot.latestFailure
        ? `${session.snapshot.latestFailure.functionName} at ${formatDateTime(session.snapshot.latestFailure.occurredAt)}`
        : "None"
    }`,
    `- Latest diagnostics batch: ${
      session.snapshot.latestDiagnosticsBatch
        ? `${session.snapshot.latestDiagnosticsBatch.platform ?? "unknown"} ${session.snapshot.latestDiagnosticsBatch.appVersion ?? "unknown"} at ${formatDateTime(session.snapshot.latestDiagnosticsBatch.receivedAt)}`
        : "None"
    }`,
    "",
    "## Active alerts",
  ];

  if (session.snapshot.activeAlerts.length === 0) {
    lines.push("- None");
  } else {
    for (const alert of session.snapshot.activeAlerts) {
      lines.push(
        `- ${alert.functionName}: ${formatRatio(alert.errorRate)} error rate, ${alert.errorWindowErrors}/${alert.errorWindowRequests} recent errors, ${formatUsd(alert.spendWindowCostUsd)} spend window`,
      );
    }
  }

  lines.push(
    "",
    "## Relevant repo areas",
    ...getRelevantFileHints({ functionName: "admin-dashboard" }).map((file) => `- ${file}`),
    "- SnapFresh/supabase/migrations/",
    "- SnapFresh/app/src/services/monitoring/",
  );

  return lines.join("\n");
}

export function buildFailureContextMarkdown(
  failure: DashboardFailureRecord,
  session: AdminSessionResponse,
): string {
  const fileHints = getRelevantFileHints({ functionName: failure.functionName });

  return [
    "# SnapFresh Failure Context",
    "",
    `Admin role: ${session.adminUser.role}`,
    `Occurred at: ${formatDateTime(failure.occurredAt)}`,
    `Function: ${failure.functionName}`,
    `Outcome: ${failure.outcome}`,
    `HTTP status: ${failure.statusCode}`,
    `Latency: ${failure.latencyMs}ms`,
    `Request id: ${failure.requestId}`,
    `Correlation id: ${failure.correlationId ?? "Unavailable"}`,
    `Error code: ${failure.errorCode ?? "Unavailable"}`,
    `Provider/model: ${failure.provider ?? "n/a"} / ${failure.model ?? "n/a"}`,
    "",
    "## Error message",
    failure.errorMessage ?? "No error message recorded.",
    "",
    "## Metadata summary",
    failure.metadataSummary ?? "No metadata summary recorded.",
    "",
    "## Relevant repo files",
    ...(fileHints.length > 0 ? fileHints.map((file) => `- ${file}`) : ["- No mapping available yet."]),
  ].join("\n");
}

export function buildDiagnosticsContextMarkdown(
  event: DashboardDiagnosticEvent,
  session: AdminSessionResponse,
): string {
  const fileHints = getRelevantFileHints({
    functionName: event.scope.includes("upload") ? "ingest-app-diagnostics" : null,
    scope: event.scope,
  });

  return [
    "# SnapFresh Diagnostics Context",
    "",
    `Admin role: ${session.adminUser.role}`,
    `Level: ${event.level}`,
    `Fatal: ${event.isFatal ? "yes" : "no"}`,
    `Scope: ${event.scope}`,
    `Occurred at: ${formatDateTime(event.occurredAt ?? event.ingestedAt)}`,
    `Batch id: ${event.batchId}`,
    `Event id: ${event.eventId ?? event.id}`,
    `Platform/version: ${event.platform ?? "unknown"} / ${event.appVersion ?? "unknown"}`,
    "",
    "## Message",
    event.message,
    "",
    "## Error name",
    event.errorName ?? "Unavailable",
    "",
    "## Stack",
    event.stack ?? "Unavailable",
    "",
    "## Context summary",
    event.contextSummary ?? "Unavailable",
    "",
    "## Environment summary",
    event.environmentSummary ?? "Unavailable",
    "",
    "## Relevant repo files",
    ...(fileHints.length > 0 ? fileHints.map((file) => `- ${file}`) : ["- No mapping available yet."]),
  ].join("\n");
}

export function buildLookupContextMarkdown(
  result: RequestLookupResult,
  session: AdminSessionResponse,
): string {
  const hints = dedupe(
    result.matches.flatMap((match) =>
      getRelevantFileHints({ functionName: match.functionName })
    ),
  );

  const lines = [
    "# SnapFresh Request Lookup",
    "",
    `Query: ${result.query}`,
    `Matches: ${result.matches.length}`,
    `Admin role: ${session.adminUser.role}`,
    "",
    "## Matching invocations",
  ];

  if (result.matches.length === 0) {
    lines.push("- No invocation matched this request/correlation id.");
  } else {
    for (const match of result.matches) {
      lines.push(
        `- ${match.functionName} at ${formatDateTime(match.occurredAt)} | status ${match.statusCode} | request ${match.requestId} | correlation ${match.correlationId ?? "n/a"} | error ${match.errorCode ?? "n/a"}`,
      );
    }
  }

  lines.push(
    "",
    "## Relevant repo files",
    ...(hints.length > 0 ? hints.map((file) => `- ${file}`) : ["- No mapping available yet."]),
  );

  return lines.join("\n");
}

function formatSeverityLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildIncidentContextMarkdown(
  incident: DashboardIncident,
  session: AdminSessionResponse,
): string {
  const fileHints = dedupe([
    ...getRelevantFileHints({
      functionName: incident.latestFailure?.functionName ?? null,
      scope: incident.latestDiagnostic?.scope ?? null,
    }),
    "SnapFreshWeb/src/pages/AdminPage.tsx",
  ]);

  const lines = [
    "# SnapFresh Incident Brief",
    "",
    `Title: ${incident.title}`,
    `Source: ${incident.source}`,
    `Status: ${incident.status}`,
    `Severity: ${formatSeverityLabel(incident.severity)} (base ${incident.baseSeverity})`,
    `Occurrences in window: ${incident.occurrenceCount}`,
    `First seen: ${formatDateTime(incident.firstSeenAt)}`,
    `Last seen: ${formatDateTime(incident.lastSeenAt)}`,
    `Fresh activity after resolution: ${incident.hasFreshActivity ? "yes" : "no"}`,
    `Admin role: ${session.adminUser.role}`,
    "",
    "## Summary",
    incident.summary,
    "",
    "## Severity rationale",
    incident.severityReason,
    "",
    "## Tags",
    ...(incident.tags.length > 0 ? incident.tags.map((tag) => `- ${tag}`) : ["- None"]),
    "",
    "## Investigator notes",
    incident.state?.notes ?? "No saved notes yet.",
  ];

  if (incident.latestFailure) {
    lines.push(
      "",
      "## Latest backend sample",
      `- Function: ${incident.latestFailure.functionName}`,
      `- Occurred at: ${formatDateTime(incident.latestFailure.occurredAt)}`,
      `- Request id: ${incident.latestFailure.requestId}`,
      `- Correlation id: ${incident.latestFailure.correlationId ?? "Unavailable"}`,
      `- Error code: ${incident.latestFailure.errorCode ?? "Unavailable"}`,
      `- Status: ${incident.latestFailure.statusCode}`,
      `- Message: ${incident.latestFailure.errorMessage ?? "Unavailable"}`,
      `- Metadata: ${incident.latestFailure.metadataSummary ?? "Unavailable"}`,
    );
  }

  if (incident.latestDiagnostic) {
    lines.push(
      "",
      "## Latest app diagnostics sample",
      `- Scope: ${incident.latestDiagnostic.scope}`,
      `- Level: ${incident.latestDiagnostic.level}`,
      `- Fatal: ${incident.latestDiagnostic.isFatal ? "yes" : "no"}`,
      `- Occurred at: ${formatDateTime(incident.latestDiagnostic.occurredAt ?? incident.latestDiagnostic.ingestedAt)}`,
      `- Platform/version: ${incident.latestDiagnostic.platform ?? "unknown"} / ${incident.latestDiagnostic.appVersion ?? "unknown"}`,
      `- Message: ${incident.latestDiagnostic.message}`,
      `- Error name: ${incident.latestDiagnostic.errorName ?? "Unavailable"}`,
      `- Context: ${incident.latestDiagnostic.contextSummary ?? "Unavailable"}`,
    );
  }

  lines.push(
    "",
    "## Relevant repo files",
    ...(fileHints.length > 0 ? fileHints.map((file) => `- ${file}`) : ["- No mapping available yet."]),
  );

  return lines.join("\n");
}
