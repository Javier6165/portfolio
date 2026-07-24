import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource/fragment-mono/400.css";
import "./globals.css";
import { MotionController } from "./components/MotionController";
import { SiteFooter, SiteHeader } from "./components/SiteShell";
import { siteConfig } from "./config";

// This runs before React and before first paint. Moving it into an effect would
// flash the default dark portrait when a visitor has saved Human mode.
const themeScript = `(()=>{try{const saved=localStorage.getItem('javier-theme');const theme=saved==='human'||saved==='system'?saved:'system';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme==='system'?'dark':'light'}catch(e){document.documentElement.dataset.theme='system';document.documentElement.style.colorScheme='dark'}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Javier Ortiz — Senior Product Designer",
    template: "%s — Javier Ortiz",
  },
  description:
    "Javier Ortiz is a Senior Product Designer for complex platforms, rule engines, CMS and AI-assisted product work, with recent Lead experience.",
  authors: [{ name: "Javier Ortiz" }],
  openGraph: {
    title: "Javier Ortiz — Senior Product Designer for complex platforms",
    description: "Senior Product Designer working across complex backoffice products, design systems and AI-assisted prototypes.",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Javier Ortiz portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Javier Ortiz — Senior Product Designer",
    description: "Complex product design, visual craft, AI-assisted workflows and coded prototypes.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0e10" },
    { media: "(prefers-color-scheme: light)", color: "#f3f0e8" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The pre-paint script intentionally changes data-theme before hydration.
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="theme-wipe" aria-hidden="true" />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <MotionController />
      </body>
    </html>
  );
}
