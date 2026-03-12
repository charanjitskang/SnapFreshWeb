import type { CSSProperties, ReactNode } from 'react';
import { PlateMascot } from '../components/PlateMascot';
import { SiteLayout } from '../components/SiteLayout';
import { WaitlistForm } from '../components/WaitlistForm';
import {
  siteConfig,
  supportedLanguages,
  toPageHref,
  type SitePath
} from '../siteContent';

const appStoreCards = [
  {
    title: 'Privacy Policy',
    href: '/privacy/' as SitePath,
    body: 'Straightforward privacy details for photos, account data, and storage.'
  },
  {
    title: 'Terms of Use',
    href: '/terms/' as SitePath,
    body: 'Simple expectations for AI meal insights and premium features.'
  },
  {
    title: 'Support',
    href: '/support/' as SitePath,
    body: 'A clear support page for users who need help.'
  },
  {
    title: 'Data Deletion',
    href: '/data-deletion/' as SitePath,
    body: 'Easy instructions for account and data deletion requests.'
  }
];

const experienceSignals = [
  { value: 'Snap in seconds', label: 'Take a photo and get moving' },
  { value: 'Balance first', label: 'Calories are context, not the goal' },
  { value: `${supportedLanguages.length} languages`, label: 'Made for more than one kind of eater' },
  { value: 'History + hydration', label: 'Healthy habits stay in view' }
];

const storySteps = [
  {
    step: '01',
    title: 'Snap the meal',
    body: 'Take a photo, add a note if you want, and move on.'
  },
  {
    step: '02',
    title: 'Get the gist fast',
    body: 'See how balanced the meal looks, what it is missing, and where calories fit in.'
  },
  {
    step: '03',
    title: 'Stay on track',
    body: 'Meals, hydration, and progress stay together so good choices feel easier to repeat.'
  }
];

const launchBenefits = [
  'Priority access when preview invites open',
  'Launch notes and product updates',
  'A chance to shape premium features early'
];

const launchNotes = [
  'A thoughtful, supportive experience instead of a lecture.',
  'Built to encourage balanced eating, not obsessive tracking.',
  'Help, privacy, and account deletion pages are already in place.',
  'AI insights are meant to guide better choices, not replace judgment.',
  `Questions? Reach us at ${siteConfig.contactEmail}.`
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
            <strong>Well balanced</strong>
            <span>Protein, fiber, and variety in view</span>
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
        <div className="insight-card">Solid protein, good balance, and a simple next step.</div>
        <div className="insight-card">An easy read on what is working and what could improve.</div>
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
          <span>This week looks steady</span>
          <p>A quick read on how your eating habits are trending.</p>
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
            <div className="eyebrow">Healthy eating, not just fewer calories</div>
            <h1>Eat better, not just less.</h1>
            <p className="hero-lede">
              SnapFresh helps you judge how balanced a meal looks, spot what it needs, and build
              healthier habits from a single photo.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#waitlist">
                Join the waitlist
              </a>
              <a className="button button-secondary" href="#preview">
                Preview the app
              </a>
            </div>
            <div className="hero-meta">
              <span>Photo scan</span>
              <span>Balanced eating score</span>
              <span>History and hydration</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <CapturePreview />
            <div className="floating-insight-card">
              <div className="floating-insight-label">One quick read</div>
              <strong>See what the plate needs</strong>
              <span>More balance, less guesswork</span>
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
            <div className="eyebrow">How it fits into a real day</div>
            <h2>From one photo to a healthier next choice.</h2>
            <p className="section-copy">
              It is built to make balanced eating easier to see, easier to act on, and easier to
              keep up over time.
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
            <div className="eyebrow">A closer look</div>
            <h2>Three screens that make the habit stick.</h2>
            <p className="section-copy">Scan, improve the plate, and come back to your progress.</p>
          </div>

          <div className="showcase-grid">
            <article className="showcase-card">
              <ResultsPreview />
              <div className="showcase-copy">
                <h3>A better read on the plate</h3>
                <p>
                  See balance, macros, and a few useful nudges without turning every meal into a
                  math problem.
                </p>
              </div>
            </article>

            <article className="showcase-card is-accent">
              <DashboardPreview />
              <div className="showcase-copy">
                <h3>Healthy habits in one place</h3>
                <p>
                  Weekly patterns, hydration, and food quality come together in one calm view.
                </p>
              </div>
            </article>

            <article className="showcase-card">
              <HistoryPreview />
              <div className="showcase-copy">
                <h3>Small choices add up</h3>
                <p>
                  When balanced meals live in one simple timeline, it is easier to stay consistent.
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
            <h2>Be first when SnapFresh opens up.</h2>
            <p className="section-copy">
              Join the waitlist for early access, product updates, and first access when the app
              goes live.
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
            <div className="eyebrow">Built with care</div>
            <h2>Everything around the product feels ready, too.</h2>
            <ul className="trust-list">
              {launchNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
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
