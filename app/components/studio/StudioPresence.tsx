"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FigmaCursor } from "../live-file/FigmaCursor";
import { commentKeyDelay } from "../live-file/commentTyping";
import { directorCopy, type CommentSection } from "./directorCopy";
import styles from "./StudioPresence.module.css";

const INTRO_COPY = "Oh—sorry. You caught me working. One second.";
const INTRO_KEY = "jo-studio-intro-v1";

type Point = { x: number; y: number };
type WorkTarget = { id: string; selector: string; detail: string; tune: (element: HTMLElement, alternate: boolean) => gsap.core.Tween };

const workTargets: WorkTarget[] = [
  { id: "snapshot", selector: '[data-studio-target="snapshot"] li:first-child', detail: "Spacing / 02", tune: (el, alternate) => gsap.to(el, { x: alternate ? 0 : 2, duration: .65, ease: "power2.inOut" }) },
  { id: "work", selector: '[data-studio-target="work"] > span', detail: "Composition / 01", tune: (el, alternate) => gsap.to(el, { x: alternate ? 0 : 3, duration: .7, ease: "power2.inOut" }) },
  { id: "about", selector: '[data-studio-target="about"] img', detail: "Crop / 03", tune: (el, alternate) => gsap.to(el, { scale: alternate ? 1 : 1.014, duration: .85, ease: "power2.inOut" }) },
  { id: "proof", selector: '[data-studio-target="proof"] blockquote', detail: "Typesetting / 02", tune: (el, alternate) => gsap.to(el, { letterSpacing: alternate ? "-.018em" : "-.014em", duration: .7, ease: "power2.inOut" }) },
  { id: "faq", selector: '[data-studio-target="faq"] h3', detail: "Typesetting / 01", tune: (el, alternate) => gsap.to(el, { letterSpacing: alternate ? "-.015em" : "-.012em", duration: .7, ease: "power2.inOut" }) },
  { id: "contact", selector: '[data-studio-target="contact"] svg', detail: "Alignment / 02", tune: (el, alternate) => gsap.to(el, { x: alternate ? 0 : 2, duration: .65, ease: "power2.inOut" }) },
];

function centerInDocument(element: Element, root: Element): Point {
  const rect = element.getBoundingClientRect();
  const origin = root.getBoundingClientRect();
  return { x: rect.left - origin.left + rect.width * .56, y: rect.top - origin.top + Math.min(rect.height * .48, 85) };
}

function currentSection(): CommentSection | null {
  const element = document.elementFromPoint(window.innerWidth * .5, window.innerHeight * .46);
  const id = element?.closest("section")?.id;
  return id && Object.prototype.hasOwnProperty.call(directorCopy, id) ? id as CommentSection : null;
}

