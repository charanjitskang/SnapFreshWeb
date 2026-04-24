import { useEffect, useRef, useState } from "react";
import { SiteLayout } from "../components/SiteLayout";
import { toAssetHref } from "../siteContent";

const appStoreUrl = "https://apps.apple.com/app/snapfresh/id6760476830";

const steps = [
  {
    n: "01",
    title: "Snap",
    copy:
      "Point your phone at your plate. The camera identifies every ingredient — no logging, no weighing, no lookup.",
    img: "scanning_food_macro.png",
    alt: "SnapFresh analyzing a bowl meal with identified items and nutrient checks",
  },
  {
    n: "02",
    title: "Score",
    copy:
      "Your meal is scored on balance, nutrients, and quality using NOVA and modern dietary guidelines.",
    img: "calories_macros_share_food.png",
    alt: "SnapFresh score screen showing calories, macros, and meal quality details",
  },
  {
    n: "03",
    title: "Share",
    copy:
      "See your vitality score, macros, and calories. Share a proud plate — or roast a bad one with friends.",
    img: "calories_macros_share_food.png",
    alt: "SnapFresh share-ready card summarizing a meal with its score",
  },
];

const evaluates = [
  "Vegetable & fruit content",
  "Protein balance",
  "Carb quality",
  "Nutrition composition",
];

const frameworks: Array<[string, string]> = [
  ["NOVA", "Food processing classification used by modern nutrition research."],
  ["USDA", "Food composition dataset, per-ingredient nutrient resolution."],
  ["WHO", "Added sugar, sodium, and saturated fat intake guidelines."],
  ["AICR", "Plant-forward balance + cancer-risk reduction framework."],
];

function AppStoreBadge({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <a
      className={`sf-appstore${size === "lg" ? " is-lg" : ""}`}
      href={appStoreUrl}
      aria-label="Download SnapFresh on the App Store"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 12.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.6 2.1 2.7 2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.3-.1 0-2.4-.9-2.4-3.3zM15.4 6.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 0 1.9-.5 2.5-1.2z" />
      </svg>
      <div className="sf-appstore-label">
        <small>Download on the</small>
        <strong>App Store</strong>
      </div>
    </a>
  );
}

