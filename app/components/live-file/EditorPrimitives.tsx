import type { LiveSceneTool } from "./LiveSceneDirector";
import styles from "./LiveScene.module.css";

const toolNames: Record<LiveSceneTool, string> = {
  type: "Typography",
  layout: "Auto layout",
  asset: "Asset + crop",
  connections: "Prototype links",
  workflow: "Workflow mapping",
  prototype: "Prototype",
  timeline: "Timeline",
  crop: "Image crop",
  "content-status": "Content status",
  "file-status": "File status",
};

export function EditorPrimitives({ tool, properties, comment }: { tool: LiveSceneTool; properties: string[]; comment?: string }) {
  return (
    <div className={styles.editorLayer} aria-hidden="true">
      <div className={styles.selection}><i /><i /><i /><i /><span>JO / EDITING</span></div>
      <div className={styles.propertyPanel}>
        <div><span>{toolNames[tool]}</span><b>•••</b></div>
        <ul>{properties.slice(0, 3).map((property) => <li key={property}>{property}</li>)}</ul>
      </div>
      {comment ? (
        <div className={styles.commentThread}>
          <i>JO</i><div><span>Javier</span><p>{comment}</p></div><b>✓</b>
        </div>
      ) : null}
    </div>
  );
}