export function StudioPresence() {
  const introRef = useRef<HTMLDivElement>(null);
  const introCursorRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const presentRef = useRef<HTMLDivElement>(null);
  const introChatRef = useRef<HTMLDivElement>(null);
  const introChatCopyRef = useRef<HTMLParagraphElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const ambientCursorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const commentCopyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = ambientRef.current?.closest(".ordered-home");
    const intro = introRef.current;
    const introCursor = introCursorRef.current;
    const drag = dragRef.current;
    const source = sourceRef.current;
    const drop = dropRef.current;
    const present = presentRef.current;
    const introChat = introChatRef.current;
    const introChatCopy = introChatCopyRef.current;
    const skip = skipRef.current;
    const ambient = ambientRef.current;
    const cursor = ambientCursorRef.current;
    const selection = selectionRef.current;
    const detail = detailRef.current;
    const comment = commentRef.current;
    const commentCopy = commentCopyRef.current;
    if (!root || !intro || !introCursor || !drag || !source || !drop || !present || !introChat || !introChatCopy || !skip || !ambient || !cursor || !selection || !detail || !comment || !commentCopy) return;
    skip.disabled = false;

    let active = true;
    let ambientStarted = false;
    let introFinished = false;
    let workCount = 0;
    let lastWork = "";
    let lastCommentAt = 0;
    let focusedSection: CommentSection | null = null;
    let focusedSince = performance.now();
    let pendingComment: CommentSection | null = null;
    let lastScrollAt = performance.now();
    let entranceActive = document.documentElement.dataset.siteEntrance === "active";
    const shown = new Set<CommentSection>();
    const tuned = new Set<string>();
    const timers = new Set<number>();
    const animations = new Set<gsap.core.Animation>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(pointer: fine) and (min-width: 901px)");
    const ctx = gsap.context(() => {}, ambient);

    const later = (callback: () => void, ms: number) => {
      const timer = window.setTimeout(() => { timers.delete(timer); if (active) callback(); }, ms);
      timers.add(timer);
      return timer;
    };
    const wait = (ms: number) => new Promise<void>((resolve) => later(resolve, ms));
    const tween = (target: Element, vars: gsap.TweenVars) => new Promise<void>((resolve) => {
      if (!active) { resolve(); return; }
      const animation = gsap.to(target, { ...vars, onComplete: () => { animations.delete(animation); resolve(); } });
      animations.add(animation);
    });
    const shutDown = () => {
      active = false;
      timers.forEach(window.clearTimeout);
      timers.clear();
      animations.forEach((animation) => animation.kill());
      animations.clear();
      ctx.revert();
      delete document.documentElement.dataset.studioIntro;
      ambient.dataset.running = "false";
      delete document.querySelector<HTMLElement>("[data-studio-headline]")?.dataset.studioEditing;
    };
    const moveToCaret = (node: HTMLElement) => {
      const text = node.firstChild;
      if (!text || text.nodeType !== Node.TEXT_NODE) return;
      const range = document.createRange();
      range.setStart(text, text.textContent?.length ?? 0);
      range.collapse(true);
      const rect = range.getBoundingClientRect();
      const origin = root.getBoundingClientRect();
      if (rect.width >= 0 && rect.height > 0) gsap.set(cursor, { x: rect.left - origin.left + 1, y: rect.top - origin.top + rect.height * .62 });
    };
    const typeInto = async (node: HTMLElement, copy: string, cadence = 1, followCaret = false) => {
      node.textContent = "";
      for (let index = 0; index < copy.length && active; index += 1) {
        while (entranceActive && active) await wait(100);
        await wait(commentKeyDelay(copy, index) * cadence);
        if (active) {
          node.textContent = copy.slice(0, index + 1);
          if (followCaret) moveToCaret(node);
        }
      }
    };
    const moveCursorTo = (point: Point, duration = 1.15) => tween(cursor, { x: point.x, y: point.y, duration, ease: "power2.inOut" });
    const placeSelection = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const origin = root.getBoundingClientRect();
      gsap.set(selection, { x: rect.left - origin.left - 5, y: rect.top - origin.top - 5, width: rect.width + 10, height: rect.height + 10, autoAlpha: 1 });
    };
    const closeSelection = () => { gsap.set([selection, detail], { autoAlpha: 0 }); };

    const showContextComment = async (section: CommentSection) => {
      const target = document.getElementById(section)?.querySelector<HTMLElement>("h2, h3, blockquote, li");
      if (!target || !active) return;
      const point = centerInDocument(target, root);
      await moveCursorTo(point, 1.25);
      if (!active || document.hidden || currentSection() !== section) return;
      const options = directorCopy[section];
      const copy = options[Math.floor(Math.random() * options.length)];
      const screenX = point.x + root.getBoundingClientRect().left;
      const screenY = point.y + root.getBoundingClientRect().top;
      comment.dataset.side = screenX > window.innerWidth - 350 ? "left" : "right";
      comment.dataset.vertical = screenY > window.innerHeight - 190 ? "above" : "below";
      commentCopy.textContent = "";
      gsap.set(comment, { autoAlpha: 1 });
      await typeInto(commentCopy, copy, .88);
      if (active) await wait(Math.max(2200, Math.min(4200, copy.length * 42)));
      gsap.set(comment, { autoAlpha: 0 });
      shown.add(section);
      lastCommentAt = performance.now();
    };

    const workLoop = async () => {
      while (active && ambientStarted) {
        try {
          if (document.hidden || entranceActive || reduced.matches || !desktop.matches || document.querySelector("dialog[open]")) { await wait(800); continue; }
          if (pendingComment && workCount >= 2) {
            const section = pendingComment;
            pendingComment = null;
            await showContextComment(section);
            continue;
          }
          const candidates = workTargets.filter((item) => item.id !== lastWork && document.querySelector(item.selector));
          if (!candidates.length) { await wait(1400); continue; }
          const task = candidates[Math.floor(Math.random() * candidates.length)];
          const target = document.querySelector<HTMLElement>(task.selector);
          if (!target) continue;
          lastWork = task.id;
          const point = centerInDocument(target, root);
          await moveCursorTo({ x: point.x - 10, y: point.y - 14 }, 1.15 + Math.random() * .55);
          if (!active) break;
          placeSelection(target);
          detail.textContent = task.detail;
          gsap.set(detail, { x: point.x + 17, y: point.y + 22, autoAlpha: 1 });
          await wait(680);
          if (!active) break;
          const adjustment = task.tune(target, tuned.has(task.id));
          animations.add(adjustment);
          await new Promise<void>((resolve) => { adjustment.eventCallback("onComplete", () => { animations.delete(adjustment); resolve(); }); });
          if (!active) break;
          if (tuned.has(task.id)) tuned.delete(task.id); else tuned.add(task.id);
          await wait(950);
          closeSelection();
          workCount += 1;
          await wait(300);
        } catch {
          // The editorial page must survive a failure in its optional presence.
          shutDown();
          break;
        }
      }
    };

    const startAmbient = (from?: Point) => {
      if (!active || ambientStarted || reduced.matches || !desktop.matches) return;
      ambientStarted = true;
      ambient.dataset.running = "true";
      const first = from ?? centerInDocument(document.querySelector("[data-studio-target='snapshot']") ?? root, root);
      gsap.set(cursor, { x: first.x, y: first.y, autoAlpha: 1 });
      void workLoop();
    };

    const editHero = async (from: Point) => {
      const heading = document.querySelector<HTMLElement>("[data-studio-headline]");
      const draft = heading?.querySelector<HTMLElement>("[data-studio-draft-copy]");
      if (!heading || !draft || !active) { startAmbient(from); return; }
      heading.dataset.studioEditing = "true";
      ambient.dataset.running = "true";
      gsap.set(cursor, { x: from.x, y: from.y, autoAlpha: 1 });
      try {
        await moveCursorTo(centerInDocument(heading, root), 1.15);
        if (!active) return;
        draft.dataset.selected = "true";
        await wait(500);
        draft.dataset.selected = "false";
        await typeInto(draft, "Lead Product Designer", 1.1, true);
        await wait(950);
        draft.dataset.selected = "true";
        await wait(540);
        draft.dataset.selected = "false";
        draft.dataset.final = "true";
        await typeInto(draft, "I design the calm\ninside complex\nproducts.", .95, true);
        await wait(500);
      } catch {
        // The final semantic headline has never left the DOM.
      } finally {
        delete heading.dataset.studioEditing;
        if (active) startAmbient(centerInDocument(heading, root));
      }
    };

    const finishIntro = (skip = false) => {
      if (introFinished) return;
      introFinished = true;
      animations.forEach((animation) => animation.kill());
      animations.clear();
      timers.forEach(window.clearTimeout);
      timers.clear();
      try { sessionStorage.setItem(INTRO_KEY, "seen"); } catch { /* session-only is optional */ }
      const rect = present.getBoundingClientRect();
      const origin = root.getBoundingClientRect();
      const from = { x: rect.left - origin.left + rect.width / 2, y: rect.top - origin.top + rect.height / 2 };
      delete document.documentElement.dataset.studioIntro;
      if (skip) later(() => startAmbient(), 750);
      else void editHero(from);
    };
    const onSkip = () => finishIntro(true);
    skip.addEventListener("click", onSkip);

    const startIntro = () => {
      const start = source.getBoundingClientRect();
      const finish = drop.getBoundingClientRect();
      const button = present.getBoundingClientRect();
      const startPoint = { x: start.left + start.width * .5, y: start.top + start.height * .5 };
      const dropPoint = { x: finish.left + finish.width * .55, y: finish.top + finish.height * .44 };
      const presentPoint = { x: button.left + button.width * .5, y: button.top + button.height * .5 };
      gsap.set(introCursor, { x: startPoint.x, y: startPoint.y, autoAlpha: 1 });
      gsap.set(drag, { x: startPoint.x + 8, y: startPoint.y + 8, autoAlpha: 0 });
      gsap.set(introChat, { autoAlpha: 0 });
      const timeline = gsap.timeline({ onComplete: () => finishIntro() });
      animations.add(timeline);
      timeline
        .to(drag, { autoAlpha: 1, duration: .16 }, .45)
        .to(introCursor, { x: dropPoint.x, y: dropPoint.y, duration: 1.5, ease: "power2.inOut" }, .64)
        .to(drag, { x: dropPoint.x + 8, y: dropPoint.y + 8, duration: 1.5, ease: "power2.inOut" }, .64)
        .call(() => { intro.dataset.placed = "true"; }, [], 2.16)
        .to(drag, { autoAlpha: 0, scale: .94, duration: .23 }, 2.18)
        .call(() => {
          introChatCopy.textContent = "";
          introChat.dataset.side = dropPoint.x > window.innerWidth - 350 ? "left" : "right";
          introChat.dataset.vertical = dropPoint.y > window.innerHeight - 170 ? "above" : "below";
          void typeInto(introChatCopy, INTRO_COPY, .85);
        }, [], 2.9)
        .to(introChat, { autoAlpha: 1, duration: .23 }, 2.88)
        .to(introChat, { autoAlpha: 0, duration: .22 }, 6.15)
        .to(introCursor, { x: presentPoint.x, y: presentPoint.y, duration: 1.1, ease: "power2.inOut" }, 6.37)
        .to(present, { scale: .96, duration: .12, yoyo: true, repeat: 1, ease: "power2.inOut" }, 7.53)
        .to(intro, { autoAlpha: 0, duration: .42, ease: "power2.inOut" }, 7.82);
    };

    const onScroll = () => { lastScrollAt = performance.now(); };
    const attention = window.setInterval(() => {
      if (!active || !ambientStarted || entranceActive || document.hidden || reduced.matches || !desktop.matches || shown.size >= 2) return;
      const section = currentSection();
      const now = performance.now();
      if (section !== focusedSection) { focusedSection = section; focusedSince = now; return; }
      if (section && now - focusedSince > 10500 && now - lastScrollAt > 4000 && now - lastCommentAt > 40000 && !shown.has(section)) {
        pendingComment = section;
        focusedSince = now;
      }
    }, 1000);
    const onVisibility = () => { if (document.hidden) { gsap.set([selection, detail, comment], { autoAlpha: 0 }); } };
    const onPreference = () => { if (reduced.matches || !desktop.matches) shutDown(); };
    // Future page-entry choreography owns the same page pixels. It can set
    // data-site-entrance="active" on <html>; Director freezes and disappears
    // until that authored transition has finished.
    const onEntrance = () => {
      entranceActive = document.documentElement.dataset.siteEntrance === "active";
      ambient.dataset.suspended = entranceActive ? "true" : "false";
      if (entranceActive) {
        gsap.set([selection, detail, comment], { autoAlpha: 0 });
        animations.forEach((animation) => animation.pause());
      } else {
        animations.forEach((animation) => animation.resume());
        focusedSince = performance.now();
      }
    };
    const entranceObserver = new MutationObserver(onEntrance);
    entranceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-site-entrance"] });
    onEntrance();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onPreference);
    desktop.addEventListener("change", onPreference);

    try {
      if (reduced.matches || !desktop.matches) delete document.documentElement.dataset.studioIntro;
      else if (document.documentElement.dataset.studioIntro === "on") startIntro();
      else later(() => startAmbient(), 900);
    } catch { shutDown(); }

    return () => {
      skip.removeEventListener("click", onSkip);
      window.clearInterval(attention);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onPreference);
      desktop.removeEventListener("change", onPreference);
      entranceObserver.disconnect();
      shutDown();
    };
  }, []);

  return (
    <>
      <div ref={introRef} className={styles.intro} data-studio-intro data-placed="false">
        <div className={styles.topbar} aria-hidden="true">
          <div className={styles.file}><span className={styles.figmaMark}><i /><i /><i /><i /><i /></span><strong>Javier Ortiz / Portfolio</strong><span className={styles.fileMuted}>Drafts</span></div>
          <div className={styles.topActions}><span className={styles.avatar}>JO</span><span className={styles.share}>Share</span><div ref={presentRef} className={styles.present}><svg viewBox="0 0 16 16"><path d="m5 3 8 5-8 5V3Z" fill="currentColor" /></svg>Present</div></div>
        </div>
        <aside className={styles.layers} aria-hidden="true"><div className={styles.panelTab}>File <span>Assets</span></div><p>Pages</p><div className={styles.layerActive}>⌄ &nbsp; Home</div><p>Layers</p><div className={styles.layer}>⌄ &nbsp; Desktop / Home</div><div className={styles.layerIndent}>Header</div><div className={styles.layerSelected}>Hero</div><div className={styles.layerIndent}>Portrait</div><div className={styles.layerIndent}>Headline</div><div ref={sourceRef} className={styles.assetSource}><span>PHOTO</span><small>hero-portrait.jpg</small></div></aside>
        <aside className={styles.properties} aria-hidden="true"><div className={styles.panelTab}>Design <span>Prototype</span></div><p>Frame</p><div className={styles.propertyGrid}><span>X&nbsp; 254</span><span>Y&nbsp; 118</span><span>W&nbsp; 1440</span><span>H&nbsp; 900</span></div><p>Layout</p><div className={styles.propertyGrid}><span>12 columns</span><span>24 gutter</span></div><p>Fill</p><div className={styles.propertyGrid}><span>#F7F7F3</span><span>100%</span></div></aside>
        <div className={styles.canvas} aria-hidden="true">
          <div className={styles.artboard}>
            <div className={styles.artboardHeader}><span>Javier Ortiz</span><span>WORK &nbsp; / &nbsp; ABOUT &nbsp; / &nbsp; LAB</span></div>
            <div className={styles.artboardBody}><div><small>Senior Product Designer</small><h2>Senior Product<br />Designer</h2><p>Hands-on product design for complex products.</p><span className={styles.artboardCta}>View selected work →</span></div><div ref={dropRef} className={styles.portraitDrop}><div className={styles.portraitPlaceholder}><span>Portrait pending</span><small>Drop image to place</small></div><div className={styles.placedPortrait} /></div></div>
            <div className={styles.artboardRule} />
          </div>
          <span className={styles.canvasLabel}>Desktop / Home</span>
        </div>
        <div className={styles.toolbar} aria-hidden="true"><span>↖</span><span>▢</span><span>◇</span><span>T</span><span>◌</span><span>⌘</span></div>
        <div ref={dragRef} className={styles.dragGhost} aria-hidden="true"><span>hero-portrait.jpg</span></div>
        <div ref={introCursorRef} className={styles.introCursor} aria-hidden="true"><FigmaCursor /><span>Javier</span><div ref={introChatRef} className={styles.introChat}><i>JO</i><p ref={introChatCopyRef} /></div></div>
        <button ref={skipRef} className={styles.skip} type="button" disabled>Skip intro</button>
      </div>
      <div ref={ambientRef} className={styles.ambient} data-director-presence data-running="false" aria-hidden="true">
        <div ref={selectionRef} className={styles.selection}><i /><i /><i /><i /></div>
        <div ref={detailRef} className={styles.detail} />
        <div ref={ambientCursorRef} className={styles.ambientCursor} data-javier-cursor><FigmaCursor /><span>Javier</span><div ref={commentRef} className={styles.comment}><i>JO</i><p ref={commentCopyRef} /></div></div>
      </div>
    </>
  );
}
