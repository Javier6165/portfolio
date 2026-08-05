"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./AIPractice.module.css";

const stages = [
  {
    id: "frame",
    index: "01",
    label: "Frame",
    title: "Structure context and risk",
    output: "Structured brief + risk map",
    check: "Accuracy · confidentiality · product intent",
  },
  {
    id: "build",
    index: "02",
    label: "Build",
    title: "Make the behaviour testable",
    output: "Functional prototype",
    check: "Interaction · accessibility · failure states",
  },
  {
    id: "validate",
    index: "03",
    label: "Validate",
    title: "Collect evidence, not approval",
    output: "Findings + next decision",
    check: "Signal quality · bias · accountable choice",
  },
] as const;

type Stage = (typeof stages)[number]["id"];
type SimulationState = "idle" | "running" | "complete";

function StageArtifact({ stage, simulation, onRun }: { stage: Stage; simulation: SimulationState; onRun: () => void }) {
  if (stage === "frame") {
    return (
      <div className={`${styles.artifact} ${styles.frame}`}>
        <div className={styles.artifactBar}><span>CONTEXT / STRUCTURED</span><b>Draft 03</b></div>
        <div className={styles.brief}>
          <p>“Operators need to publish complex rules faster.”</p>
          <dl><div><dt>Risk</dt><dd>Unknown consequence</dd></div><div><dt>Decision</dt><dd>What must remain true?</dd></div><div><dt>Constraint</dt><dd>No silent changes</dd></div></dl>
        </div>
      </div>
    );
  }

  if (stage === "validate") {
    return (
      <div className={`${styles.artifact} ${styles.validate}`}>
        <div className={styles.artifactBar}><span>VALIDATION LOG / SESSION 04</span><b>Evidence captured</b></div>
        <div className={styles.findings}>
          <div><span>Observed</span><strong>Impact preview changed the decision</strong><i>High signal</i></div>
          <div><span>Break point</span><strong>Recovery state lacked enough context</strong><i>Revise</i></div>
          <div><span>Next</span><strong>Test selective undo before handoff</strong><i>Queued</i></div>
        </div>
      </div>
    );
  }

  const running = simulation === "running";
  const complete = simulation === "complete";
  return (
    <div className={`${styles.artifact} ${styles.build}`}>
      <div className={styles.artifactBar}><span>WORKING PROTOTYPE / LOCAL</span><b>{running ? "Checking" : complete ? "Proved" : "Ready"}</b></div>
      <div className={styles.prototype}>
        <div className={styles.rule}><small>IF</small><span>Market changes</span><small>THEN</small><span>Preview impact</span></div>
        <div className={styles.progress} data-state={simulation} aria-hidden="true"><i /></div>
        <div className={styles.result} data-state={simulation}>
          <div aria-live="polite">
            <small>{running ? "Simulation running" : complete ? "Simulation complete" : "Working behaviour"}</small>
            <strong>{running ? "Checking edge cases…" : complete ? "12,480 states checked" : "Ready to test the consequence"}</strong>
          </div>
          <button type="button" onClick={onRun} disabled={running}>{running ? "Running…" : complete ? "Run again" : "Run simulation"}</button>
        </div>
      </div>
    </div>
  );
}

export function AIPractice() {
  const [active, setActive] = useState<Stage>("frame");
  const [simulation, setSimulation] = useState<SimulationState>("idle");
  const timerRef = useRef<number | null>(null);
  const current = stages.find((stage) => stage.id === active) ?? stages[0];

  function runSimulation() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setSimulation("running");
    timerRef.current = window.setTimeout(() => {
      setSimulation("complete");
      timerRef.current = null;
    }, 1_250);
  }

  useEffect(() => {
    function runFromNarrative(event: Event) {
      if (!(event instanceof CustomEvent) || event.detail?.id !== "ai-operationalise") return;
      setActive("build");
      window.requestAnimationFrame(runSimulation);
    }
    window.addEventListener("portfolio-live-scene-play", runFromNarrative);
    return () => {
      window.removeEventListener("portfolio-live-scene-play", runFromNarrative);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? stages.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + stages.length) % stages.length;
    setActive(stages[nextIndex].id);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex]?.focus();
  }

  return (
    <div className={styles.root}>
      <div className={styles.pipeline} role="tablist" aria-label="AI-native product workflow">
        {stages.map((stage, index) => (
          <button
            type="button"
            role="tab"
            id={`ai-tab-${stage.id}`}
            aria-selected={active === stage.id}
            aria-controls="ai-workflow-viewer"
            tabIndex={active === stage.id ? 0 : -1}
            key={stage.id}
            aria-label={`${stage.label}: ${stage.title}`}
            onClick={() => setActive(stage.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>{stage.index}</span><strong data-ai-validate-label={stage.id === "validate" ? "true" : undefined}>{stage.label}</strong>
          </button>
        ))}
      </div>
      <div className={styles.viewer} id="ai-workflow-viewer" role="tabpanel" aria-labelledby={`ai-tab-${active}`}>
        <StageArtifact stage={active} simulation={simulation} onRun={runSimulation} />
        <dl className={styles.meta}>
          <div><dt>Output</dt><dd>{current.output}</dd></div>
          <div><dt>Human check</dt><dd>{current.check}</dd></div>
        </dl>
      </div>
    </div>
  );
}
