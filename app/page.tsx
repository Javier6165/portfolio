import Link from "next/link";
import { Hero } from "./components/Hero";
import { ArrowIcon } from "./components/SiteShell";
import { Testimonials } from "./components/Testimonials";
import styles from "./HomePage.module.css";

const questions = [
  { question: "How do you approach a complex product problem?", answer: [
    "I start by making the problem smaller and clearer: understanding the users, the business context, the technical constraints and what we actually know.",
    "From there, I explore flows and interactions, prototype when it helps us learn faster, and work closely with Product and Engineering through implementation.",
    "I don’t follow a fixed process. I use the level of research, exploration and fidelity the problem needs.",
  ] },
  { question: "How do you make trade-offs?", answer: [
    "I try to find the best balance between user needs, business goals and what is technically realistic.",
    "That means understanding why each constraint exists, making the options visible and being clear about what we gain or lose with each decision.",
    "I’d rather make a conscious compromise than design an ideal solution that cannot ship.",
  ] },
  { question: "How do you know if a design is working?", answer: [
    "It depends on the evidence available.",
    "I use user and stakeholder feedback, usability findings, product behaviour and metrics when they are available, then keep learning after implementation.",
    "I care about whether the product became easier and more effective to use — not just whether the final UI looks better.",
  ] },
  { question: "How do you help a design team get better?", answer: [
    "My Lead experience changed how I think about my role in a team.",
    "I’m still very hands-on, but I also enjoy giving feedback, mentoring designers, improving shared patterns and design systems, and helping maintain a consistent quality bar.",
    "I don’t need a Lead title to contribute at that level.",
  ] },
  { question: "What are you looking for next?", answer: [
    "A hands-on Senior Product Designer role where I can own complex product problems from definition to delivery and stay close to the craft.",
    "I’m especially interested in B2B products, complex platforms and teams where Design works closely with Product and Engineering.",
    "My Lead experience is something I bring with me — not a requirement for my next title.",
  ] },
] as const;

