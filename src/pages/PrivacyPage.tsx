import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { privacySections, siteConfig } from '../siteContent';

export function PrivacyPage() {
  return (
    <SiteLayout
      activePath="/privacy/"
      pageBadge="Privacy Policy"
      pageTitle="How SnapFresh handles your account, photos, and nutrition data"
      pageIntro="This policy explains how SnapFresh handles sign-in details, meal photos, on-device data, and support requests."
      pageActions={
        <a className="button button-secondary" href={`mailto:${siteConfig.contactEmail}`}>
          Contact privacy
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
