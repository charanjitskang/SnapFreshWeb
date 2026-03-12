import type { CSSProperties, ReactNode } from 'react';
import { PlateMascot } from '../components/PlateMascot';
import { SiteLayout } from '../components/SiteLayout';
import { WaitlistForm } from '../components/WaitlistForm';
import {
  siteConfig,
  supportedLanguages,
  toPageHref,
  trustSignals,
  type SitePath
} from '../siteContent';

const appStoreCards = [
  {
    title: 'Privacy Policy',
    href: '/privacy/' as SitePath,
    body: 'Clear language around sign-in, images, local storage, and cloud-linked services.'
  },
  {
    title: 'Terms of Use',
    href: '/terms/' as SitePath,
    body: 'Expectations for AI estimates, premium features, and the product’s limits.'
  },
  {
    title: 'Support',
    href: '/support/' as SitePath,
    body: 'A public support destination for users, testers, and App Store review.'
  },
  {
    title: 'Data Deletion',
    href: '/data-deletion/' as SitePath,
    body: 'A dedicated route for account and data deletion requests.'
  }
];

const experienceSignals = [
  { value: 'Photo first', label: 'Camera or gallery meal capture' },
  { value: 'Score + macros', label: 'A calmer result screen after each scan' },
  { value: `${supportedLanguages.length} languages`, label: 'Localized settings already in the app' },
  { value: 'History + hydration', label: 'Daily context beyond a single meal' }
];

const storySteps = [
  {
    step: '01',
    title: 'Scan without friction',
    body: 'SnapFresh opens with the same light first move the app already uses: photo in, optional note, portion hint, then analyze.'
  },
  {
    step: '02',
    title: 'Read the signal quickly',
    body: 'Scores, detected ingredients, macros, and suggestions are arranged to feel editorial and legible instead of dense.'
  },
  {
    step: '03',
    title: 'Keep the streak visible',
    body: 'Saved meals, hydration, and premium dashboard layers help users see patterns and make better next decisions.'
  }
];

const launchBenefits = [
  'Priority access when preview invites open',
  'Launch notes and product updates',
  'A chance to shape premium features early'
];

