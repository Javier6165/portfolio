import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource/fragment-mono/400.css";
import "./globals.css";
import { MotionController } from "./components/MotionController";
import { SiteFooter, SiteHeader } from "./components/SiteShell";

const themeScript = `(()=>{try{const saved=localStorage.getItem('javier-theme');const theme=saved==='human'||saved==='system'?saved:'system';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme==='system'?'dark':'light'}catch(e){document.documentElement.dataset.theme='system';document.documentElement.style.colorScheme='dark'}})()`;

export const metadata: Metadata = {
  metadataBase: new URL("https://javier-ortiz-portfolio.example"),
  title: {
    default: "Javier Ortiz — Senior Product Designer",
    template: "%s — Javier Ortiz",
  },
  description:
    "Senior Product Designer with recent lead experience, designing clear systems for complex products, platforms and teams.",
  authors: [{ name: "Javier Ortiz" }],
  openGraph: {
    title: "Javier Ortiz — Product design for complex systems",
    description: "I design the calm inside complex products.",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Javier Ortiz portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Javier Ortiz — Senior Product Designer",
    description: "I design the calm inside complex products.",
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
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
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
