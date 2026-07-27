"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { usePathname } from "next/navigation";
import { useNarrative } from "./NarrativeProvider";
import { SpotlightChrome, type SpotlightView } from "./SpotlightChrome";
import styles from "./LiveScene.module.css";

export type LiveSceneVerb = "clarify" | "frame" | "connect" | "operationalise" | "reframe" | "verify" | "experiment" | "handoff";
export type LiveSceneTool = "type" | "layout" | "asset" | "connections" | "workflow" | "prototype" | "timeline" | "crop" | "content-status" | "file-status";

export type LiveSceneConfig = {
  id: string;
  verb: LiveSceneVerb;
  label: string;
  action: string;
  targetSelector: string;
  tool: LiveSceneTool;
  properties: string[];
  readMs: number;
  spotlightMs: number;
  minVisibility: number;
  comment?: string;
};

type RegisteredScene = { root: HTMLElement; config: LiveSceneConfig };
type ActiveScene = RegisteredScene & { scrollY: number };

type DirectorContextValue = {
  introComplete: boolean;
  reducedMotion: boolean;
  replayToken: number;
  registerScene: (root: HTMLElement, config: LiveSceneConfig) => () => void;
  settleScene: (root: HTMLElement, userInitiated?: boolean) => void;
};

const SEEN_SCENES_KEY = "javier-live-scenes-v2";
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
  const {
    autoFollow,
    introComplete,
    liveReplayToken,
    markCueSeen,
    reducedMotion,
    replayLiveEdits,
    setAutoFollow,
  } = useNarrative();
  const pathname = usePathname();
  const experienceReady = introComplete || pathname !== "/";
  const cursorRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef(new Map<HTMLElement, LiveSceneConfig>());
  const seenRef = useRef<Set<string> | null>(null);
  const activeRef = useRef<ActiveScene | null>(null);
  const candidateRef = useRef<RegisteredScene | null>(null);
  const readTimerRef = useRef<number | null>(null);
  const stableTimerRef = useRef<number | null>(null);
  const phaseTimersRef = useRef<number[]>([]);
  const cursorTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const firstIntentRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0 });
  const resizeGuardUntilRef = useRef(0);
  const bodyStyleRef = useRef<{ position: string; top: string; width: string; paddingRight: string; overflow: string } | null>(null);
  const startSceneRef = useRef<(scene: RegisteredScene) => void>(() => undefined);
  const evaluateRef = useRef<() => void>(() => undefined);
  const [spotlight, setSpotlight] = useState<SpotlightView | null>(null);

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    seenRef.current = readSeenScenes();
    viewportRef.current = { width: window.innerWidth, height: window.innerHeight };
    return () => cursorTimelineRef.current?.kill();
  }, []);

  const persistSeen = useCallback((id: string) => {
    const seen = seenRef.current ?? readSeenScenes();
    seen.add(id);
    seenRef.current = seen;
    try { window.sessionStorage.setItem(SEEN_SCENES_KEY, JSON.stringify([...seen])); } catch { /* Session memory is optional. */ }
    markCueSeen(id);
  }, [markCueSeen]);

  const clearTimers = useCallback(() => {
    if (readTimerRef.current !== null) window.clearTimeout(readTimerRef.current);
    readTimerRef.current = null;
    phaseTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    phaseTimersRef.current = [];
    cursorTimelineRef.current?.kill();
    cursorTimelineRef.current = null;
  }, []);

  const unlockPage = useCallback((scrollY: number, delta = 0) => {
    const saved = bodyStyleRef.current;
    if (saved) {
      const body = document.body;
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.width = saved.width;
      body.style.paddingRight = saved.paddingRight;
      document.documentElement.style.overflow = saved.overflow;
      bodyStyleRef.current = null;
    }
    delete document.documentElement.dataset.spotlight;
    resizeGuardUntilRef.current = 0;
    window.scrollTo({ top: Math.max(0, scrollY + delta), behavior: "auto" });
  }, []);

  const lockPage = useCallback(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    bodyStyleRef.current = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      overflow: document.documentElement.style.overflow,
    };
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    // Some browser shells emit resize while fixed-body/overflow styles are
    // being applied. That event belongs to the lock itself, not the visitor.
    resizeGuardUntilRef.current = window.performance.now() + 420;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbar) body.style.paddingRight = `${scrollbar}px`;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.spotlight = "active";
    return scrollY;
  }, []);

  const endActive = useCallback((interrupted = false, navigationDelta = 0, disableFollowing = false, recordScene = true) => {
    clearTimers();
    const active = activeRef.current;
    activeRef.current = null;
    candidateRef.current = null;
    firstIntentRef.current = 0;
    if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 });
    setSpotlight(null);
    if (active) {
      active.root.dataset.liveState = interrupted ? "interrupted" : "settled";
      if (recordScene) persistSeen(active.config.id);
      window.requestAnimationFrame(() => { active.root.dataset.liveState = reducedMotion ? "reduced" : "settled"; });
      unlockPage(active.scrollY, navigationDelta);
    }
    if (disableFollowing) {
      setAutoFollow(false);
      registryRef.current.forEach((_config, root) => { root.dataset.liveState = reducedMotion ? "reduced" : "settled"; });
    }
  }, [clearTimers, persistSeen, reducedMotion, setAutoFollow, unlockPage]);

  const scheduleEvaluation = useCallback((delay = 240) => {
    if (stableTimerRef.current !== null) window.clearTimeout(stableTimerRef.current);
    stableTimerRef.current = window.setTimeout(() => {
      stableTimerRef.current = null;
      evaluateRef.current();
    }, delay);
  }, []);

  const settleScene = useCallback((root: HTMLElement, userInitiated = false) => {
    if (activeRef.current?.root === root) {
      endActive(userInitiated);
      return;
    }
    if (candidateRef.current?.root === root) {
      if (readTimerRef.current !== null) window.clearTimeout(readTimerRef.current);
      readTimerRef.current = null;
      candidateRef.current = null;
    }
    root.dataset.liveState = reducedMotion ? "reduced" : "settled";
    const config = registryRef.current.get(root);
    if (config && userInitiated) persistSeen(config.id);
  }, [endActive, persistSeen, reducedMotion]);

  const sceneIsEligible = useCallback((config: LiveSceneConfig) => {
    const forced = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("live") : null;
    if (forced === "settled") return false;
    if (reducedMotion || pathname !== "/" || !autoFollow) return false;
    if (liveReplayToken > 0) return true;
    const seen = seenRef.current ?? readSeenScenes();
    seenRef.current = seen;
    // Persistent visit memory can vary the intro, but it must never erase the
    // core Live File story on a fresh tab. Scene suppression is session-only.
    return !seen.has(config.id);
  }, [autoFollow, liveReplayToken, pathname, reducedMotion]);

  const registerScene = useCallback((root: HTMLElement, config: LiveSceneConfig) => {
    registryRef.current.set(root, config);
    const forced = new URLSearchParams(window.location.search).get("live");
    root.dataset.liveState = forced === "wip" || sceneIsEligible(config) ? "wip" : reducedMotion ? "reduced" : "settled";
    if (forced !== "wip") scheduleEvaluation(280);
    return () => {
      registryRef.current.delete(root);
      if (candidateRef.current?.root === root) candidateRef.current = null;
      if (activeRef.current?.root === root) endActive(true);
    };
  }, [endActive, reducedMotion, sceneIsEligible, scheduleEvaluation]);

  useEffect(() => {
    startSceneRef.current = (scene) => {
    const { root, config } = scene;
    if (activeRef.current || !sceneIsEligible(config) || !root.isConnected) return;
    const target = root.querySelector<HTMLElement>(config.targetSelector) ?? root;
    const targetRect = target.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const scrollY = lockPage();
    root.style.setProperty("--live-x", `${targetRect.left - rootRect.left}px`);
    root.style.setProperty("--live-y", `${targetRect.top - rootRect.top}px`);
    root.style.setProperty("--live-w", `${targetRect.width}px`);
    root.style.setProperty("--live-h", `${targetRect.height}px`);
    root.dataset.liveState = "spotlight-entering";
    activeRef.current = { ...scene, scrollY };
    candidateRef.current = null;

    const safeRect = {
      top: clamp(targetRect.top - 8, 4, window.innerHeight - 80),
      left: clamp(targetRect.left - 8, 4, window.innerWidth - 80),
      width: Math.min(targetRect.width + 16, window.innerWidth - clamp(targetRect.left - 8, 4, window.innerWidth - 80) - 4),
      height: Math.min(targetRect.height + 16, window.innerHeight - clamp(targetRect.top - 8, 4, window.innerHeight - 80) - 4),
    };
    setSpotlight({ id: config.id, action: config.action, rect: safeRect, durationMs: config.spotlightMs, hint: false });

    const editingTimer = window.setTimeout(() => {
      root.dataset.liveState = "editing";
      window.dispatchEvent(new CustomEvent("portfolio-live-scene-play", { detail: { id: config.id } }));
    }, 360);
    phaseTimersRef.current.push(editingTimer);

    if (config.comment) {
      const commentAt = Math.max(1_650, config.spotlightMs - 2_350);
      phaseTimersRef.current.push(window.setTimeout(() => { root.dataset.liveState = "commenting"; }, commentAt));
    }
    phaseTimersRef.current.push(window.setTimeout(() => { root.dataset.liveState = "settling"; }, config.spotlightMs - 520));
    phaseTimersRef.current.push(window.setTimeout(() => endActive(false), config.spotlightMs));

    const coarse = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;
    if (!coarse && cursorRef.current) {
      const cursor = cursorRef.current;
      const endX = clamp(targetRect.left + targetRect.width * .58, 24, window.innerWidth - 96);
      const endY = clamp(targetRect.top + targetRect.height * .42, 70, window.innerHeight - 80);
      const direction = endX > window.innerWidth / 2 ? 1 : -1;
      const startX = clamp(endX + direction * 120, 22, window.innerWidth - 92);
      const startY = clamp(endY - 88, 72, window.innerHeight - 90);
      gsap.set(cursor, { x: startX, y: startY, opacity: 0, scale: .9 });
      cursorTimelineRef.current = gsap.timeline()
        .to(cursor, { opacity: 1, scale: 1, duration: .18 }, .16)
        .to(cursor, { duration: .78, ease: "power3.inOut", motionPath: { path: [{ x: startX, y: startY }, { x: endX + direction * 38, y: endY - 30 }, { x: endX, y: endY }], curviness: 1.25 } }, .22)
        .to(cursor, { x: endX + 3, y: endY - 3, duration: .28, ease: "power2.inOut" }, 1.22)
        .to(cursor, { opacity: 0, duration: .28 }, Math.max(1.8, config.spotlightMs / 1000 - .4));
    }
    };
  }, [endActive, lockPage, sceneIsEligible]);

  useEffect(() => {
    evaluateRef.current = () => {
    if (!experienceReady || activeRef.current || reducedMotion || !autoFollow || pathname !== "/") return;
    if (new URLSearchParams(window.location.search).get("live") === "wip") return;
    const safeTop = 96;
    const safeBottom = window.innerHeight - 48;
    let best: (RegisteredScene & { ratio: number }) | null = null;

    registryRef.current.forEach((config, root) => {
      if (!["wip", "observing"].includes(root.dataset.liveState ?? "") || !sceneIsEligible(config)) return;
      const target = root.querySelector<HTMLElement>(config.targetSelector) ?? root;
      const rect = target.getBoundingClientRect();
      const available = Math.max(1, safeBottom - safeTop);
      const visible = Math.max(0, Math.min(rect.bottom, safeBottom) - Math.max(rect.top, safeTop));
      const ratio = visible / Math.max(1, Math.min(rect.height, available));
      const center = rect.top + rect.height / 2;
      if (ratio < config.minVisibility || center < safeTop || center > safeBottom) return;
      if (!best || ratio > best.ratio) best = { root, config, ratio };
    });

    if (!best) {
      if (candidateRef.current) candidateRef.current.root.dataset.liveState = "wip";
      candidateRef.current = null;
      return;
    }
    const chosen = best as RegisteredScene & { ratio: number };
    if (candidateRef.current?.root === chosen.root) return;
    if (candidateRef.current) candidateRef.current.root.dataset.liveState = "wip";
    if (readTimerRef.current !== null) window.clearTimeout(readTimerRef.current);
    chosen.root.dataset.liveState = "observing";
    candidateRef.current = chosen;
    readTimerRef.current = window.setTimeout(() => {
      readTimerRef.current = null;
      if (candidateRef.current?.root === chosen.root) startSceneRef.current(chosen);
    }, chosen.config.readMs);
    };
  }, [autoFollow, experienceReady, pathname, reducedMotion, sceneIsEligible]);

  useEffect(() => {
    const onScroll = () => {
      if (activeRef.current) return;
      if (readTimerRef.current !== null) window.clearTimeout(readTimerRef.current);
      readTimerRef.current = null;
      if (candidateRef.current) candidateRef.current.root.dataset.liveState = "wip";
      candidateRef.current = null;
      scheduleEvaluation(240);
    };
    const onResize = () => {
      const nextViewport = { width: window.innerWidth, height: window.innerHeight };
      const previousViewport = viewportRef.current;
      const materiallyChanged = Math.abs(nextViewport.width - previousViewport.width) > 2
        || Math.abs(nextViewport.height - previousViewport.height) > 2;
      viewportRef.current = nextViewport;

      // Hiding the scrollbar for Spotlight can emit a resize event even though
      // the actual viewport did not change. Treating that event as user intent
      // used to collapse every scene into an imperceptible cursor flash.
      if (activeRef.current) {
        if (window.performance.now() < resizeGuardUntilRef.current) return;
        if (materiallyChanged) endActive(true, 0, false, false);
        return;
      }
      scheduleEvaluation(280);
    };
    const onVisibility = () => { if (document.hidden && activeRef.current) endActive(true, 0, false, false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [endActive, scheduleEvaluation]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!activeRef.current) return;
      event.preventDefault();
      const now = Date.now();
      if (firstIntentRef.current && now - firstIntentRef.current <= 700) {
        endActive(true, Math.sign(event.deltaY || 1) * Math.min(window.innerHeight * .82, 720));
        return;
      }
      firstIntentRef.current = now;
      setSpotlight((current) => current ? { ...current, hint: true } : current);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!activeRef.current) return;
      event.preventDefault();
      endActive(true, Math.min(window.innerHeight * .72, 620));
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!activeRef.current) return;
      if (!["Escape", "PageDown", " "].includes(event.key)) return;
      event.preventDefault();
      endActive(true, event.key === "Escape" ? 0 : Math.min(window.innerHeight * .82, 720));
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [endActive]);

  useEffect(() => {
    if (liveReplayToken <= 0) return;
    seenRef.current = new Set();
    try { window.sessionStorage.removeItem(SEEN_SCENES_KEY); } catch { /* Replay still works in this document. */ }
    registryRef.current.forEach((config, root) => { root.dataset.liveState = sceneIsEligible(config) ? "wip" : "settled"; });
    scheduleEvaluation(320);
  }, [liveReplayToken, sceneIsEligible, scheduleEvaluation]);

  useEffect(() => {
    if (!autoFollow || reducedMotion) {
      if (activeRef.current) endActive(true);
      registryRef.current.forEach((_config, root) => { root.dataset.liveState = reducedMotion ? "reduced" : "settled"; });
    } else {
      scheduleEvaluation(300);
    }
  }, [autoFollow, endActive, reducedMotion, scheduleEvaluation]);

  const value = useMemo<DirectorContextValue>(() => ({
    introComplete: experienceReady,
    reducedMotion,
    replayToken: liveReplayToken,
    registerScene,
    settleScene,
  }), [experienceReady, liveReplayToken, reducedMotion, registerScene, settleScene]);

  const stopFollowing = useCallback(() => endActive(true, 0, true), [endActive]);

  return (
    <DirectorContext.Provider value={value}>
      {children}
      <SpotlightChrome
        active={spotlight}
        showDock={pathname === "/" && introComplete && autoFollow && !reducedMotion}
        onCancel={() => endActive(true)}
        onReplay={replayLiveEdits}
        onStop={stopFollowing}
      />
      <div ref={cursorRef} className={styles.globalCursor} aria-hidden="true"><i /><span>Javier</span></div>
    </DirectorContext.Provider>
  );
}

export function useLiveSceneDirector() {
  const context = useContext(DirectorContext);
  if (!context) throw new Error("useLiveSceneDirector must be used inside LiveSceneDirector");
  return context;
}
