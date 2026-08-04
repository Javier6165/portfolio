export type DirectorSection =
  | "hero"
  | "snapshot"
  | "video"
  | "work"
  | "practice"
  | "ai"
  | "about"
  | "references"
  | "playground"
  | "contact";

export type DirectorTrigger =
  | "memory-granted"
  | "memory-denied"
  | "visit-one"
  | "visit-two"
  | "visit-three"
  | "visit-four"
  | "visit-five"
  | "session-settled"
  | "session-deep"
  | "session-long"
  | "fast-scroll"
  | "patient-reader"
  | "returned-top"
  | "reached-end"
  | "section-revisit"
  | "direction-change"
  | "tab-return"
  | "follow-stop"
  | "ambient"
  | "rare-review";

export type DirectorSessionStage = "opening" | "quick-scan" | "settled" | "deep-review" | "long-session";
export type DirectorPace = "fast" | "mixed" | "patient";
export type DirectorRegister = "professional" | "dry" | "playful" | "warm";
export type DirectorIntent = "craft" | "evidence" | "acknowledge" | "reassure" | "observe" | "self-edit" | "handoff" | "rare";
export type DirectorFamily = "section" | "behavior" | "action" | "ambient" | "rare";

export type DirectorLine = {
  /** Stable editorial id. Copy can change without changing memory semantics. */
  id: string;
  family: DirectorFamily;
  intent: DirectorIntent;
  register: DirectorRegister;
  humor: 0 | 1 | 2;
  opening: string;
  resolution?: string;
  sections?: readonly DirectorSection[];
  triggers?: readonly DirectorTrigger[];
  visitTiers?: readonly (1 | 2 | 3 | 4 | 5)[];
  sessionStages?: readonly DirectorSessionStage[];
  rarity?: "common" | "occasional" | "rare";
  weight?: number;
};

export type DirectorVoiceHistory = {
  ids: readonly string[];
  families: readonly DirectorFamily[];
  registers: readonly DirectorRegister[];
  humor: readonly (0 | 1 | 2)[];
};

export type DirectorSelectionContext = {
  section: DirectorSection;
  trigger?: DirectorTrigger;
  visitTier: 1 | 2 | 3 | 4 | 5;
  sessionStage: DirectorSessionStage;
  pace: DirectorPace;
  allowRare: boolean;
  seed: string;
  history: DirectorVoiceHistory;
  hasSeen: (id: string) => boolean;
};

export const EMPTY_VOICE_HISTORY: DirectorVoiceHistory = {
  ids: [],
  families: [],
  registers: [],
  humor: [],
};

export function defineDirectorLines<const T extends readonly DirectorLine[]>(lines: T) {
  return lines;
}
