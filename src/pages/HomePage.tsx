import { SiteLayout } from '../components/SiteLayout';
import {
  homeHighlights,
  siteConfig,
  supportedLanguages,
  toPageHref,
  type SitePath,
  trustSignals
} from '../siteContent';

const appStoreCards = [
  {
    title: 'Privacy Policy',
    href: '/privacy/' as SitePath,
    body: 'Covers account sign-in, meal photos, AI analysis, local storage, and cloud-linked records.'
  },
  {
    title: 'Terms of Use',
    href: '/terms/' as SitePath,
    body: 'Sets expectations around AI estimates, acceptable use, premium features, and service limitations.'
  },
  {
    title: 'Support',
    href: '/support/' as SitePath,
    body: 'Provides a support destination you can use in App Store Connect and share with users.'
  },
  {
    title: 'Data Deletion',
    href: '/data-deletion/' as SitePath,
    body: 'Explains how users can request account-linked deletion and how device-only data is handled.'
  }
];

const productSignals = [
  { label: '2-step analysis flow', value: 'Camera scan + nutrient pass' },
  { label: '13 UI languages', value: `${supportedLanguages.length} localized choices in app settings` },
  { label: 'Premium-ready surfaces', value: 'Dashboard, richer cards, deeper views' },
  { label: 'Behavior reflected here', value: 'Derived from the current mobile codebase' }
];

export function HomePage() {
  return (
    <SiteLayout activePath="/">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Built from the live SnapFresh app</div>
            <h1>Snap a meal. Decode the nutrition. Keep the momentum visible.</h1>
            <p className="hero-lede">
              {siteConfig.appName} is a photo-first nutrition companion that combines AI meal
              analysis, scan history, hydration logging, personalized goals, and premium-ready
              dashboards in one mobile experience.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={toPageHref('/', '/support/')}>
                Open support page
              </a>
              <a className="button button-secondary" href={toPageHref('/', '/privacy/')}>
                Review privacy policy
              </a>
            </div>
            <div className="hero-meta">
              <span>Camera + library meal input</span>
              <span>Clerk sign-in</span>
              <span>Supabase-backed services</span>
              <span>AI estimates, not medical advice</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-card hero-score-card">
              <div className="hero-card-label">Sample meal score</div>
              <div className="score-ring">
                <div className="score-ring-inner">
                  <strong>82</strong>
                  <span>Good</span>
                </div>
              </div>
              <p>
                The app’s analysis flow identifies meal items, estimates nutrition, then computes a
                food-quality score and suggestions.
              </p>
            </div>

            <div className="hero-card hero-stack-card">
              <div className="stack-row">
                <span className="stack-pill">Scan history</span>
                <span className="stack-pill">Hydration</span>
              </div>
              <div className="stack-row">
                <span className="stack-pill">Profile goals</span>
                <span className="stack-pill">AI transparency</span>
              </div>
              <div className="stack-row">
                <span className="stack-pill">Premium views</span>
                <span className="stack-pill">Share cards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-band">
        <div className="container signal-grid">
          {productSignals.map((signal) => (
            <article key={signal.label} className="signal-card">
              <div className="signal-label">{signal.label}</div>
              <div className="signal-value">{signal.value}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="container section-header">
          <div className="eyebrow">What the app actually does</div>
          <h2>Public copy anchored to the product behavior already in code</h2>
        </div>
        <div className="container card-grid three-up">
          {homeHighlights.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="container split-grid">
          <div>
            <div className="eyebrow">App Store support set</div>
            <h2>Hosted pages ready for review links and user trust</h2>
            <p className="section-copy">
              This website includes the minimum public pages a modern account-based nutrition app
              typically needs when heading to the App Store: privacy policy, terms, support, and a
              dedicated data deletion page.
            </p>
          </div>
          <div className="card-grid">
            {appStoreCards.map((card) => (
              <a
                key={card.title}
                className="support-card"
                href={toPageHref('/', card.href)}
              >
                <div className="support-card-title">{card.title}</div>
                <p>{card.body}</p>
                <span className="support-card-link">Open page</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block">
        <div className="container split-grid align-start">
          <div>
            <div className="eyebrow">Trust and transparency</div>
            <h2>Users need the real data story, not generic wellness copy</h2>
          </div>
          <div className="trust-card">
            <ul className="trust-list">
              {trustSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="content-block final-cta">
        <div className="container final-cta-card">
          <div>
            <div className="eyebrow">Next move</div>
            <h2>Publish these pages, then point App Store Connect at them</h2>
            <p className="section-copy">
              Use the support, privacy, and data deletion URLs in your App Store metadata. Replace
              the placeholder support email before launch.
            </p>
          </div>
          <a className="button button-primary" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
