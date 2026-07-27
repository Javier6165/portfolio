"use client";

// The canonical Dark portrait is decoded before the first-visit placement beat
// so the editor gesture never reveals an unloaded image.

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useNarrative } from "./NarrativeProvider";
import styles from "./EditorIntro.module.css";

export type IntroPhase =
  | "boot"
  | "loading"
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
  const [canSkip, setCanSkip] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const finalWordRef = useRef<HTMLSpanElement>(null);
  const titleSelectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  const portraitSelectionRef = useRef<HTMLDivElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderProgressRef = useRef<HTMLDivElement>(null);
  const loaderPercentRef = useRef<HTMLSpanElement>(null);
  const loaderStatusRef = useRef<HTMLSpanElement>(null);
  const premiseRef = useRef<HTMLDivElement>(null);
  const presentRef = useRef<HTMLDivElement>(null);
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
    // A skip can happen before the reveal timeline has touched either asset.
    // Resolve the semantic hero explicitly instead of leaving an early
    // timeline value (dimmed title or clipped portrait) on the final frame.
    gsap.set(finalWordRef.current, { opacity: 1, clipPath: "inset(0 0% 0 0)", clearProps: "transform" });
    gsap.set(portraitRef.current, { "--portrait-reveal": "0%", x: 0, y: 0 });
    gsap.set(
      [cursorRef.current, assetRef.current, loaderRef.current, premiseRef.current, presentRef.current, titleSelectionRef.current, portraitSelectionRef.current],
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
    const loader = loaderRef.current;
    const loaderProgress = loaderProgressRef.current;
    const loaderPercent = loaderPercentRef.current;
    const loaderStatus = loaderStatusRef.current;
    const premise = premiseRef.current;
    const present = presentRef.current;
    if (!stage || !frame || !title || !finalWord || !titleSelection || !portrait || !portraitSelection || !asset || !cursor || !loader || !loaderProgress || !loaderPercent || !loaderStatus || !premise || !present) {
      finish("failed");
      return;
    }

    timelineRef.current?.kill();
    expansionRef.current?.kill();
    setExpanded(false);
    stage.dataset.expanded = "false";

    const mode = reducedMotion ? "static" : runtimeMode();
    setCanSkip(mode === "return");
    document.body.dataset.liveFile = mode === "static" ? "complete" : "active";
    if (mode === "static") {
      const completionFrame = window.requestAnimationFrame(() => {
        finish(reducedMotion ? "reduced" : "complete");
      });
      return () => window.cancelAnimationFrame(completionFrame);
    }

    // Familiar visits should feel instant, not like a compressed version of
    // the edit. A sub-second cursor pass reads as a visual glitch rather than
    // intentional craft, so only the first and return scores are animated.
    if (mode === "familiar") {
      const completionFrame = window.requestAnimationFrame(() => finish("complete"));
      return () => window.cancelAnimationFrame(completionFrame);
    }

    if (mode === "first") {
      const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      introLockRef.current = {
        overflow: document.documentElement.style.overflow,
        paddingRight: document.body.style.paddingRight,
      };
      document.documentElement.style.overflow = "hidden";
      if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`;
    }

    activeRef.current = true;
    const readyFrame = window.requestAnimationFrame(() => {
      if (activeRef.current) setPhase(mode === "first" ? "loading" : "ready");
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
    const premisePoint = pointFor(premise, 0.08, 0.5);
    const presentPoint = pointFor(present, 0.5, 0.5);
    const cursorStart = { x: bounds.width * 0.86, y: isMobile ? 42 : 78 };
    const premiseLead = premise.querySelector<HTMLElement>("strong");
    const premiseReply = premise.querySelector<HTMLElement>("span");

    gsap.set(cursor, { x: cursorStart.x, y: cursorStart.y, opacity: 0, scale: 0.92 });
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
    gsap.set(finalWord, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
    gsap.set([titleSelection, portraitSelection, premise], { opacity: 0 });
    gsap.set([premiseLead, premiseReply], { opacity: 0, y: 4 });
    gsap.set(loader, { autoAlpha: mode === "first" ? 1 : 0 });
    gsap.set(loaderProgress, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(asset, { x: 0, y: 0, opacity: mode === "first" ? 1 : 0, scale: 1 });
    gsap.set(portrait, { "--portrait-reveal": "0%" });

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
      gsap.to([cursor, premise, titleSelection, portraitSelection], {
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
      const loadingValue = { value: 0 };
      timeline
        .to(loaderProgress, { scaleX: 1, duration: .72, ease: "power2.inOut" }, 0.08)
        .to(loadingValue, {
          value: 100,
          duration: .72,
          ease: "power2.inOut",
          onUpdate: () => { loaderPercent.textContent = `${Math.round(loadingValue.value)}%`; },
        }, 0.08)
        .call(() => { loaderStatus.textContent = "Live file ready"; }, [], .55)
        .to(loader, { autoAlpha: 0, duration: .34, ease: "power3.inOut" }, .78)
        .call(() => setPhase("ready"), [], 1.0)
        .to(cursor, { opacity: isMobile ? 0 : 1, scale: 1, duration: .24, ease: "power2.out" }, 1.02)
        .to(cursor, {
          duration: .58,
          ease: "power3.inOut",
          motionPath: { path: [cursorStart, premisePoint], curviness: .35 },
        }, 1.12)
        .to(premise, { opacity: 1, duration: .28, ease: "power3.out" }, 1.42)
        .to(premiseLead, { opacity: 1, y: 0, duration: .3, ease: "power3.out" }, 1.5)
        .to(premiseReply, { opacity: 1, y: 0, duration: .3, ease: "power3.out" }, 2.65)
        .to(cursor, {
          duration: .64,
          ease: "power3.inOut",
          motionPath: { path: [premisePoint, presentPoint], curviness: .3 },
        }, 3.18)
        .to(present, { scale: .94, duration: .12, yoyo: true, repeat: 1, ease: "power2.inOut" }, 3.78)
        .call(() => setPhase("expanding"), [], 3.96)
        .add(expandFrame, 4.02);
    } else {
      timeline
        .to(cursor, { opacity: isMobile ? 0 : 1, scale: 1, duration: 0.18, ease: "power2.out" }, 0.12)
        .to(cursor, {
          duration: .48,
          motionPath: { path: [cursorStart, presentPoint], curviness: .3 },
        }, 0.28)
        .to(present, { scale: .94, duration: .1, yoyo: true, repeat: 1 }, .72)
        .add(expandFrame, .96);
    }

    if (mode === "first") {
      const activeImage = portrait.querySelector<HTMLImageElement>("img");
      readinessTimer = window.setTimeout(startTimeline, 550);
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
      // The effect stays mounted after the visual timeline hands off the hero.
      // Once finish() clears activeRef, these listeners must become inert or
      // they would keep swallowing every later scroll gesture on a first visit.
      if (!activeRef.current) return;
      if (mode === "first" && ["Escape", "PageDown", "PageUp", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        return;
      }
      if (mode === "return" && (event.key === "Escape" || event.key === "PageDown")) skip(true);
    };
    const onIntentToScroll = (event: WheelEvent | TouchEvent) => {
      if (!activeRef.current) return;
      if (mode === "first") {
        event.preventDefault();
        return;
      }
      skip(false);
    };
    const onVisibilityChange = () => {
      if (document.hidden) skip(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onIntentToScroll, { passive: false });
    window.addEventListener("touchmove", onIntentToScroll, { passive: false });
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
      if (introLockRef.current) {
        document.documentElement.style.overflow = introLockRef.current.overflow;
        document.body.style.paddingRight = introLockRef.current.paddingRight;
        introLockRef.current = null;
      }
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
          <div className={styles.editorTools}><b>M</b><span>F</span><span>T</span><span>C</span></div>
          <div className={styles.editorActions}>
            <div className={styles.editingState}><i /> Javier</div>
            <div ref={presentRef} className={styles.presentAction}><i /> Present</div>
            <div className={styles.zoom}>82%</div>
          </div>
        </div>

        <button
          className={styles.skip}
          data-available={canSkip ? "true" : "false"}
          type="button"
          onClick={(event) => skip(event.detail === 0)}
        >
          Skip opening
        </button>

        <div ref={loaderRef} className={styles.loader} aria-hidden="true">
          <div className={styles.loaderMark}>JO</div>
          <div className={styles.loaderCopy}>
            <span>Opening working file</span>
            <strong>Javier Ortiz / Portfolio</strong>
            <small>Senior Product Designer</small>
          </div>
          <div className={styles.loaderTrack}><i ref={loaderProgressRef} /></div>
          <div className={styles.loaderMeta}>
            <span ref={loaderStatusRef}>Loading components</span>
            <span ref={loaderPercentRef}>0%</span>
          </div>
        </div>

        <div ref={premiseRef} className={styles.premise} aria-hidden="true">
          <i>JO</i>
          <div><strong>Oh. Hi. You caught me at “one last tweak”.</strong><span>Right. Let’s make this less awkward — full screen.</span></div>
        </div>

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

          <div className={styles.frameStatus} aria-hidden="true">
            <span>LIVE FILE / READY</span><span>36.5102° N · 4.8864° W</span>
          </div>

          <figure
            ref={portraitRef}
            className={styles.portrait}
            role="img"
            aria-label="Portrait of Javier Ortiz."
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
                className="portrait"
                src="/images/portraits/hero-system.jpg"
                alt=""
                aria-hidden="true"
                width="1800"
                height="1799"
                loading="eager"
                fetchPriority="auto"
              />
            </picture>
            <figcaption className={styles.portraitCaption} aria-hidden="true">
              <span>PORTRAIT / 01</span><b>DARK</b>
            </figcaption>
          </figure>

          <Link className={styles.explore} href="#experience">
            <span>Explore</span><i aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.assetTray} aria-hidden="true">
          <span>Assets / 01</span>
          <div ref={assetRef} className={styles.assetCard}>
            <i /><div><b>Javier_portrait</b><span>JPG · selected</span></div>
          </div>
        </div>

        <div ref={titleSelectionRef} className={`${styles.selection} ${styles.titleSelection}`} aria-hidden="true">
          <i /><i /><i /><i /><span>H1 / DISPLAY</span>
        </div>
        <div ref={portraitSelectionRef} className={`${styles.selection} ${styles.portraitSelection}`} aria-hidden="true">
          <i /><i /><i /><i /><span>IMAGE / COVER</span>
        </div>
        <div className={styles.propertyStrip} aria-hidden="true">
          <span>Typography</span><b>Weight 520</b><b>Leading 84%</b><b>2 lines</b>
        </div>

        <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
          <i /><span>Javier</span>
        </div>
      </div>
    </section>
  );
}
