"use client";

import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

const stages = [
  {
    id: "visual",
    period: "2013—2021",
    label: "Visual craft",
    title: "I learned to make information feel intentional.",
    detail: "Graphic design, campaigns, video and e-commerce taught me hierarchy, composition and the value of the final ten percent of polish.",
    tools: "Graphic design · Video · E-commerce",
  },
  {
    id: "games",
    period: "2015—2017",
    label: "Games & 3D",
    title: "I learned that an interface is a behaviour.",
    detail: "Game design, Unity, C#, Blender and VFX moved me from static output into states, feedback loops and systems people can explore.",
    tools: "Unity · C# · Blender · VFX",
  },
  {
    id: "product",
    period: "2021—Now",
    label: "Complex product",
    title: "I learned to design for rules—not just screens.",
    detail: "At GiG I have worked across a real-time rule engine, proprietary CMS, data products, a backoffice design system and internal knowledge tools.",
    tools: "Rules · CMS · Data · Design systems",
  },
  {
    id: "lead-ai",
    period: "Recent",
    label: "Lead + AI",
    title: "I help teams reach better decisions—and working product—sooner.",
    detail: "Recent Lead responsibility, mentoring and workshops now sit alongside AI-assisted exploration, vibe coding and functional prototypes.",
    tools: "Direction · Workshops · AI · Code",
  },
] as const;

type StageId = (typeof stages)[number]["id"];

export function ExperienceSignal() {
  const [activeId, setActiveId] = useState<StageId>("product");
  const activeIndex = stages.findIndex((stage) => stage.id === activeId);
  const active = stages[activeIndex] ?? stages[2];

  function trackSpotlight(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? stages.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + stages.length) % stages.length;
    setActiveId(stages[nextIndex].id);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    tabs?.[nextIndex]?.focus();
  }

  const progressStyle = {
    "--experience-progress": `${(activeIndex / (stages.length - 1)) * 100}%`,
  } as CSSProperties;

  return (
    <div className="experience-signal js-reveal" onPointerMove={trackSpotlight} style={progressStyle}>
      <div className="experience-signal__spotlight" aria-hidden="true" />
      <div className="experience-signal__line" aria-hidden="true"><i /></div>
      <div className="experience-signal__tabs" role="tablist" aria-label="Javier's multidisciplinary career path">
        {stages.map((stage, index) => (
          <button
            type="button"
            role="tab"
            id={`experience-tab-${stage.id}`}
            aria-selected={stage.id === activeId}
            aria-controls="experience-panel"
            tabIndex={stage.id === activeId ? 0 : -1}
            key={stage.id}
            onClick={() => setActiveId(stage.id)}
            onFocus={() => setActiveId(stage.id)}
            onPointerEnter={() => setActiveId(stage.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>0{index + 1}</span>
            <small>{stage.period}</small>
            <strong>{stage.label}</strong>
          </button>
        ))}
      </div>
      <div
        id="experience-panel"
        key={active.id}
        className="experience-signal__panel"
        role="tabpanel"
        aria-labelledby={`experience-tab-${active.id}`}
        aria-live="polite"
      >
        <p className="experience-signal__meta">{active.period} / {active.label}</p>
        <p className="experience-signal__title">{active.title}</p>
        <div>
          <p>{active.detail}</p>
          <span>{active.tools}</span>
        </div>
      </div>
    </div>
  );
}
