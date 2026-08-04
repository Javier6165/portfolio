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
    let observer: IntersectionObserver | null = null;

    async function setupRouteMotion() {
      if (pathname === "/") {
        if (!("IntersectionObserver" in window)) return;
        const entries = gsap.utils.toArray<HTMLElement>("[data-home-entry]");
        const prepared = new Map<HTMLElement, HTMLElement[]>();

        context = gsap.context(() => {
          entries.forEach((element) => {
            const kind = element.dataset.homeEntry;
            const targets = kind === "facts"
              ? gsap.utils.toArray<HTMLElement>(":scope > li", element)
              : kind === "cut"
                ? [
                    element.querySelector<HTMLElement>("h2"),
                    element.querySelector<HTMLElement>("header > p"),
                    element.querySelector<HTMLElement>("figure"),
                  ].filter((target): target is HTMLElement => Boolean(target))
                : kind === "case"
                  ? [element.querySelector<HTMLElement>(".project-card-shell")].filter((target): target is HTMLElement => Boolean(target))
                  : gsap.utils.toArray<HTMLElement>(":scope > *", element);

            prepared.set(element, targets);
            if (kind === "facts") gsap.set(targets, { clipPath: "inset(0 0 100% 0)", y: 18 });
            if (kind === "cut") {
              gsap.set(targets[0], { clipPath: "inset(0 0 100% 0)", yPercent: 14 });
              gsap.set(targets[1], { opacity: .28, y: 14 });
              gsap.set(targets[2], { clipPath: "inset(0 0 16% 0)" });
            }
            if (kind === "case") gsap.set(targets, { clipPath: "inset(0 12% 0 0)", x: -18 });
            if (kind === "split") {
              gsap.set(targets[0], { clipPath: "inset(0 16% 0 0)" });
              gsap.set(targets[1], { opacity: .3, y: 18 });
            }
            if (kind === "timeline") {
              gsap.set(targets[0], { clipPath: "inset(0 0 14% 0)" });
              gsap.set(targets[1], { opacity: .3, y: 16 });
            }
          });
        });

        observer = new IntersectionObserver((observed) => {
          observed.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            const targets = prepared.get(element) ?? [];
            const kind = element.dataset.homeEntry;
            const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
            if (kind === "facts") timeline.to(targets, { clipPath: "inset(0 0 0% 0)", y: 0, duration: .68, stagger: .075, clearProps: "clipPath,transform" });
            if (kind === "cut") {
              timeline.to(targets[0], { clipPath: "inset(0 0 0% 0)", yPercent: 0, duration: .68, clearProps: "clipPath,transform" })
                .to(targets[1], { opacity: 1, y: 0, duration: .46, clearProps: "opacity,transform" }, .16)
                .to(targets[2], { clipPath: "inset(0 0 0% 0)", duration: .82, clearProps: "clipPath" }, .22);
            }
            if (kind === "case") timeline.to(targets, { clipPath: "inset(0 0% 0 0)", x: 0, duration: .82, clearProps: "clipPath,transform" });
            if (kind === "split" || kind === "timeline") {
              timeline.to(targets[0], { clipPath: "inset(0 0% 0 0)", duration: .78, clearProps: "clipPath" })
                .to(targets[1], { opacity: 1, y: 0, duration: .58, clearProps: "opacity,transform" }, .16);
            }
            observer?.unobserve(element);
          });
        }, { threshold: .16, rootMargin: "0px 0px -6% 0px" });
        entries.forEach((element) => observer?.observe(element));
        return;
      }

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
      observer?.disconnect();
      context?.revert();
    };
  }, [pathname]);

  return null;
}
