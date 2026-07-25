"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { usePathname } from "next/navigation";
import { useNarrative } from "./NarrativeProvider";
import styles from "./LiveScene.module.css";

export type LiveSceneVerb =
  | "clarify"
  | "frame"
  | "propagate"
  | "activate"
  | "experiment"
  | "reframe"
  | "handoff";

export type LiveSceneConfig = {
  id: string;
  verb: LiveSceneVerb;
  targetSelector: string;
  durationMs: number;
  autoVisitTier: 1 | 2;
};

type DirectorContextValue = {
  introComplete: boolean;
  reducedMotion: boolean;
  requestScene: (root: HTMLElement, config: LiveSceneConfig, velocity: number) => void;
  settleScene: (root: HTMLElement) => void;
};

const SEEN_SCENES_KEY = "javier-live-scenes-v1";
const DirectorContext = createContext<DirectorContextValue | null>(null);

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function readSeenScenes() {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(SEEN_SCENES_KEY) ?? "[]") as unknown;
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

export function LiveSceneDirector({ children }: { children: ReactNode }) {
  const { hasSeenCue, introComplete, markCueSeen, reducedMotion, visitTier } = useNarrative();
  const pathname = usePathname();
  const experienceReady = introComplete || pathname !== "/";
  const cursorRef = useRef<HTMLDivElement>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeRootRef = useRef<HTMLElement | null>(null);
  const seenScenesRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    seenScenesRef.current = readSeenScenes();
    return () => activeTimelineRef.current?.kill();
  }, []);

  const persistSeenScene = useCallback((sceneId: string) => {
    const seen = seenScenesRef.current ?? readSeenScenes();
    seen.add(sceneId);
    seenScenesRef.current = seen;
    try {
      window.sessionStorage.setItem(SEEN_SCENES_KEY, JSON.stringify([...seen]));
    } catch {
      // Scene memory is an enhancement and never blocks the finished state.
    }
    markCueSeen(sceneId);
  }, [markCueSeen]);

  const settleScene = useCallback((root: HTMLElement) => {
    if (activeRootRef.current === root) {
      activeTimelineRef.current?.kill();
      activeTimelineRef.current = null;
      activeRootRef.current = null;
      if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 });
    }
    root.dataset.liveState = reducedMotion ? "reduced" : "settled";
  }, [reducedMotion]);

  const requestScene = useCallback((root: HTMLElement, config: LiveSceneConfig, velocity: number) => {
    if (root.dataset.liveState === "settled" || root.dataset.liveState === "reduced") return;

    const seen = seenScenesRef.current ?? readSeenScenes();
    seenScenesRef.current = seen;
    const shouldSettle = reducedMotion
      || visitTier > config.autoVisitTier
      || hasSeenCue(config.id)
      || seen.has(config.id)
      || Math.abs(velocity) > 1_800;

    if (shouldSettle) {
      settleScene(root);
      return;
    }

    if (activeRootRef.current && activeRootRef.current !== root) {
      activeRootRef.current.dataset.liveState = "settled";
      activeTimelineRef.current?.kill();
    }

    const target = root.querySelector<HTMLElement>(config.targetSelector) ?? root;
    const rootBounds = root.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    root.style.setProperty("--live-x", `${targetBounds.left - rootBounds.left}px`);
    root.style.setProperty("--live-y", `${targetBounds.top - rootBounds.top}px`);
    root.style.setProperty("--live-w", `${targetBounds.width}px`);
    root.style.setProperty("--live-h", `${targetBounds.height}px`);
    root.style.setProperty("--live-duration", `${config.durationMs / 1_000}s`);
    root.dataset.liveState = "playing";
    activeRootRef.current = root;
    persistSeenScene(config.id);

    const announceAction = () => {
      window.dispatchEvent(new CustomEvent("portfolio-live-scene-play", { detail: { id: config.id } }));
    };
    const complete = () => {
      root.dataset.liveState = "settled";
      activeRootRef.current = null;
      activeTimelineRef.current = null;
    };

    const noMouseCursor = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;
    if (noMouseCursor || !cursorRef.current) {
      announceAction();
      activeTimelineRef.current = gsap.timeline().call(complete, [], config.durationMs / 1_000);
      return;
    }

    const cursor = cursorRef.current;
    const endX = clamp(targetBounds.left + targetBounds.width * 0.58, 24, window.innerWidth - 96);
    const endY = clamp(targetBounds.top + targetBounds.height * 0.42, 32, window.innerHeight - 72);
    const direction = endX > window.innerWidth / 2 ? 1 : -1;
    const startX = clamp(endX + direction * 110, 20, window.innerWidth - 90);
    const startY = clamp(endY - 76, 24, window.innerHeight - 80);
    const duration = config.durationMs / 1_000;

    gsap.set(cursor, { x: startX, y: startY, opacity: 0, scale: 0.9 });
    const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    activeTimelineRef.current = timeline;
    timeline
      .to(cursor, { opacity: 1, scale: 1, duration: 0.14 }, 0)
      .to(cursor, {
        duration: Math.min(0.62, duration * 0.34),
        motionPath: {
          path: [
            { x: startX, y: startY },
            { x: endX + direction * 34, y: endY - 24 },
            { x: endX, y: endY },
          ],
          curviness: 1.25,
        },
      }, 0.08)
      .call(announceAction, [], Math.min(0.48, duration * 0.26))
      .to(cursor, { x: endX + 2, y: endY - 2, duration: 0.18, ease: "power2.inOut" }, Math.min(0.72, duration * 0.42))
      .to(cursor, { opacity: 0, duration: 0.2, ease: "power2.out" }, Math.max(0.8, duration - 0.3))
      .call(complete, [], duration);
  }, [hasSeenCue, persistSeenScene, reducedMotion, settleScene, visitTier]);

  const value = useMemo<DirectorContextValue>(() => ({
    introComplete: experienceReady,
    reducedMotion,
    requestScene,
    settleScene,
  }), [experienceReady, reducedMotion, requestScene, settleScene]);

  return (
    <DirectorContext.Provider value={value}>
      {children}
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
        <i /><span>Javier</span>
      </div>
    </DirectorContext.Provider>
  );
}

export function useLiveSceneDirector() {
  const context = useContext(DirectorContext);
  if (!context) throw new Error("useLiveSceneDirector must be used inside LiveSceneDirector");
  return context;
}
