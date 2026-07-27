"use client";

import type { CSSProperties } from "react";
import styles from "./SpotlightChrome.module.css";

export type SpotlightView = {
  id: string;
  action: string;
  rect: { top: number; left: number; width: number; height: number };
  durationMs: number;
  hint: boolean;
};

export function SpotlightChrome({ active, showDock, onCancel, onReplay, onStop }: { active: SpotlightView | null; showDock: boolean; onCancel: () => void; onReplay: () => void; onStop: () => void }) {
  return (
    <>
      {showDock && !active ? (
        <div className={styles.dock} data-follow-dock>
          <span><i /> LIVE FILE</span>
          <p>Javier is still editing</p>
          <div className={styles.dockActions}>
            <button type="button" onClick={onReplay}>Replay edits</button>
            <button type="button" onClick={onStop}>Pause</button>
          </div>
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
            <div><small>Following Javier</small><strong>{active.action}</strong></div>
            <i className={styles.progress} style={{ "--spotlight-duration": `${active.durationMs}ms` } as CSSProperties} aria-hidden="true" />
            <button type="button" onClick={onStop}>Stop following</button>
          </div>
          {active.hint ? <button className={styles.hint} type="button" onClick={onCancel}>Scroll again to stop following</button> : null}
        </div>
      ) : null}
    </>
  );
}
