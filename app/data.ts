type CaseBlockBase = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

type CaseImage = {
  src: string;
  alt: string;
  caption: string;
  aspectRatio: string;
};

export type CaseBlock =
  | (CaseBlockBase & { type: "text"; body: string })
  | (CaseBlockBase & { type: "image"; image: CaseImage })
  | (CaseBlockBase & { type: "gallery"; images: CaseImage[] })
  | (CaseBlockBase & { type: "before-after"; before: CaseImage; after: CaseImage })
  | (CaseBlockBase & { type: "token-propagation" })
  | (CaseBlockBase & { type: "video"; src: string; poster: string; caption: string; aspectRatio: string })
  | (CaseBlockBase & {
    type: "figma";
    embedUrl: string;
    fallback: CaseImage;
  })
  | (CaseBlockBase & {
    type: "prototype";
    url: string;
    fallback: CaseImage;
  });

export type Project = {
  slug: string;
  index: string;
  name: string;
  title: string;
  summary: string;
  context: string;
  role: string;
  year: string;
  tags: string[];
  surface: string;
  proof: string;
  artifactLabel: string;
  accent: "lime" | "violet" | "blue";
  thesis: string;
  challengeTitle: string;
  challenge: string;
  evidenceBlocks?: CaseBlock[];
  decisions: { label: string; title: string; body: string }[];
  outcomes: { value: string; label: string }[];
};

export type TestimonialSlot =
  | {
      status: "placeholder";
      index: string;
      perspective: string;
      title: string;
      prompt: string;
    }
  | {
      status: "verified";
      index: string;
      perspective: string;
      quote: string;
      name: string;
      role: string;
      source: string;
      approvedForPublication: true;
    };

/**
 * Testimonials must remain visibly provisional until Javier supplies an
 * approved quote, attribution, source and publication permission. The
 * discriminated union prevents a placeholder from accidentally rendering
 * with the verified treatment.
 */
export const testimonialSlots: TestimonialSlot[] = [
  {
    status: "placeholder",
    index: "01",
    perspective: "Product partnership",
    title: "Decision clarity under pressure.",
    prompt: "Reserved for a verified recommendation about framing ambiguity and helping a team move towards a decision.",
  },
  {
    status: "placeholder",
    index: "02",
    perspective: "Engineering partnership",
    title: "From intent to buildable behaviour.",
    prompt: "Reserved for a verified recommendation about prototypes, handoff and resolving difficult edge cases together.",
  },
  {
    status: "placeholder",
    index: "03",
    perspective: "Design leadership",
    title: "Standards without losing the people.",
    prompt: "Reserved for a verified recommendation about feedback, visual craft and Javier’s recent lead responsibility.",
  },
];

/**
 * Preview content only. Names, scenarios and outcomes below are fictitious.
 * See docs/CONTENT-AND-RELEASE.md before replacing a project or removing any
 * visible concept/metric disclaimer from the UI.
 */
