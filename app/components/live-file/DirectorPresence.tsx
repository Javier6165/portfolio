"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import styles from "./DirectorPresence.module.css";

export type DirectorPresenceStatus = "connected" | "editing" | "elsewhere" | "done";

type TextAction =
  | { type: "type"; value: string }
  | { type: "backspace"; count: number }
  | { type: "pause"; duration: number };

type DirectorBeat = {
  id: string;
  selector: string;
  mode: "text" | "comment" | "nudge" | "crop" | "easing";
  comments: [string, string?];
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

type Candidate = { beat: DirectorBeat; target: HTMLElement; score: number };

const DIRECTOR_MEMORY_KEY = "javier-director-beats-v1";
const HUMAN_KEY_DELAYS = [82, 116, 69, 94, 128, 76, 103, 88, 142, 72];

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
    comments: ["Small correction. Very personal.", "Good catch. By me."],
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
    comments: ["One last word.", "That typo waited for an audience."],
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
    comments: ["The ending can work harder.", "Yes. Without the accidental anagram."],
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
    comments: ["Evidence first. Decoration can wait.", "This frame earns its space."],
  },
  {
    id: "practice-two-pixels",
    selector: "#practice-title",
    mode: "nudge",
    comments: ["This line is leaning left.", "Two pixels. Emotionally significant."],
  },
  {
    id: "ai-validate-typo",
    selector: "#ai-title",
    mode: "text",
    segment: "validate",
    comments: ["Human check, including spelling.", "Validated."],
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
    comments: ["A touch less ‘thought leader’.", "Better. Still me."],
  },
  {
    id: "references-side-typo",
    selector: "#testimonials-title",
    mode: "text",
    segment: "other side",
    comments: ["This needs to sound like a person.", "And be spelt like one."],
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
    comments: ["The timing is technically correct.", "Which is not the same as feeling right."],
  },
  {
    id: "footer-handoff",
    selector: ".footer-contact",
    mode: "comment",
    comments: ["I’ll stop touching it now.", "Probably."],
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
  onStatusChange,
}: {
  active: boolean;
  onStatusChange: (status: DirectorPresenceStatus) => void;
}) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const currentTargetRef = useRef<HTMLElement | null>(null);
  const effectTargetRef = useRef<HTMLElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [textOverlay, setTextOverlay] = useState<TextOverlay | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const note = noteRef.current;
    if (!active || !cursor || !note) {
      setTextOverlay(null);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("director") === "off") return;
    if (window.matchMedia("(max-width: 720px), (pointer: coarse)").matches) return;
    const fast = params.get("director") === "fast";
    const seen = readSeenBeats(params.get("director") === "reset");
    const intersections = new Map<HTMLElement, number>();
    const targets = directorBeats
      .map((beat) => ({ beat, target: document.querySelector<HTMLElement>(beat.selector) }))
      .filter((item): item is { beat: DirectorBeat; target: HTMLElement } => Boolean(item.target));
    const pointer = { x: window.innerWidth * .5, y: window.innerHeight * .5, seen: false };
    let alive = true;
    let generation = 0;
    let running = false;
    let currentCandidate: Candidate | null = null;
    let candidateSince = window.performance.now();
    let lastScrollAt = window.performance.now();
    let lastInputAt = window.performance.now();
    let nextAllowedAt = window.performance.now() + (fast ? 350 : 3_600);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => intersections.set(entry.target as HTMLElement, entry.intersectionRatio));
    }, { threshold: [0, .2, .4, .6, .8, 1] });
    targets.forEach(({ target }) => observer.observe(target));

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

    const cancelCurrent = (status: DirectorPresenceStatus = "connected") => {
      generation += 1;
      running = false;
      tweenRef.current?.kill();
      tweenRef.current = null;
      clearTarget();
      hideNote();
      hideCursor();
      onStatusChange(status);
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

    const runBeat = async ({ beat, target }: Candidate) => {
      running = true;
      const runId = ++generation;
      rememberBeat(seen, beat.id);
      onStatusChange("editing");
      const targetRect = target.getBoundingClientRect();
      const rect = beat.mode === "text" && beat.segment
        ? findSegmentRect(target, beat.segment)
        : targetRect;
      const endX = clamp(rect.right - Math.min(30, rect.width * .14), 24, window.innerWidth - 90);
      const endY = clamp(rect.top + Math.min(42, rect.height * .42), 82, window.innerHeight - 82);
      const noteX = beat.mode === "text" ? targetRect.right : endX;
      const noteY = beat.mode === "text" ? targetRect.top - 140 : endY;
      const startX = clamp(pointer.seen ? pointer.x + 46 : endX + 82, 24, window.innerWidth - 90);
      const startY = clamp(pointer.seen ? pointer.y - 34 : endY - 58, 82, window.innerHeight - 82);
      gsap.set(cursor, { x: startX, y: startY, opacity: 0 });
      if (!await moveCursor(endX, endY, fast ? 130 : 760, runId)) return;
      showNote(beat.comments[0], noteX, noteY);
      if (!await sleep(fast ? 100 : 720, runId)) return;

      const completed = beat.mode === "text"
        ? await runTextBeat(beat, target, runId)
        : await runEffectBeat(beat, target, runId);
      if (!completed || generation !== runId) return;

      if (beat.comments[1]) showNote(beat.comments[1], noteX, noteY);
      if (!await sleep(fast ? 180 : 1_350, runId)) return;
      clearTarget();
      gsap.to(note, { opacity: 0, scale: .96, duration: fast ? .08 : .2 });
      gsap.to(cursor, { x: endX + 12, y: endY + 8, opacity: 0, duration: fast ? .1 : .3, ease: "power2.in" });
      if (!await sleep(fast ? 140 : 360, runId)) return;
      running = false;
      currentCandidate = null;
      candidateSince = window.performance.now();
      nextAllowedAt = window.performance.now() + (fast ? 550 : 8_500);
      onStatusChange(seen.size >= directorBeats.length ? "done" : "connected");
    };

    const chooseCandidate = () => {
      const viewportCentre = { x: window.innerWidth * .5, y: window.innerHeight * .5 };
      const candidates = targets
        .filter(({ beat }) => !seen.has(beat.id))
        .map(({ beat, target }) => {
          const ratio = Math.max(intersections.get(target) ?? 0, visibleRatio(target));
          const rect = target.getBoundingClientRect();
          const x = clamp(pointer.seen ? pointer.x : viewportCentre.x, rect.left, rect.right);
          const y = clamp(pointer.seen ? pointer.y : viewportCentre.y, rect.top, rect.bottom);
          const referenceX = pointer.seen ? pointer.x : viewportCentre.x;
          const referenceY = pointer.seen ? pointer.y : viewportCentre.y;
          const distance = Math.hypot(referenceX - x, referenceY - y);
          const proximity = 1 - clamp(distance / Math.max(window.innerWidth, window.innerHeight), 0, 1);
          const pointerInside = pointer.seen && pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
          return { beat, target, score: ratio * 2.4 + proximity + (pointerInside ? 1.4 : 0) + (beat.priority ?? 0) };
        })
        .filter(({ target }) => visibleRatio(target) >= .28 && target.getBoundingClientRect().height > 0)
        .sort((a, b) => b.score - a.score);
      return candidates[0] ?? null;
    };

    const evaluate = () => {
      if (!alive || running || document.hidden) return;
      const now = window.performance.now();
      if (seen.size >= directorBeats.length) {
        onStatusChange("done");
        return;
      }
      if (now < nextAllowedAt || now - lastScrollAt < (fast ? 120 : 1_250) || now - lastInputAt < (fast ? 100 : 720)) return;
      const candidate = chooseCandidate();
      if (!candidate) {
        onStatusChange("elsewhere");
        currentCandidate = null;
        candidateSince = now;
        return;
      }
      onStatusChange("connected");
      if (currentCandidate?.beat.id !== candidate.beat.id) {
        currentCandidate = candidate;
        candidateSince = now;
        return;
      }
      const rect = candidate.target.getBoundingClientRect();
      const pointerInside = pointer.seen && pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
      const dwell = fast ? 180 : pointerInside ? 1_150 : 2_100;
      if (now - candidateSince >= dwell) void runBeat(candidate);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
      lastInputAt = window.performance.now();
    };
    const onInput = () => { lastInputAt = window.performance.now(); };
    const onScroll = () => {
      const now = window.performance.now();
      lastScrollAt = now;
      lastInputAt = now;
      currentCandidate = null;
      candidateSince = now;
      nextAllowedAt = Math.max(nextAllowedAt, now + (fast ? 250 : 1_450));
      // A viewport gesture invalidates the measured anchor. Hiding in the same
      // scroll task prevents the collaborator cursor from appearing attached
      // to content that is moving underneath it.
      cancelCurrent("connected");
    };
    const onResize = () => {
      lastInputAt = window.performance.now();
      cancelCurrent("connected");
    };
    const onVisibility = () => { if (document.hidden) cancelCurrent("elsewhere"); };
    const onPause = () => cancelCurrent("connected");

    onStatusChange(seen.size >= directorBeats.length ? "done" : "connected");
    const interval = window.setInterval(evaluate, fast ? 80 : 240);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onInput, { passive: true });
    window.addEventListener("keydown", onInput, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("portfolio-director-pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      generation += 1;
      window.clearInterval(interval);
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
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active, onStatusChange]);

  return (
    <div className={styles.layer} data-director-presence data-active={active ? "true" : "false"} aria-hidden="true">
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
