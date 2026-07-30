"use client";

import { useEffect } from "react";

// The previous chapter rail and progress line competed with the portfolio.
// Keep only the lightweight scrolled state used to give the fixed header a
// readable surface; section navigation already exists in the primary menu.
export function PageProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let frame: number | null = null;

    const update = () => {
      frame = null;
      root.dataset.pageScrolled = window.scrollY > 64 ? "true" : "false";
    };
    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
