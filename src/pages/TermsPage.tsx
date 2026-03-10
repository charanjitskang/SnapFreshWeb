import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { siteConfig, termsSections } from '../siteContent';

export function TermsPage() {
  return (
    <SiteLayout
      activePath="/terms/"
      pageBadge="Terms of Use"
      pageTitle="Terms for using SnapFresh and its AI-powered meal features"
      pageIntro="These terms set user expectations around account use, AI-generated nutrition estimates, premium-ready features, and limits on liability."
      pageActions={
        <a className="button button-secondary" href={`mailto:${siteConfig.contactEmail}`}>
          Terms contact
        </a>
      }
    >
      <div className="container legal-wrap">
        <div className="legal-meta">
          <span>Effective date: {siteConfig.effectiveDate}</span>
          <span>Last updated: {siteConfig.lastUpdated}</span>
        </div>
        {termsSections.map((section) => (
          <ContentSection key={section.title} {...section} />
        ))}
      </div>
    </SiteLayout>
  );
}
