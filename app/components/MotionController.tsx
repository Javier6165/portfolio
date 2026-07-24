"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionController() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo(
        ".js-hero-reveal",
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: "power4.out" },
      );

      gsap.fromTo(
        ".hero-portrait",
        { clipPath: "inset(0 0 100% 0)", scale: 1.04 },
        { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.35, delay: 0.15, ease: "power4.inOut" },
      );

      gsap.utils.toArray<HTMLElement>(".js-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
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
        ".theme-swap",
        { opacity: 0.35, scale: 1.012 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
      );
    };
    window.addEventListener("portfolio-theme-change", onThemeChange);

    return () => {
      window.removeEventListener("portfolio-theme-change", onThemeChange);
      context.revert();
    };
  }, []);

  return null;
}
