"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PortfolioTheme, SystemDomain } from "./ComplexityScene";

const ComplexityScene = dynamic(
  () => import("./ComplexityScene").then((module) => module.ComplexityScene),
  { ssr: false, loading: () => <div className="complexity-engine__loading" /> },
);

const domains: { id: SystemDomain; label: string; detail: string }[] = [
  { id: "rules", label: "Rules", detail: "Reveal consequence before configuration." },
  { id: "content", label: "Content", detail: "Give structure to every state and owner." },
  { id: "operations", label: "Operations", detail: "Connect edge cases without exposing the maze." },
  { id: "ai", label: "AI build", detail: "Move from idea to testable behaviour sooner." },
];

export function ComplexityEngine() {
  const [domain, setDomain] = useState<SystemDomain>("rules");
  const [theme, setTheme] = useState<PortfolioTheme>("system");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === "human" ? "human" : "system");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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

  const active = domains.find((item) => item.id === domain) ?? domains[0];

  return (
    <div className="complexity-engine theme-swap" data-domain={domain}>
      <div className="complexity-engine__canvas" aria-hidden="true">
        <ComplexityScene domain={domain} theme={theme} reducedMotion={reducedMotion} />
      </div>
      <div className="complexity-engine__hud">
        <div className="complexity-engine__signal"><i /> Live system / input enabled</div>
        <div className="complexity-engine__domains" role="group" aria-label="Explore system domains">
          {domains.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={domain === item.id}
              onClick={() => setDomain(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p aria-live="polite"><span>{active.label}</span>{active.detail}</p>
      </div>
    </div>
  );
}
