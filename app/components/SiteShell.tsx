import Link from "next/link";
import type { ReactNode } from "react";
import { LiveScene } from "./live-file/LiveScene";
import { MobileNavigation } from "./MobileNavigation";

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
          <Link href="/#approach">Practice</Link>
          <Link href="/#ai-practice">AI workflow</Link>
          <Link href="/about">About</Link>
          <Link href="/playground">Playground</Link>
        </nav>
        <div className="site-header__actions">
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
        label="Preview ready / Your turn"
        targetSelector=".footer-contact"
        tool="file-status"
        action="Closing the working file"
        properties={["Editing → Ready for review", "Private preview", "Your turn"]}
        readMs={900}
        spotlightMs={3000}
        comment="One last tweak. Again. Okay—your turn."
        commentFirst
        draftLabel="Draft · handoff still open"
        className="footer-live-scene"
      >
        <div className="shell footer-grid">
          <div className="footer-heading">
            <p className="kicker">08 / Contact · Private preview</p>
            <p>The file is ready for review.</p>
          </div>
          <div className="footer-contact">
            <p>The real work starts with a hard product problem. Contact details arrive with the final content pass.</p>
            <Link className="text-link" href="/about#contact-note">
              Continue with Javier <ArrowIcon />
            </Link>
          </div>
          <div className="footer-meta">
            <p>Marbella, Spain · Preview ready · Contact pending</p>
            <p>© {new Date().getFullYear()} Javier Ortiz</p>
            {experienceSettings}
          </div>
        </div>
      </LiveScene>
    </footer>
  );
}
