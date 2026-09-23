export type CaseMedia =
  | { kind: "placeholder"; label: string; aspect?: "wide" | "square" }
  | { kind: "image"; src: string; alt: string; caption: string; aspect?: "wide" | "square"; presentation?: "screenshot" | "composition"; companion?: { src: string; alt: string } };

export type CaseChapter = {
  id: string;
  title: string;
  paragraphs: string[];
  points?: string[];
  media?: CaseMedia;
  emphasis?: string;
};

export type CaseStudy = {
  slug: string;
  name: string;
  client: string;
  discipline: string;
  headline: string;
  introduction: string;
  role: string;
  scope: string;
  collaboration: string;
  hero: CaseMedia;
  chapters: CaseChapter[];
  closing: string;
  note?: string;
};

const customizerImage = (file: string, alt: string, caption: string): CaseMedia => ({
  kind: "image",
  src: `/images/cases/customizer/${file}`,
  alt,
  caption,
  aspect: "wide",
});
const caseScreenshot = (folder: "logicx" | "backoffice", file: string, alt: string, caption: string, aspect: "wide" | "square" = "wide"): CaseMedia => ({
  kind: "image",
  src: `/images/cases/${folder}/${file}`,
  alt,
  caption,
  aspect,
  presentation: "screenshot",
});
const caseComposition = (folder: "logicx" | "backoffice", file: string, alt: string, companionFile: string, companionAlt: string, caption: string): CaseMedia => ({
  kind: "image",
  src: `/images/cases/${folder}/${file}`,
  alt,
  caption,
  presentation: "composition",
  companion: { src: `/images/cases/${folder}/${companionFile}`, alt: companionAlt },
});

