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
    const trigger = ScrollTrigger.create({
      id: `live-scene-${id}`,
      trigger: root,
      start: "top 72%",
      once: true,
      onEnter: (self) => requestScene(root, config, self.getVelocity()),
    });

    return () => trigger.kill();
  }, [autoVisitTier, durationMs, id, introComplete, reducedMotion, requestScene, settleScene, targetSelector, verb]);

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
