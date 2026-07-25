/* Theme-swapped portraits are pre-compressed local assets; native images keep both variants immediately available. */
import Link from "next/link";
import { AIPractice } from "./components/AIPractice";
import { EditorIntro } from "./components/live-file/EditorIntro";
import { MemoryConsent } from "./components/live-file/ExperienceSettings";
import { LiveScene } from "./components/live-file/LiveScene";
import { PlaygroundStudy } from "./components/PlaygroundStudy";
import { ProjectCard } from "./components/ProjectCard";
import { ArrowIcon } from "./components/SiteShell";
import { projects } from "./data";

function Portrait({ context = "profile" }: { context?: "profile" | "about" }) {
  const profile = context === "profile";
  return (
    <figure
      className={`${profile ? "profile-intro__portrait" : "about-preview__portrait"} theme-swap`}
      role="img"
      aria-label="Portrait of Javier Ortiz; the photograph changes with the Human or System theme."
    >
      {(["system", "human"] as const).map((theme) => {
        const asset = profile ? `hero-${theme}` : `about-${theme}`;
        return (
          <picture key={theme}>
            <source type="image/avif" srcSet={`/images/portraits/${asset}-960.avif 960w, /images/portraits/${asset}-1440.avif 1440w`} sizes="(max-width: 720px) 100vw, 42vw" />
            <source type="image/webp" srcSet={`/images/portraits/${asset}-960.webp 960w, /images/portraits/${asset}-1440.webp 1440w`} sizes="(max-width: 720px) 100vw, 42vw" />
            <img
              className={`portrait portrait--${theme}`}
              src={`/images/portraits/${asset}.jpg`}
              alt=""
              aria-hidden="true"
              width={theme === "system" ? (profile ? 1800 : 1439) : (profile ? 2200 : 1314)}
              height={theme === "human" && profile ? 1753 : profile ? 1799 : 1800}
              loading="lazy"
            />
          </picture>
        );
      })}
      <figcaption>
        <span className="mode-caption mode-caption--system">SYSTEM / Dark</span>
        <span className="mode-caption mode-caption--human">HUMAN / Light</span>
      </figcaption>
    </figure>
  );
}

const expertise = [
  {
    index: "01",
    label: "Backoffice & product logic",
    title: "I design where rules, permissions and edge cases collide.",
    body: "Experience across a real-time rule engine, proprietary CMS, data products and operational tools where consequence matters as much as configuration.",
    visual: "logic",
  },
  {
    index: "02",
    label: "Systems & scale",
    title: "I turn repeated decisions into shared product language.",
    body: "A backoffice design system, reusable themes and internal knowledge tools that help product teams move together without flattening every context.",
    visual: "states",
  },
  {
    index: "03",
    label: "AI + code",
    title: "I prototype behaviour—not just another polished screen.",
    body: "AI-assisted framing, workshops and vibe-coded prototypes used to test the risky interaction earlier and bring design closer to the working product.",
    visual: "build",
  },
];

