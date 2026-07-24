/* Theme-swapped portraits are pre-compressed local assets; native images keep both variants immediately available. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AIPractice } from "./components/AIPractice";
import { ExperienceSignal } from "./components/ExperienceSignal";
import { LivingFold } from "./components/LivingFold";
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
      <img
        className="portrait portrait--system"
        src={`/images/portraits/${profile ? "hero-system" : "about-system"}.jpg`}
        alt=""
        aria-hidden="true"
        width={profile ? 1800 : 1439}
        height={profile ? 1799 : 1800}
        loading="lazy"
      />
      <img
        className="portrait portrait--human"
        src={`/images/portraits/${profile ? "hero-human" : "about-human"}.jpg`}
        alt=""
        aria-hidden="true"
        width={profile ? 2200 : 1314}
        height={profile ? 1753 : 1800}
        loading="lazy"
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
      <section className="hero hero--fold shell" aria-labelledby="hero-title">
        <div className="hero-fold__visual js-hero-stage">
          <LivingFold />
        </div>

        <div className="hero-fold__identity">
          <p className="hero-fold__name js-hero-reveal">Javier Ortiz</p>
          <h1 id="hero-title" className="hero-fold__title js-hero-reveal">
            <span>Senior Product</span>
            <span>Designer</span>
          </h1>
        </div>

        <Link className="hero-fold__explore js-hero-reveal" href="#experience">
          <span>Explore</span>
          <i aria-hidden="true" />
        </Link>
      </section>

      <section className="experience section shell" id="experience" aria-labelledby="experience-title">
        <div className="profile-intro">
          <Portrait />
          <header className="profile-intro__copy js-reveal">
            <p className="kicker">01 / Profile</p>
            <h2 id="experience-title">From visual worlds to product systems.</h2>
            <p>I’m a Senior Product Designer based in Marbella, working remotely. Across <strong>5+ years at Gaming Innovation Group</strong>, I progressed from Junior to Senior and briefly stepped into Lead—while staying hands-on with complex digital products.</p>
            <p>My edge is combining product judgement with visual craft, AI-assisted workflows and coded prototypes that make difficult behaviour tangible sooner.</p>
            <ul className="profile-intro__facts" aria-label="Javier Ortiz at a glance">
              <li><span>Trajectory</span><strong>Junior → Product → Senior → Lead</strong></li>
              <li><span>Product terrain</span><strong>Rules · CMS · Backoffice · Design systems</strong></li>
              <li><span>Working edge</span><strong>AI-assisted design + coded prototypes</strong></li>
            </ul>
          </header>
        </div>
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
