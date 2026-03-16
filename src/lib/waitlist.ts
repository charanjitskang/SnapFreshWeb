export type WaitlistSubmission = {
  name: string;
  email: string;
};

export type WaitlistMode = 'endpoint' | 'supabase' | 'local';

export type WaitlistResult = {
  mode: WaitlistMode;
};

const LOCAL_STORAGE_KEY = 'snapfresh.waitlist.preview';

function createPayload(submission: WaitlistSubmission) {
  return {
    email: submission.email.trim().toLowerCase(),
    first_name: submission.name.trim(),
    source: 'marketing-site',
    created_at: new Date().toISOString()
  };
}

async function submitToEndpoint(payload: ReturnType<typeof createPayload>): Promise<WaitlistResult> {
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT_URL?.trim();

  if (!endpoint) {
    throw new Error('Waitlist endpoint is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Waitlist request failed.');
  }

  return { mode: 'endpoint' };
}

async function submitToSupabase(payload: ReturnType<typeof createPayload>): Promise<WaitlistResult> {
  const supabaseUrl =
    import.meta.env.VITE_WAITLIST_SUPABASE_URL?.trim() ??
    import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey =
    import.meta.env.VITE_WAITLIST_SUPABASE_ANON_KEY?.trim() ??
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  const table = import.meta.env.VITE_WAITLIST_TABLE?.trim() || 'waitlist_submissions';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase waitlist configuration is incomplete.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Supabase waitlist request failed.');
  }

  return { mode: 'supabase' };
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

  if (import.meta.env.VITE_WAITLIST_ENDPOINT_URL) {
    return submitToEndpoint(payload);
  }

  if (
    import.meta.env.VITE_WAITLIST_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL
  ) {
    return submitToSupabase(payload);
  }

  if (import.meta.env.DEV) {
    return submitLocally(payload);
  }

  throw new Error('Waitlist is not configured for this deployment yet.');
}
