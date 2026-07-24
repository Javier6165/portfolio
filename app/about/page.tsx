/* Theme-swapped portraits are pre-compressed local assets; native images keep both variants immediately available. */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "About",
  description: "About Javier Ortiz, Senior Product Designer with recent lead experience.",
};

const capabilities = [
  ["Product", "Complex platforms, rule engines, CMS, data-heavy tools and end-to-end workflows."],
  ["Systems", "Design systems, reusable interaction patterns, governance and knowledge bases."],
  ["Direction", "Facilitation, product framing, critique and recent lead responsibility."],
  ["Craft", "Visual design, prototyping, micro-interactions, 3D/VFX curiosity and clear storytelling."],
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero shell">
        <div>
          <p className="eyebrow js-hero-reveal">About / Javier Ortiz</p>
          <h1 className="page-display js-hero-reveal">I care about the space between a hard problem and an obvious next step.</h1>
        </div>
        <div className="about-hero__intro js-hero-reveal">
          <p>I’m a Senior Product Designer based in Marbella, Spain, currently working as Lead Product Designer at Gaming Innovation Group.</p>
          <p>My work lives where products become dense: many users, many rules, many edge cases and many teams trying to move at once.</p>
        </div>
      </section>

      <section className="about-story section shell" aria-labelledby="story-title">
        <div className="about-story__portrait theme-swap js-reveal" role="img" aria-label="Portrait of Javier Ortiz; the photograph changes with the Human or System theme.">
          <img className="portrait portrait--system" src="/images/portraits/about-system.jpg" alt="" aria-hidden="true" width="1439" height="1800" />
          <img className="portrait portrait--human" src="/images/portraits/about-human.jpg" alt="" aria-hidden="true" width="1314" height="1800" />
        </div>
        <div className="about-story__copy">
          <p className="kicker js-reveal">The throughline</p>
          <h2 id="story-title" className="js-reveal">From making interfaces to shaping the conditions for better product work.</h2>
          <div className="prose js-reveal">
            <p>I grew from Junior to Product, Senior and recently Lead Product Designer over more than five years inside complex platform work. That progression changed the scale of the problem, not my relationship with craft.</p>
            <p>I still like getting close to the interaction: the wording that removes doubt, the state that makes a risky action recoverable, the component that gives five teams a shared starting point.</p>
            <p>Before product design, I moved through visual design, e-commerce UX, games and 3D/VFX. That mixed background is useful now: it lets me switch between systems logic and visual expression without treating either as decoration.</p>
          </div>
        </div>
      </section>

      <section className="capabilities section shell" aria-labelledby="capabilities-title">
        <header className="section-heading section-heading--split js-reveal">
          <p className="kicker">What I bring</p>
          <h2 id="capabilities-title">Broad enough to connect the system. Detailed enough to improve it.</h2>
        </header>
        <div className="capability-list">
          {capabilities.map(([title, copy], index) => (
            <article className="capability js-reveal" key={title}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="beliefs section shell" aria-labelledby="beliefs-title">
        <header className="section-heading js-reveal">
          <p className="kicker">Working beliefs</p>
          <h2 id="beliefs-title">A few things I hold onto.</h2>
        </header>
        <div className="belief-grid">
          <blockquote className="js-reveal">“The interface should reveal the decision, not merely expose the data model.”</blockquote>
          <blockquote className="js-reveal">“A design system is an agreement with a release cycle—not a perfect Figma file.”</blockquote>
          <blockquote className="js-reveal">“Leadership is useful when it increases the quality of other people’s decisions.”</blockquote>
        </div>
      </section>

      <section className="contact-note section shell" id="contact-note">
        <p className="kicker js-reveal">Contact / Preview state</p>
        <div className="contact-note__grid js-reveal">
          <h2>The final email, LinkedIn URL and downloadable CV will be added when the preview is approved.</h2>
          <div><p>For now, explore the work structure and the visual system.</p><Link className="text-link" href="/#work">View concept cases <ArrowIcon /></Link></div>
        </div>
      </section>
    </>
  );
}