export const projects: Project[] = [
  {
    slug: "atlas",
    index: "01",
    name: "Atlas",
    title: "Rules without the maze",
    summary:
      "A concept for turning a dense rule engine into a workspace that helps operators understand cause, effect and risk before they publish.",
    context: "Complex B2B platform · Concept case",
    role: "Product strategy, interaction design, prototyping",
    year: "Preview · 2026",
    tags: ["Rule engines", "Systems thinking", "B2B UX"],
    surface: "Rule automation engine",
    proof: "Annotated Figma flow + interactive prototype",
    artifactLabel: "Rule canvas / impact simulation",
    accent: "lime",
    thesis:
      "Complexity does not need to disappear. It needs to become inspectable, predictable and safe to change.",
    challengeTitle: "The product exposed complexity without helping people reason through it.",
    challenge:
      "Operators were expected to configure interconnected conditions across several surfaces. The product exposed the data model, but not the mental model: people could make a change without understanding where its consequences would travel.",
    decisions: [
      {
        label: "01 · Frame",
        title: "Start with consequence, not configuration",
        body: "The entry point shifts from a long form to a decision canvas: what is changing, who it affects and what must remain true.",
      },
      {
        label: "02 · Shape",
        title: "Make dependencies visible in context",
        body: "A compact impact rail reveals connected rules progressively, keeping the primary task focused while making risk available on demand.",
      },
      {
        label: "03 · Ship",
        title: "Turn review into a product capability",
        body: "A pre-publish simulation explains likely outcomes in plain language and creates a reusable audit trail for the team.",
      },
    ],
    outcomes: [
      { value: "−38%", label: "time to validate a change" },
      { value: "+27%", label: "first-pass confidence" },
      { value: "1", label: "shared model across teams" },
    ],
  },
  {
    slug: "northstar",
    index: "02",
    name: "Northstar",
    title: "One system, many products",
    summary:
      "A modular design system concept that aligns multiple brands and teams without forcing every product into the same expression.",
    context: "Multi-product ecosystem · Concept case",
    role: "Design system strategy, governance, direction",
    year: "Preview · 2026",
    tags: ["Design systems", "Governance", "Product operations"],
    surface: "Multi-product platform",
    proof: "System map + governance model",
    artifactLabel: "Token system / product modes",
    accent: "violet",
    thesis:
      "A design system scales when it makes the right path easier—and leaves enough room for products to remain themselves.",
    challengeTitle: "The component mismatch was a symptom of decision drift.",
    challenge:
      "Parallel teams had solved similar problems in different ways. The visible inconsistency was only a symptom; the deeper issue was that ownership, contribution and decision-making had no shared structure.",
    evidenceBlocks: [
      {
        id: "system-behaviour",
        type: "token-propagation",
        eyebrow: "Interactive evidence / Fictitious",
        title: "Change one decision. Watch the system respond.",
        description: "A small demonstrator for how real case studies will make system behaviour inspectable instead of showing a static component inventory.",
      },
    ],
    decisions: [
      {
        label: "01 · Diagnose",
        title: "Map decisions before components",
        body: "The work begins with a dependency map across product, design and engineering, exposing where drift is created and who can resolve it.",
      },
      {
        label: "02 · Define",
        title: "Separate foundations from expression",
        body: "Stable accessibility and interaction foundations are shared, while brand and density modes create controlled space for product-specific needs.",
      },
      {
        label: "03 · Govern",
        title: "Design contribution as a service",
        body: "Clear service levels, contribution states and release notes turn governance from a meeting into a visible operating model.",
      },
    ],
    outcomes: [
      { value: "3→1", label: "foundational libraries" },
      { value: "2×", label: "faster pattern adoption" },
      { value: "AA", label: "accessibility baseline" },
    ],
  },
  {
    slug: "pulse",
    index: "03",
    name: "Pulse",
    title: "AI that earns its place",
    summary:
      "An AI-assisted workflow concept focused on evidence, control and graceful recovery—not a chat box added to every screen.",
    context: "AI-assisted workflow · Concept case",
    role: "Discovery, workflow design, facilitation",
    year: "Preview · 2026",
    tags: ["Applied AI", "Workflow design", "Trust"],
    surface: "AI-assisted workflow",
    proof: "Decision prototype + working web demo",
    artifactLabel: "Evidence review / confidence states",
    accent: "blue",
    thesis:
      "AI becomes useful when it reduces uncertainty inside an existing decision—not when it asks people to invent the right prompt.",
    challengeTitle: "The team needed leverage without giving up control.",
    challenge:
      "Teams saw opportunities for automation everywhere, but lacked a way to distinguish genuine leverage from novelty. The experience also needed to communicate confidence, source and reversibility without slowing experts down.",
    decisions: [
      {
        label: "01 · Find",
        title: "Locate the expensive uncertainty",
        body: "A workshop maps repeated decisions by effort, risk and data quality, selecting a narrow assistance point rather than automating the whole journey.",
      },
      {
        label: "02 · Ground",
        title: "Show why, not just what",
        body: "Every suggestion carries its source, confidence and changed fields so experts can verify the work without reconstructing it.",
      },
      {
        label: "03 · Recover",
        title: "Make control the default state",
        body: "Preview, selective acceptance and undo are part of the core interaction. Automation remains interruptible and legible at every step.",
      },
    ],
    outcomes: [
      { value: "12m", label: "saved per repeated task" },
      { value: "100%", label: "suggestions traceable" },
      { value: "0", label: "silent automated changes" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