function AboutPortrait() {
  return (
    <figure className={styles.aboutPortrait} role="img" aria-label="Portrait of Javier Ortiz.">
      <picture>
        <source type="image/avif" srcSet="/images/portraits/about-editorial-960.avif 960w, /images/portraits/about-editorial-1440.avif 1440w" sizes="(max-width: 720px) 100vw, 42vw" />
        <source type="image/webp" srcSet="/images/portraits/about-editorial-960.webp 960w, /images/portraits/about-editorial-1440.webp 1440w" sizes="(max-width: 720px) 100vw, 42vw" />
        <img className="portrait" src="/images/portraits/about-editorial.jpg" alt="" aria-hidden="true" width="1440" height="1800" loading="lazy" />
      </picture>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="ordered-home">
      <Hero />

      <section className={`section shell ${styles.snapshot}`} id="experience" aria-label="Javier Ortiz at a glance">
        <ul className={styles.snapshotFacts} aria-label="Javier Ortiz at a glance" data-home-entry="facts">
          <li><span>Experience</span><strong>5+ years</strong><small>in Product Design</small></li>
          <li><span>Progression</span><strong>Junior → Lead at GiG</strong><small>3 promotions in 5 years</small></li>
          <li><span>Product scope</span><strong>B2B platforms &amp; systems</strong><small>Rules engines · CMS · Data · Design systems</small></li>
          <li><span>Working edge</span><strong>AI + coded prototypes</strong><small>From screen to behaviour</small></li>
        </ul>
      </section>

      <section className={`section shell ${styles.work}`} id="work" aria-labelledby="work-title">
        <header className={styles.sectionHeading}>
          <h2 id="work-title">Selected work</h2>
          <p>Real product work at GiG. The case studies are being prepared; outcomes and ownership will be added only after review.</p>
        </header>
        <div className={styles.caseList}>
          <article className={`${styles.casePreview} ${styles.caseLead}`}>
            <div className={styles.caseCopy}>
              <span>LogicX / Rules engine</span>
              <h3>Making complex rules easier to work with.</h3>
              <p>Case study in preparation. The final story will show the workflows, dependencies and Javier’s specific contribution.</p>
              <small>GiG / Case details pending review</small>
            </div>
            <div className={styles.caseVisual} aria-hidden="true"><span>LOGIC<span className={styles.caseVisualX}>X</span></span><i /></div>
          </article>
          <article className={`${styles.casePreview} ${styles.caseSecondary}`}>
            <div className={styles.systemVisual} aria-hidden="true"><span>Aa</span><div><i /><i /><i /><i /><i /><i /></div><small>Visual study / 02</small></div>
            <span>Backoffice Design System</span>
            <h3>A shared system for backoffice products.</h3>
            <p>Case study in preparation. The final story will explain the system, its scope and Javier’s specific role.</p>
            <small>GiG / Case details pending review</small>
          </article>
          <div className={`${styles.casePreview} ${styles.caseTertiary}`}>
            <div className={styles.thirdVisual} aria-hidden="true"><span>03</span><small>Visual study / Open selection</small></div>
            <span>To be selected</span>
            <h3>A third perspective on the work.</h3>
            <p>The final project will be selected from real work to add a different dimension to the first two cases.</p>
          </div>
        </div>
      </section>

      <section className={`section shell ${styles.about}`} id="about-preview" aria-labelledby="about-title">
        <div className={styles.aboutSpread} data-home-entry="split">
          <AboutPortrait />
          <div className={styles.aboutCopy}>
            <h2 id="about-title">From graphic design and games to Product Design — and Lead.</h2>
            <p>I grew from Junior to Lead at GiG while staying hands-on with the work. That mix of craft, systems thinking and team responsibility shapes how I design today.</p>
            <Link className="text-link" href="/about">Read the full story <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className={`section shell ${styles.lab}`} id="lab" aria-labelledby="lab-title">
        <header className={styles.sectionHeading}>
          <h2 id="lab-title">Lab</h2>
          <p>Small experiments in design, code and AI. A place to show what I tried, what worked and what I learned.</p>
        </header>
        <article className={styles.labPreview} aria-labelledby="lab-preview-title">
          <div className={styles.labPreviewVisual} aria-hidden="true">
            <div className={styles.labPreviewDiagram}>
              <div className={styles.labStudy}><span>Question.</span><svg viewBox="0 0 280 200" fill="none"><path d="M30 160V40h220M30 100h220M85 40v120M140 40v120M195 40v120M250 40v120" stroke="currentColor" opacity=".2" /><path d="M30 150C80 150 65 65 120 65S170 135 210 95s25-55 40-55" stroke="currentColor" strokeWidth="2" /></svg></div>
              <div className={styles.labStudy}><span>Prototype.</span><div className={styles.typeStudy}>Aa<span>↗</span></div></div>
              <div className={styles.labStudy}><span>Learning.</span><div className={styles.scaleStudy}><i /><i /><i /><i /><i /></div></div>
            </div>
          </div>
          <div className={styles.labPreviewCopy}>
            <p className={styles.labPreviewEyebrow}>A preview of the format</p>
            <h3 id="lab-preview-title">Ideas worth making tangible.</h3>
            <p>Not another row of polished mockups. Each future entry will pair a working experiment with the question behind it and an honest account of what it taught me.</p>
            <p className={styles.labPreviewNote}>The first documented experiments are being selected. This preview shows the space they’ll occupy; it isn’t a finished project.</p>
          </div>
        </article>
      </section>

      <section className={`section shell ${styles.faq}`} id="how-i-work" aria-labelledby="how-i-work-title">
        <header className={styles.sectionHeading}>
          <h2 id="how-i-work-title">How I work</h2>
          <p>Five practical questions about the work, the team and what I’m looking for next.</p>
        </header>
        <div className={styles.questionList}>
          {questions.map(({ question, answer }, index) => (
            <details className={styles.question} key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span><h3>{question}</h3><i aria-hidden="true" /></summary>
              <div className={styles.answer}>{answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
