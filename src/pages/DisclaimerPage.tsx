import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { disclaimerSections } from '../siteContent';

export function DisclaimerPage() {
  return (
    <SiteLayout
      activePath="/disclaimer/"
      pageBadge="Disclaimer"
      pageTitle="SnapFresh does not provide medical or professional advice"
      pageIntro="SnapFresh provides general nutrition insights based on visual analysis of food images. The information in the app is for informational purposes only."
    >
      <div className="container legal-wrap">
        {disclaimerSections.map((section) => (
          <ContentSection key={section.title} {...section} />
        ))}
      </div>
    </SiteLayout>
  );
}
