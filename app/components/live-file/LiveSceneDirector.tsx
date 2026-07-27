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
import { toolNames } from "./EditorPrimitives";
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
  commentFirst?: boolean;
  requiredFirstVisit: boolean;
  cameraOffsetY: number;
};

type RegisteredScene = { root: HTMLElement; config: LiveSceneConfig };
type ActiveScene = RegisteredScene & { scrollY: number; mandatory: boolean };

type DirectorContextValue = {
  introComplete: boolean;
  mandatoryFirstVisit: boolean;
  reducedMotion: boolean;
  replayToken: number;
  registerScene: (root: HTMLElement, config: LiveSceneConfig) => () => void;
  settleScene: (root: HTMLElement, userInitiated?: boolean) => void;
};

const SEEN_SCENES_KEY = "javier-live-scenes-v2";
const DirectorContext = createContext<DirectorContextValue | null>(null);
type AmbientBeat = {
  id: string;
  selector: string;
  mode: "nudge" | "copy" | "wrong-image" | "crop" | "easing";
  notes: string[];
  values?: string[];
};

const ambientEditBeats: AmbientBeat[] = [
  { id: "wordmark-pixels", selector: ".wordmark", mode: "nudge", notes: ["Two pixels right.", "No. One pixel left.", "Perfect. Probably."] },
  { id: "snapshot-copy", selector: "#snapshot-title", mode: "copy", notes: ["Trying something punchier…", "Too LinkedIn.", "Back to the useful one."], values: ["I turn complexity into clarity. ✨", "I design delightful synergies.", "I turn complex product logic into decisions people can see, test and trust."] },
  { id: "work-wrong-image", selector: ".project-card__media", mode: "wrong-image", notes: ["Adding the case-study evidence…", "That is my face.", "Wrong final_FINAL. Classic."] },
  { id: "practice-arrows", selector: "#practice-title", mode: "nudge", notes: ["Maybe it needs an arrow.", "Everything needs an arrow.", "It did not need an arrow."] },
  { id: "ai-copy", selector: "#ai-title", mode: "copy", notes: ["AI makes everything easy.", "That is simply not true.", "Judgement stays in the headline."], values: ["AI makes everything easy.", "Five tools. Zero ambiguity. Obviously.", "How I use AI to frame, prototype and validate product decisions."] },
  { id: "about-crop", selector: "#about-preview figure", mode: "crop", notes: ["3% more leadership.", "Now it says thought leader.", "Undo."] },
  { id: "references-copy", selector: "#testimonials-title", mode: "copy", notes: ["Could invent a glowing quote…", "Legal has entered the file.", "Sources first. Much better."], values: ["“Javier changed product design forever.”", "[Citation very much needed]", "How the work feels from the other side of the table."] },
  { id: "playground-easing", selector: ".playground-playhead", mode: "easing", notes: ["Ease in?", "Ease out?", "Designer stares at cubic-bezier."] },
  { id: "footer-nudge", selector: ".footer-contact", mode: "nudge", notes: ["One last tweak.", "Again.", "Okay. Your turn."] },
];

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
    guidedFirstVisit,
    introComplete,
    liveReplayToken,
    markCueSeen,
    reducedMotion,
    replayLiveEdits,
    setAutoFollow,
    showConsent,
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
  const ambientTimerRef = useRef<number | null>(null);
  const ambientTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const ambientTargetRef = useRef<HTMLElement | null>(null);
  const ambientNoteRef = useRef<HTMLDivElement>(null);
  const ambientSeenRef = useRef(new Set<string>());
  const ambientStartedAtRef = useRef(0);
  const followTimerRef = useRef<number | null>(null);
  const followingRef = useRef(false);
  const advanceFollowRef = useRef<() => void>(() => undefined);
  const beginFollowRef = useRef<() => void>(() => undefined);
  const stopFollowRef = useRef<() => void>(() => undefined);
  const firstIntentRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0 });
  const resizeGuardUntilRef = useRef(0);
  const repositioningRef = useRef(false);
  const awaitingAdvanceRef = useRef(true);
  const bodyStyleRef = useRef<{ position: string; top: string; width: string; paddingRight: string; overflow: string } | null>(null);
  const startSceneRef = useRef<(scene: RegisteredScene) => void>(() => undefined);
  const evaluateRef = useRef<() => void>(() => undefined);
  const [spotlight, setSpotlight] = useState<SpotlightView | null>(null);
  const [guidedComplete, setGuidedComplete] = useState(false);
  const [followingJavier, setFollowingJavier] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState<"connected" | "editing" | "elsewhere" | "done">("connected");

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    seenRef.current = readSeenScenes();
    viewportRef.current = { width: window.innerWidth, height: window.innerHeight };
    return () => cursorTimelineRef.current?.kill();
  }, []);

  const stopAmbientEdit = useCallback(() => {
    if (ambientTimerRef.current !== null) window.clearTimeout(ambientTimerRef.current);
    ambientTimerRef.current = null;
    ambientTimelineRef.current?.kill();
    ambientTimelineRef.current = null;
    if (ambientTargetRef.current) {
      delete ambientTargetRef.current.dataset.ambientEdit;
      delete ambientTargetRef.current.dataset.ambientValue;
      gsap.set(ambientTargetRef.current, { clearProps: "transform" });
      const image = ambientTargetRef.current.querySelector("img");
      if (image) gsap.set(image, { clearProps: "transform,filter" });
      ambientTargetRef.current = null;
    }
    if (ambientNoteRef.current) gsap.set(ambientNoteRef.current, { opacity: 0, scale: .96 });
    if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 });
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
    if (stableTimerRef.current !== null) window.clearTimeout(stableTimerRef.current);
    stableTimerRef.current = null;
    phaseTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    phaseTimersRef.current = [];
    if (followTimerRef.current !== null) window.clearTimeout(followTimerRef.current);
    followTimerRef.current = null;
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
    // Restoring a captured position can emit a native scroll event. Keep it
    // separate from the fresh visitor gesture required to arm the next edit.
    repositioningRef.current = true;
    window.scrollTo({ top: Math.max(0, scrollY + delta), behavior: "auto" });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => { repositioningRef.current = false; });
    });
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
      if (active.mandatory) awaitingAdvanceRef.current = true;
      unlockPage(active.scrollY, navigationDelta);
      window.dispatchEvent(new CustomEvent("portfolio-spotlight-end"));
      if (active.mandatory && !interrupted) {
        window.requestAnimationFrame(() => {
          const required = [...registryRef.current.entries()].filter(([, config]) => config.requiredFirstVisit);
          if (required.length > 0 && required.every(([root]) => root.dataset.liveState === "settled" || root === active.root)) {
            setGuidedComplete(true);
          }
        });
      }
    }
    if (disableFollowing) {
      followingRef.current = false;
      setFollowingJavier(false);
      window.dispatchEvent(new CustomEvent("portfolio-follow-end"));
      registryRef.current.forEach((_config, root) => { root.dataset.liveState = reducedMotion ? "reduced" : "settled"; });
    } else if (active && !interrupted && followingRef.current) {
      followTimerRef.current = window.setTimeout(() => advanceFollowRef.current(), 950);
    }
  }, [clearTimers, persistSeen, reducedMotion, unlockPage]);

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
    const initialWip = sceneIsEligible(config) && ((guidedFirstVisit && config.requiredFirstVisit) || followingRef.current);
    root.dataset.liveState = forced === "wip" || initialWip ? "wip" : reducedMotion ? "reduced" : "settled";
    if (forced !== "wip") scheduleEvaluation(280);
    return () => {
      registryRef.current.delete(root);
      if (candidateRef.current?.root === root) candidateRef.current = null;
      if (activeRef.current?.root === root) endActive(true);
    };
  }, [endActive, guidedFirstVisit, reducedMotion, sceneIsEligible, scheduleEvaluation]);

  useEffect(() => {
    startSceneRef.current = (scene) => {
      const { root, config } = scene;
      if (activeRef.current || !sceneIsEligible(config) || !root.isConnected) return;
      stopAmbientEdit();
      setPresenceStatus("connected");
      const mandatory = guidedFirstVisit && config.requiredFirstVisit;
      const target = root.querySelector<HTMLElement>(config.targetSelector) ?? root;

      // The guided first pass owns the framing. If a visitor races past a
      // required chapter, bring the authored target back into the safe area
      // before freezing the page. The captured position then becomes the exact
      // restoration point when the edit finishes.
      if (mandatory) {
        const initial = target.getBoundingClientRect();
        const safeTop = 104;
        const safeBottom = window.innerHeight - 92;
        const available = Math.max(240, safeBottom - safeTop);
        const baseTop = initial.height <= available
          ? safeTop + (available - initial.height) / 2
          : safeTop + 12;
        const desiredTop = clamp(baseTop + config.cameraOffsetY, safeTop, safeBottom - Math.min(140, initial.height));
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const desiredScroll = clamp(window.scrollY + initial.top - desiredTop, 0, maxScroll);
        if (Math.abs(desiredScroll - window.scrollY) > 2) {
          repositioningRef.current = true;
          window.scrollTo({ top: desiredScroll, behavior: "auto" });
          window.requestAnimationFrame(() => { repositioningRef.current = false; });
        }
      }

      const targetRect = target.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const scrollY = lockPage();
      window.dispatchEvent(new CustomEvent("portfolio-spotlight-start", { detail: { id: config.id, mandatory } }));
      root.style.setProperty("--live-x", `${targetRect.left - rootRect.left}px`);
      root.style.setProperty("--live-y", `${targetRect.top - rootRect.top}px`);
      root.style.setProperty("--live-w", `${targetRect.width}px`);
      root.style.setProperty("--live-h", `${targetRect.height}px`);
      const commentFirst = Boolean(config.comment && config.commentFirst);
      // The viewport comment can lead the score while the section itself stays
      // visibly unfinished. The authored WIP selectors depend on `observing`;
      // switching the scene to `commenting` here would reveal the final design
      // before Javier has made the edit.
      root.dataset.liveState = mandatory || commentFirst ? "observing" : "spotlight-entering";
      activeRef.current = { ...scene, scrollY, mandatory };
      candidateRef.current = null;

      const safeRect = {
        top: clamp(targetRect.top - 8, 4, window.innerHeight - 80),
        left: clamp(targetRect.left - 8, 4, window.innerWidth - 80),
        width: Math.min(targetRect.width + 16, window.innerWidth - clamp(targetRect.left - 8, 4, window.innerWidth - 80) - 4),
        height: Math.min(targetRect.height + 16, window.innerHeight - clamp(targetRect.top - 8, 4, window.innerHeight - 80) - 4),
      };
      const panelWidth = Math.min(360, window.innerWidth - 32);
      const panelHeight = config.comment ? 108 : 102;
      const spaceBelow = window.innerHeight - safeRect.top - safeRect.height;
      const panelTop = spaceBelow >= panelHeight + 16
        ? safeRect.top + safeRect.height + 12
        : safeRect.top >= panelHeight + 88
          ? safeRect.top - panelHeight - 12
          : clamp(safeRect.top + 16, 76, window.innerHeight - panelHeight - 16);
      const panel = {
        top: panelTop,
        left: clamp(safeRect.left, 16, window.innerWidth - panelWidth - 16),
        width: panelWidth,
      };
      // Comment-first pilots reserve a short reading beat even on optional
      // return visits. Otherwise the overlay would enter directly in edit mode
      // and the editorial reason for the correction would disappear.
      const leadIn = mandatory || commentFirst ? config.readMs : 0;
      const totalDuration = leadIn + config.spotlightMs;
      const orderedRoots = [...registryRef.current.keys()];
      const requiredRoots = [...registryRef.current.entries()]
        .filter(([, item]) => item.requiredFirstVisit)
        .map(([item]) => item);
      const positionRoots = mandatory ? requiredRoots : orderedRoots;
      setSpotlight({
        id: config.id,
        action: config.action,
        rect: safeRect,
        panel,
        durationMs: totalDuration,
        hint: false,
        mandatory,
        position: Math.max(1, positionRoots.indexOf(root) + 1),
        total: positionRoots.length,
        phase: commentFirst ? "commenting" : mandatory ? "observing" : "entering",
        tool: toolNames[config.tool],
        properties: config.properties,
        comment: config.comment,
        commentFirst,
      });

      if (mandatory || commentFirst) {
        phaseTimersRef.current.push(window.setTimeout(() => {
          root.dataset.liveState = "spotlight-entering";
          setSpotlight((current) => current ? { ...current, phase: "entering" } : current);
        }, leadIn));
      }

      const editingTimer = window.setTimeout(() => {
        root.dataset.liveState = "editing";
        setSpotlight((current) => current ? { ...current, phase: "editing" } : current);
        window.dispatchEvent(new CustomEvent("portfolio-live-scene-play", { detail: { id: config.id } }));
      }, leadIn + (commentFirst ? 460 : 1_040));
      phaseTimersRef.current.push(editingTimer);

      if (config.comment && !commentFirst) {
        const commentAt = leadIn + Math.max(3_800, config.spotlightMs - 3_600);
        phaseTimersRef.current.push(window.setTimeout(() => {
          root.dataset.liveState = "commenting";
          setSpotlight((current) => current ? { ...current, phase: "commenting" } : current);
        }, commentAt));
      }
      const settleHold = commentFirst ? 1_200 : 840;
      phaseTimersRef.current.push(window.setTimeout(() => {
        root.dataset.liveState = "settling";
        setSpotlight((current) => current ? { ...current, phase: "settling" } : current);
      }, leadIn + config.spotlightMs - settleHold));
      phaseTimersRef.current.push(window.setTimeout(() => endActive(false), totalDuration));

      const coarse = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;
      if (!coarse && cursorRef.current) {
        const cursor = cursorRef.current;
        const endX = clamp(targetRect.left + targetRect.width * .58, 24, window.innerWidth - 96);
        const endY = clamp(targetRect.top + targetRect.height * .42, 70, window.innerHeight - 80);
        const direction = endX > window.innerWidth / 2 ? 1 : -1;
        const startX = clamp(endX + direction * 120, 22, window.innerWidth - 92);
        const startY = clamp(endY - 88, 72, window.innerHeight - 90);
        gsap.set(cursor, { x: startX, y: startY, opacity: .72, scale: .9 });
        cursorTimelineRef.current = gsap.timeline({ delay: leadIn / 1000 })
          .to(cursor, { opacity: 1, scale: 1, duration: .2 }, .06)
          .to(cursor, { duration: .66, ease: "power3.inOut", motionPath: { path: [{ x: startX, y: startY }, { x: endX + direction * 28, y: endY - 22 }, { x: endX, y: endY }], curviness: 1.05 } }, .14)
          .to(cursor, { x: endX + 3, y: endY - 3, duration: .22, ease: "power2.inOut" }, .88)
          .to(cursor, { opacity: 0, duration: .24 }, Math.max(1.6, config.spotlightMs / 1000 - .5));
      }
    };
  }, [endActive, guidedFirstVisit, lockPage, sceneIsEligible, stopAmbientEdit]);

  useEffect(() => {
    evaluateRef.current = () => {
    if (!experienceReady || activeRef.current || reducedMotion || !autoFollow || pathname !== "/") return;
    if (new URLSearchParams(window.location.search).get("live") === "wip") return;
    const safeTop = 96;
    const safeBottom = window.innerHeight - 48;

    if (guidedFirstVisit && !guidedComplete) {
      // A resize or scroll restoration produced by the previous handoff must
      // never launch the next mandatory edit. Each chapter is armed only by a
      // new visitor scroll after the hero or preceding Spotlight has released.
      if (awaitingAdvanceRef.current) return;
      // A first visit is a directed sequence. Always resolve the earliest
      // required chapter that the visitor has reached or passed, even if a
      // fast wheel gesture carried its target outside the viewport.
      const nextRequired = [...registryRef.current.entries()].find(([root, config]) => {
        if (!config.requiredFirstVisit) return false;
        if (!["wip", "observing"].includes(root.dataset.liveState ?? "") || !sceneIsEligible(config)) return false;
        return root.getBoundingClientRect().top < safeBottom;
      });
      if (nextRequired) {
        const [root, config] = nextRequired;
        startSceneRef.current({ root, config });
        return;
      }
    }

    // Outside explicit Follow mode, the portfolio never launches a lower
    // Spotlight by itself. Ambient edits may continue without moving camera.
    if (!followingRef.current) return;

    let best: (RegisteredScene & { ratio: number }) | null = null;

    registryRef.current.forEach((config, root) => {
      if (!["wip", "observing"].includes(root.dataset.liveState ?? "") || !sceneIsEligible(config)) return;
      const target = root.querySelector<HTMLElement>(config.targetSelector) ?? root;
      const rect = target.getBoundingClientRect();
      const available = Math.max(1, safeBottom - safeTop);
      const visible = Math.max(0, Math.min(rect.bottom, safeBottom) - Math.max(rect.top, safeTop));
      const ratio = visible / Math.max(1, Math.min(rect.height, available));
      // Tall authored targets can be meaningfully readable while their centre
      // remains below the viewport. Visibility, not geometric centring, is the
      // correct readiness signal for those sections.
      if (ratio < config.minVisibility || rect.bottom <= safeTop || rect.top >= safeBottom) return;
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
  }, [autoFollow, experienceReady, guidedComplete, guidedFirstVisit, pathname, reducedMotion, sceneIsEligible]);

  const advanceFollowing = useCallback(() => {
    if (!followingRef.current || activeRef.current || reducedMotion || pathname !== "/") return;
    const next = [...registryRef.current.entries()].find(([root, config]) => {
      if (!sceneIsEligible(config)) return false;
      return root.dataset.liveState !== "settled" && root.dataset.liveState !== "reduced";
    });
    if (!next) {
      followingRef.current = false;
      setFollowingJavier(false);
      setPresenceStatus("done");
      window.dispatchEvent(new CustomEvent("portfolio-follow-end"));
      return;
    }

    const [root, config] = next;
    root.dataset.liveState = "wip";
    const target = root.querySelector<HTMLElement>(config.targetSelector) ?? root;
    const rect = target.getBoundingClientRect();
    const safeTop = 116;
    const visibleHeight = Math.max(260, window.innerHeight - safeTop - 72);
    const desiredTop = safeTop + Math.max(0, (visibleHeight - Math.min(rect.height, visibleHeight)) / 2);
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = clamp(window.scrollY + rect.top - desiredTop, 0, maximum);
    repositioningRef.current = true;
    window.scrollTo({ top: destination, behavior: "smooth" });
    followTimerRef.current = window.setTimeout(() => {
      repositioningRef.current = false;
      scheduleEvaluation(80);
    }, 820);
  }, [pathname, reducedMotion, sceneIsEligible, scheduleEvaluation]);

  useEffect(() => { advanceFollowRef.current = advanceFollowing; }, [advanceFollowing]);

  const beginFollowing = useCallback(() => {
    if (reducedMotion || pathname !== "/") return;
    setAutoFollow(true);
    followingRef.current = true;
    setFollowingJavier(true);
    setPresenceStatus("connected");
    window.dispatchEvent(new CustomEvent("portfolio-follow-start"));
    stopAmbientEdit();
    registryRef.current.forEach((config, root) => {
      if (sceneIsEligible(config)) root.dataset.liveState = "wip";
    });
    followTimerRef.current = window.setTimeout(() => advanceFollowRef.current(), 320);
  }, [pathname, reducedMotion, sceneIsEligible, setAutoFollow, stopAmbientEdit]);

  useEffect(() => { beginFollowRef.current = beginFollowing; }, [beginFollowing]);

  useEffect(() => {
    const onScroll = () => {
      if (activeRef.current || repositioningRef.current) return;
      if (guidedFirstVisit && !experienceReady) return;
      if (guidedFirstVisit) awaitingAdvanceRef.current = false;
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
  }, [endActive, experienceReady, guidedFirstVisit, scheduleEvaluation]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!activeRef.current) {
        if (followingRef.current) stopFollowRef.current();
        return;
      }
      event.preventDefault();
      if (activeRef.current.mandatory) {
        setSpotlight((current) => current ? { ...current, hint: true } : current);
        return;
      }
      if (followingRef.current) {
        endActive(true, Math.sign(event.deltaY || 1) * Math.min(window.innerHeight * .82, 720), true);
        return;
      }
      const now = Date.now();
      if (firstIntentRef.current && now - firstIntentRef.current <= 700) {
        endActive(true, Math.sign(event.deltaY || 1) * Math.min(window.innerHeight * .82, 720));
        return;
      }
      firstIntentRef.current = now;
      setSpotlight((current) => current ? { ...current, hint: true } : current);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!activeRef.current) {
        if (followingRef.current) stopFollowRef.current();
        return;
      }
      event.preventDefault();
      if (activeRef.current.mandatory) {
        setSpotlight((current) => current ? { ...current, hint: true } : current);
        return;
      }
      endActive(true, Math.min(window.innerHeight * .72, 620), followingRef.current);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!activeRef.current) {
        if (followingRef.current && ["Escape", "PageDown", "PageUp", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) stopFollowRef.current();
        return;
      }
      const scrollKeys = ["Escape", "PageDown", "PageUp", " ", "ArrowDown", "ArrowUp", "Home", "End"];
      if (!scrollKeys.includes(event.key)) return;
      event.preventDefault();
      if (activeRef.current.mandatory) {
        setSpotlight((current) => current ? { ...current, hint: true } : current);
        return;
      }
      endActive(true, event.key === "Escape" ? 0 : Math.min(window.innerHeight * .82, 720), followingRef.current);
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
    registryRef.current.forEach((_config, root) => { root.dataset.liveState = "settled"; });
    followTimerRef.current = window.setTimeout(() => beginFollowRef.current(), 180);
  }, [liveReplayToken, sceneIsEligible, scheduleEvaluation]);

  useEffect(() => {
    if (!autoFollow || reducedMotion) {
      if (activeRef.current) endActive(true);
      followingRef.current = false;
      window.queueMicrotask(() => setFollowingJavier(false));
      registryRef.current.forEach((_config, root) => { root.dataset.liveState = reducedMotion ? "reduced" : "settled"; });
    } else if (guidedFirstVisit && !guidedComplete) {
      scheduleEvaluation(300);
    }
  }, [autoFollow, endActive, guidedComplete, guidedFirstVisit, reducedMotion, scheduleEvaluation]);

  useEffect(() => {
    if (!experienceReady || spotlight || followingJavier || reducedMotion || !autoFollow || showConsent || pathname !== "/") {
      stopAmbientEdit();
      return;
    }
    if (window.matchMedia("(max-width: 720px), (pointer: coarse)").matches) return;

    if (ambientStartedAtRef.current === 0) ambientStartedAtRef.current = Date.now();

    const showNote = (text: string, x: number, y: number) => {
      const note = ambientNoteRef.current;
      if (!note) return;
      const copy = note.querySelector("p");
      if (copy) copy.textContent = text;
      const width = Math.min(290, window.innerWidth - 32);
      gsap.set(note, {
        x: clamp(x + 18, 16, window.innerWidth - width - 16),
        y: clamp(y + 28, 86, window.innerHeight - 96),
        width,
        opacity: 1,
        scale: 1,
      });
    };

    const runAmbientEdit = () => {
      if (document.hidden || activeRef.current) {
        ambientTimerRef.current = window.setTimeout(runAmbientEdit, 3_000);
        return;
      }
      if (Date.now() - ambientStartedAtRef.current > 4 * 60 * 1_000 || ambientSeenRef.current.size >= ambientEditBeats.length) {
        setPresenceStatus("done");
        if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 0, duration: .35 });
        return;
      }
      const cursor = cursorRef.current;
      const available = ambientEditBeats
        .filter((beat) => !ambientSeenRef.current.has(beat.id))
        .filter((beat) => beat.id !== "wordmark-pixels" || window.scrollY < window.innerHeight * .42)
        .map((beat) => ({ beat, target: document.querySelector<HTMLElement>(beat.selector) }))
        .filter((item): item is { beat: AmbientBeat; target: HTMLElement } => Boolean(item.target));
      const chosen = available.find(({ target }) => {
        const rect = target.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight - 48 && rect.right > 0 && rect.left < window.innerWidth;
      });
      if (!chosen || !cursor) {
        setPresenceStatus("elsewhere");
        if (cursor) gsap.to(cursor, { opacity: 0, duration: .25 });
        ambientTimerRef.current = window.setTimeout(runAmbientEdit, 4_800);
        return;
      }

      const { beat, target } = chosen;
      ambientSeenRef.current.add(beat.id);
      const rect = target.getBoundingClientRect();
      setPresenceStatus("editing");
      ambientTargetRef.current = target;
      const endX = clamp(rect.right - Math.min(28, rect.width * .18), 24, window.innerWidth - 92);
      const endY = clamp(rect.top + Math.min(38, rect.height * .45), 82, window.innerHeight - 78);
      const noteX = beat.id === "wordmark-pixels" ? endX + 64 : endX;
      const noteY = beat.id === "wordmark-pixels" ? 132 : endY;
      const startX = clamp(endX + 72, 24, window.innerWidth - 92);
      const startY = clamp(endY - 52, 82, window.innerHeight - 78);
      gsap.set(cursor, { x: startX, y: startY });
      const timeline = gsap.timeline({
        onComplete: () => {
          delete target.dataset.ambientEdit;
          delete target.dataset.ambientValue;
          gsap.set(target, { clearProps: "transform" });
          const image = target.querySelector("img");
          if (image) gsap.set(image, { clearProps: "transform,filter" });
          if (ambientNoteRef.current) gsap.to(ambientNoteRef.current, { opacity: 0, scale: .96, duration: .2 });
          ambientTargetRef.current = null;
          ambientTimelineRef.current = null;
          setPresenceStatus("connected");
          ambientTimerRef.current = window.setTimeout(runAmbientEdit, 8_500);
        },
      })
        .to(cursor, { opacity: .92, duration: .2 })
        .to(cursor, { x: endX, y: endY, duration: .72, ease: "power3.inOut" })
        .call(() => showNote(beat.notes[0], noteX, noteY))
        .to({}, { duration: .68 });

      if (beat.mode === "copy") {
        timeline
          .call(() => { target.dataset.ambientEdit = "copy"; target.dataset.ambientValue = beat.values?.[0] ?? ""; })
          .to({}, { duration: 1.05 })
          .call(() => { showNote(beat.notes[1], noteX, noteY); target.dataset.ambientValue = beat.values?.[1] ?? ""; })
          .to({}, { duration: 1.05 })
          .call(() => { showNote(beat.notes[2], noteX, noteY); target.dataset.ambientValue = beat.values?.[2] ?? ""; })
          .to({}, { duration: 1.15 });
      } else if (beat.mode === "wrong-image") {
        timeline
          .call(() => { target.dataset.ambientEdit = "wrong-image"; })
          .to({}, { duration: 1.1 })
          .call(() => showNote(beat.notes[1], noteX, noteY))
          .to({}, { duration: 1.05 })
          .call(() => { showNote(beat.notes[2], noteX, noteY); delete target.dataset.ambientEdit; })
          .to({}, { duration: 1.05 });
      } else if (beat.mode === "crop") {
        const image = target.querySelector("img") ?? target;
        timeline
          .call(() => { target.dataset.ambientEdit = "active"; })
          .to(image, { xPercent: -7, scale: 1.12, duration: .65, ease: "power2.inOut" })
          .call(() => showNote(beat.notes[1], noteX, noteY))
          .to(image, { xPercent: 5, scale: 1.17, duration: .65, ease: "power2.inOut" })
          .call(() => showNote(beat.notes[2], noteX, noteY))
          .to(image, { xPercent: 0, scale: 1, duration: .7, ease: "power3.inOut" });
      } else if (beat.mode === "easing") {
        timeline
          .call(() => { target.dataset.ambientEdit = "active"; })
          .to(target, { scaleX: .28, transformOrigin: "left", duration: .7, ease: "power1.in" })
          .call(() => showNote(beat.notes[1], noteX, noteY))
          .to(target, { scaleX: .92, duration: .55, ease: "power4.out" })
          .call(() => showNote(beat.notes[2], noteX, noteY))
          .to(target, { scaleX: 1, duration: .65, ease: "elastic.out(1,.45)" });
      } else {
        timeline
          .call(() => { target.dataset.ambientEdit = "active"; })
          .to(target, { x: 3, y: -1, duration: .28, ease: "power2.out" })
          .call(() => showNote(beat.notes[1], noteX, noteY))
          .to(target, { x: -2, y: 1, duration: .34, ease: "power2.inOut" })
          .call(() => showNote(beat.notes[2], noteX, noteY))
          .to(target, { x: 0, y: 0, duration: .38, ease: "power3.out" })
          .to({}, { duration: .55 });
      }

      timeline
        .to(cursor, { x: endX + 10, y: endY + 6, duration: .26, ease: "power2.out" })
        .to(cursor, { opacity: .72, duration: .2 });
      ambientTimelineRef.current = timeline;
    };

    // A quiet beat after the intro or a Spotlight scene keeps ambient jokes
    // from competing with the authored, mandatory part of the story.
    ambientTimerRef.current = window.setTimeout(runAmbientEdit, 5_200);
    return stopAmbientEdit;
  }, [autoFollow, experienceReady, followingJavier, pathname, reducedMotion, showConsent, spotlight, stopAmbientEdit]);

  const value = useMemo<DirectorContextValue>(() => ({
    introComplete: experienceReady,
    mandatoryFirstVisit: guidedFirstVisit,
    reducedMotion,
    replayToken: liveReplayToken,
    registerScene,
    settleScene,
  }), [experienceReady, guidedFirstVisit, liveReplayToken, reducedMotion, registerScene, settleScene]);

  const stopFollowing = useCallback(() => {
    followingRef.current = false;
    setFollowingJavier(false);
    window.dispatchEvent(new CustomEvent("portfolio-follow-end"));
    if (activeRef.current) endActive(true, 0, true);
    else {
      clearTimers();
      registryRef.current.forEach((_config, root) => { root.dataset.liveState = reducedMotion ? "reduced" : "settled"; });
    }
  }, [clearTimers, endActive, reducedMotion]);

  useEffect(() => { stopFollowRef.current = stopFollowing; }, [stopFollowing]);

  return (
    <DirectorContext.Provider value={value}>
      {children}
      <SpotlightChrome
        active={spotlight}
        showDock={pathname === "/" && introComplete && autoFollow && !reducedMotion}
        guidedFirstVisit={guidedFirstVisit && !guidedComplete}
        followingJavier={followingJavier}
        presenceStatus={presenceStatus}
        onCancel={() => endActive(true)}
        onFollow={beginFollowing}
        onReplay={replayLiveEdits}
        onStop={stopFollowing}
      />
      <div ref={cursorRef} className={styles.globalCursor} data-javier-cursor aria-hidden="true"><i /><span>Javier</span></div>
      <div ref={ambientNoteRef} className={styles.ambientNote} data-ambient-note aria-hidden="true"><span>Javier · now</span><p /></div>
    </DirectorContext.Provider>
  );
}

export function useLiveSceneDirector() {
  const context = useContext(DirectorContext);
  if (!context) throw new Error("useLiveSceneDirector must be used inside LiveSceneDirector");
  return context;
}
