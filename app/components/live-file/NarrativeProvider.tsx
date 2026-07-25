"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NarrativeConsent = "unknown" | "granted" | "denied";

export type NarrativeMemory = {
  schema: 1;
  visitCount: number;
  seenCueIds: string[];
  lastVisitAt: string;
  expiresAt: string;
};

type NarrativeContextValue = {
  activeCueId: string | null;
  consent: NarrativeConsent;
  introComplete: boolean;
  reducedMotion: boolean;
  replayToken: number;
  showConsent: boolean;
  visitTier: 1 | 2 | 3;
  acceptMemory: () => void;
  completeIntro: () => void;
  declineMemory: () => void;
  forgetExperience: () => void;
  replayIntro: () => void;
  requestCue: (cueId: string) => boolean;
  setManualReducedMotion: (reduced: boolean) => void;
};

const CONSENT_KEY = "javier-narrative-consent";
const MEMORY_KEY = "javier-narrative-memory-v1";
const SESSION_COMPLETE_KEY = "javier-narrative-session-v1";
const SESSION_COUNTED_KEY = "javier-narrative-counted-v1";
const MOTION_KEY = "javier-motion";
const MEMORY_LIFETIME = 90 * 24 * 60 * 60 * 1000;
const MAX_CUES_PER_VISIT = 3;
const CUE_COOLDOWN = 10_000;

const NarrativeContext = createContext<NarrativeContextValue | null>(null);

function readMemory(): NarrativeMemory | null {
  try {
    const raw = window.localStorage.getItem(MEMORY_KEY);
    if (!raw) return null;
    const memory = JSON.parse(raw) as NarrativeMemory;
    if (memory.schema !== 1 || Date.parse(memory.expiresAt) <= Date.now()) {
      window.localStorage.removeItem(MEMORY_KEY);
      return null;
    }
    return memory;
  } catch {
    return null;
  }
}

function writeMemory(memory: NarrativeMemory) {
  try {
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {
    // Browser storage is optional. The session-only experience remains intact.
  }
}

function createMemory(visitCount = 1): NarrativeMemory {
  const now = new Date();
  return {
    schema: 1,
    visitCount,
    seenCueIds: [],
    lastVisitAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + MEMORY_LIFETIME).toISOString(),
  };
}

