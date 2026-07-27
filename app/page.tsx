import Link from "next/link";
import { AIPractice } from "./components/AIPractice";
import { EditorIntro } from "./components/live-file/EditorIntro";
import { MemoryConsent } from "./components/live-file/ExperienceSettings";
import { LiveScene } from "./components/live-file/LiveScene";
import { PlaygroundStudy } from "./components/PlaygroundStudy";
import { ProductPractice } from "./components/ProductPractice";
import { ProjectCard } from "./components/ProjectCard";
import { ArrowIcon } from "./components/SiteShell";
import { Testimonials } from "./components/Testimonials";
import { projects } from "./data";
import styles from "./HomePage.module.css";

function AboutPortrait() {
  return (
    <figure className={`${styles.aboutPortrait} theme-swap`} role="img" aria-label="Portrait of Javier Ortiz; the photograph changes with the selected theme.">
      {(["system", "human"] as const).map((theme) => (
        <picture key={theme}>
          <source type="image/avif" srcSet={`/images/portraits/about-${theme}-960.avif 960w, /images/portraits/about-${theme}-1440.avif 1440w`} sizes="(max-width: 720px) 100vw, 58vw" />
          <source type="image/webp" srcSet={`/images/portraits/about-${theme}-960.webp 960w, /images/portraits/about-${theme}-1440.webp 1440w`} sizes="(max-width: 720px) 100vw, 58vw" />
          <img className={`portrait portrait--${theme}`} src={`/images/portraits/about-${theme}.jpg`} alt="" aria-hidden="true" width={theme === "system" ? 1439 : 1314} height="1800" loading="lazy" />
        </picture>
      ))}
      <figcaption aria-hidden="true"><span>PORTRAIT / 02</span><b>Y 48%</b></figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <EditorIntro />

      <section className={`section shell ${styles.snapshot}`} id="experience" aria-labelledby="snapshot-title">
        <LiveScene
          id="snapshot-clarify"
          verb="clarify"
          label="Profile / Refined"
          targetSelector={`.${styles.snapshotFacts}`}
          tool="layout"
          action="Clarifying the signal"
          properties={["Split into 4", "Text 10 → 18", "Gap 0 → 24"]}
          readMs={3600}
          spotlightMs={8800}
          comment="Keep the signal. Lose the résumé."
          className={styles.snapshotScene}
        >
          <div className={styles.snapshotLead}>
            <p className="kicker">01 / Snapshot</p>
            <h2 id="snapshot-title">I turn complex product logic into decisions people can see, test and trust.</h2>
          </div>
          <ul className={styles.snapshotFacts} aria-label="Javier Ortiz at a glance">
            <li><span>Level</span><strong>Senior Product Designer</strong><small>Recent Lead responsibility</small></li>
            <li><span>Experience</span><strong>5+ years at GiG</strong><small>Marbella · Remote</small></li>
            <li><span>Product terrain</span><strong>Rules · CMS · Backoffice</strong><small>Systems and operational tools</small></li>
            <li><span>Working edge</span><strong>AI + coded prototypes</strong><small>From screen to behaviour</small></li>
          </ul>
        </LiveScene>
        <MemoryConsent />
      </section>

      <section className={`section shell ${styles.work}`} id="work" aria-labelledby="work-title">
        <header className={styles.sectionHeading}>
          <p className="kicker">02 / Selected work</p>
          <h2 id="work-title">Product systems made inspectable.</h2>
          <p>Concept previews for how real rule engine, design system and AI case studies will be told. Names, metrics and outcomes remain fictitious.</p>
        </header>
        <div className="project-list">
          {projects.map((project, index) => index === 0 ? (
            <LiveScene
              id="work-frame"
              verb="frame"
              label="Case 01 / Live"
              targetSelector=".project-card__media"
              tool="asset"
              action="Placing evidence"
              properties={["atlas_rule_builder_v04", "Image · Fill", "Crop · 52%"]}
              readMs={4200}
              spotlightMs={9600}
              comment="Show the decision, not the decoration."
              className={styles.workScene}
              key={project.slug}
            >
              <ProjectCard project={project} />
            </LiveScene>
          ) : <ProjectCard project={project} key={project.slug} />)}
        </div>
      </section>

      <section className={`section shell ${styles.practice}`} id="approach" aria-labelledby="practice-title">
        <header className={styles.sectionHeading}>
          <p className="kicker">03 / Product practice</p>
          <h2 id="practice-title">I make the system visible before I make the interface.</h2>
          <p>I turn rules, actors and edge cases into a shared model that product, design and engineering can question—and then prove through behaviour.</p>
        </header>
        <LiveScene
          id="practice-connect"
          verb="connect"
          label="Practice / Connected"
          targetSelector={`.${styles.practiceStage}`}
          tool="connections"
          action="Connecting decisions to outputs"
          properties={["3 triggers", "3 destinations", "On click"]}
          readMs={4000}
          spotlightMs={9200}
          comment="Show the path, not a list of skills."
          className={styles.practiceScene}
        >
          <div className={styles.practiceStage}><ProductPractice /></div>
        </LiveScene>
      </section>

      <section className={`section ${styles.aiSection}`} id="ai-practice" aria-labelledby="ai-title">
        <div className={`shell ${styles.aiInner}`}>
          <header className={styles.aiHeading}>
            <p className="kicker">04 / AI-native product practice</p>
            <h2 id="ai-title">How I use AI to frame, prototype and validate product decisions.</h2>
            <p>AI shortens the distance between a question and useful evidence. Product judgement, privacy and final quality remain accountable human work.</p>
          </header>
          <LiveScene
            id="ai-operationalise"
            verb="operationalise"
            label="AI workflow / Live"
            targetSelector={`.${styles.aiStage}`}
            tool="workflow"
            action="Mapping tools to outcomes"
            properties={["Frame → Validate", "Output linked", "Human check · On"]}
            readMs={4600}
            spotlightMs={9800}
            comment="Tools change. The operating model matters."
            className={styles.aiScene}
          >
            <div className={styles.aiStage}><AIPractice /></div>
          </LiveScene>
        </div>
      </section>

      <section className={`section shell ${styles.about}`} id="about-preview" aria-labelledby="about-title">
        <LiveScene
          id="about-reframe"
          verb="reframe"
          label="Portrait + story / Approved"
          targetSelector={`.${styles.aboutPortrait}`}
          tool="crop"
          action="Reframing the story"
          properties={["Fill", "Zoom 112%", "Y 31 → 48"]}
          readMs={3600}
          spotlightMs={7400}
          comment="A crop should hold the gaze, not fight it."
          className={styles.aboutScene}
        >
          <div className={styles.aboutSpread}>
            <AboutPortrait />
            <div className={styles.aboutCopy}>
              <p className="kicker">05 / About</p>
              <h2 id="about-title">Close enough to lead the system. Hands-on enough to fix the detail.</h2>
              <p>I’m a Senior Product Designer based in Marbella. My recent lead experience expanded the frame—from polishing an interaction to helping a team hold quality, context and momentum together.</p>
              <Link className="text-link" href="/about">Read the full story <ArrowIcon /></Link>
              <span className={styles.aboutDraft} aria-hidden="true">Senior · 5+ years · Rules · CMS · Backoffice · AI · Marbella · Recent Lead</span>
            </div>
          </div>
        </LiveScene>
      </section>

      <Testimonials />

      <section className={`section shell ${styles.playground}`} id="playground" aria-labelledby="playground-title">
        <header className={styles.playgroundHeading}>
          <div><p className="kicker">07 / Experimental shelf</p><h2 id="playground-title">Small experiments. Serious curiosity.</h2></div>
          <p>Motion studies and coded ideas used to explore a behaviour, not decorate a page.</p>
        </header>
        <LiveScene
          id="playground-experiment"
          verb="experiment"
          label="Experiment / Played"
          targetSelector=".playground-playhead"
          tool="timeline"
          action="Tuning the motion"
          properties={["00:02", "Cubic out", "1×"]}
          readMs={3400}
          spotlightMs={8200}
          comment="Linear felt like a loading bar. Awkward."
          className={styles.playgroundScene}
        >
          <div className={styles.playgroundShelf}>
            <PlaygroundStudy />
            <div className={styles.playgroundMeta}><span>LAB / 001</span><strong>Kinetic type study</strong><p>Testing rhythm, hierarchy and handoff through a restrained typographic loop.</p><Link className="text-link" href="/playground">Open playground <ArrowIcon /></Link></div>
            <div className={styles.futureSlot}><span>LAB / 002</span><strong>Next experiment</strong><p>Reserved for a real prototype.</p></div>
          </div>
        </LiveScene>
      </section>
    </>
  );
}