export const caseStudies: CaseStudy[] = [
  {
    slug: "logicx",
    name: "LogicX",
    client: "GiG",
    discipline: "B2B product design / Rules engine",
    headline: "Making powerful automation easier to understand.",
    introduction: "I was the main Product Designer behind the redesign and evolution of Logic, now LogicX, GiG’s real-time rules engine for building complex automations without writing code. Over several years, the work grew from a core product redesign into new workflows, integrations and an AI-assisted layer.",
    role: "Product Designer to Senior Product Designer",
    scope: "End-to-end UX/UI, interaction design, systems, prototyping",
    collaboration: "Product Owner, Engineering Manager and development team",
    hero: caseComposition("logicx", "editor-mockup.jpg", "LogicX rule editor presented in a browser mockup, with connected conditions and a configuration panel", "rule-graph.jpg", "LogicX automation graph with branching conditions and actions", "Provisional composition of real LogicX screens; final mockups can replace it later."),
    chapters: [
      {
        id: "product",
        title: "Automation without the development cycle.",
        paragraphs: [
          "LogicX lets operators combine triggers, conditions and actions into automated flows that react to events as they happen. The same engine can support player behaviour, bonuses, fraud prevention, responsible gaming, marketing and operational work.",
          "The potential is enormous. So is the complexity: a simple rule may contain a few steps, while a sophisticated one can combine many dependencies and integrations.",
        ],
      },
      {
        id: "challenge",
        title: "Powerful technology. A difficult product.",
        paragraphs: [
          "Logic had grown from a technical internal tool. Its interface reflected the system underneath it: a steep learning curve, inconsistent patterns and flows shaped more by implementation needs than by how people understood the task.",
          "The challenge was not to make it look newer. It was to help users understand and change complex logic without removing the flexibility that made the product valuable.",
        ],
        emphasis: "Make the simple things feel simple, while keeping complex things possible.",
        media: caseScreenshot("logicx", "editor-flow.jpg", "LogicX rule editor showing a connected flow of trigger, calculation and filtering blocks", "A wide view of the rule structure at overview scale."),
      },
      {
        id: "editor",
        title: "Separate the rule from its configuration.",
        paragraphs: [
          "I redesigned the visual rule editor around a clearer hierarchy. The canvas needed to show the structure of an automation at a glance; detailed node configuration needed to remain accessible without breaking that overview.",
          "This distinction helped the editor serve both ends of the spectrum, from a short rule to a larger network of conditions, actions and dependencies. The aim was not to hide complexity, but to expose it at the moment it became useful.",
        ],
        media: caseScreenshot("logicx", "editor-config.jpg", "LogicX rule editor with a selected filter node and its contextual configuration panel", "Detail view: the canvas stays legible while one node opens for configuration."),
      },
      {
        id: "evolution",
        title: "One redesign. Years of new possibilities.",
        paragraphs: [
          "The editor was a foundation, not an endpoint. As Logic grew, I designed setup wizards, templates, apps and connector experiences, while revisiting existing flows as their requirements became more sophisticated.",
          "Most features were developed through close iteration with Product and Engineering. Customer feedback often came through Product, with occasional direct user conversations; prototypes and reviews helped us make assumptions visible before implementation.",
        ],
        points: ["Templates to begin from an existing rule", "Configuration flows for complex use cases", "Apps and connectors between products and services"],
        media: caseScreenshot("logicx", "simulator-mockup.jpg", "LogicX simulator shown in a laptop mockup with editable example values", "The simulator made the effect of a rule inspectable before it was enabled."),
      },
      {
        id: "system",
        title: "A product within a wider system.",
        paragraphs: [
          "Logic also needed to feel part of GiG’s backoffice ecosystem. I worked on Logic and on the Figma side of the shared Backoffice Design System, so patterns could move in both directions: reuse the system where it fit, and extend it when Logic exposed a genuine gap.",
          "Later, I explored how GiG Assistant could help users generate the structure of a rule from natural language. It was an additional way into a complex system, not a substitute for understanding and reviewing the logic.",
        ],
        media: caseScreenshot("logicx", "simulator-results.jpg", "LogicX simulator showing expanded iterations and their exit paths", "A provisional result view from the wider product family; the AI-assisted layer remains a separate exploration."),
      },
      {
        id: "reflection",
        title: "What this work changed in my practice.",
        paragraphs: [
          "LogicX became a core automation product through work across Product, Engineering and the wider company. My contribution was the experience layer that made its technical power easier to inspect, configure and evolve.",
          "The hardest part was often understanding the system deeply enough to make a useful design decision. I learned that simplification does not always mean taking features away. Often it means giving complexity a structure people can reason with.",
        ],
      },
    ],
    closing: "Power and usability are not opposites. The design work is finding a way for both to coexist.",
    note: "The visuals are provisional product captures supplied for the portfolio. Final shots.so treatments can replace them later; scale figures and outcomes remain omitted until their sources and wording are confirmed.",
  },
  {
    slug: "backoffice-design-system",
    name: "Backoffice Design System",
    client: "GiG",
    discipline: "Design systems / B2B ecosystem",
    headline: "Building one product language across a complex ecosystem.",
    introduction: "I was the primary designer responsible for building and evolving the Figma design system used across GiG’s backoffice products. What began as recreating a code-based UI kit became years of work on shared foundations, product-specific patterns, themes and the connection between design and production.",
    role: "Product Designer to Senior Product Designer",
    scope: "System architecture, components, variables, themes, design-to-code alignment",
    collaboration: "Design, Product and Engineering across the backoffice ecosystem",
    hero: caseComposition("backoffice", "library-mockup.jpg", "Figma Back Office Library shown as a paired editorial mockup of the shared component system", "tokens-mockup.jpg", "Backoffice colour foundations for light and dark themes", "Provisional composition of the Figma library and tokens; final mockups can replace it later."),
    chapters: [
      {
        id: "starting-point",
        title: "The interface existed in code. Barely in Figma.",
        paragraphs: [
          "When I joined GiG, backoffice products already shared a code-based UI kit built on Bootstrap 4.6. Designers, however, had only a small Figma library. There was no dependable design source that represented what development could actually build.",
          "My first task was to rebuild that implementation in Figma, component by component: controls, tables, navigation, forms, states and layout patterns. It required understanding behaviour, not just copying appearance.",
        ],
        media: caseScreenshot("backoffice", "buttons-mockup.jpg", "Backoffice design system buttons matrix shown in a Figma browser mockup", "A component-family capture from the early system work."),
      },
      {
        id: "architecture",
        title: "Consistency without sameness.",
        paragraphs: [
          "This system had to work for very different products: operational tools in CoreX, the LogicX rule editor, content management in Magic, analytics in DataX and dense trading workflows.",
          "The useful boundary was not 'shared or not shared'. It was deciding which rules belonged to the whole ecosystem, which components were reusable and which interactions existed for a specific product problem.",
        ],
        points: ["Foundations: typography, colour, spacing and behaviour", "Shared components: fields, tables, navigation and overlays", "Product patterns: specialist interactions with a real reason to exist"],
        emphasis: "Different products, the same underlying rules.",
      },
      {
        id: "evolution",
        title: "A system that evolved with the work.",
        paragraphs: [
          "I maintained the Figma library through changing product needs and changing Figma capabilities. Spacing and colour became more systematic; variants and component properties replaced duplication; new patterns were added only when product work justified them.",
          "When Figma Variables arrived, I reworked colour foundations so light and dark modes could be expressed semantically. One component could adapt to both without maintaining two separate libraries.",
        ],
        media: caseScreenshot("backoffice", "tokens-mockup.jpg", "Backoffice design system light and dark colour tokens shown in a Figma browser mockup", "Primitive colour foundations made later semantic themes possible."),
      },
      {
        id: "feedback-loop",
        title: "Product work kept the library honest.",
        paragraphs: [
          "Every real project tested the system. A LogicX interaction might deserve a new reusable pattern; a CoreX workflow might expose a weak foundation; a Magic or DataX constraint might demand a different implementation of the same principle.",
          "The recurring question was whether a solution was a one-off, a pattern, or evidence that an existing component needed to change. That feedback loop mattered more than accumulating components.",
        ],
        media: caseScreenshot("backoffice", "coverage-mockup.jpg", "Backoffice design system coverage shown across component states and product contexts", "One pattern, several product contexts: responsive behaviour is part of the system contract."),
      },
      {
        id: "production",
        title: "Closing the distance between design and code.",
        paragraphs: [
          "Over time, the Figma library and the original code UI kit started to drift. With AI-assisted coding and close iteration, I investigated parts of the production styling myself and helped bring colours, shadows, hover states and component treatments closer to the design source.",
          "DataX presented another constraint: it used Qlik Sense and its own CSS theme, rather than the shared UI kit. I translated the same visual foundations into that environment so it could feel part of the same family without pretending it used the same components.",
        ],
        media: caseScreenshot("backoffice", "library-canvas-mockup.jpg", "Figma Back Office Library canvas showing shared atoms, organisms and templates", "A provisional library capture; production parity is described qualitatively rather than as a measured claim."),
      },
      {
        id: "reflection",
        title: "A design system is not a component library.",
        paragraphs: [
          "Over several years, the work became a more complete shared foundation for designing across the backoffice. It gave designers a reusable source, supported light and dark themes and reduced the need to solve familiar interface problems from scratch.",
          "The impact is cumulative rather than a neat percentage. What stays with me is the judgment required to decide what to share, what to keep specific and how to keep Figma and production connected over time.",
        ],
      },
    ],
    closing: "Consistency is not making everything the same. It is giving different products the same rules.",
    note: "The visuals are provisional Figma captures supplied for the portfolio. Final mockups can replace them later; no adoption or productivity metrics are claimed.",
  },
  {
    slug: "casino-customizer",
    name: "Casino Customizer",
    client: "GiG / WAND",
    discipline: "Interactive prototype / Sales enablement",
    headline: "From sales pitch to live prototype.",
    introduction: "I designed an interactive Figma prototype that let Sales demonstrate a configurable casino experience live, while giving clients a clearer way to explore and communicate their preferences before implementation.",
    role: "Product design and interactive prototyping",
    scope: "Interactive prototyping, visual configuration, sales and onboarding experience",
    collaboration: "Sales, Product and GiG / WAND teams",
    hero: customizerImage("overview.jpg", "Laptop displaying the casino customizer, with controls beside a live casino preview", "The customizer pairs configuration controls with a live product preview."),
    chapters: [
      {
        id: "problem",
        title: "Two slow moments in one journey.",
        paragraphs: [
          "Sales had an incomplete demo carrying an older visual identity, and updating it depended on development capacity. New-client kick-off then required several meetings just to explain available options and collect early configuration decisions.",
          "The shared problem was visibility. People had to imagine a product configuration from a conversation instead of seeing and trying it.",
        ],
      },
      {
        id: "proposition",
        title: "A live demo that could also be an onboarding tool.",
        paragraphs: [
          "The team built an interactive Figma prototype: a control panel beside a live casino preview. Sales could adapt the demo in a meeting or at an event; clients could explore the same options at their own pace and share a preferred direction.",
          "The prototype covered colour, tonal scales, ready-made themes, navigation, product pages, device previews, components and Sportsbook visibility. It made the range of possible experiences tangible without waiting for a coded build.",
        ],
        media: customizerImage("configuration.jpg", "Desktop mockup showing colour, mode, navigation and device controls next to the casino preview", "The main prototype combined choices and their visual consequence in one place."),
      },
      {
        id: "colour",
        title: "From a brand colour to an exact choice.",
        paragraphs: [
          "A client could choose primary, secondary and tertiary colours, then move from a broad hue to a tonal scale with visible hex values. The progressive choice kept a large colour space navigable while making the final decision specific enough to communicate.",
        ],
        media: customizerImage("colour-system.jpg", "Colour control expanding from a primary colour into hue choices and a labelled tonal scale", "Colour selection moved from broad direction to a precise value."),
      },
      {
        id: "themes",
        title: "A starting point, then room to explore.",
        paragraphs: [
          "Curated templates gave clients a ready-made combination of colours and mode. From there, they could test light, dark or hybrid treatments, and compare the result across desktop and mobile instead of judging a palette in isolation.",
        ],
        media: customizerImage("themes.jpg", "Theme list beside a casino preview showing the selected GiG theme", "Templates offered a coherent first configuration without closing off customisation."),
      },
      {
        id: "handoff",
        title: "Send. Explore. Decide.",
        paragraphs: [
          "The prototype could be sent with simple instructions. A client explored the options, captured the configuration they preferred and sent it back. That visual reference gave Product a much clearer starting point for discussing navigation, colours, mode, components and Sportsbook.",
          "Meetings still mattered when advice was needed. The prototype meant they did not have to carry the entire burden of explaining every possibility.",
        ],
        media: customizerImage("devices.jpg", "The same casino configuration displayed on desktop and mobile with mode options beside it", "The same decision could be checked across modes and devices."),
      },
      {
        id: "in-use",
        title: "The prototype left the design file.",
        paragraphs: [
          "The Customizer was used as a live presentation surface, including at an industry event. It also gave clients a self-serve way to understand the product’s configurable range.",
          "This is a qualitative account of the workflow. Time saved and downstream business impact have not been independently measured for this portfolio.",
        ],
        media: customizerImage("event.webp", "GiG stand at an industry event with the casino customizer visible on a demonstration screen", "The prototype shown on a demonstration screen at a GiG event."),
      },
    ],
    closing: "A useful prototype can do more than show an idea. It can help people make the next decision together.",
    note: "The working Figma prototype is not published here. The case uses selected visual material and a qualitative account of the workflow; no time-saved metric is claimed.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
