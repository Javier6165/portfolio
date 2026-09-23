"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

type Reveal = () => void;

export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ordered-home, .ordered-about, .ordered-case");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduce") return;

    const context = gsap.context(() => {}, root);
    const reveals = new Map<Element, Reveal>();
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const reveal = reveals.get(entry.target);
            if (reveal) context.add(reveal);
            reveals.delete(entry.target);
          });
        }, { threshold: .08, rootMargin: "0px 0px -5% 0px" })
      : null;

    const watch = (element: Element | null, reveal: Reveal) => {
      if (!element) return;
      if (observer) { reveals.set(element, reveal); observer.observe(element); }
      else context.add(reveal);
    };
    const rise = (targets: Element | Element[], stagger = 0) => {
      gsap.fromTo(targets, { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: .68, stagger, ease: "power3.out",
        clearProps: "opacity,visibility,transform",
      });
    };
    const revealMedia = (element: Element) => {
      gsap.fromTo(element, { clipPath: "inset(0 5% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration: .82, ease: "power3.out", clearProps: "clipPath",
      });
    };

    if (pathname === "/") {
      const hero = root.querySelector("section[aria-labelledby='hero-title']");
      if (hero && document.documentElement.dataset.studioIntro !== "on") {
        document.documentElement.dataset.siteEntrance = "active";
        context.add(() => {
          const identity = hero.querySelector("h1")?.parentElement;
          const portrait = hero.querySelector("figure");
          const timeline = gsap.timeline({ onComplete: () => { delete document.documentElement.dataset.siteEntrance; } });
          if (identity) timeline.fromTo(identity, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .78, ease: "power3.out", clearProps: "opacity,visibility,transform" }, 0);
          if (portrait) timeline.fromTo(portrait, { clipPath: "inset(0 0 9% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: .9, ease: "power3.out", clearProps: "clipPath" }, .12);
        });
      }

      const facts = root.querySelector("#experience ul");
      watch(facts, () => { const items = [...(facts?.querySelectorAll("li") ?? [])]; if (items.length) rise(items, .07); });
      root.querySelectorAll("#work a[href^='/work/']").forEach((entry) => watch(entry, () => {
        const visual = entry.querySelector("[aria-hidden='true']");
        if (visual) revealMedia(visual);
        const copy = entry.querySelector("h3");
        if (copy) rise(copy);
      }));
      const about = root.querySelector("#about-preview [data-home-entry='split']");
      watch(about, () => {
        const portrait = about?.querySelector("figure");
        const copy = about?.querySelector("h2")?.parentElement;
        if (portrait) revealMedia(portrait);
        if (copy) rise(copy);
      });
      root.querySelectorAll("#testimonials figure").forEach((quote) => watch(quote, () => rise(quote)));
      root.querySelectorAll("#how-i-work details").forEach((question) => watch(question, () => rise(question)));
    } else if (root.classList.contains("ordered-case")) {
      document.documentElement.dataset.siteEntrance = "active";
      context.add(() => {
        const hero = root.querySelector("[data-case-hero]");
        const evidence = root.querySelector("[data-case-evidence]");
        const timeline = gsap.timeline({ onComplete: () => { delete document.documentElement.dataset.siteEntrance; } });
        if (hero) timeline.fromTo([...hero.children], { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1, y: 0, duration: .72, stagger: .12, ease: "power3.out", clearProps: "opacity,visibility,transform",
        }, 0);
        if (evidence) timeline.fromTo(evidence, { autoAlpha: 0, y: 16 }, {
          autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", clearProps: "opacity,visibility,transform",
        }, .24);
      });
      root.querySelectorAll("[data-case-chapter]").forEach((chapter) => watch(chapter, () => {
        const head = chapter.querySelector("h2");
        const body = chapter.querySelector("[data-case-copy]");
        if (head && body) rise([head, body], .1);
      }));
      root.querySelectorAll("[data-case-media]").forEach((media) => watch(media, () => revealMedia(media)));
    } else {
      const heroParts = [...root.querySelectorAll(".js-hero-reveal")];
      if (heroParts.length) {
        document.documentElement.dataset.siteEntrance = "active";
        context.add(() => {
          gsap.fromTo(heroParts, { autoAlpha: 0, y: 18 }, {
            autoAlpha: 1, y: 0, duration: .72, stagger: .09, ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            onComplete: () => { delete document.documentElement.dataset.siteEntrance; },
          });
        });
      }
      root.querySelectorAll(".js-reveal").forEach((element) => watch(element, () => rise(element)));
    }

    const footer = document.querySelector(".site-footer .footer-grid");
    watch(footer, () => { if (footer) rise([...footer.children], .08); });

    return () => {
      observer?.disconnect();
      reveals.clear();
      context.revert();
      delete document.documentElement.dataset.siteEntrance;
    };
  }, [pathname]);

  return null;
}