function DeviceFrame({
  label,
  className,
  children
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={['device-frame', className].filter(Boolean).join(' ')}>
      <div className="device-top">
        <span>{label}</span>
        <span>9:41</span>
      </div>
      <div className="device-notch" />
      <div className="device-screen">{children}</div>
    </div>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const style = { '--score-angle': `${Math.round(score * 3.6)}deg` } as CSSProperties;

  return (
    <div className="mini-score-ring" style={style}>
      <div className="mini-score-ring-inner">
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function CapturePreview() {
  return (
    <DeviceFrame label="Capture" className="device-frame-hero">
      <div className="device-brand">
        <span>Snap</span>
        <strong>Fresh</strong>
      </div>
      <div className="scan-stage">
        <div className="scan-stage-chip">Camera or gallery</div>
        <PlateMascot className="scan-stage-plate" label="SnapFresh plate mascot" />
        <div className="scan-stage-chip is-bottom">Notes + portion</div>
      </div>
      <div className="device-note-card">
        <span className="device-note-label">Meal note</span>
        <p>Vegetable rice bowl with grilled chicken and yogurt sauce.</p>
      </div>
      <div className="segment-row">
        <span className="segment-pill is-active">Medium</span>
        <span className="segment-pill">High protein</span>
        <span className="segment-pill">Lunch</span>
      </div>
      <div className="device-action">Analyze meal</div>
    </DeviceFrame>
  );
}

function ResultsPreview() {
  return (
    <DeviceFrame label="Analysis">
      <div className="device-header-row">
        <div>
          <div className="screen-eyebrow">Lunch snapshot</div>
          <h3 className="device-title">Grain bowl</h3>
        </div>
        <span className="screen-chip">Saved</span>
      </div>

      <div className="results-summary">
        <ScoreRing score={84} label="Good" />
        <div className="results-copy">
          <div className="result-stat">
            <strong>612</strong>
            <span>kcal estimate</span>
          </div>
          <div className="result-stat">
            <strong>38g</strong>
            <span>protein</span>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-tile">
          <span>Carbs</span>
          <strong>54g</strong>
        </div>
        <div className="metric-tile">
          <span>Fat</span>
          <strong>21g</strong>
        </div>
        <div className="metric-tile">
          <span>Fiber</span>
          <strong>11g</strong>
        </div>
        <div className="metric-tile">
          <span>Items</span>
          <strong>5</strong>
        </div>
      </div>

      <div className="insight-stack">
        <div className="insight-card">Balanced protein coverage with room for more greens.</div>
        <div className="insight-card">Quality score and suggestions stay visible above the fold.</div>
      </div>
    </DeviceFrame>
  );
}

function DashboardPreview() {
  return (
    <DeviceFrame label="Dashboard">
      <div className="device-header-row">
        <div>
          <div className="screen-eyebrow">This week</div>
          <h3 className="device-title">Your rhythm</h3>
        </div>
        <span className="screen-chip is-accent">Premium</span>
      </div>

      <div className="dashboard-summary-card">
        <ScoreRing score={78} label="Strong" />
        <div className="dashboard-summary-copy">
          <strong>78 / 100</strong>
          <span>Average food quality</span>
          <p>Built from saved meal scans and trend summaries.</p>
        </div>
      </div>

      <div className="macro-strip">
        <div className="macro-column">
          <span>Protein</span>
          <div className="macro-bar">
            <div className="macro-fill protein" />
          </div>
        </div>
        <div className="macro-column">
          <span>Carbs</span>
          <div className="macro-bar">
            <div className="macro-fill carbs" />
          </div>
        </div>
        <div className="macro-column">
          <span>Hydration</span>
          <div className="water-row">
            <span className="water-bottle is-full" />
            <span className="water-bottle is-full" />
            <span className="water-bottle is-mid" />
            <span className="water-bottle" />
          </div>
        </div>
      </div>
    </DeviceFrame>
  );
}

function HistoryPreview() {
  return (
    <DeviceFrame label="History">
      <div className="device-header-row">
        <div>
          <div className="screen-eyebrow">Saved meals</div>
          <h3 className="device-title">Today</h3>
        </div>
        <span className="screen-chip">3 scans</span>
      </div>

      <div className="history-stack">
        {[
          ['Greek yogurt bowl', '8:12 AM', '88'],
          ['Chicken grain bowl', '1:08 PM', '84'],
          ['Salmon plate', '7:19 PM', '91']
        ].map(([meal, time, score]) => (
          <div key={meal} className="history-item">
            <div className="history-thumb" />
            <div className="history-copy">
              <strong>{meal}</strong>
              <span>{time}</span>
            </div>
            <div className="history-score">{score}</div>
          </div>
        ))}
      </div>
    </DeviceFrame>
  );
}

export function HomePage() {
  return (
    <SiteLayout activePath="/">
      <section className="landing-hero">
        <div className="container landing-grid">
          <div className="hero-copy">
            <div className="eyebrow">Built from the live SnapFresh app flow</div>
            <h1>A premium way to understand what is on your plate.</h1>
            <p className="hero-lede">
              SnapFresh turns a meal photo into a clear nutrition readout, a quality score, and a
              visible habit trail across history, hydration, and goals. The experience starts light
              and stays calm.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#waitlist">
                Join the waitlist
              </a>
              <a className="button button-secondary" href="#preview">
                See the experience
              </a>
            </div>
            <div className="hero-meta">
              <span>Meal scans from camera or library</span>
              <span>Nutrition score, insights, and suggestions</span>
              <span>History, hydration, and goal context</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <CapturePreview />
            <div className="floating-insight-card">
              <div className="floating-insight-label">Live app behavior</div>
              <strong>Photo to score to trend</strong>
              <span>No calorie spreadsheet required</span>
            </div>
            <div className="floating-mini-card">
              <span>Hydration streak</span>
              <strong>1.8L today</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-band">
        <div className="container signal-grid">
          {experienceSignals.map((signal) => (
            <article key={signal.label} className="signal-card">
              <div className="signal-value">{signal.value}</div>
              <p className="signal-copy">{signal.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block story-block" id="preview">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">The product story</div>
            <h2>Designed around the three moments users actually care about.</h2>
            <p className="section-copy">
              Capture quickly, understand the meal without noise, then keep the pattern visible
              over time. The landing page mirrors that same sequence.
            </p>
          </div>

          <div className="story-grid">
            {storySteps.map((item) => (
              <article key={item.step} className="story-card">
                <span className="story-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block showcase-block">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Product previews</div>
            <h2>Polished placeholders shaped by the app screens already in code.</h2>
            <p className="section-copy">
              These mockups echo the current scan, result, dashboard, and history surfaces while
              leaving room for final screenshots later.
            </p>
          </div>

          <div className="showcase-grid">
            <article className="showcase-card">
              <ResultsPreview />
              <div className="showcase-copy">
                <h3>Meal analysis that feels editorial</h3>
                <p>
                  Quality score, macro estimates, and suggestions are organized for quick reading
                  instead of dashboard overload.
                </p>
              </div>
            </article>

            <article className="showcase-card is-accent">
              <DashboardPreview />
              <div className="showcase-copy">
                <h3>Premium trend views without the weight</h3>
                <p>
                  The app already contains deeper dashboard surfaces for quality, macros, and
                  hydration. This section gives them a more premium wrapper on the web.
                </p>
              </div>
            </article>

            <article className="showcase-card">
              <HistoryPreview />
              <div className="showcase-copy">
                <h3>Momentum stays visible</h3>
                <p>
                  Saved meals, timestamps, and scores help users stay consistent and compare days
                  instead of treating each scan as an isolated event.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="content-block launch-block" id="waitlist">
        <div className="container launch-grid">
          <div className="waitlist-panel">
            <div className="eyebrow">Early access</div>
            <h2>Open the waitlist before the App Store launch.</h2>
            <p className="section-copy">
              Collect early interest for preview builds, launch updates, and feedback loops. The
              form supports a generic endpoint or Supabase-backed storage, with a local preview
              fallback during development.
            </p>
            <div className="benefit-list">
              {launchBenefits.map((benefit) => (
                <div key={benefit} className="benefit-pill">
                  {benefit}
                </div>
              ))}
            </div>
            <WaitlistForm />
          </div>

          <div className="launch-panel">
            <div className="eyebrow">Trust surface</div>
            <h2>Public launch materials stay close at hand.</h2>
            <ul className="trust-list">
              {trustSignals.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>Waitlist confirmations route through {siteConfig.contactEmail} workflows.</li>
            </ul>

            <div className="resource-grid">
              {appStoreCards.map((card) => (
                <a key={card.title} className="resource-card" href={toPageHref('/', card.href)}>
                  <strong>{card.title}</strong>
                  <span>{card.body}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
