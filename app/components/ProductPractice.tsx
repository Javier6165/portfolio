"use client";

import { useState, type KeyboardEvent } from "react";
import styles from "./ProductPractice.module.css";

const practiceSteps = [
  {
    id: "map",
    index: "01",
    label: "Map the system",
    question: "What can change, who is affected and where can it fail?",
    output: "Rule map + critical states",
    aligns: "Product · Engineering · Operations",
  },
  {
    id: "frame",
    index: "02",
    label: "Frame the decision",
    question: "Which trade-off needs to become explicit before UI work starts?",
    output: "Annotated flow + decision record",
    aligns: "Product · Design · Stakeholders",
  },
  {
    id: "prove",
    index: "03",
    label: "Prove the behaviour",
    question: "What is still uncertain after the screen looks finished?",
    output: "Functional prototype + test states",
    aligns: "Design · Engineering · Users",
  },
] as const;

type PracticeStep = (typeof practiceSteps)[number]["id"];

function SystemMap() {
  return (
    <div className={`${styles.artifact} ${styles.map}`} aria-hidden="true">
      <div className={styles.artifactBar}><span>RULE MAP / DRAFT 04</span><b>6 dependencies</b></div>
      <div className={styles.mapCanvas}>
        <span className={styles.actor}>Operator</span>
        <span className={styles.rule}>Market changes</span>
        <span className={styles.condition}>Eligibility</span>
        <span className={styles.consequence}>Impact preview</span>
        <i className={styles.pathOne} /><i className={styles.pathTwo} /><i className={styles.pathThree} />
      </div>
      <div className={styles.artifactFooter}><span>Actors 03</span><span>Rules 08</span><span>Edge cases 12</span></div>
    </div>
  );
}

function DecisionFlow() {
  return (
    <div className={`${styles.artifact} ${styles.flow}`} aria-hidden="true">
      <div className={styles.artifactBar}><span>DECISION FLOW / ANNOTATED</span><b>Trade-off visible</b></div>
      <div className={styles.flowCanvas}>
        <div><small>01 / INPUT</small><strong>Rule intent</strong><span>What must remain true?</span></div>
        <i />
        <div className={styles.flowFocus}><small>02 / DECISION</small><strong>Preview consequence</strong><span>Clarity before configuration</span></div>
        <i />
        <div><small>03 / OUTPUT</small><strong>Safe publish</strong><span>Reversible and traceable</span></div>
      </div>
      <div className={styles.annotation}>↳ Move consequence before configuration</div>
    </div>
  );
}

function BehaviourPrototype() {
  return (
    <div className={`${styles.artifact} ${styles.prototype}`} aria-hidden="true">
      <div className={styles.artifactBar}><span>BEHAVIOUR PROTOTYPE / LOCAL</span><b>Interactive</b></div>
      <div className={styles.prototypeCanvas}>
        <div className={styles.prototypeRail}><i /><i /><i /><i /></div>
        <div className={styles.prototypeRule}>
          <small>IF</small><span>Player segment is active</span>
          <small>AND</small><span>Market is Spain</span>
          <small>THEN</small><span>Preview offer impact</span>
        </div>
        <div className={styles.prototypeResult}><small>SIMULATED RESULT</small><strong>12,480</strong><span>states checked before publish</span></div>
      </div>
    </div>
  );
}

export function ProductPractice() {
  const [active, setActive] = useState<PracticeStep>("map");
  const activeIndex = practiceSteps.findIndex((step) => step.id === active);
  const current = practiceSteps[activeIndex] ?? practiceSteps[0];

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? practiceSteps.length - 1
        : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + practiceSteps.length) % practiceSteps.length;
    setActive(practiceSteps[nextIndex].id);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex]?.focus();
  }

  return (
    <div className={styles.root}>
      <div className={styles.ungrouped} aria-hidden="true">
        <b>Loose skills / no workflow</b>
        <span>Systems thinking</span><span>Facilitation</span><span>Interaction design</span>
        <span>Design systems</span><span>Prototyping</span><span>Product strategy</span>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Javier's product design practice">
        {practiceSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            role="tab"
            id={`practice-tab-${step.id}`}
            aria-selected={active === step.id}
            aria-controls="practice-viewer"
            tabIndex={active === step.id ? 0 : -1}
            onClick={() => setActive(step.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>{step.index}</span>
            <strong>{step.label}</strong>
            <i aria-hidden="true">↗</i>
          </button>
        ))}
      </div>

      <div className={styles.viewer} id="practice-viewer" role="tabpanel" aria-labelledby={`practice-tab-${active}`}>
        <div className={styles.viewerMeta}>
          <span>0{activeIndex + 1} / 03</span>
          <span>Output linked</span>
        </div>
        {active === "map" ? <SystemMap /> : active === "frame" ? <DecisionFlow /> : <BehaviourPrototype />}
        <dl className={styles.definition}>
          <div><dt>Question</dt><dd>{current.question}</dd></div>
          <div><dt>Output</dt><dd>{current.output}</dd></div>
          <div><dt>Who it aligns</dt><dd>{current.aligns}</dd></div>
        </dl>
      </div>
    </div>
  );
}
