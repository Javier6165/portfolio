"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./SpotlightChrome.module.css";

export type SpotlightView = {
  id: string;
  action: string;
  rect: { top: number; left: number; width: number; height: number };
  panel: { top: number; left: number; width: number };
  durationMs: number;
  hint: boolean;
  mandatory: boolean;
  position: number;
  total: number;
  phase: "observing" | "entering" | "editing" | "commenting" | "settling";
  tool: string;
  properties: string[];
  comment?: string;
  commentFirst?: boolean;
};

export function SpotlightChrome({ active, showDock, guidedFirstVisit, onCancel, onReplay, onStop }: { active: SpotlightView | null; showDock: boolean; guidedFirstVisit: boolean; onCancel: () => void; onReplay: () => void; onStop: () => void }) {
  const [dockExpanded, setDockExpanded] = useState(true);
  const dockIntroducedRef = useRef(false);
  const showComment = Boolean(active?.comment) && (active?.phase === "commenting" || active?.phase === "settling");
  const commentResolved = active?.phase === "settling";
  const phaseAction = !active ? "" : active.phase === "commenting" && active.commentFirst
    ? "Reading Javier’s note"
    : active.phase === "observing"
      ? "Reviewing the unfinished version"
      : active.action;

  useEffect(() => {
    if (!showDock) return;
    if (dockIntroducedRef.current) {
      setDockExpanded(false);
      return;
    }
    dockIntroducedRef.current = true;
    setDockExpanded(true);
    const timer = window.setTimeout(() => setDockExpanded(false), 8_000);
    const collapseOnScroll = () => setDockExpanded(false);
    window.addEventListener("scroll", collapseOnScroll, { passive: true, once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", collapseOnScroll);
    };
  }, [showDock]);

  return (
    <>
      {showDock && !active ? (
        <div className={styles.dock} data-follow-dock data-guided={guidedFirstVisit ? "true" : "false"} data-expanded={dockExpanded ? "true" : "false"}>
          {guidedFirstVisit ? (
            <>
              <div className={styles.guidedMark}><i /> LIVE FILE</div>
              <p><strong>Guided live file</strong><span>Scroll on — Javier will finish each section</span></p>
            </>
          ) : (
            <>
              <button
                className={styles.dockToggle}
                type="button"
                aria-expanded={dockExpanded}
                aria-label={dockExpanded ? "Collapse Live File controls" : "Expand Live File controls"}
                onClick={() => setDockExpanded((expanded) => !expanded)}
              >
                <i /> <span>LIVE FILE</span>
              </button>
              <p><strong>Optional live edits</strong><span>Replay or continue with the finished file</span></p>
              <div className={styles.dockActions} aria-hidden={dockExpanded ? undefined : "true"}>
                <button type="button" onClick={onReplay}>Replay guided edits</button>
                <button type="button" onClick={onStop}>Show finished file</button>
              </div>
            </>
          )}
        </div>
      ) : null}
      {active ? (
        <div className={styles.overlay} data-spotlight-active>
          <div
            className={styles.focus}
            style={{
              top: active.rect.top,
              left: active.rect.left,
              width: active.rect.width,
              height: active.rect.height,
              "--spotlight-duration": `${active.durationMs}ms`,
            } as CSSProperties}
            aria-hidden="true"
          />
          <div className={styles.bar} aria-hidden="false">
            <span className={styles.avatar}>JO</span>
            <div>
              <small>LIVE FILE · EDIT {String(active.position).padStart(2, "0")} / {String(active.total).padStart(2, "0")}</small>
              <strong>Following Javier</strong>
            </div>
            <span className={styles.action}>{phaseAction}</span>
            <i className={styles.progress} style={{ "--spotlight-duration": `${active.durationMs}ms` } as CSSProperties} aria-hidden="true" />
            {active.mandatory ? <span className={styles.locked}>Guided edit</span> : <button type="button" onClick={onStop}>Skip this edit</button>}
          </div>
          {active.phase !== "observing" && active.phase !== "entering" ? (
            <div
              className={styles.contextPanel}
              data-spotlight-context
              data-context-kind={showComment ? "comment" : "properties"}
              style={{ top: active.panel.top, left: active.panel.left, width: active.panel.width } as CSSProperties}
              aria-hidden="true"
            >
              {showComment ? (
                <div className={styles.viewportComment}>
                  <span className={styles.avatar}>JO</span>
                  <div><small>Javier · {commentResolved ? "resolved" : "now"}</small><strong>{active.comment}</strong></div>
                  <b>{commentResolved ? "✓" : ""}</b>
                </div>
              ) : (
                <div className={styles.viewportProperties}>
                  <div><small>JO / EDITING</small><strong>{active.tool}</strong></div>
                  <ul>{active.properties.slice(0, 3).map((property) => <li key={property}>{property}</li>)}</ul>
                </div>
              )}
            </div>
          ) : null}
          {active.hint ? active.mandatory
            ? <div className={styles.hint}>Scroll resumes when this edit is complete</div>
            : <button className={styles.hint} type="button" onClick={onCancel}>Skip this edit and continue</button>
          : null}
        </div>
      ) : null}
    </>
  );
}
