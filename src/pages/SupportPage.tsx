import { SiteLayout } from '../components/SiteLayout';
import { trackSupportContactClick } from '../lib/analytics';
import { siteConfig, supportTopics, toPageHref } from '../siteContent';

export function SupportPage() {
  return (
    <SiteLayout
      activePath="/support/"
      pageBadge="Support"
      pageTitle="Support for SnapFresh users"
      pageIntro="Need help with SnapFresh? Use this page to contact support, review common issue categories, and find privacy and data deletion resources."
      pageActions={
        <a
          className="button button-primary"
          href={`mailto:${siteConfig.contactEmail}`}
          onClick={() => trackSupportContactClick('support_page_hero')}
        >
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
              When you contact us, include the email address tied to your SnapFresh account, your
              device type, and clear steps to reproduce the issue.
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
          <h2>Common reasons people reach out</h2>
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
            <div className="eyebrow">Related pages</div>
            <h2>Helpful links</h2>
            <div className="footer-links page-links">
              <a href={toPageHref('/support/', '/privacy/')}>Privacy Policy</a>
              <a href={toPageHref('/support/', '/terms/')}>Terms of Use</a>
              <a href={toPageHref('/support/', '/data-deletion/')}>Data deletion</a>
            </div>
          </article>
          <article className="support-card-panel">
            <div className="eyebrow">Deletion requests</div>
            <h2>Need your account or data removed?</h2>
            <p>
              For account-linked deletion requests, use the dedicated data deletion page or email
              support from the address tied to your account.
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
