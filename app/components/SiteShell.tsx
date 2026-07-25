import Link from "next/link";
import type { ReactNode } from "react";
import { LiveScene } from "./live-file/LiveScene";
import { MobileNavigation } from "./MobileNavigation";
import { ThemeToggle } from "./ThemeToggle";

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Link className="wordmark" href="/" aria-label="Javier Ortiz — home">
          <span className="wordmark__mark" aria-hidden="true">JO</span>
          <span className="wordmark__name">Javier Ortiz</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/#work">Work</Link>
          <Link href="/#approach">Approach</Link>
          <Link href="/about">About</Link>
          <Link href="/playground">Playground</Link>
        </nav>
        <div className="site-header__actions">
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ experienceSettings }: { experienceSettings?: ReactNode }) {
  return (
    <footer className="site-footer" id="contact">
      <LiveScene
        id="footer-handoff"
        verb="handoff"
        label="Ready / Your turn"
        targetSelector=".footer-contact"
        durationMs={1350}
        className="footer-live-scene"
      >
        <div className="shell footer-grid">
          <div className="footer-heading">
            <p className="kicker">Have a hard system to untangle?</p>
            <p>Let’s make the next move obvious.</p>
          </div>
          <div className="footer-contact">
            <p>Contact details arrive in the final content pass.</p>
            <Link className="text-link" href="/about#contact-note">
              About Javier <ArrowIcon />
            </Link>
          </div>
          <div className="footer-meta">
            <p>Marbella, Spain · Open to meaningful conversations</p>
            <p>© {new Date().getFullYear()} Javier Ortiz</p>
            {experienceSettings}
          </div>
        </div>
      </LiveScene>
    </footer>
  );
}
