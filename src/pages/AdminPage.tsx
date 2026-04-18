import {
  ClerkDegraded,
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  UserButton,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { PlateMascot } from "../components/PlateMascot";
import {
  loadDiagnosticsEvents,
  loadIncidentCandidates,
  loadRecentFailures,
  lookupRequest,
  saveIncidentState,
  type DashboardDiagnosticEvent,
  type DashboardFailureRecord,
  type DashboardIncident,
  type DiagnosticsEventsResult,
  type IncidentCandidatesResult,
  type IncidentSeverity,
  type IncidentSourceFilter,
  type IncidentStatus,
  type RecentFailuresResult,
  type RequestLookupResult,
} from "../lib/adminDashboard";
import {
  buildDiagnosticsContextMarkdown,
  buildFailureContextMarkdown,
  buildIncidentContextMarkdown,
  buildLookupContextMarkdown,
  buildSnapshotMarkdown,
} from "../lib/adminContext";
import {
  AdminSessionError,
  loadAdminSession,
  type AdminSessionResponse,
} from "../lib/adminSession";

type SessionState =
  | { status: "signed-out" }
  | { status: "loading" }
  | { status: "ready"; accessToken: string; data: AdminSessionResponse }
  | { status: "forbidden"; message: string }
  | { status: "error"; message: string };

const INCIDENT_STATUS_OPTIONS: Array<{
  label: string;
  value: IncidentStatus;
}> = [
  { label: "New", value: "new" },
  { label: "Acknowledged", value: "acknowledged" },
  { label: "Investigating", value: "investigating" },
  { label: "Resolved", value: "resolved" },
  { label: "Ignored", value: "ignored" },
];

const INCIDENT_SEVERITY_OPTIONS: Array<{
  label: string;
  value: "auto" | IncidentSeverity;
}> = [
  { label: "Auto", value: "auto" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
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

function formatSeverityLabel(value: IncidentSeverity): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatSourceLabel(value: DashboardIncident["source"]): string {
  return value === "edge_function" ? "Edge function" : "App diagnostics";
}

function formatCountLabel(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function getDiagnosticIncidents(
  incidents: IncidentCandidatesResult | null,
): DashboardIncident[] {
  return (incidents?.incidents ?? []).filter((incident) => incident.source === "diagnostic");
}

function countIncidentsBySeverity(
  incidents: DashboardIncident[],
  severities: IncidentSeverity[],
): number {
  const allowed = new Set(severities);
  return incidents.filter((incident) => allowed.has(incident.severity)).length;
}

function extractTagValue(tags: string[], prefix: string): string | null {
  const match = tags.find((tag) => tag.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}

async function copyText(value: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

function AdminStatusCard({
  session,
  signedInEmail,
  copyState,
  onCopySnapshot,
}: {
  session: AdminSessionResponse;
  signedInEmail: string | null;
  copyState: "idle" | "copied" | "failed";
  onCopySnapshot: () => void;
}) {
  return (
    <section className="admin-card admin-card-hero">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Access confirmed</div>
          <h2>Phase 3 adds a triage queue, notes, and issue briefs ready for fixing.</h2>
        </div>
        <UserButton />
      </div>
      <p className="admin-card-copy">
        Start from grouped incidents instead of raw event spam, keep investigator
        notes attached to the issue, and still drop into backend failures,
        device diagnostics, and exact request lookup when you need the details.
      </p>
      <div className="admin-pill-row">
        <span className="admin-pill">Role: {session.adminUser.role}</span>
        <span className="admin-pill">
          Incident state: {session.capabilities.canManageIncidentState ? "enabled" : "off"}
        </span>
        <span className="admin-pill">
          Copy context: {session.capabilities.canCopyContext ? "enabled" : "off"}
        </span>
        <span className="admin-pill">
          Admin email: {session.adminUser.email ?? signedInEmail ?? "Unavailable"}
        </span>
      </div>
      <div className="hero-actions">
        <button className="button button-primary" onClick={onCopySnapshot}>
          Copy Snapshot For Codex
        </button>
        <span className="admin-copy-state">
          {copyState === "copied"
            ? "Snapshot copied."
            : copyState === "failed"
              ? "Clipboard access failed."
              : "Use this when you want to brief Codex on the current production picture."}
        </span>
      </div>
    </section>
  );
}

function AdminSignedOutCard() {
  const clerk = useClerk();

  return (
    <section className="admin-grid">
      <article className="admin-card admin-card-hero">
        <div className="eyebrow">Sign in required</div>
        <h2>Use the same Clerk identity you trust in production.</h2>
        <p className="admin-card-copy">
          This admin route stays empty until you sign in. After Clerk resolves
          your session, the backend checks `admin_users` before returning any
          observability data or triage state.
        </p>
        <div className="hero-actions">
          <button
            className="button button-primary"
            onClick={() =>
              clerk.openSignIn({
                fallbackRedirectUrl: window.location.href,
                forceRedirectUrl: window.location.href,
              })}
          >
            Continue With Clerk
          </button>
        </div>
      </article>

      <article className="admin-card">
        <div className="eyebrow">What Phase 3 adds</div>
        <ul className="admin-list">
          <li>Grouped incidents built from recurring edge-function failures and uploaded diagnostics.</li>
          <li>Persistent status, severity overrides, and notes for investigation handoff.</li>
          <li>Copy-ready issue briefs shaped for Codex before you dive into raw traces.</li>
          <li>Raw failure, diagnostics, and request lookup views still available underneath.</li>
        </ul>
      </article>
    </section>
  );
}

function AdminForbiddenCard({
  message,
  userId,
  email,
}: {
  message: string;
  userId: string | null;
  email: string | null;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  return (
    <section className="admin-grid">
      <article className="admin-card admin-card-hero">
        <div className="eyebrow">Allowlist required</div>
        <h2>Signed in, but this account is not enabled for admin access.</h2>
        <p className="admin-card-copy">
          {message} Add this Clerk user to `public.admin_users` in Supabase, then
          refresh the page.
        </p>
        <div className="admin-pill-row">
          <span className="admin-pill">Email: {email ?? "Unavailable"}</span>
          <span className="admin-pill">Clerk user id: {userId ?? "Unavailable"}</span>
        </div>
        <div className="hero-actions">
          <button
            className="button button-secondary"
            disabled={!userId}
            onClick={async () => {
              if (!userId) {
                setCopyState("failed");
                return;
              }

              const copied = await copyText(userId).catch(() => false);
              setCopyState(copied ? "copied" : "failed");
            }}
          >
            Copy Clerk User ID
          </button>
          <span className="admin-copy-state">
            {copyState === "copied"
              ? "User id copied."
              : copyState === "failed"
                ? "Could not copy the user id."
                : "Use this value to add the first admin row."}
          </span>
        </div>
      </article>

      <article className="admin-card">
        <div className="eyebrow">Bootstrap SQL</div>
        <pre className="admin-code-block">{`insert into public.admin_users (
  clerk_user_id,
  email,
  display_name,
  role
)
values (
  '${userId ?? "user_xxx"}',
  '${email ?? "admin@example.com"}',
  'Your Name',
  'owner'
);`}</pre>
      </article>
    </section>
  );
}

function OverviewCards({
  incidents,
  session,
}: {
  incidents: IncidentCandidatesResult | null;
  session: AdminSessionResponse;
}) {
  const allIncidents = incidents?.incidents ?? [];
  const diagnosticIncidents = getDiagnosticIncidents(incidents);
  const affectedReleases = new Set(
    diagnosticIncidents
      .map((incident) => incident.latestDiagnostic?.appVersion)
      .filter((value): value is string => Boolean(value)),
  );
  const criticalHighCount = countIncidentsBySeverity(allIncidents, ["critical", "high"]);

  return (
    <section className="admin-grid">
      <article className="admin-card">
        <div className="eyebrow">Overview</div>
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <span>Open incident clusters</span>
            <strong>{incidents ? allIncidents.length : session.snapshot.activeAlertCount}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Critical or high</span>
            <strong>{criticalHighCount}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Client issue clusters</span>
            <strong>{diagnosticIncidents.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Affected releases</span>
            <strong>{affectedReleases.size || "—"}</strong>
          </div>
        </div>
      </article>

      <article className="admin-card">
        <div className="eyebrow">Latest signal</div>
        <div className="admin-detail-stack">
          <div>
            <h3>Most recent edge-function failure</h3>
            <p>
              {session.snapshot.latestFailure
                ? `${session.snapshot.latestFailure.functionName} at ${formatDateTime(session.snapshot.latestFailure.occurredAt)}`
                : "No recent edge-function failures detected."}
            </p>
            {session.snapshot.latestFailure?.errorMessage ? (
              <p className="admin-detail-note">
                {session.snapshot.latestFailure.errorMessage}
              </p>
            ) : null}
          </div>

          <div>
            <h3>Most recent client signal</h3>
            <p>
              {diagnosticIncidents[0]?.latestDiagnostic
                ? `${diagnosticIncidents[0].latestDiagnostic.headline} at ${formatDateTime(diagnosticIncidents[0].lastSeenAt)}`
                : session.snapshot.latestDiagnosticsBatch
                ? `${session.snapshot.latestDiagnosticsBatch.platform ?? "Unknown platform"} ${session.snapshot.latestDiagnosticsBatch.appVersion ?? "Unknown version"} at ${formatDateTime(session.snapshot.latestDiagnosticsBatch.receivedAt)}`
                : "No app diagnostics uploaded yet."}
            </p>
            {diagnosticIncidents[0]?.latestDiagnostic ? (
              <p className="admin-detail-note">
                {diagnosticIncidents[0].latestDiagnostic.platform ?? "unknown"} / {diagnosticIncidents[0].latestDiagnostic.appVersion ?? "unknown"} • {diagnosticIncidents[0].summary}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  );
}

function DiagnosticsFocusCard({
  incidents,
}: {
  incidents: IncidentCandidatesResult | null;
}) {
  const diagnosticIncidents = getDiagnosticIncidents(incidents);
  const areaMap = new Map<string, {
    label: string;
    incidentCount: number;
    occurrenceCount: number;
    latestSeenAt: string;
    criticalHighCount: number;
  }>();

  const platformSet = new Set<string>();
  const versionSet = new Set<string>();

  for (const incident of diagnosticIncidents) {
    const label = incident.latestDiagnostic?.area ?? "Runtime Diagnostics";
    const existing = areaMap.get(label);
    const platform =
      incident.latestDiagnostic?.platform
      ?? extractTagValue(incident.tags, "platform:");
    const version =
      incident.latestDiagnostic?.appVersion
      ?? extractTagValue(incident.tags, "version:");

    if (platform) {
      platformSet.add(platform);
    }

    if (version) {
      versionSet.add(version);
    }

    if (!existing) {
      areaMap.set(label, {
        label,
        incidentCount: 1,
        occurrenceCount: incident.occurrenceCount,
        latestSeenAt: incident.lastSeenAt,
        criticalHighCount: incident.severity === "critical" || incident.severity === "high" ? 1 : 0,
      });
      continue;
    }

    existing.incidentCount += 1;
    existing.occurrenceCount += incident.occurrenceCount;
    if (new Date(incident.lastSeenAt).getTime() > new Date(existing.latestSeenAt).getTime()) {
      existing.latestSeenAt = incident.lastSeenAt;
    }
    if (incident.severity === "critical" || incident.severity === "high") {
      existing.criticalHighCount += 1;
    }
  }

  const topAreas = Array.from(areaMap.values()).sort((a, b) => {
    if (b.criticalHighCount !== a.criticalHighCount) {
      return b.criticalHighCount - a.criticalHighCount;
    }

    if (b.occurrenceCount !== a.occurrenceCount) {
      return b.occurrenceCount - a.occurrenceCount;
    }

    return new Date(b.latestSeenAt).getTime() - new Date(a.latestSeenAt).getTime();
  }).slice(0, 4);

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Client Diagnostics Focus</div>
          <h2>Automatic mobile telemetry, grouped into fix-sized clusters</h2>
        </div>
      </div>

      <p className="admin-card-copy">
        Timeouts, response errors, failed client flows, and runtime faults are
        promoted here even when the mobile app recorded them as informational
        breadcrumbs. Raw event browsing stays below for forensics.
      </p>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span>Client clusters</span>
          <strong>{diagnosticIncidents.length}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Critical or high</span>
          <strong>{countIncidentsBySeverity(diagnosticIncidents, ["critical", "high"])}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Platforms seen</span>
          <strong>{platformSet.size || "—"}</strong>
        </div>
        <div className="admin-stat-card">
          <span>App versions seen</span>
          <strong>{versionSet.size || "—"}</strong>
        </div>
      </div>

      {topAreas.length ? (
        <div className="admin-list admin-summary-list">
          {topAreas.map((area) => (
            <div key={area.label} className="admin-summary-row">
              <div>
                <h3>{area.label}</h3>
                <p className="admin-detail-note">
                  {formatCountLabel(area.incidentCount, "cluster")} • {formatCountLabel(area.occurrenceCount, "event")} • last seen {formatDateTime(area.latestSeenAt)}
                </p>
              </div>
              {area.criticalHighCount > 0 ? (
                <span className="admin-pill admin-pill-severity-high">
                  {formatCountLabel(area.criticalHighCount, "critical/high issue")}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty-state">
          {incidents
            ? "No recurring client diagnostics clusters matched the current window."
            : "Grouping recurring client diagnostics clusters..."}
        </div>
      )}
    </section>
  );
}

function AlertsCard({ session }: { session: AdminSessionResponse }) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Alerts</div>
          <h2>Current operational watchlist</h2>
        </div>
        <span className="admin-card-meta">
          Snapshot at {formatDateTime(session.requestedAt)}
        </span>
      </div>

      {session.snapshot.activeAlerts.length === 0 ? (
        <p className="admin-card-copy">
          No active alerts are firing right now. The incident queue below is
          still useful for recurring failures or diagnostics clusters that have
          not tripped the alert thresholds yet.
        </p>
      ) : (
        <div className="admin-alert-list">
          {session.snapshot.activeAlerts.filter((alert) => alert.functionName !== "admin-dashboard").map((alert) => (
            <article key={alert.functionName} className="admin-alert-card">
              <div className="admin-alert-header">
                <h3>{alert.functionName}</h3>
                <div className="admin-pill-row">
                  {alert.highErrorRate ? <span className="admin-pill is-alert">High error rate</span> : null}
                  {alert.unusualVolume ? <span className="admin-pill is-alert">Volume spike</span> : null}
                  {alert.highSpend ? <span className="admin-pill is-alert">High spend</span> : null}
                </div>
              </div>
              <p>
                {alert.errorWindowErrors}/{alert.errorWindowRequests} recent
                requests failed, with an observed error rate of{" "}
                {Math.round(alert.errorRate * 100)}%.
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function IncidentCard({
  canManageIncidentState,
  copiedKey,
  incident,
  onCopy,
  onLookupCorrelation,
  onLookupRequest,
  onSave,
}: {
  canManageIncidentState: boolean;
  copiedKey: string | null;
  incident: DashboardIncident;
  onCopy: (incident: DashboardIncident) => void;
  onLookupCorrelation: (value: string | null) => void;
  onLookupRequest: (value: string) => void;
  onSave: (input: {
    incident: DashboardIncident;
    notes: string | null;
    severityOverride: IncidentSeverity | null;
    status: IncidentStatus;
  }) => Promise<boolean>;
}) {
  const baseStatus = incident.state?.status ?? incident.status;
  const baseSeverityOverride = incident.state?.severityOverride ?? null;
  const baseNotes = incident.state?.notes ?? "";
  const [status, setStatus] = useState<IncidentStatus>(baseStatus);
  const [severityOverride, setSeverityOverride] = useState<"auto" | IncidentSeverity>(
    baseSeverityOverride ?? "auto",
  );
  const [notes, setNotes] = useState(baseNotes);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  useEffect(() => {
    setStatus(baseStatus);
    setSeverityOverride(baseSeverityOverride ?? "auto");
    setNotes(baseNotes);
    setSaveState("idle");
  }, [
    baseNotes,
    baseSeverityOverride,
    baseStatus,
    incident.incidentKey,
    incident.state?.updatedAt,
  ]);

  const trimmedNotes = notes.trim();
  const isDirty =
    status !== baseStatus ||
    (severityOverride === "auto" ? null : severityOverride) !== baseSeverityOverride ||
    trimmedNotes !== baseNotes.trim();

  const sampleFailure = incident.latestFailure;
  const sampleDiagnostic = incident.latestDiagnostic;

  async function handleSave() {
    if (!isDirty) {
      setSaveState("saved");
      return;
    }

    setSaveState("saving");
    const saved = await onSave({
      incident,
      status,
      severityOverride: severityOverride === "auto" ? null : severityOverride,
      notes: trimmedNotes || null,
    });
    setSaveState(saved ? "saved" : "failed");
  }

  return (
    <article className="admin-alert-card admin-incident-card">
      <div className="admin-alert-header">
        <div>
          <h3>{incident.title}</h3>
          <p className="admin-detail-note">
            {formatSourceLabel(incident.source)} • {incident.occurrenceCount} hit
            {incident.occurrenceCount === 1 ? "" : "s"} in window • last seen{" "}
            {formatDateTime(incident.lastSeenAt)}
          </p>
        </div>
        <div className="admin-pill-row">
          <span className={`admin-pill admin-pill-severity-${incident.severity}`}>
            {formatSeverityLabel(incident.severity)}
          </span>
          <span className="admin-pill">{status}</span>
          {incident.hasFreshActivity ? (
            <span className="admin-pill is-alert">Fresh activity after resolution</span>
          ) : null}
        </div>
      </div>

      <p>{incident.summary}</p>
      <div className="admin-detail-stack">
        <div>
          <h3>Why this is grouped</h3>
          <p className="admin-detail-note">{incident.severityReason}</p>
        </div>
        <div className="admin-kv-grid">
          <span>First seen: {formatDateTime(incident.firstSeenAt)}</span>
          <span>Last seen: {formatDateTime(incident.lastSeenAt)}</span>
          {sampleFailure ? (
            <span>Latest request: {sampleFailure.requestId}</span>
          ) : sampleDiagnostic ? (
            <span>Latest event: {sampleDiagnostic.eventId ?? sampleDiagnostic.id}</span>
          ) : null}
          {sampleDiagnostic ? (
            <span>
              Platform/version: {sampleDiagnostic.platform ?? "unknown"} / {sampleDiagnostic.appVersion ?? "unknown"}
            </span>
          ) : null}
        </div>
        {incident.tags.length > 0 ? (
          <div className="admin-pill-row">
            {incident.tags.slice(0, 6).map((tag) => (
              <span key={`${incident.incidentKey}:${tag}`} className="admin-pill">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {canManageIncidentState ? (
        <div className="admin-incident-editor">
          <div className="admin-toolbar">
            <label className="field admin-inline-field">
              <span className="admin-input-label">Status</span>
              <select
                className="field-input field-select"
                value={status}
                onChange={(event) => setStatus(event.target.value as IncidentStatus)}
              >
                {INCIDENT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field admin-inline-field">
              <span className="admin-input-label">Severity override</span>
              <select
                className="field-input field-select"
                value={severityOverride}
                onChange={(event) =>
                  setSeverityOverride(event.target.value as "auto" | IncidentSeverity)}
              >
                {INCIDENT_SEVERITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span className="admin-input-label">Investigator notes</span>
            <textarea
              className="field-input admin-textarea"
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Capture what you learned, a likely cause, or the next step."
              value={notes}
            />
          </label>
          <div className="admin-item-actions">
            <button
              className="button button-secondary"
              disabled={!isDirty || saveState === "saving"}
              onClick={() => {
                void handleSave();
              }}
            >
              {saveState === "saving" ? "Saving..." : "Save Incident State"}
            </button>
            <span className="admin-save-state">
              {saveState === "saved"
                ? `Saved${incident.state?.updatedAt ? ` • last update ${formatDateTime(incident.state.updatedAt)}` : ""}`
                : saveState === "failed"
                  ? "Could not save this incident state."
                  : incident.state?.updatedAt
                    ? `Last updated ${formatDateTime(incident.state.updatedAt)}`
                    : "No saved state yet."}
            </span>
          </div>
        </div>
      ) : null}

      <div className="admin-item-actions">
        {sampleFailure ? (
          <button
            className="button button-secondary"
            onClick={() => onLookupRequest(sampleFailure.requestId)}
          >
            Lookup Request
          </button>
        ) : null}
        {sampleFailure?.correlationId ? (
          <button
            className="button button-secondary"
            onClick={() => onLookupCorrelation(sampleFailure.correlationId)}
          >
            Lookup Correlation
          </button>
        ) : null}
        <button
          className="button button-primary"
          onClick={() => onCopy(incident)}
        >
          {copiedKey === `incident:${incident.incidentKey}` ? "Copied" : "Copy Incident Brief"}
        </button>
      </div>
    </article>
  );
}

function IncidentSection({
  canManageIncidentState,
  copiedKey,
  incidents,
  hours,
  includeResolved,
  loading,
  onCopy,
  onHoursChange,
  onIncludeResolvedChange,
  onLookupCorrelation,
  onLookupRequest,
  onRefresh,
  onSave,
  onSourceChange,
  source,
}: {
  canManageIncidentState: boolean;
  copiedKey: string | null;
  hours: string;
  includeResolved: boolean;
  incidents: IncidentCandidatesResult | null;
  loading: boolean;
  onCopy: (incident: DashboardIncident) => void;
  onHoursChange: (value: string) => void;
  onIncludeResolvedChange: (value: boolean) => void;
  onLookupCorrelation: (value: string | null) => void;
  onLookupRequest: (value: string) => void;
  onRefresh: () => void;
  onSave: (input: {
    incident: DashboardIncident;
    notes: string | null;
    severityOverride: IncidentSeverity | null;
    status: IncidentStatus;
  }) => Promise<boolean>;
  onSourceChange: (value: IncidentSourceFilter) => void;
  source: IncidentSourceFilter;
}) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Incident Queue</div>
          <h2>Recurring issues grouped for triage instead of raw event-by-event review</h2>
        </div>
        <button className="button button-secondary" onClick={onRefresh}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <p className="admin-card-copy">
        This queue merges repeated backend failures and uploaded diagnostics into
        issue candidates, so you can mark status, save context, and paste a
        cleaner brief into Codex when it is time to fix the problem.
      </p>

      <div className="admin-toolbar">
        <label className="field">
          <span className="admin-input-label">Window</span>
          <select
            className="field-input field-select"
            value={hours}
            onChange={(event) => onHoursChange(event.target.value)}
          >
            <option value="24">Last 24 hours</option>
            <option value="72">Last 72 hours</option>
            <option value="168">Last 7 days</option>
          </select>
        </label>

        <label className="field">
          <span className="admin-input-label">Source</span>
          <select
            className="field-input field-select"
            value={source}
            onChange={(event) => onSourceChange(event.target.value as IncidentSourceFilter)}
          >
            <option value="all">All sources</option>
            <option value="edge_function">Edge functions</option>
            <option value="diagnostic">App diagnostics</option>
          </select>
        </label>

        <label className="admin-checkbox">
          <input
            checked={includeResolved}
            onChange={(event) => onIncludeResolvedChange(event.target.checked)}
            type="checkbox"
          />
          <span>Include resolved</span>
        </label>
      </div>

      <div className="admin-alert-list">
        {incidents?.incidents.length ? (
          [...incidents.incidents]
            .filter((incident) => !incident.incidentKey.includes("admin-dashboard"))
            .map((incident) => (
            <IncidentCard
              key={incident.incidentKey}
              canManageIncidentState={canManageIncidentState}
              copiedKey={copiedKey}
              incident={incident}
              onCopy={onCopy}
              onLookupCorrelation={onLookupCorrelation}
              onLookupRequest={onLookupRequest}
              onSave={onSave}
            />
          ))
        ) : (
          <div className="admin-empty-state">
            {loading
              ? "Grouping the latest incident candidates..."
              : "No recurring incidents matched the selected filters."}
          </div>
        )}
      </div>
    </section>
  );
}

function FailureSection({
  copiedKey,
  failures,
  functionFilter,
  functionOptions,
  hours,
  loading,
  onCopy,
  onFunctionFilterChange,
  onLookupCorrelation,
  onLookupRequest,
  onRefresh,
  onHoursChange,
}: {
  copiedKey: string | null;
  failures: RecentFailuresResult | null;
  functionFilter: string;
  functionOptions: string[];
  hours: string;
  loading: boolean;
  onCopy: (failure: DashboardFailureRecord) => void;
  onFunctionFilterChange: (value: string) => void;
  onLookupCorrelation: (value: string | null) => void;
  onLookupRequest: (value: string) => void;
  onRefresh: () => void;
  onHoursChange: (value: string) => void;
}) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Failures</div>
          <h2>Recent edge-function failures</h2>
        </div>
        <button className="button button-secondary" onClick={onRefresh}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="admin-toolbar">
        <label className="field">
          <span className="admin-input-label">Window</span>
          <select
            className="field-input field-select"
            value={hours}
            onChange={(event) => onHoursChange(event.target.value)}
          >
            <option value="24">Last 24 hours</option>
            <option value="72">Last 72 hours</option>
            <option value="168">Last 7 days</option>
          </select>
        </label>

        <label className="field">
          <span className="admin-input-label">Function</span>
          <select
            className="field-input field-select"
            value={functionFilter}
            onChange={(event) => onFunctionFilterChange(event.target.value)}
          >
            <option value="all">All functions</option>
            {functionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-alert-list">
        {failures?.failures.length ? (
          failures.failures.filter((failure) => failure.functionName !== "admin-dashboard").map((failure) => (
            <article key={`${failure.requestId}:${failure.occurredAt}`} className="admin-alert-card">
              <div className="admin-alert-header">
                <div>
                  <h3>{failure.functionName}</h3>
                  <p className="admin-detail-note">
                    {formatDateTime(failure.occurredAt)} • status {failure.statusCode}
                  </p>
                </div>
                <div className="admin-pill-row">
                  <span className="admin-pill">{failure.requestId}</span>
                  {failure.errorCode ? <span className="admin-pill is-alert">{failure.errorCode}</span> : null}
                </div>
              </div>
              <p>{failure.errorMessage ?? "No error message recorded."}</p>
              {failure.correlationId ? (
                <p className="admin-detail-note">
                  Correlation id: {failure.correlationId}
                </p>
              ) : null}
              <div className="admin-item-actions">
                <button
                  className="button button-secondary"
                  onClick={() => onLookupRequest(failure.requestId)}
                >
                  Lookup Request
                </button>
                <button
                  className="button button-secondary"
                  disabled={!failure.correlationId}
                  onClick={() => onLookupCorrelation(failure.correlationId)}
                >
                  Lookup Correlation
                </button>
                <button
                  className="button button-primary"
                  onClick={() => onCopy(failure)}
                >
                  {copiedKey === `failure:${failure.requestId}` ? "Copied" : "Copy Context For Codex"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-empty-state">
            {loading
              ? "Loading recent failures..."
              : "No failures matched the selected filters."}
          </div>
        )}
      </div>
    </section>
  );
}

function DiagnosticsSection({
  copiedKey,
  diagnostics,
  fatalOnly,
  level,
  loading,
  onCopy,
  onFatalOnlyChange,
  onLevelChange,
  onPlatformChange,
  onRefresh,
  platform,
  platformOptions,
}: {
  copiedKey: string | null;
  diagnostics: DiagnosticsEventsResult | null;
  fatalOnly: boolean;
  level: string;
  loading: boolean;
  onCopy: (event: DashboardDiagnosticEvent) => void;
  onFatalOnlyChange: (value: boolean) => void;
  onLevelChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onRefresh: () => void;
  platform: string;
  platformOptions: string[];
}) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Raw Diagnostics</div>
          <h2>Recent uploaded mobile runtime events</h2>
        </div>
        <button className="button button-secondary" onClick={onRefresh}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <p className="admin-card-copy">
        Use this only after the grouped incident queue and client diagnostics
        focus cards above. This feed is the raw event stream for confirming the
        exact message, scope, stack, and upload context.
      </p>

      <div className="admin-toolbar">
        <label className="field">
          <span className="admin-input-label">Level</span>
          <select
            className="field-input field-select"
            value={level}
            onChange={(event) => onLevelChange(event.target.value)}
          >
            <option value="all">All levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
          </select>
        </label>

        <label className="field">
          <span className="admin-input-label">Platform</span>
          <select
            className="field-input field-select"
            value={platform}
            onChange={(event) => onPlatformChange(event.target.value)}
          >
            <option value="all">All platforms</option>
            {platformOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-checkbox">
          <input
            checked={fatalOnly}
            onChange={(event) => onFatalOnlyChange(event.target.checked)}
            type="checkbox"
          />
          <span>Fatal only</span>
        </label>
      </div>

      <div className="admin-alert-list">
        {diagnostics?.events.length ? (
          diagnostics.events.map((event) => (
            <article key={event.id} className="admin-alert-card">
              <div className="admin-alert-header">
                <div>
                  <h3>{event.headline}</h3>
                  <p className="admin-detail-note">
                    {event.area} • {formatDateTime(event.occurredAt ?? event.ingestedAt)} • {event.platform ?? "unknown"} • {event.appVersion ?? "unknown"}
                  </p>
                </div>
                <div className="admin-pill-row">
                  <span className="admin-pill">{event.level}</span>
                  <span className={`admin-pill admin-pill-severity-${event.semanticSeverity}`}>
                    {formatSeverityLabel(event.semanticSeverity)}
                  </span>
                  <span className="admin-pill">{event.signalType.replace(/_/g, " ")}</span>
                  {event.isFatal ? <span className="admin-pill is-alert">Fatal</span> : null}
                </div>
              </div>
              <p>{event.message}</p>
              <div className="admin-kv-grid">
                <span>Scope: {event.scope}</span>
                <span>Error name: {event.errorName ?? "Unavailable"}</span>
                <span>Error code: {event.errorCode ?? "Unavailable"}</span>
                <span>Status: {event.statusCode ?? "Unavailable"}</span>
              </div>
              <div className="admin-item-actions">
                <button
                  className="button button-primary"
                  onClick={() => onCopy(event)}
                >
                  {copiedKey === `diagnostic:${event.id}` ? "Copied" : "Copy Context For Codex"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-empty-state">
            {loading
              ? "Loading diagnostics events..."
              : "No diagnostics events matched the selected filters."}
          </div>
        )}
      </div>
    </section>
  );
}

function LookupSection({
  copiedKey,
  loading,
  lookupQuery,
  lookupResult,
  onCopyResult,
  onLookupQueryChange,
  onSearch,
}: {
  copiedKey: string | null;
  loading: boolean;
  lookupQuery: string;
  lookupResult: RequestLookupResult | null;
  onCopyResult: () => void;
  onLookupQueryChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="eyebrow">Lookup</div>
          <h2>Request or correlation id search</h2>
        </div>
      </div>

      <div className="admin-search-row">
        <label className="field admin-search-field">
          <span className="admin-input-label">Exact request id or correlation id</span>
          <input
            className="field-input"
            onChange={(event) => onLookupQueryChange(event.target.value)}
            placeholder="Paste request_id or correlation_id"
            type="text"
            value={lookupQuery}
          />
        </label>
        <button className="button button-primary" onClick={onSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          className="button button-secondary"
          disabled={!lookupResult}
          onClick={onCopyResult}
        >
          {copiedKey === "lookup" ? "Copied" : "Copy Lookup Context"}
        </button>
      </div>

      <div className="admin-alert-list">
        {lookupResult ? (
          lookupResult.matches.length > 0 ? (
            lookupResult.matches.map((match) => (
              <article key={`${match.requestId}:${match.occurredAt}`} className="admin-alert-card">
                <div className="admin-alert-header">
                  <div>
                    <h3>{match.functionName}</h3>
                    <p className="admin-detail-note">
                      {formatDateTime(match.occurredAt)} • status {match.statusCode}
                    </p>
                  </div>
                  <div className="admin-pill-row">
                    <span className="admin-pill">{match.requestId}</span>
                    {match.correlationId ? <span className="admin-pill">{match.correlationId}</span> : null}
                  </div>
                </div>
                <p>{match.errorMessage ?? "No error message recorded."}</p>
              </article>
            ))
          ) : (
            <div className="admin-empty-state">
              No invocation matched `"{lookupResult.query}"`.
            </div>
          )
        ) : (
          <div className="admin-empty-state">
            Search by an exact request id or correlation id to pull matching invocations.
          </div>
        )}
      </div>
    </section>
  );
}

function AdminAccessPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [sessionState, setSessionState] = useState<SessionState>({
    status: "signed-out",
  });
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [failuresLoading, setFailuresLoading] = useState(false);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const [incidents, setIncidents] = useState<IncidentCandidatesResult | null>(null);
  const [recentFailures, setRecentFailures] = useState<RecentFailuresResult | null>(null);
  const [diagnosticsEvents, setDiagnosticsEvents] = useState<DiagnosticsEventsResult | null>(null);
  const [lookupResult, setLookupResult] = useState<RequestLookupResult | null>(null);

  const [incidentHours, setIncidentHours] = useState("72");
  const [incidentSource, setIncidentSource] = useState<IncidentSourceFilter>("all");
  const [includeResolvedIncidents, setIncludeResolvedIncidents] = useState(false);
  const [incidentRefreshToken, setIncidentRefreshToken] = useState(0);

  const [failureHours, setFailureHours] = useState("24");
  const [failureFunctionFilter, setFailureFunctionFilter] = useState("all");
  const [failureRefreshToken, setFailureRefreshToken] = useState(0);

  const [diagnosticsLevel, setDiagnosticsLevel] = useState("warning");
  const [diagnosticsPlatform, setDiagnosticsPlatform] = useState("all");
  const [fatalOnly, setFatalOnly] = useState(false);
  const [diagnosticsRefreshToken, setDiagnosticsRefreshToken] = useState(0);

  const [lookupQuery, setLookupQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!isLoaded || !isSignedIn) {
      setSessionState({ status: "signed-out" });
      return () => {
        cancelled = true;
      };
    }

    setSessionState({ status: "loading" });

    void (async () => {
      try {
        const accessToken = await getToken();
        if (!accessToken) {
          throw new AdminSessionError("Clerk session token is not available.", 401);
        }

        const data = await loadAdminSession(accessToken);
        if (!cancelled) {
          setSessionState({ status: "ready", accessToken, data });
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof AdminSessionError && error.status === 403) {
          setSessionState({
            status: "forbidden",
            message: error.message,
          });
          return;
        }

        setSessionState({
          status: "error",
          message: error instanceof Error
            ? error.message
            : "Unknown admin session error.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (sessionState.status !== "ready") {
      return;
    }

    setDashboardError(null);

    void (async () => {
      setIncidentsLoading(true);
      try {
        const result = await loadIncidentCandidates(sessionState.accessToken, {
          hours: Number(incidentHours),
          includeResolved: includeResolvedIncidents,
          source: incidentSource,
        });
        setIncidents(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load incidents.";
        setDashboardError(message);
      } finally {
        setIncidentsLoading(false);
      }
    })();
  }, [incidentHours, incidentRefreshToken, incidentSource, includeResolvedIncidents, sessionState]);

  useEffect(() => {
    if (sessionState.status !== "ready") {
      return;
    }

    setDashboardError(null);

    void (async () => {
      setFailuresLoading(true);
      try {
        const result = await loadRecentFailures(sessionState.accessToken, {
          functionName: failureFunctionFilter === "all" ? null : failureFunctionFilter,
          hours: Number(failureHours),
        });
        setRecentFailures(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load recent failures.";
        setDashboardError(message);
      } finally {
        setFailuresLoading(false);
      }
    })();
  }, [failureFunctionFilter, failureHours, failureRefreshToken, sessionState]);

  useEffect(() => {
    if (sessionState.status !== "ready") {
      return;
    }

    setDashboardError(null);

    void (async () => {
      setDiagnosticsLoading(true);
      try {
        const result = await loadDiagnosticsEvents(sessionState.accessToken, {
          fatalOnly,
          level: diagnosticsLevel === "all"
            ? null
            : diagnosticsLevel as "info" | "warning" | "error",
          platform: diagnosticsPlatform === "all" ? null : diagnosticsPlatform,
        });
        setDiagnosticsEvents(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load diagnostics events.";
        setDashboardError(message);
      } finally {
        setDiagnosticsLoading(false);
      }
    })();
  }, [diagnosticsLevel, diagnosticsPlatform, diagnosticsRefreshToken, fatalOnly, sessionState]);

  const signedInEmail = user?.primaryEmailAddress?.emailAddress ?? null;

  const functionOptions = recentFailures
    ? Array.from(
      new Set([
        ...recentFailures.failures.map((failure) => failure.functionName),
        ...(failureFunctionFilter === "all" ? [] : [failureFunctionFilter]),
      ]),
    ).filter((name) => name !== "admin-dashboard").sort()
    : [];

  const platformOptions = diagnosticsEvents
    ? Array.from(
      new Set(
        [
          ...diagnosticsEvents.events
            .map((event) => event.platform)
            .filter((value): value is string => Boolean(value)),
          ...(diagnosticsPlatform === "all" ? [] : [diagnosticsPlatform]),
        ],
      ),
    ).sort()
    : [];

  async function handleCopySnapshot() {
    if (sessionState.status !== "ready") {
      setCopyState("failed");
      return;
    }

    const copied = await copyText(
      buildSnapshotMarkdown(sessionState.data, signedInEmail),
    ).catch(() => false);
    setCopyState(copied ? "copied" : "failed");
  }

  async function handleCopyIncident(incident: DashboardIncident) {
    if (sessionState.status !== "ready") {
      setCopiedKey(null);
      return;
    }

    const copied = await copyText(
      buildIncidentContextMarkdown(incident, sessionState.data),
    ).catch(() => false);

    setCopiedKey(copied ? `incident:${incident.incidentKey}` : null);
  }

  async function handleCopyFailure(failure: DashboardFailureRecord) {
    if (sessionState.status !== "ready") {
      setCopiedKey(null);
      return;
    }

    const copied = await copyText(
      buildFailureContextMarkdown(failure, sessionState.data),
    ).catch(() => false);

    setCopiedKey(copied ? `failure:${failure.requestId}` : null);
  }

  async function handleCopyDiagnostic(event: DashboardDiagnosticEvent) {
    if (sessionState.status !== "ready") {
      setCopiedKey(null);
      return;
    }

    const copied = await copyText(
      buildDiagnosticsContextMarkdown(event, sessionState.data),
    ).catch(() => false);

    setCopiedKey(copied ? `diagnostic:${event.id}` : null);
  }

  async function runLookup(queryValue: string) {
    if (sessionState.status !== "ready") {
      return;
    }

    const trimmed = queryValue.trim();
    if (!trimmed) {
      setLookupResult(null);
      return;
    }

    setDashboardError(null);
    setLookupLoading(true);

    try {
      const result = await lookupRequest(sessionState.accessToken, trimmed);
      setLookupResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to lookup request.";
      setDashboardError(message);
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleCopyLookup() {
    if (sessionState.status !== "ready" || !lookupResult) {
      return;
    }

    const copied = await copyText(
      buildLookupContextMarkdown(lookupResult, sessionState.data),
    ).catch(() => false);

    setCopiedKey(copied ? "lookup" : null);
  }

  async function handleSaveIncidentState(input: {
    incident: DashboardIncident;
    notes: string | null;
    severityOverride: IncidentSeverity | null;
    status: IncidentStatus;
  }) {
    if (
      sessionState.status !== "ready" ||
      !sessionState.data.capabilities.canManageIncidentState
    ) {
      return false;
    }

    setDashboardError(null);

    try {
      await saveIncidentState(sessionState.accessToken, {
        incidentKey: input.incident.incidentKey,
        source: input.incident.source,
        title: input.incident.title,
        status: input.status,
        severityOverride: input.severityOverride,
        notes: input.notes,
      });
      setIncidentRefreshToken((current) => current + 1);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save incident state.";
      setDashboardError(message);
      return false;
    }
  }

  if (!isSignedIn) {
    return <AdminSignedOutCard />;
  }

  if (sessionState.status === "loading") {
    return (
      <section className="admin-grid">
        <article className="admin-card admin-card-hero">
          <div className="eyebrow">Loading</div>
          <h2>Verifying admin access and pulling the first observability snapshot.</h2>
          <p className="admin-card-copy">
            Clerk authentication is ready. The backend is now checking the
            allowlist and collecting alert, incident, failure, and diagnostics summaries.
          </p>
        </article>
      </section>
    );
  }

  if (sessionState.status === "forbidden") {
    return (
      <AdminForbiddenCard
        email={signedInEmail}
        message={sessionState.message}
        userId={user?.id ?? null}
      />
    );
  }

  if (sessionState.status === "error") {
    return (
      <section className="admin-grid">
        <article className="admin-card admin-card-hero">
          <div className="eyebrow">Admin session error</div>
          <h2>The secure foundation is in place, but the bootstrap call failed.</h2>
          <p className="admin-card-copy">{sessionState.message}</p>
        </article>
      </section>
    );
  }

  if (sessionState.status !== "ready") {
    return null;
  }

  return (
    <>
      <AdminStatusCard
        copyState={copyState}
        onCopySnapshot={handleCopySnapshot}
        session={sessionState.data}
        signedInEmail={signedInEmail}
      />

      {dashboardError ? (
        <section className="admin-card admin-card-error">
          <div className="eyebrow">Dashboard error</div>
          <p className="admin-card-copy">{dashboardError}</p>
        </section>
      ) : null}

      <OverviewCards incidents={incidents} session={sessionState.data} />
      <DiagnosticsFocusCard incidents={incidents} />
      <AlertsCard session={sessionState.data} />
      <IncidentSection
        canManageIncidentState={sessionState.data.capabilities.canManageIncidentState}
        copiedKey={copiedKey}
        hours={incidentHours}
        includeResolved={includeResolvedIncidents}
        incidents={incidents}
        loading={incidentsLoading}
        onCopy={handleCopyIncident}
        onHoursChange={setIncidentHours}
        onIncludeResolvedChange={setIncludeResolvedIncidents}
        onLookupCorrelation={(value) => {
          if (!value) {
            return;
          }

          setLookupQuery(value);
          void runLookup(value);
        }}
        onLookupRequest={(value) => {
          setLookupQuery(value);
          void runLookup(value);
        }}
        onRefresh={() => {
          setIncidentRefreshToken((current) => current + 1);
        }}
        onSave={handleSaveIncidentState}
        onSourceChange={setIncidentSource}
        source={incidentSource}
      />
      <FailureSection
        copiedKey={copiedKey}
        failures={recentFailures}
        functionFilter={failureFunctionFilter}
        functionOptions={functionOptions}
        hours={failureHours}
        loading={failuresLoading}
        onCopy={handleCopyFailure}
        onFunctionFilterChange={setFailureFunctionFilter}
        onHoursChange={setFailureHours}
        onLookupCorrelation={(value) => {
          if (!value) {
            return;
          }

          setLookupQuery(value);
          void runLookup(value);
        }}
        onLookupRequest={(value) => {
          setLookupQuery(value);
          void runLookup(value);
        }}
        onRefresh={() => {
          setFailureRefreshToken((current) => current + 1);
        }}
      />
      <DiagnosticsSection
        copiedKey={copiedKey}
        diagnostics={diagnosticsEvents}
        fatalOnly={fatalOnly}
        level={diagnosticsLevel}
        loading={diagnosticsLoading}
        onCopy={handleCopyDiagnostic}
        onFatalOnlyChange={setFatalOnly}
        onLevelChange={setDiagnosticsLevel}
        onPlatformChange={setDiagnosticsPlatform}
        onRefresh={() => {
          setDiagnosticsRefreshToken((current) => current + 1);
        }}
        platform={diagnosticsPlatform}
        platformOptions={platformOptions}
      />
      <LookupSection
        copiedKey={copiedKey}
        loading={lookupLoading}
        lookupQuery={lookupQuery}
        lookupResult={lookupResult}
        onCopyResult={handleCopyLookup}
        onLookupQueryChange={setLookupQuery}
        onSearch={() => {
          void runLookup(lookupQuery);
        }}
      />
    </>
  );
}

export function AdminPage() {
  return (
    <div className="admin-shell">
      <div className="site-backdrop site-backdrop-one" />
      <div className="site-backdrop site-backdrop-two" />

      <div className="container admin-shell-inner">
        <header className="admin-header">
          <a className="brand" href="../">
            <PlateMascot className="brand-mark" hideArms label="SnapFresh plate logo" />
            <div>
              <div className="brand-name" aria-label="SnapFresh">
                <span>Snap</span>
                <strong>Fresh</strong>
              </div>
              <div className="brand-tag">Internal Admin</div>
            </div>
          </a>
          <div className="admin-header-note">
            Built for fast production debugging, triage, and clean AI handoff context.
          </div>
        </header>

        <main className="admin-main">
          <section className="admin-intro">
            <div className="admin-intro-copy">
              <div className="eyebrow">Operational console</div>
              <h1>Start from grouped incidents, then drill down only as far as the fix requires.</h1>
              <p className="admin-intro-text">
                Phase 3 turns the admin route into a triage-first workflow:
                recurring failures and diagnostics are clustered into issues you
                can track, annotate, and paste straight into Codex before
                dropping into raw requests or uploaded device logs.
              </p>
            </div>
            <div className="admin-intro-panel">
              <div className="admin-pill-row">
                <span className="admin-pill">Incident queue</span>
                <span className="admin-pill">Saved notes + status</span>
                <span className="admin-pill">Copy-ready issue briefs</span>
              </div>
            </div>
          </section>

          <ClerkLoading>
            <section className="admin-grid">
              <article className="admin-card admin-card-hero">
                <div className="eyebrow">Clerk loading</div>
                <h2>Starting the admin shell.</h2>
                <p className="admin-card-copy">
                  Waiting for Clerk to initialize before we decide whether to
                  prompt for sign-in or query the protected admin bootstrap
                  endpoint.
                </p>
              </article>
            </section>
          </ClerkLoading>

          <ClerkLoaded>
            <ClerkDegraded>
              <section className="admin-grid">
                <article className="admin-card">
                  <div className="eyebrow">Clerk degraded</div>
                  <p className="admin-card-copy">
                    Clerk is available in a degraded state. Sign-in may still
                    work, but treat this page cautiously until the auth layer is
                    healthy again.
                  </p>
                </article>
              </section>
            </ClerkDegraded>

            <AdminAccessPanel />
          </ClerkLoaded>

          <ClerkFailed>
            <section className="admin-grid">
              <article className="admin-card admin-card-hero">
                <div className="eyebrow">Clerk failed</div>
                <h2>Admin auth could not initialize.</h2>
                <p className="admin-card-copy">
                  Check the Clerk publishable key and domain settings for the
                  website environment before relying on this route.
                </p>
              </article>
            </section>
          </ClerkFailed>
        </main>
      </div>
    </div>
  );
}
