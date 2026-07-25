"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || document.documentElement.dataset.motion === "reduce") return;

    let cancelled = false;
    let context: gsap.Context | null = null;

    const onThemeChange = () => {
      gsap.fromTo(
        ".theme-wipe",
        { scaleX: 0, transformOrigin: "left center", opacity: 1 },
        { scaleX: 1, duration: 0.32, ease: "power3.in", yoyo: true, repeat: 1, repeatDelay: 0.04 },
      );
      const themeSwaps = gsap.utils.toArray<HTMLElement>(".theme-swap");
      if (themeSwaps.length) {
        gsap.fromTo(
          themeSwaps,
          { opacity: 0.35, scale: 1.012 },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out", clearProps: "transform" },
        );
      }
    };

    window.addEventListener("portfolio-theme-change", onThemeChange);

    async function setupRouteMotion() {
      // Home has a deliberate Live File score. A second set of generic reveal
      // triggers would dim content before the authored WIP → edit transition.
      if (pathname === "/") return;

      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const heroReveals = gsap.utils.toArray<HTMLElement>(".js-hero-reveal");
        if (heroReveals.length) {
          gsap.fromTo(
            heroReveals,
            { y: 36, opacity: 0.25 },
            { y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: "power4.out", clearProps: "transform" },
          );
        }

        gsap.utils.toArray<HTMLElement>(".js-reveal").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 24, opacity: 0.68 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });

        const line = document.querySelector<HTMLElement>(".throughline__progress");
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: ".throughline", start: "top 70%", end: "bottom 70%", scrub: 0.5 },
            },
          );
        }
      });
    }

    void setupRouteMotion();

    return () => {
      cancelled = true;
      window.removeEventListener("portfolio-theme-change", onThemeChange);
      context?.revert();
    };
  }, [pathname]);

  return null;
}
