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
    "Senior Product Designer for rule engines, complex platforms and AI-assisted product work. I design the systems behind the screen.",
  authors: [{ name: "Javier Ortiz" }],
  openGraph: {
    title: "Javier Ortiz — I design the systems behind the screen",
    description: "Complex product systems, made clear, testable and ready to scale.",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Javier Ortiz portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Javier Ortiz — Senior Product Designer",
    description: "I design the systems behind the screen.",
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
