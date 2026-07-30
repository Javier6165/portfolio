"use client";

// The first visit is staged inside a deliberately recognisable Figma UI3
// editor. All editor chrome is decorative; the selected artboard is the real,
// semantic hero and becomes the page when Javier enters Presentation mode.

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useNarrative } from "./NarrativeContext";
import styles from "./EditorIntro.module.css";

export type IntroPhase =
  | "boot"
  | "editing"
  | "caught"
  | "presenting"
  | "expanding"
  | "complete"
  | "reduced"
  | "failed";

type IntroRuntimeMode = "first" | "return" | "familiar" | "static";
type ToolIconName = "select" | "frame" | "shape" | "pen" | "text" | "comment" | "actions" | "code" | "play" | "chevron";

function runtimeMode(): IntroRuntimeMode {
  const value = document.documentElement.dataset.narrative;
  return value === "first" || value === "return" || value === "familiar" ? value : "static";
}

function ToolIcon({ name }: { name: ToolIconName }) {
  if (name === "select") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.1 2.8 11.7 6.1-5.1 1.7-2.2 5.2-4.4-13Z" /></svg>;
  if (name === "frame") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2v16M15 2v16M2 5h16M2 15h16" /></svg>;
  if (name === "shape") return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="4" width="12" height="12" rx="1.8" /></svg>;
  if (name === "pen") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 3 5 5-2.4 7H7.4L5 8l5-5Z" /><path d="M10 3v7m-2 0h4" /></svg>;
  if (name === "text") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4h12M10 4v12M7.5 16h5" /></svg>;
  if (name === "comment") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5h12v8.2H9l-3.5 3v-3H4V4.5Z" /></svg>;
  if (name === "actions") return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="6" cy="6" r="2" /><circle cx="14" cy="6" r="2" /><circle cx="6" cy="14" r="2" /><path d="M14 11v6m-3-3h6" /></svg>;
  if (name === "code") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 5-4 5 4 5M12.5 5l4 5-4 5" /></svg>;
  if (name === "play") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 5 7 5-7 5V5Z" /></svg>;
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6.5 8 3.5 3.5L13.5 8" /></svg>;
}

function FigmaMark() {
  return <span className={styles.figmaMark} aria-hidden="true"><i /><i /><i /><i /><i /></span>;
}

