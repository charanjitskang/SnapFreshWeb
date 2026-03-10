import { SiteLayout } from '../components/SiteLayout';
import { siteConfig, supportTopics, toPageHref } from '../siteContent';

export function SupportPage() {
  return (
    <SiteLayout
      activePath="/support/"
      pageBadge="Support"
      pageTitle="Support for SnapFresh users and App Store review links"
      pageIntro="Use this page as the public support destination for SnapFresh. It gives users a contact route, outlines the common issue categories, and links to privacy and deletion resources."
      pageActions={
        <a className="button button-primary" href={`mailto:${siteConfig.contactEmail}`}>
          Email support
        </a>
      }
    >
      <section className="content-block">
        <div className="container split-grid align-start">
          <article className="support-contact-card">
            <div className="eyebrow">Primary contact</div>
            <h2>{siteConfig.contactEmail}</h2>
            <p>
              Include the email address associated with your SnapFresh account, your device type,
              and clear reproduction steps.
            </p>
            <p>{siteConfig.supportWindow}</p>
          </article>
          <article className="support-note-card">
            <div className="eyebrow">What to include</div>
            <ul className="trust-list">
              <li>A concise summary of the issue</li>
              <li>The screen where it happened</li>
              <li>Any error message shown in the app</li>
              <li>A screenshot if the issue is visual or analysis-related</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-block">
        <div className="container section-header">
          <div className="eyebrow">Issue categories</div>
          <h2>Support pages work better when they reflect the actual product surface</h2>
        </div>
        <div className="container card-grid">
          {supportTopics.map((topic) => (
            <article key={topic.title} className="feature-card">
              <h3>{topic.title}</h3>
              <p>{topic.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="container split-grid align-start">
          <article className="support-card-panel">
            <div className="eyebrow">App Store references</div>
            <h2>Useful companion links</h2>
            <div className="footer-links page-links">
              <a href={toPageHref('/support/', '/privacy/')}>Privacy Policy</a>
              <a href={toPageHref('/support/', '/terms/')}>Terms of Use</a>
              <a href={toPageHref('/support/', '/data-deletion/')}>Data deletion</a>
            </div>
          </article>
          <article className="support-card-panel">
            <div className="eyebrow">Deletion requests</div>
            <h2>Account removal and data requests</h2>
            <p>
              If a user wants account-linked deletion, direct them to the dedicated data deletion
              page or have them email support with a verified request.
            </p>
            <a className="button button-secondary" href={toPageHref('/support/', '/data-deletion/')}>
              Open data deletion page
            </a>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
