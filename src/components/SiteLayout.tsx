import { useEffect, useState, type PropsWithChildren, type ReactNode } from 'react';
import { PlateMascot } from './PlateMascot';
import { siteConfig, toPageHref, type SitePath } from '../siteContent';

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
  children
}: SiteLayoutProps) {
  const waitlistHref = `${toPageHref(activePath, '/')}#waitlist`;
  const [isWaitlistVisible, setIsWaitlistVisible] = useState(false);

  useEffect(() => {
    const waitlistSection = document.getElementById('waitlist');

    if (!waitlistSection) {
      setIsWaitlistVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsWaitlistVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2
      }
    );

    observer.observe(waitlistSection);

    return () => {
      observer.disconnect();
    };
  }, [activePath]);

  return (
    <div className="site-shell">
      <div className="site-backdrop site-backdrop-one" />
      <div className="site-backdrop site-backdrop-two" />

      <header className="site-header">
        <div className="container brand-row">
          <a className="brand" href={toPageHref(activePath, '/')}>
            <PlateMascot className="brand-mark" hideArms label="SnapFresh plate logo" />
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
            {pageActions ? <div className="page-hero-actions">{pageActions}</div> : null}
          </div>
        </section>
      )}

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-title">Links</div>
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
          </div>
        </div>
      </footer>

      <div
        className={isWaitlistVisible ? 'floating-waitlist-bar is-hidden' : 'floating-waitlist-bar'}
      >
        <div className="container floating-waitlist-inner">
          <p className="floating-waitlist-copy">Coming soon this month...</p>
          <a className="button button-primary floating-waitlist-button" href={waitlistHref}>
            Join the waitlist
          </a>
        </div>
      </div>
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