export default function Home() {
  return (
    <>
      <EditorIntro />

      <section className="experience section shell" id="experience" aria-labelledby="experience-title">
        <LiveScene
          id="profile-clarify"
          verb="clarify"
          label="Profile / Refined"
          targetSelector=".profile-intro__facts"
          durationMs={1750}
          dwellMs={750}
          comment="Keep the signal. Lose the résumé."
          className="profile-live-scene"
        >
          <div className="profile-intro profile-intro--live-file">
            <header className="profile-intro__headline js-reveal">
              <p className="kicker">01 / In four lines</p>
              <h2 id="experience-title">Complex products. Clear decisions. Working proof.</h2>
            </header>
            <div className="profile-intro__copy js-reveal">
              <ul className="profile-intro__facts" aria-label="Javier Ortiz at a glance">
                <li><span>Level</span><strong>Senior Product Designer · recent Lead responsibility</strong></li>
                <li><span>Experience</span><strong>5+ years at Gaming Innovation Group · Marbella / remote</strong></li>
                <li><span>Product terrain</span><strong>Rule engines · CMS · backoffice · design systems</strong></li>
                <li><span>Working edge</span><strong>AI-assisted design · coded prototypes</strong></li>
              </ul>
            </div>
          </div>
        </LiveScene>
        <MemoryConsent />
      </section>

      <section className="selected-work section shell" id="work" aria-labelledby="work-title">
        <header className="section-heading js-reveal">
          <p className="kicker">02 / Case-study previews</p>
          <h2 id="work-title">Systems I make legible.</h2>
          <p>These concepts preview how real rule engine, design system and AI work will be told. Names, organisations, metrics and outcomes are fictitious.</p>
        </header>
        <div className="project-list">
          {projects.map((project, index) => index === 0 ? (
            <LiveScene
              id="work-frame"
              verb="frame"
              label="Case 01 / Live"
              targetSelector=".project-card__media"
              durationMs={2300}
              dwellMs={650}
              autoVisitTier={2}
              comment="Show the decision, not the decoration."
              className="work-live-scene"
              key={project.slug}
            >
              <ProjectCard project={project} />
            </LiveScene>
          ) : <ProjectCard project={project} key={project.slug} />)}
        </div>
      </section>

      <section className="expertise section shell" id="approach" aria-labelledby="expertise-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">03 / What I actually do</p>
          <h2 id="expertise-title">Deep in the system. Close to the interface.</h2>
          <p>I work best where dense product logic, interaction quality and the way teams build need to become one coherent experience.</p>
        </header>
        <LiveScene
          id="expertise-propagate"
          verb="propagate"
          label="1 change → 3 surfaces"
          targetSelector=".expertise-live-token"
          durationMs={1650}
          dwellMs={650}
          className="expertise-live-scene"
        >
          <div className="expertise-live-token" aria-hidden="true"><span>Decision model</span><b>Local</b><i /><strong>Shared</strong></div>
          <div className="expertise-grid">
            {expertise.map((item) => (
              <article className={`expertise-card expertise-card--${item.visual} js-reveal`} key={item.index}>
                <div className="expertise-card__meta"><span>{item.index}</span><span>{item.label}</span></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <div className="expertise-artifact" aria-hidden="true"><i /><i /><i /><b /><span /></div>
              </article>
            ))}
          </div>
        </LiveScene>
      </section>

      <section className="ai-practice section shell" id="ai-practice" aria-labelledby="ai-title">
        <div className="ai-practice__copy js-reveal">
          <p className="kicker">04 / AI-assisted product design</p>
          <h2 id="ai-title">From ambiguity to working behaviour, faster.</h2>
          <p>I use AI to structure context, challenge assumptions, explore constrained options and build functional prototypes. It accelerates the feedback loop; product judgement and accountability stay human.</p>
          <Link className="text-link" href="/playground">See experiments <ArrowIcon /></Link>
        </div>
        <LiveScene
          id="ai-activate"
          verb="activate"
          label="Prototype / Live"
          targetSelector=".ai-practice__panel"
          durationMs={2700}
          dwellMs={750}
          autoVisitTier={2}
          comment="Screens explain it. Behaviour proves it."
          className="ai-practice__narrative"
        >
          <AIPractice />
        </LiveScene>
      </section>

      <section className="playground-preview section shell" aria-labelledby="playground-title">
        <LiveScene
          id="playground-experiment"
          verb="experiment"
          label="Experiment / Played"
          targetSelector=".playground-playhead"
          durationMs={1700}
          dwellMs={600}
          className="playground-live-scene"
        >
          <PlaygroundStudy />
        </LiveScene>
        <div className="playground-preview__copy js-reveal">
          <p className="kicker">05 / Playground</p>
          <h2 id="playground-title">The fastest way to understand an idea is to make it move.</h2>
          <p>Prototypes, motion studies and small pieces of software—where visual curiosity becomes product evidence.</p>
          <Link className="text-link" href="/playground">Enter the playground <ArrowIcon /></Link>
        </div>
      </section>

      <section className="about-preview section shell" aria-labelledby="about-preview-title">
        <LiveScene
          id="about-reframe"
          verb="reframe"
          label="Crop / Approved"
          targetSelector=".about-preview__portrait"
          durationMs={1400}
          dwellMs={600}
          className="about-live-scene"
        >
          <Portrait context="about" />
        </LiveScene>
        <div className="about-preview__copy js-reveal">
          <p className="kicker">06 / The person in the system</p>
          <h2 id="about-preview-title">Hands-on by nature. Lead when the work needs it.</h2>
          <p>I’m Javier, a Senior Product Designer based in Marbella. My path crosses product strategy, complex platforms, design systems, visual craft and AI-assisted ways of working.</p>
          <p>I have recent lead experience, while staying close to the details where product quality is actually made.</p>
          <Link className="text-link" href="/about">Read the full story <ArrowIcon /></Link>
        </div>
      </section>
    </>
  );
}
