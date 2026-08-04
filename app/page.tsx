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
    <figure className={styles.aboutPortrait} role="img" aria-label="Portrait of Javier Ortiz.">
      <picture>
        <source type="image/avif" srcSet="/images/portraits/about-system-960.avif 960w, /images/portraits/about-system-1440.avif 1440w" sizes="(max-width: 720px) 100vw, 58vw" />
        <source type="image/webp" srcSet="/images/portraits/about-system-960.webp 960w, /images/portraits/about-system-1440.webp 1440w" sizes="(max-width: 720px) 100vw, 58vw" />
        <img className="portrait" src="/images/portraits/about-system.jpg" alt="" aria-hidden="true" width="1439" height="1800" loading="lazy" />
      </picture>
      <figcaption aria-hidden="true"><span>PORTRAIT / 02</span><b>Y 48%</b></figcaption>
    </figure>
  );
}

function VideoIntroduction() {
  return (
    <section className={`section shell ${styles.videoIntroduction}`} id="meet-javier" aria-labelledby="video-introduction-title" data-home-entry="cut">
      <header className={styles.videoIntroductionHeading}>
        <h2 id="video-introduction-title">Meet me in 60 seconds.</h2>
        <p>A quick, human overview for people deciding whether to go deeper into the work.</p>
      </header>
      <figure className={styles.videoPlaceholder} aria-label="Placeholder for Javier Ortiz's 60-second introduction video.">
        <div className={styles.videoStill}>
          <picture>
            <img src="/images/portraits/video-intro-placeholder.jpg" alt="" aria-hidden="true" width="1439" height="1800" loading="lazy" />
          </picture>
          <span className={styles.videoStatus}>Placeholder · final video pending</span>
          <span className={styles.videoPlay} aria-hidden="true"><i /></span>
          <span className={styles.videoDuration}>01:00</span>
        </div>
        <figcaption>
          <span>Javier Ortiz · Product designer</span>
          <span>Captions and transcript planned</span>
        </figcaption>
      </figure>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <EditorIntro />

      <section className={`section shell ${styles.snapshot}`} id="experience" aria-label="Javier Ortiz at a glance">
        <LiveScene
          id="snapshot-clarify"
          verb="clarify"
          label="Profile / Refined"
          targetSelector={`.${styles.snapshotFacts}`}
          tool="layout"
          action="Tightening the evidence rhythm"
          properties={["Gap 18 → 24", "Baseline +2", "Labels · aligned"]}
          readMs={1400}
          spotlightMs={3400}
          minVisibility={0.32}
          comment="The content is right. The rhythm is trying too hard."
          commentFirst
          requiredFirstVisit
          cameraOffsetY={190}
          draftLabel="Draft · rhythm uneven"
          className={styles.snapshotScene}
        >
          <ul className={styles.snapshotFacts} aria-label="Javier Ortiz at a glance" data-home-entry="facts">
            <li><span>Level</span><strong>Senior Product Designer</strong><small>Recent Lead responsibility</small></li>
            <li><span>Experience</span><strong>5+ years at GiG</strong><small>Marbella · Remote</small></li>
            <li><span>Product scope</span><strong id="snapshot-scope">B2B platforms &amp; systems</strong><small>Rules · CMS · Backoffice</small></li>
            <li><span>Working edge</span><strong>AI + coded prototypes</strong><small>From screen to behaviour</small></li>
          </ul>
        </LiveScene>
        <MemoryConsent />
      </section>

      <VideoIntroduction />

      <section className={`section shell ${styles.work}`} id="work" aria-labelledby="work-title">
        <header className={styles.sectionHeading}>
          <p className="kicker">02 / Selected work</p>
          <h2 id="work-title">Product systems made inspectable.</h2>
          <p>Concept previews for how real rule engine, design system and AI case studies will be told. Names, metrics and outcomes remain fictitious.</p>
        </header>
        <div className="project-list" data-home-entry="case">
          {projects.map((project, index) => index === 0 ? (
            <LiveScene
              id="work-frame"
              verb="frame"
              label="Case 01 / Live"
              targetSelector=".project-card__media"
              tool="asset"
              action="Opening the evidence crop"
              properties={["Crop 56 → 52%", "Contrast +4", "Frame · aligned"]}
              readMs={1600}
              spotlightMs={3800}
              comment="The evidence is here. The crop is hiding the useful part."
              commentFirst
              draftLabel="Draft · crop too tight"
              className={styles.workScene}
              key={project.slug}
            >
              <ProjectCard project={project} />
            </LiveScene>
          ) : <ProjectCard project={project} compact key={project.slug} />)}
        </div>
      </section>

      <section className={`section shell ${styles.practice}`} id="approach" aria-labelledby="practice-title">
        <header className={styles.sectionHeading}>
          <p className="kicker">03 / Product practice</p>
          <h2 id="practice-title">How I move complex product work from ambiguity to evidence.</h2>
          <p>A repeatable three-step practice: map the system, frame the decision and prototype the risky behaviour before delivery.</p>
        </header>
        <LiveScene
          id="practice-connect"
          verb="connect"
          label="Practice / Connected"
          targetSelector={`.${styles.practiceStage}`}
          tool="connections"
          action="Turning skills into a workflow"
          properties={["3 triggers", "3 destinations", "On click"]}
          readMs={1500}
          spotlightMs={4000}
          comment="A list of skills. Groundbreaking. Let’s add arrows."
          commentFirst
          cameraOffsetY={380}
          draftLabel="Draft · skills unconnected"
          className={styles.practiceScene}
        >
          <div className={styles.practiceStage}><ProductPractice /></div>
        </LiveScene>
      </section>

      <section className={`section ${styles.aiSection}`} id="ai-practice" aria-labelledby="ai-title">
        <div className={`shell ${styles.aiInner}`}>
          <header className={styles.aiHeading}>
            <p className="kicker">04 / AI-native product practice</p>
            <h2 id="ai-title">AI gets me to evidence faster.</h2>
            <p>I use it to frame the problem, prototype risky behaviour and validate a decision before the team commits.</p>
          </header>
          <LiveScene
            id="ai-operationalise"
            verb="operationalise"
            label="AI workflow / Live"
            targetSelector={`.${styles.aiStage}`}
            tool="workflow"
            action="Turning tools into a working model"
            properties={["Frame → Validate", "Output linked", "Human check · On"]}
            readMs={1100}
            spotlightMs={4200}
            comment="Five AI tools and no workflow. Very 2026."
            commentFirst
            draftLabel="Draft · tools before decisions"
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
          action="Giving the portrait some room"
          properties={["Fill", "Zoom 112%", "Y 31 → 48"]}
          readMs={1000}
          spotlightMs={3600}
          comment="This crop says ‘thought leader’. Bit much."
          commentFirst
          draftLabel="Draft · crop fighting the story"
          className={styles.aboutScene}
        >
          <div className={styles.aboutSpread} data-home-entry="split">
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
          <div><p className="kicker">07 / Playground</p><h2 id="playground-title">A playground for motion, code and interaction.</h2></div>
          <p>Open the separate lab for small studies that test one behaviour without becoming a full case study.</p>
        </header>
        <LiveScene
          id="playground-experiment"
          verb="experiment"
          label="Experiment / Played"
          targetSelector=".playground-playhead"
          tool="timeline"
          action="Replacing linear with intentional"
          properties={["00:02", "Cubic out", "1×"]}
          readMs={900}
          spotlightMs={3400}
          comment="Linear easing. I was young. It was six seconds ago."
          commentFirst
          draftLabel="Draft · motion without rhythm"
          className={styles.playgroundScene}
        >
          <div className={styles.playgroundShelf} data-home-entry="timeline">
            <PlaygroundStudy />
            <div className={styles.playgroundMeta}><span>LAB / 001</span><strong>Kinetic type study</strong><p>Testing rhythm, hierarchy and handoff through a restrained typographic loop.</p><Link className="text-link" href="/playground">Enter the playground <ArrowIcon /></Link></div>
          </div>
        </LiveScene>
      </section>
    </>
  );
}
