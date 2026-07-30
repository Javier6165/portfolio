export type DirectorCommentPool = {
  opening: readonly string[];
  resolution?: readonly string[];
};

export const sectionCommentary: Record<string, DirectorCommentPool> = {
  "hero-name-typo": {
    opening: [
      "Small correction. Very personal.",
      "The name should probably survive the final pass.",
      "One typo away from rebranding myself.",
      "I know this word. I use it often.",
      "Starting with the least negotiable piece of copy.",
    ],
    resolution: [
      "Good catch. By me.",
      "Still me. Reassuring.",
      "Identity system restored.",
      "The personal brand survives another sprint.",
    ],
  },
  "hero-role-typo": {
    opening: [
      "One last word.",
      "The role is clear. The spelling less so.",
      "Senior enough to fix my own title.",
      "This looked correct from three metres away.",
      "A tiny credibility adjustment.",
    ],
    resolution: [
      "That typo waited for an audience.",
      "Designer. Confirmed.",
      "Much more employable.",
      "The job title can face the public again.",
    ],
  },
  "snapshot-trust-typo": {
    opening: [
      "The ending can work harder.",
      "Trust is a dangerous word to misspell.",
      "This sentence wants one cleaner landing.",
      "The claim is fine. The typing needs supervision.",
      "Let’s make the last three words earn their place.",
    ],
    resolution: [
      "Yes. Without the accidental anagram.",
      "Tested. Trusted. Spelled correctly.",
      "The sentence can keep its confidence now.",
      "Small edit. Better ending.",
    ],
  },
  "work-evidence-note": {
    opening: [
      "Evidence first. Decoration can wait.",
      "A case study should show its receipts.",
      "Pretty frames are not evidence. This one is trying.",
      "If the work is real, the proof should be visible.",
      "This is the part hiring managers actually inspect.",
    ],
    resolution: [
      "This frame earns its space.",
      "Better. The claim now has something behind it.",
      "Less theatre. More proof.",
      "Now the layout is doing product work.",
    ],
  },
  "practice-two-pixels": {
    opening: [
      "This line is leaning left.",
      "The system is sound. The alignment is emotionally unstable.",
      "I can feel two pixels from here.",
      "Nothing is wrong. Which is when I become dangerous.",
      "A microscopic governance issue.",
    ],
    resolution: [
      "Two pixels. Emotionally significant.",
      "Nobody will notice. I will.",
      "Alignment restored. Society continues.",
      "The grid can sleep again.",
    ],
  },
  "ai-validate-typo": {
    opening: [
      "Human check, including spelling.",
      "AI assisted. Typo handcrafted.",
      "The model did not make this mistake. I did.",
      "Validation should probably begin with the word validate.",
      "A very manual quality gate.",
    ],
    resolution: [
      "Validated.",
      "Human remains in the loop.",
      "The workflow passes its smallest test.",
      "Accountability looks suspiciously like backspace.",
    ],
  },
  "about-crop-breathe": {
    opening: [
      "A touch less ‘thought leader’.",
      "This crop is taking itself very seriously.",
      "Let’s leave some room for an actual person.",
      "The portrait is winning the argument too loudly.",
      "A little less keynote speaker, perhaps.",
    ],
    resolution: [
      "Better. Still me.",
      "More human. Same jacket.",
      "The portrait can breathe now.",
      "Authority reduced to a responsible level.",
    ],
  },
  "references-side-typo": {
    opening: [
      "This needs to sound like a person.",
      "References deserve better than placeholder energy.",
      "No invented praise. Not even a well-kerned one.",
      "The honest version is quieter and stronger.",
      "Source first. Compliment later.",
    ],
    resolution: [
      "And be spelt like one.",
      "Still provisional. Deliberately.",
      "Honesty survives the edit.",
      "No fictional colleagues were harmed.",
    ],
  },
  "playground-easing": {
    opening: [
      "The timing is technically correct.",
      "Linear easing has entered the chat.",
      "Motion should feel decided, not merely enabled.",
      "This curve has the charisma of a progress bar.",
      "A timing function asking for better judgement.",
    ],
    resolution: [
      "Which is not the same as feeling right.",
      "Better. The pixels now arrive with intent.",
      "The curve has found a point of view.",
      "Motion, now with an opinion.",
    ],
  },
  "footer-handoff": {
    opening: [
      "I’ll stop touching it now.",
      "You reached the part with the temporary contact details.",
      "End of file. Beginning of the awkward handoff.",
      "Everything below this line needs real contact data.",
      "The portfolio is finished. The content backlog disagrees.",
    ],
    resolution: [
      "Probably.",
      "No promises about one final pass.",
      "I said stop. I did not say finished.",
      "Closing the file would be premature.",
    ],
  },
};

