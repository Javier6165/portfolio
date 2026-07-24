/* Theme-swapped portraits are pre-compressed local assets; native images keep both variants immediately available. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowIcon } from "./components/SiteShell";
import { ProjectVisual } from "./components/ProjectVisual";
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

export default function Home() {
  return (
    <>
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow js-hero-reveal">Senior Product Designer · Marbella / Remote</p>
          <h1 id="hero-title" className="display js-hero-reveal">
            I design the <span className="display__quiet">calm</span> inside complex products.
          </h1>
          <p className="hero__intro js-hero-reveal">
            I turn dense platforms, design systems and AI-assisted workflows into clear experiences people can understand—and teams can scale.
          </p>
          <div className="hero__actions js-hero-reveal">
            <Link className="button button--primary" href="#work">See selected work <ArrowIcon /></Link>
            <Link className="button button--quiet" href="/about">About me</Link>
          </div>
        </div>
        <Portrait />
        <aside className="hero__status js-hero-reveal" aria-label="Current role">
          <span className="status-dot" />
          <p><strong>Currently</strong> Lead Product Designer at Gaming Innovation Group</p>
        </aside>
        <p className="hero__scroll js-hero-reveal" aria-hidden="true"><span /> Scroll to trace the system</p>
      </section>

      <section className="selected-work section shell" id="work" aria-labelledby="work-title">
        <header className="section-heading js-reveal">
          <p className="kicker">01 / Selected work</p>
          <h2 id="work-title">Three ways to make complexity legible.</h2>
          <p>Concept case studies for layout preview. Names, organisations, metrics and outcomes are fictitious.</p>
        </header>
        <div className="project-list">
          {projects.map((project) => (
            <Link className={`project-card project-card--${project.accent} js-reveal`} href={`/work/${project.slug}`} key={project.slug}>
              <div className="project-card__meta">
                <span>{project.index}</span><span>Concept case</span><span>{project.year}</span>
              </div>
              <div className="project-card__copy">
                <p>{project.name}</p>
                <h3>{project.title}</h3>
                <p className="project-card__summary">{project.summary}</p>
                <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </div>
              <ProjectVisual project={project} />
              <span className="project-card__cta">Open case study <ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="throughline section shell" aria-labelledby="throughline-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">02 / Throughline</p>
          <h2 id="throughline-title">The role changed. The question stayed the same.</h2>
          <p>How can the product—and the team around it—make better decisions with less friction?</p>
        </header>
        <div className="throughline__body">
          <div className="throughline__line" aria-hidden="true"><span className="throughline__progress" /></div>
          <ol>
            <li className="js-reveal"><span>01</span><p>Junior Product Designer</p><strong>Learn the system</strong><small>Turn curiosity into useful questions.</small></li>
            <li className="js-reveal"><span>02</span><p>Product Designer</p><strong>Shape the system</strong><small>Connect journeys, rules and edge cases.</small></li>
            <li className="js-reveal"><span>03</span><p>Senior Product Designer</p><strong>Scale the system</strong><small>Create clarity across products and teams.</small></li>
            <li className="js-reveal"><span>04</span><p>Lead Product Designer</p><strong>Enable the system</strong><small>Align direction, craft and delivery.</small></li>
          </ol>
        </div>
        <div className="throughline__note js-reveal"><span>5+ years</span><p>Growing inside complex platform work—from hands-on interaction design to recent lead responsibility.</p></div>
      </section>

      <section className="approach section shell" id="approach" aria-labelledby="approach-title">
        <header className="section-heading js-reveal">
          <p className="kicker">03 / How I work</p>
          <h2 id="approach-title">Clarity is not a final polish. It is the way through.</h2>
        </header>
        <ol className="approach-grid">
          <li className="js-reveal"><span>01</span><div><p>Frame</p><h3>Find the decision beneath the request.</h3><small>I map the actors, constraints and cost of being wrong before drawing the happy path.</small></div></li>
          <li className="js-reveal"><span>02</span><div><p>Shape</p><h3>Make complexity tangible together.</h3><small>Prototypes and workshops create a shared object for product, design and engineering to challenge.</small></div></li>
          <li className="js-reveal"><span>03</span><div><p>Ship</p><h3>Leave a stronger system behind.</h3><small>The work is not complete until the pattern, rationale and operating model can outlive the project.</small></div></li>
        </ol>
      </section>

      <section className="playground-preview section shell" aria-labelledby="playground-title">
        <div className="playground-preview__canvas js-reveal" aria-hidden="true">
          <div className="kinetic-type"><span>MAKE</span><span>IT</span><span>CLEAR</span></div>
          <div className="cursor-orbit"><i /><i /><i /></div>
          <div className="lab-tag">LAB / 001—003</div>
        </div>
        <div className="playground-preview__copy js-reveal">
          <p className="kicker">04 / Playground</p>
          <h2 id="playground-title">Craft needs somewhere to misbehave.</h2>
          <p>Small experiments in motion, interface behaviour, 3D and visual systems—kept away from critical product flows until they earn their place.</p>
          <Link className="text-link" href="/playground">Enter the playground <ArrowIcon /></Link>
        </div>
      </section>

      <section className="about-preview section shell" aria-labelledby="about-preview-title">
        <Portrait context="about" />
        <div className="about-preview__copy js-reveal">
          <p className="kicker">05 / The person in the system</p>
          <h2 id="about-preview-title">Hands-on by nature. Lead when the work needs it.</h2>
          <p>I’m Javier, a Senior Product Designer based in Marbella. My path crosses product strategy, complex platforms, design systems, visual craft and AI-assisted ways of working.</p>
          <p>I have recently stepped into lead responsibility, while staying close to the details where product quality is actually made.</p>
          <Link className="text-link" href="/about">Read the full story <ArrowIcon /></Link>
        </div>
      </section>
    </>
  );
}
