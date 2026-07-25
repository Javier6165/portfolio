"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const steps = [
  { id: "frame", label: "01 / Frame", title: "Find the expensive uncertainty" },
  { id: "explore", label: "02 / Explore", title: "Generate options with constraints" },
  { id: "build", label: "03 / Build", title: "Turn the decision into behaviour" },
] as const;

type Step = (typeof steps)[number]["id"];
type SimulationState = "idle" | "running" | "complete";

function PracticeArtifact({
  step,
  simulationState,
  onRun,
}: {
  step: Step;
  simulationState: SimulationState;
  onRun: () => void;
}) {
  if (step === "frame") {
    return (
      <div className="ai-artifact ai-artifact--frame">
        <div className="ai-artifact__bar"><i /> Product brief / raw input <span>08:42</span></div>
        <p>“Operators need to publish complex rules faster.”</p>
        <div className="ai-artifact__signals"><span>Risk</span><strong>Unknown consequence</strong><span>Decision</span><strong>What must remain true?</strong></div>
      </div>
    );
  }
  if (step === "explore") {
    return (
      <div className="ai-artifact ai-artifact--explore">
        <div className="ai-artifact__bar"><i /> Option space / constrained <span>3 routes</span></div>
        <div className="option-grid"><article><small>A</small><b>Form first</b><span>Fast / opaque</span></article><article className="is-selected"><small>B</small><b>Impact first</b><span>Clear / testable</span></article><article><small>C</small><b>Graph first</b><span>Powerful / dense</span></article></div>
      </div>
    );
  }
  const running = simulationState === "running";
  const complete = simulationState === "complete";
  return (
    <div className="ai-artifact ai-artifact--build">
      <div className="ai-artifact__bar"><i /> Working prototype / local <span>{running ? "Checking" : complete ? "Proved" : "Ready"}</span></div>
      <div className="prototype-rule"><small>IF</small><span>Market changes</span><small>THEN</small><span>Preview impact</span></div>
      <div className="prototype-progress" data-state={simulationState} aria-hidden="true"><i /></div>
      <div className="prototype-result" data-state={simulationState}>
        <i />
        <div aria-live="polite">
          <small>{running ? "Simulation running" : complete ? "Simulation complete" : "Working behaviour"}</small>
          <strong>{running ? "Checking edge cases…" : complete ? "12,480 states checked" : "Ready to test the consequence"}</strong>
        </div>
        <button type="button" onClick={onRun} disabled={running}>
          {running ? "Running…" : complete ? "Run again" : "Run simulation"}
        </button>
      </div>
    </div>
  );
}

export function AIPractice() {
  const [active, setActive] = useState<Step>("frame");
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const simulationTimerRef = useRef<number | null>(null);
  const current = steps.find((step) => step.id === active) ?? steps[0];

  function runSimulation() {
    if (simulationTimerRef.current) window.clearTimeout(simulationTimerRef.current);
    setSimulationState("running");
    simulationTimerRef.current = window.setTimeout(() => {
      setSimulationState("complete");
      simulationTimerRef.current = null;
    }, 1_150);
  }

  useEffect(() => {
    function activatePrototype(event: Event) {
      if (!(event instanceof CustomEvent) || event.detail?.id !== "ai-activate") return;
      setActive("build");
      // Let the selected panel render before its functional state changes.
      window.requestAnimationFrame(runSimulation);
    }

    window.addEventListener("portfolio-live-scene-play", activatePrototype);
    return () => {
      window.removeEventListener("portfolio-live-scene-play", activatePrototype);
      if (simulationTimerRef.current) window.clearTimeout(simulationTimerRef.current);
    };
  }, []);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? steps.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + steps.length) % steps.length;
    setActive(steps[nextIndex].id);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    tabs?.[nextIndex]?.focus();
  }

  return (
    <div className="ai-practice__interactive js-reveal">
      <div className="ai-practice__steps" role="tablist" aria-label="AI-assisted product design practice">
        {steps.map((step, index) => (
          <button
            type="button"
            role="tab"
            id={`ai-practice-tab-${step.id}`}
            aria-selected={active === step.id}
            aria-controls="ai-practice-panel"
            tabIndex={active === step.id ? 0 : -1}
            key={step.id}
            onClick={() => setActive(step.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>{step.label}</span><strong>{step.title}</strong>
          </button>
        ))}
      </div>
      <div id="ai-practice-panel" role="tabpanel" aria-labelledby={`ai-practice-tab-${active}`} className="ai-practice__panel">
        <div className="ai-practice__panel-meta"><span>{current.label}</span><span>Human judgement stays in the loop</span></div>
        <PracticeArtifact step={active} simulationState={simulationState} onRun={runSimulation} />
      </div>
    </div>
  );
}
