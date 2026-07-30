import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource/fragment-mono/400.css";
import "./globals.css";
import { ExperienceSettings } from "./components/live-file/ExperienceSettings";
import { LiveSceneDirector } from "./components/live-file/LiveSceneDirector";
import { NarrativeProvider } from "./components/live-file/NarrativeProvider";
import { MotionController } from "./components/MotionController";
import { PageProgress } from "./components/PageProgress";
import { SiteFooter, SiteHeader } from "./components/SiteShell";
import { siteConfig } from "./config";

// Motion and narrative eligibility are resolved before paint. Dark is the only
// visual mode, so the bootstrap no longer reads appearance preferences.
const appearanceScript = `(()=>{const root=document.documentElement;try{const portrait=document.createElement('link');portrait.rel='preload';portrait.as='image';portrait.type='image/avif';portrait.setAttribute('imagesrcset','/images/portraits/hero-system-960.avif 960w, /images/portraits/hero-system-1440.avif 1440w');portrait.setAttribute('imagesizes','(max-width: 720px) 92vw, 48vw');portrait.fetchPriority='high';document.head.appendChild(portrait);const params=new URLSearchParams(location.search);if(params.get('narrative')==='reset'){localStorage.removeItem('javier-narrative-memory-v1');localStorage.removeItem('javier-narrative-consent');sessionStorage.removeItem('javier-narrative-session-v1');sessionStorage.removeItem('javier-narrative-counted-v1');sessionStorage.removeItem('javier-director-beats-v1')}const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('javier-motion')==='reduce';root.dataset.motion=reduce?'reduce':'full';let mode='first';const forced=params.get('narrative');const done=sessionStorage.getItem('javier-narrative-session-v1')==='complete';if(reduce||done)mode='static';else if(forced==='first'||forced==='return'||forced==='familiar')mode=forced;else if(localStorage.getItem('javier-narrative-consent')==='granted'){try{const memory=JSON.parse(localStorage.getItem('javier-narrative-memory-v1')||'null');if(memory&&Date.parse(memory.expiresAt)>Date.now())mode=memory.visitCount>=2?'familiar':'return'}catch(e){}}root.dataset.narrative=mode}catch(e){root.dataset.motion='full';root.dataset.narrative='first'}})()`;

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
  themeColor: "#0d0e10",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The pre-paint script changes only narrative and motion attributes.
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: appearanceScript }} /></head>
      <body>
        <template
          data-impeccable-contract="d3549a99"
          dangerouslySetInnerHTML={{ __html: `<!--
THESIS: Javier is caught refining the real portfolio inside recognisable Figma UI3; the editor disappears instead of becoming the portfolio's permanent skin.
OWN-WORLD: Authentic white UI3 chrome and cobalt collaboration marks surround a carbon, bone-white and muted-brass editorial portfolio with integrated photography and restrained geometry.
STORY: The visitor sees Javier working, is acknowledged, watches him activate Present, then explores freely; later guidance is optional and quiet.
FIRST VIEWPORT: A large selected hero artboard dominates the canvas, portrait on the right, Javier Ortiz and Senior Product Designer on the left, with Present at top-right and Explore only after handoff.
FORM: Interrupted working file to living editorial dossier; approved close-up composition; seed d3549a99.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->` }}
        />
        <NarrativeProvider>
          <LiveSceneDirector>
            <a className="skip-link" href="#main-content">Skip to content</a>
            <SiteHeader />
            <PageProgress />
            <main id="main-content">{children}</main>
            <SiteFooter experienceSettings={<ExperienceSettings />} />
            <MotionController />
          </LiveSceneDirector>
        </NarrativeProvider>
      </body>
    </html>
  );
}
