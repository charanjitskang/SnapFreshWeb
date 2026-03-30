type AnalyticsPrimitive = string | number | boolean | null;
type AnalyticsProperties = Record<string, AnalyticsPrimitive>;

type QueuedEvent = {
  eventName: string;
  properties?: AnalyticsProperties;
};

type PostHogClient = {
  init?: (apiKey: string, options?: Record<string, unknown>) => void;
  capture?: (eventName: string, properties?: AnalyticsProperties) => void;
};

declare global {
  interface Window {
    posthog?: PostHogClient;
  }
}

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com';
const queuedEvents: QueuedEvent[] = [];

let isInitialized = false;
let isDisabled = false;
let isReady = false;
let hasTrackedWaitlistSectionView = false;
let hasTrackedWaitlistFormStart = false;

function getPostHogConfig() {
  const apiKey = (
    import.meta.env.VITE_POSTHOG_API_KEY ??
    import.meta.env.EXPO_PUBLIC_POSTHOG_API_KEY
  )?.trim();
  const host = (
    import.meta.env.VITE_POSTHOG_HOST ??
    import.meta.env.EXPO_PUBLIC_POSTHOG_HOST
  )?.trim() || DEFAULT_POSTHOG_HOST;

  return {
    apiKey,
    host: host.replace(/\/+$/, '')
  };
}

function flushQueuedEvents() {
  if (!isReady) {
    return;
  }

  const posthog = window.posthog;

  if (!posthog?.capture) {
    return;
  }

  while (queuedEvents.length > 0) {
    const nextEvent = queuedEvents.shift();

    if (!nextEvent) {
      return;
    }

    posthog.capture(nextEvent.eventName, nextEvent.properties);
  }
}

export function initAnalytics() {
  if (typeof window === 'undefined' || isInitialized || isDisabled) {
    return;
  }

  const { apiKey, host } = getPostHogConfig();

  if (!apiKey) {
    isDisabled = true;
    return;
  }

  isInitialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `${host}/static/array.js`;
  script.onload = () => {
    const posthog = window.posthog;

    if (!posthog?.init) {
      isDisabled = true;
      return;
    }

    posthog.init(apiKey, {
      api_host: host,
      autocapture: false,
      capture_pageview: true,
      loaded: () => {
        isReady = true;
        flushQueuedEvents();
      }
    });
  };
  script.onerror = () => {
    isDisabled = true;
    queuedEvents.length = 0;
  };

  document.head.append(script);
}

export function trackEvent(eventName: string, properties?: AnalyticsProperties) {
  if (typeof window === 'undefined' || isDisabled) {
    return;
  }

  if (!isInitialized) {
    initAnalytics();
  }

  const posthog = window.posthog;

  if (isReady && posthog?.capture) {
    posthog.capture(eventName, properties);
    return;
  }

  queuedEvents.push({ eventName, properties });
}

export function trackWaitlistCtaClick(placement: string) {
  trackEvent('waitlist_cta_clicked', { placement });
}

export function trackWaitlistSectionView() {
  if (hasTrackedWaitlistSectionView) {
    return;
  }

  hasTrackedWaitlistSectionView = true;
  trackEvent('waitlist_section_viewed');
}

export function trackWaitlistFormStart() {
  if (hasTrackedWaitlistFormStart) {
    return;
  }

  hasTrackedWaitlistFormStart = true;
  trackEvent('waitlist_form_started');
}

export function trackWaitlistValidationError(reason: string) {
  trackEvent('waitlist_validation_failed', { reason });
}

export function trackWaitlistSubmitted(submissionMode: string) {
  trackEvent('waitlist_submitted', {
    submission_mode: submissionMode,
    source: 'marketing-site'
  });
}

export function trackWaitlistSubmissionFailed(failureStage: string) {
  trackEvent('waitlist_submission_failed', {
    failure_stage: failureStage
  });
}

export function trackSupportContactClick(location: string) {
  trackEvent('support_contact_clicked', { location });
}
