import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { siteConfig, termsSections } from '../siteContent';

export function TermsPage() {
  return (
    <SiteLayout
      activePath="/terms/"
      pageBadge="Terms of Use"
      pageTitle="Terms for using SnapFresh"
      pageIntro="These terms explain the rules for using SnapFresh, including accounts, AI-generated nutrition estimates, premium features, and limits on liability."
      pageActions={
        <a className="button button-secondary" href={`mailto:${siteConfig.contactEmail}`}>
          Contact support
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
