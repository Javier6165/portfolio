import { defineDirectorLines, type DirectorLine, type DirectorTrigger } from "./types";

type ContextLine = Omit<DirectorLine, "triggers">;

function cue(trigger: DirectorTrigger, lines: readonly ContextLine[]) {
  return defineDirectorLines(lines.map((line) => ({ ...line, triggers: [trigger] })));
}

export const contextualCommentary = {
  "memory-granted": cue("memory-granted", [
    { id: "action.memory-granted.visit-only", family: "action", intent: "reassure", register: "professional", humor: 0, opening: "Memory on. I’ll remember the visit, not what you do." },
    { id: "action.memory-granted.count-only", family: "action", intent: "reassure", register: "warm", humor: 0, opening: "Got it. Just the visit count and lines already shown." },
    { id: "action.memory-granted.shorter-hello", family: "action", intent: "acknowledge", register: "warm", humor: 0, opening: "Thanks. I’ll skip the long hello next time." },
    { id: "action.memory-granted.local", family: "action", intent: "reassure", register: "dry", humor: 1, opening: "Saved locally. The internet does not need a report." },
    { id: "action.memory-granted.restraint", family: "action", intent: "reassure", register: "dry", humor: 1, opening: "Permission received. Restraint remains enabled." },
  ]),
  "memory-denied": cue("memory-denied", [
    { id: "action.memory-denied.fair", family: "action", intent: "reassure", register: "warm", humor: 0, opening: "No memory. Fair. Everything still works." },
    { id: "action.memory-denied.tab-only", family: "action", intent: "reassure", register: "professional", humor: 0, opening: "No thanks received. This stays inside the current tab." },
    { id: "action.memory-denied.less-paperwork", family: "action", intent: "reassure", register: "dry", humor: 1, opening: "Memory off. Less paperwork for both of us." },
    { id: "action.memory-denied.clean-browser", family: "action", intent: "acknowledge", register: "dry", humor: 1, opening: "Declined. I respect a clean browser." },
    { id: "action.memory-denied.no-penalty", family: "action", intent: "reassure", register: "professional", humor: 0, opening: "Nothing saved. No part of the portfolio is withheld." },
  ]),
  "visit-one": cue("visit-one", [
    { id: "behavior.visit-one.useful", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "First pass. I’ll keep the commentary useful." },
    { id: "behavior.visit-one.no-assumptions", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "New file, new visitor. I’m making no assumptions yet." },
    { id: "behavior.visit-one.tidy", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "First visit. You get the relatively tidy version." },
    { id: "behavior.visit-one.rough-edges", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "A fresh visit. I’ll introduce the rough edges gradually." },
    { id: "behavior.visit-one.ready", family: "behavior", intent: "self-edit", register: "playful", humor: 2, opening: "First look. I’m still pretending this was ready." },
  ]),
  "visit-two": cue("visit-two", [
    { id: "behavior.visit-two.back", family: "behavior", intent: "acknowledge", register: "warm", humor: 1, opening: "Back already. I’ll pretend I had this tidy." },
    { id: "behavior.visit-two.context", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Second visit. You know where the useful detail lives now." },
    { id: "behavior.visit-two.manners", family: "behavior", intent: "acknowledge", register: "dry", humor: 1, opening: "Welcome back. The intro has learned some manners." },
    { id: "behavior.visit-two.round", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "Round two. I kept the useful parts visible." },
    { id: "behavior.visit-two.positive", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "You returned. I’m choosing to interpret that positively." },
  ]),
  "visit-three": cue("visit-three", [
    { id: "behavior.visit-three.review", family: "behavior", intent: "acknowledge", register: "dry", humor: 1, opening: "Third visit. This is becoming a design review." },
    { id: "behavior.visit-three.notes", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "Back again. I should probably start taking notes." },
    { id: "behavior.visit-three.stakeholders", family: "behavior", intent: "self-edit", register: "playful", humor: 2, opening: "You now have more context than some stakeholders." },
    { id: "behavior.visit-three.skip-tour", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "You know the file now. We can skip the ceremonial tour." },
    { id: "behavior.visit-three.details", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Another pass. The smaller decisions are fair game now." },
  ]),
  "visit-four": cue("visit-four", [
    { id: "behavior.visit-four.context", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "You’ve seen this before. I can be less ceremonial." },
    { id: "behavior.visit-four.rhythm", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Another visit. The file can meet you where you left it." },
    { id: "behavior.visit-four.designer", family: "behavior", intent: "observe", register: "dry", humor: 1, opening: "Back for another pass. Very designer behaviour." },
    { id: "behavior.visit-four.qa", family: "behavior", intent: "self-edit", register: "playful", humor: 2, opening: "This is either interest or remarkably thorough QA." },
    { id: "behavior.visit-four.quiet", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "Welcome back. I’ll keep the interruption lighter this time." },
  ]),
  "visit-five": cue("visit-five", [
    { id: "behavior.visit-five.collaboration", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "At this point I’m counting this as recurring collaboration." },
    { id: "behavior.visit-five.reviewer", family: "behavior", intent: "acknowledge", register: "dry", humor: 1, opening: "You keep coming back. Unofficial reviewer status granted." },
    { id: "behavior.visit-five.accidental", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "I have stopped pretending this return is accidental." },
    { id: "behavior.visit-five.insufficient", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "At this point, welcome back feels insufficient." },
    { id: "behavior.visit-five.know-file", family: "behavior", intent: "self-edit", register: "playful", humor: 2, opening: "You may know this portfolio better than I do." },
  ]),
  "session-settled": cue("session-settled", [
    { id: "behavior.session-settled.past-opening", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "Past the opening, the useful detail should start to carry the page." },
    { id: "behavior.session-settled.quiet", family: "behavior", intent: "self-edit", register: "warm", humor: 0, opening: "Still here. I’ll refine quietly for a while." },
    { id: "behavior.session-settled.scan", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Past a quick scan, the smaller decisions need to hold up too." },
    { id: "behavior.session-settled.details", family: "behavior", intent: "observe", register: "dry", humor: 1, opening: "The smaller decisions are becoming fair game." },
    { id: "behavior.session-settled.no-tour", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "The page can stop introducing itself and start showing the work." },
  ]),
  "session-deep": cue("session-deep", [
    { id: "behavior.session-deep.review", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "This feels more like a review than a visit now." },
    { id: "behavior.session-deep.time", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "You’re giving the work enough time to inspect the joins." },
    { id: "behavior.session-deep.small-decisions", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "Deep enough into the file for the small decisions to matter." },
    { id: "behavior.session-deep.quiet-edits", family: "behavior", intent: "self-edit", register: "warm", humor: 0, opening: "I’ll keep the quieter edits near the detail you’re reading." },
    { id: "behavior.session-deep.structure", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "A deeper pass is where structure matters more than first impressions." },
  ]),
  "session-long": cue("session-long", [
    { id: "behavior.session-long.working", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "We may as well call this a working session." },
    { id: "behavior.session-long.review", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "A long review deserves the quieter details too." },
    { id: "behavior.session-long.alignment", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "Long enough to notice the alignment issues. Fair." },
    { id: "behavior.session-long.company", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "Thanks for keeping the file company this long." },
  ]),
  "fast-scroll": cue("fast-scroll", [
    { id: "behavior.fast-scroll.headlines", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Headlines first, evidence when you need it. Fair." },
    { id: "behavior.fast-scroll.hiring", family: "behavior", intent: "observe", register: "dry", humor: 1, opening: "A headline-first scan. Efficient." },
    { id: "behavior.fast-scroll.brief", family: "behavior", intent: "self-edit", register: "warm", humor: 0, opening: "I’ll keep the commentary brief while you scan." },
    { id: "behavior.fast-scroll.no-chase", family: "behavior", intent: "reassure", register: "professional", humor: 0, opening: "I won’t chase a moving viewport." },
    { id: "behavior.fast-scroll.research", family: "behavior", intent: "observe", register: "dry", humor: 1, opening: "Skimming is a valid research method. Apparently." },
    { id: "behavior.fast-scroll.settle", family: "behavior", intent: "reassure", register: "warm", humor: 0, opening: "I’ll wait for a real pause before bringing the cursor over." },
  ]),
  "patient-reader": cue("patient-reader", [
    { id: "behavior.patient-reader.time", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "A section held this long should earn the attention." },
    { id: "behavior.patient-reader.furniture", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "A proper read. I’ll avoid moving the furniture." },
    { id: "behavior.patient-reader.detail", family: "behavior", intent: "craft", register: "professional", humor: 0, opening: "A pause is a good test of whether the detail holds." },
    { id: "behavior.patient-reader.tab-discipline", family: "behavior", intent: "observe", register: "dry", humor: 1, opening: "A long pause. Either attention or excellent tab discipline." },
    { id: "behavior.patient-reader.work-evidence", family: "behavior", intent: "evidence", register: "professional", humor: 0, opening: "This is a sensible place to inspect the evidence.", sections: ["work"] },
    { id: "behavior.patient-reader.no-assumption", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "A pause can mean many things. The layout should hold either way." },
  ]),
  "returned-top": cue("returned-top", [
    { id: "behavior.returned-top.first-impression", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Back at the beginning. A second first impression." },
    { id: "behavior.returned-top.holds", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "Returned to the hero. Checking whether it still holds?" },
    { id: "behavior.returned-top.portrait", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "The portrait has not moved. Much." },
    { id: "behavior.returned-top.compare", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Back up top. A useful comparison pass." },
  ]),
  "reached-end": cue("reached-end", [
    { id: "behavior.reached-end.contact", family: "behavior", intent: "evidence", register: "professional", humor: 0, opening: "End of file. The contact details still need to become real." },
    { id: "behavior.reached-end.placeholders", family: "behavior", intent: "evidence", register: "dry", humor: 1, opening: "The placeholder labels survived a complete inspection." },
    { id: "behavior.reached-end.complete-scroll", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "You saw the whole thing. Thanks for the unusually complete scroll." },
    { id: "behavior.reached-end.no-confetti", family: "behavior", intent: "acknowledge", register: "playful", humor: 2, opening: "Bottom reached. No confetti. We’re both adults." },
  ]),
  "section-revisit": cue("section-revisit", [
    { id: "behavior.section-revisit.working", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "Back here again. Something is earning a second look." },
    { id: "behavior.section-revisit.sensible", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "A second look at this section. Sensible." },
    { id: "behavior.section-revisit.inspect", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "You returned to this bit. I’ll inspect it too." },
    { id: "behavior.section-revisit.detail", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "A revisit usually means the detail has to hold up." },
  ]),
  "direction-change": cue("direction-change", [
    { id: "behavior.direction-change.compare", family: "behavior", intent: "observe", register: "professional", humor: 0, opening: "Moving between sections is a good way to test the hierarchy." },
    { id: "behavior.direction-change.backtrack", family: "behavior", intent: "observe", register: "warm", humor: 0, opening: "A little backtracking. The page should make comparison easy." },
    { id: "behavior.direction-change.map", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "The scroll changed its mind. Relatable." },
    { id: "behavior.direction-change.no-chase", family: "behavior", intent: "reassure", register: "professional", humor: 0, opening: "I’ll wait until the viewport settles before touching anything." },
    { id: "behavior.direction-change.orientation", family: "behavior", intent: "craft", register: "professional", humor: 0, opening: "Changing direction should not mean losing orientation." },
  ]),
  "tab-return": cue("tab-return", [
    { id: "behavior.tab-return.resume", family: "behavior", intent: "acknowledge", register: "warm", humor: 0, opening: "Welcome back. I kept the file where it was." },
    { id: "behavior.tab-return.quiet", family: "behavior", intent: "self-edit", register: "warm", humor: 0, opening: "Back again. I’ll resume quietly." },
    { id: "behavior.tab-return.other-tab", family: "behavior", intent: "self-edit", register: "dry", humor: 1, opening: "The other tab made a strong case, I assume." },
    { id: "behavior.tab-return.no-reproach", family: "behavior", intent: "acknowledge", register: "professional", humor: 0, opening: "The session can continue without a recap." },
    { id: "behavior.tab-return.no-score", family: "behavior", intent: "reassure", register: "dry", humor: 1, opening: "No attendance score. The file simply carries on." },
  ]),
  "follow-stop": cue("follow-stop", [
    { id: "action.follow-stop.control", family: "action", intent: "acknowledge", register: "professional", humor: 0, opening: "You’re back in control. I’ll work around the viewport." },
    { id: "action.follow-stop.release", family: "action", intent: "handoff", register: "warm", humor: 0, opening: "Follow stopped. The page is yours again." },
    { id: "action.follow-stop.carried-away", family: "action", intent: "self-edit", register: "dry", humor: 1, opening: "I may have got carried away with the tour." },
    { id: "action.follow-stop.ambient", family: "action", intent: "handoff", register: "warm", humor: 0, opening: "I’ll go back to the smaller edits." },
    { id: "action.follow-stop.no-camera", family: "action", intent: "reassure", register: "professional", humor: 0, opening: "No more camera moves. Director is ambient again." },
  ]),
  "rare-review": cue("rare-review", [
    { id: "rare.review.design-crit", family: "rare", intent: "rare", register: "playful", humor: 2, opening: "This has quietly become a design crit.", rarity: "rare" },
    { id: "rare.review.invoice", family: "rare", intent: "rare", register: "playful", humor: 2, opening: "At this depth I should probably send an agenda. Not an invoice.", rarity: "rare" },
    { id: "rare.review.qa", family: "rare", intent: "rare", register: "dry", humor: 1, opening: "You found the part of the session usually reserved for QA.", rarity: "rare" },
    { id: "rare.review.residency", family: "rare", intent: "rare", register: "playful", humor: 2, opening: "Extended residency in the working file approved.", rarity: "rare" },
  ]),
} as const satisfies Record<Exclude<DirectorTrigger, "ambient">, readonly DirectorLine[]>;

export type ContextualCueId = keyof typeof contextualCommentary;
