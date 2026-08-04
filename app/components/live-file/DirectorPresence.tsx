"use client";

import { Component, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import {
  contextualLines,
  directorCopyMemoryId,
  isContextualTrigger,
  pickDirectorLine,
  rememberDirectorLine,
  sectionCommentary,
  type ContextualCueId,
  type DirectorLine,
  type DirectorPace,
  type DirectorSection,
  type DirectorSessionStage,
  type DirectorVoiceHistory,
} from "./DirectorCommentary";
import { consumeDirectorAction, type DirectorActionCue } from "./director-copy/signals";
import { commentKeyDelay } from "./commentTyping";
import { FigmaCursor } from "./FigmaCursor";
import type { NarrativeConsent, VisitTier } from "./NarrativeContext";
import styles from "./DirectorPresence.module.css";

export type DirectorPresenceStatus = "connected" | "editing" | "elsewhere" | "done";
export type DirectorBrainState = "observing" | "considering" | "approaching" | "commenting" | "editing" | "cooldown" | "paused" | "roaming" | "disabled" | "done";

type TextAction =
  | { type: "type"; value: string }
  | { type: "backspace"; count: number }
  | { type: "select-all" }
  | { type: "pause"; duration: number };

type DirectorBeat = {
  id: string;
  selector: string;
  section: DirectorSection;
  mode: "text" | "comment" | "nudge" | "crop" | "easing";
  comments: readonly DirectorLine[];
  selectedLine?: DirectorLine;
  trigger?: ContextualCueId | "ambient";
  segment?: string;
  actions?: TextAction[];
  priority?: number;
};

type TextOverlay = {
  before: string;
  current: string;
  after: string;
  selected: boolean;
  typing: boolean;
  style: CSSProperties;
};

type Candidate = {
  beat: DirectorBeat;
  target: HTMLElement;
  score: number;
  pointerInside: boolean;
  entry?: { x: number; y: number };
  quiet?: boolean;
  intent?: "autonomous-work" | "visitor-focus" | "contextual-response" | "figma-handoff";
};
type AttentionModel = {
  pointerX: number;
  pointerY: number;
  pointerSeen: boolean;
  pointerVelocity: number;
  lastPointerAt: number;
  scrollVelocity: number;
  scrollDirection: -1 | 0 | 1;
  lastScrollY: number;
  lastScrollSampleAt: number;
};

type BehaviorModel = {
  fastScrollDetected: boolean;
  focusBeatId: string | null;
  focusSince: number;
  lastContextAt: number;
  maxScrollDepth: number;
  maxScrollY: number;
  reachedEnd: boolean;
  revisitedSection: boolean;
  returnedTop: boolean;
  returnedFromTab: boolean;
  directionChanges: number;
  lastDirection: -1 | 0 | 1;
  firedTriggers: Set<ContextualCueId>;
  pendingAction: DirectorActionCue | null;
  rareShown: boolean;
  scrollBursts: number;
  visitedSections: Set<string>;
};

type DirectorPresenceProps = {
  active: boolean;
  consent: NarrativeConsent;
  hasSeenCue: (id: string) => boolean;
  markCueSeen: (id: string) => void;
  memoryDecision: Exclude<NarrativeConsent, "unknown"> | null;
  onStatusChange: (status: DirectorPresenceStatus) => void;
  visitTier: VisitTier;
};

const DIRECTOR_MEMORY_KEY = "javier-director-beats-v1";
const HUMAN_KEY_DELAYS = [82, 116, 69, 94, 128, 76, 103, 88, 142, 72];
const HERO_KEY_DELAYS = [78, 112, 73, 96, 126, 81, 104, 88, 134, 76];

function createBehaviorModel(startedAt = 0): BehaviorModel {
  return {
    fastScrollDetected: false,
    focusBeatId: null,
    focusSince: startedAt,
    lastContextAt: Number.NEGATIVE_INFINITY,
    maxScrollDepth: 0,
    maxScrollY: 0,
    reachedEnd: false,
    revisitedSection: false,
    returnedTop: false,
    returnedFromTab: false,
    directionChanges: 0,
    lastDirection: 0,
    firedTriggers: new Set<ContextualCueId>(),
    pendingAction: null,
    rareShown: false,
    scrollBursts: 0,
    visitedSections: new Set<string>(),
  };
}

// Each text intervention ends on the semantic source string. Director can
// hesitate and correct itself without making transient copy the accessible
// name of a heading or asking React to reconcile a mutated content node.
const directorBeats: DirectorBeat[] = [
  {
    id: "hero-headline-indecision",
    selector: "#hero-title",
    section: "hero",
    mode: "text",
    priority: .8,
    segment: "I design the calm inside complex products.",
    comments: sectionCommentary["hero-headline-indecision"],
    actions: [
      { type: "type", value: "Javier Ortiz" },
      { type: "pause", duration: 1_100 },
      { type: "select-all" },
      { type: "type", value: "Senior Product Designer" },
      { type: "pause", duration: 1_300 },
      { type: "select-all" },
      { type: "type", value: "I design the calm inside complex prodcuts." },
      { type: "pause", duration: 680 },
      { type: "backspace", count: 9 },
      { type: "type", value: "products." },
    ],
  },
  {
    id: "snapshot-trust-typo",
    selector: "#snapshot-scope",
    section: "snapshot",
    mode: "text",
    segment: "B2B platforms & systems",
    comments: sectionCommentary["snapshot-trust-typo"],
    actions: [
      { type: "type", value: "B2B platfroms & systems" },
      { type: "pause", duration: 420 },
      { type: "backspace", count: 19 },
      { type: "type", value: "platforms & systems" },
    ],
  },
  {
    id: "video-introduction-note",
    selector: "#video-introduction-title",
    section: "video",
    mode: "comment",
    comments: sectionCommentary["video-introduction-note"],
  },
  {
    id: "work-evidence-note",
    selector: ".project-card__media",
    section: "work",
    mode: "comment",
    comments: sectionCommentary["work-evidence-note"],
  },
  {
    id: "practice-two-pixels",
    selector: "#practice-title",
    section: "practice",
    mode: "nudge",
    comments: sectionCommentary["practice-two-pixels"],
  },
  {
    id: "ai-validate-typo",
    selector: "#ai-title",
    section: "ai",
    mode: "text",
    segment: "evidence faster",
    comments: sectionCommentary["ai-validate-typo"],
    actions: [
      { type: "type", value: "evidnece faster" },
      { type: "pause", duration: 390 },
      { type: "backspace", count: 15 },
      { type: "type", value: "evidence faster" },
    ],
  },
  {
    id: "about-crop-breathe",
    selector: "#about-preview figure",
    section: "about",
    mode: "crop",
    comments: sectionCommentary["about-crop-breathe"],
  },
  {
    id: "references-side-typo",
    selector: "#testimonials-title",
    section: "references",
    mode: "text",
    segment: "once verified",
    comments: sectionCommentary["references-side-typo"],
    actions: [
      { type: "type", value: "once verfied" },
      { type: "pause", duration: 430 },
      { type: "backspace", count: 7 },
      { type: "type", value: "verified" },
    ],
  },
  {
    id: "playground-easing",
    selector: ".playground-playhead",
    section: "playground",
    mode: "easing",
    comments: sectionCommentary["playground-easing"],
  },
  {
    id: "footer-handoff",
    selector: ".footer-contact",
    section: "contact",
    mode: "comment",
    comments: sectionCommentary["footer-handoff"],
  },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function toDocumentRect(rect: DOMRect) {
  return {
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

function visibleRatio(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  const viewportArea = Math.max(1, Math.min(rect.width, window.innerWidth) * Math.min(rect.height, window.innerHeight));
  return (visibleWidth * visibleHeight) / viewportArea;
}

function findSegmentRect(target: HTMLElement, segment: string) {
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const value = node.textContent ?? "";
    const start = value.indexOf(segment);
    if (start >= 0) {
      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, start + segment.length);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return rect;
    }
    node = walker.nextNode();
  }
  return target.getBoundingClientRect();
}

function readSeenBeats(reset: boolean) {
  try {
    if (reset) window.sessionStorage.removeItem(DIRECTOR_MEMORY_KEY);
    const value = JSON.parse(window.sessionStorage.getItem(DIRECTOR_MEMORY_KEY) ?? "[]") as unknown;
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function rememberBeat(seen: Set<string>, id: string) {
  seen.add(id);
  try {
    window.sessionStorage.setItem(DIRECTOR_MEMORY_KEY, JSON.stringify([...seen]));
  } catch {
    // Director memory is session-only and entirely optional.
  }
}

export function DirectorPresence({
  active,
  consent,
  hasSeenCue,
  markCueSeen,
  memoryDecision,
  onStatusChange,
  visitTier,
}: DirectorPresenceProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const currentTargetRef = useRef<HTMLElement | null>(null);
  const effectTargetRef = useRef<HTMLElement | null>(null);
  const sharedSceneRef = useRef<HTMLElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const behaviorRef = useRef<BehaviorModel>(createBehaviorModel());
  const voiceHistoryRef = useRef<DirectorVoiceHistory>({ ids: [], families: [], registers: [], humor: [] });
  const sessionSeedRef = useRef<string | null>(null);
  const resetConsumedRef = useRef(false);
  const sessionStartedAtRef = useRef<number | null>(null);
  const [textOverlay, setTextOverlay] = useState<TextOverlay | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const cursor = cursorRef.current;
    const note = noteRef.current;
    if (!active || !layer || !cursor || !note) {
      setTextOverlay(null);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const setBrainState = (state: DirectorBrainState, intent = "idle") => {
      layer.dataset.directorState = state;
      layer.dataset.directorIntent = intent;
    };
    if (params.get("director") === "off") {
      setBrainState("disabled");
      return;
    }
    if (window.matchMedia("(max-width: 720px), (pointer: coarse)").matches) {
      setBrainState("paused", "touch");
      return;
    }
    if (!("IntersectionObserver" in window)) {
      setBrainState("disabled", "unsupported");
      onStatusChange("done");
      return;
    }
    const fast = params.get("director") === "fast";
    const visualQa = fast && params.get("directorVisual") === "1";
    const acceleratedMotion = fast && !visualQa;
    const resetRequested = params.get("director") === "reset" || params.get("directorReset") === "1";
    const reset = resetRequested && !resetConsumedRef.current;
    if (reset) resetConsumedRef.current = true;
    const seen = readSeenBeats(reset);
    const intersections = new Map<HTMLElement, number>();
    const targets = directorBeats
      .map((beat) => ({ beat, target: document.querySelector<HTMLElement>(beat.selector) }))
      .filter((item): item is { beat: DirectorBeat; target: HTMLElement } => Boolean(item.target));
    const startedAt = window.performance.now();
    if (sessionStartedAtRef.current === null || reset) sessionStartedAtRef.current = startedAt;
    if (reset) {
      behaviorRef.current = createBehaviorModel(startedAt);
      voiceHistoryRef.current = { ids: [], families: [], registers: [], humor: [] };
      sessionSeedRef.current = null;
    }
    if (sessionSeedRef.current === null) {
      const qaSeed = fast ? params.get("directorSeed") : null;
      sessionSeedRef.current = qaSeed || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }
    const sessionStartedAt = sessionStartedAtRef.current ?? startedAt;
    const behavior = behaviorRef.current;
    behavior.pendingAction ??= consumeDirectorAction();
    const attention: AttentionModel = {
      pointerX: window.innerWidth * .5,
      pointerY: window.innerHeight * .5,
      pointerSeen: false,
      pointerVelocity: 0,
      lastPointerAt: startedAt,
      scrollVelocity: 0,
      scrollDirection: 0,
      lastScrollY: window.scrollY,
      lastScrollSampleAt: startedAt,
    };
    let alive = true;
    let generation = 0;
    let running = false;
    let interval: number | null = null;
    let currentCandidate: Candidate | null = null;
    let candidateSince = startedAt;
    let lastScrollAt = startedAt;
    let lastInputAt = startedAt;
    let nextAllowedAt = startedAt + (fast ? 70 : 120);
    let lastVisitorRedirectAt = Number.NEGATIVE_INFINITY;
    let lastAmbientBeatId: string | null = null;
    let lastWorkedBeatId: string | null = null;
    let autonomousBeatsSinceContext = 0;
    let autonomousAgendaIndex = [...(sessionSeedRef.current ?? "javier")]
      .reduce((total, character) => total + character.charCodeAt(0), 0) % Math.max(1, targets.length);
    let handoffTimer: number | null = null;
    const handoffRequested = document.body.dataset.directorHandoff === "hero-headline";
    const handoffEntry = handoffRequested ? {
      x: (Number(document.body.dataset.directorHandoffX) || window.innerWidth - 142) + window.scrollX,
      y: (Number(document.body.dataset.directorHandoffY) || 42) + window.scrollY,
    } : null;
    if (handoffRequested) {
      delete document.body.dataset.directorHandoff;
      delete document.body.dataset.directorHandoffX;
      delete document.body.dataset.directorHandoffY;
      nextAllowedAt = startedAt;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => intersections.set(entry.target as HTMLElement, entry.intersectionRatio));
    }, { threshold: [0, .2, .4, .6, .8, 1] });
    targets.forEach(({ target }) => observer.observe(target));
    setBrainState("observing", "initialising");

    const hideNote = () => {
      delete note.dataset.typing;
      delete note.dataset.chatSide;
      delete cursor.dataset.chat;
      layer.dataset.directorCommentTyping = "false";
      gsap.set(note, { opacity: 0, scale: .96 });
    };
    const hideCursor = () => gsap.set(cursor, { opacity: 0 });
    const cursorPoint = () => ({
      x: Number(gsap.getProperty(cursor, "x")) || window.scrollX + window.innerWidth - 142,
      y: Number(gsap.getProperty(cursor, "y")) || window.scrollY + 74,
    });
    const cursorIsInViewport = (point = cursorPoint()) => (
      point.x >= window.scrollX - 42
      && point.x <= window.scrollX + window.innerWidth + 42
      && point.y >= window.scrollY - 42
      && point.y <= window.scrollY + window.innerHeight + 42
    );
    const parkCursor = () => {
      gsap.set(cursor, { opacity: 1 });
    };

    const clearTarget = () => {
      const textTarget = currentTargetRef.current;
      if (textTarget) delete textTarget.dataset.directorEditing;
      currentTargetRef.current = null;

      const effectTarget = effectTargetRef.current;
      if (effectTarget) {
        delete effectTarget.dataset.directorEditing;
        gsap.set(effectTarget, { clearProps: "transform,filter" });
        const image = effectTarget.querySelector("img");
        if (image) gsap.set(image, { clearProps: "transform,filter" });
      }
      effectTargetRef.current = null;

      const sharedScene = sharedSceneRef.current;
      if (sharedScene) {
        sharedScene.dataset.liveState = "settled";
        delete sharedScene.dataset.directorSharedEdit;
      }
      sharedSceneRef.current = null;
      setTextOverlay(null);
    };

    const cancelCurrent = (
      status: DirectorPresenceStatus = "connected",
      state: DirectorBrainState = "observing",
      intent = "waiting",
      hardHide = false,
    ) => {
      generation += 1;
      running = false;
      tweenRef.current?.kill();
      tweenRef.current = null;
      clearTarget();
      hideNote();
      if (hardHide) hideCursor();
      else parkCursor();
      onStatusChange(hardHide ? status : cursorIsInViewport() ? status : "elsewhere");
      setBrainState(state, intent);
    };

    // Director is an optional enhancement. Any unexpected browser/animation
    // failure opens this circuit breaker and restores the untouched portfolio.
    const failSafely = () => {
      if (!alive) return;
      cancelCurrent("done", "disabled", "safety-stop", true);
      alive = false;
      observer.disconnect();
      if (interval !== null) window.clearInterval(interval);
    };

    const sleep = (duration: number, runId: number) => new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(alive && generation === runId), duration);
    });

    const moveCursor = async (x: number, y: number, duration: number, runId: number) => {
      tweenRef.current?.kill();
      layer.dataset.directorMotionCount = String(Number(layer.dataset.directorMotionCount ?? "0") + 1);
      tweenRef.current = gsap.to(cursor, { x, y, opacity: 1, duration: duration / 1_000, ease: "power3.inOut" });
      return sleep(duration, runId);
    };

    const typeNote = async (copy: string, runId: number) => {
      const paragraph = note.querySelector("p");
      if (!paragraph) return false;
      paragraph.textContent = copy;
      const width = Math.min(304, window.innerWidth - 32);
      gsap.set(note, { x: 0, y: 0, width, opacity: 0, scale: 1 });
      const height = note.getBoundingClientRect().height;
      const anchor = cursorPoint();
      const safe = {
        top: window.scrollY + 78,
        right: window.scrollX + window.innerWidth - 16,
        bottom: window.scrollY + window.innerHeight - 16,
        left: window.scrollX + 16,
      };
      const candidates = [
        { x: anchor.x + 28, y: anchor.y + 20, side: "right-down" },
        { x: anchor.x - width - 22, y: anchor.y + 20, side: "left-down" },
        { x: anchor.x + 28, y: anchor.y - height - 18, side: "right-up" },
        { x: anchor.x - width - 22, y: anchor.y - height - 18, side: "left-up" },
      ];
      const fits = (candidate: { x: number; y: number }) => (
        candidate.x >= safe.left
        && candidate.x + width <= safe.right
        && candidate.y >= safe.top
        && candidate.y + height <= safe.bottom
      );
      const placement = candidates.find(fits) ?? candidates[0];
      note.dataset.chatSide = placement.side;
      cursor.dataset.chat = "true";
      gsap.set(note, {
        x: clamp(placement.x, safe.left, safe.right - width),
        y: clamp(placement.y, safe.top, safe.bottom - height),
        width,
        opacity: 1,
        scale: 1,
      });
      paragraph.textContent = "";
      note.dataset.typing = "true";
      layer.dataset.directorCommentTyping = "true";
      for (const [index] of [...copy].entries()) {
        paragraph.textContent = copy.slice(0, index + 1);
        if (!await sleep(commentKeyDelay(copy, index, acceleratedMotion), runId)) return false;
      }
      delete note.dataset.typing;
      layer.dataset.directorCommentTyping = "false";
      return true;
    };

    const createOverlay = (target: HTMLElement, segment: string) => {
      const source = target.innerText.replace(/\s+/g, " ").trim();
      const start = source.indexOf(segment);
      if (start < 0) return null;
      const rect = target.getBoundingClientRect();
      const computed = window.getComputedStyle(target);
      const style: CSSProperties = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        minHeight: rect.height,
        color: computed.color,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontStyle: computed.fontStyle,
        fontWeight: computed.fontWeight,
        fontStretch: computed.fontStretch,
        fontVariationSettings: computed.fontVariationSettings,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        textAlign: computed.textAlign as CSSProperties["textAlign"],
        textTransform: computed.textTransform as CSSProperties["textTransform"],
      };
      return {
        before: source.slice(0, start),
        current: segment,
        after: source.slice(start + segment.length),
        selected: false,
        typing: false,
        style,
      } satisfies TextOverlay;
    };

    const runTextBeat = async (beat: DirectorBeat, target: HTMLElement, runId: number) => {
      if (!beat.segment || !beat.actions) return false;
      const isOpeningHeadline = beat.id === "hero-headline-indecision";
      const overlay = createOverlay(target, beat.segment);
      if (!overlay) return false;
      const segmentRect = findSegmentRect(target, beat.segment);
      setTextOverlay(overlay);
      if (!await sleep(50, runId)) return false;
      target.dataset.directorEditing = "text";
      currentTargetRef.current = target;

      const documentSegment = toDocumentRect(segmentRect);
      const baselineY = documentSegment.bottom - 4;
      if (!await moveCursor(documentSegment.right, baselineY, acceleratedMotion ? 90 : isOpeningHeadline ? 280 : 360, runId)) return false;
      setTextOverlay((current) => current ? { ...current, selected: true } : current);
      if (!await moveCursor(documentSegment.left, baselineY, acceleratedMotion ? 120 : isOpeningHeadline ? 680 : 540, runId)) return false;
      if (!await sleep(acceleratedMotion ? 80 : isOpeningHeadline ? 420 : 360, runId)) return false;

      let value = beat.segment;
      let keyIndex = 0;
      let selectionActive = true;
      const followTypedText = () => {
        const typed = layer.querySelector<HTMLElement>("[data-director-current-text]");
        const rects = typed?.getClientRects();
        const lastRect = rects?.length ? rects[rects.length - 1] : null;
        if (lastRect) {
          gsap.set(cursor, {
            x: lastRect.right + window.scrollX,
            y: lastRect.bottom + window.scrollY - 4,
            opacity: 1,
          });
        }
      };
      for (const action of beat.actions) {
        if (action.type === "pause") {
          const pauseDuration = acceleratedMotion ? Math.min(action.duration, 60) : action.duration;
          if (!await sleep(pauseDuration, runId)) return false;
          continue;
        }
        if (action.type === "select-all") {
          const typed = layer.querySelector<HTMLElement>("[data-director-current-text]");
          const typedRect = typed?.getBoundingClientRect();
          if (typedRect) {
            const typedBaseline = typedRect.bottom + window.scrollY - 4;
            if (!await moveCursor(typedRect.right + window.scrollX, typedBaseline, acceleratedMotion ? 55 : isOpeningHeadline ? 240 : 220, runId)) return false;
            setTextOverlay((current) => current ? { ...current, selected: true, typing: false } : current);
            if (!await moveCursor(typedRect.left + window.scrollX, typedBaseline, acceleratedMotion ? 75 : isOpeningHeadline ? 620 : 460, runId)) return false;
          } else {
            setTextOverlay((current) => current ? { ...current, selected: true, typing: false } : current);
          }
          selectionActive = true;
          if (!await sleep(acceleratedMotion ? 60 : isOpeningHeadline ? 360 : 300, runId)) return false;
          continue;
        }
        if (action.type === "type") {
          for (const character of action.value) {
            value = selectionActive ? character : `${value}${character}`;
            selectionActive = false;
            keyIndex += 1;
            setTextOverlay((current) => current ? { ...current, current: value, selected: false, typing: true } : current);
            const delay = acceleratedMotion ? 12 : isOpeningHeadline ? HERO_KEY_DELAYS[keyIndex % HERO_KEY_DELAYS.length] : HUMAN_KEY_DELAYS[keyIndex % HUMAN_KEY_DELAYS.length];
            if (!await sleep(delay, runId)) return false;
            followTypedText();
          }
        } else {
          for (let index = 0; index < action.count; index += 1) {
            value = value.slice(0, -1);
            setTextOverlay((current) => current ? { ...current, current: value, selected: false, typing: true } : current);
            if (!await sleep(acceleratedMotion ? 14 : isOpeningHeadline ? 62 + (index % 3) * 8 : 92 + (index % 3) * 17, runId)) return false;
            followTypedText();
          }
        }
      }
      setTextOverlay((current) => current ? { ...current, typing: false } : current);
      return value === beat.segment;
    };

    const runEffectBeat = async (beat: DirectorBeat, target: HTMLElement, runId: number) => {
      effectTargetRef.current = target;
      const gestureOrigin = cursorPoint();
      if (beat.mode === "comment") {
        if (!await moveCursor(gestureOrigin.x + 7, gestureOrigin.y + 4, acceleratedMotion ? 180 : 680, runId)) return false;
        if (!await sleep(acceleratedMotion ? 40 : 420, runId)) return false;
        return moveCursor(gestureOrigin.x + 2, gestureOrigin.y - 2, acceleratedMotion ? 160 : 620, runId);
      }
      target.dataset.directorEditing = beat.mode;
      if (beat.mode === "crop") {
        const image = target.querySelector("img") ?? target;
        if (!await sleep(acceleratedMotion ? 30 : 360, runId)) return false;
        gsap.to(image, { xPercent: -1.8, scale: 1.025, duration: acceleratedMotion ? .12 : 1.02, ease: "power2.inOut" });
        if (!await moveCursor(gestureOrigin.x - 18, gestureOrigin.y + 4, acceleratedMotion ? 140 : 980, runId)) return false;
        if (!await sleep(acceleratedMotion ? 35 : 520, runId)) return false;
        gsap.to(image, { xPercent: 0, scale: 1, duration: acceleratedMotion ? .12 : 1.04, ease: "power3.inOut" });
        if (!await moveCursor(gestureOrigin.x + 4, gestureOrigin.y - 2, acceleratedMotion ? 140 : 940, runId)) return false;
        return sleep(acceleratedMotion ? 35 : 360, runId);
      }
      if (beat.mode === "easing") {
        if (!await sleep(acceleratedMotion ? 30 : 340, runId)) return false;
        gsap.to(target, { scaleX: .82, transformOrigin: "left", duration: acceleratedMotion ? .12 : 1.08, ease: "power1.in" });
        if (!await moveCursor(gestureOrigin.x + 28, gestureOrigin.y, acceleratedMotion ? 140 : 1_020, runId)) return false;
        if (!await sleep(acceleratedMotion ? 35 : 480, runId)) return false;
        gsap.to(target, { scaleX: 1, duration: acceleratedMotion ? .12 : 1.06, ease: "power4.out" });
        if (!await moveCursor(gestureOrigin.x + 2, gestureOrigin.y, acceleratedMotion ? 140 : 980, runId)) return false;
        return sleep(acceleratedMotion ? 35 : 340, runId);
      }
      if (!await sleep(acceleratedMotion ? 25 : 360, runId)) return false;
      gsap.to(target, { x: 2, y: -1, duration: acceleratedMotion ? .1 : .66, ease: "power2.out" });
      if (!await moveCursor(gestureOrigin.x + 7, gestureOrigin.y - 4, acceleratedMotion ? 120 : 620, runId)) return false;
      if (!await sleep(acceleratedMotion ? 30 : 520, runId)) return false;
      gsap.to(target, { x: 0, y: 0, duration: acceleratedMotion ? .1 : .72, ease: "power3.out" });
      if (!await moveCursor(gestureOrigin.x + 1, gestureOrigin.y, acceleratedMotion ? 120 : 680, runId)) return false;
      return moveCursor(gestureOrigin.x + 6, gestureOrigin.y + 2, acceleratedMotion ? 100 : 440, runId);
    };

    const sessionStage = (now: number): DirectorSessionStage => {
      const elapsed = (now - sessionStartedAt) * (fast ? 60 : 1);
      if (elapsed >= 240_000) return "long-session";
      if (elapsed >= 120_000 || behavior.visitedSections.size >= 6) return "deep-review";
      if (elapsed >= 45_000 || behavior.visitedSections.size >= 3) return "settled";
      if (behavior.fastScrollDetected || behavior.scrollBursts >= 2) return "quick-scan";
      return "opening";
    };

    const currentPace = (now: number): DirectorPace => {
      if (behavior.fastScrollDetected || behavior.scrollBursts >= 2 || attention.scrollVelocity > .3) return "fast";
      if (behavior.focusBeatId && now - behavior.focusSince >= (fast ? 900 : 8_500)) return "patient";
      return "mixed";
    };

    const selectLine = (beat: DirectorBeat, now: number) => beat.selectedLine ?? pickDirectorLine(beat.comments, {
      section: beat.section,
      trigger: beat.trigger,
      visitTier,
      sessionStage: sessionStage(now),
      pace: currentPace(now),
      allowRare: !behavior.rareShown
        && behavior.visitedSections.size >= 6
        && (now - sessionStartedAt) >= (fast ? 4_500 : 90_000),
      seed: `${sessionSeedRef.current}:${beat.id}:${voiceHistoryRef.current.ids.length}:${seen.size}`,
      history: voiceHistoryRef.current,
      hasSeen: consent === "granted" ? hasSeenCue : () => false,
    });

    const recordLine = (line: DirectorLine) => {
      voiceHistoryRef.current = rememberDirectorLine(voiceHistoryRef.current, line);
      if (consent === "granted") markCueSeen(directorCopyMemoryId(line.id));
    };

    const runBeat = async ({ beat, target, entry, quiet = false, intent = "autonomous-work" }: Candidate) => {
      const mayWorkOffscreen = quiet && intent === "autonomous-work";
      if (!alive || !target.isConnected || (!mayWorkOffscreen && visibleRatio(target) < .2)) {
        currentCandidate = null;
        candidateSince = window.performance.now();
        return;
      }
      const startedAt = window.performance.now();
      const line = quiet ? null : selectLine(beat, startedAt);
      if (!quiet && !line) {
        currentCandidate = null;
        candidateSince = startedAt;
        nextAllowedAt = startedAt + (fast ? 180 : 1_200);
        return;
      }
      running = true;
      const runId = ++generation;
      const isOpeningHeadline = beat.id === "hero-headline-indecision";
      const workedBeatId = beat.id.replace(/^ambient:(?:focus:)?/, "");
      if (!quiet) rememberBeat(seen, beat.id);
      if (beat.id.startsWith("context:")) {
        autonomousBeatsSinceContext = 0;
        behavior.lastContextAt = startedAt;
        layer.dataset.directorLastContext = beat.id;
        if (beat.trigger && beat.trigger !== "ambient") behavior.firedTriggers.add(beat.trigger);
        if (beat.trigger === "follow-stop") behavior.pendingAction = null;
        if (beat.trigger === "rare-review") behavior.rareShown = true;
      }
      if (intent === "visitor-focus") lastVisitorRedirectAt = window.performance.now();
      if (quiet) lastAmbientBeatId = beat.id.replace(/^ambient:/, "");
      setBrainState("approaching", intent);
      const targetRect = target.getBoundingClientRect();
      const rect = beat.mode === "text" && beat.segment
        ? findSegmentRect(target, beat.segment)
        : targetRect;
      const documentRect = toDocumentRect(rect);
      const endX = documentRect.right - Math.min(30, documentRect.width * .14);
      const endY = documentRect.top + Math.min(42, documentRect.height * .42);
      const sharedScene = target.closest<HTMLElement>("[data-live-scene]");
      if (sharedScene && !isOpeningHeadline) {
        sharedSceneRef.current = sharedScene;
        sharedScene.dataset.directorSharedEdit = workedBeatId;
        layer.dataset.directorLastSharedEdit = workedBeatId;
        sharedScene.dataset.liveState = "observing";
      }
      if (entry) gsap.set(cursor, { x: entry.x, y: entry.y, opacity: 1 });
      else parkCursor();
      const startPoint = cursorPoint();
      const travelDistance = Math.hypot(endX - startPoint.x, endY - startPoint.y);
      const travelDuration = acceleratedMotion
        ? 110
        : isOpeningHeadline
          ? 620
          : entry
            ? 720
            : clamp(760 + travelDistance * .24, 840, 1_780);
      onStatusChange(cursorIsInViewport({ x: endX, y: endY }) ? "editing" : "elsewhere");
      if (!await moveCursor(endX, endY, travelDuration, runId)) return;
      layer.dataset.directorCue = beat.id;
      if (line) {
        layer.dataset.directorLine = line.id;
        recordLine(line);
        setBrainState("commenting", beat.id.startsWith("context:") ? "contextual-response" : "explaining-choice");
        if (!await typeNote(line.opening, runId)) return;
        const openingHold = isOpeningHeadline
          ? 1_650
          : clamp(900 + line.opening.length * 8, 1_150, 1_700);
        if (!await sleep(acceleratedMotion ? 70 : openingHold, runId)) return;
        gsap.to(note, { opacity: 0, scale: .98, duration: acceleratedMotion ? .06 : .18, ease: "power2.out" });
        if (!await sleep(acceleratedMotion ? 20 : isOpeningHeadline ? 240 : 190, runId)) return;
        hideNote();
      }

      setBrainState(beat.mode === "comment" ? "commenting" : "editing", intent);
      if (sharedSceneRef.current) {
        sharedSceneRef.current.dataset.liveState = "editing";
        window.dispatchEvent(new CustomEvent("portfolio-live-scene-play", { detail: { id: sharedSceneRef.current.dataset.liveScene } }));
      }
      const completed = beat.mode === "text"
        ? await runTextBeat(beat, target, runId)
        : await runEffectBeat(beat, target, runId);
      if (!completed || generation !== runId) return;

      if (line?.resolution) {
        gsap.to(note, { opacity: 0, scale: .98, duration: acceleratedMotion ? .06 : .16, ease: "power2.out" });
        if (!await sleep(acceleratedMotion ? 20 : isOpeningHeadline ? 320 : 220, runId)) return;
        if (!await typeNote(line.resolution, runId)) return;
      }
      const readingHold = line ? clamp(1_600 + (line.resolution ?? line.opening).length * 11, 2_100, 3_400) : 620;
      const holdDuration = acceleratedMotion ? 100 : quiet ? 620 : readingHold;
      const holdPoint = cursorPoint();
      const held = line?.resolution
        ? await sleep(holdDuration, runId)
        : await moveCursor(holdPoint.x + 4, holdPoint.y + 3, holdDuration, runId);
      if (!held) return;
      if (sharedSceneRef.current) {
        sharedSceneRef.current.dataset.liveState = "settling";
        if (!await sleep(acceleratedMotion ? 35 : 520, runId)) return;
      }
      clearTarget();
      setBrainState("roaming", "autonomous-work");
      gsap.to(note, { opacity: 0, scale: .96, duration: acceleratedMotion ? .08 : .22 });
      gsap.to(cursor, { x: endX + 12, y: endY + 8, opacity: 1, duration: acceleratedMotion ? .1 : .42, ease: "power2.inOut" });
      if (!await sleep(acceleratedMotion ? 100 : isOpeningHeadline ? 320 : 460, runId)) return;
      running = false;
      lastWorkedBeatId = workedBeatId;
      if (quiet && intent === "autonomous-work") {
        autonomousBeatsSinceContext += 1;
        layer.dataset.directorAutonomousCount = String(Number(layer.dataset.directorAutonomousCount ?? "0") + 1);
        layer.dataset.directorLastAutonomous = workedBeatId;
      } else if (intent === "visitor-focus") {
        autonomousBeatsSinceContext = 0;
      }
      currentCandidate = null;
      candidateSince = window.performance.now();
      nextAllowedAt = window.performance.now() + (fast ? 70 : 90);
      onStatusChange(cursorIsInViewport({ x: endX + 12, y: endY + 8 }) ? "connected" : "elsewhere");
      setBrainState("roaming", "autonomous-work");
    };

    const rankVisibleCandidates = (now: number) => {
      const viewportCentre = { x: window.innerWidth * .5, y: window.innerHeight * .5 };
      return targets
        .filter(({ target }) => target.isConnected)
        .map(({ beat, target }, index) => {
          const ratio = Math.max(intersections.get(target) ?? 0, visibleRatio(target));
          const rect = target.getBoundingClientRect();
          const pointerSettled = attention.pointerSeen && now - attention.lastPointerAt > (fast ? 80 : 420);
          const referenceX = pointerSettled ? attention.pointerX : viewportCentre.x;
          const referenceY = pointerSettled ? attention.pointerY : viewportCentre.y;
          const x = clamp(referenceX, rect.left, rect.right);
          const y = clamp(referenceY, rect.top, rect.bottom);
          const distance = Math.hypot(referenceX - x, referenceY - y);
          const proximity = 1 - clamp(distance / Math.max(window.innerWidth, window.innerHeight), 0, 1);
          const pointerInside = pointerSettled
            && attention.pointerX >= rect.left && attention.pointerX <= rect.right
            && attention.pointerY >= rect.top && attention.pointerY <= rect.bottom;
          const centreDistance = Math.abs(rect.top + rect.height * .5 - viewportCentre.y) / Math.max(1, window.innerHeight);
          const centreScore = 1 - clamp(centreDistance, 0, 1);
          const score = ratio * 2.35
            + proximity * (pointerSettled ? 1.05 : .45)
            + centreScore * .7
            + (pointerInside ? 1.55 : 0)
            + index * .001
            + (beat.priority ?? 0);
          return { beat, target, score, pointerInside };
        })
        .filter(({ target }) => visibleRatio(target) >= .28 && target.getBoundingClientRect().height > 0)
        .sort((a, b) => b.score - a.score);
    };

    const autonomousCandidate = (): Candidate | null => {
      const connected = targets.filter(({ target }) => target.isConnected && target.getBoundingClientRect().height > 0);
      if (!connected.length) return null;
      const requested = fast ? params.get("directorAgenda") : null;
      const forced = requested ? connected.find(({ beat }) => beat.id === requested) : null;
      const startIndex = forced ? connected.indexOf(forced) : autonomousAgendaIndex % connected.length;
      let selected = connected[startIndex] ?? connected[0];
      if (!forced && (selected.beat.id === lastAmbientBeatId || selected.beat.id === lastWorkedBeatId) && connected.length > 1) {
        selected = connected[(startIndex + 1) % connected.length];
      }
      autonomousAgendaIndex = (connected.indexOf(selected) + 1) % connected.length;
      return {
        beat: { ...selected.beat, id: `ambient:${selected.beat.id}` },
        target: selected.target,
        score: 0,
        pointerInside: false,
        quiet: true,
        intent: "autonomous-work",
      };
    };

    const contextualCandidate = (now: number, anchor: Candidate, allowAmbientContext: boolean): Candidate | null => {
      const elapsed = now - sessionStartedAt;
      const contextualCount = [...seen].filter((id) => id.startsWith("context:")).length;
      const effectiveElapsed = elapsed * (fast ? 60 : 1);
      const contextBudget = effectiveElapsed < 60_000
        ? 2
        : effectiveElapsed < 180_000
          ? 4
          : Math.min(7, 4 + Math.floor((effectiveElapsed - 180_000) / 120_000) + 1);
      const contextGap = fast ? 650 : 18_000;
      const triggerSeen = (trigger: ContextualCueId) => behavior.firedTriggers.has(trigger)
        || [...seen].some((id) => id === `context:${trigger}` || id.startsWith(`context:${trigger}:`));
      const requestedContext = fast ? params.get("directorContext") : null;
      const forcedContext = requestedContext && isContextualTrigger(requestedContext) ? requestedContext : null;
      const directCue = forcedContext
        ?? (memoryDecision && !triggerSeen(`memory-${memoryDecision}` as ContextualCueId)
        ? `memory-${memoryDecision}` as ContextualCueId
        : behavior.pendingAction === "follow-stop" && !triggerSeen("follow-stop")
          ? "follow-stop"
          : null);

      let cueId: ContextualCueId | "ambient" | null = directCue;
      if (!cueId) {
        if (!allowAmbientContext) return null;
        if (contextualCount >= contextBudget || now - behavior.lastContextAt < contextGap) return null;

        const visitCue = `visit-${["one", "two", "three", "four", "five"][visitTier - 1]}` as ContextualCueId;
        const candidates: (ContextualCueId | "ambient")[] = [];
        if (behavior.returnedFromTab && !triggerSeen("tab-return")) candidates.push("tab-return");
        if (behavior.returnedTop && !triggerSeen("returned-top")) candidates.push("returned-top");
        if (behavior.reachedEnd && !triggerSeen("reached-end")) candidates.push("reached-end");
        if ((behavior.fastScrollDetected || behavior.scrollBursts >= 2) && !triggerSeen("fast-scroll")) candidates.push("fast-scroll");
        if (behavior.directionChanges >= 2 && !triggerSeen("direction-change")) candidates.push("direction-change");
        if (behavior.revisitedSection && !triggerSeen("section-revisit")) candidates.push("section-revisit");
        // Concrete behavior should outrank the generic visit greeting: the
        // reaction feels timely only when it acknowledges what just happened.
        if (elapsed >= (fast ? 250 : visitTier > 1 ? 7_000 : 12_000) && !triggerSeen(visitCue)) candidates.push(visitCue);
        if (behavior.focusBeatId === anchor.beat.id
          && now - behavior.focusSince >= (fast ? 900 : 8_500)
          && !triggerSeen("patient-reader")) candidates.push("patient-reader");
        if (sessionStage(now) === "long-session" && !triggerSeen("session-long")) candidates.push("session-long");
        if (sessionStage(now) === "deep-review" && !triggerSeen("session-deep")) candidates.push("session-deep");
        if (sessionStage(now) === "settled" && !triggerSeen("session-settled")) candidates.push("session-settled");
        if (!behavior.rareShown
          && behavior.visitedSections.size >= 6
          && elapsed >= (fast ? 4_500 : 90_000)
          && !triggerSeen("rare-review")) candidates.push("rare-review");
        if (effectiveElapsed >= 25_000) candidates.push("ambient");
        cueId = candidates[0] ?? null;
      }

      if (!cueId) return null;
      const comments = contextualLines(cueId);
      const contextualBeat: DirectorBeat = {
        id: `context:${cueId}`,
        selector: anchor.beat.selector,
        section: anchor.beat.section,
        mode: "comment",
        comments,
        trigger: cueId,
        priority: 10,
      };
      const selectedLine = selectLine(contextualBeat, now);
      if (!selectedLine) return null;
      contextualBeat.id = `context:${cueId}:${selectedLine.id}`;
      contextualBeat.selectedLine = selectedLine;
      return {
        beat: contextualBeat,
        target: anchor.target,
        score: anchor.score + 10,
        pointerInside: anchor.pointerInside,
      };
    };

    const chooseCandidate = (now: number): Candidate | null => {
      const ranked = rankVisibleCandidates(now);
      const anchor = ranked[0];
      if (anchor && behavior.focusBeatId !== anchor.beat.id) {
        if (behavior.focusBeatId && behavior.visitedSections.has(anchor.beat.id)) behavior.revisitedSection = true;
        behavior.focusBeatId = anchor.beat.id;
        behavior.focusSince = now;
        behavior.visitedSections.add(anchor.beat.id);
      }

      // The headline edit is the authored continuation of the Figma opening,
      // including return-mode QA. Contextual awareness must never speak over it.
      const openingHeadline = ranked.find(({ beat }) => beat.id === "hero-headline-indecision" && !seen.has(beat.id));
      if (openingHeadline) return { ...openingHeadline, intent: "figma-handoff" as const };

      const requestedAuthoredBeat = fast ? params.get("directorOnly") : null;
      const qaAuthored = requestedAuthoredBeat
        ? ranked.find(({ beat }) => beat.id === requestedAuthoredBeat && !seen.has(beat.id))
        : null;
      if (qaAuthored) return { ...qaAuthored, intent: "visitor-focus" as const };

      if (anchor) {
        const contextual = contextualCandidate(now, anchor, autonomousBeatsSinceContext >= (fast ? 1 : 2));
        if (contextual) return { ...contextual, intent: "contextual-response" as const };
        const focusHeld = anchor.pointerInside
          && now - behavior.focusSince >= (fast ? 420 : 3_600)
          && now - lastVisitorRedirectAt >= (fast ? 900 : 12_000);
        if (focusHeld && !seen.has(anchor.beat.id)) {
          return { ...anchor, intent: "visitor-focus" as const };
        }
        if (focusHeld) {
          return {
            ...anchor,
            beat: { ...anchor.beat, id: `ambient:focus:${anchor.beat.id}` },
            quiet: true,
            intent: "visitor-focus" as const,
          };
        }
      }
      return autonomousCandidate();
    };

    const evaluate = () => {
      if (!alive || running || document.hidden) return;
      const now = window.performance.now();
      attention.pointerVelocity *= .72;
      attention.scrollVelocity *= .58;
      const scrollIdle = now - lastScrollAt;
      const inputIdle = now - lastInputAt;
      const navigationBusy = attention.scrollVelocity > .18 || scrollIdle < (fast ? 120 : 1_250);
      if (now < nextAllowedAt) {
        parkCursor();
        setBrainState("roaming", "autonomous-work");
        return;
      }
      if (navigationBusy) {
        parkCursor();
        setBrainState("observing", "navigating");
        return;
      }
      // Pointer activity can defer a reaction, but it must never become the
      // engine of Javier's presence. His document-wide agenda keeps running.
      if (attention.pointerVelocity > .65 || inputIdle < (fast ? 100 : 720)) {
        const autonomous = autonomousCandidate();
        if (autonomous) {
          currentCandidate = autonomous;
          candidateSince = now;
          setBrainState("approaching", "autonomous-work");
          void runBeat(autonomous).catch(failSafely);
        }
        return;
      }
      const candidate = chooseCandidate(now);
      if (!candidate) {
        onStatusChange(cursorIsInViewport() ? "connected" : "elsewhere");
        parkCursor();
        setBrainState("roaming", "autonomous-work");
        currentCandidate = null;
        candidateSince = now;
        return;
      }
      onStatusChange(cursorIsInViewport() ? "connected" : "elsewhere");
      if (candidate.intent === "autonomous-work") {
        currentCandidate = candidate;
        candidateSince = now;
        setBrainState("approaching", "autonomous-work");
        void runBeat(candidate).catch(failSafely);
        return;
      }
      if (currentCandidate?.beat.id !== candidate.beat.id || currentCandidate.intent !== candidate.intent) {
        currentCandidate = candidate;
        candidateSince = now;
        setBrainState("considering", candidate.intent ?? "autonomous-work");
        return;
      }
      const pacePenalty = clamp(attention.scrollVelocity * 900, 0, 680);
      const dwell = fast ? 180 : candidate.intent === "visitor-focus" ? 520 + pacePenalty : 1_050 + pacePenalty;
      setBrainState("considering", candidate.intent ?? "autonomous-work");
      if (now - candidateSince >= dwell) void runBeat(candidate).catch(failSafely);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!alive) return;
      const now = window.performance.now();
      const elapsed = Math.max(8, now - attention.lastPointerAt);
      const distance = Math.hypot(event.clientX - attention.pointerX, event.clientY - attention.pointerY);
      const instantaneous = distance / elapsed;
      attention.pointerVelocity = attention.pointerVelocity * .62 + instantaneous * .38;
      attention.pointerX = event.clientX;
      attention.pointerY = event.clientY;
      attention.pointerSeen = true;
      attention.lastPointerAt = now;
      lastInputAt = now;
    };
    const onInput = () => {
      if (!alive) return;
      lastInputAt = window.performance.now();
      setBrainState("observing", "interacting");
    };
    const onScroll = () => {
      if (!alive) return;
      const now = window.performance.now();
      const elapsed = Math.max(8, now - attention.lastScrollSampleAt);
      const delta = window.scrollY - attention.lastScrollY;
      const instantaneous = Math.abs(delta) / elapsed;
      const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const depth = clamp((window.scrollY + window.innerHeight) / Math.max(1, scrollHeight), 0, 1);
      attention.scrollVelocity = attention.scrollVelocity * .45 + instantaneous * .55;
      const nextDirection = delta === 0 ? attention.scrollDirection : delta > 0 ? 1 : -1;
      if (behavior.lastDirection !== 0 && nextDirection !== 0 && nextDirection !== behavior.lastDirection) {
        behavior.directionChanges += 1;
      }
      if (nextDirection !== 0) behavior.lastDirection = nextDirection;
      attention.scrollDirection = nextDirection;
      attention.lastScrollY = window.scrollY;
      attention.lastScrollSampleAt = now;
      behavior.maxScrollY = Math.max(behavior.maxScrollY, window.scrollY);
      behavior.maxScrollDepth = Math.max(behavior.maxScrollDepth, depth);
      if (Math.abs(delta) >= 32 && instantaneous >= .7) behavior.scrollBursts += 1;
      if (Math.abs(delta) >= 80 || instantaneous >= 1.25) behavior.fastScrollDetected = true;
      if (depth >= .92) behavior.reachedEnd = true;
      if (behavior.maxScrollY >= window.innerHeight * .8 && window.scrollY <= window.innerHeight * .12 && delta < 0) {
        behavior.returnedTop = true;
      }
      lastScrollAt = now;
      lastInputAt = now;
      currentCandidate = null;
      candidateSince = now;
      nextAllowedAt = Math.max(nextAllowedAt, now + (fast ? 250 : 950));
      // A viewport gesture invalidates measured overlays. Javier's document
      // coordinate stays untouched, so the camera can naturally leave him
      // behind instead of dragging a dead cursor through every viewport.
      cancelCurrent("connected", "observing", attention.scrollDirection > 0 ? "navigating-down" : "navigating-up");
    };
    const onResize = () => {
      if (!alive) return;
      lastInputAt = window.performance.now();
      cancelCurrent("connected", "observing", "viewport-change");
    };
    const onVisibility = () => {
      if (!alive) return;
      if (document.hidden) cancelCurrent("elsewhere", "paused", "tab-hidden", true);
      else {
        behavior.returnedFromTab = true;
        parkCursor();
        onStatusChange(cursorIsInViewport() ? "connected" : "elsewhere");
        setBrainState("roaming", "autonomous-work");
      }
    };
    const onPause = () => { if (alive) cancelCurrent("connected", "paused", "another-director", true); };
    const onSafetyTest = () => failSafely();

    const initialHeroRect = targets.find(({ beat }) => beat.id === "hero-headline-indecision")?.target.getBoundingClientRect();
    gsap.set(cursor, {
      x: handoffEntry?.x ?? window.scrollX + (initialHeroRect?.right ?? window.innerWidth - 142),
      y: handoffEntry?.y ?? window.scrollY + (initialHeroRect?.top ?? 74) + 28,
      opacity: 1,
    });
    onStatusChange("connected");
    interval = window.setInterval(() => {
      try { evaluate(); } catch { failSafely(); }
    }, fast ? 80 : 240);

    if (handoffRequested) {
      const opening = targets.find(({ beat }) => beat.id === "hero-headline-indecision");
      if (opening && handoffEntry) {
        setBrainState("approaching", "figma-handoff");
        gsap.set(cursor, { x: handoffEntry.x, y: handoffEntry.y, opacity: 1 });
        handoffTimer = window.setTimeout(() => {
          void runBeat({ ...opening, score: 100, pointerInside: false, entry: handoffEntry }).catch(failSafely);
        }, fast ? 20 : 80);
      }
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onInput, { passive: true });
    window.addEventListener("keydown", onInput, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("portfolio-director-pause", onPause);
    window.addEventListener("portfolio-director-safety-test", onSafetyTest);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      generation += 1;
      if (interval !== null) window.clearInterval(interval);
      if (handoffTimer !== null) window.clearTimeout(handoffTimer);
      observer.disconnect();
      tweenRef.current?.kill();
      clearTarget();
      hideNote();
      hideCursor();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("keydown", onInput, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("portfolio-director-pause", onPause);
      window.removeEventListener("portfolio-director-safety-test", onSafetyTest);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, consent, hasSeenCue, markCueSeen, memoryDecision, onStatusChange, visitTier]);

  return (
    <div ref={layerRef} className={styles.layer} data-director-presence data-active={active ? "true" : "false"} data-director-state="observing" data-director-intent="idle" aria-hidden="true">
      {textOverlay ? (
        <div
          className={styles.textOverlay}
          data-director-text-overlay
          data-director-text-typing={textOverlay.typing ? "true" : "false"}
          style={textOverlay.style}
        >
          <span>{textOverlay.before}</span>
          <span data-director-current-text className={textOverlay.selected ? styles.selectedText : textOverlay.typing ? styles.typingText : undefined}>{textOverlay.current}</span>
          <span>{textOverlay.after}</span>
        </div>
      ) : null}
      <div ref={cursorRef} className={styles.cursor} data-javier-cursor><FigmaCursor /><span>Javier</span></div>
      <div ref={noteRef} className={styles.note} data-ambient-note>
        <span className={styles.avatar}>JO</span>
        <div><small>Javier · now</small><p /></div>
      </div>
    </div>
  );
}

type DirectorSafetyBoundaryProps = {
  children: ReactNode;
  onDisable: () => void;
  resetKey: string;
};

// React boundaries cannot catch event-handler failures, so Director also has
// an internal circuit breaker. This boundary covers render/lifecycle faults:
// either path removes only the optional presence layer, never the portfolio.
export class DirectorSafetyBoundary extends Component<DirectorSafetyBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onDisable();
  }

  componentDidUpdate(previous: DirectorSafetyBoundaryProps) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
