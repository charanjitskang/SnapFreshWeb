import { ContentSection, SiteLayout } from '../components/SiteLayout';
import { nutritionMethodologySections } from '../siteContent';

const sources = [
  {
    label: 'World Health Organization (WHO) – Healthy Diet Guidelines',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
  },
  {
    label: 'NHS (UK) – Eatwell Guide',
    url: 'https://www.nhs.uk/live-well/eat-well/the-eatwell-guide/'
  },
  {
    label: 'Harvard T.H. Chan School of Public Health – Healthy Eating Plate',
    url: 'https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/'
  },
  {
    label: 'U.S. Department of Agriculture (USDA) – Dietary Guidelines',
    url: 'https://www.dietaryguidelines.gov/'
  }
];

export function NutritionMethodologyPage() {
  return (
    <SiteLayout
      activePath="/nutrition-methodology/"
      pageBadge="Nutrition Methodology"
      pageTitle="How SnapFresh scores your meals"
      pageIntro="SnapFresh analyzes your meal using visual composition and general nutrition principles. The score reflects balance across vegetables, protein, whole grains, and preparation methods such as frying or processing."
    >
      <div className="container legal-wrap">
        {nutritionMethodologySections.map((section) => (
          <ContentSection key={section.title} {...section} />
        ))}
        <section className="policy-section">
          <h2>Sources</h2>
          <p>This app is informed by publicly available nutrition guidance, including:</p>
          <ul>
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteLayout>
  );
}
