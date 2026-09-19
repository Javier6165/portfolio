"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowIcon } from "./SiteShell";
import styles from "./Hero.module.css";

export function Hero() {
  const videoDialog = useRef<HTMLDialogElement>(null);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <figure className={styles.portrait} role="img" aria-label="Portrait of Javier Ortiz.">
        <picture>
          <source type="image/avif" srcSet="/images/portraits/hero-system-960.avif 960w, /images/portraits/hero-system-1440.avif 1440w" sizes="(max-width: 720px) 100vw, 58vw" />
          <source type="image/webp" srcSet="/images/portraits/hero-system-960.webp 960w, /images/portraits/hero-system-1440.webp 1440w" sizes="(max-width: 720px) 100vw, 58vw" />
          <img className="portrait" src="/images/portraits/hero-system.jpg" alt="" aria-hidden="true" width="1800" height="1799" loading="eager" fetchPriority="high" />
        </picture>
      </figure>
      <div className={styles.identity}>
        <p className={styles.name}>Javier Ortiz</p>
        <p className={styles.role}>Senior Product Designer</p>
        <h1 id="hero-title">I design the calm inside complex products.</h1>
        <p className={styles.summary}>Hands-on product designer with Lead experience, focused on complex B2B products, design systems and AI-assisted prototyping.</p>
        <div className={styles.actions}>
          <Link className="button button--primary" href="#work">View selected work <ArrowIcon /></Link>
          <button className="button button--quiet" type="button" onClick={() => videoDialog.current?.showModal()}>Meet me in 60 seconds <ArrowIcon /></button>
        </div>
      </div>
      <dialog ref={videoDialog} className={styles.dialog} aria-labelledby="video-title" onClick={(event) => { if (event.target === videoDialog.current) videoDialog.current?.close(); }}>
        <div className={styles.dialogBody}>
          <button className={styles.close} type="button" aria-label="Close video preview" onClick={() => videoDialog.current?.close()}>×</button>
          <div className={styles.videoPoster} role="img" aria-label="Preview image for Javier's planned 60-second video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/portraits/video-intro-placeholder.jpg" alt="" width="1439" height="1800" loading="lazy" />
          </div>
          <div className={styles.videoCopy}>
            <p className="kicker">60-second introduction</p>
            <h2 id="video-title">Meet me in 60 seconds.</h2>
            <p>The video is in production. This preview is here to show the intended shortcut; there is no playable video yet.</p>
            <Link className="text-link" href="#work" onClick={() => videoDialog.current?.close()}>Explore the work instead <ArrowIcon /></Link>
          </div>
        </div>
      </dialog>
    </section>
  );
}
