// Contextual notes are editorial, not generated. Keep them tied to the current
// Home section so factual copy can be revised when that section changes.
export const directorCopy = {
  experience: [
    "The Junior-to-Lead progression happened at GiG. I’m looking for a hands-on Lead role where I can keep designing.",
    "Lead experience changed how I work with a team, but I still want to stay close to the craft.",
  ],
  work: [
    "The case studies explain the decisions now. I’m still selecting the product imagery I can publish.",
    "The useful part is the problem, the trade-offs and what I actually owned. The visuals will catch up.",
  ],
  "about-preview": [
    "I came to product through visual design and games. That background still shapes how I think about interaction.",
    "I moved into Lead without stepping away from the day-to-day design work. That combination matters to me.",
  ],
  testimonials: [
    "These are excerpts from recommendations I received on LinkedIn. I’m adding the direct source links as the portfolio is completed.",
    "I included these because collaboration matters as much as the final interface. The original recommendations are on LinkedIn.",
  ],
  lab: [
    "The Lab is for experiments with a clear question and a learning, not just polished mockups.",
    "The first experiments are still being selected. I want each one to show what I tried and what changed my mind.",
  ],
  "how-i-work": [
    "I don’t use the same process on every problem. The amount of research and prototyping should fit what the team needs to learn.",
    "The useful question is often which uncertainty we need to remove next, not which design deliverable comes next.",
  ],
} as const;

export type CommentSection = keyof typeof directorCopy;
