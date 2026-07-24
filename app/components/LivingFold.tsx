"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PortfolioTheme } from "./LivingFoldScene";

const LivingFoldScene = dynamic(
  () => import("./LivingFoldScene").then((module) => module.LivingFoldScene),
  { ssr: false, loading: () => null },
);

/**
 * The CSS fold remains in the document as an intentional static fallback.
 * WebGL progressively adds depth, pointer response and the scroll hand-off.
 */
export function LivingFold() {
  const [theme, setTheme] = useState<PortfolioTheme>("system");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === "human" ? "human" : "system");
    const syncMotion = () => setReducedMotion(motionQuery.matches);

    syncTheme();
    syncMotion();
    window.addEventListener("portfolio-theme-change", syncTheme);
    motionQuery.addEventListener("change", syncMotion);

    return () => {
      window.removeEventListener("portfolio-theme-change", syncTheme);
      motionQuery.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div className="living-fold theme-swap" aria-hidden="true">
      <div className="living-fold__aura" />
      <div className="living-fold__fallback">
        <i className="living-fold__fallback-sheet" />
        <i className="living-fold__fallback-ridge living-fold__fallback-ridge--one" />
        <i className="living-fold__fallback-ridge living-fold__fallback-ridge--two" />
      </div>
      <div className="living-fold__canvas">
        <LivingFoldScene theme={theme} reducedMotion={reducedMotion} />
      </div>
      <div className="living-fold__grain" />
    </div>
  );
}
