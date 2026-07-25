"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./PageProgress.module.css";

const homeSections = [
  { id: "experience", index: "01", label: "Snapshot" },
  { id: "work", index: "02", label: "Work" },
  { id: "approach", index: "03", label: "Practice" },
  { id: "ai-practice", index: "04", label: "AI workflow" },
  { id: "about-preview", index: "05", label: "About" },
  { id: "testimonials", index: "06", label: "References" },
  { id: "playground", index: "07", label: "Playground" },
  { id: "contact", index: "08", label: "Contact" },
] as const;

export function PageProgress() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);
  const isHome = pathname === "/";
  const activeLabel = useMemo(
    () => homeSections.find((section) => section.id === activeId)?.label ?? "Overview",
    [activeId],
  );

  useEffect(() => {
    const root = document.documentElement;
    let frame: number | null = null;

    function update() {
      frame = null;
      const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      root.style.setProperty("--page-progress", progress.toFixed(4));
      root.dataset.pageScrolled = window.scrollY > 64 ? "true" : "false";

      if (!isHome) {
        setActiveId(null);
        return;
      }

      const readingLine = window.innerHeight * 0.38;
      let nextId: string | null = null;

      for (const section of homeSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= readingLine) nextId = section.id;
      }

      if (window.scrollY + window.innerHeight >= root.scrollHeight - 4) nextId = "contact";
      setActiveId((current) => current === nextId ? current : nextId);
    }

    function scheduleUpdate() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [isHome, pathname]);

  if (!isHome) return null;

  return (
    <nav className={styles.rail} aria-label="On this page" data-page-progress>
      <span className={styles.current} aria-hidden="true">{activeLabel}</span>
      <ol>
        {homeSections.map((section) => (
          <li key={section.id}>
            <Link
              className={styles.link}
              href={`#${section.id}`}
              aria-label={`${section.index} — ${section.label}`}
              aria-current={activeId === section.id ? "location" : undefined}
            >
              <span className={styles.label} aria-hidden="true">{section.label}</span>
              <span className={styles.index} aria-hidden="true">{section.index}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