export function EditorIntro() {
  const { completeIntro, reducedMotion, replayToken } = useNarrative();
  const [phase, setPhase] = useState<IntroPhase>("editing");
  const [expanded, setExpanded] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorChatRef = useRef<HTMLDivElement>(null);
  const presentRef = useRef<HTMLDivElement>(null);
  const figmaChromeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const expansionRef = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(false);
  const introLockRef = useRef<{ overflow: string; paddingRight: string } | null>(null);

  const finish = useCallback((nextPhase: IntroPhase, focusHeading = false) => {
    activeRef.current = false;
    timelineRef.current?.kill();
    expansionRef.current?.kill();
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (stage) stage.dataset.expanded = "true";
    setExpanded(true);
    setPhase(nextPhase);
    document.body.dataset.liveFile = "complete";
    if (introLockRef.current) {
      document.documentElement.style.overflow = introLockRef.current.overflow;
      document.body.style.paddingRight = introLockRef.current.paddingRight;
      introLockRef.current = null;
    }
    if (frame) gsap.set(frame, { clearProps: "transform" });
    gsap.set([figmaChromeRef.current, cursorRef.current, cursorChatRef.current, selectionRef.current], { clearProps: "all" });
    completeIntro();
    if (focusHeading) window.requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }));
  }, [completeIntro]);

  useLayoutEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);

    const stage = stageRef.current;
    const frame = frameRef.current;
    const title = titleRef.current;
    const portrait = portraitRef.current;
    const selection = selectionRef.current;
    const cursor = cursorRef.current;
    const chat = cursorChatRef.current;
    const present = presentRef.current;
    const figmaChrome = figmaChromeRef.current;
    if (!stage || !frame || !title || !portrait || !selection || !cursor || !chat || !present || !figmaChrome) {
      finish("failed");
      return;
    }

    timelineRef.current?.kill();
    expansionRef.current?.kill();
    setExpanded(false);
    stage.dataset.expanded = "false";

    const replaying = replayToken > 0 && !reducedMotion;
    const mode = replaying ? "first" : reducedMotion ? "static" : runtimeMode();
    document.body.dataset.liveFile = mode === "first" ? "active" : "complete";
    if (mode !== "first") {
      delete document.body.dataset.directorHandoff;
      delete document.body.dataset.directorHandoffX;
      delete document.body.dataset.directorHandoffY;
    }

    // The authored opening is deliberately first-visit only. Return and
    // familiar visits respect the visitor's time and land on the final hero.
    if (mode !== "first") {
      const completionFrame = window.requestAnimationFrame(() => finish(reducedMotion ? "reduced" : "complete"));
      return () => window.cancelAnimationFrame(completionFrame);
    }

    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    introLockRef.current = {
      overflow: document.documentElement.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    document.documentElement.style.overflow = "hidden";
    if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`;

    activeRef.current = true;

    const stageBounds = stage.getBoundingClientRect();
    const selectionBounds = selection.getBoundingClientRect();
    const presentBounds = present.getBoundingClientRect();
    const start = {
      x: selectionBounds.right - stageBounds.left - 18,
      y: selectionBounds.bottom - stageBounds.top - 12,
    };
    const presentPoint = {
      x: presentBounds.left - stageBounds.left + presentBounds.width * .42,
      y: presentBounds.top - stageBounds.top + presentBounds.height * .58,
    };

    gsap.set(figmaChrome, { autoAlpha: 1 });
    gsap.set(cursor, { x: start.x, y: start.y, opacity: 1, scale: 1 });
    gsap.set(chat, { autoAlpha: 0, y: 8, scale: .98 });
    gsap.set(selection, { x: 0 });

    const expandFrame = () => {
      setPhase("expanding");
      document.body.dataset.directorHandoff = "hero-headline";
      document.body.dataset.directorHandoffX = String(Math.round(stageBounds.left + presentPoint.x));
      document.body.dataset.directorHandoffY = String(Math.round(stageBounds.top + presentPoint.y));
      const editorTransform = window.getComputedStyle(frame).transform;
      gsap.set(frame, { transform: editorTransform });
      stage.dataset.expanded = "true";
      setExpanded(true);
      gsap.to([figmaChrome, chat, selection], { autoAlpha: 0, duration: .34, ease: "power2.out" });
      gsap.to(cursor, { opacity: 0, duration: .24, ease: "power2.out" });
      expansionRef.current = gsap.to(frame, {
        transform: "none",
        duration: .92,
        ease: "power4.inOut",
        onComplete: () => finish("complete"),
      });
    };

    const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    timelineRef.current = timeline;
    timeline
      .to(cursor, { x: start.x + 12, y: start.y - 7, duration: .42 }, .12)
      .to(selection, { x: 2, duration: .22, yoyo: true, repeat: 1, ease: "power2.inOut" }, .34)
      .call(() => setPhase("caught"), [], .72)
      .to(chat, { autoAlpha: 1, y: 0, scale: 1, duration: .24, ease: "power2.out" }, .76)
      .call(() => setPhase("presenting"), [], 1.72)
      .to(chat, { autoAlpha: 0, y: -5, duration: .2, ease: "power2.in" }, 1.82)
      .to(cursor, {
        duration: .82,
        ease: "power3.inOut",
        motionPath: {
          path: [
            { x: start.x + 12, y: start.y - 7 },
            { x: stageBounds.width * .72, y: stageBounds.height * .22 },
            presentPoint,
          ],
          curviness: .75,
        },
      }, 1.86)
      .to(present, { scale: .96, duration: .1, yoyo: true, repeat: 1, ease: "power2.inOut" }, 2.74)
      .add(expandFrame, 2.98);

    const activeImage = portrait.querySelector<HTMLImageElement>("img");
    const failPortrait = () => { if (activeRef.current) finish("failed"); };
    activeImage?.addEventListener("error", failPortrait, { once: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (!activeRef.current) return;
      if (["Escape", "PageDown", "PageUp", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) event.preventDefault();
    };
    const onIntentToScroll = (event: WheelEvent | TouchEvent) => {
      if (!activeRef.current) return;
      event.preventDefault();
    };
    const onVisibilityChange = () => { if (document.hidden && activeRef.current) finish("complete"); };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onIntentToScroll, { passive: false });
    window.addEventListener("touchmove", onIntentToScroll, { passive: false });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      activeRef.current = false;
      timeline.kill();
      expansionRef.current?.kill();
      activeImage?.removeEventListener("error", failPortrait);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onIntentToScroll);
      window.removeEventListener("touchmove", onIntentToScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (introLockRef.current) {
        document.documentElement.style.overflow = introLockRef.current.overflow;
        document.body.style.paddingRight = introLockRef.current.paddingRight;
        introLockRef.current = null;
      }
      delete document.body.dataset.liveFile;
    };
  }, [finish, reducedMotion, replayToken]);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div ref={stageRef} className={styles.stage} data-phase={phase} data-expanded={expanded ? "true" : "false"}>
        <div ref={figmaChromeRef} className={styles.figmaChrome} data-figma-editor aria-hidden="true">
          <header className={styles.figmaTopbar}>
            <div className={styles.fileIdentity}>
              <FigmaMark />
              <div><strong>Javier Ortiz / Portfolio</strong><span>Drafts</span></div>
              <ToolIcon name="chevron" />
            </div>
            <div className={styles.topbarTools}>
              <div className={styles.collaborators}><i>JO</i><i>MO</i><i>KS</i></div>
              <button className={styles.shareAction} type="button" tabIndex={-1}>Share</button>
              <div ref={presentRef} className={styles.presentAction}><ToolIcon name="play" /><span>Present</span><ToolIcon name="chevron" /></div>
              <span className={styles.zoom}>68%</span>
            </div>
          </header>

          <aside className={styles.layersPanel}>
            <div className={styles.panelTabs}><b>File</b><span>Assets</span><i /></div>
            <div className={styles.panelSection}><strong>Pages</strong><button type="button" tabIndex={-1}>+</button></div>
            <div className={styles.pageRow} data-current="true"><span>01</span><b>Home</b></div>
            <div className={styles.pageRow}><span>02</span><b>Work</b></div>
            <div className={styles.pageRow}><span>03</span><b>About</b></div>
            <div className={styles.panelSection}><strong>Layers</strong><button type="button" tabIndex={-1}>−</button></div>
            <div className={styles.layerTree}>
              <b><i /> Desktop / Home</b>
              <span><i /> Header</span>
              <span data-selected="true"><i /> Hero</span>
              <small><i /> Portrait</small>
              <small><i /> Javier Ortiz</small>
              <small><i /> Hero statement</small>
              <span><i /> Selected work</span>
            </div>
          </aside>

          <aside className={styles.propertiesPanel}>
            <div className={styles.propertyTabs}><b>Design</b><span>Prototype</span></div>
            <div className={styles.alignmentRow}><i /><i /><i /><i /><i /><i /></div>
            <div className={styles.propertyGroup}>
              <header><strong>Frame</strong><span>•••</span></header>
              <div className={styles.propertyGrid}><span>X&nbsp;&nbsp;254</span><span>Y&nbsp;&nbsp;118</span><span>W&nbsp;&nbsp;1440</span><span>H&nbsp;&nbsp;900</span></div>
              <label><i /> Clip content</label>
            </div>
            <div className={styles.propertyGroup}>
              <header><strong>Layout</strong><span>+</span></header>
              <div className={styles.autoLayoutPreview}><i /><i /><i /><i /><i /></div>
            </div>
            <div className={styles.propertyGroup}><header><strong>Fill</strong><span>+</span></header><div className={styles.fillRow}><i /><span>#0A0B0C</span><b>100%</b></div></div>
            <div className={styles.propertyGroup}><header><strong>Export</strong><span>+</span></header></div>
          </aside>

          <div className={styles.bottomToolbar}>
            {(["select", "frame", "shape", "pen", "text", "comment", "actions", "code"] as ToolIconName[]).map((name, index) => (
              <span key={name} data-active={index === 0 ? "true" : undefined}><ToolIcon name={name} /></span>
            ))}
          </div>
        </div>

        <div ref={frameRef} className={styles.frame} data-live-file-frame>
          <div className={styles.identity}>
            <p id="hero-name" className={styles.name}>Javier Ortiz</p>
            <h1 ref={titleRef} id="hero-title" className={styles.title} tabIndex={-1}>I design the calm inside complex products.</h1>
            <p id="hero-role" className={styles.role}>Senior Product Designer</p>
          </div>

          <figure ref={portraitRef} className={styles.portrait} role="img" aria-label="Portrait of Javier Ortiz.">
            <picture>
              <source type="image/avif" srcSet="/images/portraits/hero-system-960.avif 960w, /images/portraits/hero-system-1440.avif 1440w" sizes="(max-width: 720px) 100vw, 58vw" />
              <source type="image/webp" srcSet="/images/portraits/hero-system-960.webp 960w, /images/portraits/hero-system-1440.webp 1440w" sizes="(max-width: 720px) 100vw, 58vw" />
              <img className="portrait" src="/images/portraits/hero-system.jpg" alt="" aria-hidden="true" width="1800" height="1799" loading="eager" fetchPriority="high" />
            </picture>
          </figure>

          <div ref={selectionRef} className={styles.portraitSelection} aria-hidden="true"><i /><i /><i /><i /><span>Portrait / cover</span></div>
          <Link className={styles.explore} href="#experience"><span>Explore</span><i aria-hidden="true" /></Link>
        </div>

        <div ref={cursorRef} className={styles.multiplayerCursor} aria-hidden="true">
          <ToolIcon name="select" /><span>Javier</span>
        </div>
        <div ref={cursorChatRef} className={styles.cursorChat} aria-hidden="true">
          <i>JO</i><p><strong>Oh—sorry.</strong><span>You caught me working.</span></p>
        </div>
      </div>
    </section>
  );
}
