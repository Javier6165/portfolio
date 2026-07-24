import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Visual and interaction experiments by Javier Ortiz.",
};

const labs = [
  { number: "001", title: "Type as interface", description: "A kinetic hierarchy study where emphasis behaves like product state, not decoration.", kind: "type" },
  { number: "002", title: "Signals in motion", description: "A motion language for showing confidence, change and connected consequence.", kind: "signal" },
  { number: "003", title: "Soft machines", description: "3D material and lighting explorations for interfaces that feel precise without becoming cold.", kind: "machine" },
];

export default function PlaygroundPage() {
  return (
    <>
      <section className="page-hero playground-hero shell">
        <div>
          <p className="eyebrow js-hero-reveal">Playground / Work in progress</p>
          <h1 className="page-display js-hero-reveal">A controlled place for uncontrolled curiosity.</h1>
        </div>
        <p className="page-hero__side js-hero-reveal">These are art-directed preview modules. Real experiments will replace them during the content pass.</p>
      </section>
      <section className="lab-list section shell" aria-label="Playground experiments">
        {labs.map((lab) => (
          <article className={`lab-card lab-card--${lab.kind} js-reveal`} key={lab.number}>
            <div className="lab-card__meta"><span>LAB / {lab.number}</span><span>Preview experiment</span></div>
            <div className="lab-card__visual" aria-hidden="true">
              {lab.kind === "type" && <div className="lab-type"><span>CLARITY</span><i>÷</i><span>NOISE</span></div>}
              {lab.kind === "signal" && <div className="lab-signal"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>}
              {lab.kind === "machine" && <div className="lab-machine"><i /><i /><i /></div>}
            </div>
            <div className="lab-card__copy"><h2>{lab.title}</h2><p>{lab.description}</p></div>
          </article>
        ))}
      </section>
    </>
  );
}
