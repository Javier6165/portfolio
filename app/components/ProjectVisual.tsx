import type { Project } from "../data";

export function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.slug === "atlas") {
    return (
      <div className={`project-visual project-visual--atlas ${compact ? "project-visual--compact" : ""}`} aria-hidden="true">
        <div className="atlas-toolbar"><i /><span>Pricing rule / Spain</span><b>Draft</b></div>
        <div className="atlas-canvas">
          <div className="atlas-rail"><i /><i /><i /><i /></div>
          <div className="atlas-rule">
            <small>IF</small><span>Market is Spain</span>
            <small>AND</small><span>Player segment is Active</span>
            <small>THEN</small><span>Apply offer A</span>
          </div>
          <div className="atlas-impact">
            <small>IMPACT PREVIEW</small>
            <strong>12,480</strong><span>accounts affected</span>
            <div className="mini-chart"><i /><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
    );
  }

  if (project.slug === "northstar") {
    return (
      <div className={`project-visual project-visual--northstar ${compact ? "project-visual--compact" : ""}`} aria-hidden="true">
        <div className="northstar-top"><span>FOUNDATIONS / TOKENS</span><b>v4.2</b></div>
        <div className="northstar-orbit">
          <i className="orbit orbit--one" /><i className="orbit orbit--two" />
          <div className="system-core">NS</div>
          <div className="system-node node--a">A</div>
          <div className="system-node node--b">B</div>
          <div className="system-node node--c">C</div>
        </div>
        <div className="northstar-tokens"><i /><i /><i /><i /><i /></div>
      </div>
    );
  }

  return (
    <div className={`project-visual project-visual--pulse ${compact ? "project-visual--compact" : ""}`} aria-hidden="true">
      <div className="pulse-heading"><span>Evidence assistant</span><i>●</i></div>
      <div className="pulse-prompt"><span>Compare the latest signals</span><b>↗</b></div>
      <div className="pulse-result">
        <small>SUGGESTED SUMMARY · 92% CONFIDENCE</small>
        <i /><i /><i className="short" />
        <div className="pulse-sources"><span>4 sources</span><span>Review changes</span></div>
      </div>
      <div className="pulse-wave"><i /><i /><i /><i /><i /><i /><i /></div>
    </div>
  );
}
