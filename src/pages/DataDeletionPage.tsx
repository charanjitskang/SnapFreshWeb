import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { deletionSections, siteConfig } from '../siteContent';

export function DataDeletionPage() {
  return (
    <SiteLayout
      activePath="/data-deletion/"
      pageBadge="Data Deletion"
      pageTitle="How SnapFresh users can request account and data deletion"
      pageIntro="This page is intended for App Store compliance and user support. It distinguishes between data stored only on the device and account-linked records associated with SnapFresh services."
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