export function NarrativeProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<NarrativeConsent>("unknown");
  const [introComplete, setIntroComplete] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [visitTier, setVisitTier] = useState<1 | 2 | 3>(1);
  const [activeCueId, setActiveCueId] = useState<string | null>(null);
  const [replayToken, setReplayToken] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const consentRef = useRef<NarrativeConsent>(consent);
  const seenCueIds = useRef(new Set<string>());
  const cueCount = useRef(0);
  const lastCueAt = useRef(0);
  const lastScrollAt = useRef(0);
  const cueTimer = useRef<number | null>(null);

  useEffect(() => {
    const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      const manualReduced = window.localStorage.getItem(MOTION_KEY) === "reduce";
      const next = systemReduced.matches || manualReduced;
      setReducedMotion(next);
      document.documentElement.dataset.motion = next ? "reduce" : "full";
    };

    syncMotion();
    systemReduced.addEventListener("change", syncMotion);

    // Storage-derived state is hydrated after the first paint so server and
    // client markup stay identical even when a returning visitor has memory.
    const hydrationFrame = window.requestAnimationFrame(() => {
      try {
        const savedConsent = window.localStorage.getItem(CONSENT_KEY);
        const nextConsent: NarrativeConsent = savedConsent === "granted"
          ? "granted"
          : savedConsent === "denied"
            ? "denied"
            : "unknown";
        consentRef.current = nextConsent;
        setConsent(nextConsent);

        if (nextConsent === "granted") {
          const memory = readMemory();
          if (memory) {
            const alreadyCounted = window.sessionStorage.getItem(SESSION_COUNTED_KEY) === "true";
            const nextCount = alreadyCounted ? memory.visitCount : memory.visitCount + 1;
            const updated = {
              ...memory,
              visitCount: nextCount,
              lastVisitAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + MEMORY_LIFETIME).toISOString(),
            };
            writeMemory(updated);
            window.sessionStorage.setItem(SESSION_COUNTED_KEY, "true");
            setVisitTier(Math.min(3, nextCount) as 1 | 2 | 3);
            updated.seenCueIds.forEach((id) => seenCueIds.current.add(id));
          } else {
            consentRef.current = "unknown";
            setConsent("unknown");
            window.localStorage.removeItem(CONSENT_KEY);
          }
        }

        const sessionComplete = window.sessionStorage.getItem(SESSION_COMPLETE_KEY) === "complete";
        const bootMode = document.documentElement.dataset.narrative;
        if (sessionComplete || bootMode === "static") {
          setIntroComplete(true);
          if (nextConsent === "unknown" && sessionComplete) setShowConsent(true);
        }
      } catch {
        // Storage can be blocked. No content or navigation depends on it.
      }
    });

    return () => {
      window.cancelAnimationFrame(hydrationFrame);
      systemReduced.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => () => {
    if (cueTimer.current) window.clearTimeout(cueTimer.current);
  }, []);

  useEffect(() => {
    const cancelCueForReadingIntent = () => {
      lastScrollAt.current = Date.now();
      if (cueTimer.current) window.clearTimeout(cueTimer.current);
      cueTimer.current = null;
      setActiveCueId(null);
    };
    const cancelWhenHidden = () => {
      if (document.hidden) cancelCueForReadingIntent();
    };

    window.addEventListener("scroll", cancelCueForReadingIntent, { passive: true });
    document.addEventListener("visibilitychange", cancelWhenHidden);
    return () => {
      window.removeEventListener("scroll", cancelCueForReadingIntent);
      document.removeEventListener("visibilitychange", cancelWhenHidden);
    };
  }, []);

  const completeIntro = useCallback(() => {
    setIntroComplete(true);
    document.documentElement.dataset.narrative = "complete";
    try {
      window.sessionStorage.setItem(SESSION_COMPLETE_KEY, "complete");
    } catch {
      // The final hero is still the default state without session storage.
    }
    if (consentRef.current === "unknown") setShowConsent(true);
  }, []);

  const acceptMemory = useCallback(() => {
    const memory = readMemory() ?? createMemory(1);
    writeMemory(memory);
    try {
      window.localStorage.setItem(CONSENT_KEY, "granted");
      window.sessionStorage.setItem(SESSION_COUNTED_KEY, "true");
    } catch {
      // Consent can still close the prompt even when persistence is unavailable.
    }
    setConsent("granted");
    consentRef.current = "granted";
    setVisitTier(Math.min(3, memory.visitCount) as 1 | 2 | 3);
    setShowConsent(false);
  }, []);

  const declineMemory = useCallback(() => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "denied");
      window.localStorage.removeItem(MEMORY_KEY);
    } catch {
      // A decline never prevents the portfolio from working.
    }
    setConsent("denied");
    consentRef.current = "denied";
    setShowConsent(false);
  }, []);

  const forgetExperience = useCallback(() => {
    try {
      window.localStorage.removeItem(CONSENT_KEY);
      window.localStorage.removeItem(MEMORY_KEY);
      window.sessionStorage.removeItem(SESSION_COMPLETE_KEY);
      window.sessionStorage.removeItem(SESSION_COUNTED_KEY);
    } catch {
      // State below is enough to reset the current document.
    }
    seenCueIds.current.clear();
    cueCount.current = 0;
    setConsent("unknown");
    consentRef.current = "unknown";
    setVisitTier(1);
    setShowConsent(false);
    setIntroComplete(false);
    document.documentElement.dataset.narrative = "first";
    setReplayToken((token) => token + 1);
  }, []);

  const replayIntro = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_COMPLETE_KEY);
    } catch {
      // Replay remains available for the current page.
    }
    setShowConsent(false);
    setIntroComplete(false);
    document.documentElement.dataset.narrative = "first";
    setReplayToken((token) => token + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const setManualReducedMotion = useCallback((reduced: boolean) => {
    try {
      if (reduced) window.localStorage.setItem(MOTION_KEY, "reduce");
      else window.localStorage.removeItem(MOTION_KEY);
    } catch {
      // The setting still applies for this document.
    }
    const next = reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(next);
    document.documentElement.dataset.motion = next ? "reduce" : "full";
    window.dispatchEvent(new CustomEvent("portfolio-motion-change"));
    window.setTimeout(() => window.location.reload(), 0);
  }, []);

  const requestCue = useCallback((cueId: string) => {
    const now = Date.now();
    if (
      !introComplete
      || reducedMotion
      || activeCueId
      || seenCueIds.current.has(cueId)
      || cueCount.current >= MAX_CUES_PER_VISIT
      || now - lastScrollAt.current < 800
      || now - lastCueAt.current < CUE_COOLDOWN
    ) return false;

    seenCueIds.current.add(cueId);
    cueCount.current += 1;
    lastCueAt.current = now;
    setActiveCueId(cueId);

    if (consent === "granted") {
      const memory = readMemory();
      if (memory) writeMemory({ ...memory, seenCueIds: [...new Set([...memory.seenCueIds, cueId])] });
    }

    cueTimer.current = window.setTimeout(() => setActiveCueId(null), 4_400);
    return true;
  }, [activeCueId, consent, introComplete, reducedMotion]);

  const value = useMemo<NarrativeContextValue>(() => ({
    activeCueId,
    consent,
    introComplete,
    reducedMotion,
    replayToken,
    showConsent,
    visitTier,
    acceptMemory,
    completeIntro,
    declineMemory,
    forgetExperience,
    replayIntro,
    requestCue,
    setManualReducedMotion,
  }), [
    activeCueId,
    consent,
    introComplete,
    reducedMotion,
    replayToken,
    showConsent,
    visitTier,
    acceptMemory,
    completeIntro,
    declineMemory,
    forgetExperience,
    replayIntro,
    requestCue,
    setManualReducedMotion,
  ]);

  return <NarrativeContext.Provider value={value}>{children}</NarrativeContext.Provider>;
}

export function useNarrative() {
  const context = useContext(NarrativeContext);
  if (!context) throw new Error("useNarrative must be used inside NarrativeProvider");
  return context;
}
