"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import type { Project } from "../data";
import { ProjectVisual } from "./ProjectVisual";
import { ArrowIcon } from "./SiteShell";

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const frameRef = useRef<number | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, target: null as HTMLAnchorElement | null });

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  function startTracking(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  }

  function trackPointer(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = boundsRef.current ?? event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      target: event.currentTarget,
    };
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      const { x, y, target } = pointerRef.current;
      target?.style.setProperty("--pointer-x", `${x}px`);
      target?.style.setProperty("--pointer-y", `${y}px`);
      frameRef.current = null;
    });
  }

  function stopTracking(event: PointerEvent<HTMLAnchorElement>) {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    boundsRef.current = null;
    pointerRef.current.target = null;
    event.currentTarget.style.removeProperty("--pointer-x");
    event.currentTarget.style.removeProperty("--pointer-y");
  }

  return (
    <div className="project-card-shell js-reveal">
      <Link
        className={`project-card project-card--${project.accent} project-card--${project.slug}${compact ? " project-card--compact" : ""}`}
        href={`/work/${project.slug}`}
        onPointerEnter={startTracking}
        onPointerMove={trackPointer}
        onPointerLeave={stopTracking}
      >
        <div className="project-card__meta">
          <span>{project.index}</span><span>{project.surface}</span><span>{project.year}</span>
        </div>
        <div className="project-card__copy">
          <p>{project.name}</p>
          <h3>{project.title}</h3>
          <p className="project-card__summary">{project.summary}</p>
          <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          <p className="project-card__proof"><span>Proof format</span>{project.proof}</p>
        </div>
        <div className="project-card__media">
          <div className="project-card__layer project-card__layer--back" />
          <div className="project-card__layer project-card__layer--mid" />
          <ProjectVisual project={project} compact={compact} />
          <span className="project-card__media-label">{project.artifactLabel}</span>
        </div>
        <span className="project-card__cta">Open case study <ArrowIcon /></span>
        <span className="project-card__cursor" aria-hidden="true">View case ↗</span>
      </Link>
    </div>
  );
}
