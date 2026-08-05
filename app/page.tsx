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
    <LiveScene
      id="video-poster"
      verb="reframe"
      label="Video poster / Selected"
      targetSelector={`.${styles.videoStill}`}
      tool="asset"
      action="Choosing the clearer opening frame"
      properties={["Image · Replace", "Crop · 16:9", "Poster · Selected"]}
      readMs={1200}
      spotlightMs={3700}
      comment="Five percent more hireable. Laptop added."
      commentFirst
      draftLabel="Draft · poster undecided"
      className={styles.videoScene}
      directorBeatIds={["video-poster-swap"]}
    >
      <section className={`section shell ${styles.videoIntroduction}`} id="meet-javier" aria-labelledby="video-introduction-title" data-home-entry="cut">
        <header className={styles.videoIntroductionHeading}>
          <h2 id="video-introduction-title">Meet me in 60 seconds.</h2>
          <p>A quick, human overview for people deciding whether to go deeper into the work.</p>
        </header>
        <figure className={styles.videoPlaceholder} aria-label="Placeholder for Javier Ortiz's 60-second introduction video.">
          <div className={styles.videoStill} data-video-frame>
            <picture className={styles.videoStillDraft}>
              <img src="/images/portraits/about-system.jpg" alt="" aria-hidden="true" width="1439" height="1800" loading="lazy" />
            </picture>
            <picture className={styles.videoStillFinal}>
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
    </LiveScene>
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
          action="Trimming the left padding"
          properties={["Left 12 → 0", "Columns · unchanged", "Content · untouched"]}
          readMs={1400}
          spotlightMs={3400}
          minVisibility={0.32}
          comment="Four facts. Twelve pixels of unnecessary ceremony."
          commentFirst
          requiredFirstVisit
          cameraOffsetY={190}
          draftLabel="Draft · padding loose"
          className={styles.snapshotScene}
          directorBeatIds={["snapshot-spacing-trim"]}
        >
          <ul className={styles.snapshotFacts} aria-label="Javier Ortiz at a glance" data-home-entry="facts" data-snapshot-facts>
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
              id="work-crop"
              verb="frame"
              label="Case 01 / Crop selected"
              targetSelector=".project-card__media"
              tool="asset"
              action="Testing the evidence crop"
              properties={["Crop 52 → 54 → 51%", "Focus · product logic", "Frame · selected"]}
              readMs={1600}
              spotlightMs={4700}
              comment="Too close. Too far. The ancient crop ritual."
              commentFirst
              draftLabel="Draft · crop too tight"
              className={`${styles.workScene} ${styles.workCropScene}`}
              directorBeatIds={["work-crop-tuning"]}
              key={project.slug}
            >
              <ProjectCard project={project} />
            </LiveScene>
          ) : index === 1 ? (
            <LiveScene
              id="work-contrast"
              verb="clarify"
              label="Case 02 / Metadata legible"
              targetSelector=".project-card__meta"
              tool="content-status"
              action="Raising metadata contrast"
              properties={["Opacity · +2", "Small text · checked", "Contrast · improved"]}
              readMs={1100}
              spotlightMs={3300}
              comment="Useful metadata should not require optimism."
              commentFirst
              draftLabel="Draft · metadata too quiet"
              className={`${styles.workScene} ${styles.workContrastScene}`}
              directorBeatIds={["work-metadata-contrast"]}
              key={project.slug}
            >
              <ProjectCard project={project} compact />
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
          verb="align"
          label="Practice / Aligned"
          targetSelector="[data-practice-viewer]"
          tool="align"
          action="Aligning the workflow viewer"
          properties={["X · -2 → 0", "12-column grid", "Optical alignment"]}
          readMs={1500}
          spotlightMs={4000}
          comment="Two pixels. Nobody will notice. I will."
          commentFirst
          cameraOffsetY={380}
          draftLabel="Draft · viewer 2 px off grid"
          className={styles.practiceScene}
          directorBeatIds={["practice-two-pixels"]}
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
            verb="correct"
            label="AI workflow / Checked"
            targetSelector="[data-ai-validate-label]"
            tool="text"
            action="Correcting the validation label"
            properties={["Valdiate → Validate", "Human check · On", "Copy · Final"]}
            readMs={1100}
            spotlightMs={4200}
            comment="AI assisted. Typo handcrafted."
            commentFirst
            draftLabel="Draft · human typo"
            className={styles.aiScene}
            directorBeatIds={["ai-validate-typo"]}
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
          properties={["Fill", "Zoom 103% → 100%", "Y · -1 → 0"]}
          readMs={1000}
          spotlightMs={3600}
          comment="This crop says keynote speaker. I have not earned the lanyard."
          commentFirst
          draftLabel="Draft · crop a touch too close"
          className={styles.aboutScene}
          directorBeatIds={["about-crop-breathe"]}
        >
          <div className={styles.aboutSpread} data-home-entry="split">
            <AboutPortrait />
            <div className={styles.aboutCopy}>
              <p className="kicker">05 / About</p>
              <h2 id="about-title">Close enough to lead the system. Hands-on enough to fix the detail.</h2>
              <p>I’m a Senior Product Designer based in Marbella. My recent lead experience expanded the frame—from polishing an interaction to helping a team hold quality, context and momentum together.</p>
              <Link className="text-link" href="/about">Read the full story <ArrowIcon /></Link>
            </div>
          </div>
        </LiveScene>
      </section>

      <Testimonials />

      <section className={`section shell ${styles.playground}`} id="playground" aria-labelledby="playground-title">
        <header className={styles.playgroundHeading}>
          <div><p className="kicker">07 / Playground</p><h2 id="playground-title">Motion, interaction and code—tested in public.</h2></div>
          <p>An optional lab for answering one interaction question at a time, without inflating every experiment into a case study.</p>
        </header>
        <LiveScene
          id="playground-experiment"
          verb="experiment"
          label="Experiment / Played"
          targetSelector=".playground-playhead"
          tool="timeline"
          action="Giving the playhead a better landing"
          properties={["Linear → Cubic out", "00:02", "1×"]}
          readMs={900}
          spotlightMs={3400}
          comment="Linear easing. I was young. It was six seconds ago."
          commentFirst
          draftLabel="Draft · easing still linear"
          className={styles.playgroundScene}
          directorBeatIds={["playground-easing"]}
        >
          <div className={styles.playgroundShelf} data-home-entry="timeline">
            <PlaygroundStudy />
            <div className={styles.playgroundMeta}><span>CURRENT STUDY / 001</span><strong>Easing should explain hierarchy, not announce itself.</strong><p>A 2.2 second type study comparing a mechanical landing with one that settles into place.</p><div className={styles.playgroundTags}><small>Motion</small><small>Prototype</small><small>Coded</small></div><Link className="text-link" href="/playground">Enter the playground <ArrowIcon /></Link></div>
          </div>
        </LiveScene>
      </section>
    </>
  );
}
