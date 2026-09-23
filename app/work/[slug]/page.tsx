import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components/SiteShell";
import { caseStudies, getCaseStudy, type CaseMedia } from "../../caseStudies";
import styles from "./CaseStudy.module.css";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return {
    title: `${study.name} | Case study`,
    description: study.headline,
    robots: { index: false, follow: false },
  };
}

function Media({ media, hero = false }: { media: CaseMedia; hero?: boolean }) {
  if (media.kind === "placeholder") {
    return (
      <figure className={`${styles.media} ${styles.placeholder} ${media.aspect === "square" ? styles.square : ""}`}>
        <div className={styles.placeholderSurface} role="img" aria-label={media.label}>
          <span>Visual evidence pending</span>
          <strong>{media.label}</strong>
        </div>
        <figcaption>Image placeholder. Final product material will replace this panel.</figcaption>
      </figure>
    );
  }

  return (
    <figure className={`${styles.media} ${media.aspect === "square" ? styles.square : ""} ${media.presentation === "screenshot" ? styles.screenshot : ""} ${media.presentation === "composition" ? styles.composition : ""}`}>
      <div className={styles.imageSurface}>
        {/* Pre-optimized local project media; no remote image service is required. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.src} alt={media.alt} width="2100" height="1185" loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} />
        {/* Local, optimized companion capture in the editorial composition. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {media.companion && <img className={styles.companion} src={media.companion.src} alt={media.companion.alt} width="2100" height="1185" loading="lazy" />}
      </div>
      <figcaption>{media.caption}</figcaption>
    </figure>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug);
  const next = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <article className="ordered-case">
      <div className={styles.casePage}>
        <header className={`shell ${styles.hero}`}>
          <div className={styles.heroPrelude}>
            <Link href="/#work" className={styles.backLink}><span aria-hidden="true">←</span> Selected work</Link>
            <p>{study.client} <span aria-hidden="true">/</span> {study.discipline}</p>
          </div>
          <div className={styles.heroGrid} data-case-hero>
            <div className={styles.heroIdentity}>
              <p className={styles.projectName}>{study.name}</p>
              <h1>{study.headline}</h1>
            </div>
            <p className={styles.introduction}>{study.introduction}</p>
          </div>
          <div className={styles.heroEvidence} data-case-evidence>
            <Media media={study.hero} hero />
            <dl className={styles.facts}>
              <div><dt>Role</dt><dd>{study.role}</dd></div>
              <div><dt>Scope</dt><dd>{study.scope}</dd></div>
              <div><dt>With</dt><dd>{study.collaboration}</dd></div>
            </dl>
          </div>
        </header>

        <nav className={`shell ${styles.chapterNav}`} aria-label="On this case study">
          <span>Explore the case</span>
          <ol>{study.chapters.map((chapter, index) => <li key={chapter.id}><a href={`#${chapter.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{chapter.id.replaceAll("-", " ")}</a></li>)}</ol>
        </nav>

        {study.chapters.map((chapter, index) => (
          <section className={`shell ${styles.chapter}`} id={chapter.id} aria-labelledby={`${chapter.id}-title`} key={chapter.id} data-case-chapter>
            <div className={styles.chapterHead}>
              <span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span>
              <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
            </div>
            <div className={styles.chapterBody} data-case-copy>
              {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {chapter.points && <ul className={styles.points}>{chapter.points.map((point) => <li key={point}>{point}</li>)}</ul>}
            </div>
            {chapter.emphasis && <blockquote className={styles.emphasis}>{chapter.emphasis}</blockquote>}
            {chapter.media && <div className={styles.chapterMedia} data-case-media><Media media={chapter.media} /></div>}
          </section>
        ))}

        <div className={`shell ${styles.caseEnd}`}>
          <p>{study.closing}</p>
          {study.note && <small>{study.note}</small>}
        </div>

        <nav className={`shell ${styles.nextCase}`} aria-label="Case study navigation">
          <Link href="/#work">All selected work <ArrowIcon /></Link>
          <Link href={`/work/${next.slug}`}><span>Next case study</span><strong>{next.name}</strong><ArrowIcon /></Link>
        </nav>
      </div>
    </article>
  );
}
