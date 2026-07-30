"use client";

import { createContext, useContext } from "react";
import type { LiveSceneConfig } from "./LiveSceneDirector";

type DirectorContextValue = {
  introComplete: boolean;
  mandatoryFirstVisit: boolean;
  reducedMotion: boolean;
  replayToken: number;
  registerScene: (root: HTMLElement, config: LiveSceneConfig) => () => void;
  settleScene: (root: HTMLElement, userInitiated?: boolean) => void;
};

// The context lives outside the hot-reloaded Director component so provider
// and consumers keep the same identity while UI code changes. The passive
// value is the final safety net: optional editing can disappear, but the
// portfolio itself must always render and remain interactive.
const passiveDirector: DirectorContextValue = {
  introComplete: true,
  mandatoryFirstVisit: false,
  reducedMotion: false,
  replayToken: 0,
  registerScene: (root) => {
    root.dataset.liveState = "settled";
    return () => undefined;
  },
  settleScene: (root) => { root.dataset.liveState = "settled"; },
};

export const DirectorContext = createContext<DirectorContextValue>(passiveDirector);

export function useLiveSceneDirector() {
  return useContext(DirectorContext);
}
