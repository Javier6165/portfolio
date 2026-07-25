"use client";

import { useSyncExternalStore } from "react";

type Theme = "system" | "human";

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(
    (onStoreChange) => {
      window.addEventListener("portfolio-theme-change", onStoreChange);
      return () => window.removeEventListener("portfolio-theme-change", onStoreChange);
    },
    () => document.documentElement.dataset.theme === "human" ? "human" : "system",
    () => "system",
  );

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === "human" ? "human" : "system";
    const next = current === "system" ? "human" : "system";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next === "system" ? "dark" : "light";
    try {
      window.localStorage.setItem("javier-theme", next);
    } catch {
      // Theme switching is a document feature; persistence is optional.
    }
    // Motion listens to this small DOM contract; the theme itself never depends
    // on GSAP, so the toggle remains functional when motion is unavailable.
    window.dispatchEvent(new CustomEvent("portfolio-theme-change"));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "human" ? "Use Dark mode" : "Use Light mode"}
      aria-pressed={theme === "human"}
      title={`Current mode: ${theme === "human" ? "Light" : "Dark"}. Switch mode.`}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__dot" />
      </span>
      <span className="theme-toggle__label" aria-hidden="true">
        <span className="theme-toggle__system">Dark</span>
        <span className="theme-toggle__human">Light</span>
      </span>
    </button>
  );
}
