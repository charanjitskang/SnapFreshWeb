export type WaitlistSubmission = {
  name: string;
  email: string;
};

export type WaitlistMode = 'edge-function' | 'local';

export type WaitlistResult = {
  mode: WaitlistMode;
};

const LOCAL_STORAGE_KEY = 'snapfresh.waitlist.preview';
const PROD_WAITLIST_ENDPOINT =
  'https://rhaupemsfddxqigxjoil.supabase.co/functions/v1/register-waitlist';
const DEV_WAITLIST_PROXY_PATH = '/api/register-waitlist';

function createPayload(submission: WaitlistSubmission) {
  return {
    email: submission.email.trim().toLowerCase(),
    name: submission.name.trim(),
    first_name: submission.name.trim(),
    source: 'marketing-site',
    created_at: new Date().toISOString()
  };
}

function getWaitlistEndpoint() {
  const configuredEndpoint = import.meta.env.VITE_WAITLIST_ENDPOINT_URL?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  return import.meta.env.DEV ? DEV_WAITLIST_PROXY_PATH : PROD_WAITLIST_ENDPOINT;
}

async function extractErrorMessage(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = (await response.json()) as { error?: string; message?: string };
    return body.message || body.error || 'Waitlist request failed.';
  }

  const body = await response.text();
  return body || 'Waitlist request failed.';
}

async function submitToEdgeFunction(
  payload: ReturnType<typeof createPayload>
): Promise<WaitlistResult> {
  const endpoint = getWaitlistEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return { mode: 'edge-function' };
}

function submitLocally(payload: ReturnType<typeof createPayload>): WaitlistResult {
  const existingRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  const existing = existingRaw ? (JSON.parse(existingRaw) as typeof payload[]) : [];
  existing.push(payload);
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  return { mode: 'local' };
}

export async function submitWaitlist(submission: WaitlistSubmission): Promise<WaitlistResult> {
  const payload = createPayload(submission);

  if (import.meta.env.DEV && import.meta.env.VITE_WAITLIST_DISABLE_BACKEND === 'true') {
    return submitLocally(payload);
  }

  return submitToEdgeFunction(payload);
}
