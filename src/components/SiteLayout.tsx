import {
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { trackSupportContactClick } from "../lib/analytics";
import { PlateMascot } from "./PlateMascot";
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
  return (
    <div className="site-shell">
      <div className="site-backdrop site-backdrop-one" />
      <div className="site-backdrop site-backdrop-two" />

      <header className="site-header">
        <div className="container brand-row">
          <a className="brand" href={toPageHref(activePath, "/")}>
            <PlateMascot
              className="brand-mark"
              hideArms
              label="SnapFresh plate logo"
            />
            <div>
              <div className="brand-name" aria-label={siteConfig.appName}>
                <span>Snap</span>
                <strong>Fresh</strong>
              </div>
              <div className="brand-tag">Scan Score Share</div>
            </div>
          </a>
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
          <div>
            <div className="footer-title">Links</div>
            <div className="footer-links">
              <a href={toPageHref(activePath, "/privacy/")}>Privacy Policy</a>
              <a href={toPageHref(activePath, "/terms/")}>Terms of Use</a>
              <a href={toPageHref(activePath, "/support/")}>Support</a>
              <a href={toPageHref(activePath, "/data-deletion/")}>
                Data deletion
              </a>
              <a href={toPageHref(activePath, "/nutrition-methodology/")}>
                Nutrition Methodology
              </a>
              <a href={toPageHref(activePath, "/disclaimer/")}>
                Disclaimer
              </a>
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