export const contextualCommentary = {
  "memory-granted": [
    "Memory on. I’ll remember the visit, not what you do.",
    "Got it. Just the visit count. Nothing dramatic.",
    "Thanks. I’ll skip the long hello next time.",
    "Saved locally. The internet does not need a report.",
    "Permission received. Restraint remains enabled.",
  ],
  "memory-denied": [
    "No cookies. Fair. This was only local memory anyway.",
    "No thanks received. This stays inside the current tab.",
    "Memory off. Honestly, less paperwork for both of us.",
    "Good call. The portfolio works without remembering you.",
    "Declined. I respect a clean browser.",
  ],
  "visit-one": [
    "First pass. I’ll keep the commentary useful.",
    "New file, new visitor. I’m making no assumptions yet.",
    "First visit. You get the relatively tidy version.",
    "A fresh tab. I’ll introduce the rough edges gradually.",
    "First look. I’m still pretending this was ready.",
  ],
  "visit-two": [
    "Back already. I’ll pretend I had this tidy.",
    "Second visit. You know where the rough edges are now.",
    "Welcome back. The intro has learned some manners.",
    "Round two. I kept the useful parts visible.",
    "You returned. I’m choosing to interpret that positively.",
  ],
  "visit-three": [
    "Third visit. This is becoming a design review.",
    "Three visits. I should probably start taking notes.",
    "Back again. You now have more context than some stakeholders.",
    "Visit three. We can skip the ceremonial tour.",
    "You know the file now. Feel free to judge the details.",
  ],
  "visit-four": [
    "Fourth visit. At this point you have context.",
    "You’ve seen this before. I can be less polite.",
    "Visit four. The portfolio is beginning to recognise your rhythm.",
    "Back for another pass. Very designer behaviour.",
    "Four visits. This is either interest or thorough QA.",
  ],
  "visit-five": [
    "Five visits. I’m counting this as recurring collaboration.",
    "You keep coming back. Unofficial reviewer status granted.",
    "Visit five. I have stopped pretending this is accidental.",
    "At this point, welcome back feels insufficient.",
    "Five rounds. You may know this portfolio better than I do.",
  ],
  "session-forty-five": [
    "You stayed past the opening. Good. The work starts below.",
    "Still here. I’ll take that as permission to refine quietly.",
    "Forty-five seconds. Longer than the average polite glance.",
    "You’re reading, not merely scrolling. Noted.",
  ],
  "session-two-minutes": [
    "Two minutes. You read portfolios properly. Rare.",
    "You’re taking your time. I’ll stop pretending nobody does.",
    "This has become a review, not a visit.",
    "Two minutes in. The small decisions are now fair game.",
  ],
  "session-four-minutes": [
    "Four minutes. We may as well call this a working session.",
    "You’re still here. I’m upgrading this from visit to review.",
    "Four minutes is enough time to notice the alignment issues.",
    "Long session. I’ll make the quieter edits.",
  ],
  "fast-scroll": [
    "Fast scroll. Fair. Headlines first, evidence later.",
    "You scan like a hiring manager. Efficient.",
    "Speed run detected. I’ll keep the comments brief.",
    "You’re moving quickly. I won’t chase the viewport.",
    "Skimming is a valid research method. Apparently.",
  ],
  "patient-reader": [
    "You paused on the evidence. Good place to be suspicious.",
    "A proper read. I’ll avoid moving the furniture.",
    "You’re giving this section time. It should earn it.",
    "Still on this frame. I’m checking whether the detail holds.",
    "Long pause. Either interest or excellent tab discipline.",
  ],
  "returned-top": [
    "Back to the top. Checking whether the first impression holds?",
    "Returned to the hero. The portrait has not moved. Much.",
    "Back at the beginning. A second first impression.",
    "You came back up. I’ll take that as a comparison pass.",
  ],
  "reached-end": [
    "You made it to the end. I owe you real contact details.",
    "End of file reached. The placeholder labels survived inspection.",
    "You saw the whole thing. Thanks for the unusually complete scroll.",
    "Bottom reached. No confetti. We’re both adults.",
  ],
  "section-revisit": [
    "Back here again. Something is either working or bothering you.",
    "Second look at this section. Sensible.",
    "You returned to this bit. I’ll inspect it too.",
    "Revisited. That usually means the detail matters.",
  ],
} as const satisfies Record<string, readonly string[]>;

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function pickDirectorComment({
  pool,
  sourceId,
  phase,
  seed,
  hasSeen,
  remember,
}: {
  pool: readonly string[];
  sourceId: string;
  phase: "opening" | "resolution";
  seed: string;
  hasSeen: (id: string) => boolean;
  remember: (id: string) => void;
}) {
  const variants = pool.map((copy, index) => ({ copy, id: `director-copy:${sourceId}:${phase}:${index}` }));
  const available = variants.filter((variant) => !hasSeen(variant.id));
  const choices = available.length > 0 ? available : variants;
  const selected = choices[hash(`${sourceId}:${phase}:${seed}`) % choices.length];
  remember(selected.id);
  return selected.copy;
}
