import styles from "./Testimonials.module.css";

const recommendations = [
  {
    name: "Yana Azzopardi",
    context: "Former manager at GiG · Director of Brand & Design",
    quote: "In his role as Senior Product Designer and eventually as team Lead, he played a key part in driving product design initiatives and improving the overall user experience across our backoffice platforms.",
  },
  {
    name: "Donnalisa Buhagiar",
    context: "Former product partner at GiG · Product Manager",
    quote: "Javier’s ability to transform complex, abstract concepts into intuitive and user-friendly designs is one of his standout qualities.",
  },
  {
    name: "Juan José Reina Cruz",
    context: "Head of Frontend & Mobile · Gaming Innovation Group",
    quote: "He always looked beyond the visual design, taking the time to understand user needs, explore new technologies, and find practical ways to make our products more intuitive and efficient.",
  },
] as const;

export function Testimonials() {
  return (
    <section className={`section shell ${styles.section}`} id="testimonials" aria-labelledby="testimonials-title">
      <header className={styles.heading}>
        <p className="kicker">Proof from people</p>
        <h2 id="testimonials-title">What people I’ve worked with say.</h2>
        <p>Selected excerpts from recommendations Javier received on LinkedIn.</p>
      </header>
      <div className={styles.quotes}>
        {recommendations.map((recommendation) => (
          <figure className={styles.quote} key={recommendation.name}>
            <blockquote>“{recommendation.quote}”</blockquote>
            <figcaption><strong>{recommendation.name}</strong><span>{recommendation.context}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
