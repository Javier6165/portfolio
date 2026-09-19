import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource/fragment-mono/400.css";
import "./globals.css";
import { MotionController } from "./components/MotionController";
import { PageProgress } from "./components/PageProgress";
import { SiteFooter, SiteHeader } from "./components/SiteShell";
import { siteConfig } from "./config";

// Motion and narrative eligibility are resolved before paint. Dark is the only
// visual mode, so the bootstrap no longer reads appearance preferences.
const appearanceScript = `(()=>{const root=document.documentElement;try{const portrait=document.createElement('link');portrait.rel='preload';portrait.as='image';portrait.type='image/avif';portrait.setAttribute('imagesrcset','/images/portraits/hero-system-960.avif 960w, /images/portraits/hero-system-1440.avif 1440w');portrait.setAttribute('imagesizes','(max-width: 720px) 92vw, 48vw');portrait.fetchPriority='high';document.head.appendChild(portrait);root.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('javier-motion')==='reduce'?'reduce':'full'}catch(e){root.dataset.motion='full'}root.dataset.narrative='static'})()`;

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
  themeColor: "#0d0e10",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The pre-paint script changes only narrative and motion attributes.
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: appearanceScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <PageProgress />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <MotionController />
      </body>
    </html>
  );
}
