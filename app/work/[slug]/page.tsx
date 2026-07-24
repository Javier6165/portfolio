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

export default async function ProjectPage({ params }: { params: Params }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <article className={`case case--${project.accent}`}>
      <header className="case-hero shell">
        <div className="case-hero__top js-hero-reveal">
          <p className="eyebrow">Concept case / {project.index}</p>
          <p className="preview-pill">Fictitious preview content</p>
        </div>
        <div className="case-hero__title">
          <p className="js-hero-reveal">{project.name}</p>
          <h1 className="page-display js-hero-reveal">{project.title}</h1>
        </div>
        <p className="case-hero__summary js-hero-reveal">{project.summary}</p>
        <dl className="case-facts js-hero-reveal">
          <div><dt>Context</dt><dd>{project.context}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Status</dt><dd>{project.year}</dd></div>
        </dl>
      </header>

      <section className="case-stage shell js-reveal" aria-label={`${project.name} concept interface`}>
        <ProjectVisual project={project} />
      </section>

      <section className="case-thesis section shell">
        <p className="kicker js-reveal">The core idea</p>
        <blockquote className="js-reveal">{project.thesis}</blockquote>
      </section>

      <section className="case-challenge section shell" aria-labelledby="challenge-title">
        <div className="js-reveal"><p className="kicker">Challenge</p><h2 id="challenge-title">The product exposed complexity without helping people reason through it.</h2></div>
        <p className="js-reveal">{project.challenge}</p>
      </section>

      <section className="case-decisions section shell" aria-labelledby="decisions-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">Selected decisions</p>
          <h2 id="decisions-title">A compact story at two reading speeds.</h2>
          <p>Scan the principles, then go deeper into the rationale. Final cases will add research evidence, flows and real artefacts.</p>
        </header>
        <div className="decision-list">
          {project.decisions.map((decision) => (
            <article className="decision js-reveal" key={decision.label}>
              <p>{decision.label}</p><h3>{decision.title}</h3><p>{decision.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="case-outcomes section shell" aria-labelledby="outcomes-title">
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
