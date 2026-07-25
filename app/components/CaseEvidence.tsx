"use client";

// Evidence images are already-exported case assets. Native elements keep the
// renderer portable and avoid coupling future Figma exports to an image CDN.
/* eslint-disable @next/next/no-img-element */
import { useState, type KeyboardEvent } from "react";
import type { CaseBlock } from "../data";
import styles from "./CaseEvidence.module.css";

const modes = [
  { id: "core", label: "Core", value: "Shared foundation" },
  { id: "focus", label: "Focus", value: "Dense operations" },
  { id: "expressive", label: "Expressive", value: "Player-facing" },
] as const;

type ModeId = (typeof modes)[number]["id"];

function EvidenceHeader({ block, headingId }: { block: CaseBlock; headingId: string }) {
  return (
    <header className={styles.copy}>
      <p className="kicker">{block.eyebrow}</p>
      <h2 id={headingId}>{block.title}</h2>
      <p>{block.description}</p>
    </header>
  );
}

export function CaseEvidence({ block }: { block: CaseBlock }) {
  const [mode, setMode] = useState<ModeId>("core");
  const [comparison, setComparison] = useState<"before" | "after">("after");
  const [loadedEmbedId, setLoadedEmbedId] = useState<string | null>(null);
  const headingId = `case-evidence-${block.id}`;

  function moveModeTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? modes.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length;
    setMode(modes[next].id);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']")?.[next]?.focus();
  }

  function moveComparisonTab(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "ArrowLeft" || event.key === "Home" ? "before" : "after";
    setComparison(next);
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-comparison='${next}']`)?.focus();
  }

  if (block.type === "token-propagation") {
    return (
      <section className={`${styles.section} shell`} aria-labelledby={headingId}>
        <EvidenceHeader block={block} headingId={headingId} />

        <div className={styles.demo} data-mode={mode}>
          <div className={styles.demoBar}>
            <span>Northstar / Token propagation</span>
            <b>Concept preview</b>
          </div>
          <div className={styles.controls} role="tablist" aria-label="Preview product expression mode">
            {modes.map((item, index) => (
              <button
                key={item.id}
                id={`evidence-tab-${block.id}-${item.id}`}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                aria-controls={`evidence-panel-${block.id}`}
                tabIndex={mode === item.id ? 0 : -1}
                onClick={() => setMode(item.id)}
                onKeyDown={(event) => moveModeTab(event, index)}
              >
                <span>{item.label}</span><small>{item.value}</small>
              </button>
            ))}
          </div>
          <div
            id={`evidence-panel-${block.id}`}
            role="tabpanel"
            aria-labelledby={`evidence-tab-${block.id}-${mode}`}
            className={styles.canvas}
          >
            <div className={styles.tokenRail} aria-hidden="true">
              <span>GLOBAL TOKENS</span>
              <div><i />Accent <b>↗</b></div>
              <div><i />Radius <b>↗</b></div>
              <div><i />Density <b>↗</b></div>
            </div>
            <div className={styles.surfaces} aria-label={`${mode} token mode applied to three sample product surfaces`}>
              <article><span>OPERATIONS</span><strong>Rule review</strong><i /><i /><button type="button">Review</button></article>
              <article><span>KNOWLEDGE</span><strong>Pattern library</strong><div><i /><i /><i /></div><button type="button">Open</button></article>
              <article><span>PLAYER</span><strong>Reward state</strong><b>+24</b><button type="button">Continue</button></article>
            </div>
            <div className={styles.propagation} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.comment} aria-hidden="true"><b>JO</b><span>One token. Three contexts. No forced uniformity.</span></div>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "text") {
    return (
      <section className={`${styles.section} shell`} aria-labelledby={headingId}>
        <EvidenceHeader block={block} headingId={headingId} />
        <div className={styles.textBlock}><p>{block.body}</p></div>
      </section>
    );
  }

  if (block.type === "image") {
    return (
      <section className={`${styles.section} shell`} aria-labelledby={headingId}>
        <EvidenceHeader block={block} headingId={headingId} />
        <figure className={styles.mediaCard} style={{ aspectRatio: block.image.aspectRatio }}>
          <img src={block.image.src} alt={block.image.alt} loading="lazy" />
          <figcaption>{block.image.caption}</figcaption>
        </figure>
      </section>
    );
  }

  if (block.type === "gallery") {
    return (
      <section className={`${styles.section} shell`} aria-labelledby={headingId}>
        <EvidenceHeader block={block} headingId={headingId} />
        <div className={styles.gallery}>
          {block.images.map((image) => (
            <figure className={styles.mediaCard} style={{ aspectRatio: image.aspectRatio }} key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "before-after") {
    const current = block[comparison];
    return (
      <section className={`${styles.section} shell`} aria-labelledby={headingId}>
        <EvidenceHeader block={block} headingId={headingId} />
        <div className={styles.comparison}>
          <div className={styles.comparisonTabs} role="tablist" aria-label="Before and after comparison">
            {(["before", "after"] as const).map((item) => (
              <button
                type="button"
                role="tab"
                id={`comparison-${block.id}-${item}`}
                aria-controls={`comparison-panel-${block.id}`}
                aria-selected={comparison === item}
                tabIndex={comparison === item ? 0 : -1}
                data-comparison={item}
                onClick={() => setComparison(item)}
                onKeyDown={moveComparisonTab}
                key={item}
              >{item}</button>
            ))}
          </div>
          <figure
            id={`comparison-panel-${block.id}`}
            role="tabpanel"
            aria-labelledby={`comparison-${block.id}-${comparison}`}
            className={styles.mediaCard}
            style={{ aspectRatio: current.aspectRatio }}
          >
            <img src={current.src} alt={current.alt} loading="lazy" />
            <figcaption>{current.caption}</figcaption>
          </figure>
        </div>
      </section>
    );
  }

  if (block.type === "video") {
    return (
      <section className={`${styles.section} shell`} aria-labelledby={headingId}>
        <EvidenceHeader block={block} headingId={headingId} />
        <figure className={styles.mediaCard} style={{ aspectRatio: block.aspectRatio }}>
          <video controls preload="none" poster={block.poster} aria-label={block.caption}>
            <source src={block.src} />
          </video>
          <figcaption>{block.caption}</figcaption>
        </figure>
      </section>
    );
  }

  const isLoaded = loadedEmbedId === block.id;
  const embedUrl = block.type === "figma" ? block.embedUrl : block.url;
  const embedLabel = block.type === "figma" ? "Load Figma prototype" : "Load working prototype";
  return (
    <section className={`${styles.section} shell`} aria-labelledby={headingId}>
      <EvidenceHeader block={block} headingId={headingId} />
      <figure className={`${styles.mediaCard} ${styles.embed}`} style={{ aspectRatio: block.fallback.aspectRatio }}>
        {isLoaded ? (
          <iframe
            src={embedUrl}
            title={block.title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="fullscreen"
          />
        ) : (
          <>
            <img src={block.fallback.src} alt={block.fallback.alt} loading="lazy" />
            <button type="button" onClick={() => setLoadedEmbedId(block.id)}>{embedLabel}</button>
          </>
        )}
        <figcaption>{block.fallback.caption}</figcaption>
      </figure>
    </section>
  );
}
