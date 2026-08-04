import { defineDirectorLines, type DirectorLine, type DirectorSection } from "./types";

type SectionExchange = Omit<DirectorLine, "family" | "sections">;

function section(sectionId: DirectorSection, exchanges: readonly SectionExchange[]) {
  return defineDirectorLines(exchanges.map((exchange) => ({
    ...exchange,
    family: "section" as const,
    sections: [sectionId],
  })));
}

// Content-tied copy lives only in this file. When a heading, claim or section
// changes, its editorial lines can be found and updated without touching the
// selection engine or generic commentary.
export const sectionCommentary = {
  "hero-headline-indecision": section("hero", [
    { id: "section.hero.name-role-value", intent: "self-edit", register: "dry", humor: 1, opening: "Name, job title, positioning line. Every article has a different answer.", resolution: "The useful answer is what I make clearer." },
    { id: "section.hero.impossible-choice", intent: "self-edit", register: "dry", humor: 1, opening: "The headline again. Apparently I enjoy impossible choices.", resolution: "Specific enough to mean something. Keeping it." },
    { id: "section.hero.who-or-value", intent: "craft", register: "professional", humor: 0, opening: "Do I say who I am or what I actually bring?", resolution: "Less label. More point of view." },
    { id: "section.hero.three-opinions", intent: "self-edit", register: "playful", humor: 2, opening: "One hero. Three perfectly defensible opinions.", resolution: "Good. Now it sounds like the work." },
    { id: "section.hero.sixth-pass", intent: "self-edit", register: "warm", humor: 1, opening: "You caught the part where I question the headline for the sixth time.", resolution: "That says more than a job title. Finally." },
  ]),
  "snapshot-trust-typo": section("snapshot", [
    { id: "section.snapshot.scope", intent: "craft", register: "professional", humor: 0, opening: "Product terrain sounds like a conference panel.", resolution: "Scope says what a recruiter actually needs." },
    { id: "section.snapshot.platforms-typo", intent: "self-edit", register: "dry", humor: 1, opening: "Platforms. Familiar territory, questionable spelling.", resolution: "B2B platforms and systems. Clear enough." },
    { id: "section.snapshot.signal", intent: "craft", register: "professional", humor: 0, opening: "This fact needs a stronger hiring signal.", resolution: "Context first. Tool list elsewhere." },
    { id: "section.snapshot.cv", intent: "self-edit", register: "playful", humor: 2, opening: "Four facts. One of them was trying to write a manifesto.", resolution: "Back to the useful version." },
    { id: "section.snapshot.recruiter", intent: "craft", register: "dry", humor: 0, opening: "Let’s answer the recruiter’s question, not invent a new one.", resolution: "Scope made visible." },
  ]),
  "video-introduction-note": section("video", [
    { id: "section.video.shortcut", intent: "craft", register: "professional", humor: 0, opening: "A sixty-second shortcut should still feel like a person.", resolution: "Fast context. No compressed sales pitch." },
    { id: "section.video.placeholder", intent: "evidence", register: "professional", humor: 0, opening: "Placeholder for now. Better honest than artificially polished.", resolution: "The label stays until the real cut exists." },
    { id: "section.video.recruiter", intent: "craft", register: "warm", humor: 0, opening: "Some people have a minute, not a full portfolio review.", resolution: "This gives them a useful way in." },
    { id: "section.video.autoplay", intent: "craft", register: "dry", humor: 1, opening: "No autoplay. Nobody requested a surprise monologue.", resolution: "The visitor keeps the controls." },
  ]),
  "work-evidence-note": section("work", [
    { id: "section.work.evidence-first", intent: "evidence", register: "professional", humor: 0, opening: "Evidence first. Decoration can wait.", resolution: "This frame earns its space." },
    { id: "section.work.receipts", intent: "evidence", register: "dry", humor: 1, opening: "A case study should show its receipts.", resolution: "The claim now has something behind it." },
    { id: "section.work.pretty-frames", intent: "evidence", register: "dry", humor: 1, opening: "Pretty frames are not evidence. This one is trying.", resolution: "Less theatre. More proof." },
    { id: "section.work.visible-proof", intent: "evidence", register: "professional", humor: 0, opening: "If the work is real, the proof should be visible.", resolution: "Now the layout is doing product work." },
    { id: "section.work.inspect", intent: "craft", register: "warm", humor: 0, opening: "This is the part hiring managers actually inspect.", resolution: "Keep the useful detail close." },
  ]),
  "practice-two-pixels": section("practice", [
    { id: "section.practice.leaning", intent: "self-edit", register: "dry", humor: 1, opening: "This line is leaning left.", resolution: "Two pixels. Emotionally significant." },
    { id: "section.practice.unstable", intent: "self-edit", register: "playful", humor: 2, opening: "The system is sound. The alignment is emotionally unstable.", resolution: "The grid can sleep again." },
    { id: "section.practice.two-pixels", intent: "self-edit", register: "dry", humor: 1, opening: "I can feel two pixels from here.", resolution: "Nobody will notice. I will." },
    { id: "section.practice.dangerous", intent: "self-edit", register: "playful", humor: 2, opening: "Nothing is wrong. Which is when I become dangerous.", resolution: "Alignment restored. Society continues." },
    { id: "section.practice.governance", intent: "craft", register: "professional", humor: 0, opening: "A microscopic governance issue.", resolution: "Small rule. Cleaner system." },
  ]),
  "ai-validate-typo": section("ai", [
    { id: "section.ai.human-check", intent: "evidence", register: "professional", humor: 0, opening: "Human check, including spelling.", resolution: "Validated." },
    { id: "section.ai.handcrafted-typo", intent: "self-edit", register: "dry", humor: 1, opening: "AI assisted. Typo handcrafted.", resolution: "Human remains in the loop." },
    { id: "section.ai.my-mistake", intent: "evidence", register: "warm", humor: 1, opening: "The model did not make this mistake. I did.", resolution: "Accountability looks suspiciously like backspace." },
    { id: "section.ai.validate-word", intent: "self-edit", register: "dry", humor: 1, opening: "Validation should probably begin with the word validate.", resolution: "The workflow passes its smallest test." },
    { id: "section.ai.quality-gate", intent: "evidence", register: "professional", humor: 0, opening: "A very manual quality gate.", resolution: "Automation proposes. A person still signs off." },
  ]),
  "about-crop-breathe": section("about", [
    { id: "section.about.thought-leader", intent: "self-edit", register: "dry", humor: 1, opening: "A touch less ‘thought leader’.", resolution: "Better. Still me." },
    { id: "section.about.serious-crop", intent: "self-edit", register: "dry", humor: 1, opening: "This crop is taking itself very seriously.", resolution: "More human. Same jacket." },
    { id: "section.about.person", intent: "craft", register: "warm", humor: 0, opening: "Let’s leave some room for an actual person.", resolution: "The portrait can breathe now." },
    { id: "section.about.loud-portrait", intent: "craft", register: "professional", humor: 0, opening: "The portrait is winning the argument too loudly.", resolution: "Image and copy are speaking at the same volume." },
    { id: "section.about.keynote", intent: "self-edit", register: "playful", humor: 2, opening: "A little less keynote speaker, perhaps.", resolution: "Authority reduced to a responsible level." },
  ]),
  "references-side-typo": section("references", [
    { id: "section.references.person", intent: "craft", register: "warm", humor: 0, opening: "This needs to sound like a person.", resolution: "And be spelt like one." },
    { id: "section.references.placeholder", intent: "evidence", register: "professional", humor: 0, opening: "References deserve better than placeholder energy.", resolution: "Still provisional. Deliberately." },
    { id: "section.references.invented-praise", intent: "evidence", register: "dry", humor: 1, opening: "No invented praise. Not even a well-kerned one.", resolution: "No fictional colleagues were harmed." },
    { id: "section.references.honest", intent: "evidence", register: "professional", humor: 0, opening: "The honest version is quieter and stronger.", resolution: "Honesty survives the edit." },
    { id: "section.references.source-first", intent: "evidence", register: "professional", humor: 0, opening: "Source first. Compliment later.", resolution: "Permission before polish." },
  ]),
  "playground-easing": section("playground", [
    { id: "section.playground.technically-correct", intent: "craft", register: "dry", humor: 1, opening: "The timing is technically correct.", resolution: "Which is not the same as feeling right." },
    { id: "section.playground.linear", intent: "self-edit", register: "playful", humor: 2, opening: "Linear easing has entered the chat.", resolution: "The pixels now arrive with intent." },
    { id: "section.playground.decided", intent: "craft", register: "professional", humor: 0, opening: "Motion should feel decided, not merely enabled.", resolution: "The curve has found a point of view." },
    { id: "section.playground.progress", intent: "self-edit", register: "playful", humor: 2, opening: "This curve has the charisma of a progress bar.", resolution: "Motion, now with an opinion." },
    { id: "section.playground.judgement", intent: "craft", register: "professional", humor: 0, opening: "A timing function asking for better judgement.", resolution: "Better. The interaction lands instead of arriving." },
  ]),
  "footer-handoff": section("contact", [
    { id: "section.contact.stop-touching", intent: "handoff", register: "dry", humor: 1, opening: "I’ll stop touching it now.", resolution: "Probably." },
    { id: "section.contact.temporary-details", intent: "evidence", register: "professional", humor: 0, opening: "You reached the part with the temporary contact details.", resolution: "The real handoff still needs real data." },
    { id: "section.contact.awkward-handoff", intent: "handoff", register: "dry", humor: 1, opening: "End of file. Beginning of the awkward handoff.", resolution: "No promises about one final pass." },
    { id: "section.contact.backlog", intent: "self-edit", register: "dry", humor: 1, opening: "The portfolio is finished. The content backlog disagrees.", resolution: "I said stop. I did not say finished." },
    { id: "section.contact.premature", intent: "handoff", register: "warm", humor: 0, opening: "Everything below this line needs real contact data.", resolution: "Closing the file would be premature." },
  ]),
} as const satisfies Record<string, readonly DirectorLine[]>;

export type DirectorSectionBeatId = keyof typeof sectionCommentary;
