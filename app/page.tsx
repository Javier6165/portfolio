/* Theme-swapped portraits are pre-compressed local assets; native images keep both variants immediately available. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AIPractice } from "./components/AIPractice";
import { ComplexityEngine } from "./components/ComplexityEngine";
import { ExperienceSignal } from "./components/ExperienceSignal";
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
      <section className="hero hero--v2 shell" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow js-hero-reveal">Javier Ortiz · Senior Product Designer · Marbella / Remote</p>
          <h1 id="hero-title" className="display js-hero-reveal">
            I design complex platforms <span className="display__signal">people can understand.</span>
          </h1>
          <p className="hero__intro js-hero-reveal">
            <span>Over <strong>5+ years at Gaming Innovation Group</strong>, I grew from Junior to Lead while designing complex backoffice products—a real-time rules engine, proprietary CMS, design system and internal knowledge tools.</span>
            <span>Today I work hands-on, using <strong>AI and code to turn ambiguity into working product faster.</strong></span>
          </p>
          <div className="hero__actions js-hero-reveal">
            <Link className="button button--primary" href="#work">Explore case previews <ArrowIcon /></Link>
            <Link className="button button--quiet" href="#experience">See how I got here</Link>
          </div>
        </div>

        <div className="hero__stage js-hero-stage">
          <Portrait />
          <ComplexityEngine />
        </div>

        <ul className="hero__proof js-hero-reveal" aria-label="Javier Ortiz at a glance">
          <li><span>Role</span><strong>Senior Product Designer</strong><small>Recent Lead experience</small></li>
          <li><span>Product terrain</span><strong>Complex B2B systems</strong><small>Rules · CMS · Backoffice</small></li>
          <li><span>Track record</span><strong>5+ years at GiG</strong><small>Junior → Product → Senior → Lead</small></li>
          <li><span>Edge</span><strong>AI + coded prototypes</strong><small>Visual design & games background</small></li>
        </ul>
      </section>

      <section className="experience section shell" id="experience" aria-labelledby="experience-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">01 / How I got here</p>
          <h2 id="experience-title">From visual worlds to product systems.</h2>
          <p>A multidisciplinary path explains why I move comfortably between visual craft, interaction behaviour, system logic and team direction.</p>
        </header>
        <ExperienceSignal />
      </section>

      <section className="selected-work section shell" id="work" aria-labelledby="work-title">
        <header className="section-heading js-reveal">
          <p className="kicker">02 / Case-study previews</p>
          <h2 id="work-title">Systems I make legible.</h2>
          <p>These concepts preview how real rule engine, design system and AI work will be told. Names, organisations, metrics and outcomes are fictitious.</p>
        </header>
        <div className="project-list">
          {projects.map((project) => <ProjectCard project={project} key={project.slug} />)}
        </div>
      </section>

      <section className="expertise section shell" id="approach" aria-labelledby="expertise-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">03 / What I actually do</p>
          <h2 id="expertise-title">Deep in the system. Close to the interface.</h2>
          <p>I work best where dense product logic, interaction quality and the way teams build need to become one coherent experience.</p>
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
          <p className="kicker">04 / AI-assisted product design</p>
          <h2 id="ai-title">From ambiguity to working behaviour, faster.</h2>
          <p>I use AI to structure context, challenge assumptions, explore constrained options and build functional prototypes. It accelerates the feedback loop; product judgement and accountability stay human.</p>
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
          <p className="kicker">05 / Playground</p>
          <h2 id="playground-title">The fastest way to understand an idea is to make it move.</h2>
          <p>Prototypes, motion studies and small pieces of software—where visual curiosity becomes product evidence.</p>
          <Link className="text-link" href="/playground">Enter the playground <ArrowIcon /></Link>
        </div>
      </section>

      <section className="about-preview section shell" aria-labelledby="about-preview-title">
        <Portrait context="about" />
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
