import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { privacySections, siteConfig } from '../siteContent';

export function PrivacyPage() {
  return (
    <SiteLayout
      activePath="/privacy/"
      pageBadge="Privacy Policy"
      pageTitle="How SnapFresh handles account, image, and nutrition data"
      pageIntro="This policy reflects the current mobile app behavior: account sign-in, meal photo analysis, local device storage, Supabase-backed services, and support interactions."
      pageActions={
        <a className="button button-secondary" href={`mailto:${siteConfig.contactEmail}`}>
          Privacy contact
        </a>
      }
    >
      <div className="container legal-wrap">
        <div className="legal-meta">
          <span>Effective date: {siteConfig.effectiveDate}</span>
          <span>Last updated: {siteConfig.lastUpdated}</span>
        </div>
        {privacySections.map((section) => (
          <ContentSection key={section.title} {...section} />
        ))}
      </div>
    </SiteLayout>
  );
}
