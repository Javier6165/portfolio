import { testimonialSlots } from "../data";
import { LiveScene } from "./live-file/LiveScene";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <section className={`section shell ${styles.section}`} id="testimonials" aria-labelledby="testimonials-title">
      <header className={`section-heading js-reveal ${styles.heading}`}>
        <p className="kicker">07 / Testimonials — preview</p>
        <h2 id="testimonials-title">Trusted in the room. Precise in the work.</h2>
        <p>A portfolio shows the outcome. Recommendations should show how it felt to make it together. These slots are waiting for verified words—no quotes or identities are fabricated.</p>
      </header>

      <LiveScene
        id="testimonials-verify"
        verb="verify"
        label="References / Source pending"
        targetSelector={`.${styles.stage}`}
        durationMs={1900}
        dwellMs={700}
        className={styles.liveScene}
      >
        <div className={`js-reveal ${styles.stage}`}>
          <div className={styles.stageMeta} aria-hidden="true">
            <span>REFERENCE FILE / 03 SLOTS</span>
            <span>VERIFICATION REQUIRED</span>
          </div>

          <div className={styles.cards}>
            {testimonialSlots.map((testimonial) => (
              <article className={styles.card} key={testimonial.index}>
                <div className={styles.cardMeta}>
                  <span>{testimonial.index}</span>
                  <span>{testimonial.perspective}</span>
                </div>
                <span className={styles.quoteMark} aria-hidden="true">“</span>
                {testimonial.status === "verified" ? (
                  <>
                    <blockquote>{testimonial.quote}</blockquote>
                    <p className={styles.attribution}><strong>{testimonial.name}</strong><span>{testimonial.role}</span></p>
                  </>
                ) : (
                  <>
                    <div className={styles.placeholder}>
                      <h3>{testimonial.title}</h3>
                      <p>{testimonial.prompt}</p>
                    </div>
                    <p className={styles.source}><i aria-hidden="true" /><span>Placeholder · source required</span></p>
                  </>
                )}
              </article>
            ))}
          </div>

          <p className={styles.integrityNote}><span aria-hidden="true">↳</span> No quote without a source.</p>
        </div>
      </LiveScene>
    </section>
  );
}
