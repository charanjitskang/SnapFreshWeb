import { type FormEvent, useState } from 'react';
import { submitWaitlist } from '../lib/waitlist';

type FormState = {
  email: string;
};

const initialFormState: FormState = {
  email: ''
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
        message: 'Enter a valid email address to join the waitlist.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ tone: 'idle', message: '' });

    try {
      const result = await submitWaitlist({
        email: form.email,
        firstName: '',
        goal: '',
        platform: ''
      });
      setForm(initialFormState);
      setStatus({
        tone: 'success',
        message:
          result.mode === 'local'
            ? 'Preview mode: your signup was saved locally. Add the waitlist env vars before deploying.'
            : "You're on the list. We'll send early access updates when invites open."
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
          <input
            className="field-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </label>
      </div>

      <button className="button button-primary waitlist-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving your spot...' : 'Join the waitlist'}
      </button>

      <p className="waitlist-privacy-note">
        By joining the waitlist, you agree to receive early access and launch updates from
        SnapFresh.
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
