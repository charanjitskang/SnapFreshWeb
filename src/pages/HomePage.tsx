import type { CSSProperties } from 'react';
import { PlateMascot } from '../components/PlateMascot';
import { SiteLayout } from '../components/SiteLayout';
import { WaitlistForm } from '../components/WaitlistForm';
import { siteConfig, toAssetHref } from '../siteContent';

const experienceSignals = [
  { value: 'Snap in seconds', label: 'Take a photo and keep going' },
  { value: 'Balance first', label: 'Calories are context, not the whole story' },
  { value: 'Calories + nutrients', label: 'See the numbers without losing the bigger picture' },
  {
    value: 'Share',
    label: 'Choose from multiple templates to share your plate',
    bullets: [
      'Score and balance',
      'Calories and nutrients',
      'Guess my score/calories',
      'Liquified glass effects'
    ]
  }
];

const storySteps = [
  {
    step: '01',
    title: 'Snap the meal',
    body: 'Take a photo, add a note if you want, and move on.'
  },
  {
    step: '02',
    title: 'See what stands out',
    body: 'Get a quick read on balance, what the meal may be missing, and where calories fit in.'
  },
  {
    step: '03',
    title: 'Stay on track',
    body: 'Meals, hydration, and progress stay together so healthy choices are easier to repeat.'
  }
];

const foodScoreFactors = [
  'Vegetable & fruit content',
  'Protein balance',
  'Carb quality',
  'Overall nutrition composition'
];

const launchNotes = [
  'Quick and easy onboarding without a long questionnaire.',
  'Customize the app around what matters to you; choose to see only the features you use.',
  'Built to encourage balanced eating, not obsessive tracking.',
  `Questions? Reach us at ${siteConfig.contactEmail}.`
];

function ScoreRing({ score, label }: { score: number; label: string }) {
  const style = { '--score-angle': `${Math.round(score * 3.6)}deg` } as CSSProperties;

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
  const screenshotSrc = toAssetHref('/', 'scanning_food_macro.png');

  return (
    <div className="hero-screenshot-panel">
      <div className="hero-screenshot-stage">
        <div className="hero-screenshot-frame">
          <img
            className="hero-screenshot"
            src={screenshotSrc}
            alt="SnapFresh analyzing a bowl meal with identified items and nutrient checks"
            loading="eager"
            decoding="async"
          />
        </div>
        <PlateMascot className="hero-floating-plate" hideArms label="SnapFresh plate mascot" />
      </div>
      <div className="hero-screenshot-caption">
        Real analyze screen from the app.
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
              SnapFresh scores your meal for nutrient balance and gives you insights and
              suggestions to help you build a more balanced diet.
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

      <section className="content-block story-block" id="preview">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">How it fits into a real day</div>
            <h2>From one photo to a better next choice.</h2>
            <p className="section-copy">
              SnapFresh is built to make balanced eating easier to notice, act on, and keep up
              over time.
            </p>
          </div>

          <div className="story-grid">
            {storySteps.map((item) => (
              <article key={item.step} className="story-card">
                <span className="story-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block food-score-block">
        <div className="container food-score-grid">
          <div className="section-heading food-score-copy">
            <div className="eyebrow">Food Quality Score</div>
            <h2>Understand your food, not just its calories.</h2>
            <p className="section-copy">
              Calories only tell part of the story. Two meals can have the same calorie count and
              offer very different nutrition.
            </p>
            <p className="section-copy">
              SnapFresh gives each meal a Food Quality Score so you can quickly see its balance,
              variety, and overall quality.
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
                The score is meant to highlight balance, quality, and what your meal may be
                missing, not just whether the calorie number is low.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-block launch-block" id="waitlist">
        <div className="container launch-grid">
          <div className="waitlist-panel">
            <div className="eyebrow">Early access</div>
            <h2>Be first for early bird offers.</h2>
            <p className="section-copy">
              Join the waitlist to hear when SnapFresh goes live.
            </p>
            <WaitlistForm />
          </div>

          <div className="launch-panel">
            <div className="eyebrow">Built with care</div>
            <h2>Simple to start, easy to make your own.</h2>
            <ul className="trust-list">
              {launchNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
