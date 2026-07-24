"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionController() {
  useEffect(() => {
    // Motion is progressive enhancement. Base CSS leaves every section visible,
    // and this early return preserves that document for reduced-motion users.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Selector hooks are documented in AGENTS.md. Keeping them semantic avoids
    // coupling timelines to the page component tree.
    const context = gsap.context(() => {
      const heroReveals = gsap.utils.toArray<HTMLElement>(".js-hero-reveal");
      if (heroReveals.length) {
        gsap.fromTo(
          heroReveals,
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: "power4.out", clearProps: "transform" },
        );
      }

      const portrait = document.querySelector<HTMLElement>(".hero-portrait");
      if (portrait) {
        gsap.fromTo(
          portrait,
          { clipPath: "inset(0 0 100% 0)", scale: 1.04 },
          { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.35, delay: 0.15, ease: "power4.inOut", clearProps: "transform" },
        );
      }

      gsap.utils.toArray<HTMLElement>(".js-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
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
            scrollTrigger: {
              trigger: ".throughline",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          },
        );
      }
    });

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

    return () => {
      window.removeEventListener("portfolio-theme-change", onThemeChange);
      // Required for client navigation and development HMR: without revert(),
      // ScrollTriggers and inline transforms would accumulate.
      context.revert();
    };
  }, []);

  return null;
}
