import type { CSSProperties } from "react";
import { PlateMascot } from "../components/PlateMascot";
import { SiteLayout } from "../components/SiteLayout";
import { toAssetHref } from "../siteContent";

type ExperienceSignal = {
  value: string;
  label: string;
  bullets?: string[];
};

const experienceSignals: ExperienceSignal[] = [
  {
    value: "Snap it",
    label: "Take photo to analyze for healthy balance, nutrients and calories.",
  },
  {
    value: "Score it",
    label:
      "Score based on established nutrition frameworks like NOVA and modern dietary guidelines.",
  },
  {
    value: "Share it",
    label:
      "See vitality score, calories, nutrients. Proudly share your healthy meal photo or roast an unhealthy one with friends.",
  },
];

const foodScoreFactors = [
  "Vegetable & fruit content",
  "Protein balance",
  "Carb quality",
  "Overall nutrition composition",
];

function ScoreRing({ score, label }: { score: number; label: string }) {
  const style = {
    "--score-angle": `${Math.round(score * 3.6)}deg`,
  } as CSSProperties;

  return (
    <div className="mini-score-ring" style={style}>
      <div className="mini-score-ring-inner">
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function CapturePreview() {
  const screenshots = [
    {
      src: toAssetHref("/", "scanning_food_macro.png"),
      alt: "SnapFresh analyzing a bowl meal with identified items and nutrient checks",
    },
    {
      src: toAssetHref("/", "calories_macros_share_food.png"),
      alt: "SnapFresh share screen showing calories, macros, and meal score details",
    },
  ];

  return (
    <div className="hero-screenshot-panel">
      <div className="hero-screenshot-grid">
        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot.src}
            className={`hero-screenshot-stage ${
              index === 0 ? "is-primary" : "is-secondary"
            }`}
          >
            <div className="hero-screenshot-frame">
              <img
                className="hero-screenshot"
                src={screenshot.src}
                alt={screenshot.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
            {index === 0 ? (
              <PlateMascot
                className="hero-floating-plate"
                hideArms
                label="SnapFresh plate mascot"
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="hero-screenshot-caption">
        Real screens from the app.
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <SiteLayout activePath="/">
      <section className="landing-hero">
        <div className="container landing-grid">
          <div className="hero-copy">
            <h1>Understand your food, not just calories.</h1>
            <p className="hero-lede">
              SnapFresh scores your meal for nutrient balance and gives you
              insights and suggestions to help you build a more balanced diet.
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <CapturePreview />
          </div>
        </div>
      </section>

      <section className="signal-band">
        <div className="container signal-grid">
          {experienceSignals.map((signal) => (
            <article key={signal.label} className="signal-card">
              <div className="signal-value">{signal.value}</div>
              <p className="signal-copy">{signal.label}</p>
              {signal.bullets ? (
                <ul className="signal-list">
                  {signal.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="content-block food-score-block">
        <div className="container food-score-grid">
          <div className="section-heading food-score-copy">
            <div className="eyebrow">Food Quality Score</div>
            <h2>Cutting calories shouldn't mean cutting on nutrients.</h2>
            <p className="section-copy">
              Calories only tell part of the story. Two meals can have the same
              calorie count and offer very different nutrition.
            </p>
            <p className="section-copy">
              SnapFresh helps you maximize nutrient intake from yoour plate even
              when you cut on calories.
            </p>
          </div>

          <div className="food-score-card">
            <div className="food-score-comparison">
              <div className="comparison-meal">
                <span className="comparison-label">Meal A</span>
                <strong>620 kcal</strong>
                <p>Fried sandwich and chips</p>
              </div>
              <div className="comparison-divider">vs</div>
              <div className="comparison-meal">
                <span className="comparison-label">Meal B</span>
                <strong>620 kcal</strong>
                <p>Salmon, rice, greens, and fruit</p>
              </div>
            </div>

            <div className="food-score-breakdown">
              <span className="food-score-label">SnapFresh evaluates</span>
              <ul className="food-score-list">
                {foodScoreFactors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="food-score-summary">
              <ScoreRing score={84} label="Healthy" />
              <p>
                The score is meant to highlight balance, quality, and what your
                meal may be missing, not just whether the calorie number is low.
              </p>
            </div>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
