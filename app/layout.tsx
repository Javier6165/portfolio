import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource-variable/instrument-sans/wdth-italic.css";
import "@fontsource/fragment-mono/400.css";
import "./globals.css";
import "./ordered-home.css";
import { SiteFooter, SiteHeader } from "./components/SiteShell";
import { MotionController } from "./components/MotionController";
import { siteConfig } from "./config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Javier Ortiz — Lead Product Designer",
    template: "%s — Javier Ortiz",
  },
  description:
    "Javier Ortiz is a Lead Product Designer working across complex B2B platforms, design systems and AI-assisted product work.",
  authors: [{ name: "Javier Ortiz" }],
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Javier Ortiz — Lead Product Designer for complex platforms",
    description: "Lead Product Designer working across complex backoffice products, design systems and AI-assisted prototypes.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Javier Ortiz — Lead Product Designer",
    description: "Complex product design, visual craft, AI-assisted workflows and coded prototypes.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f3",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="100x100" />
        <link rel="shortcut icon" href="/favicon.png" />
        <script dangerouslySetInnerHTML={{ __html: `try{if(location.pathname==='/'&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(pointer: fine)').matches&&innerWidth>900&&new URLSearchParams(location.search).get('studio')!=='off'&&(new URLSearchParams(location.search).get('studio')==='reset'||!sessionStorage.getItem('jo-studio-intro-v1'))){document.documentElement.dataset.studioIntro='on';setTimeout(()=>{delete document.documentElement.dataset.studioIntro},15000)}}catch(e){}` }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <MotionController />
      </body>
    </html>
  );
}
