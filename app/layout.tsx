import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource/fragment-mono/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { ExperienceSettings, MemoryConsent } from "./components/live-file/ExperienceSettings";
import { NarrativeProvider } from "./components/live-file/NarrativeProvider";
import { MotionController } from "./components/MotionController";
import { SiteFooter, SiteHeader } from "./components/SiteShell";
import { siteConfig } from "./config";

// Appearance and narrative eligibility are resolved before paint. The script
// changes attributes only: semantic content remains identical on server/client.
const appearanceScript = `(()=>{const root=document.documentElement;try{const saved=localStorage.getItem('javier-theme');const theme=saved==='human'||saved==='system'?saved:'system';root.dataset.theme=theme;root.style.colorScheme=theme==='system'?'dark':'light';const params=new URLSearchParams(location.search);if(params.get('narrative')==='reset'){localStorage.removeItem('javier-narrative-memory-v1');localStorage.removeItem('javier-narrative-consent');sessionStorage.removeItem('javier-narrative-session-v1');sessionStorage.removeItem('javier-narrative-counted-v1')}const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('javier-motion')==='reduce';root.dataset.motion=reduce?'reduce':'full';let mode='first';const forced=params.get('narrative');const done=sessionStorage.getItem('javier-narrative-session-v1')==='complete';if(reduce||done)mode='static';else if(forced==='first'||forced==='return'||forced==='familiar')mode=forced;else if(localStorage.getItem('javier-narrative-consent')==='granted'){try{const memory=JSON.parse(localStorage.getItem('javier-narrative-memory-v1')||'null');if(memory&&Date.parse(memory.expiresAt)>Date.now())mode=memory.visitCount>=2?'familiar':'return'}catch(e){}}root.dataset.narrative=mode}catch(e){root.dataset.theme='system';root.dataset.motion='full';root.dataset.narrative='first';root.style.colorScheme='dark'}})()`;

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
    images: [{ url: "/og-live-file.jpg", width: 1200, height: 630, alt: "Javier Ortiz — Senior Product Designer, Live File portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Javier Ortiz — Senior Product Designer",
    description: "Complex product design, visual craft, AI-assisted workflows and coded prototypes.",
    images: ["/og-live-file.jpg"],
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
      <head><script dangerouslySetInnerHTML={{ __html: appearanceScript }} /></head>
      <body>
        <NarrativeProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <div className="theme-wipe" aria-hidden="true" />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter experienceSettings={<ExperienceSettings />} />
          <MotionController />
          <MemoryConsent />
        </NarrativeProvider>
      </body>
    </html>
  );
}
