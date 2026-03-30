import { ClerkProvider } from "@clerk/clerk-react";
import { AdminPage } from "../pages/AdminPage";
import {
  ADMIN_CONFIG_STATUS,
  getAdminConfig,
} from "../lib/adminConfig";
import { mountApp } from "./renderApp";
import "../styles.css";

const adminConfig = getAdminConfig();

function AdminConfigErrorPage() {
  return (
    <div className="admin-shell">
      <div className="site-backdrop site-backdrop-one" />
      <div className="site-backdrop site-backdrop-two" />

      <div className="container admin-shell-inner">
        <header className="admin-header">
          <div className="brand">
            <div>
              <div className="brand-name" aria-label="SnapFresh">
                <span>Snap</span>
                <strong>Fresh</strong>
              </div>
              <div className="brand-tag">Internal Admin</div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <section className="admin-grid">
            <article className="admin-card admin-card-hero">
              <div className="eyebrow">Missing config</div>
              <h2>The admin page needs public Clerk and Supabase config.</h2>
              <p className="admin-card-copy">
                Set the missing env vars in `SnapFreshWeb/.env`, then restart the
                dev server.
              </p>
              <div className="admin-pill-row">
                {ADMIN_CONFIG_STATUS.missing.map((name) => (
                  <span key={name} className="admin-pill is-alert">
                    {name}
                  </span>
                ))}
              </div>
              <pre className="admin-code-block">{`# SnapFreshWeb/.env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=`}</pre>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

mountApp(
  adminConfig ? (
    <ClerkProvider publishableKey={adminConfig.clerkPublishableKey}>
      <AdminPage />
    </ClerkProvider>
  ) : (
    <AdminConfigErrorPage />
  ),
);
