import { defineDirectorLines } from "./types";

// These lines are deliberately content-agnostic. They survive copy changes
// and can be used at any compatible target without pretending to understand a
// claim that may change later.
export const genericCommentary = defineDirectorLines([
  { id: "ambient.quiet-decisions", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Checking the quiet decisions. They usually do the heavy lifting.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.small-pass", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "One small pass. The kind nobody budgets for.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.hierarchy-truth", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Nothing dramatic. Just making the hierarchy tell the truth.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.grid-knows", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "A tiny adjustment. The grid will know.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.present-suggestion", family: "ambient", intent: "self-edit", register: "playful", humor: 2, opening: "Still editing. Present mode is more of a suggestion.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.checking-rhythm", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Checking rhythm, not adding more noise.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.last-two-percent", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "The last two percent has excellent job security.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.system-detail", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "The system is broad. The decision is still in the detail.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.nobody-asked", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "Nobody asked for this adjustment. That has never stopped a designer.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.visual-debt", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Clearing a little visual debt while the file is open.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.one-more-look", family: "ambient", intent: "self-edit", register: "warm", humor: 0, opening: "One more look. The useful kind, hopefully.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.polish-contract", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Polish only helps when the underlying decision already holds.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.cursor-agenda", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "The cursor has its own agenda now.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.no-big-redesign", family: "ambient", intent: "craft", register: "warm", humor: 0, opening: "No grand redesign. Just one decision becoming clearer.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.file-not-finished", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "A working file is never finished. It is briefly left alone.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.consistency", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Checking consistency without sanding away the character.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.credible-detail", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "The detail should make the bigger claim more credible.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.responsible-nudge", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "A responsible nudge. Nothing needs a redesign today.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.still-here", family: "ambient", intent: "self-edit", register: "warm", humor: 0, opening: "I’m still here. Mostly keeping the edges honest.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.working-silently", family: "ambient", intent: "self-edit", register: "warm", humor: 0, opening: "Working quietly for a moment. The file can do the talking.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.spacing-contract", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Checking whether the spacing supports the same hierarchy as the type.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.fewer-decisions", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "A good pass removes decisions the visitor should not have to make.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.micro-adjustment", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "A micro-adjustment with a surprisingly strong internal lobby.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.no-new-feature", family: "ambient", intent: "craft", register: "dry", humor: 1, opening: "Good news: this tweak does not require a new feature.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.reading-order", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "The reading order should work before the styling gets any credit.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.design-system", family: "ambient", intent: "self-edit", register: "dry", humor: 1, opening: "A design system is also a list of arguments I no longer need to have.", triggers: ["ambient"], rarity: "occasional" },
  { id: "ambient.pause-before-change", family: "ambient", intent: "self-edit", register: "warm", humor: 0, opening: "Pausing before the change. Sometimes that is the useful part.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.confidence", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Making the confident elements quieter and the useful ones clearer.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.one-variable", family: "ambient", intent: "craft", register: "professional", humor: 0, opening: "Changing one variable at a time. Otherwise it is just theatre.", triggers: ["ambient"], rarity: "common" },
  { id: "ambient.inspectable", family: "ambient", intent: "evidence", register: "professional", humor: 0, opening: "If a decision matters, it should remain inspectable after the polish.", triggers: ["ambient"], rarity: "common" },
]);
