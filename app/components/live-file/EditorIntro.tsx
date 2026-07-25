"use client";

// Both already-optimised portraits coexist so a theme switch can swap them
// instantly without changing the hero's geometry or requesting a loader.

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useNarrative } from "./NarrativeProvider";
import styles from "./EditorIntro.module.css";

export type IntroPhase =
  | "boot"
  | "ready"
  | "typing"
  | "placing-portrait"
  | "refining"
  | "expanding"
  | "complete"
  | "skipped"
  | "reduced"
  | "failed";

type IntroRuntimeMode = "first" | "return" | "familiar" | "static";

function runtimeMode(): IntroRuntimeMode {
  const value = document.documentElement.dataset.narrative;
  return value === "first" || value === "return" || value === "familiar" ? value : "static";
}

export function EditorIntro() {
  const { completeIntro, reducedMotion, replayToken } = useNarrative();
  const [phase, setPhase] = useState<IntroPhase>("boot");
  const [expanded, setExpanded] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const finalWordRef = useRef<HTMLSpanElement>(null);
  const titleSelectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  const portraitSelectionRef = useRef<HTMLDivElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const expansionRef = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(false);

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
    gsap.set(
      [cursorRef.current, assetRef.current, commentRef.current, titleSelectionRef.current, portraitSelectionRef.current],
      { clearProps: "all" },
    );
    if (frame) gsap.set(frame, { clearProps: "transform,borderRadius,boxShadow,borderColor" });
    completeIntro();
    if (focusHeading) {
      window.requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }));
    }
  }, [completeIntro]);

  const skip = useCallback((focusHeading = false) => {
    // The button is server-rendered and may be clicked in the tiny window
    // before GSAP marks the timeline active; skipping must still be reliable.
    if (document.documentElement.dataset.narrative === "complete") return;
    finish("skipped", focusHeading);
  }, [finish]);

  useLayoutEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);

    const stage = stageRef.current;
    const frame = frameRef.current;
    const title = titleRef.current;
    const finalWord = finalWordRef.current;
    const titleSelection = titleSelectionRef.current;
    const portrait = portraitRef.current;
    const portraitSelection = portraitSelectionRef.current;
    const asset = assetRef.current;
    const cursor = cursorRef.current;
    const comment = commentRef.current;
    if (!stage || !frame || !title || !finalWord || !titleSelection || !portrait || !portraitSelection || !asset || !cursor || !comment) {
      finish("failed");
      return;
    }

    timelineRef.current?.kill();
    expansionRef.current?.kill();
    setExpanded(false);
    stage.dataset.expanded = "false";

    const mode = reducedMotion ? "static" : runtimeMode();
    document.body.dataset.liveFile = mode === "static" ? "complete" : "active";
    if (mode === "static") {
      const completionFrame = window.requestAnimationFrame(() => {
        finish(reducedMotion ? "reduced" : "complete");
      });
      return () => window.cancelAnimationFrame(completionFrame);
    }

    activeRef.current = true;
    const readyFrame = window.requestAnimationFrame(() => {
      if (activeRef.current) setPhase("ready");
    });
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const bounds = stage.getBoundingClientRect();
    const pointFor = (element: Element, xRatio = 0.5, yRatio = 0.5) => {
      const target = element.getBoundingClientRect();
      return {
        x: target.left - bounds.left + target.width * xRatio,
        y: target.top - bounds.top + target.height * yRatio,
      };
    };
    const titlePoint = pointFor(title, 0.72, 0.7);
    const assetPoint = pointFor(asset, 0.65, 0.45);
    const portraitPoint = pointFor(portrait, 0.58, 0.52);
    const cursorStart = { x: bounds.width * 0.86, y: isMobile ? 42 : 78 };
    const returningCopy = mode === "familiar" ? "Still checking the spacing?" : "You’re back.";
    comment.querySelector("span")!.textContent = mode === "first" ? "Two pixels. Much better." : returningCopy;

    gsap.set(cursor, { x: cursorStart.x, y: cursorStart.y, opacity: isMobile ? 0 : 1, scale: 0.92 });
    const fitSelection = (selection: HTMLElement, target: Element, padding: number) => {
      const targetBounds = target.getBoundingClientRect();
      gsap.set(selection, {
        left: targetBounds.left - bounds.left - padding,
        top: targetBounds.top - bounds.top - padding,
        width: targetBounds.width + padding * 2,
        height: targetBounds.height + padding * 2,
      });
    };
    fitSelection(titleSelection, title, isMobile ? 4 : 8);
    fitSelection(portraitSelection, portrait, isMobile ? 4 : 8);

    // The complete role is legible from frame one. The timeline refines its
    // emphasis instead of withholding essential positioning copy.
    gsap.set(finalWord, { clipPath: "inset(0 0% 0 0)", opacity: mode === "first" ? 0.28 : 1 });
    gsap.set([titleSelection, portraitSelection, comment], { opacity: 0 });
    gsap.set(asset, { x: 0, y: 0, opacity: mode === "first" ? 1 : 0, scale: 1 });
    gsap.set(portrait, { "--portrait-reveal": mode === "first" ? "100%" : "0%" });

    const expandFrame = () => {
      setPhase("expanding");
      // Freeze the transformed editor frame inline before removing the CSS
      // preview state. Only composited properties animate, so layout geometry
      // remains identical throughout the handoff to the semantic hero.
      const previewTransform = window.getComputedStyle(frame).transform;
      gsap.set(frame, { transform: previewTransform });
      stage.dataset.expanded = "true";
      setExpanded(true);
      expansionRef.current = gsap.to(frame, {
        transform: "none",
        borderRadius: 0,
        borderColor: "transparent",
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: mode === "first" ? 0.92 : 0.72,
        ease: "power4.inOut",
        onComplete: () => finish("complete"),
      });
      gsap.to([cursor, comment, titleSelection, portraitSelection], {
        opacity: 0,
        duration: 0.36,
        ease: "power2.out",
      });
    };

    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });
    timelineRef.current = timeline;
    let readinessTimer: number | null = null;
    let introStarted = false;

    const startTimeline = () => {
      if (introStarted || !activeRef.current) return;
      introStarted = true;
      if (readinessTimer) window.clearTimeout(readinessTimer);
      timeline.play(0);
    };

    const failPortrait = () => {
      if (!activeRef.current) return;
      portrait.dataset.imageStatus = "failed";
      finish("failed");
    };

    if (mode === "first") {
      timeline
        .to(cursor, {
          duration: 0.45,
          motionPath: { path: [cursorStart, { x: titlePoint.x + 34, y: titlePoint.y - 30 }, titlePoint], curviness: 1.2 },
        }, 0.16)
        .call(() => setPhase("typing"), [], 0.4)
        .to(titleSelection, { opacity: 1, duration: 0.16 }, 0.42)
        .to(finalWord, { opacity: 1, duration: 0.46, ease: "power2.out" }, 0.52)
        .to(titleSelection, { opacity: 0.28, duration: 0.18 }, 0.96)
        .to(cursor, {
          duration: 0.46,
          motionPath: { path: [titlePoint, { x: assetPoint.x + 65, y: titlePoint.y + 30 }, assetPoint], curviness: 1.1 },
        }, 1.02)
        .call(() => setPhase("placing-portrait"), [], 1.28)
        .to(asset, { scale: 0.94, duration: 0.12 }, 1.4)
        .to(cursor, {
          duration: 0.66,
          motionPath: { path: [assetPoint, { x: portraitPoint.x - 52, y: assetPoint.y - 68 }, portraitPoint], curviness: 1.25 },
        }, 1.45)
        .to(asset, {
          x: portraitPoint.x - assetPoint.x,
          y: portraitPoint.y - assetPoint.y,
          duration: 0.66,
        }, 1.45)
        .to(portrait, { "--portrait-reveal": "0%", duration: 0.5, ease: "power3.out" }, 1.75)
        .to(asset, { opacity: 0, scale: 0.82, duration: 0.24 }, 1.94)
        .to(portraitSelection, { opacity: 1, duration: 0.18 }, 2.1)
        .call(() => setPhase("refining"), [], 2.22)
        .to(portrait, { x: isMobile ? 0 : -2, y: -2, duration: 0.26, ease: "power2.inOut" }, 2.3)
        .to(comment, { opacity: 1, y: -8, duration: 0.24, ease: "power3.out" }, 2.48)
        .add(expandFrame, 2.82);
    } else {
      gsap.set(portraitSelection, { opacity: 1 });
      timeline
        .to(cursor, {
          duration: 0.46,
          motionPath: { path: [cursorStart, { x: portraitPoint.x + 42, y: portraitPoint.y - 54 }, portraitPoint], curviness: 1.2 },
        }, 0.16)
        .to(comment, { opacity: 1, y: -8, duration: 0.24 }, 0.42)
        .add(expandFrame, mode === "familiar" ? 0.66 : 0.78);
    }

    if (mode === "first") {
      const theme = document.documentElement.dataset.theme === "human" ? "human" : "system";
      const activeImage = portrait.querySelector<HTMLImageElement>(`.portrait--${theme}`);
      readinessTimer = window.setTimeout(startTimeline, 350);
      if (activeImage) {
        activeImage.addEventListener("error", failPortrait, { once: true });
        activeImage.decode().then(startTimeline).catch(failPortrait);
      } else {
        failPortrait();
      }
    } else {
      startTimeline();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "PageDown") skip(true);
    };
    const onIntentToScroll = () => skip(false);
    const onVisibilityChange = () => {
      if (document.hidden) skip(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onIntentToScroll, { passive: true, once: true });
    window.addEventListener("touchmove", onIntentToScroll, { passive: true, once: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      activeRef.current = false;
      timeline.kill();
      expansionRef.current?.kill();
      if (readinessTimer) window.clearTimeout(readinessTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onIntentToScroll);
      window.removeEventListener("touchmove", onIntentToScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      delete document.body.dataset.liveFile;
    };
  }, [finish, reducedMotion, replayToken, skip]);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div
        ref={stageRef}
        className={styles.stage}
        data-phase={phase}
        data-expanded={expanded ? "true" : "false"}
      >
        <div className={styles.canvasGrid} aria-hidden="true" />

        <div className={styles.editorChrome} aria-hidden="true">
          <div className={styles.fileMeta}>
            <i />
            <span>Javier Ortiz / Portfolio</span>
            <b>Working file</b>
          </div>
          <div className={styles.editingState}><i /> Javier is editing</div>
          <div className={styles.zoom}>82%</div>
        </div>

        <button className={styles.skip} type="button" onClick={() => skip(true)}>
          Skip intro
        </button>

        <div ref={frameRef} className={styles.frame} data-live-file-frame>
          <div className={styles.frameMeta} aria-hidden="true">
            <span>HOME / HERO</span><span>1440 × 900</span>
          </div>
          <div className={styles.identity}>
            <p className={styles.name}>Javier Ortiz</p>
            <h1 ref={titleRef} id="hero-title" className={styles.title} tabIndex={-1}>
              <span>Senior Product</span>
              {" "}
              <span ref={finalWordRef} className={styles.finalWord}>Designer</span>
            </h1>
          </div>

          <figure
            ref={portraitRef}
            className={`${styles.portrait} theme-swap`}
            role="img"
            aria-label="Portrait of Javier Ortiz; the photograph changes with the Human or System theme."
          >
            <picture>
              <source
                type="image/avif"
                srcSet="/images/portraits/hero-system-960.avif 960w, /images/portraits/hero-system-1440.avif 1440w"
                sizes="(max-width: 720px) 92vw, 48vw"
              />
              <source
                type="image/webp"
                srcSet="/images/portraits/hero-system-960.webp 960w, /images/portraits/hero-system-1440.webp 1440w"
                sizes="(max-width: 720px) 92vw, 48vw"
              />
              <img
                className="portrait portrait--system"
                src="/images/portraits/hero-system.jpg"
                alt=""
                aria-hidden="true"
                width="1800"
                height="1799"
                loading="eager"
                fetchPriority="auto"
              />
            </picture>
            <picture>
              <source
                type="image/avif"
                srcSet="/images/portraits/hero-human-960.avif 960w, /images/portraits/hero-human-1440.avif 1440w"
                sizes="(max-width: 720px) 92vw, 48vw"
              />
              <source
                type="image/webp"
                srcSet="/images/portraits/hero-human-960.webp 960w, /images/portraits/hero-human-1440.webp 1440w"
                sizes="(max-width: 720px) 92vw, 48vw"
              />
              <img
                className="portrait portrait--human"
                src="/images/portraits/hero-human.jpg"
                alt=""
                aria-hidden="true"
                width="2200"
                height="1753"
                loading="eager"
                fetchPriority="auto"
              />
            </picture>
            <figcaption className={styles.portraitCaption} aria-hidden="true">
              <span>PORTRAIT / THEME LINKED</span><b>01</b>
            </figcaption>
          </figure>

          <Link className={styles.explore} href="#experience">
            <span>Explore</span><i aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.assetTray} aria-hidden="true">
          <span>Assets / 01</span>
          <div ref={assetRef} className={styles.assetCard}>
            <i /><div><b>Javier_portrait</b><span>JPG · theme linked</span></div>
          </div>
        </div>

        <div ref={titleSelectionRef} className={`${styles.selection} ${styles.titleSelection}`} aria-hidden="true">
          <i /><i /><i /><i /><span>H1 / DISPLAY</span>
        </div>
        <div ref={portraitSelectionRef} className={`${styles.selection} ${styles.portraitSelection}`} aria-hidden="true">
          <i /><i /><i /><i /><span>IMAGE / COVER</span>
        </div>

        <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
          <i /><span>Javier</span>
        </div>
        <div ref={commentRef} className={styles.comment} aria-hidden="true">
          <i>JO</i><span>Two pixels. Much better.</span>
        </div>
      </div>
    </section>
  );
}