export function HomePage() {
  const scanScreen = toAssetHref("/", "scanning_food_macro.png");
  const shareScreen = toAssetHref("/", "calories_macros_share_food.png");

  const heroCtaRef = useRef<HTMLDivElement>(null);
  const bottomCtaRef = useRef<HTMLDivElement>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const heroEl = heroCtaRef.current;
    const bottomEl = bottomCtaRef.current;
    if (!heroEl || !bottomEl) return;

    let heroVisible = true;
    let bottomVisible = false;
    const update = () => setShowStickyCta(!heroVisible && !bottomVisible);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    const bottomObs = new IntersectionObserver(
      ([entry]) => {
        bottomVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );

    heroObs.observe(heroEl);
    bottomObs.observe(bottomEl);
    return () => {
      heroObs.disconnect();
      bottomObs.disconnect();
    };
  }, []);

  return (
    <SiteLayout activePath="/">
      <section className="landing-hero">
        <div className="container landing-grid">
          <div className="hero-copy">
            <div className="sf-eyebrow">NUTRITION, DECODED</div>
            <h1>
              Understand your food,
              <br />
              <em>not just calories.</em>
            </h1>
            <p className="hero-lede">
              SnapFresh scores your meal for nutrient balance and gives you
              insights to help you build a more balanced diet.
            </p>
            <div className="sf-hero-cta" ref={heroCtaRef}>
              <AppStoreBadge />
              <span className="sf-hero-note">iOS · free · no long onboarding</span>
            </div>
            <div className="sf-hero-ticker">
              <span>▸ NOVA FRAMEWORK</span>
              <span>▸ WHO GUIDELINES</span>
              <span>▸ USDA DATASET</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="sf-orbit" />
            <div className="sf-orb" />
            <div className="sf-hero-caption">
              ◦ SCAN INITIATED
              <br />
              <strong>▸ 3 nutrients flagged</strong>
            </div>
            <div className="sf-hero-phone">
              <div className="sf-hero-phone-frame">
                <img
                  src={scanScreen}
                  alt=""
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="signal-band">
        <div className="container">
          <div className="sf-section-header">
            <div>
              <div className="sf-eyebrow">THE GESTURE</div>
              <h2>Three steps, one glance.</h2>
            </div>
            <div className="sf-section-meta">PROTOCOL · V1.0</div>
          </div>

          <div className="signal-grid">
            {steps.map((step) => (
              <article key={step.n} className="signal-card">
                <div className="sf-step-row">
                  <span className="sf-step-n">{step.n}</span>
                  <span className="sf-step-label">STEP</span>
                </div>
                <div className="signal-value">{step.title}</div>
                <p className="signal-copy">{step.copy}</p>
                <div className="sf-step-img">
                  <img
                    src={step.n === "01" ? scanScreen : shareScreen}
                    alt={step.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" className="content-block food-score-block">
        <div className="container food-score-grid">
          <div className="sf-center">
            <div className="sf-eyebrow" style={{ margin: "0 auto" }}>
              FOOD QUALITY SCORE
            </div>
            <h2>Cutting calories shouldn't mean cutting on nutrients.</h2>
            <p>
              Two meals can have the same calorie count and offer very
              different nutrition. SnapFresh helps you maximize what your
              plate gives you.
            </p>
          </div>

          <div className="sf-compare-grid">
            <MealCard
              label="MEAL A"
              kcal="620"
              title="Fried sandwich & chips"
              score={34}
              tone="warn"
              caption="Low quality · unbalanced"
              imageSrc="/meal-a-chips.png"
              imageAlt="Fried chicken sandwich with chips on a plate"
            />
            <div className="sf-compare-vs">vs</div>
            <MealCard
              label="MEAL B"
              kcal="620"
              title="Salmon, rice, greens & fruit"
              score={84}
              tone="good"
              caption="Balanced · healthy"
              imageSrc="/meal-b-salmon.png"
              imageAlt="Grilled salmon with rice, greens, and fruit on a plate"
            />
          </div>

          <div className="sf-evaluates">
            <div className="sf-evaluates-label">EVALUATES</div>
            {evaluates.map((item) => (
              <div key={item} className="sf-evaluates-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className="sf-section-methodology">
        <div className="container sf-methodology-grid">
          <div>
            <div className="sf-eyebrow">METHODOLOGY</div>
            <h2>Grounded in human science.</h2>
            <p>
              Scores use the NOVA classification, modern dietary guidelines,
              and WHO recommendations — the same frameworks nutrition
              researchers use.
            </p>
            <a className="sf-method-link" href="./nutrition-methodology/">
              ▸ READ THE FULL METHODOLOGY
            </a>
          </div>

          <div className="sf-method-cards">
            {frameworks.map(([name, desc]) => (
              <div key={name} className="sf-method-card">
                <div className="sf-method-name">{name}</div>
                <div className="sf-method-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sf-cta">
        <div className="container">
          <div className="sf-eyebrow" style={{ margin: "0 auto" }}>
            DOWNLOAD
          </div>
          <h2>
            Your next meal,
            <br />
            <em>understood.</em>
          </h2>
          <p className="sf-cta-sub">
            Free on iOS. No long onboarding. No calorie counting. Just look.
          </p>
          <div className="sf-cta-action" ref={bottomCtaRef}>
            <AppStoreBadge size="lg" />
          </div>
        </div>
      </section>

      <div
        className={`sf-mobile-sticky-cta${showStickyCta ? " is-visible" : ""}`}
        aria-hidden={!showStickyCta}
      >
        <AppStoreBadge />
      </div>
    </SiteLayout>
  );
}

type MealCardProps = {
  label: string;
  kcal: string;
  title: string;
  score: number;
  tone: "good" | "warn";
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

function MealCard({
  label,
  kcal,
  title,
  score,
  tone,
  caption,
  imageSrc,
  imageAlt,
}: MealCardProps) {
  return (
    <div className="sf-meal-card">
      <div className="sf-meal-head">
        <span className="sf-step-n">{label}</span>
        <span className="sf-meal-kcal">
          {kcal}
          <small>kcal</small>
        </span>
      </div>
      <div className={`sf-meal-photo is-${tone}`}>
        <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
      </div>
      <h3 className="sf-meal-title">{title}</h3>
      <div className={`sf-meal-score is-${tone}`}>
        <div className="sf-meal-score-num">{score}</div>
        <div className="sf-meal-score-meta">
          <div className="sf-meal-score-label">VITALITY</div>
          <div className="sf-meal-score-caption">{caption}</div>
        </div>
      </div>
    </div>
  );
}
