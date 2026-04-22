import {
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { trackSupportContactClick } from "../lib/analytics";
import { siteConfig, toPageHref, type SitePath } from "../siteContent";

type SiteLayoutProps = PropsWithChildren<{
  activePath: SitePath;
  pageTitle?: string;
  pageIntro?: string;
  pageBadge?: string;
  pageActions?: ReactNode;
}>;

export function SiteLayout({
  activePath,
  pageTitle,
  pageIntro,
  pageBadge,
  pageActions,
  children,
}: SiteLayoutProps) {
  const homeHref = toPageHref(activePath, "/");
  const navHref = (section: string) =>
    activePath === "/" ? `#${section}` : `${homeHref}#${section}`;

  return (
    <div className="site-shell">
      <div className="sf-stars" aria-hidden="true" />

      <header className="site-header">
        <div className="container brand-row">
          <a className="brand" href={homeHref}>
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <div className="brand-name" aria-label={siteConfig.appName}>
                <span>Snap</span>
                <strong>Fresh</strong>
              </div>
              <div className="brand-tag">Scan · Score · Share</div>
            </div>
          </a>

          <nav className="sf-nav-links" aria-label="Primary">
            <a href={navHref("how-it-works")}>How it works</a>
            <a href={navHref("comparison")}>Food score</a>
            <a href={toPageHref(activePath, "/nutrition-methodology/")}>
              Methodology
            </a>
            <a href={toPageHref(activePath, "/support/")}>Support</a>
          </nav>

          <div className="sf-nav-meta" aria-hidden="true">
            iOS · v1.0
          </div>
        </div>
      </header>

      {(pageTitle || pageIntro) && (
        <section className="page-hero">
          <div className="container page-hero-inner">
            <div className="page-hero-copy">
              {pageBadge ? <div className="eyebrow">{pageBadge}</div> : null}
              {pageTitle ? <h1 className="page-title">{pageTitle}</h1> : null}
              {pageIntro ? <p className="page-intro">{pageIntro}</p> : null}
            </div>
            {pageActions ? (
              <div className="page-hero-actions">{pageActions}</div>
            ) : null}
          </div>
        </section>
      )}

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="sf-footer-copy">
            © 2026 SNAPFRESH · UJASCODE
          </div>
          <div>
            <div className="footer-title">Links</div>
            <div className="footer-links">
              <a href={toPageHref(activePath, "/privacy/")}>Privacy</a>
              <a href={toPageHref(activePath, "/terms/")}>Terms</a>
              <a href={toPageHref(activePath, "/support/")}>Support</a>
              <a href={toPageHref(activePath, "/data-deletion/")}>
                Data deletion
              </a>
              <a href={toPageHref(activePath, "/nutrition-methodology/")}>
                Methodology
              </a>
              <a href={toPageHref(activePath, "/disclaimer/")}>Disclaimer</a>
            </div>
          </div>
          <div>
            <div className="footer-title">Support</div>
            <a
              className="footer-mail"
              href={`mailto:${siteConfig.contactEmail}`}
              onClick={() => trackSupportContactClick("footer")}
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function ContentSection({
  title,
  paragraphs,
  bullets,
}: {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}) {
  return (
    <section className="policy-section">
      <h2>{title}</h2>
      {paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {bullets ? (
        <ul>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
