import { contextualCommentary, type ContextualCueId } from "./director-copy/context";
import { genericCommentary } from "./director-copy/generic";
import { sectionCommentary } from "./director-copy/sections";
import type {
  DirectorLine,
  DirectorSelectionContext,
  DirectorTrigger,
  DirectorVoiceHistory,
} from "./director-copy/types";

export {
  contextualCommentary,
  genericCommentary,
  sectionCommentary,
};
export type { ContextualCueId } from "./director-copy/context";
export type {
  DirectorFamily,
  DirectorIntent,
  DirectorLine,
  DirectorPace,
  DirectorRegister,
  DirectorSection,
  DirectorSelectionContext,
  DirectorSessionStage,
  DirectorTrigger,
  DirectorVoiceHistory,
} from "./director-copy/types";

export const DIRECTOR_COPY_MEMORY_PREFIX = "director-copy:";

export function directorCopyMemoryId(id: string) {
  return `${DIRECTOR_COPY_MEMORY_PREFIX}${id}`;
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function matches<T>(allowed: readonly T[] | undefined, actual: T) {
  return !allowed || allowed.length === 0 || allowed.includes(actual);
}

function lineIsEligible(line: DirectorLine, context: DirectorSelectionContext) {
  if (!matches(line.sections, context.section)) return false;
  if (context.trigger && !matches(line.triggers, context.trigger)) return false;
  if (!context.trigger && line.triggers?.length) return false;
  if (!matches(line.visitTiers, context.visitTier)) return false;
  if (!matches(line.sessionStages, context.sessionStage)) return false;
  if (line.rarity === "rare" && !context.allowRare) return false;
  if (line.humor === 2 && context.history.humor.slice(-2).some((level) => level > 0)) return false;
  return true;
}

function scoreLine(line: DirectorLine, context: DirectorSelectionContext) {
  const recentIds = context.history.ids.slice(-4);
  const recentFamilies = context.history.families.slice(-3);
  const recentRegisters = context.history.registers.slice(-2);
  const memoryId = directorCopyMemoryId(line.id);
  let score = 100 + (line.weight ?? 0);

  if (line.sections?.includes(context.section)) score += 18;
  else score += 4; // Generic copy is useful, but exact compatibility wins.
  if (context.trigger && line.triggers?.includes(context.trigger)) score += 24;
  if (line.family === "action") score += 16;
  if (line.intent === "evidence" || line.intent === "reassure") score += 7;
  if (line.rarity === "occasional") score -= 8;
  if (line.rarity === "rare") score -= 18;
  if (context.pace === "fast" && line.opening.length > 72) score -= 18;
  if (context.pace === "patient" && line.intent === "craft") score += 6;
  if (recentIds.includes(line.id)) score -= 200;
  if (recentFamilies.includes(line.family)) score -= 10;
  if (recentRegisters.includes(line.register)) score -= 7;
  if (context.hasSeen(memoryId)) score -= 46;
  return score;
}

export function getEligibleDirectorLines(lines: readonly DirectorLine[], context: DirectorSelectionContext) {
  return lines
    .filter((line) => lineIsEligible(line, context))
    .map((line) => ({ line, score: scoreLine(line, context) }))
    .sort((a, b) => b.score - a.score || a.line.id.localeCompare(b.line.id));
}

export function pickDirectorLine(lines: readonly DirectorLine[], context: DirectorSelectionContext) {
  const ranked = getEligibleDirectorLines(lines, context);
  if (ranked.length === 0) return null;

  // Keep selection inside the strong band. A seeded choice adds variety while
  // never allowing a weak or tonally incompatible line to win by pure chance.
  const bestScore = ranked[0].score;
  const strongBand = ranked.filter(({ score }) => score >= bestScore - 16).slice(0, 6);
  return strongBand[hash(`${context.seed}:${strongBand.map(({ line }) => line.id).join(":")}`) % strongBand.length].line;
}

export function contextualLines(trigger: ContextualCueId | "ambient") {
  return trigger === "ambient" ? genericCommentary : contextualCommentary[trigger];
}

export function rememberDirectorLine(history: DirectorVoiceHistory, line: DirectorLine): DirectorVoiceHistory {
  return {
    ids: [...history.ids, line.id].slice(-8),
    families: [...history.families, line.family].slice(-6),
    registers: [...history.registers, line.register].slice(-6),
    humor: [...history.humor, line.humor].slice(-6),
  };
}

export function isContextualTrigger(value: string): value is DirectorTrigger {
  return value === "ambient" || value in contextualCommentary;
}
