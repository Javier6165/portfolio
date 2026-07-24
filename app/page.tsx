/* Theme-swapped portraits are pre-compressed local assets; native images keep both variants immediately available. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AIPractice } from "./components/AIPractice";
import { ComplexityEngine } from "./components/ComplexityEngine";
import { ProjectCard } from "./components/ProjectCard";
import { ArrowIcon } from "./components/SiteShell";
import { projects } from "./data";

function Portrait({ context = "hero" }: { context?: "hero" | "about" }) {
  const hero = context === "hero";
  return (
    <figure
      className={`${hero ? "hero-portrait" : "about-preview__portrait"} theme-swap`}
      role="img"
      aria-label="Portrait of Javier Ortiz; the photograph changes with the Human or System theme."
    >
      <img
        className="portrait portrait--system"
        src={`/images/portraits/${hero ? "hero-system" : "about-system"}.jpg`}
        alt=""
        aria-hidden="true"
        width={hero ? 1800 : 1439}
        height={hero ? 1799 : 1800}
        fetchPriority={hero ? "high" : undefined}
        loading={hero ? "eager" : "lazy"}
      />
      <img
        className="portrait portrait--human"
        src={`/images/portraits/${hero ? "hero-human" : "about-human"}.jpg`}
        alt=""
        aria-hidden="true"
        width={hero ? 2200 : 1314}
        height={hero ? 1753 : 1800}
        loading={hero ? "eager" : "lazy"}
      />
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
    label: "Operational complexity",
    title: "I turn rules and edge cases into confident decisions.",
    body: "Rule engines, CMSs and backoffice tools where one small change can travel across an entire system.",
    visual: "logic",
  },
  {
    index: "02",
    label: "Interactive craft",
    title: "I make the interaction explain the product.",
    body: "Prototypes, motion and visual systems that reveal hierarchy, consequence and state without adding noise.",
    visual: "states",
  },
  {
    index: "03",
    label: "AI + code",
    title: "I close the gap between the idea and the working thing.",
    body: "AI-assisted exploration and vibe-coded prototypes used to test the hard part, not to decorate the easy part.",
    visual: "build",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero hero--v2 shell" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow js-hero-reveal">Senior Product Designer · Marbella / Remote</p>
          <h1 id="hero-title" className="display js-hero-reveal">
            I design the systems <span className="display__signal">behind the screen.</span>
          </h1>
          <p className="hero__intro js-hero-reveal">
            Rule engines, CMSs, multi-product platforms and player experiences—made clear, testable and ready to scale. I use AI and code to prototype what comes next.
          </p>
          <div className="hero__actions js-hero-reveal">
            <Link className="button button--primary" href="#work">See selected work <ArrowIcon /></Link>
            <Link className="button button--quiet" href="#ai-practice">How I design with AI</Link>
          </div>
        </div>

        <div className="hero__stage js-hero-stage">
          <Portrait />
          <ComplexityEngine />
        </div>

        <ul className="hero__proof js-hero-reveal" aria-label="Areas of practice">
          <li><span>01</span> Complex operations</li>
          <li><span>02</span> AI-assisted prototyping</li>
          <li><span>03</span> Recent lead experience</li>
        </ul>
      </section>

      <section className="selected-work section shell" id="work" aria-labelledby="work-title">
        <header className="section-heading js-reveal">
          <p className="kicker">01 / Selected work</p>
          <h2 id="work-title">Systems I make legible.</h2>
          <p>Concept case studies for layout preview. Names, organisations, metrics and outcomes are fictitious.</p>
        </header>
        <div className="project-list">
          {projects.map((project) => <ProjectCard project={project} key={project.slug} />)}
        </div>
      </section>

      <section className="expertise section shell" id="approach" aria-labelledby="expertise-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">02 / What I do unusually well</p>
          <h2 id="expertise-title">The hard part is where I start.</h2>
          <p>I work best where system logic, interaction quality and new technology need to become one coherent product.</p>
        </header>
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
      </section>

      <section className="ai-practice section shell" id="ai-practice" aria-labelledby="ai-title">
        <div className="ai-practice__copy js-reveal">
          <p className="kicker">03 / Designing with AI</p>
          <h2 id="ai-title">AI is not the feature. Leverage is.</h2>
          <p>I use AI to frame faster, explore wider and turn decisions into working prototypes. The judgement stays human; the feedback loop gets dramatically shorter.</p>
          <Link className="text-link" href="/playground">See experiments <ArrowIcon /></Link>
        </div>
        <AIPractice />
      </section>

      <section className="playground-preview section shell" aria-labelledby="playground-title">
        <div className="playground-preview__canvas js-reveal" aria-hidden="true">
          <div className="kinetic-type"><span>MAKE</span><span>IT</span><span>REAL</span></div>
          <div className="cursor-orbit"><i /><i /><i /></div>
          <div className="lab-tag">LAB / 001—003</div>
        </div>
        <div className="playground-preview__copy js-reveal">
          <p className="kicker">04 / Playground</p>
          <h2 id="playground-title">The fastest way to understand an idea is to make it move.</h2>
          <p>Prototypes, motion studies and small pieces of software—where visual curiosity becomes product evidence.</p>
          <Link className="text-link" href="/playground">Enter the playground <ArrowIcon /></Link>
        </div>
      </section>

      <section className="about-preview section shell" aria-labelledby="about-preview-title">
        <Portrait context="about" />
        <div className="about-preview__copy js-reveal">
          <p className="kicker">05 / The person in the system</p>
          <h2 id="about-preview-title">Hands-on by nature. Lead when the work needs it.</h2>
          <p>I’m Javier, a Senior Product Designer based in Marbella. My path crosses product strategy, complex platforms, design systems, visual craft and AI-assisted ways of working.</p>
          <p>I have recent lead experience, while staying close to the details where product quality is actually made.</p>
          <Link className="text-link" href="/about">Read the full story <ArrowIcon /></Link>
        </div>
      </section>
    </>
  );
}
