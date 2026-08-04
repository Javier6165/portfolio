"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { commentKeyDelay } from "./commentTyping";
import styles from "./SpotlightChrome.module.css";

export type SpotlightView = {
  id: string;
  action: string;
  rect: { top: number; left: number; width: number; height: number };
  panel: { top: number; left: number; width: number };
  commentPanel: { top: number; left: number; width: number };
  commentSide: "right-down" | "left-down" | "right-up" | "left-up";
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

function TypedSpotlightComment({ copy }: { copy: string }) {
  const [visibleCopy, setVisibleCopy] = useState("");

  useEffect(() => {
    let index = 0;
    let timer: number | null = null;
    const typeNext = () => {
      index += 1;
      setVisibleCopy(copy.slice(0, index));
      if (index < copy.length) timer = window.setTimeout(typeNext, commentKeyDelay(copy, index));
    };
    timer = window.setTimeout(typeNext, 140);
    return () => { if (timer !== null) window.clearTimeout(timer); };
  }, [copy]);

  return <strong data-comment-typing={visibleCopy !== copy ? "true" : "false"}>{visibleCopy}</strong>;
}

export function SpotlightChrome({ active, showDock, guidedFirstVisit, followingJavier, presenceStatus, onCancel, onFollow, onReplay, onStop }: { active: SpotlightView | null; showDock: boolean; guidedFirstVisit: boolean; followingJavier: boolean; presenceStatus: "connected" | "editing" | "elsewhere" | "done"; onCancel: () => void; onFollow: () => void; onReplay: () => void; onStop: () => void }) {
  const dockExpanded = false;
  const showComment = Boolean(active?.comment) && (active?.phase === "commenting" || active?.phase === "settling");
  const commentResolved = active?.phase === "settling";
  const phaseAction = !active ? "" : active.phase === "commenting" && active.commentFirst
    ? "Reading Javier’s note"
    : active.phase === "observing"
      ? "Reviewing the unfinished version"
      : active.action;

  return (
    <>
      {showDock && !active ? (
        <div className={styles.dock} data-follow-dock data-guided={guidedFirstVisit ? "true" : "false"} data-presence-status={presenceStatus} data-expanded={dockExpanded ? "true" : "false"}>
          {guidedFirstVisit ? (
            <>
              <div className={styles.guidedMark}><span className={styles.avatarPortrait} /><i /> JAVIER {presenceStatus === "editing" ? "EDITING" : presenceStatus === "elsewhere" ? "ELSEWHERE" : "CONNECTED"}</div>
              <p><strong>One guided edit</strong><span>Then explore or follow Javier</span></p>
            </>
          ) : (
            <>
              <button
                className={styles.dockToggle}
                type="button"
                aria-label={followingJavier ? "Stop following Javier" : "Follow Javier"}
                onClick={followingJavier ? onStop : onFollow}
              >
                <span className={styles.avatarPortrait} /><i /> <span>{followingJavier ? "STOP FOLLOWING" : "FOLLOW JAVIER"}</span>
              </button>
              <p><strong>{presenceStatus === "editing" ? "Making a small adjustment" : presenceStatus === "elsewhere" ? "Editing elsewhere in the file" : presenceStatus === "done" ? "File tidy. For now." : "Javier is still in the file"}</strong><span>Optional live edits · your scroll stays yours</span></p>
              <div className={styles.dockActions} aria-hidden={dockExpanded ? undefined : "true"}>
                <button type="button" onClick={followingJavier ? onStop : onFollow}>{followingJavier ? "Stop following" : "Follow Javier"}</button>
                <button type="button" onClick={onReplay}>Follow from the top</button>
              </div>
            </>
          )}
        </div>
      ) : null}
      {followingJavier ? <div className={styles.followFrame} data-follow-frame aria-hidden="true" /> : null}
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
            {active.mandatory ? <span className={styles.locked}>Guided edit</span> : <button type="button" onClick={onStop}>Stop following</button>}
          </div>
          {active.phase !== "observing" && active.phase !== "entering" ? (
            <div
              className={styles.contextPanel}
              data-spotlight-context
              data-context-kind={showComment ? "comment" : "properties"}
              data-chat-side={showComment ? active.commentSide : undefined}
              data-follow-cursor-chat={showComment ? "true" : undefined}
              style={showComment ? active.commentPanel as CSSProperties : active.panel as CSSProperties}
              aria-hidden="true"
            >
              {showComment ? (
                <div className={styles.viewportComment}>
                  <span className={styles.avatar}>JO</span>
                  <div><small>Javier · {commentResolved ? "resolved" : "now"}</small>{commentResolved ? <strong data-comment-typing="false">{active.comment}</strong> : <TypedSpotlightComment key={`${active.id}:${active.phase}`} copy={active.comment ?? ""} />}</div>
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
