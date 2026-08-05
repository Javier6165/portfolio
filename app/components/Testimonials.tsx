"use client";

import { useState, type KeyboardEvent } from "react";
import { testimonialSlots } from "../data";
import { LiveScene } from "./live-file/LiveScene";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const current = testimonialSlots[active] ?? testimonialSlots[0];

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? testimonialSlots.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + testimonialSlots.length) % testimonialSlots.length;
    setActive(nextIndex);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex]?.focus();
  }

  return (
    <section className={`section shell ${styles.section}`} id="testimonials" aria-labelledby="testimonials-title">
      <header className={styles.heading}>
        <p className="kicker">06 / References — preview</p>
        <h2 id="testimonials-title">What collaborators say—once verified.</h2>
        <p>This is the final layout, not a fabricated testimonial. Real words appear only with a named source, context and permission.</p>
      </header>

      <LiveScene
        id="testimonials-verify"
        verb="verify"
        label="References / Source pending"
        targetSelector="[data-reference-status]"
        tool="contrast"
        action="Raising the status copy"
        properties={["Opacity · 62 → 82", "Status · Source required", "Contrast · AA"]}
        readMs={1000}
        spotlightMs={3600}
        comment="Pending should not mean playing hide-and-seek."
        commentFirst
        draftLabel="Draft · status copy too quiet"
        className={styles.liveScene}
        directorBeatIds={["references-side-typo"]}
      >
        <div className={styles.stage}>
          <div className={styles.ledger}>
            <div className={styles.index} role="tablist" aria-label="Reference perspectives">
              <div className={styles.indexMeta}><span>REFERENCE LEDGER</span><b>03 records</b></div>
              {testimonialSlots.map((slot, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`reference-tab-${index}`}
                  aria-controls="reference-panel"
                  aria-selected={active === index}
                  tabIndex={active === index ? 0 : -1}
                  key={slot.index}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => moveTab(event, index)}
                >
                  <span>{slot.index}</span>
                  <div><strong>{slot.perspective}</strong><small data-reference-status>{slot.status === "verified" ? "Verified reference" : "Source required"}</small></div>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>

            <div className={styles.panel} id="reference-panel" role="tabpanel" aria-labelledby={`reference-tab-${active}`}>
              <div className={styles.panelMeta}><span>REFERENCE / {current.index}</span><b>{current.status === "verified" ? "VERIFIED" : "PENDING"}</b></div>
              {current.status === "verified" ? (
                <>
                  <blockquote>{current.quote}</blockquote>
                  <p className={styles.attribution}><strong>{current.name}</strong><span>{current.role}</span></p>
                </>
              ) : (
                <div className={styles.pending}>
                  <span>Layout preview · source required</span>
                  <h3>{current.perspective}</h3>
                  <p>{current.prompt}</p>
                  <p className={styles.quoteMeasure}>A verified recommendation will sit here in the speaker’s own words, at roughly this readable length.</p>
                  <dl><div><dt>Quote</dt><dd>Approved wording</dd></div><div><dt>Context</dt><dd>Name + professional role</dd></div><div><dt>Permission</dt><dd>Approved for publication</dd></div></dl>
                </div>
              )}
              <p className={styles.integrity}><i aria-hidden="true" /> No testimonial is published without a source.</p>
            </div>
          </div>
        </div>
      </LiveScene>
    </section>
  );
}
