"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import type { Project } from "../data";
import { ProjectVisual } from "./ProjectVisual";
import { ArrowIcon } from "./SiteShell";

export function ProjectCard({ project }: { project: Project }) {
  function trackPointer(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div className="project-card-shell js-reveal">
      <Link
        className={`project-card project-card--${project.accent}`}
        href={`/work/${project.slug}`}
        onPointerMove={trackPointer}
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
          <ProjectVisual project={project} />
          <span className="project-card__media-label">{project.artifactLabel}</span>
        </div>
        <span className="project-card__cta">Open case study <ArrowIcon /></span>
        <span className="project-card__cursor" aria-hidden="true">View case ↗</span>
      </Link>
    </div>
  );
}
