import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { deletionSections, siteConfig } from '../siteContent';

export function DataDeletionPage() {
  return (
    <SiteLayout
      activePath="/data-deletion/"
      pageBadge="Data Deletion"
      pageTitle="How to request account or data deletion"
      pageIntro="Use this page to request deletion of account-linked SnapFresh data and to understand what stays on your device unless you remove it."
      pageActions={
        <a className="button button-primary" href={`mailto:${siteConfig.contactEmail}`}>
          Start deletion request
        </a>
      }
    >
      <div className="container legal-wrap">
        <div className="legal-meta">
          <span>Request email: {siteConfig.contactEmail}</span>
          <span>{siteConfig.supportWindow}</span>
        </div>
        {deletionSections.map((section) => (
          <ContentSection key={section.title} {...section} />
        ))}
      </div>
    </SiteLayout>
  );
}
