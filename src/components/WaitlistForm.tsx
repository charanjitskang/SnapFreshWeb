import { type FormEvent, useState } from 'react';
import { submitWaitlist } from '../lib/waitlist';

type FormState = {
  email: string;
  firstName: string;
  goal: string;
  platform: string;
};

const initialFormState: FormState = {
  email: '',
  firstName: '',
  goal: 'Meal scoring',
  platform: 'iPhone'
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    tone: 'idle' | 'success' | 'error';
    message: string;
  }>({ tone: 'idle', message: '' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(form.email)) {
      setStatus({
        tone: 'error',
        message: 'Enter a valid email address to join the list.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ tone: 'idle', message: '' });

    try {
      const result = await submitWaitlist(form);
      setForm(initialFormState);
      setStatus({
        tone: 'success',
        message:
          result.mode === 'local'
            ? 'Preview mode: this signup was saved locally. Add waitlist env vars before deployment.'
            : 'You are on the list. We will send early access updates when invites open.'
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setStatus({
        tone: 'error',
        message
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="waitlist-form-card" onSubmit={handleSubmit}>
      <div className="waitlist-form-grid">
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="field-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </label>

        <label className="field">
          <span className="field-label">First name</span>
          <input
            className="field-input"
            type="text"
            name="firstName"
            autoComplete="given-name"
            placeholder="Optional"
            value={form.firstName}
            onChange={(event) =>
              setForm((current) => ({ ...current, firstName: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span className="field-label">What do you care about most?</span>
          <select
            className="field-input field-select"
            name="goal"
            value={form.goal}
            onChange={(event) =>
              setForm((current) => ({ ...current, goal: event.target.value }))
            }
          >
            <option>Meal scoring</option>
            <option>Macros and nutrition</option>
            <option>History and habit tracking</option>
            <option>Hydration and goals</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Preferred launch device</span>
          <select
            className="field-input field-select"
            name="platform"
            value={form.platform}
            onChange={(event) =>
              setForm((current) => ({ ...current, platform: event.target.value }))
            }
          >
            <option>iPhone</option>
            <option>Android</option>
            <option>Both</option>
          </select>
        </label>
      </div>

      <button className="button button-primary waitlist-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving your spot...' : 'Join the waitlist'}
      </button>

      <p className="waitlist-privacy-note">
        By joining, you agree to receive early access and launch updates from SnapFresh.
      </p>

      {status.message ? (
        <p
          className={status.tone === 'error' ? 'form-status is-error' : 'form-status is-success'}
          role={status.tone === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
