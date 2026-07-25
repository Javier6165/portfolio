"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useNarrative } from "./NarrativeProvider";
import styles from "./NarrativeCue.module.css";

type NarrativeCueProps = {
  children: ReactNode;
  className?: string;
  cueId: string;
  kind: "trajectory" | "work" | "prototype";
  message: string;
};

export function NarrativeCue({ children, className = "", cueId, kind, message }: NarrativeCueProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeCueId, requestCue } = useNarrative();
  const active = activeCueId === cueId;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let retryTimer: number | null = null;
    let stopped = false;

    const attempt = () => {
      if (stopped || requestCue(cueId)) return;
      retryTimer = window.setTimeout(attempt, 2_000);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.48) attempt();
      else if (retryTimer) {
        window.clearTimeout(retryTimer);
        retryTimer = null;
      }
    }, { threshold: [0.48, 0.72] });

    observer.observe(root);
    return () => {
      stopped = true;
      observer.disconnect();
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [cueId, requestCue]);

  return (
    <div ref={rootRef} className={`${styles.anchor} ${className}`} data-kind={kind} data-active={active ? "true" : "false"}>
      {children}
      <div className={styles.overlay} aria-hidden="true">
        <div className={styles.bounds}><i /><i /><i /><i /><span>{kind === "trajectory" ? "CAREER / PATH" : kind === "work" ? "FRAME / SELECTED" : "PROTOTYPE / LIVE"}</span></div>
        <div className={styles.cursor}><i /><span>Javier</span></div>
        <div className={styles.comment}><b>JO</b><span>{message}</span></div>
      </div>
    </div>
  );
}
