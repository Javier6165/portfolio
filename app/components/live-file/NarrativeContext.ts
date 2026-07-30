"use client";

import { createContext, useContext } from "react";

export type NarrativeConsent = "unknown" | "granted" | "denied";
export type VisitTier = 1 | 2 | 3 | 4 | 5;

export type NarrativeContextValue = {
  autoFollow: boolean;
  consent: NarrativeConsent;
  guidedFirstVisit: boolean;
  introComplete: boolean;
  liveReplayToken: number;
  memoryDecision: Exclude<NarrativeConsent, "unknown"> | null;
  reducedMotion: boolean;
  replayToken: number;
  showConsent: boolean;
  visitTier: VisitTier;
  acceptMemory: () => void;
  completeIntro: () => void;
  declineMemory: () => void;
  forgetExperience: () => void;
  replayIntro: () => void;
  replayLiveEdits: () => void;
  hasSeenCue: (cueId: string) => boolean;
  markCueSeen: (cueId: string) => void;
  setAutoFollow: (enabled: boolean) => void;
  setManualReducedMotion: (reduced: boolean) => void;
};

export const NarrativeContext = createContext<NarrativeContextValue | null>(null);

export function useNarrative() {
  const context = useContext(NarrativeContext);
  if (!context) throw new Error("useNarrative must be used inside NarrativeProvider");
  return context;
}
