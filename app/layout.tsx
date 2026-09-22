import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource-variable/instrument-sans/wdth-italic.css";
import "@fontsource/fragment-mono/400.css";
import "./globals.css";
import "./ordered-home.css";
import { SiteFooter, SiteHeader } from "./components/SiteShell";
import { siteConfig } from "./config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Javier Ortiz — Senior Product Designer",
    template: "%s — Javier Ortiz",
  },
  description:
    "Javier Ortiz is a Senior Product Designer for complex platforms, rule engines, CMS and AI-assisted product work, with recent Lead experience.",
  authors: [{ name: "Javier Ortiz" }],
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Javier Ortiz — Senior Product Designer for complex platforms",
    description: "Senior Product Designer working across complex backoffice products, design systems and AI-assisted prototypes.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Javier Ortiz — Senior Product Designer",
    description: "Complex product design, visual craft, AI-assisted workflows and coded prototypes.",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
