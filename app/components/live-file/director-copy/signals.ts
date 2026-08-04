export type DirectorActionCue = "follow-stop";

let pendingAction: DirectorActionCue | null = null;

export function queueDirectorAction(action: DirectorActionCue) {
  pendingAction = action;
}

export function consumeDirectorAction() {
  const action = pendingAction;
  pendingAction = null;
  return action;
}
