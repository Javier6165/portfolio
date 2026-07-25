"use client";

import { useLayoutEffect, useRef, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLiveSceneDirector, type LiveSceneConfig, type LiveSceneVerb } from "./LiveSceneDirector";
import styles from "./LiveScene.module.css";

type LiveSceneProps = {
  id: string;
  verb: LiveSceneVerb;
  label: string;
  children: ReactNode;
  targetSelector: string;
  durationMs?: number;
  dwellMs?: number;
  autoVisitTier?: 1 | 2;
  comment?: string;
  className?: string;
};

export function LiveScene({
  id,
  verb,
  label,
  children,
  targetSelector,
  durationMs = 1_600,
  dwellMs = 650,
  autoVisitTier = 1,
  comment,
  className = "",
}: LiveSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { introComplete, reducedMotion, requestScene, settleScene } = useLiveSceneDirector();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !introComplete) return;
    if (reducedMotion) {
      settleScene(root);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const config: LiveSceneConfig = { id, verb, targetSelector, durationMs, autoVisitTier };
    let dwellTimer = 0;

    const finishOnExit = () => {
      window.clearTimeout(dwellTimer);
      if (root.dataset.liveState === "armed" || root.dataset.liveState === "playing") settleScene(root);
    };

    const trigger = ScrollTrigger.create({
      id: `live-scene-${id}`,
      trigger: root,
      // The section is allowed to land before Javier intervenes. This keeps the
      // choreography subordinate to reading and avoids effects firing off-screen.
      start: () => window.matchMedia("(max-width: 720px), (pointer: coarse)").matches ? "top 74%" : "top 66%",
      onEnter: (self) => {
        if (root.dataset.liveState !== "idle") return;
        const entryVelocity = self.getVelocity();
        if (Math.abs(entryVelocity) > 1_800) {
          requestScene(root, config, entryVelocity);
          return;
        }
        root.dataset.liveState = "armed";
        dwellTimer = window.setTimeout(() => requestScene(root, config, entryVelocity), dwellMs);
      },
      onUpdate: (self) => {
        if (root.dataset.liveState === "armed" && Math.abs(self.getVelocity()) > 1_800) finishOnExit();
      },
      onLeave: finishOnExit,
      onLeaveBack: finishOnExit,
    });

    const handleVisibility = () => {
      if (document.hidden) finishOnExit();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(dwellTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      trigger.kill();
    };
  }, [autoVisitTier, durationMs, dwellMs, id, introComplete, reducedMotion, requestScene, settleScene, targetSelector, verb]);

  function handOff(event: PointerEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root || event.target === root) return;
    settleScene(root);
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.scene} ${className}`}
      data-live-scene={id}
      data-live-verb={verb}
      data-live-state="idle"
      onPointerDownCapture={handOff}
      onFocusCapture={handOff}
    >
      {children}
      <div className={styles.selection} aria-hidden="true"><i /><i /><i /><i /></div>
      <span className={styles.status} aria-hidden="true">{label}</span>
      {comment ? <div className={styles.comment} aria-hidden="true"><b>JO</b><span>{comment}</span></div> : null}
    </div>
  );
}
