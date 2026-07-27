"use client";

import { useLayoutEffect, useRef, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { EditorPrimitives } from "./EditorPrimitives";
import { useLiveSceneDirector, type LiveSceneTool, type LiveSceneVerb } from "./LiveSceneDirector";
import styles from "./LiveScene.module.css";

type LiveSceneProps = {
  id: string;
  verb: LiveSceneVerb;
  label: string;
  action: string;
  children: ReactNode;
  targetSelector: string;
  tool: LiveSceneTool;
  properties: string[];
  readMs?: number;
  spotlightMs?: number;
  minVisibility?: number;
  comment?: string;
  commentFirst?: boolean;
  draftLabel?: string;
  className?: string;
};

export function LiveScene({
  id,
  verb,
  label,
  action,
  children,
  targetSelector,
  tool,
  properties,
  readMs = 2_600,
  spotlightMs = 8_000,
  minVisibility = 0.58,
  comment,
  commentFirst = false,
  draftLabel,
  className = "",
}: LiveSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { introComplete, mandatoryFirstVisit, reducedMotion, registerScene, settleScene, replayToken } = useLiveSceneDirector();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !introComplete) return;
    return registerScene(root, { id, verb, label, action, targetSelector, tool, properties, readMs, spotlightMs, minVisibility, comment, commentFirst });
  }, [action, comment, commentFirst, id, introComplete, label, minVisibility, properties, readMs, reducedMotion, registerScene, replayToken, spotlightMs, targetSelector, tool, verb]);

  function handOff(event: PointerEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root || event.target === root || mandatoryFirstVisit) return;
    settleScene(root, true);
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.scene} ${className}`}
      data-live-scene={id}
      data-live-verb={verb}
      data-live-state="settled"
      onPointerDownCapture={handOff}
      onFocusCapture={handOff}
    >
      {children}
      <span className={styles.draftStatus} aria-hidden="true"><i /> {draftLabel ?? `WIP · ${verb} pending`}</span>
      <span className={styles.finalStatus} aria-hidden="true"><i /> {label}</span>
      <EditorPrimitives tool={tool} properties={properties} comment={comment} />
    </div>
  );
}
