"use client";

import { Component, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import {
  contextualCommentary,
  pickDirectorComment,
  sectionCommentary,
  type DirectorCommentPool,
} from "./DirectorCommentary";
import type { NarrativeConsent, VisitTier } from "./NarrativeContext";
import styles from "./DirectorPresence.module.css";

export type DirectorPresenceStatus = "connected" | "editing" | "elsewhere" | "done";
export type DirectorBrainState = "observing" | "considering" | "approaching" | "commenting" | "editing" | "cooldown" | "paused" | "roaming" | "disabled" | "done";

type TextAction =
  | { type: "type"; value: string }
  | { type: "backspace"; count: number }
  | { type: "pause"; duration: number };

type DirectorBeat = {
  id: string;
  selector: string;
  mode: "text" | "comment" | "nudge" | "crop" | "easing";
  comments: DirectorCommentPool;
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

type Candidate = { beat: DirectorBeat; target: HTMLElement; score: number; pointerInside: boolean };
type ContextualCueId = keyof typeof contextualCommentary;

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
    scrollBursts: 0,
    visitedSections: new Set<string>(),
  };
}

// Each text intervention ends on the semantic source string. Director can
// hesitate and correct itself without making transient copy the accessible
// name of a heading or asking React to reconcile a mutated content node.
const directorBeats: DirectorBeat[] = [
  {
    id: "hero-name-typo",
    selector: "#hero-name",
    mode: "text",
    priority: .55,
    segment: "Javier",
    comments: sectionCommentary["hero-name-typo"],
    actions: [
      { type: "type", value: "Javire" },
      { type: "pause", duration: 440 },
      { type: "backspace", count: 2 },
      { type: "type", value: "er" },
    ],
  },
  {
    id: "hero-role-typo",
    selector: "#hero-title",
    mode: "text",
    segment: "Designer",
    comments: sectionCommentary["hero-role-typo"],
    actions: [
      { type: "type", value: "Desginer" },
      { type: "pause", duration: 460 },
      { type: "backspace", count: 5 },
      { type: "type", value: "igner" },
    ],
  },
  {
    id: "snapshot-trust-typo",
    selector: "#snapshot-title",
    mode: "text",
    segment: "test and trust",
    comments: sectionCommentary["snapshot-trust-typo"],
    actions: [
      { type: "type", value: "test and trsut" },
      { type: "pause", duration: 420 },
      { type: "backspace", count: 4 },
      { type: "type", value: "rust" },
    ],
  },
  {
    id: "work-evidence-note",
    selector: ".project-card__media",
    mode: "comment",
    comments: sectionCommentary["work-evidence-note"],
  },
  {
    id: "practice-two-pixels",
    selector: "#practice-title",
    mode: "nudge",
    comments: sectionCommentary["practice-two-pixels"],
  },
  {
    id: "ai-validate-typo",
    selector: "#ai-title",
    mode: "text",
    segment: "validate",
    comments: sectionCommentary["ai-validate-typo"],
    actions: [
      { type: "type", value: "validtae" },
      { type: "pause", duration: 390 },
      { type: "backspace", count: 3 },
      { type: "type", value: "ate" },
    ],
  },
  {
    id: "about-crop-breathe",
    selector: "#about-preview figure",
    mode: "crop",
    comments: sectionCommentary["about-crop-breathe"],
  },
  {
    id: "references-side-typo",
    selector: "#testimonials-title",
    mode: "text",
    segment: "other side",
    comments: sectionCommentary["references-side-typo"],
    actions: [
      { type: "type", value: "other sdie" },
      { type: "pause", duration: 430 },
      { type: "backspace", count: 4 },
      { type: "type", value: "side" },
    ],
  },
  {
    id: "playground-easing",
    selector: ".playground-playhead",
    mode: "easing",
    comments: sectionCommentary["playground-easing"],
  },
  {
    id: "footer-handoff",
    selector: ".footer-contact",
    mode: "comment",
    comments: sectionCommentary["footer-handoff"],
  },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
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
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const behaviorRef = useRef<BehaviorModel>(createBehaviorModel());
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
    const resetRequested = params.get("director") === "reset" || params.get("directorReset") === "1";
    const reset = resetRequested && !resetConsumedRef.current;
    if (reset) resetConsumedRef.current = true;
    const seen = readSeenBeats(reset);
    const intersections = new Map<HTMLElement, number>();
    const targets = directorBeats
      .map((beat) => ({ beat, target: document.querySelector<HTMLElement>(beat.selector) }))
      .filter((item): item is { beat: DirectorBeat; target: HTMLElement } => Boolean(item.target));
    const startedAt = window.performance.now();
    if (sessionStartedAtRef.current === null || reset) sessionStartedAtRef.current = reset ? startedAt : 0;
    if (reset) behaviorRef.current = createBehaviorModel(startedAt);
    const sessionStartedAt = sessionStartedAtRef.current ?? startedAt;
    const behavior = behaviorRef.current;
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
    let nextAllowedAt = startedAt + (fast ? 350 : 3_600);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => intersections.set(entry.target as HTMLElement, entry.intersectionRatio));
    }, { threshold: [0, .2, .4, .6, .8, 1] });
    targets.forEach(({ target }) => observer.observe(target));
    setBrainState("observing", "initialising");

    const hideNote = () => gsap.set(note, { opacity: 0, scale: .96 });
    const hideCursor = () => gsap.set(cursor, { opacity: 0 });

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
      setTextOverlay(null);
    };

    const cancelCurrent = (
      status: DirectorPresenceStatus = "connected",
      state: DirectorBrainState = "observing",
      intent = "waiting",
    ) => {
      generation += 1;
      running = false;
      tweenRef.current?.kill();
      tweenRef.current = null;
      clearTarget();
      hideNote();
      hideCursor();
      onStatusChange(status);
      setBrainState(state, intent);
    };

    // Director is an optional enhancement. Any unexpected browser/animation
    // failure opens this circuit breaker and restores the untouched portfolio.
    const failSafely = () => {
      if (!alive) return;
      cancelCurrent("done", "disabled", "safety-stop");
      alive = false;
      observer.disconnect();
      if (interval !== null) window.clearInterval(interval);
    };

    const sleep = (duration: number, runId: number) => new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(alive && generation === runId), duration);
    });

    const moveCursor = async (x: number, y: number, duration: number, runId: number) => {
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(cursor, { x, y, opacity: .96, duration: duration / 1_000, ease: "power3.inOut" });
      return sleep(duration, runId);
    };

    const showNote = (copy: string, x: number, y: number) => {
      const paragraph = note.querySelector("p");
      if (paragraph) paragraph.textContent = copy;
      const width = Math.min(276, window.innerWidth - 32);
      gsap.set(note, {
        x: clamp(x + 18, 16, window.innerWidth - width - 16),
        y: clamp(y + 30, 78, window.innerHeight - 126),
        width,
        opacity: 1,
        scale: 1,
      });
    };

    const createOverlay = (target: HTMLElement, segment: string) => {
      const source = target.innerText.replace(/\s+/g, " ").trim();
      const start = source.indexOf(segment);
      if (start < 0) return null;
      const rect = target.getBoundingClientRect();
      const computed = window.getComputedStyle(target);
      const style: CSSProperties = {
        top: rect.top,
        left: rect.left,
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
      const overlay = createOverlay(target, beat.segment);
      if (!overlay) return false;
      const segmentRect = findSegmentRect(target, beat.segment);
      setTextOverlay(overlay);
      if (!await sleep(50, runId)) return false;
      target.dataset.directorEditing = "text";
      currentTargetRef.current = target;

      const baselineY = clamp(segmentRect.bottom - 4, 82, window.innerHeight - 72);
      if (!await moveCursor(clamp(segmentRect.right, 24, window.innerWidth - 90), baselineY, fast ? 120 : 360, runId)) return false;
      setTextOverlay((current) => current ? { ...current, selected: true } : current);
      if (!await moveCursor(clamp(segmentRect.left, 24, window.innerWidth - 90), baselineY, fast ? 240 : 540, runId)) return false;
      if (!await sleep(fast ? 170 : 360, runId)) return false;

      let value = beat.segment;
      let keyIndex = 0;
      for (const action of beat.actions) {
        if (action.type === "pause") {
          if (!await sleep(action.duration, runId)) return false;
          continue;
        }
        if (action.type === "type") {
          for (const character of action.value) {
            value = keyIndex === 0 ? character : `${value}${character}`;
            keyIndex += 1;
            setTextOverlay((current) => current ? { ...current, current: value, selected: false, typing: true } : current);
            const delay = fast ? 38 : HUMAN_KEY_DELAYS[keyIndex % HUMAN_KEY_DELAYS.length];
            if (!await sleep(delay, runId)) return false;
          }
        } else {
          for (let index = 0; index < action.count; index += 1) {
            value = value.slice(0, -1);
            setTextOverlay((current) => current ? { ...current, current: value, selected: false, typing: true } : current);
            if (!await sleep(fast ? 34 : 92 + (index % 3) * 17, runId)) return false;
          }
        }
      }
      setTextOverlay((current) => current ? { ...current, typing: false } : current);
      return value === beat.segment;
    };

    const runEffectBeat = async (beat: DirectorBeat, target: HTMLElement, runId: number) => {
      effectTargetRef.current = target;
      if (beat.mode === "comment") return sleep(fast ? 180 : 1_150, runId);
      target.dataset.directorEditing = beat.mode;
      if (beat.mode === "crop") {
        const image = target.querySelector("img") ?? target;
        gsap.to(image, { xPercent: -1.8, scale: 1.025, duration: fast ? .12 : .72, ease: "power2.inOut" });
        if (!await sleep(fast ? 140 : 820, runId)) return false;
        gsap.to(image, { xPercent: 0, scale: 1, duration: fast ? .12 : .68, ease: "power3.inOut" });
        return sleep(fast ? 140 : 760, runId);
      }
      if (beat.mode === "easing") {
        gsap.to(target, { scaleX: .82, transformOrigin: "left", duration: fast ? .12 : .68, ease: "power1.in" });
        if (!await sleep(fast ? 140 : 760, runId)) return false;
        gsap.to(target, { scaleX: 1, duration: fast ? .12 : .72, ease: "power4.out" });
        return sleep(fast ? 140 : 800, runId);
      }
      gsap.to(target, { x: 2, y: -1, duration: fast ? .1 : .34, ease: "power2.out" });
      if (!await sleep(fast ? 120 : 430, runId)) return false;
      gsap.to(target, { x: 0, y: 0, duration: fast ? .1 : .38, ease: "power3.out" });
      return sleep(fast ? 120 : 460, runId);
    };

    const chooseCopy = (beat: DirectorBeat, phase: "opening" | "resolution", pool: readonly string[]) => {
      const persistenceEnabled = consent === "granted";
      return pickDirectorComment({
        pool,
        sourceId: beat.id,
        phase,
        seed: `${visitTier}:${attention.scrollDirection}:${Math.round(window.scrollY / 240)}:${seen.size}`,
        hasSeen: persistenceEnabled ? hasSeenCue : () => false,
        remember: persistenceEnabled ? markCueSeen : () => undefined,
      });
    };

    const runBeat = async ({ beat, target }: Candidate) => {
      if (!alive || !target.isConnected || visibleRatio(target) < .2) return;
      running = true;
      const runId = ++generation;
      rememberBeat(seen, beat.id);
      if (beat.id.startsWith("context:")) behavior.lastContextAt = window.performance.now();
      onStatusChange("editing");
      setBrainState("approaching", "moving-to-focus");
      const targetRect = target.getBoundingClientRect();
      const rect = beat.mode === "text" && beat.segment
        ? findSegmentRect(target, beat.segment)
        : targetRect;
      const endX = clamp(rect.right - Math.min(30, rect.width * .14), 24, window.innerWidth - 90);
      const endY = clamp(rect.top + Math.min(42, rect.height * .42), 82, window.innerHeight - 82);
      const noteX = beat.mode === "text" ? targetRect.right : endX;
      const noteY = beat.mode === "text" ? targetRect.top - 140 : endY;
      const startX = clamp(attention.pointerSeen ? attention.pointerX + 46 : endX + 82, 24, window.innerWidth - 90);
      const startY = clamp(attention.pointerSeen ? attention.pointerY - 34 : endY - 58, 82, window.innerHeight - 82);
      gsap.set(cursor, { x: startX, y: startY, opacity: 0 });
      if (!await moveCursor(endX, endY, fast ? 130 : 760, runId)) return;
      setBrainState("commenting", "explaining-choice");
      layer.dataset.directorCue = beat.id;
      showNote(chooseCopy(beat, "opening", beat.comments.opening), noteX, noteY);
      if (!await sleep(fast ? 100 : 720, runId)) return;

      setBrainState(beat.mode === "comment" ? "commenting" : "editing", beat.mode);
      const completed = beat.mode === "text"
        ? await runTextBeat(beat, target, runId)
        : await runEffectBeat(beat, target, runId);
      if (!completed || generation !== runId) return;

      if (beat.comments.resolution?.length) {
        showNote(chooseCopy(beat, "resolution", beat.comments.resolution), noteX, noteY);
      }
      if (!await sleep(fast ? 180 : 1_350, runId)) return;
      clearTarget();
      setBrainState("cooldown", "giving-space");
      gsap.to(note, { opacity: 0, scale: .96, duration: fast ? .08 : .2 });
      gsap.to(cursor, { x: endX + 12, y: endY + 8, opacity: 0, duration: fast ? .1 : .3, ease: "power2.in" });
      if (!await sleep(fast ? 140 : 360, runId)) return;
      running = false;
      currentCandidate = null;
      candidateSince = window.performance.now();
      nextAllowedAt = window.performance.now() + (fast ? 550 : 8_500);
      onStatusChange("connected");
      setBrainState("cooldown", "giving-space");
    };

    const rankCandidates = (now: number) => {
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
          // Utility-AI blend: visitor focus dominates when it is clear, while
          // a small rotating authored bias lets Javier keep working on his own.
          const autonomousBias = ((Math.sin(now / 5_400 + index * 1.7) + 1) / 2) * .22;
          const centreScore = 1 - clamp(centreDistance, 0, 1);
          const score = ratio * 2.35
            + proximity * (pointerSettled ? 1.05 : .45)
            + centreScore * .7
            + (pointerInside ? 1.55 : 0)
            + autonomousBias
            + (beat.priority ?? 0);
          return { beat, target, score, pointerInside };
        })
        .filter(({ target }) => visibleRatio(target) >= .28 && target.getBoundingClientRect().height > 0)
        .sort((a, b) => b.score - a.score);
    };

    const contextualCandidate = (now: number, anchor: Candidate): Candidate | null => {
      const elapsed = now - sessionStartedAt;
      const contextualCount = [...seen].filter((id) => id.startsWith("context:")).length;
      const contextGap = fast ? 650 : 22_000;
      let cueId: ContextualCueId | null = null;

      // A direct choice gets a direct acknowledgement. Everything else is
      // deliberately rate-limited so awareness never turns into surveillance.
      if (memoryDecision && !seen.has(`context:memory-${memoryDecision}`)) {
        cueId = `memory-${memoryDecision}` as ContextualCueId;
      } else if (contextualCount >= 4 || now - behavior.lastContextAt < contextGap) {
        return null;
      } else if (consent === "granted" && visitTier > 1 && elapsed >= (fast ? 250 : 7_000)) {
        const visitCue = `visit-${["one", "two", "three", "four", "five"][visitTier - 1]}` as ContextualCueId;
        if (!seen.has(`context:${visitCue}`)) cueId = visitCue;
      } else if (visitTier === 1 && elapsed >= (fast ? 5_500 : 12_000) && !seen.has("context:visit-one")) {
        cueId = "visit-one";
      } else if (behavior.returnedTop && !seen.has("context:returned-top")) {
        cueId = "returned-top";
      } else if (behavior.reachedEnd && !seen.has("context:reached-end")) {
        cueId = "reached-end";
      } else if ((behavior.fastScrollDetected || behavior.scrollBursts >= 2) && !seen.has("context:fast-scroll")) {
        cueId = "fast-scroll";
      } else if (behavior.revisitedSection && !seen.has("context:section-revisit")) {
        cueId = "section-revisit";
      } else if (behavior.focusBeatId === anchor.beat.id
        && now - behavior.focusSince >= (fast ? 900 : 8_500)
        && !seen.has("context:patient-reader")) {
        cueId = "patient-reader";
      } else if (elapsed >= (fast ? 4_500 : 240_000) && !seen.has("context:session-four-minutes")) {
        cueId = "session-four-minutes";
      } else if (elapsed >= (fast ? 3_000 : 120_000) && !seen.has("context:session-two-minutes")) {
        cueId = "session-two-minutes";
      } else if (elapsed >= (fast ? 1_500 : 45_000) && !seen.has("context:session-forty-five")) {
        cueId = "session-forty-five";
      }

      if (!cueId) return null;
      return {
        beat: {
          id: `context:${cueId}`,
          selector: anchor.beat.selector,
          mode: "comment",
          comments: { opening: contextualCommentary[cueId] },
          priority: 10,
        },
        target: anchor.target,
        score: anchor.score + 10,
        pointerInside: anchor.pointerInside,
      };
    };

    const chooseCandidate = (now: number) => {
      const ranked = rankCandidates(now);
      const anchor = ranked[0];
      if (!anchor) return null;

      if (behavior.focusBeatId !== anchor.beat.id) {
        if (behavior.focusBeatId && behavior.visitedSections.has(anchor.beat.id)) behavior.revisitedSection = true;
        behavior.focusBeatId = anchor.beat.id;
        behavior.focusSince = now;
        behavior.visitedSections.add(anchor.beat.id);
      }

      const contextual = contextualCandidate(now, anchor);
      if (contextual) return contextual;
      return ranked.find(({ beat }) => !seen.has(beat.id)) ?? null;
    };

    const evaluate = () => {
      if (!alive || running || document.hidden) return;
      const now = window.performance.now();
      attention.pointerVelocity *= .72;
      attention.scrollVelocity *= .58;
      const scrollIdle = now - lastScrollAt;
      const inputIdle = now - lastInputAt;
      const visitorBusy = attention.scrollVelocity > .18 || attention.pointerVelocity > .65;
      if (now < nextAllowedAt) {
        setBrainState("cooldown", "giving-space");
        return;
      }
      if (visitorBusy || scrollIdle < (fast ? 120 : 1_250) || inputIdle < (fast ? 100 : 720)) {
        setBrainState("observing", attention.scrollVelocity > .18 ? "navigating" : "interacting");
        return;
      }
      const candidate = chooseCandidate(now);
      if (!candidate) {
        onStatusChange("elsewhere");
        setBrainState("roaming", "working-elsewhere");
        currentCandidate = null;
        candidateSince = now;
        return;
      }
      onStatusChange("connected");
      if (currentCandidate?.beat.id !== candidate.beat.id) {
        currentCandidate = candidate;
        candidateSince = now;
        setBrainState("considering", candidate.pointerInside ? "visitor-focus" : "autonomous-focus");
        return;
      }
      const pacePenalty = clamp(attention.scrollVelocity * 900, 0, 680);
      const dwell = fast ? 180 : candidate.pointerInside ? 1_150 + pacePenalty : 2_100 + pacePenalty;
      setBrainState("considering", candidate.pointerInside ? "visitor-focus" : "autonomous-focus");
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
      attention.scrollDirection = delta === 0 ? attention.scrollDirection : delta > 0 ? 1 : -1;
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
      nextAllowedAt = Math.max(nextAllowedAt, now + (fast ? 250 : 1_450));
      // A viewport gesture invalidates the measured anchor. Hiding in the same
      // scroll task prevents the collaborator cursor from appearing attached
      // to content that is moving underneath it.
      cancelCurrent("connected", "observing", attention.scrollDirection > 0 ? "navigating-down" : "navigating-up");
    };
    const onResize = () => {
      if (!alive) return;
      lastInputAt = window.performance.now();
      cancelCurrent("connected", "observing", "viewport-change");
    };
    const onVisibility = () => { if (alive && document.hidden) cancelCurrent("elsewhere", "paused", "tab-hidden"); };
    const onPause = () => { if (alive) cancelCurrent("connected", "paused", "another-director"); };
    const onSafetyTest = () => failSafely();

    onStatusChange("connected");
    interval = window.setInterval(() => {
      try { evaluate(); } catch { failSafely(); }
    }, fast ? 80 : 240);
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
        <div className={styles.textOverlay} data-director-text-overlay style={textOverlay.style}>
          <span>{textOverlay.before}</span>
          <span className={textOverlay.selected ? styles.selectedText : textOverlay.typing ? styles.typingText : undefined}>{textOverlay.current}</span>
          <span>{textOverlay.after}</span>
        </div>
      ) : null}
      <div ref={cursorRef} className={styles.cursor} data-javier-cursor><i /><span>Javier</span></div>
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
