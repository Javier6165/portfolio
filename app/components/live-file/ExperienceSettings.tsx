"use client";

import { useEffect, useState } from "react";
import { useNarrative } from "./NarrativeProvider";
import styles from "./ExperienceSettings.module.css";

export function MemoryConsent() {
  const { acceptMemory, declineMemory, showConsent } = useNarrative();
  const [spotlightActive, setSpotlightActive] = useState(false);

  useEffect(() => {
    const show = () => setSpotlightActive(true);
    const hide = () => setSpotlightActive(false);
    window.addEventListener("portfolio-spotlight-start", show);
    window.addEventListener("portfolio-spotlight-end", hide);
    return () => {
      window.removeEventListener("portfolio-spotlight-start", show);
      window.removeEventListener("portfolio-spotlight-end", hide);
    };
  }, []);

  if (!showConsent || spotlightActive) return null;

  return (
    <aside className={styles.consent} aria-label="Portfolio memory preference">
      <div>
        <p>Remember this visit on this device?</p>
        <span>Only the visit count and moments already shown are stored locally.</span>
      </div>
      <div className={styles.consentActions}>
        <button type="button" onClick={acceptMemory}>Allow</button>
        <button type="button" onClick={declineMemory}>No thanks</button>
      </div>
    </aside>
  );
}

export function ExperienceSettings() {
  const {
    consent,
    autoFollow,
    forgetExperience,
    reducedMotion,
    replayIntro,
    replayLiveEdits,
    setManualReducedMotion,
  } = useNarrative();

  return (
    <details className={styles.settings}>
      <summary>Experience settings</summary>
      <div className={styles.panel}>
        <div>
          <span>Local memory</span>
          <strong>{consent === "granted" ? "Allowed" : consent === "denied" ? "Off" : "Not decided"}</strong>
        </div>
        <div>
          <span>Motion</span>
          <strong>{reducedMotion ? "Reduced" : "Full"}</strong>
        </div>
        <div>
          <span>Automatic edits</span>
          <strong>{autoFollow ? "On" : "Off"}</strong>
        </div>
        <button type="button" onClick={replayIntro}>Replay file opening</button>
        <button type="button" onClick={replayLiveEdits}>Replay guided edits</button>
        <button type="button" onClick={() => setManualReducedMotion(!reducedMotion)}>
          {reducedMotion ? "Use device motion setting" : "Reduce motion"}
        </button>
        <button type="button" onClick={forgetExperience}>Forget this device</button>
      </div>
    </details>
  );
}
