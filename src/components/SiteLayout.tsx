import type { PropsWithChildren, ReactNode } from 'react';
import { siteConfig, toAssetHref, toPageHref, type SitePath } from '../siteContent';

type SiteLayoutProps = PropsWithChildren<{
  activePath: SitePath;
  pageTitle?: string;
  pageIntro?: string;
  pageBadge?: string;
  pageActions?: ReactNode;
}>;

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/terms/', label: 'Terms' },
  { href: '/support/', label: 'Support' },
  { href: '/data-deletion/', label: 'Data deletion' }
] as const;

export function SiteLayout({
  activePath,
  pageTitle,
  pageIntro,
  pageBadge,
  pageActions,
  children
}: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <div className="site-backdrop site-backdrop-one" />
      <div className="site-backdrop site-backdrop-two" />
      <header className="site-header">
        <div className="container nav-row">
          <a className="brand" href={toPageHref(activePath, '/')}>
            <img className="brand-mark" src={toAssetHref(activePath, 'logo.png')} alt="SnapFresh" />
            <div>
              <div className="brand-name">{siteConfig.appName}</div>
              <div className="brand-tag">AI meal intelligence for everyday eating</div>
            </div>
          </a>
          <nav className="site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={toPageHref(activePath, item.href)}
                className={item.href === activePath ? 'nav-link is-active' : 'nav-link'}
              >
                {item.label}
              </a>
            ))}
          </nav>
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
            {pageActions ? <div className="page-hero-actions">{pageActions}</div> : null}
          </div>
        </section>
      )}

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-title">{siteConfig.appName}</div>
            <p className="footer-copy">
              SnapFresh turns meal photos into structured nutrition insights, history, hydration
              logs, and clearer food decisions.
            </p>
          </div>
          <div>
            <div className="footer-title">Hosted pages</div>
            <div className="footer-links">
              <a href={toPageHref(activePath, '/privacy/')}>Privacy Policy</a>
              <a href={toPageHref(activePath, '/terms/')}>Terms of Use</a>
              <a href={toPageHref(activePath, '/support/')}>Support</a>
              <a href={toPageHref(activePath, '/data-deletion/')}>Data deletion</a>
            </div>
          </div>
          <div>
            <div className="footer-title">Support</div>
            <a className="footer-mail" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
            <p className="footer-copy">
              Effective date: {siteConfig.effectiveDate}
              <br />
              Last updated: {siteConfig.lastUpdated}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function ContentSection({
  title,
  paragraphs,
  bullets
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
