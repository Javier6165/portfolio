import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components/SiteShell";
import { ProjectVisual } from "../../components/ProjectVisual";
import { getProject, projects } from "../../data";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `${project.name} — ${project.title}`, description: project.summary };
}

function DecisionArtifact({ slug, index }: { slug: string; index: number }) {
  return (
    <div className={`decision-artifact decision-artifact--${slug} decision-artifact--${index + 1}`} aria-hidden="true">
      <div className="decision-artifact__bar"><i /><span>PROTOTYPE / 0{index + 1}</span><b>● LIVE</b></div>
      <div className="decision-artifact__canvas">
        <div className="decision-artifact__rail"><i /><i /><i /><i /></div>
        <div className="decision-artifact__flow">
          <span /><span /><span /><span />
          <strong>{index === 0 ? "DECISION" : index === 1 ? "DEPENDENCY" : "REVIEW"}</strong>
        </div>
        <div className="decision-artifact__panel"><small>STATE</small><i /><i /><i /></div>
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <article className={`case case--${project.accent}`}>
      <header className="case-hero case-hero--v2 shell" id="overview">
        <div className="case-hero__top js-hero-reveal">
          <p className="eyebrow">Concept case / {project.index}</p>
          <p className="preview-pill">Fictitious preview content</p>
        </div>
        <div className="case-hero__title">
          <p className="js-hero-reveal">{project.name} / {project.surface}</p>
          <h1 className="page-display js-hero-reveal">{project.title}</h1>
          <p className="case-hero__summary js-hero-reveal">{project.summary}</p>
        </div>
        <div className="case-hero__visual js-hero-reveal">
          <ProjectVisual project={project} compact />
          <span>{project.artifactLabel}</span>
        </div>
        <dl className="case-facts js-hero-reveal">
          <div><dt>Context</dt><dd>{project.context}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Proof format</dt><dd>{project.proof}</dd></div>
        </dl>
      </header>

      <nav className="case-index shell" aria-label="On this case study">
        <span>{project.name} / Case index</span>
        <div><Link href="#overview">Overview</Link><Link href="#decisions">Decisions</Link><Link href="#outcomes">Outcomes</Link></div>
      </nav>

      <section className="case-thesis section shell">
        <p className="kicker js-reveal">The core idea</p>
        <blockquote className="js-reveal">{project.thesis}</blockquote>
      </section>

      <section className="case-challenge section shell" aria-labelledby="challenge-title">
        <div className="js-reveal"><p className="kicker">Challenge</p><h2 id="challenge-title">{project.challengeTitle}</h2></div>
        <p className="js-reveal">{project.challenge}</p>
      </section>

      <section className="case-decisions section shell" id="decisions" aria-labelledby="decisions-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">Selected decisions</p>
          <h2 id="decisions-title">Show the reasoning. Then show the thing.</h2>
          <p>Placeholder artefacts model the rhythm future cases will use for annotated Figma screens, prototypes and working demos.</p>
        </header>
        <div className="decision-list decision-list--v2">
          {project.decisions.map((decision, index) => (
            <article className="decision-module js-reveal" key={decision.label}>
              <div className="decision-module__copy">
                <p>{decision.label}</p><h3>{decision.title}</h3><p>{decision.body}</p>
              </div>
              <DecisionArtifact slug={project.slug} index={index} />
            </article>
          ))}
        </div>
      </section>

      <section className="case-outcomes section shell" id="outcomes" aria-labelledby="outcomes-title">
        <header className="js-reveal"><p className="kicker">Outcome preview</p><h2 id="outcomes-title">What success could look like.</h2><p>Illustrative metrics only. They will never be presented as real project results.</p></header>
        <div className="outcome-grid">
          {project.outcomes.map((outcome) => <div className="js-reveal" key={outcome.label}><strong>{outcome.value}</strong><p>{outcome.label}</p></div>)}
        </div>
      </section>

      <nav className="next-case shell" aria-label="Case study navigation">
        <Link href="/#work" className="text-link text-link--back"><ArrowIcon /> All work</Link>
        <Link className="next-case__link" href={`/work/${next.slug}`}>
          <span>Next concept case / {next.index}</span><strong>{next.name} — {next.title}</strong><ArrowIcon />
        </Link>
      </nav>
    </article>
  );
}
